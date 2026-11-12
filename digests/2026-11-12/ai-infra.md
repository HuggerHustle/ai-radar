# AI Infrastructure Digest 2026-11-12

> Generated: 2026-11-12 02:12 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# AI Infrastructure Ecosystem — Cross-Project Comparison Report
**Date:** 2026-11-12 · **Scope:** vLLM, SGLang, llama.cpp, Ollama, LiteLLM, Unsloth

---

## 1. Ecosystem Overview

The 2026-11-12 digest window shows a mature ecosystem in a *hardening and consolidation* phase rather than a feature-release phase: no project shipped a new release except Unsloth (v0.1.917-beta), and the dominant activity is correctness, regression triage, and performance tuning on already-shipped hardware. Hardware diversification is the clearest structural signal — ROCm/MI355X, gfx950, Ascend NPU, Intel XPU/SYCL, Apple MPS, and sm_120 consumer Blackwell all appear in active PRs across the stack, meaning the CUDA-only assumption is eroding. The most notable production risks are silent correctness bugs (KV-cache base mismatches, cross-tenant token leakage, sparse-NCCL weight corruption, speculative-decoding divergence on quantized targets), not crashes — a sign the stack has moved past the "does it run" phase. Two themes cross every project: (a) speculative decoding and KV-cache economics are the primary optimization battleground, and (b) multi-tenant security/isolation is emerging as a first-class engineering concern.

---

## 2. Activity Comparison

