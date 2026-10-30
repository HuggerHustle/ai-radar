# AI Infrastructure Digest 2026-10-30

> Generated: 2026-10-30 00:48 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Date: 2026-10-30**

---

## 1. Ecosystem Overview

Today's landscape shows a maturing but unevenly-hardened stack, with no new stable releases from any of the four serving/runtime projects (vLLM, SGLang, llama.cpp, Ollama) and only LiteLLM cutting an RC. Activity is instead concentrated in **kernel-level optimization** (FlashInfer/GDN, Metal MXFP4, SYCL DPAS, Hexagon HVX), **moE and KV-cache efficiency**, and a wave of **structured-output + tool-calling correctness bugs** that span every layer from gateway (LiteLLM) to server (SGLang) to local runtime (llama.cpp, Ollama). A clear theme is emerging: **agents are the dominant workload**, and the ecosystem is paying down debt from years of optimizing for single-turn chat. Meanwhile, **SM120 (RTX PRO 6000 Blackwell) remains a second-class citizen** across vLLM and SGLang, and **DeepSeek-V4.x deployments carry the highest operational blast radius** in the SGLang stack.

---

## 2. Activity Comparison

| Project | Layer | Issues (today) | PRs (today) | Release Status | Notable Activity Vector |
|---|---|---|---|---|---|
| **vLLM** | Serving engine | ~9 referenced (5 High/Med) | ~11 | None (24h) | FlashInfer/GDN perf wave; spec-decode + structured-output dist. bug |
| **SGLang** | Serving engine | ~14 referenced | ~7 | None (24h) | SM120 kernel gaps; DeepSeek-V4 outages; architecture RFCs |
| **llama.cpp** | Local runtime | ~14 referenced | ~10 | 8 builds (b11976–b11988) | Metal MXFP4; SYCL DPAS FA; OpenCL IQ2; `Limite` arch |
| **Ollama** | Local runtime | ~7 referenced | ~9 | None (24h) | OpenAI-compat edge cases; MLX hardening; ROCm KV contamination |
| **LiteLLM** | Gateway | ~14 referenced | ~10 | **v1.108.0-rc.1** (cosign signing) | Cost/accounting correctness; 4 breaking-change PRs queued |
| **Unsloth** | Training/FT | ~15 referenced | ~9 | None (24h); Desktop `v0.1.912-beta` | Fused NF4 decode; EXL3 backend; agent tool-call truncation fix |

**Reading:** llama.cpp is the only project shipping user-visible artifacts (8 builds). LiteLLM is the only project with a release. Unsloth has the widest issue funnel — consistent with it being a desktop product with heterogeneous hardware support. vLLM and SGLang are in "PR-only" mode, suggesting both are mid-cycle between releases.

---

## 3. Model Support Race

