# AI Infrastructure Digest 2026-11-27

> Generated: 2026-11-27 03:35 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project AI Infrastructure Report — 2026-11-27

## 1. Ecosystem Overview

Today's activity shows the inference stack bifurcating along a clear axis: **serving engines (vLLM, SGLang) are hardening for a 1.0-era stability contract** — explicit config errors, KV-tier integrity, unified memory arenas — while **local runtimes (llama.cpp, Ollama) absorb a burst of new model architectures (Inkling 2 family, RAON-1-mini, Domyn Edge) with accompanying teething bugs**. The **gateway layer (LiteLLM) is quietly rewriting itself in Rust**, moving auth, team lookup, and `drop_params` off the Python hot path — a signal that gateway throughput is now a first-class bottleneck for agentic workloads. On the **training side (Unsloth)**, the notable thread is numerical correctness (MoE TF32→IEEE, FP8 on sm_12x, MLX pinning) rather than headline features. Across all five projects, the same themes recur: **KV-cache tiering and offload**, **speculative decoding economics**, and **cross-vendor hardware coverage** (Blackwell, ROCm gfx950, XPU, Ascend NPU, Apple MLX).

## 2. Activity Comparison

| Project | Layer | Issues (active today) | PRs (touched today) | Release status (24h) | Release cadence |
|---|---|---|---|---|---|
| **vLLM** | Serving engine | ~10 top-of-board (incl. 2 closed today) | Several in flight (MoRIIO, streaming, Responses API) | None | Track-based; Rust frontend + Transformers backend pending |
| **SGLang** | Serving engine | ~10 tracked (1 operationally urgent: #53309) | Multiple (Ascend, XPU, diffusion) | None | 1.0 Release Tracker active (#50045) |
| **llama.cpp** | Local runtime | ~14 ranked (2 closed today) | Multiple (Inkling fusion, FA bias, Vulkan/SYCL fixes) | **v1.1.0 shipped** | Frequent b-tag releases; Windows CUDA prebuilts stale |
| **Ollama** | Local runtime | ~9 ranked | Several (Inkling CUDA, MLX int4, mid-stream error propagation) | **v0.40.19-rc0** | RC cadence; 0.40.17/18 have regressions |
| **LiteLLM** | Gateway | ~14 ranked (highest single project) | **10+ native Rust gateway PRs** | **v1.108.19 LTS** + v1.113.0-dev.1 | LTS line + dev cuts |
| **Unsloth** | Training / fine-tuning | 23 | **279** | None | High-velocity PR churn; MLX pinned 0.32.5 |

**Read:** Unsloth has by far the highest raw churn (23 issues, 279 PRs) but it's concentrated in UI/Studio regressions. LiteLLM has the highest *architectural* PR density (the Rust gateway stack). llama.cpp and Ollama are the only shippers today.

## 3. Model Support Race

| Model / Arch | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **Inkling 2 family** | — | — | ✅ v1.1.0 (base, Mini, DSpark) | 🔄 CUDA backend in PR #19909 | ✅ reasoning fix #19859 |
| **Kimi K2.5 / K3 / K3.1** | ✅ Mooncake KV, video sampling | ✅ video sampling #53473 | — | — | — |
| **Qwen 3.5 / 3.6 / 3.8 / 4Exp** | ✅ SM100 kernels, seq-parallel | ✅ GPTQ MTP fix | (Gated DeltaNet issues) | (prefix-cache leak) | ✅ Qwen-VL Conv3d fix |
| **DeepSeek V4.1** | 🔄 PcieIpcAllGather | ✅ Ascend A5 PD | — | — | — |
| **GLM 5.x** | 🔄 perf tracker #57406 | — | — | — | — |
| **RAON-1-mini** | — | — | ⚠️ v1.1.0 (tensor-count bug #33099) | — | — |
| **Domyn Edge / Zaya1 / Hy4-flash** | — | — | ✅ v1.1.0 | — | — |
| **Ming-Image / PPLX Decider / WePM** | — | — | — | 🔄 MLX runner #19734 | 🔄 requested #19767 |
| **Nemotron-3.5-Transcribe** | — | — | — | — | ⚠️ unsupported TP #19515 |

**Who's ahead:**
- **Frontier hosted models (Kimi K3, Qwen 4, DeepSeek V4.1):** vLLM and SGLang are the clear leaders — the frontier archs land server-side first.
- **Newest open-weight families (Inkling 2, RAON-1, Zaya1):** llama.cpp and Ollama ship day-one, with beta-grade bugs.
- **Multi-modal / robotics (PPLX, Pi0.5, VLA):** SGLang (Diffusion + robotics roadmap #53203) and Ollama (MLX runner) are pulling ahead on non-text workloads.

## 4. Performance Frontier

Optimization is *not* uniform — each project is attacking a different sub-bottleneck:

| Sub-area | Hotspot today | Representative work |
|---|---|---|
| **KV cache / offload** | vLLM (dominant) | HiSparse DMA batching, UMBP lookup skip, PcieIpcAllGather, FS-tier integrity, promotion staleness |
| **Batching / scheduling** | vLLM | Admission overload 503 gate, preemption-rate sliding window, Triton MoE warmup |
| **Quantization kernels** | vLLM + llama.cpp + Unsloth | Marlin→Humming (NVIDIA), MXFP4/FP4 (Ascend), FP8 sm_12x, SYCL Q6_K |
| **Distributed serving** | SGLang + vLLM | Ascend A5 PD index-KV, Eager Sequence Parallelism (Qwen 3.5), GB300 custom all-reduce |
| **Fused kernels** | llama.cpp + Unsloth | Inkling 2 chain fusion (CUDA), FA indexed bias, MoE grouped GEMM IEEE fix |
| **Speculative decoding** | llama.cpp (pain) | 2.2–2.4× hybrid slowdown #32776; DFlash split draft methods |
| **Detokenization / sampling** | SGLang | NPU top-p+top-k fusion (25.8ms → single pass), Rust tokenizer parity |

**Takeaway:** vLLM owns the KV-tiering story; llama.cpp owns model-family fusion; SGLang owns non-NVIDIA hardware paths; Unsloth owns training-time numerics. There's little duplication — the ecosystem is *vertically* coordinated, not converged.

## 5. Layer Positioning

```
┌────────────────────────────────────────────────────────────────┐
│  APPLICATION / AGENT HARNESS (Codex CLI, Claude Code, MCP)      │
├────────────────────────────────────────────────────────────────┤
│  LLM GATEWAY        │  LiteLLM  (auth, routing, guardrails)   │
├─────────────────────┼──────────────────────────────────────────┤
│  SERVING ENGINE     │  vLLM (generalist)  │  SGLang (multimodal, │
│                     │  Rust frontend soon │  NPU/ROCm, robotics) │
├─────────────────────┼──────────────────────────────────────────┤
│  LOCAL RUNTIME      │  llama.cpp (libllama, ggml)  │  Ollama   │
│                     │  embedding surface        │  (wrapper) │
├─────────────────────┴──────────────────────────────────────────┤
│  TRAINING / FINE-TUNE   │  Unsloth (LoRA, MoE, MLX, Studio)    │
└────────────────────────────────────────────────────────────────┘
```

- **vLLM & SGLang** are peer serving engines with different bets: vLLM on KV-cache virtualization and NVIDIA kernel churn (Marlin→Humming); SGLang on hardware breadth (Ascend, XPU, ROCm) and non-LLM modalities (Diffusion, VLA).
- **llama.cpp** is the *substrate* (libllama/ggml) that others embed — its `llama_batch → llama_batch_ext` deprecation radiates into Ollama and downstream forks.
- **Ollama** is a runtime *wrapper* with a UI/desktop surface — its bugs trend toward integration and install-script issues rather than kernel correctness.
- **LiteLLM** is the only true *control-plane* project today; its Rust rewrite signals gateways are becoming production-critical, not just convenience layers.
- **Unsloth** is the only *training-side* project; its output posture (adapters, GGUF, MLX) feeds the local-runtime layer directly.

## 6. Trend Signals

**A. The Rust-ification of the hot path.** Both vLLM (Rust frontend becoming default) and LiteLLM (native Rust gateway: #54580, #54581, #54708, #54778, #54600) are moving request-critical paths out of Python. **Implication:** if you maintain Python hooks in gateways or custom frontends, plan for parity work in the next two release cycles.

**B. KV cache is the new moat.** vLLM's entire top-10 stability list (#66782, #62532, #54363), SGLang's Unified Memory roadmap (#49944), and llama.cpp's `--cache-ram` semantics all converge on *what to keep, where, and for how long*. Agent developers should watch **session-aware KV hints (vLLM #52113) and AOT pinned prefixes / KV-Cartridges (SGLang #53151)** — these directly affect multi-turn cache-hit economics.

**C. Silent-failure patterns are the current regression class.** Three of the six projects shipped fixes this week for *incorrect responses that return HTTP 200*: Ollama #19934 (mid-stream errors masked), LiteLLM #38610 (fallback emits SSE error inside 200), SGLang #41236 (detokenizer token loss). **Action:** add content-length and end-of-stream sanity checks to client wrappers regardless of your stack.

**D. Speculative decoding is in a "cost-check" phase.** llama.cpp splits DFlash into separate draft methods and flags a 2.2–2.4× hybrid slowdown (#32776); vLLM/Marlin migration changes kernel selection behavior. Expect per-arch regression testing to become a normal part of draft-model rollouts.

**E. The security perimeter is shifting to tool-call parsers.** SGLang's regex catastrophic backtracking (#52090), Ollama's parser drops (#19935), Unsloth's Godot MCP sandbox bypass (#19769), and LiteLLM's MCP stateful session key bleed (#35383) all point to **tool-call handling as the newest attack surface**. If you expose function calling on shared endpoints, put a body-size + rate limit at the proxy and audit marker-string escaping end-to-end.

**F. Non-NVIDIA hardware is now a first-class release target.** SGLang (Ascend NPU, XPU, gfx950), vLLM (ROCm fp8_ds_mla, XPU/XCCL), llama.cpp (SYCL/XMX, Adreno A850, Panther Lake), and Unsloth (AMD XDNA, Strix Halo) all shipped or fixed non-CUDA paths today. **Action:** if you're planning capacity diversification off H100/Blackwell, the software gap is closing — but pin versions per-arch.

**G. Two deprecations to schedule now:**
- **llama.cpp `llama_batch` → `llama_batch_ext`** — affects any product embedding libllama.
- **LiteLLM OpenAI Evals integration** — hard deadline **Nov 30, 2026**; no fallback path documented in issue #47212.

**Bottom line for decision-makers:** the stack is maturing *in layers*, not converging. Choose your layer deliberately — vLLM for generalist served inference, SGLang for non-NVIDIA or non-LLM modalities, llama.cpp/Ollama for on-prem and desktop, LiteLLM for control plane, Unsloth for adapter training — and budget for the two migrations above plus a client-side response-validation pass this quarter.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-27

## 1. Today's Highlights

No new releases landed in the last 24h, but maintainer attention is concentrated on the KV-offload/connector stack (promotion semantics, scheduler re-admission stalls, filesystem tier integrity), NVIDIA kernel modernization (Marlin → Humming), and the planned Rust frontend becoming the default `vllm serve` path. Several long-running correctness issues were closed today — notably the Kimi-K2.6 reasoning/tool-calling bug (#42426) and a Blackwell NVFP4 + DFlash + torch.compile SIGSEGV (#48234) — while the top open issue on the board remains the ViT Full CUDA Graph RFC (#38175).

## 2. Releases & Breaking Changes

No releases in the last 24h. Two forward-looking compatibility items are worth tracking:

- **Rust frontend to become default** for supported configurations in the near future: [vllm#68784](https://github.com/vllm-project/vllm/issues/68784). Functionality gated on specific startup configs is not yet covered — verify your launch flags.
- **Planned retirement of native Llama / Qwen2-derived models** in favor of the Transformers modeling backend: [vllm#67937](https://github.com/vllm-project/vllm/issues/67937). Custom forks built on `vllm/model_executor/models/llama.py` will need migration.
- **Proposed unified `--lm-head-config`** flag replacing `draft_lm_head_quantization` and `quantization_config.targets` lm_head patterns, with per-arch `auto` defaults: [vllm#68711](https://github.com/vllm-project/vllm/issues/68711).

## 3. New Model & Hardware Support

- **Kimi K2.5 / K3 KV cache on Mooncake**: HiSparse host-pool imports for sparse-MLA prefiller → HiSparse decoder topologies merged ([vllm#66502](https://github.com/vllm-project/vllm/pull/66502), closed).
- **Qwen4Exp SM100 kernel**: fused hyperconnection down-projection + inject + SiLU `tcgen05` kernel for Blackwell ([vllm#70160](https://github.com/vllm-project/vllm/pull/70160)).
- **Eager Sequence Parallelism for Qwen 3.5**: first in a series implementing fused AllGather+GEMM / GEMM+ReduceScatter per RFC #61626 ([vllm#61644](https://github.com/vllm-project/vllm/pull/61644)).
- **DSpark batch-sharded sequential sampling enabled on Intel XPU/XCCL** ([vllm#68598](https://github.com/vllm-project/vllm/pull/68598)).
- **ROCm/HY4 fp8_ds_mla with attention sinks**: HY4 and HY4 Flash can now use `fp8_ds_mla` KV cache on gfx950 ([vllm#70004](https://github.com/vllm-project/vllm/pull/70004), closed).
- **Multimodal EPD fix**: per-video `fps`/`num_frames` kwargs now preserved during encoder fan-out for Qwen3-VL ([vllm#70167](https://github.com/vllm-project/vllm/pull/70167)); Rust frontend accepts `<video>` markers in tokenized prompts ([vllm#69769](https://github.com/vllm-project/vllm/pull/69769)).

## 4. Performance & Optimization

- **Marlin → Humming migration** across NVIDIA architectures: Humming now covers all Marlin formats (INT4/INT8 GPTQ/AWQ, FP8, MXFP8/FP4, NVFP4, MXFP6) including MoE, and provides Hopper/Blackwell architecture-specific paths Marlin lacks ([vllm#65560](https://github.com/vllm-project/vllm/issues/65560)).
- **PcieIpcAllGatherWorkspace proposal** for latency-bound TP all-gathers (targeting DeepSeek-V4.1-Flash Engram embedding tables, compressor, drafter) ([vllm#65359](https://github.com/vllm-project/vllm/issues/65359)).
- **UMBP lookup optimization**: skip probing ranks for objects the first rank doesn't hold — on 8-rank Kimi K3 deployments long prompts send tens of thousands of queries per lookup ([vllm#67943](https://github.com/vllm-project/vllm/pull/67943)).
- **HiSparse host-row DMA descriptor batching** to remove repeated CPU work in the KV offload path ([vllm#70259](https://github.com/vllm-project/vllm/pull/70259)).
- **UMBP eviction watermarks defaulted to 0.99/0.97** for embedded DRAM pools (previously averaged ~80% full) ([vllm#67944](https://github.com/vllm-project/vllm/pull/67944)).
- **Admission overload protection**: opt-in `--max-preemption-rate` sliding-window gate returning HTTP 503 during KV thrashing ([vllm#70174](https://github.com/vllm-project/vllm/pull/70174)).
- **Triton fused MoE GEMM warmup** for shapes where DeepGEMM declines (N ≤ 512 early-out with high TP) ([vllm#55268](https://github.com/vllm-project/vllm/pull/55268)).
- **ROCm Qwen3.8-Flash-Next gfx950/MI355X tracker** remains active ([vllm#59575](https://github.com/vllm-project/vllm/issues/59575)); **GLM 5.3 optimization** continuing from GLM 5.2 work ([vllm#57406](https://github.com/vllm-project/vllm/issues/57406)).

## 5. Stability & Regressions

Ranked by severity (fix status noted):

1. **KV promotion/staleness bug (open)** — request-level promotions decided at lookup but materialized later cause stale budgets, over-commit, lifetime bans, and self-evicting promotions ([vllm#66782](https://github.com/vllm-project/vllm/issues/66782)).
2. **1.0–1.8s scheduler stall (open)** — re-queueing stall for completed async KV pulls under V1 + TieringOffloadingSpec/NixlConnector ([vllm#62532](https://github.com/vllm-project/vllm/issues/62532)).
3. **Startup memory-profiling assertion (open)** — aborts whenever free memory grows, contradicting documented co-tenancy support on H100 NVL/v0.29.0 ([vllm#56830](https://github.com/vllm-project/vllm/issues/56830)).
4. **Qwen3.8-Flash-Next decode starvation (open)** — 3–7 minute stalls on 2-node DGX Spark TP2 under long-prefill workloads ([vllm#54919](https://github.com/vllm-project/vllm/issues/54919)).
5. **GLM 5.2 MTP hang on MI300X (open)** — RCCL "no transport for peer" deadlock in vocab-parallel logits all-gather during first spec-decode step ([vllm#48568](https://github.com/vllm-project/vllm/issues/48568)).
6. **Qwen3.6 MoE CT INT4 checkpoint incompatibility (open)** — packed `shared_expert_gate` vs. expected float `weight` ([vllm#68336](https://github.com/vllm-project/vllm/issues/68336)).
7. **Auto-round quantized lm_head crash (closed today)** — hardcoded `lm_head_quantized=False` on checkpoints auto-round legitimately produces ([vllm#49137](https://github.com/vllm-project/vllm/issues/49137)).
8. **Kimi-K2.6 "!!!!!!!!!!" reasoning corruption (closed today)** — intermittent null content with kimi_k2 parsers on 8×B200 ([vllm#42426](https://github.com/vllm-project/vllm/issues/42426)).
9. **NVFP4 + DFlash + torch.compile SIGSEGV on SM120 (closed today)** — Qwen3.6-27B on Blackwell ([vllm#48234](https://github.com/vllm-project/vllm/issues/48234)).
10. **Filesystem KV offload tier (open)** — no data integrity verification, unbounded I/O latency ([vllm#54363](https://github.com/vllm-project/vllm/issues/54363)).

Fix PRs in flight: MoRIIO WRITE-mode hang for layers sharing KV cache, e.g. Gemma 4 MTP ([vllm#68374](https://github.com/vllm-project/vllm/pull/68374)); MoRIIO kernel-block-split MLA views ([vllm#60783](https://github.com/vllm-project/vllm/pull/60783)); streaming admission rejection now eagerly surfaced before HTTP response starts ([vllm#70171](https://github.com/vllm-project/vllm/pull/70171)); Responses API tool-call streaming when delta omits `function.name` ([vllm#70260](https://github.com/vllm-project/vllm/pull/70260)).

## 6. What This Means for Application Developers

- **Agentic workloads**: the session-aware KV cache hints RFC ([vllm#52113](https://github.com/vllm-project/vllm/issues/52113)) and prompt-token-ID forwarding ([vllm#65502](https://github.com/vllm-project/vllm/issues/65502)) aim to let gateways route prefix-cache-aware *and* avoid double rendering/tokenization — if you run a router in front of vLLM, these are the hooks to watch.
- **Rendering offload**: the `vllm.Render` gRPC sidecar expansion to completions/Anthropic Messages/Responses ([vllm#65503](https://github.com/vllm-project/vllm/issues/65503)) and the lightweight render API proposal ([vllm#56172](https://github.com/vllm-project/vllm/issues/56172)) mean multimodal preprocessing can move off CPU sidecars — relevant if you're CPU-bound on image/video handling.
- **Frontend behavior divergence**: if you send both `tools` and `response_format` with `tool_choice="auto"`, Python and Rust frontends currently disagree ([vllm#66858](https://github.com/vllm-project/vllm/issues/66858)). Pin your frontend or wait for the unification RFC before relying on structured tool-call schemas.
- **Overload signaling**: with streaming admission fixes landing ([vllm#70171](https://github.com/vllm-project/vllm/pull/70171)) and the preemption-rate gate ([vllm#70174](https://github.com/vllm-project/vllm/pull/70174)), expect cleaner 503s instead of in-band SSE errors — update client retry logic accordingly.
- **Quantized deployments**: if you quantize lm_head via auto-round or online config, both paths had correctness bugs addressed this week; re-validate checkpoints. On Blackwell, the Marlin→Humming migration ([vllm#65560](https://github.com/vllm-project/vllm/issues/65560)) should improve coverage for new formats but means kernel-selection behavior will shift.
- **Kimi users**: the reasoning-field corruption fix (#42426) and the ongoing ROCm KVV accuracy CI push ([vllm#66699](https://github.com/vllm-project/vllm/issues/66699)) matter if you serve Kimi on AMD — AMD customers have filed quality complaints upstream, so pin known-good images until the weekly verifier CI is in place.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-27

## 1. Today's Highlights

SGLang's roadmap slate is dominated by stability work: the **SGLang 1.0 Release Tracker** ([#50045](https://github.com/sgl-project/sglang/issues/50045)) is scoping a hardening release that replaces silent config coercion with explicit errors and defines a 1.x compatibility policy. In parallel, the **Unified Memory Roadmap** ([#49944](https://github.com/sgl-project/sglang/issues/49944)) continues consolidating full-attention KV, SWA KV, and recurrent state into a single GPU arena. On the serving side, a newly opened **Physical AI / robotics serving roadmap** ([#53203](https://github.com/sgl-project/sglang/issues/53203)) signals SGLang Diffusion is expanding beyond image generation toward VLA policies and world-action models. No releases shipped in the last 24h.

## 2. Releases & Breaking Changes

No new releases in the last 24h. Forward-looking breaking-change surface: [#50045](https://github.com/sgl-project/sglang/issues/50045) states that upgrading from 0.5.x to 1.0 **may require configuration changes**, and that silent config fallbacks will be converted to errors that name the offending setting. Operators pinning 0.5.x should begin auditing unsupported/typo'd flags now.

## 3. New Model & Hardware Support

- **Intel XPU + paged-experts**: RFC to extend Paged Experts ([#42557](https://github.com/sgl-project/sglang/issues/42557)) to XPU with Lookahead Expert Scheduling and an SSD tier for iGPU/single-GPU MoE offload — [#46520](https://github.com/sgl-project/sglang/issues/46520).
- **Ascend NPU online W4A4 MoE**: PR adds MXFP4 expert weights with FP4 activations for FusedMoE on Ascend, keeping surrounding linears dual-level MXFP4 — [#32602](https://github.com/sgl-project/sglang/pull/32602).
- **Ascend A5 DeepSeek V4.1 PD**: shared index KV between QLI and QSLI indexers eliminates a duplicate packed copy — [#53222](https://github.com/sgl-project/sglang/pull/53222).
- **Kimi-K3/K3.1 video sampling**: configurable sampling rate and frame cap via `--mm-process-config` — [#53473](https://github.com/sgl-project/sglang/pull/53473).
- **Rust server tokenizer parity**: `--tokenizer-backend fastokens` now honored under `SGLANG_RUST_SERVER=1` — [#50647](https://github.com/sgl-project/sglang/pull/50647).

## 4. Performance & Optimization

- **NPU sampling fusion** ([#53002](https://github.com/sgl-project/sglang/pull/53002)): fusing EAGLE/NEXTN verify top-p + top-k renorm into one kernel cuts a 25.8 ms pair on 910B at `[216, 248320]` to a single pass by avoiding two full-vocab sorts.
- **GB300 custom all-reduce v2 regression** ([#36429](https://github.com/sgl-project/sglang/issues/36429), closed/inactive): fallback off custom all-reduce v2 under non-expandable segments cost ~19% on Llama-4 Scout TP8; worth confirming the guard has been relaxed in your deployment.
- **Diffusion layerwise offload fusion** ([#53477](https://github.com/sgl-project/sglang/pull/53477)): keeps linear+GELU fusion mounted when Qwen-Image DiT layers stream below ~45 GiB free GPU memory, restoring seed-reproducible outputs on constrained H200s.
- **Pi0.5 diffusion** ([#47697](https://github.com/sgl-project/sglang/pull/47697)): prefix encoding and action denoising optimizations for VLA latency.
- **AMD unified attention** ([#51414](https://github.com/sgl-project/sglang/pull/51414)): restores CK `batch_prefill` for extend when `head_dim <= 256`, avoiding over-routing through Triton.

## 5. Stability & Regressions

Ranked by severity:

1. **TP startup hang, same-host `/dev/shm` sharing** ([#53309](https://github.com/sgl-project/sglang/issues/53309), v0.5.23): both ranks stall after `Init parallel begin` on Kubernetes; engine never becomes ready. No fix PR referenced yet — most operationally urgent item.
2. **Regex catastrophic backtracking in tool-call detectors** ([#52090](https://github.com/sgl-project/sglang/issues/52090)): `/parse_function_call` runs detection synchronously in its async handler; ~167 bytes of crafted input blocks the event loop. **DoS-relevant for any deployment exposing function calling.**
3. **`/abort_request` prefix collision** ([#41474](https://github.com/sgl-project/sglang/issues/41474), closed/inactive): aborting rid `X` also aborts every rid starting with `X` — dangerous on shared servers with per-request cancellation.
4. **Streaming detokenizer token loss** ([#41236](https://github.com/sgl-project/sglang/issues/41236), closed/inactive): `LimitedCapacityDict` eviction under >65,536 concurrent states silently drops up to 5 tokens per request.
5. **Gumbel watermark int32 overflow** ([#53154](https://github.com/sgl-project/sglang/issues/53154)): multimodal padding IDs overflow during watermark init on recent `main`.
6. **SM12x shared-memory overrun** ([#53439](https://github.com/sgl-project/sglang/issues/53439)): Inkling-2-Small at TP4/EP4 on GB10 requests more shared memory than a block has once a step routes >~2,750 ids.
7. **HiCache SWA pool mis-sizing** ([#42548](https://github.com/sgl-project/sglang/issues/42548)): SWA host pool sized from the small device pool, so idle prefixes miss the host tier long before KV fills.
8. **sgl-kv-indexer RwLock starvation** ([#52575](https://github.com/sgl-project/sglang/issues/52575)): a prefix query holds the read guard for the whole scan, starving writes.
9. **Qwen3.5-35B-A3B GPTQ MTP mis-quantized** ([#53244](https://github.com/sgl-project/sglang/pull/53244)): fix honors `"dynamic"` exclusions so bf16 MTP blocks aren't built quantized.
10. **Partial fused LoRA projections** ([#52730](https://github.com/sgl-project/sglang/pull/52730)): hard-coded anchor keys + `zeros_like` padding caused crashes/silent corruption when adapters trained only part of a fused projection — fix PR open.

CI health: [#17050](https://github.com/sgl-project/sglang/issues/17050) reports 5 broken, 18 flaky, 931 recently fixed as of 02:48 UTC; the flaky-test tracker [#42752](https://github.com/sgl-project/sglang/issues/42752) and CUDA coredump tracker [#26340](https://github.com/sgl-project/sglang/issues/26340) remain the canonical signal sources.

## 6. What This Means for Application Developers

- **Don't expose `/parse_function_call` unauthenticated** ([#52090](https://github.com/sgl-project/sglang/issues/52090)). If your agent stack parses tool calls server-side, put a proxy-level limit on request body size and consider parsing client-side until a fix lands.
- **Use UUID-style unique rids** ([#41474](https://github.com/sgl-project/sglang/issues/41474)). Prefix-sharing IDs (e.g., `req-1`, `req-12`) mean one cancel can kill others — a real hazard for session-multiplexing gateways.
- **Watch streaming under high concurrency** ([#41236](https://github.com/sgl-project/sglang/issues/41236)). If you routinely exceed ~65K active detokenizer states, verify output fidelity or raise `SGLANG_DETOKENIZER_MAX_STATES`.
- **Start 1.0 migration prep** ([#50045](https://github.com/sgl-project/sglang/issues/50045)). Expect formerly-tolerant configs to hard-fail; treat current 1.0 tracking as your compatibility contract for the 1.x line.
- **Agent-harness workloads get first-class attention** ([#47763](https://github.com/sgl-project/sglang/issues/47763)) — session-aware KV and execution efficiency for Codex CLI-style harnesses; and AOT pinned prefix caching via KV-Cartridges ([#53151](https://github.com/sgl-project/sglang/issues/53151)) is proposed for stable multi-turn prefixes, which should improve cache-hit rates for fixed system prompts and tool schemas.
- **Robotics/VLA serving is now on the roadmap** ([#53203](https://github.com/sgl-project/sglang/issues/53203)): if you're shipping vision-language-action policies, expect shared model/processor/session abstractions across diffusion and `miles` post-training.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-27

## 1. Today's Highlights

llama.cpp shipped **v1.1.0**, a substantial release that lands the **Inkling 2** model family (base, Mini, DSpark), Domyn Edge 4B, Zaya1 8B, RAON-1-mini, and Hy4-flash, splits **DFlash speculative decoding into separate draft methods**, and **deprecates the old `llama_batch` API in favour of `llama_batch_ext`**. Kernel and backend work is focused heavily on **Inkling 2 fusion** (CUDA fused short-conv/depth-mix/loop-controller/L2-clip/situ chains) and **Flash Attention extensibility** (indexed bias on CUDA/HIP, attention-sink guards, constant V-load lengths). On the stability side, several **Inkling 2 Mini** issues are active — CUDA buffer sizing regardless of `-ngl`, crashes with `--moe-cache-mib`, and wrong tensor counts for RAON-1-mini — while a long-standing **SM_60 FP32→FP16 quality-loss bug** (#25593) was finally closed.

---

## 2. Releases & Breaking Changes

- **v1.1.0 released** — adds Inkling 2 family, Domyn Edge 4B, Zaya1 8B, RAON-1-mini, Hy4-flash; TTS additions. https://github.com/ggml-org/llama.cpp/releases
- **Breaking: `llama_batch` deprecated** in favour of `llama_batch_ext`. Downstream integrators embedding libllama directly should migrate. (Referenced in the v1.1.0 release notes.)
- **`llama` unified binary** — `--bash-completion` output is currently wrong for the unified binary (issue #33083). https://github.com/ggml-org/llama.cpp/issues/33083
- **`llama-fit-params`** does not accept `--spec-type`, `-md`, `-ngld` (#30424, closed/stale). https://github.com/ggml-org/llama.cpp/issues/30424
- **Windows CUDA prebuilts frozen at b11828** while tags advance (#31085, open). https://github.com/ggml-org/llama.cpp/issues/31085 (Note: newer b128xx releases list macOS/iOS + attestations; Windows CUDA asset freshness remains a known gap.)

---

## 3. New Model & Hardware Support

- **Inkling 2 family** (base, Mini, DSpark) — landed in v1.1.0; DFlash2 support for **Inkling-2-Mini** added in b12785. https://github.com/ggml-org/llama.cpp/pull/33073
- **Domyn Edge 4B, Zaya1 8B, RAON-1-mini, Hy4-flash** — new architectures in v1.1.0. (RAON-1-mini has a tensor-count bug, see §5.)
- **DFlash speculative decoding split into separate draft methods** — affects how `--spec-type` and draft models are configured. (v1.1.0 notes.)
- **`bailingmoe3`** — fused `ssm_conv`+silu, redundant copy removal (#33081). https://github.com/ggml-org/llama.cpp/pull/33081
- **OpenCL: MoE int8 bin kernel** host-side changes for **Adreno A850** (b12800). https://github.com/ggml-org/llama.cpp/pull/33069
- **Vulkan: RDNA1 driver misclassification fix** on Windows (b12791). https://github.com/ggml-org/llama.cpp/pull/33123
- **ggml quant scales for FP8 / NVFP4** — moving scale support into GGML, requires backend epilogue MUL (#28898, open, cross-backend). https://github.com/ggml-org/llama.cpp/pull/28898
- **Metal: 4-section vision RoPE** + f32 accumulation fix in `mul_mat` (#33093). https://github.com/ggml-org/llama.cpp/pull/33093
- **mtmd: MiniCPM-V 4.7 image separator position fix** (#32995). https://github.com/ggml-org/llama.cpp/pull/32995

---

## 4. Performance & Optimization

- **CUDA: Inkling 2 chain fusion** — short conv, depth mix, loop controller, L2 clip, situ fused (#33060). https://github.com/ggml-org/llama.cpp/pull/33060
- **CUDA/HIP: Flash Attention with indexed bias** — ported onto refactored typed tile loaders, F32 bias to match CPU reference (b12801). https://github.com/ggml-org/llama.cpp/pull/33063
- **CUDA fusion code moved out of `ggml-cuda.cu` into `fusion.cu`** (#33087) — housekeeping that eases further fusion work. https://github.com/ggml-org/llama.cpp/pull/33087
- **CUDA: constant V load length when head dim unpadded** — one-line change dropping a stack frame in 512-head f16 path, fixes #32871 (#33161). https://github.com/ggml-org/llama.cpp/pull/33161
- **HIP: `warp_reduce_sum` via `__builtin_amdgcn_mov_dpp`** instead of `ds_permute_*` (avoids LDS bridge) (#32215). https://github.com/ggml-org/llama.cpp/pull/32215
- **SYCL/XMX enablement series (0/4)** — Q6_K dequant precision fix, uses f32 like canonical path (#32726). https://github.com/ggml-org/llama.cpp/pull/32726
- **SYCL FA vector kernel routing for BMG D=256 single-query decode** — reported **832 vs 1150 µs** per call at kv=65536, GQA4 (#30606, closed). https://github.com/ggml-org/llama.cpp/pull/30606
- **Unicode tokenization speedup** — avoids redundant UTF-8 conversions and per-byte copies (#33164). https://github.com/ggml-org/llama.cpp/pull/33164
- **OpenVINO: CI op-test fixes + NPU improvements** (SSM_CONV_CONCAT_FUSION, GATED_DELTA_NET_CACHE_FUSION, SHORT_CONV) (#33088). https://github.com/ggml-org/llama.cpp/pull/33088
- **Batch invariance support** (llama, ggml, tests) — proposed fix for batch-size-dependent outputs affecting greedy speculative decoding (#32081, open). https://github.com/ggml-org/llama.cpp/pull/32081
- **Multi-GPU regression noted:** `cudaGetDeviceProperties` called per cross-device copy with `-ot`, up to **~8× slowdown** (#33132). https://github.com/ggml-org/llama.cpp/issues/33132

---

## 5. Stability & Regressions (ranked by severity)

1. **Inkling-2-Mini allocates ~7.2–7.8 GB CUDA0 compute buffer regardless of `-ngl`** (even `-ngl 0`, `--fit off`) — #32910, open, 4 comments. Blocks low-VRAM users. https://github.com/ggml-org/llama.cpp/issues/32910
2. **Inkling 2 Mini crashes with `--moe-cache-mib`** — #33101, open. Related MoE-memory concerns: #32744 (shared expert weights stored 3× on looped models), #30163 (per-device `--moe-cache-mib` request). https://github.com/ggml-org/llama.cpp/issues/33101
3. **Draft-model speculative decoding 2.2–2.4× slower on Qwen3.5 Gated DeltaNet hybrid (CUDA)** vs 10–18% loss on dense control — #32776, open. **No fix PR visible.** https://github.com/ggml-org/llama.cpp/issues/32776
4. **RAON-1-mini wrong tensor count** — expected 736, got 731 (v1.1.0-dev b12772) — #33099, open. https://github.com/ggml-org/llama.cpp/issues/33099
5. **Vulkan output corruption on Intel Arc B-series under long-context/RAG**, persists despite `GGML_VK_DISABLE_COOPMAT` — #31828, open. https://github.com/ggml-org/llama.cpp/issues/31828
6. **SYCL decode hang on Xe3 (Panther Lake)** in `ggml_backend_sycl_synchronize` unless `GGML_SYCL_USE_ASYNC_MEM_OP=0` — #31547, open. https://github.com/ggml-org/llama.cpp/issues/31547
7. **SM_60 (Tesla P100) FP32 math silently done in FP16** — #25593 **CLOSED** (22 comments, fix merged in forks). https://github.com/ggml-org/llama.cpp/issues/25593
8. **llama-server crash (fattn.cu:579)** when editing system message with Gemma 4 31B + MTP + `-sm tensor` — #24440, **CLOSED**. https://github.com/ggml-org/llama.cpp/issues/24440
9. **ADD_ID launch failure >65535 tokens** (gridDim.y cap on NVIDIA/HIP) — fix PR #33162 open. https://github.com/ggml-org/llama.cpp/pull/33162
10. **Vulkan q8_1 block sum overflow → NaN** when sum >65,504 — fix PR #33155 open. https://github.com/ggml-org/llama.cpp/pull/33155
11. **CUDA attention-sink out-of-bounds read** for padded GQA heads in last KV group — guard PR #33160 open. https://github.com/ggml-org/llama.cpp/pull/33160
12. **SYCL FA crash with f16 K + f8_e4m3 V** — V-type validation fix PR #32703. https://github.com/ggml-org/llama.cpp/pull/32703
13. **json-schema-to-grammar drops optional field listed before required** — #30321, closed/stale. https://github.com/ggml-org/llama.cpp/issues/30321
14. **`--cache-ram -1` not a true "no limit"** on hybrid models (~640 MiB RAM per short prompt) — #29324, closed. https://github.com/ggml-org/llama.cpp/issues/29324

---

## 6. What This Means for Application Developers

- **Upgrade planning:** v1.1.0 is a feature-heavy release but introduces **model-family churn** (Inkling 2, RAON-1-mini) with several **active bugs on the newest architectures**. If you serve Inkling 2 Mini on constrained VRAM or use `--moe-cache-mib`, hold until #32910/#33101 clear. The **`llama_batch` → `llama_batch_ext` migration** matters if you embed libllama rather than use the server.
- **Speculative decoding:** the **DFlash split into separate draft methods** changes CLI/config surface; combined with the open **2.2–2.4× hybrid slowdown (#32776)** and **batch-invariance work (#32081)**, if you rely on greedy + draft models, pin a known-good build and benchmark per architecture before rolling forward.
- **Server/agent integration:** a fix is in flight for the **Responses-API named `tool_choice`** returning 400 (#33159), and the **stdio MCP server deadlock** above ~1–5 KB tool calls (#28723) remains a watch item for agent frameworks. https://github.com/ggml-org/llama.cpp/pull/33159
- **Backend stability:** if you deploy on **Intel Arc (Vulkan)**, **SYCL/Panther Lake**, or **Blackwell IQ3_S**, there are unresolved correctness issues (#31828, #31547, #28581) — validate output determinism in your RAG/long-context paths.
- **Perf upside:** CUDA/ROCm users benefit from **Inkling 2 fusion** and **FA indexed-bias**; HIP users get faster reduction. Re-benchmark `llama-bench` on your target GPU after pulling b12801+.
- **Windows CUDA prebuilts** should be treated as potentially stale (#31085) — prefer building from source or verify asset build numbers before shipping.

---
*Sources: ggml-org/llama.cpp releases, issues, and PRs updated 2026-11-26/27. Links point to the canonical GitHub objects referenced in the source data.*

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-27

## 1. Today's Highlights

Ollama's `v0.40.19-rc0` continues refining the Inkling 2 and MLX runners (faster short histories, compact Engram buffers), while a wave of stability fixes targets a cluster of regressions in 0.40.17/0.40.18. The most consequential work-in-progress is **PR #19936**, which propagates mid-stream `llama-server` errors instead of silently returning `HTTP 200` with empty bodies — directly addressing two filed bugs. Meanwhile, a DGX Spark upgrade path (0.34.4 → 0.40.18) is being reported as system-freezing, which warrants caution for that platform.

---

## 2. Releases & Breaking Changes

- **v0.40.19-rc0** — Inkling 2 short-history improvements, MLX runner Engram buffer compaction, llama-server bump. [PR #19881](https://github.com/ollama/ollama/pull/19881) · [PR #19913](https://github.com/ollama/ollama/pull/19913)
- **Install script regression** — The Linux install script reportedly attempts to install the newest NVIDIA drivers without checking GPU architecture, breaking systems with older 10-series cards. [Issue #19933](https://github.com/ollama/ollama/issues/19933)

---

## 3. New Model & Hardware Support

- **Inkling 2 CUDA backend (in progress)** — Ports Metal fast paths to discrete NVIDIA GPUs; adds SM120/121 NVFP4 activation kernel (4-over-6) with generic graph fallback, plus BF16 tensor-core expert gathers (qmm_sm80). [PR #19909](https://github.com/ollama/ollama/pull/19909)
- **mlx-community int4 affine embed/lm_head** — Support for `Inkling-2-Mini-4bit` int4 affine–quantized `embed_tokens` and `lm_head` (U32 packed with per-group BF16 scale/bias). [PR #19928](https://github.com/ollama/ollama/pull/19928)
- **PPLX Decider v1.3 on MLX runner** — Flash and 27B checkpoints, v4 chunked decision protocol (choice/yes-no/score/image), plus SystemOne Locate support. [PR #19734](https://github.com/ollama/ollama/pull/19734)
- **Tencent WePocketModel (WePM)** — Feature request to add multimodal 2B/4B model family (text+image, embeddings, structured decisions). [Issue #19920](https://github.com/ollama/ollama/issues/19920)
- **Ascend NPU (CANN)** — CANN build option and device discovery PR was closed; broader device-discovery proposal remains open. [PR #19732](https://github.com/ollama/ollama/pull/19732) · [Issue #19735](https://github.com/ollama/ollama/issues/19735)

---

## 4. Performance & Optimization

- **Inkling 2 short-history fast paths** — Faster draft proposals and conversation snapshots. [PR #19881](https://github.com/ollama/ollama/pull/19881)
- **MLX Engram buffer compaction** — Reduces memory footprint of history buffers. [PR #19913](https://github.com/ollama/ollama/pull/19913)
- **VRAM accounting & GPU splitting fixes** — Ports upstream draft/MoE memory attribution work so `ollama ps` reflects true allocation across target/draft/projector. [PR #19632](https://github.com/ollama/ollama/pull/19632)
- **Opt-in per-request metrics logging** — `OLLAMA_LOG_METRICS=1` writes JSONL token/inference metrics (`OLLAMA_METRICS_LOG_FILE` to override path). [PR #19869](https://github.com/ollama/ollama/pull/19869)

---

## 5. Stability & Regressions (ranked by severity)

1. **DGX Spark system freeze on upgrade** — 0.34.4 → 0.40.18 causes multi-model instability and full-system hangs (GB10). No fix PR yet. [Issue #19927](https://github.com/ollama/ollama/issues/19927)
2. **Mid-stream errors masked as HTTP 200** — `Completion()` drops post-stream `llama-server` errors (Metal OOM, grammar exceptions), returning empty 200 responses. **Fix PR open.** [Issue #19934](https://github.com/ollama/ollama/issues/19934) · [PR #19936](https://github.com/ollama/ollama/pull/19936)
3. **JSON-schema failures on Windows/ROCm (0.40.18)** — Grammar stack exception mid-load returns HTTP 200 empty body. **Covered by PR #19936.** [Issue #19918](https://github.com/ollama/ollama/issues/19918)
4. **`CUDA_VISIBLE_DEVICES` on dual-GPU** — 5090 discovered then filtered as "didn't fully initialize" → CPU-only fallback (0.40.18). [Issue #19921](https://github.com/ollama/ollama/issues/19921)
5. **MLX prefix-cache leak** — Snapshots paged out but never evicted; ~0.6 GiB growth per distinct prompt on qwen3.8-flash-next. [Issue #19891](https://github.com/ollama/ollama/issues/19891)
6. **Tool-call parser drops** — FunctionGemma splits at `<end_function_call>` inside escaped strings; Laguna drops args containing `<tool_call>`; qwen3-coder missing opener (fix PR open). [Issue #19935](https://github.com/ollama/ollama/issues/19935) · [Issue #19902](https://github.com/ollama/ollama/issues/19902) · [PR #19764](https://github.com/ollama/ollama/pull/19764)
7. **Vision prompt rejection on `[img-` substring** — `arr[img-1]` style text breaks tokenization. **Fix PR open.** [Issue #19911](https://github.com/ollama/ollama/issues/19911) · [PR #19912](https://github.com/ollama/ollama/pull/19912)
8. **`/v1/messages` silently drops `document` blocks** — Returns 200 without the content. **Fix PR open (rejects with 400).** [Issue #19925](https://github.com/ollama/ollama/issues/19925) · [PR #19926](https://github.com/ollama/ollama/pull/19926)
9. **llama.cpp bump for long-context GGML assert** — `GGML_ASSERT(s2 <= uint32_t::max())` on DGX Spark; bump landed upstream. [Issue #19915](https://github.com/ollama/ollama/issues/19915)

---

## 6. What This Means for Application Developers

- **Do not trust HTTP 200 alone.** Until PR #19936 merges, validate response bodies for empty/zero-value content — stream failures (OOM, grammar errors) are currently swallowed mid-stream. Add length/content checks in client wrappers.
- **Pin versions on DGX Spark and ROCm/Windows hosts.** 0.40.18 has confirmed regressions (system freeze on Spark, JSON-schema failure on ROCm); 0.40.17 is a safer fallback.
- **Avoid ambiguous tool-call payloads.** Several parsers mishandle marker strings nested inside arguments — sanitize or escape `<tool_call>` / `<end_function_call>` literals before embedding in tool arguments.
- **Metrics observability is coming.** PR #19869 gives per-request token/latency JSONL — useful for cost and throughput tracking if you're running shared inference.
- **Inkling 2 on NVIDIA is nearly ready.** PR #19909 brings the CUDA fast path; plan capacity for discrete GPU deployments once merged.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-27

## 1. Today's Highlights

Release activity centers on the LTS line (v1.108.18 / v1.108.19) plus a dev cut (v1.113.0-dev.1), while the bulk of engineering attention is going into a **native Rust gateway** — a large, coordinated PR stack landing native JWT/JWKS/OIDC verification, team/membership auth-store reads, and `drop_params` handling to bypass the Python path. In parallel, several correctness bugs surfaced around **MCP stateful session accounting**, **guardrail concurrency**, and **cross-provider tool-call/thinking signature handling**.

## 2. Releases & Breaking Changes

- **v1.113.0-dev.1** — Dev build, cosign-verified image published to GHCR. No migration notes in the release body. [Release](https://github.com/BerriAI/litellm/releases)
- **v1.108.19 (LTS)** — Latest LTS patch. `ghcr.io/berriai/litellm:lts` now points here; recommend pinning LTS deployments to this tag. [Release](https://github.com/BerriAI/litellm/releases)
- **v1.108.18 (LTS)** — Prior LTS patch, superseded by v1.108.19.
- **Deprecation notice — Prisma Python client** (Issue #9753, 22 comments): still open, no migration path confirmed yet. Teams relying on Prisma-backed features should track this. [Issue #9753](https://github.com/BerriAI/litellm/issues/9753)
- **OpenAI Evals API shutdown (Nov 30, 2026)**: `litellm/llms/openai/evals/transformation.py` still calls `/v1/evals` (lines 66, 70, 105). Existing evals go read-only Oct 31, API shut off Nov 30 — **any pipeline using LiteLLM's OpenAI Evals integration will break imminently**. [Issue #47212](https://github.com/BerriAI/litellm/issues/47212)

## 3. New Model & Hardware Support

- **0G Private Computer** (`0g`) — New OpenAI-compatible provider PR covering chat, responses, and TEE-hosted models behind a single key. [PR #52499](https://github.com/BerriAI/litellm/pull/52499)
- **bf16.ai** (`bf16`) — JSON-configured OpenAI-compatible provider with model pricing entries. [PR #52755](https://github.com/BerriAI/litellm/pull/52755)
- **Morph fast-models (Kimi K3, GLM 5.2, etc.)** — Feature request closed; check whether native support actually shipped. [Issue #35410](https://github.com/BerriAI/litellm/issues/35410)
- **`gpt-live-transcribe` on Azure AI Foundry** — Not currently reachable through LiteLLM; open bug. [Issue #38635](https://github.com/BerriAI/litellm/issues/38635)

## 4. Performance & Optimization

- **Native Rust gateway auth path** — Large coordinated stack (10+ PRs) moving JWT JWKS/OIDC IO, credential admission, team/membership lookups, and key-to-team mapping into the native host, so authenticated requests no longer round-trip to Python:
  - JWKS/OIDC IO + `Credential::Jwt` admission [PR #54580](https://github.com/BerriAI/litellm/pull/54580)
  - Read-only JWT→key mapping over AuthStore [PR #54581](https://github.com/BerriAI/litellm/pull/54581)
  - JWT team/membership/user via auth-store [PR #54708](https://github.com/BerriAI/litellm/pull/54708)
  - Key→team via auth-store [PR #54778](https://github.com/BerriAI/litellm/pull/54778)
  - `x-litellm-team-id` header reaches auth core [PR #54600](https://github.com/BerriAI/litellm/pull/54600)
  - Auth host prepared to read rows beside key [PR #54780](https://github.com/BerriAI/litellm/pull/54780)
  - `prompt_estimate` moved out of host [PR #54783](https://github.com/BerriAI/litellm/pull/54783)
  - Native `drop_params` for coding agents [PR #54781](https://github.com/BerriAI/litellm/pull/54781)
  - `drop_params` decided by single flag on `/v1/messages` [PR #54779](https://github.com/BerriAI/litellm/pull/54779)
- **Daily spend writer fix** — `_update_daily_spend()` previously dropped transactions beyond the first 100 per ~10s flush cycle; batching fix merges across iterations. Material for high-cardinality workloads. [PR #29337](https://github.com/BerriAI/litellm/pull/29337)
- **MCP semantic search 504 under load** — Cold embedding-cache build on ~412 tools across 11 MCP servers exceeds hardcoded 30s gateway deadline; `search_tools` fails at ~31.9s. No fix PR yet; expect to need cache warm-up or a longer deadline. [Issue #54715](https://github.com/BerriAI/litellm/issues/54715)

## 5. Stability & Regressions

Ranked by severity:

1. **MCP stateful session cap bucketed by API key (HIGH)** — `_MAX_STATEFUL_SESSIONS_PER_OWNER = 100` is keyed on owner fingerprint; shared API keys collapse all users into one 100-session pool, causing unexpected rejections at scale. [Issue #35383](https://github.com/BerriAI/litellm/issues/35383)
2. **Presidio guardrail serializes all calls per process (HIGH)** — `_get_session_iterator` holds `_session_lock` across the HTTP request, so every analyzer/anonymizer call is serialized. Effectively single-threaded guardrail under load. [Issue #47579](https://github.com/BerriAI/litellm/issues/47579)
3. **`sanitize_tool_use_ids_in_anthropic_messages` breaks multi-turn tool use (v1.91.0 regression, CLOSED)** — Affected vLLM/Kimi K2.7 pass-through with Claude Code agentic skills. Verify fix is present in your pinned version. [Issue #32214](https://github.com/BerriAI/litellm/issues/32214)
4. **Bedrock Converse rewrites tool root schemas → signed thinking fails on Bedrock↔Vertex migration (HIGH)** — Conversations moving between Bedrock and Vertex deployments of the same Claude model fail with 400 `Invalid signature in thinking block` when any tool lacks `required`. [Issue #54561](https://github.com/BerriAI/litellm/issues/54561)
5. **Azure AI context-window false positive through OpenWebUI (MEDIUM)** — `ContextWindowExceededError` despite default model params. [Issue #53716](https://github.com/BerriAI/litellm/issues/53716)
6. **`validate_environment` / `supports_response_schema` trigger OAuth device login (MEDIUM)** — Read-only lookups on `chatgpt/*` and `github_copilot/*` models launch a device-code flow; breaks scripts and CI. [Issue #54763](https://github.com/BerriAI/litellm/issues/54763)
7. **Bedrock guardrail hook reuses `request_data["api_key"]` as its own bearer token (MEDIUM)** — Collides with BYOK credential-override routing. Closed but worth verifying in your version. [Issue #37872](https://github.com/BerriAI/litellm/issues/37872)
8. **`stream_chunk_builder` TypeError on `nvidia_nim` streaming chunks (MEDIUM)** — 500s successful streamed completions when Bedrock `post_call` guardrail is enabled. [Issue #37873](https://github.com/BerriAI/litellm/issues/37873)
9. **`/v1/messages` streaming fallback emits 200 + SSE error chunk (MEDIUM)** — When primary fails pre-content and fallback also fails, clients see a 200 followed by an error chunk rather than an upfront error. [Issue #38610](https://github.com/BerriAI/litellm/issues/38610)
10. **Content filter MASK reorders streamed output (MEDIUM)** — Held-back text is emitted after the `tool_calls` delta; agent clients drop it. [Issue #48382](https://github.com/BerriAI/litellm/issues/48382)
11. **Managed vector store indexes unusable until proxy restart (MEDIUM)** — `POST /v1/indexes` persists to DB but does not update the in-memory `vector_store_index_registry`. [Issue #42223](https://github.com/BerriAI/litellm/issues/42223)
12. **Swagger UI freezes browser on load (LOW/UX)** — ~9–10s main-thread block on load, 6.6–7.4s per operation expand; root cause in swagger-client OpenAPI 3.1 normalization. [Issue #54707](https://github.com/BerriAI/litellm/issues/54707)
13. **`increment_deployment_cooled_down` label mismatch with `custom_prometheus_metadata_labels`** — Metric never records; closed, verify in your build. [Issue #38494](https://github.com/BerriAI/litellm/issues/38494)
14. **x-ratelimit-* headers dropped on streaming and plain-dict responses (v3 parallel_request_limiter)** — Closed; confirm in your version if you rely on rate-limit headers. [Issue #27748](https://github.com/BerriAI/litellm/issues/27748)

## 6. What This Means for Application Developers

- **Pin to LTS `v1.108.19`** for production; use `ghcr.io/berriai/litellm:lts` to auto-track patches, and verify image signatures with the provided cosign command.
- **OpenAI Evals integration is a hard deadline.** If you route evals through LiteLLM, migrate off `/v1/evals` before Nov 30 — no fallback path is documented in the tracker.
- **Shared API keys are a scaling hazard for MCP.** If you use MCP stateful sessions with a shared key, expect collisions at ~100 concurrent sessions. Issue keys per user/session or wait for a fix.
- **Guardrail throughput is capped by the Presidio lock.** If you rely on Presidio PII filtering under load, budget for serialization or run it out-of-process until #47579 is fixed.
- **Cross-provider Claude conversations can break.** If your agent moves a conversation between Bedrock and Vertex deployments of the same Claude model with tools, expect signature failures. Normalize tool schemas (`required` present) or pin to a single provider per conversation.
- **OAuth-backed models will surprise your tooling.** Any call to `validate_environment` / `supports_response_schema` on `chatgpt/*` or `github_copilot/*` may trigger an interactive device login — sandbox these in CI.
- **Native Rust gateway is coming.** If you depend on custom Python auth hooks, per-request team lookups, or bespoke `drop_params` behavior, watch the #54580/#54581/#54708/#54778/#54600 stack closely; the intent is to serve more auth traffic natively, with Python fallback only when the native path can't decide.
- **Watch the Prisma deprecation.** It has the largest comment count of any open issue and no announced replacement — plan for a migration window if you rely on Prisma-backed spend/keys storage.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-27

## 1. Today's Highlights

No new releases landed in the past 24 hours, but the maintenance velocity is very high: 23 issues and 279 PRs were touched, dominated by Unsloth Studio (desktop/web UI) regressions and hardware-specific fixes. The most consequential engineering work is on the training/inference numerics side — a MoE grouped GEMM fix to run float32 dots in IEEE precision rather than TF32 ([#19872](https://github.com/unslothai/unsloth/pull/19872)) — plus a cluster of FP8, MLX, and Windows/RTX 50-series compatibility patches. AMD and Apple Silicon users continue to surface a steady stream of memory-accounting and runtime bugs.

## 2. Releases & Breaking Changes

None. No releases published in the last 24h. Several merged/closed PRs are pinning-dependency changes worth noting for reproducibility:

- **MLX pinned to 0.32.5** — Studio's MLX install and self-heal now pin `mlx` and `mlx-metal` 0.32.5, matching `unsloth-zoo`; memory-estimate test expectations follow the new attention dispatch. Merge is coordinated with the corresponding zoo release ([#19720](https://github.com/unslothai/unsloth/pull/19720)).
- **Windows on ARM triton pairing** — `Get-TritonWindowsSpec` now pairs `triton-windows` with the torch minor on ARM as it already did on x64, replacing the previous open-ended `>=3.8.0.post28` ([#19783](https://github.com/unslothai/unsloth/pull/19783), closed).

## 3. New Model & Hardware Support

- **Inkling 2 Mini** reasoning handling fixed in Studio: at `reasoning_effort: "none"` the model still emitted ` thinking…` inline in `content` with empty `reasoning_content`; the PR honors `enable_thinking: false` and preserves literal think tags across both Safetensors/MLX and GGUF backends ([#19859](https://github.com/unslothai/unsloth/pull/19859)). A related user question about whether Inkling 2 Mini is fine-tunable was closed ([#18691](https://github.com/unslothai/unsloth/issues/18691)).
- **Ming-Image-0.2-Design** support requested; Studio never supported 0.1 either ([#19767](https://github.com/unslothai/unsloth/issues/19767)).
- **PrismML ternary GGUF types** `PQ2_0` (GGML 142) and `PTQ1_0` (GGML 143) requested for Studio's bundled llama.cpp, including Hadamard activation transforms used by Ternary-Bonsai-2.5-27B variants ([#19750](https://github.com/unslothai/unsloth/issues/19750)).
- **Older AMD XDNA NPUs** (Ryzen AI 100/200 series, pre-XDNA 2) support requested — currently the NPU integration targets newer silicon only ([#18501](https://github.com/unslothai/unsloth/issues/18501), 👍2).
- **Voice Isolation** models (e.g. `inworld/voice-isolator`) requested as a Studio feature ([#19131](https://github.com/unslothai/unsloth/issues/19131)).
- **Tensor parallelism for Nemotron-3.5-Transcribe-30B** reported unsupported on 2× RTX 5060 Ti in Studio ([#19515](https://github.com/unslothai/unsloth/issues/19515)).

## 4. Performance & Optimization

- **MoE grouped GEMM precision fix** — `unsloth_triton`'s MoE backend was computing float32 forward, dX, and dW via `tl.dot`, which defaults to TF32 (~10 mantissa bits), diverging from `torch._grouped_mm` and the native per-expert loop. Fix forces IEEE float32 ([#19872](https://github.com/unslothai/unsloth/pull/19872)). Correctness-critical for MoE training parity.
- **Qwen-VL patch embed Conv3d → matmul** — on torch 2.9.0/2.9.1 with cuDNN 9.8–9.14, the vision `patch_embed.proj` Conv3d falls to a slow native kernel, making a Qwen-Image-2.1 edit encode take **~40s on an L4 instead of ~0.5s**. Fix runs the conv as one `F.linear`, scoped to the affected torch/cuDNN range ([#19862](https://github.com/unslothai/unsloth/pull/19862)).
- **Context-parallel GRPO/DPO scoring** — `_rl_decoder_post_hook` previously had every CP peer score all gathered `[B,T,H]` rows through lm_head and log-softmax; PR makes each peer score only its own share ([#19756](https://github.com/unslothai/unsloth/pull/19756), closed).
- **FP8 on sm_12x** — #19665 routed all fp8 GEMMs to the tensorwise unit-scale path when a torch build lacks row-wise `_scaled_mm`, but only detected it via torch's "not supported" text. On a real RTX 5090 with the Windows `torch 2.10.0+cu130` wheel, cuBLASLt refuses row-wise differently; this PR recognizes that as a missing kernel ([#19871](https://github.com/unslothai/unsloth/pull/19871)).
- **MLX chat progress** — live prompt progress and generation detail frames, previously GGUF-only, extended to MLX chats ([#19738](https://github.com/unslothai/unsloth/pull/19738)).

## 5. Stability & Regressions

Ranked by severity:

1. **Import-order SIGSEGV in Studio venv (Linux)** — `python -c "import torch; import pyarrow"` exits 139 in the Studio 0.1.925-beta virtualenv (Python 3.13.17, torch 2.13.0+cu130, pyarrow 23.0.1); import order reversal also crashes. Closed as of 2026-11-26 ([#19660](https://github.com/unslothai/unsloth/issues/19660)).
2. **MLX deadlock + TypeError on Apple Silicon** — `huggingface_hub` `_ModuleLock` deadlock on load/reload plus a `LanguageModelOutput` TypeError on LFM3 in Studio's MLX backend block reliable loading/generation for `LiquidAI/LFM3-1.7B-MLX-4bit` ([#19749](https://github.com/unslothai/unsloth/issues/19749)).
3. **v0.1.920-beta crash on model load** — desktop app crash, closed with 9 comments; may indicate a fixed regression ([#18563](https://github.com/unslothai/unsloth/issues/18563), closed).
4. **LoRA merge degrades reasoning vs. on-the-fly adapters** — merging adapters produced worse outputs than inference with adapters live; report also notes MLX downcasts saved FP32 Granite weights by default ([#19834](https://github.com/unslothai/unsloth/issues/19834)).
5. **Train/serve mismatch in Clef decision models** — JSON-string `state` is silently re-parsed/key-sorted during training and predict, but consumed verbatim by the exported GGUF; a correctness bug affecting exported artifacts ([#19423](https://github.com/unslothai/unsloth/issues/19423), closed).
6. **Memory-estimate false positive for MoE offload** — Studio's `estimate-memory` ignores `-ot`/`n_cpu_moe` expert offload and warns "Exceeds GPU memory" incorrectly ([#19795](https://github.com/unslothai/unsloth/issues/19795)).
7. **AMD unified memory accounting** — Strix Halo GPU memory underestimated under BIOS UMA carve-out ([#19768](https://github.com/unslothai/unsloth/issues/19768)); Ryzen 8700G/Radeon 780M incorrect unified-memory load ([#19309](https://github.com/unslothai/unsloth/issues/19309)).
8. **Studio audio/misc UI bugs** — Audio page triggered hundreds-of-GB hub downloads when switching tabs ([#19751](https://github.com/unslothai/unsloth/pull/19751)); stem playback silent when AudioContext can't start ([#19754](https://github.com/unslothai/unsloth/pull/19754)); truncated KaTeX containing `<` (e.g. `x_{<i}`) ([#19550](https://github.com/unslothai/unsloth/issues/19550), closed); CSV chat import mangles `developer` rows ([#19810](https://github.com/unslothai/unsloth/issues/19810)); non-detect-language translation broken ([#19759](https://github.com/unslothai/unsloth/issues/19759)).
9. **MCP sandbox bypass via Godot MCP** — sandbox warning/instructions requested: the LLM can bypass sandboxing and gain full user-level system access ([#19769](https://github.com/unslothai/unsloth/issues/19769), 👍1).

## 6. What This Means for Application Developers

- **If you train MoE models**, the TF32-vs-IEEE precision divergence ([#19872](https://github.com/unslothai/unsloth/pull/19872)) is the highest-value item on this list — it can silently change numerics between the Triton grouped-GEMM path and the fallback/reference paths. Validate adapter merges against on-the-fly results ([#19834](https://github.com/unslothai/unsloth/issues/19834)) before shipping.
- **If you export to GGUF**, audit any pipeline that stores structured state as JSON strings: the Clef train/serve mismatch ([#19423](https://github.com/unslothai/unsloth/issues/19423)) demonstrates exported artifacts can behave differently from training-time evaluation.
- **Apple Silicon and AMD users** should treat Studio's model-loading and memory-estimate paths as still maturing; pin MLX to 0.32.5 ([#19720](https://github.com/unslothai/unsloth/pull/19720)), and don't trust the "Exceeds GPU memory" warning if you're using MoE expert offload ([#19795](https://github.com/unslothai/unsloth/issues/19795)).
- **RTX 5090 / Windows + FP8** users get a targeted fix ([#19871](https://github.com/unslothai/unsloth/pull/19871)); Qwen-VL image editing on torch 2.9.x gets an ~80× encode speedup on L4-class GPUs ([#19862](https://github.com/unslothai/unsloth/pull/19862)).
- **If you expose MCP tools to agents**, heed the Godot MCP sandbox-bypass report ([#19769](https://github.com/unslothai/unsloth/issues/19769)) — arbitrary code execution outside the sandbox is reachable via LLM tool calls; review your tool permissions accordingly.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*