| Project | Issues updated (24h) | PRs updated/landed (24h) | Release status | Notes |
|---|---|---|---|---|
| **vLLM** | ~15+ tracked in digest; several open (e.g. #49311, #63667, #57224) | 10+ PRs referenced; no new tags | **No release** | 0 new tags; 1 closed regression (#63505); 1 open H200 crash regression |
| **SGLang** | 2 high-volume CI trackers (#42752: 198 comments; #17050: 1 broken / 4 flaky / 776 recently fixed); 2 new security bugs filed | 10+ PRs; no release | **No release** | 2 critical regressions (#48964 corruption, #49336 SM90 decode) |
| **llama.cpp** | ~10 tracked; 3 closed-stale, 1 long-lived open (#25618) | 10+ merged PRs; 2 releases (b12274, b12284) | **2 point releases** | FP8 KV-cache + CUDA OCP FP8 landed; security tightening in server |
| **Ollama** | ~5 tracked; 2 open (#18557, #19632) | 8+ PRs; no release | **No release** | Memory-accounting fixes in review; path-traversal fix (#17214) open |
| **LiteLLM** | 85 items updated; multiple open cost/auth bugs | 10+ PRs; 5 release patches | **4 patch releases** (v1.109.1, v1.108.6, v1.106.9, v1.106.8) | Release notes = cosign boilerplate only; repo restructuring in flight |
| **Unsloth** | ~8 tracked; 2 open hardware gaps (#17048, #17548) | 15+ PRs; 1 release | **v0.1.917-beta** | AMD NPU integration stack (11 PRs); Studio context-window bugs |

**Activity read:** SGLang and vLLM have the highest *issue* volume and the most regression risk; llama.cpp has the highest *merge* velocity; LiteLLM has the highest raw issue churn but is mostly correctness/accounting debt. Unsloth is the only project with a user-facing release today.

---

## 3. Model Support Race

**New model / architecture support by project:**

| Model | vLLM | SGLang | llama.cpp | Ollama | LiteLLM | Unsloth |
|---|---|---|---|---|---|---|
| Mistral Large 4 (1T-A52B) | ✅ open branch (#64534) | — | — | — | — | — |
| Qwen3.8 family (2.4T-A95B, 27B, Flash-Next) | ✅ ROCm trackers + sm_86 bug | ✅ QSA sharding, KVShard | ✅ hyper-conn MMVF tuning | ✅ Qwen3.5 parser bug | — | ✅ Qwen3.8-27B GGUF |
| GLM-5.3 / Flash | ✅ follow-up | ✅ prefill CP landed; v0.5.23 corruption | — | — | — | — |
| Kimi-K3 / K3.1 | ✅ prefill indexer work | ✅ prefill CP pending; bf16 MQA | — | — | — | — |
| DeepSeek-V4 / V4.1 | ✅ MTP on MI325X | ✅ Paged experts disk tier | — | — | — | — |
| Nemotron 3.5 ASR | ✅ feature request | — | — | — | — | — |
| MiniMax-H3-Image | — | — | — | — | — | ✅ fix in progress |
| DiffusionGemma | — | — | — | — | — | ✅ GGUF load |
| Kromoss / MOSS-Image | — | — | — | — | — | ❌ unsupported |
| Magistral (Mistral reasoning) | — | — | — | — | ✅ native reasoning levels | — |

**Who's ahead:** **vLLM** leads on frontier model coverage (Mistral Large 4, DeepSeek V4, Qwen3.8 2.4T, Nemotron 3.5 ASR) — it is the canonical first-adopter engine for large MoE checkpoints. **SGLang** leads on *architecture-specific* serving paths (GLM-5.3-Flash, Kimi-K3.1, DSA indexer, Qwen3.8 hybrid) and on hardware-specific model enablement (Ascend, Apple MPS, SM12x). **Unsloth** is the only project covering the *generative-media* stack (MiniMax-H3-Image, DiffusionGemma, FLUX) and the only one shipping Qwen3.8-27B as a ready-to-run GGUF. **llama.cpp** is not a model-coverage race participant — it is a *backend* race participant (FP8 KV, OCP FP8, WebGPU ops). **LiteLLM** is a provider-layer race (Mistral Magistral reasoning), not a model-support race.

---

## 4. Performance Frontier

**Where optimization effort is concentrated today:**

| Area | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **KV cache** | Extensible sizing; TP-agnostic offload; view caching | QSA sharding, HiCache L3/L2, KVShard | **FP8 KV-cache landed**; dequant-KV with CM2 | — | — |
| **Speculative decoding** | Target-logit cutoffs; draft as single PP stage | GDN aiter verify; ReplaySSM factors | DFlash/DFlash2/DSpark refactor; MMVF few-row | **verify batching under concurrency**; metrics | — |
| **Quantization** | NVFP4 MoE; W4A8 PTX 9.4; MFU reporting | W8A8 Ascend diffusion; NVFP4 SM12x default | OCP FP8; FP8 KV | — | — |
| **Distributed serving** | PP transport contracts; sparse NCCL; PP8 TTFT floor | **Prefill context parallelism**; PD disaggregation | — | — | — |
| **Kernels** | FlashInfer autotune; Blackwell paths | ROCm Qwen3 fused QK-norm; DSA gfx950 | CUDA MMQ/MMVF; Vulkan coopmat2; Intel FA | — | — |
| **Host memory** | — | — | **Graph metadata paging**; paged experts | — | NPU RAM-aware sizing |

**Concentration:** **KV cache is the single most crowded frontier** — vLLM (sizing/offload), SGLang (sharding/HiCache), and llama.cpp (FP8 KV) all shipped or proposed KV work today. **Speculative decoding is the second** — vLLM, SGLang, llama.cpp, and Ollama all have spec-decode optimization or correctness PRs in flight, but note the llama.cpp open issue (#25618: greedy divergence on quantized targets) is a *correctness* blocker, not a perf one. **Distributed serving** is the SGLang/vLLM-only battleground (prefill CP, PD disaggregation, PP transport). **Kernel work** is split by hardware: vLLM/CUDA-Blackwell, SGLang/ROCm, llama.cpp/multi-backend. Unsloth's optimization is **host-side** (UI mount cost, NPU RAM sizing), not kernel-level.

---

## 5. Layer Positioning

| Layer | Projects | What they do | Today's signal |
|---|---|---|---|
| **Serving engine (datacenter)** | vLLM, SGLang | High-throughput GPU serving, PP/TP, disaggregation, spec decode | Frontier model coverage (vLLM), architecture-specific paths (SGLang), prefill CP (SGLang) |
| **Local / edge runtime** | llama.cpp, Ollama | Single-node/consumer inference, GGUF, multi-backend | llama.cpp = backend breadth (FP8 KV, Vulkan, SYCL); Ollama = UX + memory accounting |
| **LLM gateway** | LiteLLM | Multi-provider routing, cost, auth, MCP/A2A | Rust gateway migration, repo restructuring, cost/security correctness debt |
| **Fine-tuning / training** | Unsloth | Fine-tuning, Studio UI, GGUF export, NPU integration | AMD NPU integration, Studio context correctness, diffusion-model support |

**Layer boundaries are blurring:** vLLM and SGLang are both absorbing *local/edge* features (vLLM KV offload, SGLang Apple MPS, llama.cpp spec-decode refactor), while Ollama is absorbing *serving* features (spec decode batching, concurrency). The **gateway layer (LiteLLM) is the least stable** — it is mid-restructure and carries the most open correctness debt. **Unsloth is the only pure training-layer project** in this set, and its activity is increasingly about *deployment* (GGUF export, NPU runtime, Studio context) rather than pure training — it is drifting toward the local-runtime layer.

---

## 6. Trend Signals

**1. Silent correctness bugs are the top production risk.** Across vLLM (#63667 quadratic detokenization, #57224 CC silent corruption, #66944 sparse-NCCL weight corruption), SGLang (#40903 MLA LSE base mismatch, #48964 GLM-5.3-Flash engine corruption), and llama.cpp (#25618 spec-decode divergence), the most severe bugs are *silent* — runs "succeed" but produce wrong output. **Action:** add output-equivalence checks (cache-on vs cache-off, quantized vs bf16) to pre-deploy CI.

**2. Multi-tenant isolation is a real engineering concern.** SGLang filed two cross-tenant bugs (#49901 MCP session reuse, #49903 token leak); Ollama has a path-traversal fix (#17214) in review; llama.cpp tightened server security (#32113/#32115/#32120); LiteLLM has MCP auth bugs (#47988) and guardrail gaps (#36085, #33086). **Action:** if you run multi-tenant, audit session pools, tokenizer routing, and tool-execution boundaries.

**3. Speculative decoding is the active optimization frontier — but correctness lags.** vLLM, SGLang, llama.cpp, and Ollama all have spec-decode work today. The catch: llama.cpp's #25618 (open, 43 comments) shows greedy output diverges from vanilla on quantized targets. **Action:** validate output equivalence on quantized targets before enabling spec decode in production.

**4. Hardware diversification is real but uneven.** ROCm/MI355X (vLLM, SGLang), Ascend NPU (SGLang, Unsloth), Intel SYCL/XPU (llama.cpp, Unsloth), Apple MPS (SGLang), sm_120 consumer Blackwell (llama.cpp, SGLang) are all in flight. **But:** most are opt-in, branch-only, or have open regressions (gfx906 #31599, MI300X #17548, RX 6800 XT #18557, sm_120 #49209). **Action:** treat non-CUDA as *pre-production*; build from branch and pin.

**5. KV cache is the primary economic lever.** FP8 KV-cache (llama.cpp #28392), TP-agnostic KV offload (vLLM #61886), KV sharding (SGLang #43527/#44447), and HiCache L3/L2 (SGLang #47481) all target the same goal: more context per dollar. **Action:** factor KV portability into router/cache architecture — vLLM's "KV state portable across heterogeneous fleets" is a credible future direction.

**6. The gateway layer is in a churn window.** LiteLLM's Rust `/v1/messages` migration, repo restructuring, and 4 patch releases with no changelogs create a "hold or pin" environment. **Action:** stay on v1.106.6 if you use MCP (18–50s `tools/list` stall #50065); re-verify cost accounting after any upgrade; pin by digest if you build from source.

**7. Agentic scheduling is the next policy frontier.** SGLang's UniBoost RFC (#48519) proposes starvation-bounded scheduling with explicit wait bounds — directly addressing the current starvation of large requests in mixed-length agentic workloads. **Action:** watch for UniBoost; current policies are known to starve large requests.

**8. Fine-tuning hardware is expanding.** Unsloth's AMD NPU stack (FastFlowLM/Lemonade, 11 PRs) and ROCm 7.14/MI300X flash-attention gap (#17548) mean the training layer is moving beyond CUDA. **Action:** if you're on MI300X, budget for MATH-fallback attention backward until #17548 lands.

**9. Release hygiene is a real risk.** vLLM's H200 FP8 crash (#49311) is still open since v0.25.0; SGLang's v0.5.23 SM90 decode regression (#49336) is measurable; LiteLLM's patch releases have no changelog. **Action:** pin deliberately; verify against known regressions before upgrading; treat release notes as incomplete.

---

### Bottom line for technical decision-makers

- **Datacenter serving:** vLLM = model coverage; SGLang = architecture-specific performance + prefill CP. Both carry open regressions — pin and validate.
- **Local/edge:** llama.cpp = backend breadth + FP8; Ollama = UX + spec-decode batching. Both have open memory/security issues.
- **Gateway:** LiteLLM is in a restructure window — hold MCP upgrades, re-verify cost accounting, pin by digest.
- **Fine-tuning:** Unsloth is the only pure training-layer project; AMD NPU is pre-production; MI300X has a flash-attention gap.
- **Cross-cutting:** silent correctness bugs are the top risk; multi-tenant isolation is the emerging security concern; spec decode is the optimization frontier but correctness lags.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-12

## 1. Today's Highlights

The day's activity is dominated by hardware- and kernel-level work rather than releases: no new tags landed in the last 24h. AMD's ROCm team pushed forward its gfx950/MI355X optimization trackers for Qwen3.8 (2.4T-A95B and Flash-Next), while the NVIDIA side saw a tracking RFC to replace Marlin with Humming across architectures. Meanwhile, a cluster of KV-cache and pipeline-parallel reliability fixes (extensible KV sizing, PP transport contracts, sparse NCCL updates) are converging on `main`.

## 2. Releases & Breaking Changes

No new releases in the last 24 hours.

One config-adjacent behavior note, not yet landed: [PR #66704](https://github.com/vllm-project/vllm/pull/66704) (closed) proposed warning when `gpu_memory_utilization` withholds memory from the extensible KV cache — under extensible sizing, explicit values like `0.9` act as a hard cap and silently strand device memory. If you carry over legacy utilization values, watch this thread.

## 3. New Model & Hardware Support

- **[Model] Mistral Large 4** — [PR #64534](https://github.com/vllm-project/vllm/pull/64534): Mistral-Large-4-1T-A52B (FP8) and -NVFP4 on MRv2, sparse MLA with DSA indexer, cross-layer KV sharing, SSMax, and DFlash support. Flagged as an open working branch; generic pieces are being upstreamed separately.
- **Nemotron 3.5 ASR Streaming (0.6B)** — [Issue #47455](https://github.com/vllm-project/vllm/issues/47455): feature request for the multilingual streaming ASR model remains open.
- **NVIDIA architecture tracking** — [Issue #65560](https://github.com/vllm-project/vllm/issues/65560): RFC to replace Marlin with Humming across NVIDIA architectures (INT4/INT8 GPTQ/AWQ, FP8, MXFP8/FP6/FP4, NVFP4), citing Marlin's lack of Hopper/Blackwell-specific paths.
- **ROCm** — AMD continues building out MI355X (gfx950) and gfx942 support for Qwen3.8 and Muse Spark checkpoints (see Performance).
- **Intel XPU** — [PR #66975](https://github.com/vllm-project/vllm/pull/66975) enables Ray-based `test_comm_ops` on XPU (replacing hard-coded CUDA device handling); [PR #62309](https://github.com/vllm-project/vllm/pull/62309) (closed) adds DeepSeek-V4 adaptive verification on 8×B70.

## 4. Performance & Optimization

- **AMD Qwen3.8 2.4T-A95B on MI355X** — [Issue #57149](https://github.com/vllm-project/vllm/issues/57149) (32 comments): stacked-PR optimization plan for `amd/Qwen3.8-2.4T-A95B-Quark-MXFP4` on gfx950. Most active tracker of the day.
- **AMD Qwen3.8-Flash-Next on MI355X** — [Issue #59575](https://github.com/vllm-project/vllm/issues/59575): optimization plan for a GatedDeltaNet + QuerySparse Attention + MXFP4 MoE architecture.
- **NVFP4 MoE quantization on Blackwell** — [PR #61511](https://github.com/vllm-project/vllm/pull/61511): speeds up `scaled_fp4_experts_quant` / `silu_and_mul_scaled_fp4_experts_quant` on B200 with numerical-equivalence tests.
- **Fused BF16 ReLU2 + NVFP4 quant** — [PR #59384](https://github.com/vllm-project/vllm/pull/59384) (closed): 24–xx% improvement for Nemotron shared experts on SM10x, one fewer launch and no BF16 intermediate.
- **PTX 9.4 `ldmatrix.s8.s4` for W4A8-INT8** — [Issue #49529](https://github.com/vllm-project/vllm/issues/49529) (closed): hardware INT4→INT8 expanding load during shared-memory matrix load.
- **Attention backend view caching** — [Issue #64572](https://github.com/vllm-project/vllm/issues/64572): Triton/other eager backends re-derive K/V cache views on every call; proposal to cache them.
- **GLM-5.3 optimization** — [Issue #57406](https://github.com/vllm-project/vllm/issues/57406): follow-up work on the `glm_moe_dsa` architecture (CUDA paths).
- **Speculative decoding** — [PR #66534](https://github.com/vllm-project/vllm/pull/66534): apply top-k/top-p cutoffs as target logits load during verification; [PR #66063](https://github.com/vllm-project/vllm/pull/66063) runs draft models as a single PP stage.
- **Audio encoder bucketing** — [PR #66820](https://github.com/vllm-project/vllm/pull/66820): opt-in length bucketing so short audio clips stop paying for long-clip padding.
- **MFU metrics for quantization** — [PR #65143](https://github.com/vllm-project/vllm/pull/65143): `QuantizationConfig.get_weight_byte_size()` lets out-of-tree quantization methods report their own layouts to the MFU estimator.

## 5. Stability & Regressions

Ranked by severity:

1. **H200 FP8 CUDA-graph crash (regression)** — [Issue #49311](https://github.com/vllm-project/vllm/issues/49311): Qwen3.5 FP8 on H200 throws CUDA illegal memory access during graph capture, traced back to v0.25.0. Still open, no linked fix.
2. **Qwen3.8-27B GDN hybrid, PP=3 on sm_86** — [Issue #63505](https://github.com/vllm-project/vllm/issues/63505) (closed): illegal memory access with prefix caching, gibberish without it; regression since v0.28.0.
3. **Incremental detokenization quadratic blowup** — [Issue #63667](https://github.com/vllm-project/vllm/issues/63667): malformed UTF-8 output stalls the API server event loop and hangs `/health` on a P/D-disaggregated H200 deployment (v0.32.0). Open.
4. **Confidential Computing silent corruption** — [Issue #57224](https://github.com/vllm-project/vllm/issues/57224): V2 model runner's UVA views of pinned host memory go stale under CC, producing silent garbage output; works with `VLLM_USE_V2_MODEL_RUNNER=0`.
5. **ROCM_ATTN wrong attention on RDNA** — [Issue #62697](https://github.com/vllm-project/vllm/issues/62697): incorrect results (and possible GPU fault) for head size ≥ 96 with KV block size ≠ 16, and MHA head sizes 192/256.
6. **Sparse NCCL weight-patch corruption** — [PR #66944](https://github.com/vllm-project/vllm/pull/66944): NaN markers in unchanged `conv1d.weight` elements and double-transformed Mamba2 `A` for Qwen3.5/GatedDeltaNet/Mamba2; reproduces at TP1. Fix PR open.
7. **Sparse NCCL OOM in RL** — [PR #66375](https://github.com/vllm-project/vllm/pull/66375): workers hold every patch on GPU until the last arrives (6 bytes/changed element per rank); fix in review.
8. **FlashInfer autotune inflates KV reserve** — [PR #66197](https://github.com/vllm-project/vllm/pull #66197) (verified): startup regression from #56492 excluding the one-off autotune peak; fix ready.
9. **KDA chunked-scan buffers outside memory profiling** — [Issue #54775](https://github.com/vllm-project/vllm/issues/54775) (closed): runtime OOM at large `--max-num-batched-tokens` because buffers scale linearly with batch tokens and aren't profiled.
10. **Intel Arc B60 GPTQ device-lost** — [Issue #52203](https://github.com/vllm-project/vllm/issues/52203): all GPTQ checkpoints fail with `UR_RESULT_ERROR_DEVICE_LOST` at profile_run.
11. **DeepSeek V4 Pro MTP erratic on MI325X** — [Issue #51853](https://github.com/vllm-project/vllm/issues/51853): scattered throughput on agentic traces, attributed to untuned ROCm kernels.
12. **GLM-5.3 TP8 B200 MNNVL all-reduce failure** — [Issue #64327](https://github.com/vllm-project/vllm/issues/64327) (closed): unspecified launch failure once KV spills to host with HiSparse.

Also of note: [PR #66920](https://github.com/vllm-project/vllm/pull/66920) fixes multimodal encoder-cache identifier collisions between base and LoRA requests when `enable_tower_connector_lora` is on.

## 6. What This Means for Application Developers

- **Pin deliberately if you're on H200 + FP8**: the v0.25.0-era CUDA graph crash ([#49311](https://github.com/vllm-project/vllm/issues/49311)) is still open. If you're on a stable release, verify against this before upgrading.
- **Health-endpoint stalls are a real production risk**: the quadratic detokenization bug ([#63667](https://github.com/vllm-project/vllm/issues/63667)) hangs `/health`, which will trip Kubernetes liveness probes on malformed-output workloads. Consider defensive tokenizer handling or a lower-traffic probe path until fixed.
- **RL and post-training pipelines should track the sparse-NCCL fixes closely** — [#66944](https://github.com/vllm-project/vllm/pull/66944) and [#66375](https://github.com/vllm-project/vllm/pull/66375) address silent weight corruption and OOM in online-update flows, which are easy to miss because runs "succeed."
- **KV offloading is maturing**: TP-agnostic KV offloading ([#61886](https://github.com/vllm-project/vllm/issues/61886)) and the event-path refactor ([#49413](https://github.com/vllm-project/vllm/issues/49413)) point toward a future where KV state is portable across heterogeneous engine fleets — worth factoring into router/cache architecture planning.
- **Frontend priority headers**: [PR #67008](https://github.com/vllm-project/vllm/pull/67008) fixes `X-Vllm-Priority` being ignored in scale-out render/generate paths — relevant if you rely on per-request scheduling priority.
- **Quantized MFU reporting**: if you operate custom quantization methods and monitor MFU/MBU, [PR #65143](https://github.com/vllm-project/vllm/pull/65143) will let you feed accurate weight-byte counts into the estimator.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-12

## 1. Today's Highlights

No new releases landed in the last 24h, but issue and PR activity is heavy: **CI stability remains the dominant theme** (the flaky-test tracker #42752 hit 198 comments, and the CI tracker #17050 reports 1 broken / 4 flaky / 776 recently fixed tests). On the engineering side, work continues on **prefill context parallelism (#21788)**, **dLLM serving (#39499)**, **KV cache sharding / HiCache offload** across NPU, Mooncake and Ascend backends, and a cluster of **AMD/ROCm and Apple MPS kernel and model-enablement PRs**. Two new security-relevant bugs were filed in the multi-tenant MCP/tokenizer path (#49901, #49903).

## 2. Releases & Breaking Changes

No new releases in the last 24h.

Config/behavior notes worth tracking (not yet breaking changes, but flag them):

- **`skip_detokenize` added per-request** to the Rust `GenerateRequest` path — lets native HTTP/gRPC clients bypass output detokenization. [#49297](https://github.com/sgl-project/sglang/pull/49297)
- **XGrammar bumped to 0.2.9 with Lark grammar support** — pins the stable release and wires `compile_lark` into the existing grammar API. [#39380](https://github.com/sgl-project/sglang/pull/39380)
- **`/v1/responses` error semantics differ from `/v1/chat/completions`**: streaming returns HTTP 200 + `response.failed` on context-length-exceeded, while chat completions returns HTTP 400. Behavior discrepancy is being tracked. [#48557](https://github.com/sgl-project/sglang/issues/48557)
- **GLM-5.3-Flash on v0.5.23 can corrupt engine state after a 1M-token request** (details in §5). If you are pinned to v0.5.23, treat as an operational caution. [#48964](https://github.com/sgl-project/sglang/issues/48964)

## 3. New Model & Hardware Support

- **Ascend NPU (diffusion):** online W8A8 INT8 quantization for FP16/BF16 diffusion transformers — serve original checkpoints without offline calibration. [#44738](https://github.com/sgl-project/sglang/pull/44738)
- **Ascend DSA:** native LIM + CopySFA KV offload as an opt-in path with bounded memory accounting and split host KV for disaggregated decode. [#47383](https://github.com/sgl-project/sglang/pull/47383)
- **Apple Silicon (MPS):** Unlimited-OCR v2 warmup at startup and KV pool sizing from the window budget. [#48932](https://github.com/sgl-project/sglang/pull/48932)
- **SM12x (RTX 50xx / RTX PRO Blackwell):** proposal to make **FlashInfer cuTile NVFP4 MoE** the default runner. [#49123](https://github.com/sgl-project/sglang/issues/49123)
- **External model integration:** public attention-layer lookup and FA kernel hooks for models defined outside SGLang (e.g. TorchTitan RL generators). [#49681](https://github.com/sgl-project/sglang/pull/49681)
- **KV cache sharding:** QSA cache sharding for Qwen3.8 hybrid models ([#43527](https://github.com/sgl-project/sglang/pull/43527)) and KVShard for Qwen3.8-Flash-Next with Mooncake ([#44447](https://github.com/sgl-project/sglang/pull/44447)).
- **Quantization interop:** GLM-4.7-Flash compressed-tensors W4A16 loading bug (packed layer lacks `kv_b_proj.weight`) was closed — check your loader version if you hit it. [#49369](https://github.com/sgl-project/sglang/issues/49369)

## 4. Performance & Optimization

- **Prefill Context Parallelism roadmap (Q4)** continues: FlashInfer backend ([#33226](https://github.com/sgl-project/sglang/issues/33226)) and Kimi-K3 ([#38344](https://github.com/sgl-project/sglang/issues/38344)) still pending; Trtllm MHA backend and Qwen3.8-Flash-Next / GLM5.3-Flash already landed. [#21788](https://github.com/sgl-project/sglang/issues/21788)
- **dLLM serving roadmap** progresses on block-diffusion serving; crash/wrong-result fixes take priority over new features. [#39499](https://github.com/sgl-project/sglang/issues/39499)
- **AMD/ROCm:**
  - GDN aiter backend for linear-chain target verify (MTP/nextn verify path) — Triton-only today. [#48118](https://github.com/sgl-project/sglang/pull/48118)
  - Qwen3 prefill QK-norm + RoPE fused JIT kernel (five launches/layer → one). [#47052](https://github.com/sgl-project/sglang/pull/47052)
  - DSA gfx950 fused indexer logits + top-k for MTP verify rows. [#47276](https://github.com/sgl-project/sglang/pull/47276)
- **DSA prefill indexer:** bf16 MQA logits replacing the fp8 MQA path on long cached contexts (Kimi-K3.1 prefill forward). [#49102](https://github.com/sgl-project/sglang/pull/49102)
- **Paged experts disk tier:** allows MoE models whose experts exceed host RAM (e.g. DeepSeek-V4-class) to start. [#49195](https://github.com/sgl-project/sglang/pull/49195)
- **GDN window-sized ReplaySSM factors** for direct spec decode (draft, based on merged #46185). [#49991](https://github.com/sgl-project/sglang/pull/49991)
- **Scheduler policy RFC:** UniBoost, a starvation-bounded scheduling policy with an explicit wait bound for overloaded agentic workloads. [#48519](https://github.com/sgl-project/sglang/issues/48519)
- **Rust server stack follow-ups** from #48815 (non-blocking perf items). [#49055](https://github.com/sgl-project/sglang/issues/49055)

## 5. Stability & Regressions (ranked by severity)

1. **Engine state corruption after 1M-token request — GLM-5.3-Flash v0.5.23.** MTP accept rate drops to 0.00 and all subsequent requests degenerate; v0.5.22 is clean. TP=4 on 4×H100, w4afp8. **Severity: critical (silent correctness + full instance impact).** No fix PR referenced. [#48964](https://github.com/sgl-project/sglang/issues/48964)
2. **SM90 decode regression v0.5.22 → v0.5.23.** +33–45% per-step decode time at concurrency 12 across 8K–64K on DeepSeek-V4.1-Flash with DSPARK; `use_deep_select_decode` also costs acceptance on Hopper. **Severity: high (regression across all tested context lengths).** [#49336](https://github.com/sgl-project/sglang/issues/49336)
3. **Cross-client token leak in multi-tokenizer mode via duplicate-rid state merging.** Cross-tenant correctness/security issue. **Severity: high (data isolation).** [#49903](https://github.com/sgl-project/sglang/issues/49903)
4. **Cross-tenant MCP session reuse via incomplete connection-pool keys.** Same severity class as above; same reporter. [#49901](https://github.com/sgl-project/sglang/issues/49901)
5. **DeepSeek MLA chunked-prefix prefill LSE base mismatch (base-2 vs natural-log in `merge_state_v2`).** Silent accuracy loss on every prefix-cache hit. **Severity: high (correctness, silent, and only on cache hits — easy to miss).** [#40903](https://github.com/sgl-project/sglang/issues/40903)
6. **HiCache + Mooncake L2/L3 capacity pressure causes reproducible cache hit-rate dip** (87.4% → sharp drop after 8 rounds in multi-turn bench). **Severity: medium (perf).** [#47481](https://github.com/sgl-project/sglang/issues/47481)
7. **rust-server `/generate` missing BOS when tokenizer relies on `add_bos_token`.** Affects Rust code path via tokenizer behavior. [#49519](https://github.com/sgl-project/sglang/issues/49519)
8. **sm_120 consumer Blackwell fails out-of-the-box with CUDA 13 wheel install.** [#49209](https://github.com/sgl-project/sglang/issues/49209)
9. **Qwen4-Exp PLE:** BF16 n-gram shards cast to FP8 with unit scale when `ple_embedding_dtype: float8_e4m3fn` is set (Qwen3.8-Flash-Next-NVFP4). [#49493](https://github.com/sgl-project/sglang/issues/49493)
10. **Diffusion `/v1/images/edits` silently ignores uploaded mask** ([#43409](https://github.com/sgl-project/sglang/issues/43409), closed); **quantized DFlash2 draft silently yields ~0% acceptance** ([#39087](https://github.com/sgl-project/sglang/issues/39087), closed); **`--moe-runner-backend deep_gemm` accepted then fails in CUDA graph capture on sm_121** ([#39226](https://github.com/sgl-project/sglang/issues/39226), closed).

Also tracked: **CI flakiness/CI infrastructure failures** ([#42752](https://github.com/sgl-project/sglang/issues/42752), 198 comments; [#17050](https://github.com/sgl-project/sglang/issues/17050)), **diffusion perf checks depend on runner placement** ([#48311](https://github.com/sgl-project/sglang/issues/48311)), **PD disaggregation protocol unification** ([#34510](https://github.com/sgl-project/sglang/issues/34510)), **PP + HiCache consistency for disaggregated prefill** ([#22607](https://github.com/sgl-project/sglang/issues/22607), closed), **PP x spec decoding convergence** ([#39634](https://github.com/sgl-project/sglang/issues/39634)), **import-time reduction** ([#10492](https://github.com/sgl-project/sglang/issues/10492)), **HiCache L3 KV event RFC** ([#29709](https://github.com/sgl-project/sglang/issues/29709)), and **PP8 disaggregated prefill ~30s TTFT floor on Kimi-K3** ([#34815](https://github.com/sgl-project/sglang/issues/34815), closed/inactive).

## 6. What This Means for Application Developers

- **Do not blindly move to v0.5.23 for Hopper (SM90) + spec decoding workloads.** The decode regression (#49336) is measurable and reproducible; pin v0.5.22 until a fix lands or validate on your exact model/context mix.
- **If you use 1M-token requests on GLM-5.3-Flash (MTP + EAGLE), isolate that instance.** The v0.5.23 corruption (#48964) is not recoverable per-request; it degrades the whole engine state.
- **Multi-tenant deployments: audit your MCP session pool and multi-tokenizer routing.** #49901 and #49903 are isolation bugs, not mere perf issues — they can cross tenant boundaries.
- **Prefix caching is a correctness surface, not just a latency feature.** The MLA LSE base mismatch (#40903) only triggers on prefix-cache hits, so benchmarks without cache reuse won't show it. If you do long-prefix agentic workloads with DeepSeek models, validate outputs against a cache-disabled run.
- **Watch the agentic scheduler RFC (#48519).** If you run overloaded, mixed-length agentic workloads, UniBoost's explicit wait bound is worth testing once available — current policies can starve large requests.
- **Hardware diversity is improving fast:** NPU (Ascend) diffusion quantization and KV offload, Apple MPS OCR warmup, ROCm GDN and Qwen3 prefill kernels, and SM12x NVFP4 MoE defaults are all in flight. If you're evaluating non-CUDA or Blackwell-consumer deployment, most of these are opt-in or draft-stage today — expect to build from a branch.
- **Rust server stack is maturing:** new `skip_detokenize` and gRPC/HTTP paths are being hardened, but #49519 (missing BOS) and #49055 (perf follow-ups) suggest the Rust path still needs per-deployment validation against the Python server.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-12

## 1. Today's Highlights

A busy merge window: **FP8 KV-cache support landed** (#28392), opening the door to half-precision KV memory on supported hardware, while **CUDA gained OCP FP8 model support** (#28413) and a new few-row MMQ path (#31959). On the Vulkan side, **dequantized KV optimization is now permitted with coopmat2** (#31526). Meanwhile the server team is tightening security around tool execution, CORS proxying, and local address access (#32113, #32115, #32120).

## 2. Releases & Breaking Changes

- **b12284 — CUDA: OCP FP8 support** ([#28413](https://github.com/ggml-org/llama.cpp/pull/28413)): Adds FP8 GEMV/GEMV-style paths (W8A16 for GEMV) with intrinsics. Users with OCP-compliant FP8 models (e.g. NVFP4-adjacent layouts) gain native acceleration but should validate numerics on their workloads.
- **b12274 — FP8 KV-cache** ([#28392](https://github.com/ggml-org/llama.cpp/pull/28392)): Introduces scaled FP8 KV cache with scale normalization independent of projection layout. This changes how cache scale names are derived — **any downstream tooling parsing KV-cache scale metadata should be re-checked**. New tests added in `test-backend-ops`.
- **Server tooling security tightening** ([#32113](https://github.com/ggml-org/llama.cpp/pull/32113), [#32115](https://github.com/ggml-org/llama.cpp/pull/32115), [#32119](https://github.com/ggml-org/llama.cpp/pull/32119), [#32120](https://github.com/ggml-org/llama.cpp/pull/32120)): Enabling tools/MCP with a non-loopback `--host` and no API key now errors unless `--allow-unauthenticated-tools` is passed. CORS proxy and media URL fetching will no longer reach local addresses. Browser access to child router instances is blocked. **Deployment scripts binding to non-loopback with tools enabled will break and must opt in explicitly.**
- **`mtmd` API rename to `mtmd_format`** ([#32040](https://github.com/ggml-org/llama.cpp/pull/32040)): Fixes a string-format issue but renames the symbol; downstream integrations calling `mtmd_format` indirectly should verify linkage.

## 3. New Model & Hardware Support

- **WebGPU: `PAD_REFLECT_1D`** ([#31877](https://github.com/ggml-org/llama.cpp/pull/31877)) — required by several TTS/waveform decoders; part of a broader push to make WebGPU a viable deployment target for audio models. Related: `COL2IM_1D` under review ([#31708](https://github.com/ggml-org/llama.cpp/pull/31708)).
- **CUDA OCP FP8** ([#28413](https://github.com/ggml-org/llama.cpp/pull/28413)) — FP8 weight support on NVIDIA hardware.
- **FP8 KV-cache** ([#28392](https://github.com/ggml-org/llama.cpp/pull/28392)) — reduces KV memory footprint for long-context workloads; verify scale calibration on your model family.
- **SYCL: strided CLAMP fix** ([#31784](https://github.com/ggml-org/llama.cpp/pull/31784)) — makes the SYCL CLAMP op correct on non-contiguous views; important for any model using strided tensors on Intel GPUs.
- **Vulkan: device fault vendor binary buffer allocation** ([#32008](https://github.com/ggml-org/llama.cpp/pull/32008)) — groundwork for better Vulkan crash diagnostics.
- **OpenCL: decomposed FA for Adreno** ([#32046](https://github.com/ggml-org/llama.cpp/pull/32046), closed) — alternate FA path for mobile Adreno where fused FA is resource-starved.
- **Spec-decode refactor: DFlash / DFlash2 / DSpark / Lilicorr** ([#32016](https://github.com/ggml-org/llama.cpp/pull/32016)) — consolidating speculative decoding variants under a shared DFlash backbone with pluggable heads.

## 4. Performance & Optimization

- **CUDA few-row MMQ for BS 2–24** ([#31533](https://github.com/ggml-org/llama.cpp/pull/31533)) — new kernel targeting speculative decoding (draft of 7 tokens → 8 columns) and small-batch workloads where existing MMVQ/MMQ kernels leave SMs idle.
- **CUDA: MMVF for BF16 few-row matrices** ([#31959](https://github.com/ggml-org/llama.cpp/pull/31959)) — MMF tiles 32 rows/block; for matrices like Qwen hyper-connection projections (320 rows, K=10240) at batch 2+, this reduces wasted blocks. Relevant for MoE and Qwen-family inference.
- **Vulkan: dequantized KV with CM2** ([#31526](https://github.com/ggml-org/llama.cpp/pull/31526)) — heuristic based on query-tokens × GQA ratio enables the KV dequantization optimization under coopmat2.
- **llama: avoid touching unused graph metadata pages** ([#32043](https://github.com/ggml-org/llama.cpp/pull/32043)) — reported substantial host memory savings on Windows RTX 5090 and Linux RTX PRO 6000 with MTP-7 + Qwen3.8-27B Q4_K_M, ubatch 2048, ctx 65536.
- **Sampling: single synchronization for context outputs** ([#30196](https://github.com/ggml-org/llama.cpp/pull/30196)) — reduces repeated syncs during sampling/spec decode across draft-simple, EAGLE3, MTP, DFlash, DSpark.
- **Vulkan: Intel prefill FA kernel** ([#29357](https://github.com/ggml-org/llama.cpp/pull/29357)) — in progress, targeting Intel prefill FA throughput.

## 5. Stability & Regressions

Ranked by severity:

1. **Speculative decoding diverges on quantized targets** — [#25618](https://github.com/ggml-org/llama.cpp/issues/25618) (OPEN, 43 comments, 👍3). Greedy output differs from vanilla on Q4_K_M targets with draft-mtp/draft-dspark; matches on bf16. **Long-lived, high-traffic issue — no fix PR in the last 24h.** Avoid spec decode on quantized targets where exact equality is required.
2. **Vulkan `MUL_MAT_ID` loses rows for duplicate expert IDs** — [#29821](https://github.com/ggml-org/llama.cpp/issues/29821). Triggered when the same expert ID appears more than once in a token's row and `n > 8`; expert-routing MoE correctness bug. **OPEN, no fix PR seen.**
3. **CUDA illegal memory access with Gemma 4 31B + draft-mtp after KV rollback** — [#31077](https://github.com/ggml-org/llama.cpp/issues/31077) (CLOSED). Crash on checkpoint restore/full reprocess; apparently addressed but worth verifying on your build.
4. **HIP/gfx906 MoE prompt processing 15–50% slower since #29948** — [#31599](https://github.com/ggml-org/llama.cpp/issues/31599). Performance regression on AMD MI50-class hardware. **OPEN.**
5. **gfx1201 FA dispatch threshold too low → ~20% spec-decode regression since #28102** — [#28867](https://github.com/ggml-org/llama.cpp/issues/28867). WMMA head-size-256 threshold tuning needed on RDNA4.
6. **HIP/ROCm fused GDN state leakage across requests** — [#29092](https://github.com/ggml-org/llama.cpp/issues/29092) (CLOSED, stale tag). Earlier prompts emitted verbatim in later completions on reused server slots with Qwen3.5/MoE. Marked closed — confirm on current master.
7. **CPU FA on ARM overflows to inf (F16 accumulation)** — [#31734](https://github.com/ggml-org/llama.cpp/issues/31734) (CLOSED). Relevant for Apple Silicon and ARM servers running non-SVE paths.
8. **JSON-schema `enum` DoS in grammar construction** — [#29457](https://github.com/ggml-org/llama.cpp/issues/29457) (CLOSED, stale). A single request with a large enum could pin a core for tens of seconds. **If you accept untrusted structured-output requests, validate schema size.**
9. **`repeat_last_n` / `dry_penalty_last_n` unbounded → server OOM** — [#29494](https://github.com/ggml-org/llama.cpp/issues/29494) (CLOSED, stale). Multi-GB allocation from a single request. **Clamp these on the server side or upgrade.**
10. **libllama crash: `ggml_backend_sched_alloc_splits` unexpected graph reallocation** — [#28753](https://github.com/ggml-org/llama.cpp/issues/28753) (OPEN, Intel Arc + Level Zero). Still open.

## 6. What This Means for Application Developers

- **FP8 becomes viable end-to-end.** With both FP8 KV-cache and OCP FP8 weights landing on CUDA in the same window, you can now meaningfully trade precision for context length and throughput on Hopper/Blackwell-class hardware. Benchmark quality-sensitive workloads before shipping — quantized-target spec decode (#25618) remains numerically unreliable.
- **Treat the server as untrusted-input-facing.** The batch of security PRs (#32113, #32115, #32119, #32120) fixes real attack surface: localhost SSRF via media URLs and CORS proxy, browser-to-child-instance port scanning, and authenticated tool exposure. **If you expose llama-server beyond loopback, audit your flags before upgrading — some previously-working configs will now refuse to start.**
- **Speculative decoding is the active optimization frontier.** MMVF/MMQ few-row kernels (#31959, #31533), DFlash refactoring (#32016), and sampling sync reduction (#30196) all target the spec-decode path. If you run draft-based decoding, expect meaningful wins over the next few releases — but pin versions and validate output equivalence on your quantized target models.
- **Host memory pressure is being addressed.** #32043's lazy graph metadata allocation is a real win for long-context MTP serving on constrained hosts. Useful if you currently cap `--ctx-size` for memory rather than model reasons.
- **MoE correctness needs scrutiny on Vulkan and HIP.** #29821 (duplicate expert IDs) and #31599 (gfx906 regression) suggest MoE paths are less battle-tested on non-CUDA backends. If you serve MoE models on Vulkan or older ROCm, build synthetic routing tests into your pre-deploy checklist.
- **Server UI is being productized.** The UI is being split into a design-system library (`Llama UI`) and app (`Llama Chat`), with optional server-side conversation storage ([#31361](https://github.com/ggml-org/llama.cpp/pull/31361), closed) and project-scoped context ([#32031](https://github.com/ggml-org/llama.cpp/pull/32031), closed). Not yet a stable API surface — don't depend on it, but expect the built-in web experience to become a more credible lightweight console for local deployments.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-12

## 1. Today's Highlights

No new releases in the last 24 hours, but PR activity is heavy. The most consequential work-in-progress is a pair of memory-accounting fixes ([#17857](https://github.com/ollama/ollama/pull/17857), [#19632](https://github.com/ollama/ollama/pull/19632)) addressing incorrect VRAM reporting and GPU splitting that have caused spurious model evictions. Separately, spec decoding is getting both correctness of multi-request batching ([#19663](https://github.com/ollama/ollama/pull/19663)) and observability ([#19368](https://github.com/ollama/ollama/pull/19368)). On the stability front, a Vulkan access violation on AMD RX 6800 XT ([#18557](https://github.com/ollama/ollama/issues/18557)) remains open without a fix PR.

## 2. Releases & Breaking Changes

No releases in the last 24h.

Two behavior-change PRs worth tracking:

- **`launch`: share ChatGPT model configuration with the Ollama app** ([#19658](https://github.com/ollama/ollama/pull/19658), closed) — `ollama launch chatgpt` no longer overwrites the Ollama app's model list; `--model` now only changes the starting model.
- **`launch`: preserve Claude Desktop settings during restore** ([#19656](https://github.com/ollama/ollama/pull/19656), closed) — restore now only reverts fields Ollama itself wrote, so repeated connect/disconnect cycles won't clobber user edits.
- **Claude Desktop gateway on existing listener** ([#19657](https://github.com/ollama/ollama/pull/19657)) — exposes `/api/claude` on the normal listener while keeping the legacy app-owned listener for compatibility. Config published at `~/.ollama/claude-desktop-routing.json`.

## 3. New Model & Hardware Support

- **Legacy GGUF migration & llama.cpp patch removal** ([#18882](https://github.com/ollama/ollama/pull/18882)) — removes private compatibility patches, migrates legacy GGUFs on load with atomic manifest replacement and startup GC of unreferenced blobs. Includes upstream System One support. This is the largest structural change in flight.
- **Windows iGPU (AMD Strix Halo)** ([#19636](https://github.com/ollama/ollama/pull/19636)) — fixes failure to load models larger than ~half of system RAM on ROCm0 by keeping weights out of pinned host memory.
- **macOS/MLX mimo-v2.6** — tool-call parsing regression reported ([#19650](https://github.com/ollama/ollama/issues/19650)); the `qwen3.5` parser emits `arguments: {}` when the model writes JSON inline inside `<function=...>` instead of `<parameter=...>` blocks.

## 4. Performance & Optimization

- **Speculative verification batching** ([#19663](https://github.com/ollama/ollama/pull/19663)) — keeps drafting active when multiple requests overlap; previously drafting was disabled on concurrency, so MTP/DFlash/DFlash2 speedups were lost under load.
- **Speculative decoding metrics** ([#19368](https://github.com/ollama/ollama/pull/19368)) — API responses and `ollama run --verbose` now report drafted/accepted tokens and acceptance rate, rather than a single misleading acceptance figure.
- **Embed HTTP connection reuse** ([#18397](https://github.com/ollama/ollama/pull/18397)) — removes `DisableKeepAlives: true` from the llama-server HTTP client; under sustained `/api/embed`, this eliminates a `GET /health` + new TCP connection per input.
- **GPU discovery timeout** ([#19659](https://github.com/ollama/ollama/pull/19659)) — new timeout on GPU discovery (small but operationally relevant on flaky drivers).

## 5. Stability & Regressions

Ranked by severity:

1. **[OPEN] Vulkan access violation on AMD RX 6800 XT** ([#18557](https://github.com/ollama/ollama/issues/18557)) — `0xc0000005` on any model load (dense 7B and hybrid SSM+transformer 27B). Likely same root cause as #18494. **No fix PR referenced.** CPU path unaffected.
2. **[OPEN] VRAM accounting / GPU splitting** ([#19632](https://github.com/ollama/ollama/pull/19632), [#17857](https://github.com/ollama/ollama/pull/17857)) — misreported VRAM (e.g. 30B dflash shown as ~2.3 GB) leading to incorrect evictions and unnecessary multi-GPU spread. Fixes in review.
3. **[CLOSED] AMD Radeon 780M Vulkan regression** ([#17748](https://github.com/ollama/ollama/issues/17748)) — `radv/amdgpu: Not enough memory for command submission` / `ErrorDeviceLost` on ≥0.32.10. Closed.
4. **[OPEN] macOS app update loop** ([#19472](https://github.com/ollama/ollama/issues/19472)) — offers "Restart to update" for the already-installed 0.40.13 and requests admin to chown `/Applications/Ollama.app`.
5. **[OPEN] Path traversal in `x/transfer`** ([#17214](https://github.com/ollama/ollama/pull/17214)) — attacker-controlled manifest digests could escape the blob directory on the fast download path. Fix PR validates digest format against `^sha256[:-][0-9a-f]{64}$`. **Security-relevant; recommend tracking for merge.**
6. **[OPEN] Windows console flashing during GPU discovery** ([#19080](https://github.com/ollama/ollama/pull/19080)) — missing `CREATE_NO_WINDOW`, cosmetic.
7. **[CLOSED] `-v`/`--version` printing warnings** ([#19613](https://github.com/ollama/ollama/issues/19613)) — spurious "could not connect to a running Ollama instance" on `--version`. Closed.

## 6. What This Means for Application Developers

- **Concurrency + spec decoding is about to get better.** If you run Ollama behind a queue with several parallel generations, PR #19663 restores drafting under load — expect meaningful TPS gains on MTP/DFlash models without client-side changes. Pair it with #19368 to instrument acceptance rate per request in your own telemetry.
- **VRAM reporting will change.** If you build autoscaling or model-routing logic on `ollama ps` output, re-baseline after #19632/#17857 land — the current numbers undercount multi-model and speculative setups.
- **`ollama launch` integrations are stabilizing.** ChatGPT and Claude Desktop launchers now share configuration with the app rather than clobbering user settings — safer to recommend to end users.
- **Migration warning:** PR #18882 removes legacy GGUF compatibility patches. If you pin specific GGUF artifacts from the registry, verify your manifests convert cleanly once this ships; the load path now performs atomic manifest replacement and startup GC.
- **Security:** track [#17214](https://github.com/ollama/ollama/pull/17214). If you operate Ollama in a multi-tenant or registry-mirror context, the current `x/transfer` path lacks digest validation that the legacy path enforces.
- **AMD Vulkan users:** RX 6800 XT remains broken with no fix; if you're on 780M, the regression is resolved — upgrade past 0.32.10 only after confirming your specific SKU isn't hitting the open 6800 XT issue.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-12

## 1. Today's Highlights

A large-scale repo restructuring effort is underway, with five open PRs (all authored by `yassin-berriai`) relocating `scripts/`, `enterprise/`, `ui/`, `docs/`, `docker/`, `helm/`, and `migrations/` under the `litellm/` tree — plus a CI guard (PR #51007) that fails any checkout with more than 14 root entries. Meanwhile, the team continues pushing `/v1/messages` traffic onto the Rust gateway (`BEDROCK_INVOKE` and Vertex AI Claude targets, PRs #51330 / #51294), and four patch releases landed (`v1.109.1`, `v1.108.6`, `v1.106.9`, `v1.106.8`) — all cosign-signed, though release notes contain no functional changelog. Issue tracker activity is heavy (85 items updated), dominated by cost-tracking correctness bugs, streaming translation regressions, and MCP/A2A auth behavior.

## 2. Releases & Breaking Changes

- **v1.109.1, v1.108.6, v1.106.9, v1.106.8** released. All notes are identical boilerplate about **cosign Docker image signature verification** (key introduced in commit `e82a3c6`), with no changelog body in the provided data — treat these as patch releases, but check the full GitHub release notes before upgrading in production. ([releases](https://github.com/BerriAI/litellm/releases))
- **Repo layout change incoming (breaking for tooling, not runtime):** PRs [#51006](https://github.com/BerriAI/litellm/pull/51006), [#51000](https://github.com/BerriAI/litellm/pull/51000), [#50966](https://github.com/BerriAI/litellm/pull/50966), [#50992](https://github.com/BerriAI/litellm/pull/50992), [#50981](https://github.com/BerriAI/litellm/pull/50981) move package dirs under `litellm/`. If you build from source, vendor the tree, or maintain internal forks with hardcoded root-relative paths, expect breakage. [#51007](https://github.com/BerriAI/litellm/pull/51007) enforces the new root discipline in CI.
- **`/v1/messages` Rust-only migration:** Bedrock `InvokeModel` ([#51330](https://github.com/BerriAI/litellm/pull/51330)) and Vertex AI Claude ([#51294](https://github.com/BerriAI/litellm/pull/51294)) move to Rust-only paths. Non-Claude Bedrock models, `converse/`, and `mantle/` keep the Python path for now. Rust gateway additionally gains parity with `LITELLM_DROP_PARAMS`, per-request `drop_params`, and config-level drop/summary/timeout settings on `/v1/messages` ([#51236](https://github.com/BerriAI/litellm/pull/51236)) — a config that worked on Python previously returned 400 or hung on the Rust path.
- **`/model/update` partial-PATCH semantics** silently dropped extra-only `litellm_params` (e.g. `drop_params`) — closed as stale ([#35842](https://github.com/BerriAI/litellm/issues/35842)); verify behavior on your version if you rely on PATCH merging.

## 3. New Model & Hardware Support

- **Mistral Magistral reasoning:** two PRs land/adjust native reasoning levels — [#51329](https://github.com/BerriAI/litellm/pull/51329) sends Magistral reasoning as supported native levels with strict validation; [#51004](https://github.com/BerriAI/litellm/pull/51004) (closed) fixes the prior bug where reasoning settings were dropped and replaced with an old system prompt. Net effect: streamed Magistral responses now surface reasoning content and "reasoning off" actually works.
- **Vertex AI Claude via `/v1/messages`** now served on the Rust gateway ([#51294](https://github.com/BerriAI/litellm/pull/51294)). No new accelerator/quantization backends (CUDA/ROCm/Metal) appear in today's data.
- **JSON-defined OpenAI-compatible providers:** a regression ([#48145](https://github.com/BerriAI/litellm/issues/48145), open) causes tools definitions to be dropped by default when the model isn't in the catalog — relevant if you front self-hosted or niche OpenAI-compatible endpoints.

## 4. Performance & Optimization

- **MCP `tools/list` latency regression:** upgrading v1.106.6 → v1.108.0 introduced **18–50 s blocks** on `tools/list` through `/mcp/` for clients sending `notifications/initialized` with a pre-2026 protocol version (e.g. Python `mcp` SDK `ClientSession`, used by Open WebUI) — issue [#50065](https://github.com/BerriAI/litellm/issues/50065), open, no linked fix PR in this data. This is the most concrete performance number today and it is a regression, not an improvement.
- **Langfuse OTEL logging overhead/log leakage:** spans were printed to stdout when no keys or OTEL exporter were configured; [#51331](https://github.com/BerriAI/litellm/pull/51331) discards them instead, removing per-request prompt/response spill into container logs.
- **Router retry back-off:** requests pinned to a single deployment by a pre-call check retried instantly, burning all retries on deployments already rejected for that request; [#41261](https://github.com/BerriAI/litellm/pull/41261) honors the advertised back-off.

## 5. Stability & Regressions

Ranked by severity:

1. **Rate limiter correctness (429s below limit):** v3 rate limiter TPM counter outlives its window under upstream 429s when `LITELLM_TPM_TOKEN_RESERVATION_ENABLED=true` (default) — keys/teams rejected well below `tpm_limit`. [#49675](https://github.com/BerriAI/litellm/issues/49675), open, no fix PR listed.
2. **End-user budget bypass:** stale per-pod fallback spend after a Redis counter clean-miss (default TTL 60 s) allows budget enforcement to be bypassed. [#34238](https://github.com/BerriAI/litellm/issues/34238), open. PR [#51143](https://github.com/BerriAI/litellm/pull/51143) fixes an adjacent bug (retried budget resets losing carried end-user spend) and adds per-end-user reset-window tracking — likely worth auditing together.
3. **Spend logging dropped on reused response IDs:** self-hosted OpenAI-compatible servers that return the same completion id for every request cause all but the first spend-log row to be silently dropped. [#41273](https://github.com/BerriAI/litellm/pull/41273) re-keys rows on flush.
4. **Streaming correctness trio:**
   - Anthropic `/v1/messages` adapter mis-encodes reasoning models: `thinking_delta` streamed inside a text block plus duplicate `message_start` → **empty content** in Anthropic SDK / Claude Code. [#32357](https://github.com/BerriAI/litellm/issues/32357), open, 3 👍.
   - Streams ending without a provider `finish_reason` are stamped `finish_reason="stop"`, making truncated streams indistinguishable from completed ones. [#46542](https://github.com/BerriAI/litellm/issues/46542), open.
   - Responses bridge keeps only the last reasoning item when `stream=False` ([#43620](https://github.com/BerriAI/litellm/issues/43620), open).
5. **Cost/budgeting correctness:**
   - `response_cost` null and spend stuck at $0 when `custom_llm_provider=anthropic` but the priced row lives under a different provider. [#47675](https://github.com/BerriAI/litellm/issues/47675), **closed** (updated 11-11).
   - `cost_per_token` crashes on `None`/string token counts instead of costing zero — `TypeError` breaks spend tracking for providers omitting fields. [#39618](https://github.com/BerriAI/litellm/issues/39618), open.
   - Streamed `usage.cost` omitted when computed cost is 0, while non-streamed reports `0.0` — closed. [#43946](https://github.com/BerriAI/litellm/issues/43946).
   - Streaming `prompt_tokens` inflated vs. provider billing. [#12970](https://github.com/BerriAI/litellm/issues/12970), closed after long tail (5 👍).
6. **MCP / A2A auth:**
   - `MCPJWTSigner` overwrites a server's configured `auth_value` (bearer/token/basic), causing 401s on keyed MCP servers with `default_on: true`. [#47988](https://github.com/BerriAI/litellm/issues/47988), open, 1 👍.
   - A2A `message/send` re-discovers agent cards from well-known paths instead of registered `agent_card_params`, breaking Azure AI Foundry-style agents. [#40586](https://github.com/BerriAI/litellm/issues/40586), open.
   - OpenAPI→MCP tool generation drops request-body schema when it uses `$ref` (i.e. **every FastAPI/Pydantic spec**) — tools arrive with empty `inputSchema`. [#36765](https://github.com/BerriAI/litellm/issues/36765), open.
7. **Guardrails coverage gaps:**
   - Model-level guardrails not applied on `/v1/messages` (`anthropic_messages`) — `applied_guardrails` empty. [#36085](https://github.com/BerriAI/litellm/issues/36085), closed.
   - Bedrock guardrail hooks skip Anthropic `tool_result` content blocks → unscanned PII on live traffic. [#33086](https://github.com/BerriAI/litellm/issues/33086), closed.
8. **Config/startup:**
   - Proxy exits at startup when `TZ=Asia/Calcutta` on Ubuntu 24.04/26.04 without `tzdata-legacy`. [#49813](https://github.com/BerriAI/litellm/issues/49813), closed.
   - `os.environ/` substitution in numeric `litellm_params` (`weight`/`rpm`/`tpm`) yields `str`, crashing `simple_shuffle` with HTTP 500 on every request to that model group. [#36095](https://github.com/BerriAI/litellm/issues/36095), open.
   - Admin UI search bar renders overlapping text/icons in v1.109.0. [#51177](https://github.com/BerriAI/litellm/issues/51177), closed.
9. **Observability:** Google GenAI adapter logged "httpx_response is None" on every successful `generateContent` call and wrote no spend row; [#51306](https://github.com/BerriAI/litellm/pull/51306) fixes. Background health-check traces now carry probed deployment id/group ([#51321](https://github.com/BerriAI/litellm/pull/51321)).

## 6. What This Means for Application Developers

- **Hold on v1.108.0+ if you use MCP:** the 18–50 s `tools/list` stall (#50065) is a hard blocker for interactive agent clients like Open WebUI. Stay on v1.106.6 or pin and test, and watch for a fix before upgrading.
- **Re-verify cost/spend accounting after upgrading.** Multiple independent cost-tracking bugs (null `response_cost` crossing provider labels, crashes on `None` token counts, dropped spend rows on reused completion ids) mean billing dashboards can silently under- or over-count. If you enforce budgets, the end-user Redis fallback bypass (#34238) and the v3 TPM counter bug (#49675) both cause incorrect 429s or no 429s at all.
- **Streaming consumers must not trust `finish_reason` alone** (#46542) — truncated streams look like clean stops. Pair with your own timeout/length checks, and note that streamed `usage.cost` may be absent when cost is 0 (#43946).
- **If you build on Claude Code / Anthropic SDK via LiteLLM:** the `/v1/messages` path is the epicenter of churn right now — reasoning-model encoding bug (#32357) can produce empty content, and guardrails are not applied on this endpoint (#36085). Test thinking-mode multi-turn flows explicitly.
- **Tool-calling on OpenAI-compatible/self-hosted backends is fragile:** tools may be silently dropped for JSON-defined providers not in the catalog (#48145), and OpenAPI-derived MCP tools lose their input schema under `$ref` (#36765). Pin versions and assert tool schemas in CI.
- **If you build from source or automate against the repo layout, prepare for the restructuring now** — five moves plus a CI root-count gate are in flight. Container images remain cosign-signed; verify with the key at commit `e82a3c6` if you enforce signature policy.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-12

## 1. Today's Highlights

Unsloth shipped **v0.1.917-beta**, headlined by **Qwen3.8-27B with Dynamic v3.1 GGUFs** for local inference, plus a batch of Studio UI/UX improvements (Glass rendering, Thinking UI, HTML/PDF chat exports). The PR queue is dominated by a large, coordinated **AMD NPU (FastFlowLM/Lemonade) integration** stack (11 PRs + follow-ups, PR #17519) and a wave of **Studio context-window correctness fixes** — several bugs today trace back to the UI advertising one context length while the backend runner actually loads another. Meanwhile, **Intel SYCL support** (issue #17048) and a **ROCm 7.14 / MI300X flash-attention stride assertion** (issue #17548) remain open hardware gaps.

## 2. Releases & Breaking Changes

- **[v0.1.917-beta](https://github.com/unslothai/unsloth)** — "Dynamic v3.1 GGUFs + Performance Fixes":
  - Qwen3.8-27B now runnable locally via Dynamic v3.1 GGUFs.
  - Studio UX: smoother Glass rendering, revamped code blocks, Thinking UI, HTML/PDF chat exports, new image-generation and coding-agent features.
  - No documented API/config breakage, but note the ongoing **Docker tag confusion** (issue #17470): `unsloth-rocm:studio`-style tags do not reliably resolve to the latest release — pin by digest, not tag, if you automate pulls.

## 3. New Model & Hardware Support

- **Qwen3.8-27B** — new Dynamic v3.1 GGUF release, local-ready via Unsloth (v0.1.917-beta).
- **MiniMax-H3-Image** — download/load path being fixed; current auto-precision selection is broken on 24–48 GB GPUs (PR [#17563](https://github.com/unslothai/unsloth/pull/17563)).
- **DiffusionGemma** — GGUF load works but ignores selected context/parallelism settings (issue [#17558](https://github.com/unslothai/unsloth/issues/17558)); fix PR [#17566](https://github.com/unslothai/unsloth/pull/17566) makes the panel reflect the real runtime context.
- **FLUX.1-dev / Krea-dev single-file** — guidance embedder mishandled on local paths; fix PR [#17567](https://github.com/unslothai/unsloth/pull/17567).
- **Kromoss (MOSS-Image derivative)** — GGUF quantizations rejected as unsupported architecture (issue [#17552](https://github.com/unslothai/unsloth/issues/17552)).
- **AMD Ryzen AI NPU (FastFlowLM via Lemonade)** — large integration stack landing: power mode, prefill chunk length, image pre-resize ([#17510](https://github.com/unslothai/unsloth/pull/17510)), RAM-aware context sizing ([#17511](https://github.com/unslothai/unsloth/pull/17511)), NPU storage management ([#17535](https://github.com/unslothai/unsloth/pull/17535)), live monitor ([#17508](https://github.com/unslothai/unsloth/pull/17508)), robust 18–22 GB downloads ([#17526](https://github.com/unslothai/unsloth/pull/17526)); umbrella test branch [#17519](https://github.com/unslothai/unsloth/pull/17519).
- **Intel GPU (SYCL)** — still unsupported out of the box; no way to source `setvars.sh` before `llama-server` launch (issue [#17048](https://github.com/unslothai/unsloth/issues/17048)).

## 4. Performance & Optimization

- **Long-chat mount cost**: `main` mounts every message on every interaction, all on the web process main thread; PR [#17504](https://github.com/unslothai/unsloth/pull/17504) mounts only messages near the viewport (closed).
- **NPU context sizing**: replaces the flat 8192-token load with free-RAM-minus-2 GiB headroom, priced per token from bf16 KV on full-attention layers (PR [#17511](https://github.com/unslothai/unsloth/pull/17511)).
- **AMD NPU advanced settings**: prefill chunk length clamped to context, vision pre-resize levels 0–4 via `flm_args` (PR [#17510](https://github.com/unslothai/unsloth/pull/17510)).
- **Intel SYCL**: building llama.cpp with SYCL reportedly gives substantial throughput gains on Intel GPUs — blocked on env-var plumbing (issue [#17048](https://github.com/unslothai/unsloth/issues/17048)).

## 5. Stability & Regressions

Ranked by severity:

1. **ROCm 7.14 / MI300X (gfx942)**: stride assertion in `_scaled_dot_product_flash_attention_backward`; MATH fallback required, i.e. no flash-attention backward. No fix PR yet. (issue [#17548](https://github.com/unslothai/unsloth/issues/17548))
2. **MiniMax-H3-Image downloads**: 24–40 GB GPUs pull 135 GB then OOM; 48 GB auto-picks bf16 DiT and OOMs; FP8/INT8 always refused. Fix PR [#17563](https://github.com/unslothai/unsloth/pull/17563); related import race PR [#17569](https://github.com/unslothai/unsloth/pull/17569).
3. **Studio context-window lies**: DiffusionGemma runs 4096 while UI shows 24576 ([#17558](https://github.com/unslothai/unsloth/issues/17558), fix [#17566](https://github.com/unslothai/unsloth/pull/17566)); Deep Research and long tool results sized to 32k/16k budgets regardless of served window → hard request failures on `-c 4096`/`-c 8192` servers ([#17554](https://github.com/unslothai/unsloth/pull/17554), [#17553](https://github.com/unslothai/unsloth/pull/17553)).
4. **Cross-chat settings bleed**: a send waiting on model load executes with whichever chat you switched to (permission mode, system prompt, sampling, RAG). Fix PR [#17565](https://github.com/unslothai/unsloth/pull/17565).
5. **CPU pipeline-parallel MoE correctness**: router aux loss diverges from single-process once gradient accumulation > 1, reproduced by the repo's own parity test (issue [#17054](https://github.com/unslothai/unsloth/issues/17054), closed).
6. **Python file-deletion approval bypass**: `os.remove` via `map`/`functools.partial`/`Thread`/`executor.submit` skips the Allow/Deny card in "Approve for me" mode. Fix PR [#17541](https://github.com/unslothai/unsloth/pull/17541).
7. **Chat import fragility**: legacy `function_call`/`role: "function"` turns dropped ([#17153](https://github.com/unslothai/unsloth/pull/17153)); one malformed session file aborts the whole import ([#17550](https://github.com/unslothai/unsloth/pull/17550)).
8. **Reverse-proxy support**: 404 on `X-Forwarded-Host` with external hostname breaks Cloudflare Named Tunnel + Access (issue [#17420](https://github.com/unslothai/unsloth/issues/17420), closed).

## 6. What This Means for Application Developers

- **Pin your runtime context explicitly.** Multiple bugs share one root cause: Studio's advertised context ≠ the backend's loaded context. If you route agents through Ollama/llama.cpp/vLLM/custom connections, verify `--ctx`/`-c` matches your prompt budget or you'll hit mid-run "request exceeds context" failures on long tool results and Deep Research.
- **If you build multi-chat or background-loading UIs**, watch PR #17565 — settings state currently leaks across chats during model-load waits, which can silently change tool permissions mid-session.
- **Approval hooks are not a security boundary yet.** In "Approve for me" mode, indirect file deletion (higher-order functions, threads, executors) bypasses the confirmation card until #17541 lands.
- **AMD NPU is becoming a first-class backend**, with RAM-aware context sizing and full model lifecycle management — but the entire stack is in one test branch (#17519); treat it as pre-production.
- **AMD MI300X / ROCm 7.14 users**: budget for MATH-fallback attention backward until #17548 is resolved; this materially affects fine-tuning throughput on gfx942.
- **Docker users**: tags are unreliable (#17470) — pin images by digest in CI.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*