| Model / Arch | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **DeepSeek-V4 / V4.1-Flash** | ⚠️ SM120 gaps (#59203) | ❌ SM120 slow 2–6× (#33422); crash (#47218) | ⚠️ GGUF issues unconfirmed (#31385) | — | — |
| **GLM-5.3 / 5.3-Flash** | ✅ Tracker open (#57406) | ⚠️ fa4 crash on SM120 (#42012) | ✅ TOPK_MOE fusion PR (#31390) | — | — |
| **Qwen3.5 / 3.8-Flash-Next** | ✅ ROCm gfx950 tracker (#59575) | ✅ AMD fused GDN (#47287), tracker (#44304) | ⚠️ GDN state leak on ROCm (#29092) | — | — |
| **LFM3 (LiquidAI)** | — | — | ✅ response_format fix in flight | ⚠️ grammar 500 (#31328) | ✅ support request (#15588) |
| **Limite 1B – Violetto** | — | — | ✅ **shipped b11988** | — | — |
| **Kimi-K3** | — | ⚠️ tool+JSON 400 (#47167) | — | — | — |
| **MiniMax-M3.1-Flash** | — | — | — | — | ✅ Studio connector (#16011) |
| **Gemma 4 / Gemma 3** | ✅ slow on 4090 (#38887) | — | — | ⚠️ media ordering (#19334) | ✅ non-flex attn (#16041) |
| **T-Head PPU (Zhenwu)** | — | ✅ roadmap (#37519) | — | — | — |

**Who's ahead:**
- **llama.cpp** wins on *breadth of model coverage shipped today* — `Limite` arch landed, MiniMax MoE routing fusion, LFM3 fixes.
- **vLLM** leads on *flagship-model tracker discipline* (GLM-5.3, Qwen3.8 on ROCm, DeepSeek feature requests all filed with links).
- **SGLang** is the *most exposed* — it claims DeepSeek-V4-first support but currently has the deepest bug surface for it.
- **Unsloth** is the only project actively building out a **third quantization backend** (EXL3), a differentiator for niche-bitrate training/serving.

---

## 4. Performance Frontier

Optimization effort clusters into five buckets, with clear winners per bucket:

| Area | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **Kernels** | FlashInfer/GDN prefill (#64625, #64621) | mega_moe BLOCK_M (#46593), FA4 | Metal MXFP4, SYCL DPAS, Hexagon HVX | MLX top-k sort (#19392) | Fused NF4 decode (#16032) |
| **KV cache** | Tiered offload lazy alloc (#60128) | HiCache DSA/DCP ROCm (#45205) | `flash_attn_ext_rows` (#29510) | — | MLX attn-score est. (#16021) |
| **Batching / routing** | run-batch typeadapters (#63005) | Detokenizer hot path (#47260) | MoE ClassLRU (+6–7% decode, #31233) | MLX `NUM_PARALLEL` (#19197) | — |
| **Quantization** | MXFP4/NVFP4 gaps on SM120 | FP8 `wo_a` GEMM (#46677) | IQ2 on OpenCL (initial) | — | EXL3 backend (#7115) |
| **Startup / weight-sync** | Skip CUDA graph memory profil. (#64622); MoE loader (#64620) | FlashInfer bump (#46926) | — | MLX stall detect (#17834) | — |

**Concentration:** The single biggest cluster today is **MoE efficiency** (vLLM weight loading, SGLang mega_moe, llama.cpp ClassLRU, Ollama VRAM prediction for drafts). This is a signal: 2026's flagship models are MoE-first, and the serving stack is still catching up. **Blackwell SM120 is the lowest-yield hardware target** — both engines report unresolved gaps.

---

## 5. Layer Positioning

```
┌─────────────────────────────────────────────────────────────┐
│ GATEWAY / ROUTING            │ LiteLLM                     │
│                              │ (cost, auth, multi-provider,│
│                              │ MCP, SSO, budget enforcement)│
├─────────────────────────────────────────────────────────────┤
│ SERVING ENGINE (server)      │ vLLM        │ SGLang        │
│                              │ (throughput,│ (agentic,     │
│                              │  generic)   │  structured)  │
├─────────────────────────────────────────────────────────────┤
│ LOCAL RUNTIME (desktop/edge) │ llama.cpp   │ Ollama        │
│                              │ (raw perf)  │ (UX, OpenAI-  │
│                              │             │  compat)      │
├─────────────────────────────────────────────────────────────┤
│ TRAINING / FINE-TUNING       │ Unsloth                     │
│                              │ (LoRA, quant, Studio/Desktop)│
└─────────────────────────────────────────────────────────────┘
```

**Key differentiators today:**
- **vLLM vs SGLang (same layer, different bets):** vLLM is optimizing for *generic fleet throughput* (MoE weight loading, tiered offload). SGLang is optimizing for *agentic sessions* (RFCs on session-aware KV, supernode sharing). Pick vLLM for batch inference fleets, SGLang for long-running agent sessions — but verify SM120 hardware fit.
- **llama.cpp vs Ollama:** llama.cpp now ships 8 builds/day and covers a new arch (`Limite`) same-day; Ollama trails on model support but leads on **API compatibility polish**. Ollama is a *product*; llama.cpp is a *runtime*.
- **LiteLLM is now the de facto control plane** — cosign signing, OpenAI-compat hardening, MCP guardrails. Its bugs (spend logging, budget reset) matter *because* it sits in the hot path of every enterprise deployment.
- **Unsloth is the only project in this set that closes the loop** from fine-tune → quantize → serve locally, which is why its `EXL3` and `fused NF4 decode` work is strategically interesting.

---

## 6. Trend Signals

**Signal 1 — Structured output + tool calling is the ecosystem's weakest joint.**
Every layer has an active bug:
- SGLang: tools + JSON schema silently drops tool calls on glm47/DeepSeek/Kimi-K3 (#47167).
- vLLM: structured output + spec decode distribution drift (#62818).
- Ollama: `go_template` drops Qwen3 tool-call turns (#19377).
- llama.cpp: lazy-grammar + `tool_choice=auto` 400s (#31395).
- Unsloth: truncated tool calls returned as valid → agents execute partial writes (#16035).

**Watch:** If you run agents in production, add an *assertion layer* that verifies tool-call non-emptiness and argument completeness before execution. This is no longer optional.

**Signal 2 — Blackwell SM120 (RTX PRO 6000) is the new "works on paper" SKU.**
vLLM and SGLang both report: missing FlashInfer kernels, MXFP4 falls back to Marlin, DeepSeek-V4 prefill 2–6× slower than expected, FA4 CL-graph crashes. **Watch:** do not provision SM120 for DeepSeek/MXFP4 workloads without a validated baseline; Hopper (SM90) remains the safe default.

**Signal 3 — MoE efficiency is the active optimization frontier.**
Four of five projects shipped or advanced MoE-related work today (expert caching, weight loading, routing fusion, VRAM accounting). **Watch:** if you're running GLM-5.x, Qwen3.x-MoE, or DeepSeek-V4, benchmark against this week's PRs once they merge.

**Signal 4 — Gateway cost accounting is materially broken for streaming.**
LiteLLM has three open/closed bugs that can record streamed traffic at $0, double-count, or inflate to phantom USD values (#48937, #48899, #35829). **Watch:** if your FinOps or budget enforcement depends on LiteLLM spend logs, reconcile against provider billing before trusting limits. Redis is mandatory for budget correctness.

**Signal 5 — ROCm/AMD is closing the gap on consumer+prosumer, but not on iGPU isolation.**
SGLang added AMD GDN kernels and DSA HiCache; llama.cpp has HIP state-leak bug (#29092); Ollama has a *correctness-critical* ROCm KV contamination bug on Strix Halo (#17847). **Watch:** AMD GPU servers are production-viable; AMD *iGPU* deployments are not yet safe for multi-tenant or sequential-agent isolation.

**Signal 6 — Architecture RFCs are converging on agentic primitives.**
SGLang's [#43098](agentic cache scheduling), [#45189](session-aware KV), [#47170](model-independent parallelism) and Unsloth's per-tool MCP toggles (#15629) point the same direction: **the serving layer is being redesigned around session/tool/agent semantics**, not request/response. **Watch:** if you're building a router or orchestrator that assumes stateless placement, revisit it within the next quarter.

**Signal 7 — Supply chain and packaging hardening is now table stakes.**
LiteLLM cosign-signed images; llama.cpp AOT cubin gaps (#38515); SGLang Python 3.13 Rust-toolchain surprise (#47242); Unsloth ModelScope >50 GB block (#15989). **Watch:** pin exact builds, verify signatures, and test on your *deployment* Python/toolchain — not just your dev box.

---

### Bottom line for decision-makers

- **Fleet serving (NVIDIA Hopper):** vLLM for throughput; SGLang only if you've validated structured-output+tooling and aren't on SM120.
- **Local/edge:** llama.cpp if you need breadth and performance; Ollama if you need OpenAI-compat and desktop UX, but expect a 1–2 release lag on new arches.
- **Gateway:** LiteLLM is the default, but treat its spend data as *advisory* until the streaming-accounting bugs land.
- **Fine-tuning:** Unsloth is the only project closing the loop to serving; the EXL3 backend and fused NF4 decode are worth a pilot.
- **Biggest near-term risk to agents:** the tool-call + structured-output correctness cluster — layer your own validation regardless of which engine you pick.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-10-30

## 1. Today's Highlights

No releases landed in the last 24h, but PR activity is heavy: a wave of FlashInfer/GDN perf PRs (#64625, #64623, #64622, #64621, #64620) targets startup time, MoE weight loading, and hybrid-batch prefill, while SR-IOV-class hardware gaps persist on Blackwell SM120 (DeepSeek-V4.1, MXFP4/NVFP4 fallbacks). On the correctness side, the structured-output + speculative-decoding distribution bug (#62818) remains open with a fix PR in flight (#63219).

## 2. Releases & Breaking Changes

None. No new versions published in the last 24h.

## 3. New Model & Hardware Support

- **SM120 (RTX PRO 6000 Blackwell) gaps persist** — DeepSeek-V4.1-Flash cannot run: `page_block_size=32` has no FlashInfer sparse-MLA decode kernel instantiation on SM120 (only pbs=64) [#59203](https://github.com/vllm-project/vllm/issues/59203).
- **MXFP4 on SM120 still falls back to Marlin** instead of native kernels; native NVFP4 MoE kernel support for SM120 is an open feature request [#30135](https://github.com/vllm-project/vllm/issues/30135), [#31085](https://github.com/vllm-project/vllm/issues/31085).
- **FP8 KV cache for NoPE sparse MLA on ROCm** — fix PR routes rope-free sparse MLA to Triton kernels for all KV-cache dtypes and adds per-tensor-scaled FP8 support [#57134](https://github.com/vllm-project/vllm/pull/57134).
- **GLM-5.3 optimization tracker** opened, following GLM-5.2 work on the shared `glm_moe_dsa` architecture [#57406](https://github.com/vllm-project/vllm/issues/57406).
- **Multi-modal inputs for OpenAI Responses API** — feature request open; currently text/tool-calling only [#32685](https://github.com/vllm-project/vllm/issues/32685).

## 4. Performance & Optimization

- **GDN / FlashInfer prefill** — keep prefill states in the cache pool for mixed batches [#64625](https://github.com/vllm-project/vllm/pull/64625); use regular prefill route for batches <8192 tokens, avoiding FlashInfer's ~175 µs/call chunk-parallel overhead [#64621](https://github.com/vllm-project/vllm/pull/64621).
- **Startup**: skip CUDA graph memory profiling when `VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=0`; claims faster startup on Qwen3.5-35B-A3B (GB300, warm caches) [#64622](https://github.com/vllm-project/vllm/pull/64622).
- **MoE weight loading** — one `weight_loader` call per shard instead of per expert+shard; online weight sync of Qwen3.5-397B-A17B (TP4) is the target workload [#64620](https://github.com/vllm-project/vllm/pull/64620).
- **Frontend**: build `run-batch` pydantic TypeAdapters once instead of per request, saving ~0.5 ms schema regeneration per line [#63005](https://github.com/vllm-project/vllm/pull/63005).
- **ROCm/MI355X**: Qwen3.8-Flash-Next gfx950 optimization tracker (GatedDeltaNet, sparse attention, MXFP4 MoE) is active [#59575](https://github.com/vllm-project/vllm/issues/59575).
- **Tiered offloading**: lazy CPU block allocation for the FS tier to reduce unnecessary cache reservation under load [#60128](https://github.com/vllm-project/vllm/pull/60128).
- **Multimodal video**: cache PyNvVideoCodec decoder caps — `GetDecoderCaps` takes ~180 ms per call and holds the GIL, freezing the API server [#64618](https://github.com/vllm-project/vllm/pull/64618).

## 5. Stability & Regressions

- **[High] Structured output + spec decode distribution drift** — `StructuredOutputManager` draft-token handling can alter the output distribution; fix PR #63219 per-request draft retention under PP is open [#62818](https://github.com/vllm-project/vllm/issues/62818), [#63219](https://github.com/vllm-project/vllm/pull/63219).
- **[High] KV offload P2P tier does not fail fast on peer faults** — reproducers on H200/NIXL 1.5.0; silent hangs rather than clean errors [#63602](https://github.com/vllm-project/vllm/issues/63602).
- **[Medium] Mixed-precision KV cache zeroing regression** — `UniformTypeKVCacheSpecs` groups lose zeroing when reduced for scheduler; fix PR #64485 ensures pipeline stages agree [#64472](https://github.com/vllm-project/vllm/pull/64472).
- **[Medium] EPLB async rearrangement timing bug** — interval counted from cycle start, causing negative "steps until next rearrangement" and same-step re-rearrangement; fix open [#64485](https://github.com/vllm-project/vllm/pull/64485).
- **[Medium] SIGTERM during teardown** — EngineCore restores `SIG_DFL` before teardown, so a second SIGTERM (Ctrl-C, `docker stop`) can interrupt shutdown; fix PR open [#64623](https://github.com/vllm-project/vllm/pull/64623).
- **[Medium] Gemma 4 E4B slow on v0.19.0** — forced TRITON_ATTN fallback yields ~9 tok/s on RTX 4090 vs ~100+ tok/s for comparable Llama 3B [#38887](https://github.com/vllm-project/vllm/issues/38887).
- **[Low] Single-prompt throughput lags llama.cpp on Strix Halo APU** — 7.5 vs 50 tok/s for GPT-OSS-120B; architectural, unlikely a quick fix [#34579](https://github.com/vllm-project/vllm/issues/34579).
- **[Low] Hybrid attention block size** — derived mamba block size can fail startup when not a multiple of `--prefix-match-unit`; fix rounds up [#64624](https://github.com/vllm-project/vllm/pull/64624).

## 6. What This Means for Application Developers

- **Don't deploy spec decoding + structured outputs on PP yet** unless you track #63219 — token distributions can drift subtly, which matters for function-calling agents and JSON-mode APIs.
- **Blackwell RTX PRO 6000 (SM120) is still second-class** for DeepSeek-V4.1 and MXFP4/NVFP4 models; if you're provisioning prosumer/workstation Blackwell, validate your exact model + quant combo first.
- **Startup and weight-sync latency is improving** — the GDN/FlashInfer and MoE loader PRs matter most for elastic serving, multi-LoRA swaps, and RL fine-tuning loops where engines restart or resync frequently.
- **Multimodal video serving gets a real fix** with cached NVDEC decoder caps (#64618) — previously one request could stall the entire API server for ~180 ms under the GIL.
- **Hybrid Mamba/attention models** (Qwen3.6-35B-A3B and similar) benefit from the prefix-match-unit fix (#64624) if you set custom `--prefix-match-unit` values.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-10-30

## 1. Today's Highlights

No releases shipped in the last 24h, but issue/PR activity is heavy and concentrated in three areas: **SM120 (Blackwell RTX PRO 6000) kernel coverage** (fa4 crashes, dsv4 prefill underperformance vs vLLM), **DeepSeek-V4 stability** (scheduler crashes, unbounded sparse-prefill allocation), and **RFC-level architecture work** on model-independent parallelism and session-aware KV orchestration. On the perf side, AMD ROCm landed or advanced fused GDN decode (Qwen3.5) and dsv4.1 FP8 `wo_a` GEMM wiring, while the detokenizer got a decode-path optimization that removes per-step redundant payloads.

## 2. Releases & Breaking Changes

No new releases. Two notable *configuration/API-relevant* items in flight:

- **[OPEN] PR #46926 — Bump FlashInfer to 0.7.2.post1** ([link](https://github.com/sgl-project/sglang/pull/46926)): bumps `flashinfer_python` pin, Dockerfile `flashinfer-cubin`/`flashinfer-jit-cache` versions, and the runtime version check in `engine.py`. Environment-relevant if you pin FlashInfer.
- **[OPEN] Issue #47167 — tools + JSON-schema format cannot be combined** ([link](https://github.com/sgl-project/sglang/issues/47167)): Kimi-K3 returns 400; glm47 and DeepSeek silently drop tool calls and hallucinate an answer when `--output-schema` is used with tools. This is a **behavioral regression for structured output + tool-calling** users, not a version bump, but treat it as a compatibility break.
- **[OPEN] Issue #47242 — Python 3.13 install requires a Rust toolchain** ([link](https://github.com/sgl-project/sglang/issues/47242)): sglang 0.5.22 pulls `outlines==0.1.11 → outlines_core==0.1.26` (exact pin), forcing a Rust toolchain. Undocumented; relevant if you build images on 3.13.

## 3. New Model & Hardware Support

- **[OPEN] Issue #37519 — T-Head PPU (Zhenwu 810/810E/M890P)** ([link](https://github.com/sgl-project/sglang/issues/37519)): highest-priority roadmap for first-class T-Head SAIL support. New accelerator family.
- **[OPEN] Issue #46900 — AMD RDNA3/RDNA4 (gfx1100/gfx1201)** ([link](https://github.com/sgl-project/sglang/issues/46900)): CI and upstreaming plan for consumer/prosumer AMD GPUs on main.
- **[OPEN] Issue #40624 — Triton TLX on gfx950/gfx1250** ([link](https://github.com/sgl-project/sglang/issues/40624)): enabling Meta's Triton Language Extension; includes Gluon kernel compile fixes (triton-lang/triton-ext#177 merged).
- **[OPEN] PR #45205 — HiCache for DSA DCP on AMD ROCm** ([link](https://github.com/sgl-project/sglang/pull/45205)): enables HiCache for DeepSeek-family DSA models with DCP on ROCm; previously rejected, hurting agentic high-concurrency workloads.
- **[OPEN] PR #47348 — SWA page freeing via Triton on out-of-tree platforms** ([link](https://github.com/sgl-project/sglang/pull/47348)): replaces the ~10-op eager fallback in `_free_swa_pages_none_cuda` with the fused `get_and_clear_swa_pages` kernel on any Triton-capable device, not just CUDA.
- **[OPEN] PR #47352 — MLA latent cache writes via `store_mla` on out-of-tree platforms** ([link](https://github.com/sgl-project/sglang/pull/47352)): removes slice-assign fallback for non-NPU/non-CUDA devices.
- **[OPEN] Issue #38515 — `sgl_kernel` AOT cubin gap on sm_75 (Turing)** ([link](https://github.com/sgl-project/sglang/issues/38515)): per-op `NoKernelImageForDevice` for rmsnorm while silu/gelu variants work; no soft fallback to torch/Triton. Relevant if you're on RTX 2080 Ti.

## 4. Performance & Optimization

- **[OPEN] PR #47260 — Detokenizer: send per-request decode inputs once** ([link](https://github.com/sgl-project/sglang/pull/47260)): scheduler no longer re-sends immutable per-request fields (`skip_special_tokens`, offsets, tokenizer route, etc.) every decode step. Reduces inter-process traffic on the hot decode path.
- **[OPEN] PR #46593 — mega_moe: raise BLOCK_M for decode-graph FP8xFP4** ([link](https://github.com/sgl-project/sglang/pull/46593)): fixes DeepGEMM BLOCK_M heuristic under skewed decode routing that forced hot experts into a second M block (double weight streaming). Decode is weight-streaming-bound, so this is a direct latency win.
- **[OPEN] PR #46677 — AMD dsv4.1 32x32-block FP8 `wo_a` GEMM** ([link](https://github.com/sgl-project/sglang/pull/46677)): ROCm-specific attention-output GEMM optimization.
- **[OPEN] PR #47287 — AMD Qwen3.5 fused GDN decode unpack + Conv1D** ([link](https://github.com/sgl-project/sglang/pull/47287)): merges two small sequential kernels per GDN layer into one on ROCm; no NVIDIA change.
- **[OPEN] PR #47356 — avoid full-prompt copies in thinking-budget / n-gram logit processors** ([link](https://github.com/sgl-project/sglang/pull/47356)): `ThinkingBudgetLogitProcessor` and `DeepseekOCRNoRepeatNGramLogitProcessor` run every decode step; this trims per-step copies.
- **[OPEN] Issue #33422 — DeepSeek-V4 prefill on SM120: ~2–7K tok/s vs ~12.5K via vLLM/marlin** ([link](https://github.com/sgl-project/sglang/issues/33422)): 4× RTX PRO 6000, TP=4, no NVLink. Reported gap is ~2–6× vs the marlin path on identical hardware; no fix in the thread yet.
- **[OPEN] Issue #45373 — GLM-5.3-Flash Hopper (SM90) perf tracking** ([link](https://github.com/sgl-project/sglang/issues/45373)): Q4 roadmap item under #42473 (kernel optimization).
- **[OPEN] Issue #44304 — Qwen3.8-Flash-Next gfx950/MI355X perf tracker** ([link](https://github.com/sgl-project/sglang/issues/44304)): GatedDeltaNet ×36 layers, QSA ×12, HyperConnection gated residual, MXFP4 MoE, NEXTN MTP.

## 5. Stability & Regressions

Ranked by severity:

- **[OPEN] Issue #47218 — DeepSeek-V4 scheduler crash on `None` multimodal offsets under concurrent aborted streams** ([link](https://github.com/sgl-project/sglang/issues/47218)): `items_offset_list` is `None` in the multimodal embedding path; takes down all TP/EP workers and restarts the container. **Service-wide outage class.** Image `lmsysorg/sglang:dev-dsv41`.
- **[OPEN] Issue #41076 — DSPARK: unbounded `SparsePrefillWorkspace` allocation OOM-crashes the whole TP group** ([link](https://github.com/sgl-project/sglang/issues/41076)): DeepSeek-V4.1-Flash + DSPARK. Allocation isn't bounded by the sparse prefill budget; single request can kill the group.
- **[OPEN] Issue #42012 — GLM-5.3-Flash on SM120: fa4 crashes at CUDA-graph capture** ([link](https://github.com/sgl-project/sglang/issues/42012)): hybrid extend reshape fails during graph capture; triton is the only working attention backend on 8× RTX PRO 6000, `v0.5.20` image. 25 comments, active.
- **[OPEN] Issue #46806 — weight updates silently load the target's weights into a DFLASH draft** ([link](https://github.com/sgl-project/sglang/issues/46806)): `update_weights_from_disk` has no `selector` to prevent polluting the draft model. Silent correctness bug — your draft model may be serving target weights. Same symptom previously reported for EAGLE3 external draft.
- **[OPEN] Issue #47167 — Kimi-K3 400s and glm47/DeepSeek drop tool calls under JSON-schema mode** ([link](https://github.com/sgl-project/sglang/issues/47167)): breaks Codex `--output-schema`. **Silent incorrect output**, not just an error.
- **[OPEN] Issue #45400 — HiCache on hybrid GDN: host-tier hits drop to zero once evicted working set exceeds ~3 long prefixes** ([link](https://github.com/sgl-project/sglang/issues/45400)): host mamba pool exhausted while KV stays on host. Relevant for long-context agentic workloads.
- **[OPEN] Issue #47294 — `/start_profile` with `profile_by_stage=true` and no `num_steps` crashes every scheduler** ([link](https://github.com/sgl-project/sglang/issues/47294)): `TypeError: NoneType += int`. v0.5.22, DeepSeek-V4.1-Flash, DSpark spec decode.
- **[OPEN] Issue #47357 — Llama KV scale loader replaces tensor scales with floats, host mirrors stale** ([link](https://github.com/sgl-project/sglang/issues/47357)): `load_kv_cache_scales` sets Python floats on `k_scale`/`v_scale` without updating `k_scale_float`/`v_scale_float`. Breaks registered-Parameter attention paths on 0.5.22 and main.
- **[OPEN] Issue #47205 — reasoning grammar gate never opens when the think-end marker splits under `split_special_tokens`** ([link](https://github.com/sgl-project/sglang/issues/47205)): token-splitting across the marker leaves the reasoning grammar gate closed.
- **[OPEN] Issue #47297 — diffusion: LingBot-Video-MoE crashes in text encoding under default layerwise offload** ([link](https://github.com/sgl-project/sglang/issues/47297)): tied vocab table left on CPU; device mismatch on single H100.
- **[OPEN] Issue #46803 — FlashInfer `cascade` JIT-compiles inside the first prefixed request (~4.5s)** ([link](https://github.com/sgl-project/sglang/issues/46803)): cold-start latency on pip installs; affects prefixed-request workloads.
- **[OPEN] Issue #35822 — EAGLE spec decode hang (tree_speculative_sampling_target_only) on Ampere** ([link](https://github.com/sgl-project/sglang/issues/35822)): 2× A2, Qwen3.8-27B AWQ, 100% GPU util at low power — silent hang.
- **[CLOSED] Issue #36894 — `/unload_lora_adapter` permanent scheduler deadlock after parallel sampling (n>1)** ([link](https://github.com/sgl-project/sglang/issues/36894)): closed as inactive. If you were hitting this, verify the fix landed via another path before relying on it.
- **[OPEN] Issue #42752 — flaky tests / CI infra failures tracker** ([link](https://github.com/sgl-project/sglang/issues/42752)): 140 comments in ~3 weeks, ongoing. Signals that CI signal-to-noise is degraded; expect longer merge times for PRs in this window.

## 6. What This Means for Application Developers

- **Tool calling + structured output is currently unsafe on several flagship models.** If your agent uses tools *and* JSON-schema/`--output-schema` (e.g. Codex `--output-schema`), issue [#47167](https://github.com/sgl-project/sglang/issues/47167) is a silent-correctness bug: glm47 and DeepSeek will drop tool calls and answer anyway. Pin known-good model/image combos and add an out-of-band validation layer around tool invocations.
- **DeepSeek-V4-family deployments carry the highest blast radius right now.** Issues [#47218](https://github.com/sgl-project/sglang/issues/47218) and [#41076](https://github.com/sgl-project/sglang/issues/41076) can restart the serving container or OOM the entire TP group under concurrent aborted streams and DSPARK sparse prefill, respectively. If you run DSPARK or concurrent multimodal requests, budget for process-level supervision and per-request memory limits at the router.
- **SM120 (RTX PRO 6000) is not yet a first-class target.** fa4 crashes under CUDA-graph capture for GLM-5.3-Flash ([#42012](https://github.com/sgl-project/sglang/issues/42012)) and DeepSeek-V4 prefill is ~2–6× slower than the vLLM/marlin path on identical hardware ([#33422](https://github.com/sgl-project/sglang/issues/33422)). For SM120 production, expect to pin triton attention backends explicitly and validate throughput against a non-SGLang baseline before committing.
- **Decode-path efficiency is improving but unevenly.** The detokenizer change ([#47260](https://github.com/sgl-project/sglang/pull/47260)) and mega_moe BLOCK_M fix ([#46593](https://github.com/sgl-project/sglang/pull/46593)) both reduce per-step overhead on Blackwell + MoE; AMD users get fused GDN kernels ([#47287](https://github.com/sgl-project/sglang/pull/47287)) and dsv4.1 FP8 GEMM ([#46677](https://github.com/sgl-project/sglang/pull/46677)). If you're on ROCm and serving Qwen3.5 or dsv4.1, these two PRs are worth tracking/backporting.
- **Speculative decoding draft isolation is a latent hazard.** [#46806](https://github.com/sgl-project/sglang/issues/46806) shows weight updates silently writing target weights into the DFLASH draft. If you hot-reload weights in a spec-decode deployment, audit for `selector` presence until this is fixed.
- **Watch the architecture RFCs if you operate multi-tenant or agentic serving.** [#43098](https://github.com/sgl-project/sglang/issues/43098) (agentic cache scheduling, supernode KV sharing), [#45189](https://github.com/sgl-project/sglang/issues/45189) (session-aware KV orchestration), and [#47170](https://github.com/sgl-project/sglang/issues/47170) (model-independent parallelism) will shape router/scheduler APIs over Q4. If you're building a gateway or orchestrator that assumes a fixed placement model, comment on these now.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-10-30

## 1. Today's Highlights

A heavy backend-acceleration day: Metal landed a faster MXFP4 mat-vec kernel and full-threadgroup unary/binary/GLU dispatches, while SYCL added a DPAS flash-attention path for quantized KV caches and broadened vectorized dequant stores. New model support arrived for "Limite 1B – Violetto" (GGUF conversion + arch), and OpenCL gained initial IQ2 support at a very early stage (AOS/SOA mv, tiled mm, Adreno dp4a). On the infra side, the moe-cache line of work (ClassLRU / CRF admission) continued iterating and squatting on the same PR threads.

---

## 2. Releases & Breaking Changes

No breaking API or config changes landed in the last 24h. Builds of note:

- **b11988** — New arch `Limite` (model: Support Limite 1B – Violetto) — new GGUF architecture added, conversion support included. https://github.com/ggml-org/llama.cpp/releases
- **b11986** — OpenCL initial IQ2 support. https://github.com/ggml-org/llama.cpp/releases
- **b11985** — Metal faster MXFP4 mat-vec + full threadgroups for unary/binary/GLU. https://github.com/ggml-org/llama.cpp/releases
- **b11982 / b11981 / b11976** — Hexagon UPSCALE, transposed CONCAT DDR bandwidth, IM2COL block-parallel HVX. https://github.com/ggml-org/llama.cpp/releases
- **b11980 / b11979** — SYCL DPAS FA kernel for quantized KV, vectorized reordered dequant stores. https://github.com/ggml-org/llama.cpp/releases

Note for integrators: PR #31395 (open) changes lazy-grammar behavior when `response_format` is set, targeting the "failed to parse grammar" 400 error combined with `tool_choice=auto`. Not merged, but worth tracking if you rely on grammar-constrained JSON + tools.

---

## 3. New Model & Hardware Support

- **New architecture `Limite` (Limite 1B – Violetto)** — GGUF conversion and loader support added in b11988. https://github.com/ggml-org/llama.cpp/releases
- **OpenCL / IQ2 quantization** — Initial IQ2 support (`iq2_s` AOS mv, SOA mv + tiled mm, noshuffle GEMM/GEMV, Adreno dp4a, optimized Adreno decode). Very new; expect gaps in quant coverage and correctness. https://github.com/ggml-org/llama.cpp/releases
- **Hexagon backend ops** — UPSCALE (nearest 2x/4x, bilinear 4x, vgather), IM2COL block-parallel HVX, DSV4_HC_PRE / DSV4_HC_POST, LIGHTNING_INDEXER (Q4_0/Q8_0/F16/F32) in flight. https://github.com/ggml-org/llama.cpp/pull/30953 and https://github.com/ggml-org/llama.cpp/pull/31289
- **SYCL quantized-KV flash attention** — DPAS kernel for q4_0/q8_0 KV blocks, decode + small batches (1–31 query tokens). https://github.com/ggml-org/llama.cpp/releases
- **Metal GET_ROWS_BACK (F32)** — PR open. https://github.com/ggml-org/llama.cpp/pull/31378
- **Metal TOPK_MOE sigmoid+bias fusion** — PR open; relevant for Nemotron-H / GLM / DeepSeek-V3 style MoE routing. https://github.com/ggml-org/llama.cpp/pull/31390

---

## 4. Performance & Optimization

**Landed (releases):**
- Metal MXFP4 mat-vec reworked: fp16 bit-trick decode replaces threadgroup LUT; packed nibbles loaded as aligned 32-bit words. Decode path should improve for MXFP4 models on Apple Silicon. https://github.com/ggml-org/llama.cpp/releases
- SYCL reordered-layout dequant stores vectorized for Q4_0, K-quants, IQ3, MXFP4. https://github.com/ggml-org/llama.cpp/releases
- Hexagon transposed CONCAT: doubled row block size, double-buffered scratchpads, chunked src1 rows, stride padding for gather lanes. https://github.com/ggml-org/llama.cpp/releases

**In flight (PRs):**
- **moe-cache ClassLRU (PR #31233)**: replaces SLRU with class-based decaying-usage cache — reported **+6% decode on QFN, +7% on GLM, 8% fewer uploads** vs SLRU with warm cache. https://github.com/ggml-org/llama.cpp/pull/31233
- **moe-cache CPU-share auto + CRF admission (PR #31286)**: hybrid of #30966 and #31233. https://github.com/ggml-org/llama.cpp/pull/31286
- **OpenCL**: dp4a q4_0 GEMM as default for batched matmul (avoids ~3% perplexity hit from f16 activation rounding on gemma-4-E2B-Q4_0), small-N f32/f16 GEMV row reuse, FA softcap ordering fix. https://github.com/ggml-org/llama.cpp/pull/30535, https://github.com/ggml-org/llama.cpp/pull/30413, https://github.com/ggml-org/llama.cpp/pull/30536
- **flash_attn_ext_rows (PR #29510)**: backend extension to avoid unified-KV mask filtering overhead in multi-seq inference. https://github.com/ggml-org/llama.cpp/pull/29510

---

## 5. Stability & Regressions

Ranked by severity:

1. **OpenCL: unaligned MoE router ID sub-buffer crash** — `CL_MISALIGNED_SUB_BUFFER_OFFSET` abort on ids tensor views at non-aligned offsets; fix PR closed (#30537). https://github.com/ggml-org/llama.cpp/pull/30537
2. **OpenCL FA softcap applied after mask** — masked entries capped to `-softcap` and still contributed to softmax (correctness bug); fix PR closed (#30536). https://github.com/ggml-org/llama.cpp/pull/30536
3. **HIP/ROCm: fused Gated Delta Net recurrent state leak across requests** — reused server slot emits earlier prompts' text verbatim (qwen35/qwen35moe). **Open, no fix PR yet.** https://github.com/ggml-org/llama.cpp/issues/29092
4. **SYCL: ~35% MoE prompt processing regression** between b11046 and b11804 with `-ncmoe` offload (not reproduced by llama-bench); XMX-ESIMD path regression blamed in a related issue (#31068, regression in d81d0d8fb). https://github.com/ggml-org/llama.cpp/issues/31262 and https://github.com/ggml-org/llama.cpp/issues/31068
5. **Metal init on macOS 14 / M2 Ultra**: `constexpr bfloat` cast in `unary.metal` fails init (bcdb7a23). https://github.com/ggml-org/llama.cpp/issues/31272
6. **LFM3 response_format 500** ("Unexpected empty grammar stack after accepting piece: 6 (30)") — affecting LFM3-1.7B / LFM3-VL-2B; fix PRs #31374 (closed) and #31395 (open, common: don't use lazy grammar when response_format is set). https://github.com/ggml-org/llama.cpp/issues/31328
7. **SYCL bf conversion instruction not supported** on Arrow Lake iGPU (llama-cli / server). https://github.com/ggml-org/llama.cpp/issues/31029
8. **SOLVE_TRI memory fault on gfx1200 HIP/ROCm, intermittent.** https://github.com/ggml-org/llama.cpp/issues/31108
9. **Hybrid (LFM2) co-batching corrupts recurrent/short-conv state** — greedy output diverges, can stop mid-sentence. https://github.com/ggml-org/llama.cpp/issues/29002
10. **DeepSeek-V4.1-Flash-1017 GGUF issues** (CUDA, RTX 6000 Pro) and **test-llama-context crash on deepseek41-moe.gguf** — new, unconfirmed. https://github.com/ggml-org/llama.cpp/issues/31385 and https://github.com/ggml-org/llama.cpp/issues/31346
11. **SYCL CPY to q4_1/q5_1/q8_0 doesn't match CPU reference** (with PR #31120 applied). https://github.com/ggml-org/llama.cpp/issues/31140
12. **Draft-path KV defects**: mtmd image chunks leave positional holes in draft KV (500s + no spec benefit, #27408); draft-mtp context sized from total ctx rather than seq ctx (#28433). https://github.com/ggml-org/llama.cpp/issues/27408, https://github.com/ggml-org/llama.cpp/issues/28433
13. **json-schema-to-grammar DoS**: large `enum` builds grammar superlinearly, pinning a core for tens of seconds per small request. https://github.com/ggml-org/llama.cpp/issues/29457
14. **json-schema-to-grammar control chars**: NUL from `\u0000` copied verbatim into GBNF in `pattern` → parse failure. https://github.com/ggml-org/llama.cpp/issues/31199

---

## 6. What This Means for Application Developers

- **Apple Silicon / MXFP4 users**: the b11985 Metal change is the highest-value update today — decode throughput for MXFP4 quants should improve meaningfully with no config change.
- **Intel Arc / SYCL in production**: hold off upgrading if you depend on MoE prompt processing with `-ncmoe`; issues #31262 and #31068 describe a ~28–35% PP regression. Pin to b11046 until resolved.
- **Structured output + tools**: the LFM3 `response_format` 500 and the lazy-grammar interaction are being addressed (#31395). If you serve grammar-constrained JSON with `tool_choice=auto`, eval against your model before rollout, and consider disabling lazy grammar as a workaround.
- **Grammar DoS exposure**: if you accept client-supplied JSON Schemas, the superlinear enum issue (#29457) is a real availability concern — cap schema size / enum cardinality at the gateway layer.
- **MoE-serving operators**: the moe-cache ClassLRU work (+6–7% decode, fewer expert uploads) is worth benchmarking on your hardware once merged; it targets the CPU-miss/upload path in hybrid cache designs.
- **New model coverage**: `Limite` arch support is fresh; expect edge cases in tooling, quantization, and server templates. Validate before including it in a production model catalog.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-10-30

## 1. Today's Highlights

No new releases landed in the last 24 hours, but the issue/PR queue is active around **OpenAI compatibility edge cases** (null `data` arrays, dropped `reasoning` fields, silently ignored `audio` input) and **MLX runner hardening** (repeat-token aborts, concurrent generation, load-stall detection). On the correctness side, a long-standing ROCm KV-state contamination bug on Strix Halo (#17847) and a critical `go_template` tool-call drop for Qwen3 (#19377) remain open, while the `ffn_down_exps.weight` overflow that broke `gpt-oss:120b` MoE loads appears resolved via a closed-issue pair (#19375, #18869).

## 2. Releases & Breaking Changes

No releases in the last 24h. No API/config breaking changes announced. Two compatibility-facing defaults worth noting in open PRs (not yet merged):

- **Empty-array semantics tightening**: PR #19387 will make `/v1/embeddings` return `data: []` instead of `null` when no embeddings exist; PR #19381 reports the equivalent `/v1/models` `"data": null` bug (open, no fix PR yet). Clients relying on `null`-tolerant parsing should still see no behavioral change, but strict typed SDKs will benefit.
- **`/api/chat` audio field rejection**: PR #19397 will begin *rejecting* clips a model has no encoder for, rather than silently passing base64 WAVs through `images` on any model. If you currently smuggle audio via the `images` array, this becomes a hard error once merged. ([#19378](https://github.com/ollama/ollama/issues/19378), [#19397](https://github.com/ollama/ollama/pull/19397))

## 3. New Model & Hardware Support

- **MLX speculative decoding control** — PR #19391 adds `draft_num_predict=0` to disable drafting per request, primarily for benchmarking draft-model speedups without changing system defaults. ([#19391](https://github.com/ollama/ollama/pull/19391))
- **Ternary quantization request** — Issue #19388 asks for ternarized "bonsai 2" support; closed without a linked implementation. ([#19388](https://github.com/ollama/ollama/issues/19388))
- **Audio/video native I/O** — Multiple open requests for native audio input/output (`lfm3-omni`, `phonon`) in the API, CLI, and Windows app. ([#19390](https://github.com/ollama/ollama/issues/19390), [#19396](https://github.com/ollama/ollama/issues/19396))
- **Multimodal embedding ordering** — PR #19334 fixes media-marker interleaving for models like Gemma 4 that require media tokens at conversation placeholder positions rather than appended at the end. ([#19334](https://github.com/ollama/ollama/pull/19334))
- **Cross-platform GUI** — The longstanding Flutter/Tauri GUI request (#11609, 20 👍) was updated today; still open, no linked implementation. ([#11609](https://github.com/ollama/ollama/issues/11609))

## 4. Performance & Optimization

- **MLX top-k sorting on Metal** — PR #19392 chunks long top-k rows (2048 values) into single-pass sorts to avoid multi-pass merge sort on 248K-token vocabularies; described as "most of the cost" of top-k. ([#19392](https://github.com/ollama/ollama/pull/19392))
- **MLX concurrency** — PR #19197 allows `OLLAMA_NUM_PARALLEL > 1` for MLX models, sharing projection and feed-forward work across concurrent requests while duplicating attention/KV state. Reduces first-token wait at memory cost. ([#19197](https://github.com/ollama/ollama/pull/19197))
- **VRAM prediction accuracy** — PR #19393 stops counting CPU-resident input tensors (which llama.cpp always keeps on CPU) against GPU memory, fixing overprediction; PR #17857 fixes multi-model memory accounting where a speculative draft's buffer lines replaced the target model's, underreporting a 30B dflash as ~2.3GB in `ollama ps`. ([#19393](https://github.com/ollama/ollama/pull/19393), [#17857](https://github.com/ollama/ollama/pull/17857))
- **Spurious GPU eviction** — PR #19284 prevents the scheduler from evicting a CPU-only runner to satisfy a GPU memory prediction on multi-GPU hosts. ([#19284](https://github.com/ollama/ollama/pull/19284))
- **MLX load stall detection** — PR #17834 reintroduces progress-based stall detection for slow/lazy MLX weight loads, avoiding premature timeout cancellations. ([#17834](https://github.com/ollama/ollama/pull/17834))

## 5. Stability & Regressions

Ranked by severity:

1. **ROCm KV-state cross-contamination (high)** — On Strix Halo (gfx1151 iGPU, `0.32.14-rocm`), responses are contaminated by the previous unrelated request's content. Intermittent, hard to detect, and potentially dangerous for multi-tenant or sequential agent workloads. 11 comments, no fix PR. ([#17847](https://github.com/ollama/ollama/issues/17847))
2. **`go_template` drops Qwen3 tool-call turns (high)** — With default template selection, `/api/chat` returns an empty assistant message with `tool_calls: null` despite `eval_count > 0`; llama.cpp's template parses the same generation correctly. Closed as of today; confirm fix in your next upgrade. ([#19377](https://github.com/ollama/ollama/issues/19377))
3. **CUDA warmup fallback (medium)** — Intermittent `CUDA error: shared object initialization failed` at model warmup on Windows/RTX 5070 Ti with `gpt-oss:20b`, silently falling back from `CUDA_Host` to CPU-pinned buffers. Performance-only impact but easily missed. ([#17380](https://github.com/ollama/ollama/issues/17380))
4. **OpenAI compat: `reasoning` dropped on content-array assistant turns (medium)** — Reasoning-only turns are deleted; non-empty parts retained. PR #19384 explicitly preserves reasoning and empty content arrays. ([#19380](https://github.com/ollama/ollama/issues/19380), [#19384](https://github.com/ollama/ollama/pull/19384))
5. **`/v1/models` returns `data: null` (low, strict-client risk)** — Breaks JSON-schema validators and typed SDKs. No fix PR yet. ([#19381](https://github.com/ollama/ollama/issues/19381))
6. **Invalid content types silently accepted alongside `tool_calls`** — PR #19389 will reject them instead of discarding. ([#19389](https://github.com/ollama/ollama/pull/19389))
7. **Model rollback UX** — Issue #19385 (14 comments) highlights there is no supported path to revert a model to a previous version after an update degrades quality. ([#19385](https://github.com/ollama/ollama/issues/19385))

## 6. What This Means for Application Developers

- **Agents with tool calling should test against the default `go_template` path.** Empty assistant turns with `tool_calls: null` are the worst failure mode for an agent loop. If you build on Qwen3 with tools, pin your Ollama version and add an assertion that any `done` turn has either non-empty content or non-null tool calls. ([#19377](https://github.com/ollama/ollama/issues/19377))
- **If you send `content` as an array (LangChain, LiteLLM, OpenAI SDK wrappers)**, reasoning fields may be silently dropped today and preserved after PR #19384. Track that PR before relying on reasoning continuity. ([#19384](https://github.com/ollama/ollama/pull/19384))
- **Multi-tenant deployments on ROCm iGPUs are not safe for sequential request isolation** until #17847 is fixed. For now, prefer per-process runners or serialized execution with explicit KV flush verification.
- **MLX users get meaningful concurrency and decoding controls soon** (`OLLAMA_NUM_PARALLEL`, `draft_num_predict=0`, repeat-token abort). If you benchmark spec decoding, these knobs give you a clean A/B without restarting the server.
- **For OpenAI-compatibility shims**, the next wave of merges closes several client-breaking null-handling and content-array gaps. If your downstream consumers are strict .NET/Java SDKs, plan an upgrade once #19381 and #19387 land.

*Links to all items are inline above. No release artifacts published in this window.*

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

Here's the LiteLLM digest for 2026-10-30.

---

# LiteLLM Digest — 2026-10-30

Source: [github.com/BerriAI/litellm](https://github.com/BerriAI/litellm)

## 1. Today's Highlights

LiteLLM ships release candidate **v1.108.0-rc.1** with signed Docker images via cosign, continuing the hardening of the release supply chain. The bulk of today's activity sits in cost/accounting correctness — streamed MCP tool calls billed as one call instead of two, `n>1` chat streams collapsing into a single choice in spend logs, and provider-reported `usage.cost` trusted verbatim as USD (producing phantom spend). A notable cluster of **breaking changes** is queued in open PRs around the proxy's `general_settings` handling and `/v1/responses` SSE framing, which will require client updates if merged.

## 2. Releases & Breaking Changes

- **v1.108.0-rc.1** — All LiteLLM Docker images now signed with [cosign](https://docs.sigstore.dev/cosign/overview/), key introduced in [commit `e82a3c6`](https://github.com/BerriAI/litellm/commit/e82a3c646908ba0a6ee0beddc4310d7a6cac4065). Release notes truncated, but signature verification is the headline. [Release](https://github.com/BerriAI/litellm/releases)
- **[OPEN, breaking] `fix(proxy)!: ignore stored general_settings keys no settings API manages`** — Since v1.103.0, stale Admin UI saves can resurrect removed settings from the DB (e.g. reintroducing a `user` field requirement that 401s Claude Code). PR applies only settings written by a settings API and warns on the rest. [PR #48967](https://github.com/BerriAI/litellm/pull/48967)
- **[OPEN, breaking] `fix(proxy)!: preserve Responses SSE event framing`** — Streamed `/v1/responses` will **drop `data: [DONE]`** and name every SSE event with a terminal event. Clients waiting on `[DONE]` or reading only unnamed `EventSource` messages must update. Chat keeps `[DONE]`. [PR #47980](https://github.com/BerriAI/litellm/pull/47980)
- **[OPEN, breaking] `fix(realtime)!: send the Gemini Live setup at the first content`** — Gemini/Vertex Live sessions currently drop the client's `session.update` because the proxy sends its own audio setup at connect; fix defers setup to first content so instructions/tools apply. Text clients currently receive audio. [PR #39864](https://github.com/BerriAI/litellm/pull/39864)
- **[OPEN, breaking] `fix(mcp)!: answer 400 for a hosted MCP tool a translated route cannot run`** — Hosted MCP tools pointing at an MCP server URL were silently dropped (and returned 200) on Bedrock, Gemini/Vertex, DeepSeek, Databricks Claude, GigaChat, Ollama routes. Now returns 400 (or drops under `drop_params`). [PR #48931](https://github.com/BerriAI/litellm/pull/48931)

## 3. New Model & Hardware Support

- **DashScope image edits and TTS** — `feat(dashscope): add image edits and text-to-speech` adds `/v1/images/edits` and `/v1/audio/speech` for DashScope (previously 500/404). Also changes billing: image edits now bill the deployment's own image price on any provider. [PR #48998](https://github.com/BerriAI/litellm/pull/48998)
- **Kimi K3 (Moonshot), Inkling (Thinking Machines Lab), Tinker platform** — Open feature request for native first-class support across SDK and proxy. [Issue #33921](https://github.com/BerriAI/litellm/issues/33921)
- **Azure AI Foundry Agents v2 (Responses API + `agent_reference`)** — Closed; support for the non-Assistant-based Foundry agent experience. [Issue #25372](https://github.com/BerriAI/litellm/issues/25372)
- **Soniox real-time streaming STT (`stt-rt-v5`)** — Open feature request for WebSocket streaming transcription through the proxy. [Issue #43677](https://github.com/BerriAI/litellm/issues/43677)
- **Gemini context caching with custom `api_base`** — Bug where cache URL was not model-scoped and auth header malformed; closed. Fix matters if you route Gemini through a gateway/proxy. [Issue #34872](https://github.com/BerriAI/litellm/issues/34872)

## 4. Performance & Optimization

- **OTPM reservation cap** — `fix(router): cap the default OTPM reservation and reconcile token counters after each call`. Previously a request without `max_tokens` reserved the model's *entire* max output against deployment `otpm`, so a deployment whose model max exceeds its otpm returned **429 on every unbounded request**. Now reserves at most a quarter of otpm (or the smaller deployment cap) and reconciles counters post-call. [PR #49054](https://github.com/BerriAI/litellm/pull/49054)
- **TPM reservation double-counting** — Responses API TPM reservation counts base64 image payloads inside `custom_tool_call_output.output[]` as text via `str(item)`, **doubling the estimate**. Closed; worth checking your release. [Issue #47814](https://github.com/BerriAI/litellm/issues/47814)
- **Web search routing** — Router now prefers `supports_web_search: true` deployments within each `order` tier, even over session/API-key pins. Previously web-search requests could land on a non-search deployment and fail or silently skip the search. [PR #49005](https://github.com/BerriAI/litellm/pull/49005)
- **vLLM passthrough fields** — `stop_reason` and `token_ids` preserved on vLLM chat choices and stream chunks (also on `/v1/completions`, cache hits). [PR #48393](https://github.com/BerriAI/litellm/pull/48393)
- **Proxy DB architecture** — Series of refactors injecting per-repository FastAPI dependencies and a single lifespan owner for DB shutdown, so a request builds only the repositories it uses and failed startup/cancellation closes the runtime completely. [PR #48507](https://github.com/BerriAI/litellm/pull/48507), [PR #48506](https://github.com/BerriAI/litellm/pull/48506), [PR #49116](https://github.com/BerriAI/litellm/pull/49116)

## 5. Stability & Regressions

Ranked by severity:

1. **[OPEN] Streamed chat completions logged at $0** — When upstream reports `usage.cost: 0` alongside real cost elsewhere, spend rows and `cost_breakdown.input_cost` record 0. Affects **all streaming traffic** for those providers; budgets read 0. [Issue #48937](https://github.com/BerriAI/litellm/issues/48937)
2. **[CLOSED] Provider-reported `usage.cost` trusted verbatim as USD** — No unit validation; a non-USD-denominated value causes **astronomical phantom spend**. [Issue #35829](https://github.com/BerriAI/litellm/issues/35829)
3. **[OPEN] Gemini streaming tool context corruption** — `stream_chunk_builder` corrupts Gemini `server_side_tool_invocations` and `thought_signatures`, causing `400 Corrupted tool call context` on follow-up turns. Reported since April, still open. [Issue #25869](https://github.com/BerriAI/litellm/issues/25869)
4. **[OPEN] Claude tool calling broken** — Reported with OpenRouter/Vertex Claude Sonnet 4.5 via Kilo Code/Roo Code. [Issue #19858](https://github.com/BerriAI/litellm/issues/19858)
5. **[OPEN] In-memory spend buffers dropped on proxy shutdown** — `update_spend` / `update_daily_tag_spend` are APScheduler jobs; silent data loss on shutdown. **Unbilled spend + broken budget ceilings.** [Issue #34805](https://github.com/BerriAI/litellm/issues/34805)
6. **[OPEN] `provider_budget_config` reports `budget_reset_at` ~57 years in the future without Redis** — Monthly budgets effectively never reset. [Issue #37261](https://github.com/BerriAI/litellm/issues/37261)
7. **[OPEN] `/cursor/chat/completions` returns 200 but creates no SpendLogs entry** — Provider charged, LiteLLM blind to it. [Issue #30126](https://github.com/BerriAI/litellm/issues/30126)
8. **[OPEN] Streaming MCP auto-execute bills only one of two model calls** — Fix PR open. [PR #48899](https://github.com/BerriAI/litellm/pull/48899)
9. **[OPEN] `n>1` chat streams collapse to one choice pre-logging** — `tool_permission` returned every tool call in one choice; spend logs kept only first choice. Fix PR open. [PR #49002](https://github.com/BerriAI/litellm/pull/49002)
10. **[CLOSED] HTTP GET on module import** — LiteLLM fired a network request at import time by default: slow, and hostile in sandboxed/offline environments. [Issue #22159](https://github.com/BerriAI/litellm/issues/22159)
11. **[OPEN] Valid API key rejected with "Invalid proxy server token passed"** since 1.82.3+. [Issue #24680](https://github.com/BerriAI/litellm/issues/24680)
12. **[OPEN] Editing a reusable credential can overwrite real secrets with masked placeholders** (`sk-p****cdef`). [Issue #28906](https://github.com/BerriAI/litellm/issues/28906)
13. **[OPEN] Bedrock `/v1/audio/transcriptions` 400** — system message incompatible with audio blocks. Closed. [Issue #41544](https://github.com/BerriAI/litellm/issues/41544)
14. **[OPEN] `/v1/audio/speech` fails for OpenRouter TTS models** — provider mapping 500. [Issue #42111](https://github.com/BerriAI/litellm/issues/42111)
15. **[OPEN] MCP guardrail blocks can now return HTTP 400** (opt-in, streaming-safe) so apps can detect blocks from status code. [PR #49151](https://github.com/BerriAI/litellm/pull/49151), [PR #49153](https://github.com/BerriAI/litellm/pull/49153)
16. **[OPEN] `stream_chunk_builder`/guardrail error masking** — `/v1/messages` stream failures had upstream errors replaced with a generic 400, preventing Claude Code retries. Fix PR open. [PR #49088](https://github.com/BerriAI/litellm/pull/49088)

## 6. What This Means for Application Developers

- **Do not trust spend numbers if you stream.** Two open bugs (#48937, #48899) plus one closed (#35829) mean streamed traffic can be logged at $0, double-counted, or inflated to absurd values when an upstream returns a non-USD `cost` field. If you enforce budgets, verify against provider-side billing, and audit `LiteLLM_SpendLogs` for `cost_breakdown` sanity.
- **Budget enforcement is unreliable without Redis.** In-memory spend buffers are dropped on shutdown (#34805) and provider budgets may never reset (#37261). For hard cost ceilings, configure Redis and externalize budget reconciliation.
- **Pin your SSE client code before upgrading past the Responses SSE change.** If you consume `/v1/responses` streams and wait on `data: [DONE]`, this is coming (#47980). Chat completions are unaffected.
- **Upgrading from <1.103.0 carries a stale-settings trap.** An old Admin UI save can reintroduce removed `general_settings` from the database — including one that breaks Claude Code with a 401 (#48967). Review your stored settings before upgrading.
- **Unbounded requests may be 429ing today.** If you don't set `max_tokens` and hit 429s on deployments whose model max exceeds `otpm`, the router reservation bug (#49054) is the likely cause. Workaround until merged: set explicit `max_tokens`.
- **Gemini + streaming + tools is a rough edge.** Corrupted tool-call context on follow-up turns (#25869) remains open after 6+ months. For agentic Gemini workloads, consider non-streaming tool turns or a different provider path.
- **MCP behavior is becoming stricter.** Hosted MCP tools on translated routes (Bedrock, Vertex Gemini, DeepSeek, Ollama) will start returning 400 instead of silently dropping the tool (#48931). If you rely on the current silent-drop behavior, that's a behavior change, not just an error-surface change.

---

*Note: this digest is based on the provided snapshot only. Several releases/issues reference dates well in the future relative to typical training data; treated as given.*

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-10-30

## 1. Today's Highlights

No new releases landed in the past 24 hours, but PR activity is heavy: a wave of Studio/Desktop bug-fix PRs addresses long-standing memory-estimation, context-compaction, and agent tool-calling issues. Notable engineering work includes an opt-in fused NF4 decode path for Llama (1.6–2.3x per-token speedup in eager generate) and an attention-score memory-estimation fix for MLX. On the issue side, Windows/AMD commit-charge exhaustion, MLX memory mis-estimation, and dataset-format failures in Desktop training dominate the bug funnel.

## 2. Releases & Breaking Changes

None. No releases published in the last 24h. (Desktop users are on `v0.1.911-beta` / `v0.1.912-beta`; several regressions below are reported against those builds — see §5.)

## 3. New Model & Hardware Support

- **[OPEN] Add EXL3 (ExLlamaV3) quantization backend** — adds a bitsandbytes alternative supporting 2/3/4/6/8-bit and fractional bitrates, plus MoE quantization (which bnb cannot do under transformers 5). Additive change. [PR #7115](https://github.com/unslothai/unsloth/pull/7115)
- **[OPEN] Support LFM3-1.7B** — community request for LiquidAI's new LFM3 family; 10 👍, highest-engagement open feature request today. [Issue #15588](https://github.com/unslothai/unsloth/issues/15588)
- **[OPEN] Studio: add MiniMax to Connections** — dedicated connection type because MiniMax-M3.1-Flash accepts reasoning effort up to `max` but rejects thinking-off (400), while MiniMax-M3 can only toggle thinking off. [PR #16011](https://github.com/unslothai/unsloth/pull/16011)
- **[OPEN] Studio: add OpenCode Zen / OpenCode Go to Connections** — hardcodes correct base URLs (OpenCode has moved them repeatedly) and filters free-tier models not served to third-party apps. [PR #16010](https://github.com/unslothai/unsloth/pull/16010)
- **[OPEN] Studio: stop offering the VibeVoice q4-ios GGUF** — the listed `Q4` variant cannot be loaded by the bundled audio.cpp runtime (quantized tensor byte-size mismatch); PR removes it from the picker. [PR #16048](https://github.com/unslothai/unsloth/pull/16048)
- **[OPEN] AMD: exclude iGPU from Train page VRAM total and default GPU pick** — on dual R9700 + Ryzen systems the integrated gfx1036 reports 36 GiB shared system RAM, inflating the displayed VRAM to 100 GiB and mis-selecting GPU 2 by default. [PR #14039](https://github.com/unslothai/unsloth/pull/14039)

## 4. Performance & Optimization

- **[OPEN] Opt-in fused batch-1 NF4 decode for Llama (`UNSLOTH_DECODE_FUSED_NF4=1`)** — cuts ~12 kernel launches per decoder layer (27–33 with LoRA) down to a fused path; measured **1.6–2.3x per-token** in eager generate at batch size 1. Default behavior unchanged. [PR #16032](https://github.com/unslothai/unsloth/pull/16032)
- **[OPEN] Gemma 3: generate on the non-flex attention path** — on sm80+ NVIDIA and ROCm, `generate()` currently routes every single-token decode step through flex_attention's eager math fallback (vmap'd mask/score mods, dense logsumexp). PR bypasses flex during generation while keeping it for training. [PR #16041](https://github.com/unslothai/unsloth/pull/16041)
- **[OPEN] Studio MLX memory estimate: charge attention scores where MLX actually holds them** — previously only quantized-KV runs were charged an attention score matrix; full-width (f16) cache under mlx 0.32.4 also falls back to unfused attention and builds the full `[heads, ctx]` matrix. Fixes over/under-estimation. [PR #16021](https://github.com/unslothai/unsloth/pull/16021)
- **[OPEN] Hybrid token count: byte-count estimate + scaled timeout** — large GGUF chat transcripts took ~2 min per send and then failed with "Message too long" because `llama-server` could not render the chat template inside the token-count timeout; hybrid estimate avoids the round trip. [PR #15857](https://github.com/unslothai/unsloth/pull/15857)
- **[CLOSED] Studio: multiple resident GGUF models** — optional multi-model residency, each in its own `LlamaCppBackend`/`llama-server` process, with request routing by model name. [PR #10876](https://github.com/unslothai/unsloth/pull/10876)

## 5. Stability & Regressions (ranked by severity)

1. **Windows + AMD: `llama-server` holds ~16 GB commit charge after GGUF load** — even with "Don't reserve system RAM" and a model fully in VRAM; commit limit exhausted on a 32 GB machine. Fix PR exists: warns when a load leaves the system short of commit. [Issue #16015](https://github.com/unslothai/unsloth/issues/16015) → [PR #16046](https://github.com/unslothai/unsloth/pull/16046)
2. **Core dumps / model hangs since updates ~2 weeks ago** — models stop responding after a few turns regardless of KV usage; ejecting the model core-dumps. Closed, but root cause in llama/server logs not clearly identified. [Issue #14411](https://github.com/unslothai/unsloth/issues/14411)
3. **Regression: previously working model no longer loads after Desktop update (macOS, 0.1.912-beta)**. [Issue #15932](https://github.com/unslothai/unsloth/issues/15932)
4. **Training data loss on Desktop: Alpaca dataset dropped 80%+ with "Train on completions"** — the Alpaca template is never installed but masking still searches for its markers. Reproduced across two model families on Win11/RTX 5060 8 GiB. Two issues filed (one closed, one open). [Issue #15894](https://github.com/unslothai/unsloth/issues/15894) / [Issue #15895](https://github.com/unslothai/unsloth/issues/15895)
5. **Single-column datasets untrainable** — JSONL with only `text` (or `content`) reports `Format: unknown`, AI Assist declines, Start silently returns to preview. Two closed issues. [Issue #15892](https://github.com/unslothai/unsloth/issues/15892) / [Issue #15901](https://github.com/unslothai/unsloth/issues/15901)
6. **Agents handed truncated tool calls as valid** — Anthropic-compatible endpoint converted a tool call cut off at `max_tokens` into a complete call with valid arguments; coding agents then execute partial `Write`s. Fix PR: drop truncated tool calls. [PR #16035](https://github.com/unslothai/unsloth/pull/16035)
7. **Context never compacts on resumed long conversations (web UI)** — long chats become non-continuable. [Issue #15800](https://github.com/unslothai/unsloth/issues/15800)
8. **Anthropic passthrough (`/v1/messages`) returns 400 `exceed_context_size_error` instead of auto-compacting** when history exceeds `n_ctx` (closed). [Issue #15417](https://github.com/unslothai/unsloth/issues/15417)
9. **MLX memory estimator reports 69.7 GiB for a model that loads on a 24 GB Mac** (macOS 27.2). [Issue #15935](https://github.com/unslothai/unsloth/issues/15935)
10. **Linux desktop theme-switch crash** — `document.startViewTransition` aborts WebKitGTK 2.54.x with accelerated compositing off. Fix PR: skip the transition on Linux. [PR #16040](https://github.com/unslothai/unsloth/pull/16040)
11. **Minor/lower-severity:** laggy AppImage Studio UI [Issue #15999](https://github.com/unslothai/unsloth/issues/15999); Dolphin Venice Edition via MLX not rendered correctly in UI [Issue #15858](https://github.com/unslothai/unsloth/issues/15858); LFM3 MLX models missing from `curl /v1/models` [Issue #15832](https://github.com/unslothai/unsloth/issues/15832); MiniCPM-V-4.7-1B text generation failure on Vulkan (closed) [Issue #14987](https://github.com/unslothai/unsloth/issues/14987); NVFP4 CPU fallback for MiniMax-M3.1 GGUF on Apple Silicon despite full layer offload (closed) [Issue #15409](https://github.com/unslothai/unsloth/issues/15409); ModelScope blocks model files >50 GB [Issue #15989](https://github.com/unslothai/unsloth/issues/15989); textarea content duplicated across chat tabs (web UI) [Issue #15782](https://github.com/unslothai/unsloth/issues/15782); Desktop self-update failure [Issue #15866](https://github.com/unslothai/unsloth/issues/15866).
12. **Training/packaging correctness:** Kaggle notebooks for Muse Glimmer pin a questionable TRL version [Issue #16034](https://github.com/unslothai/unsloth/issues/16034); Hub download worker plans from `model_info` but calls `snapshot_download` without a revision, so a moving `main` can cause a manifest/commit mismatch — fix pins the planned commit [PR #16047](https://github.com/unslothai/unsloth/pull/16047).

## 6. What This Means for Application Developers

- **If you serve Llama 4-bit models:** `UNSLOTH_DECODE_FUSED_NF4=1` is worth benchmarking now — 1.6–2.3x per-token at batch 1 with no default behavior change. Single-user/agent workloads are the sweet spot.
- **If you build agents on the Anthropic-compatible endpoint:** upgrade once PR #16035 lands. Truncated tool calls were being returned as valid, and agents execute them — silent data-loss risk for file-writing tools. Also note `/v1/messages` still fails hard (400) rather than auto-compacting on context overflow; size your `n_ctx` with headroom or compact client-side ([#15417](https://github.com/unslothai/unsloth/issues/15417), [#15800](https://github.com/unslothai/unsloth/issues/15800)).
- **MCP tool sprawl has a cost:** with all 23 Studio MCP tools enabled, ~18k tokens of tool definitions are consumed per agent turn before any work happens. Per-tool switches at Settings > Agents are in review. [PR #15629](https://github.com/unslothai/unsloth/pull/15629)
- **Windows + AMD GGUF deployments:** watch commit charge, not just VRAM. A fully-offloaded model can still exhaust the page file (16 GB commit for a VRAM-resident model). PR #16046 adds a preflight warning; until then, budget commit ≈ GPU buffer size.
- **Desktop training users:** validate your datasets before long runs. Single-column JSONL and Alpaca + "Train on completions" currently fail or silently drop 80%+ of samples — use multi-turn/chat-format JSONL with explicit column mapping until fixes ship.
- **Multi-model serving:** the multi-resident GGUF backend ([PR #10876](https://github.com/unslothai/unsloth/pull/10876), now closed) enables per-model `llama-server` processes with name-based routing — useful for A/B model serving behind one endpoint.
- **Production gateways:** OpenCode and MiniMax now have first-class connections, and managed accounts will be able to add localhost/LAN MCP servers ([PR #16044](https://github.com/unslothai/unsloth/pull/16044)) — relevant if you run MCP servers co-located with the gateway.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*