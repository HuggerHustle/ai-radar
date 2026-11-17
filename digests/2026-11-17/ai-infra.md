# AI Infrastructure Digest 2026-11-17

> Generated: 2026-11-17 03:41 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Date: 2026-11-17**

---

## 1. Ecosystem Overview

Today's activity shows a maturing ecosystem where **correctness and operational hardening now compete with raw performance** as the dominant engineering theme. Serving engines (vLLM, SGLang) are consolidating release lines (vLLM v0.34.0, SGLang's announced 1.0 stability push) while racing on AMD/ROCm coverage and disaggregated prefill/decode architectures. Local runtimes (llama.cpp, Ollama) are expanding into **audio/multimodal** territory and hardening GPU memory accounting. LiteLLM is mid-flight on a **Python→Rust migration** of its hot-path callbacks, signaling that gateway-layer performance is now a first-class concern. Meanwhile, Unsloth's v0.1.918-beta launch (`computer use`, MCP integrations for game engines/3D tools) marks fine-tuning frameworks moving toward **agent-native authoring** rather than pure SFT.

---

## 2. Activity Comparison

| Project | Layer | Releases (24h) | Notable Bug/Issue Volume | Notable PR Volume | Net Status |
|---|---|---|---|---|---|
| **vLLM** | Serving engine | **v0.34.0** (1,061 commits, 412 contributors) | 10 ranked regressions; ROCm RDNA bug **closed**; ~3 open critical | High: AMD/ROCm trackers, Rust frontend, RL weight transfer | **Shipping aggressively** |
| **SGLang** | Serving engine | None | 10 ranked; 1 critical (HiCache/Mooncake), 1 critical streaming regression; CI: 10 broken / 17 flaky | Moderate: PD-disagg RFC+impl, AMD/NPU hardware work | **Pre-1.0 stabilization** |
| **llama.cpp** | Local runtime | **b12451, b12449, b12448, b12438** (UI split, CLI/Jinja) | 12 ranked; CUDA VMM OOM abort, Vulkan RDNA3 crash, V100 regression | High: model support (Kokoro, YuE2, MiniCPM5 MoE), async host input | **Feature-rich, regression-heavy** |
| **Ollama** | Local runtime | None | 10 ranked; Vulkan iGPU crash (closed), tool-calling (fix PR open) | Moderate: MLX runner series, VRAM accounting fix PR | **Stabilizing 0.40.x** |
| **LiteLLM** | Gateway | **v1.108.10** (LTS patch) | 16 ranked; Vertex `global` pricing bug (open), spend-cap/free model bug | High: Rust migration stack, many LTS backports | **LTS hardening + Rust rewrite** |
| **Unsloth** | Fine-tuning | **v0.1.918-beta** | 9 ranked; 2 high (Gemini 3 RAG, Ollama SYSTEM prompt) | High: multi-GPU parallel (DDP/FSDP2/Tensor parallel) | **Post-release stabilization** |

**Takeaways:**
- Three of six projects shipped releases today (vLLM, llama.cpp, Unsloth, plus LiteLLM patch) — unusually high release density.
- vLLM dominates absolute contribution volume (1,061 commits); llama.cpp leads on release *cadence* (4 builds).
- LiteLLM and SGLang carry the highest *open critical* bug counts relative to their release posture.

---

## 3. Model Support Race

| Project | New Models Shipped / In Flight | Architecture Focus |
|---|---|---|
| **vLLM** | Mistral Large 4, MiniMax-M3.1-Flash, Nemotron-3.5-Transcribe (audio); **10 total in v0.34.0** | Qwen3.8-2.4T-A95B, DeepSeek-V4.1-Flash, GLM-5.3, Muse Spark, Kimi K2.5, Qwen4Exp |
| **SGLang** | DeepSeek-V4.1-Flash (MI355X tracker), Kimi-K3, GLM-5.3-Flash, Qwen-Image 2.1 (NPU) | Qwen3.5 512-expert router, GLM `glm5_next`, EAGLE verification |
| **llama.cpp** | **Kokoro-82M TTS, YuE2-3B, VoxCPM2, tiny-voca, MiniCPM5 MoE** | Audio/multimodal `mtmd`, Mamba-2 SSM, ternary quants |
| **Ollama** | D3.1-nano MLX, Tencent Hy4 flash (requested) | MLX speculative batching, prefix reuse |
| **LiteLLM** | GPT-5.6 family (map fixes), Azure GPT-6 Astra, Snowflake Cortex, GLM-5.2[1m], Bedrock `ca.*` | Provider compatibility & pricing metadata |
| **Unsloth** | **MiniMax-H3-Image** (GGUF/FP8/INT8 + LoRA), AMD NPU Q4NX export | Training + inference for image/agent models |

**Who's ahead:**
- **vLLM leads on breadth** — 10 models per release and the widest long-tail architecture coverage (MoE, multimodal, audio, agentic).
- **llama.cpp leads on modality expansion** — the only project pushing TTS/audio pipelines (Kokoro, YuE2, VoxCPM2) as first-class citizens.
- **SGLang is deepest on frontier hardware tracks** (MI355X/gfx950, GB300, Ascend NPU) but ships fewer net-new models.
- **Unsloth uniquely couples new model support to *trainability*** (LoRA + quantized inference for MiniMax-H3-Image).
- **LiteLLM plays a different game** — it doesn't add models, it adds *provider correctness* (billing metadata, reasoning passthrough).

---

## 4. Performance Frontier

Optimization effort is distributed across five axes, with clear specialization:

| Axis | vLLM | SGLang | llama.cpp | Ollama | LiteLLM | Unsloth |
|---|---|---|---|---|---|---|
| **KV cache** | Extensible/resizable by default; Octave 3-bit AMD KV; incremental offload; 3 KV-connector fixes | HiCache + Mooncake (with hit-rate bug) | KV quant in FA tile (#31234) | Saved-prefix reuse (#19677) | — | — |
| **Batching/Scheduling** | Scheduler retirement acks; prefill interval fix | Per-chunk disconnect fix (#50741) | Async host input (#30685) | Batched speculative verify (#19663) | Rate-limiter Redis skip (#31880) | — |
| **Quantization** | FP8-per-channel linears, MXFP4, AITER FP8 prefill | Block-scaled FP8 (NaN fix pending) | q4/q5/q8 KV dequant on tile; IQ3_S SYCL regressed | — | — | FP8 training on XPU; Q4NX NPU export |
| **Distributed serving** | RL weight transfer (NCCL packed, Direct Weight Reload); ShardQ 1M-token prefill | PD disagg RFC; KDA/ADP8 sharding on GB300 | — | — | — | DDP/FSDP2 auto-select; tensor-parallel embedding |
| **Kernels** | DSpark Markov fusion (~16→1), FlashInfer `gvr_2`, SM107 GEMM | aiter `topk_gating`, `unified_attention` EAGLE | CDNA GDN MMA, Vulkan conv3d split_k, RVV SSM scan | Vulkan/CANN backend work | — | — |

**Observations:**
- **KV cache is the single densest battleground** — vLLM (sizing semantics change), SGLang (hierarchical cache bug), llama.cpp (KV-in-tile dequant), Ollama (prefix reuse) all touched it today.
- **AMD/ROCm is the loudest frontier**: vLLM (MI355X/gfx950), SGLang (MI355X tracker), llama.cpp (gfx1013/CDNA MMA), Ollama (ROCm container planning), Unsloth (KFD/R9700). This is the ecosystem's biggest platform bet in 2026.
- **Distributed serving optimization is splitting into two clusters**: prefill/decode disaggregation (SGLang leading) and RL weight transfer (vLLM leading).
- **The negative results matter too** — llama.cpp's SYCL IQ3_S 8× slowdown (#32323) and SGLang's XPU GDN 2.6× regression (#50249) show porting kernels without specialization is a real hazard.

---

## 5. Layer Positioning

```
┌─────────────────────────────────────────────────────────────┐
│  GATEWAY / ROUTING          LiteLLM                         │
│  (spend, rate limit, multi-provider)   → Rust migration     │
├─────────────────────────────────────────────────────────────┤
│  SERVING ENGINE (server/GPU, multi-tenant, PD-disagg)       │
│     vLLM  ←→  SGLang                                        │
│  (breadth, RL/agent)   (PD disagg, frontier HW)             │
├─────────────────────────────────────────────────────────────┤
│  LOCAL RUNTIME (single-host, consumer HW, broad backend)    │
│     llama.cpp  ←→  Ollama                                   │
│  (modality breadth, quant)  (UX, MLX, model registry)       │
├─────────────────────────────────────────────────────────────┤
│  TRAINING / FINE-TUNING     Unsloth                         │
│  (LoRA, multi-GPU, agent authoring, MCP tooling)            │
└─────────────────────────────────────────────────────────────┘
```

**Distinct roles, limited direct competition:**

- **vLLM vs SGLang**: Both are server-class inference engines, but diverging — vLLM is broadening (MultiModel, RL, Rust frontend, audio) while SGLang is deepening (PD disagg, frontier-hardware trackers, NPU roadmaps). Expect vLLM to win on *feature surface*, SGLang on *disaggregated serving efficiency*.
- **llama.cpp vs Ollama**: Complementary, not competitive. llama.cpp is the *engine plus model zoo*; Ollama is a *productized runtime* (registry, Modelfile, MLX, desktop UX) that functionally depends on llama.cpp upstream. Today's Ollama Modelfile SYSTEM bug and llama.cpp UI restructure both ripple between them.
- **LiteLLM** is the only horizontal gateway — its Rust migration will overlap with vLLM/SGLang's own Rust frontends (vLLM `vllm-rs render` gRPC service is a client-side competitor to some LiteLLM functions).
- **Unsloth** is the only layer that owns the *train→serve handoff*, which is why weight-transfer APIs in vLLM (#54477, #64418) and Unsloth's multi-GPU parallelism are on convergent paths.

---

## 6. Trend Signals

### Signal 1 — Correctness/regression debt is now the dominant release risk
Every project shipped fixes for *post-hoc* regressions rather than novel features today: llama.cpp's CUDA OOM abort, SGLang's streaming throughput regression from a prior perf PR (#46586 → #50741), Ollama's Qwen tool-calling break, LiteLLM's Vertex billing mispricing. **The cost of the last two quarters' perf speed is now visible as regression tails.** Pin versions, budget for point releases.

### Signal 2 — Rust is the convergence language of the stack's hot paths
vLLM (Rust frontend, gRPC render service), SGLang (`sglang-api-types` 0.1.1), and LiteLLM (CustomLoggerV2 Rust migration for limiter/capacity/spend-log). **Three of six projects are moving non-Python execution paths into Rust simultaneously** — infrastructure teams should expect a mixed Python/Rust deployment model and plan config reviews when LiteLLM's Python handlers are deleted.

### Signal 3 — AMD/ROCm is the platform the ecosystem is hedging on
MI355X/gfx950 trackers in both vLLM and SGLang, RDNA upstreaming in llama.cpp and Ollama, and AMD NPU export in Unsloth. **The head-on competition for NVIDIA alternatives has shifted from "does it run" to "does it run *with feature parity*"** — but the field still emits correctness bugs (ROCm RDNA attention fault, FlexAttention ULP divergence, Q4NX packing errors).

### Signal 4 — Audio/TTS is the next modality frontier
llama.cpp (Kokoro, YuE2, VoxCPM2, tiny-voca) and vLLM (Nemotron-3.5-Transcribe) both landed audio today. **The `mtmd` pattern (mmproj owns a context) will shape how multimodal+audio models are packaged for the rest of 2026.** Agent developers planning voice IO should start prototyping now.

### Signal 5 — Agent-native tooling is becoming a first-class product surface
Unsloth's `computer use (beta)` and MCP integrations (Unity, Unreal, Blender, Roblox), Ollama's tool-calling stabilization, llama.cpp's Anthropic-compat gap for `tool_choice`/`disable_parallel_tool_use`, LiteLLM's `litellm.agent_eval()`, and vLLM's scheduler retirement acks (for abort semantics in agent loops). **The stack is being retooled for agents, not chat completions.**

### What application/agent developers should watch:

| Priority | Action | Rationale |
|---|---|---|
| 🔴 **Now** | Re-validate vLLM configs post-v0.34.0 (KV cache semantics changed) | Post-warmup sizing changes concurrency ceilings silently |
| 🔴 **Now** | Audit LiteLLM Vertex `global` spend logs | Overstated cost by regional uplift until #52043 lands |
| 🟠 **This week** | Pin Qwen tool-calling evals on Ollama 0.40.13 | Known corruption; fix in review (#19705) |
| 🟠 **This week** | Instrument SGLang per-round hit rate, not aggregate | HiCache collapse hidden by hourly averages (#47481) |
| 🟡 **This month** | Prepare for LiteLLM Rust callback config review | Old Python handlers will be deleted |
| 🟡 **This month** | Prototype audio/voice pipelines on llama.cpp | Modality is landing but APIs may churn |
| 🟢 **Track** | Ascend NPU paths (Ollama #19732, SGLang #25598, llama.cpp OpenVINO) | Diversification hedge against NVIDIA availability |

---

*Report compiled from 2026-11-17 project digests. Section 2 counts reflect items surfaced in digest summaries rather than complete GitHub API totals.*

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-17

## 1. Today's Highlights

vLLM shipped **v0.34.0** with 1,061 commits from 412 contributors (120 new), adding 10 new models and enabling the extensible KV cache by default — the engine now sizes the KV cache from memory actually free after warmup. A significant share of today's activity is AMD/ROCm optimization tracking (MI355X/gfx950 targets for Qwen3.8, DeepSeek-V4.1-Flash, Muse Spark) alongside maturation of the vLLM Rust frontend (gRPC render service, scheduler retirement semantics). RL weight-transfer infrastructure is also consolidating rapidly, with stacked "packed NCCL" PRs landing on top of the Direct Weight Reload RFC.

## 2. Releases & Breaking Changes

**v0.34.0** — https://github.com/vllm-project/vllm/releases
- **1,061 commits / 412 contributors (120 new)** since the prior release.
- **Extensible KV cache is now on by default**: KV cache is sized from memory free *after* warmup rather than a precomputed heuristic, so most workloads should get closer to the practical memory ceiling out of the box. Operators with tightly tuned `--gpu-memory-utilization` or custom cache sizing logic should re-validate their configs.
- **10 new models**: Mistral Large 4, MiniMax-M3.1-Flash, Nemotron-3.5-Transcribe, and others.
- **Model Runner v2 migration** (issue [#41286](https://github.com/vllm-project/vllm/issues/41286)) is closed — the v1→v2 transition for dense and MoE models has completed, which may affect custom model-runner patches.
- No explicit API removals announced in the release notes excerpt; treat the runner migration and default KV sizing change as the two migration-relevant items.

## 3. New Model & Hardware Support

- **10 new models in v0.34.0**, including Mistral Large 4, MiniMax-M3.1-Flash, and Nemotron-3.5-Transcribe (audio) — https://github.com/vllm-project/vllm/releases
- **ViT Full CUDA Graph tracker** for multimodal models (Qwen3-VL, Qwen3.5, GLM-V, Kimi K2.5) — [#38175](https://github.com/vllm-project/vllm/issues/38175) (49 comments; longest-running active RFC)
- **ROCm/RDNA attention fix**: `ROCM_ATTN` returned incorrect attention (and could fault the GPU) on RDNA for head size ≥96 with KV block size ≠16, and MHA head size 192/256. Marked **CLOSED** — [#62697](https://github.com/vllm-project/vllm/issues/62697)
- **FlashInfer encoder attention fix** for multimodal encoders that run fixed-length batches without `cu_seqlens` (e.g., SmolVLM SigLIP encoder) — [#68066](https://github.com/vllm-project/vllm/pull/68066)
- **Octave KV: native 3-bit KV cache for AMD GPUs** RFC, targeting long-context serving on 4×RX 7900 XTX — [#59773](https://github.com/vllm-project/vllm/issues/59773)
- **DeepSeek-V4.1-Flash on MI355X (gfx950)** tracking text + image input, TP4, FP8 KV cache, with/without DSpark spec decode — [#66587](https://github.com/vllm-project/vllm/issues/66587)

## 4. Performance & Optimization

**AMD/ROCm (largest cluster of active work):**
- **Qwen3.8-2.4T-A95B Quark-MXFP4 on gfx950/MI355X** optimization plan, stacked PRs — [#57149](https://github.com/vllm-project/vllm/issues/57149)
- **Qwen3.8-Flash-Next (GatedDeltaNet + QuerySparse Attention + MXFP4 MoE) on MI355X** — [#59575](https://github.com/vllm-project/vllm/issues/59575)
- **Muse Spark Open PTPC-FP8 on gfx942** — [#64018](https://github.com/vllm-project/vllm/issues/64018); further Muse Spark PRs fuse DSpark Markov sampling kernels (~16 small kernels per draft step) — [#67382](https://github.com/vllm-project/vllm/pull/67382) — and run online FP8-per-channel dense linears on tuned FP8 kernels — [#67381](https://github.com/vllm-project/vllm/pull/67381)
- **AITER FP8-query prefill attention** (`use_prefill_query_quantization`) for FP8 KV caches, avoiding chunked gather/dequant of the prefix — [#67145](https://github.com/vllm-project/vllm/pull/67145)

**NVIDIA / model-specific gains:**
- **DeepSeek-V4.1 candidate-only indexer prefill + ShardQ**: 87.5s → 54.4s at 1M tokens on 8×H20 TP8 (−37.8%) — [#67219](https://github.com/vllm-project/vllm/pull/67219)
- **Qwen4Exp QSA indexer top-k defaults to FlashInfer `gvr_2` on SM100**: 1.7–2.7× lower top-k latency at 1K+ tokens — [#67741](https://github.com/vllm-project/vllm/pull/67741)
- **GLM-5.3 SM107 low-latency GEMM table** gains FlashInfer warp split-K BF16 GEMM and vLLM's `ll_bf16` — [#65706](https://github.com/vllm-project/vllm/pull/65706)

**Memory / MoE:**
- **Incremental MoE expert offloading** (CPU pinned weights + fixed-size GPU cache, LFRU eviction, cross-layer prediction) — [#38256](https://github.com/vllm-project/vllm/issues/38256); PR 1 open at [#37190](https://github.com/vllm-project/vllm/pull/37190)
- **KV offload request-level promotions**: pin at promotion time until load, fixing stale budgets/over-commit/self-eviction — [#66782](https://github.com/vllm-project/vllm/issues/66782); new CPU offload cache lifecycle metrics RFC — [#67909](https://github.com/vllm-project/vllm/issues/67909)

**CI / build:**
- **ROCm PR time-to-signal** reduced from 73.2 → **53.9 min P50** (P90 95.3), target ~30 min — [#66411](https://github.com/vllm-project/vllm/issues/66411)

## 5. Stability & Regressions

Ranked by severity:

1. **`ROCM_ATTN` incorrect attention / GPU fault on RDNA** — head size ≥96 with KV block size ≠16, and MHA head 192/256. **CLOSED** (fix landed) — [#62697](https://github.com/vllm-project/vllm/issues/62697)
2. **W4A16 HummingLinearKernel non-deterministic across processes** on H100 (sm_90), vLLM 0.33.0 / torch 2.14 — batch-invariance concern; no fix PR referenced yet — [#66232](https://github.com/vllm-project/vllm/issues/66232)
3. **NVIDIA nightly failures** tracked across four builds (main `6d3eba0272` → `ab72c466aa` → `2fb6d0b75d` → …) — [#67307](https://github.com/vllm-project/vllm/issues/67307)
4. **Mooncake KV connector reloads from store after a failed load** under `kv_load_failure_policy="recompute"`; fix PR open — [#67957](https://github.com/vllm-project/vllm/pull/67957)
5. **NIXL pull-mode dead peers never re-handshaked** after `NIXL_ERR_REMOTE_DISCONNECT`; fix PR open — [#68047](https://github.com/vllm-project/vllm/pull/68047)
6. **KV transfer engine ID mismatch across PCP ranks** (PP2/PCP8/TP2 multi-node startup failure); draft fix open, hardware validation pending — [#62916](https://github.com/vllm-project/vllm/pull/62916)
7. **prefix_cache + LoRA corruption** with same name/different id — **CLOSED (stale)** — [#30931](https://github.com/vllm-project/vllm/issues/30931)
8. **DeepSeek-V4.1-Flash `IMAGE_PLACEHOLDER` handling** not robust on 0.33.0 — [#67017](https://github.com/vllm-project/vllm/issues/67017)
9. **ROCm FlexAttention paged-mask lookup** differs from contiguous FlexAttention by 1 BF16 ULP (gfx950, Qwen3, head dim 128) — [#66460](https://github.com/vllm-project/vllm/issues/66460)
10. **Prefill scheduling bug**: `prefill_schedule_interval` bypassed when prefix-cache replay rebuilds sliding-window KV; fix PR open — [#67879](https://github.com/vllm-project/vllm/pull/67879)

Also worth noting for silent-failure hunters: **DeepGEMM and other kernel-library runtime-JIT gaps in warmup** — silent JIT compiles during production traffic with no easy cache-miss signal — [#64824](https://github.com/vllm-project/vllm/issues/64824).

## 6. What This Means for Application Developers

- **KV cache sizing just changed under you.** v0.34.0's post-warmup sizing means your effective concurrency ceiling may shift (usually up). If you pin `gpu_memory_utilization` tightly or run mixed workloads with warmup phases that don't reflect production, benchmark before rolling out. https://github.com/vllm-project/vllm/releases
- **If you serve tool-calling + structured output, there's a frontend split you should know about.** Python and Rust frontends disagree on `tools` + `response_format` under `tool_choice="auto"` — opposite behavior from the same request. If you're migrating a gateway to the Rust frontend, audit your agent policies. [#66858](https://github.com/vllm-project/vllm/issues/66858)
- **Rust frontend is becoming a real gateway citizen.** `vllm-rs render` now exposes an engine-free gRPC `vllm.Render` service (chat + multimodal + static LoRA), giving gateways a local tokenization/render sidecar — [#65503](https://github.com/vllm-project/vllm/issues/65503). Opt-in gRPC **scheduler retirement acknowledgements** are being added so you can distinguish "output sent" from "engine actually processed cancellation" — genuinely useful for abort semantics in agent loops. [#68062](https://github.com/vllm-project/vllm/pull/68062)
- **Audio/word timestamps remain incomplete.** `timestamp_granularities[]=word` is accepted by `/v1/audio/transcriptions` but no model returns `words`; `verbose_json` only works for models that emit segment timestamps as tokens (Whisper, FunASR, FireRedASR2). Don't build subtitle/aligned-transcript features on this yet. [#66344](https://github.com/vllm-project/vllm/issues/66344)
- **RL / fine-tuning loop builders**: weight transfer is getting a coherent API story — Direct Weight Reload ([#54477](https://github.com/vllm-project/vllm/issues/54477)), an engine-neutral sharded transfer API ([#64418](https://github.com/vllm-project/vllm/issues/64418)), and packed NCCL with a shared chunk layout that fixes OOM on 16 GiB expert stacks ([#68043](https://github.com/vllm-project/vllm/pull/68043), [#68065](https://github.com/vllm-project/vllm/pull/68065)). Batch-invariance docs now point to end-to-end zero-mismatch RL recipes — [#66550](https://github.com/vllm-project/vllm/pull/66550).
- **AMD deployers**: the RDNA attention correctness bug that could fault GPUs is closed, but if you're on MI355X, expect rapid churn as the Qwen3.8/DeepSeek-V4.1/Muse Spark optimization trackers stack PRs — pin versions and follow the trackers for regressions.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-17

## 1. Today's Highlights

The SGLang 1.0 stability effort is now formally tracked in [#50045](https://github.com/sgl-project/sglang/issues/50045), with request-validation fuzzing already landing as a concrete deliverable ([#50753](https://github.com/sgl-project/sglang/pull/50753)). Prefill-Decode disaggregation remains the most active architectural front: a new RFC proposes letting decode compute the prompt tail and sample the first token ([#50547](https://github.com/sgl-project/sglang/issues/50547)), with an initial implementation already open ([#50807](https://github.com/sgl-project/sglang/pull/50807)). On the reliability side, a reproducible HiCache + Mooncake cache hit-rate collapse under L2/L3 pressure ([#47481](https://github.com/sgl-project/sglang/issues/47481)) and a streaming-throughput regression tied to per-chunk disconnect polling ([#50741](https://github.com/sgl-project/sglang/pull/50741)) are the items most likely to affect production deployments this week.

## 2. Releases & Breaking Changes

No releases in the last 24h.

Forward-looking note: the **SGLang 1.0 Release Tracker** ([#50045](https://github.com/sgl-project/sglang/issues/50045)) explicitly states that upgrading from 0.5.x may require changes. The release will replace silent configuration coercion with hard errors that name the offending setting, and will define a compatibility policy for the 1.x series. Teams pinning 0.5.x should begin auditing configs now — see the upgrade notes in the tracker before the 1.0 cut.

## 3. New Model & Hardware Support

- **AMD RDNA3/RDNA4 (gfx1100/gfx1201)**: CI and upstreaming plan on `main` ([#46900](https://github.com/sgl-project/sglang/issues/46900)) — consumer/workstation Radeon targets moving toward supported status.
- **AMD MI355X (gfx950)**: DeepSeek-V4.1-Flash optimization tracker covering text + image input, TP4, and DSpark speculative decoding ([#49327](https://github.com/sgl-project/sglang/issues/49327)).
- **NPU (Ascend)**: H2 roadmap targets full compatibility for PD disaggregation, all parallelism strategies, speculative decoding, hierarchical cache, and load balancing ([#25598](https://github.com/sgl-project/sglang/issues/25598)). HiCache MHA/Mamba transfers are being routed through the NPU `kv_exchange` operator ([#50889](https://github.com/sgl-project/sglang/pull/50889)), and a MindIE-SD sparse-attention backend for SGLang Diffusion is in review ([#40580](https://github.com/sgl-project/sglang/pull/40580)). Qwen-Image 2.1/Turbo adaptation for Ascend is pending a kernel wheel release ([#44056](https://github.com/sgl-project/sglang/pull/44056)).
- **Intel XPU**: cuda-graph at TP > 1 is now rejected when oneCCL < 2022.1.2 to prevent silent all-reduce failures ([#50612](https://github.com/sgl-project/sglang/pull/50612)).
- **RISC-V**: RVV attention backend proposal remains open ([#18072](https://github.com/sgl-project/sglang/issues/18072)).

## 4. Performance & Optimization

- **Tokenizer manager streaming**: reverts per-chunk `is_disconnected()` polling (introduced in #46586) to once-per-wait-timeout. This directly addresses a high-concurrency streaming throughput regression ([#50741](https://github.com/sgl-project/sglang/pull/50741), fixes [#50722](https://github.com/sgl-project/sglang/issues/50722)).
- **AMD gfx942 routers**: Qwen3.5's 512-expert softmax router routed through aiter `topk_gating` ([#50503](https://github.com/sgl-project/sglang/pull/50503)); EAGLE target verify now defaults to `unified_attention` ([#49883](https://github.com/sgl-project/sglang/pull/49883)).
- **GLM-5.3-Flash**: LayerNorm sequence parallelism for `glm5_next` targets the mHC block — on an 8×H200 TP8 proxy, **81 ms of rank 0's 651 ms GPU time** during 128K cold prefill ([#50906](https://github.com/sgl-project/sglang/pull/50906)).
- **Kimi-K3**: sharding KDA + shared-expert weights across attention-DP ranks on PD prefill to fit ADP8 on 8×GB300; currently 60.8 GB/rank of replicated KDA projections plus 24 GB shared experts ([#50842](https://github.com/sgl-project/sglang/pull/50842)).
- **Rust processor**: `sglang-api-types` bumped to 0.1.1, lockfiles updated ([#50028](https://github.com/sgl-project/sglang/pull/50028)).
- **DSPARK + PP/CP**: enabling DSpark and DP attention during prefill now works alongside PP or CP on NPU ([#50783](https://github.com/sgl-project/sglang/pull/50783)); PP decode with stage-local draft owners in review ([#49437](https://github.com/sgl-project/sglang/pull/49437)).

## 5. Stability & Regressions

Ranked by production severity:

1. **[Critical] HiCache + Mooncake hit-rate collapse** — Reproducible transient drop from **87.4% to sharply lower** under L2/L3 capacity pressure during multi-turn benchmarks ([#47481](https://github.com/sgl-project/sglang/issues/47481)). No fix PR yet. Affects any deployment using hierarchical caching with SSD offload.
2. **[Critical] Streaming throughput regression** — High-concurrency streaming throughput dropped after #46586 due to per-chunk disconnect polling. Fix PR open ([#50741](https://github.com/sgl-project/sglang/pull/50741)).
3. **[High] SIGTERM drops in-flight streams with multi-tokenizer-worker** — First drained worker shuts down shared schedulers, killing sibling workers' streams. Fix PR open ([#50518](https://github.com/sgl-project/sglang/pull/50518)).
4. **[High] Humming FP16 Stream-K GEMM NaN on exact-zero results** — Block-scaled FP8 E4M3, M=42/N=6144/K=2048; opt-in dense FP32 reduction fix in review ([#50521](https://github.com/sgl-project/sglang/issues/50521), [#50913](https://github.com/sgl-project/sglang/pull/50913)).
5. **[Medium] Intel XPU GDN chunk prefill 2.6× slower and wrong `recompute_w_u` for K != V** — regression since #47944 ([#50249](https://github.com/sgl-project/sglang/issues/50249)).
6. **[Medium] `--enable-return-routed-experts` crashes on Gemma 4** — capturer reads `num_experts_per_tok`, but Gemma 4 uses `top_k_experts` ([#50834](https://github.com/sgl-project/sglang/issues/50834)).
7. **[Medium] DSPARK dumps cannot distinguish draft vs target model** — both report `TARGET_VERIFY`, complicating speculative-decoding debugging ([#50087](https://github.com/sgl-project/sglang/issues/50087)).
8. **[Low] WeightChecker `reset_tensors` fills `MRotaryEmbedding.axis_map` with random values** — regression from #34446, affects any rope-config validation path ([#44501](https://github.com/sgl-project/sglang/issues/44501)).
9. **[Low] NPU distributed init enters NVML path** — #49524 introduced an unconditional NVML query for cross-node TP groups; fix restricts to CUDA ([#50744](https://github.com/sgl-project/sglang/pull/50744)).
10. **CI health**: tracker [#17050](https://github.com/sgl-project/sglang/issues/17050) reports **10 broken, 17 flaky, 907 recently fixed** as of 2026-11-17 03:06 UTC. The NVIDIA babysitting tracker ([#42752](https://github.com/sgl-project/sglang/issues/42752)) remains the active aggregation point for PR-test flakiness.

Note: the CUDA coredump tracker ([#26340](https://github.com/sgl-project/sglang/issues/26340)) is auto-generated telemetry, not a discrete bug — treat its comment volume as a CI noise signal rather than an incident count.

## 6. What This Means for Application Developers

- **Streaming agents on multi-worker tokenizers**: if you run `--tokenizer-worker-num > 1`, expect dropped streams on graceful shutdown (SIGTERM during deploys). Track [#50518](https://github.com/sgl-project/sglang/pull/50518) and consider serializing shutdowns until it lands.
- **High-concurrency streaming**: throughput on the streaming path has been suppressed since #46586. If you benchmarked a regression in the last few weeks, [#50741](https://github.com/sgl-project/sglang/pull/50741) is likely the fix — verify against it before tuning elsewhere.
- **Hierarchical caching in production**: if you rely on HiCache + Mooncake for multi-turn workloads, the 87.4% → collapse pattern in [#47481](https://github.com/sgl-project/sglang/issues/47481) means your tail latency during L3 pressure may be significantly worse than hit-rate dashboards suggest. Instrument per-round, not just aggregate, hit rate.
- **Multimodal ingress**: the new shared-memory decoded-media ingress ([#50781](https://github.com/sgl-project/sglang/pull/50781)) is worth tracking if you currently inline tens/hundreds of MiB of decoded images/video/audio per request over gRPC — it eliminates the framing and re-encode copies.
- **Speculative decoding debugging**: if you dump traces under DSPARK, be aware draft and target currently both emit `TARGET_VERIFY` ([#50087](https://github.com/sgl-project/sglang/issues/50087)) — correlating acceptance requires out-of-band context for now.
- **Migration planning**: with 1.0 framed as a stability release that errors on previously-silent config coercion, treat any config you've never explicitly validated as a candidate for failure at upgrade. Read [#50045](https://github.com/sgl-project/sglang/issues/50045) before pinning a 1.x version in CI.
- **Anthropic-compatible endpoints**: `cache_creation_input_tokens` is still missing from `/v1/messages` responses ([#39922](https://github.com/sgl-project/sglang/issues/39922), closed inactive) — if you bill or meter on that field, you're currently under-reporting cache writes.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-17

## 1. Today's Highlights

The biggest structural change today is the start of the UI split: `tools/ui` moves to `ui/apps/chat` as **Llama Chat**, the first step toward a shared `ui/lib` + separate apps architecture ([b12451](https://github.com/ggml-org/llama.cpp/releases/tag/b12451), #32032). On the backend side, Vulkan got a batch of fixes (fp32 FA shmem overflow on Nvidia, 32-bit build fix) and HIP gained gfx1013/RDNA1 support plus GDN MMA on CDNA. A notable cluster of new model-support PRs landed (Kokoro TTS, YuE2-3B, VoxCPM2, MiniCPM5 MoE, tiny-voca), signaling growing **audio/multimodal** scope in `mtmd`, while a long list of CUDA/Vulkan regressions remain open.

## 2. Releases & Breaking Changes

- **b12451 — UI restructure**: `tools/ui` → `ui/apps/chat`, app renamed **Llama Chat**. This is the first step of the `ui/lib` refactor; downstream projects that reference the old UI path need to update ([release](https://github.com/ggml-org/llama.cpp/releases/tag/b12451), #32032).
- **b12449 — CLI arg change**: `--tensor-split` and `--fit-target` now accept up to `llama_max_devices()` configs (previously limited); parsing is more permissive but scripts relying on strict arg counts should be reviewed ([release](https://github.com/ggml-org/llama.cpp/releases/tag/b12449), #13293, #31435).
- **b12448 — Jinja**: scope-chain key lookup implemented; template semantics for nested scopes changed slightly. Test added for call-statement lambda ([release](https://github.com/ggml-org/llama.cpp/releases/tag/b12448), #32396).
- **b12438 — Jinja**: `json sort_keys=true` now supported ([release](https://github.com/ggml-org/llama.cpp/releases/tag/b12438), #32366).
- **`libllama` API changelog** (#9289) is still maintained but open — third-party `libllama` consumers should track it for upcoming breaking changes ([#9289](https://github.com/ggml-org/llama.cpp/issues/9289)).

No hard API removals in the last 24h; changes above are behavior/semantics level.

## 3. New Model & Hardware Support

- **Kokoro-82M TTS** support added ([PR #32413](https://github.com/ggml-org/llama.cpp/pull/32413)), plus a built-in `tts_dict` helper in chat templates for storing G2P pronunciation lexicons in GGUF ([PR #32397](https://github.com/ggml-org/llama.cpp/pull/32397)).
- **YuE2-3B** audio/multimodal support (mtmd owns a `llama_context` to make mmproj all-in-one) — PR [#32369](https://github.com/ggml-org/llama.cpp/pull/32369) closed; follow-on work continues.
- **VoxCPM2** ([PR #32443](https://github.com/ggml-org/llama.cpp/pull/32443)) and **tiny-voca** ([PR #32427](https://github.com/ggml-org/llama.cpp/pull/32427)) TTS/audio models in progress.
- **MiniCPM5 MoE** inference support with gated GQA, leading dense FFN, routed/shared experts, and per-layer inputs for DSpark speculative decoding ([PR #32386](https://github.com/ggml-org/llama.cpp/pull/32386)).
- **HIP/RDNA1**: gfx1013 added ([release](https://github.com/ggml-org/llama.cpp/releases/tag/b12442), #32236).
- **HIP/CUDA**: GDN MMA kernel enabled on CDNA ([release](https://github.com/ggml-org/llama.cpp/releases/tag/b12444), #31327).
- **Vulkan**: split_k support for conv3d via coopmat2 256×128 shape, reusing mul_mat split_k reduce shader ([release](https://github.com/ggml-org/llama.cpp/releases/tag/b12445), #29929).
- **WebGPU**: per-head flash attention masks fixed — masks with `ne[2] > 1` previously gave wrong results ([release](https://github.com/ggml-org/llama.cpp/releases/tag/b12441), #32394).
- **OpenVINO**: expanded Qwen3.5 (GDN) NPU support, Qwen MTP/multi-sequence, gemma-4 fixes ([PR #32172](https://github.com/ggml-org/llama.cpp/pull/32172)).
- **OpenCL**: added optimized Q8_0 non-MoE GEMM bin kernel for Adreno X1 ([PR #31003](https://github.com/ggml-org/llama.cpp/pull/31003)).
- **Ternary quant formats**: requests for Prism PQ2_0/PTQ1_0 (types 142/143) [#29058](https://github.com/ggml-org/llama.cpp/issues/29058) and ternary Hadamard rotation work [#32160](https://github.com/ggml-org/llama.cpp/issues/32160) remain open.
- **RVV**: Mamba-2 SSM scan vectorized for RISC-V Vector ([PR #32448](https://github.com/ggml-org/llama.cpp/pull/32448)) — previously fell back to scalar.

## 4. Performance & Optimization

- **CUDA/HIP KV quantization in FA tile** (#31234): `flash_attn_tile` now reads K/V as stored (q4_0, q4_1, q5_0, q5_1, q8_0, bf16) with dequant on tile load — reduces memory traffic for quantized KV cache ([PR #31234](https://github.com/ggml-org/llama.cpp/pull/31234)).
- **CUDA mmid F32 path for strided experts** (#31961): avoids quantizing activations before MUL_MAT_ID for Q4_K/Q5_0/Q8_0, preserving small components ([PR #31961](https://github.com/ggml-org/llama.cpp/pull/31961)).
- **Vulkan conv3d split_k** (#29929): uses coopmat2 256×128 shape when profitable ([release](https://github.com/ggml-org/llama.cpp/releases/tag/b12445)).
- **GGML async input copies** (#30685): host inputs (tokens, positions, masks, CPU-computed split tensors) can be batched via `set_tensor_async` + single sync instead of per-input blocking copies. Opt-in via new `ggml_backend_dev_caps.async_host_input` — cross-backend (CUDA/Vulkan/SYCL/Metal/etc.) ([PR #30685](https://github.com/ggml-org/llama.cpp/pull/30685)).
- **OpenVINO NPU/GPU/memory** expansions ([PR #32172](https://github.com/ggml-org/llama.cpp/pull/32172)).
- **Negative result worth noting**: generic IQ3_S SoA reorder on SYCL MoE is ~8× slower (1.53 → 8.31 t/s on Arc A770) — needs an `fg_soa<block_iq3_s>` specialization rather than the generic path ([#32323](https://github.com/ggml-org/llama.cpp/issues/32323)).

## 5. Stability & Regressions

Ranked by severity:

1. **CUDA VMM-pool OOM hard-aborts the process** (`ggml_abort` in `ggml_cuda_mul_mat_q` during prompt processing) instead of failing the request/load. A fix PR exists: [#32440](https://github.com/ggml-org/llama.cpp/pull/32440) returns `ALLOC_FAILED` gracefully ([issue #31974](https://github.com/ggml-org/llama.cpp/issues/31974)).
2. **Vulkan FA prefill crash** in `amdvlk64.dll` on RDNA3/Windows (flip-direct path) — regression from #31323 ([#32353](https://github.com/ggml-org/llama.cpp/issues/32353)). Related: Vulkan fp32 FA shmem overflow on Nvidia was fixed today in [b12443](https://github.com/ggml-org/llama.cpp/releases/tag/b12443) (#32244).
3. **V100 (sm_70) prefill regression in v1.0.0** vs v0.8.0 — significant drop, no fix PR yet ([#32245](https://github.com/ggml-org/llama.cpp/issues/32245)).
4. **IMROPE cache reuse regression (Qwen3.5)**: prompt cache disabled, full re-prefill on every follow-up request ([#32316](https://github.com/ggml-org/llama.cpp/issues/32316)).
5. **Mellum 8× slower on CUDA** since #30584 — `ffn_moe_down` MUL_MAT_ID falls back to CPU ([#30704](https://github.com/ggml-org/llama.cpp/issues/30704)).
6. **HIP/gfx906 MoE prefill 15–50% slower** since #29948 (now closed, but regression existed) ([#31599](https://github.com/ggml-org/llama.cpp/issues/31599)).
7. **Nondeterministic logprobs** in `/v1/completions` on SYCL iGPU + MoE; request `seed` doesn't pin the distribution ([#31206](https://github.com/ggml-org/llama.cpp/issues/31206)).
8. **`--spec-type draft-mtp` abort** with GGML_ASSERT in `llm_graph_input_kpool::set_input` on server start ([#30860](https://github.com/ggml-org/llama.cpp/issues/30860)).
9. **Metal multi-minute stalls** during large-context prefill on qwen4exp (wall time 10–50× compute time) ([#30726](https://github.com/ggml-org/llama.cpp/issues/30726)).
10. **Hybrid model slot livelock** on "erasing old context checkpoint" (qwen4exp, Vulkan, two slots) ([#28280](https://github.com/ggml-org/llama.cpp/issues/28280)).
11. **32-bit Vulkan build fix** landed ([b12436](https://github.com/ggml-org/llama.cpp/releases/tag/b12436), #32275).
12. **Security**: heap-buffer-overflow via malformed mmproj in `pocket-tts gen-audio` reported ([#29905](https://github.com/ggml-org/llama.cpp/issues/29905)) — validate mmproj inputs if you accept untrusted multimodal files.

Also note: **Windows iGPU host-buffer issue** with `--fit` on by default — model loading fails with `unable to allocate ROCm0 buffer` when weights land in pinned memory; PR [#32445](https://github.com/ggml-org/llama.cpp/pull/32445) addresses this.

## 6. What This Means for Application Developers

- **New audio modality is arriving fast.** Kokoro/YuE2/VoxCPM2/tiny-voca support means llama.cpp is moving beyond text+vision into TTS/audio, with `tts_dict` and shared-template mechanics built into GGUF. If you're building agent pipelines with voice output, watch `mtmd` PRs closely — the "mmproj owns a context, works out of the box" pattern (#32369) will shape how you load these models.
- **UI split creates a `ui/lib` shared layer.** If you fork or embed the web UI, plan for the `ui/apps/chat` path change now (b12451) and expect more app-level separation.
- **Server-side determinism caveat**: on SYCL iGPU + MoE, `/v1/completions` logprobs are nondeterministic and request `seed` doesn't pin them (#31206). If your app depends on logprob-based routing or scoring on that hardware, add retries or a reranker.
- **Prompt cache is fragile for IMROPE models** (#32316) — expect full re-prefill on Qwen3.5 follow-ups. Budget latency accordingly or wait for a fix.
- **Anthropic-API compatibility gap**: `tool_choice: {"type": "none"}` and `disable_parallel_tool_use` are currently ignored in `/v1/messages`; PR [#31922](https://github.com/ggml-org/llama.cpp/pull/31922) fixes this for agents that rely on Anthropic-style constraints.
- **Async host input** (#30685) is opt-in per device via a new capability flag — when it lands, batched input copies cut sync overhead cross-backend; worth tracking for high-QPS serving.
- **Graceful OOM** (#32440) is the key reliability change to watch: long-running servers currently SIGABRT on CUDA VMM pool exhaustion during prefill. Until merged, cap `n_ctx`/batch sizes to stay under pool limits on multi-tenant deployments.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-17

## 1. Today's Highlights

No releases landed in the last 24 hours, but the issue tracker and PR queue show a project in active stabilization: Vulkan/CANN backend work, MLX memory-pressure adaptation, and VRAM accounting fixes dominate. The most consequential long-running thread is the MLX runner series (#19677, #19678, #19730, #19663) tightening saved-history reuse and speculative batching. Meanwhile, a cluster of tool-calling and hardware-specific crashes continue to surface from the 0.40.x line.

## 2. Releases & Breaking Changes

None in the last 24h. Note for forward planning: `/api/usage` on Ollama Cloud no longer returns session/weekly usage percentages — only request-count buckets ([#19511](https://github.com/ollama/ollama/issues/19511), closed). The web UI still shows percentages, so this is a regression, not a removal.

## 3. New Model & Hardware Support

- **CANN / Ascend NPU backend (in review)** — PR [#19732](https://github.com/ollama/ollama/pull/19732) adds a `ggml-cann` build option and CANN device discovery, passing selected device IDs to `llama-server`. Directly relevant to teams evaluating Ascend hardware.
- **Tencent Hy4 flash on Cloud (requested)** — [#19722](https://github.com/ollama/ollama/issues/19722) asks for Hy4 flash, citing pricing that undercuts DeepSeek V4.1 Flash with comparable WorkIndex performance.
- **D3.1 nano prefix bidirectional MLX scoring** — PR [#19729](https://github.com/ollama/ollama/pull/19729) (testing artifact: `dhiltgen/d3.1-nano:2b`).
- **Packager-friendly MLX-C / XGrammar** — PR [#19688](https://github.com/ollama/ollama/pull/19688) lets distributors supply these as independent binaries, decoupling from Ollama's bundled versions.

## 4. Performance & Optimization

- **MLX saved-prefix reuse across busy slots** — PR [#19677](https://github.com/ollama/ollama/pull/19677) lets a new request reuse a compatible saved prefix from a busy slot, reducing redundant prompt processing for overlapping conversations.
- **Adaptive saved-history under memory pressure** — PR [#19678](https://github.com/ollama/ollama/pull/19678) (Metal) and [#19730](https://github.com/ollama/ollama/pull/19730) (integrated CUDA on Linux/Windows) replace the fixed 8 GiB history allowance with pressure-driven retention, so slots stop discarding useful conversations while memory is still free.
- **Batched speculative verification** — PR [#19663](https://github.com/ollama/ollama/pull/19663) (closed) keeps drafting active during concurrent requests for MTP/DFlash/DFlash2 models, instead of disabling it when slots overlap.
- **Drafting toggle for benchmarks** — PR [#19391](https://github.com/ollama/ollama/pull/19391) enables `draft_num_predict=0` per request to measure speculative-decoding speedup cleanly.
- **Per-request metrics logging** — PR [#19723](https://github.com/ollama/ollama/pull/19723) adds opt-in JSONL token metrics via `OLLAMA_LOG_METRICS=1` and `OLLAMA_METRICS_LOG_FILE`. Useful for capacity planning.
- **Embed HTTP keep-alives** — PR [#18397](https://github.com/ollama/ollama/pull/18397) (closed) removes `DisableKeepAlives: true` from the embed client, eliminating a `GET /health` per `/api/embed` input under load.

## 5. Stability & Regressions

Ranked by severity:

1. **VRAM accounting and GPU splitting** — PR [#19632](https://github.com/ollama/ollama/pull/19632) addresses four bugs ([#19463](https://github.com/ollama/ollama/issues/19463), [#18679](https://github.com/ollama/ollama/issues/18679), [#18349](https://github.com/ollama/ollama/issues/18349), [#16599](https://github.com/ollama/ollama/issues/16599)) causing incorrect model eviction, load refusal, or unnecessary multi-GPU spread. **Fix PR open.**
2. **Vulkan backend crash on AMD Renoir iGPU** — `llama-server` exits with NTSTATUS `0xe06d7363` at model load on Ryzen 4700U / gfx90c, in 0.40.14 and 0.40.15-rc2. Every model affected ([#19558](https://github.com/ollama/ollama/issues/19558), closed).
3. **AMD RX 5500 (Navi 14 / gfx1010) not detected** — SIGBUS in `llama-server --list-devices` with the Vulkan backend ([#19589](https://github.com/ollama/ollama/issues/19589), open).
4. **Qwen tool-calling failures on 0.40.13** — native tool calling broken for `qwen2.5-coder:7b` and Qwen3 ([#19524](https://github.com/ollama/ollama/issues/19524)). Related stream-parser corruption fix in PR [#19705](https://github.com/ollama/ollama/pull/19705), which resolves five distinct argument-mangling/lost-call cases in qwen3.5 / qwen3-coder parsers. **Fix PR open — high priority for agent builders.**
5. **Missing tensors on custom models** — `blk.0.ssm_beta.weight not found` on 0.40.16 with llama.cpp 0.9.0-dev ([#19733](https://github.com/ollama/ollama/issues/19733), open).
6. **Claude Desktop + MLX cache loss** — ~17K-token initial prefill, HTTP 500 retries, MLX cache loss on M4 Max at 256K context ([#19359](https://github.com/ollama/ollama/issues/19359), closed as needs-more-info).
7. **Build breakage on GCC 15** — missing `#include <cstdint>` in `llama-mmap.h` ([#19714](https://github.com/ollama/ollama/issues/19714), open).
8. **Windows ARM64 Gemma3 vision timeouts** — multimodal encoding hangs on CPU for even 128×128 JPEGs ([#19444](https://github.com/ollama/ollama/issues/19444), open).
9. **REPL multiline-mode trap** — Ctrl+C during `"""` input leaves `ollama run` stuck in multiline mode, swallowing subsequent input ([#19340](https://github.com/ollama/ollama/issues/19340)). Fix in PR [#19731](https://github.com/ollama/ollama/pull/19731).
10. **Port-bind error on 11434** — localized English error, likely a stale daemon ([#19712](https://github.com/ollama/ollama/issues/19712), open).

## 6. What This Means for Application Developers

- **Pin your tool-calling evaluations.** Qwen2.5-Coder / Qwen3 native tool calling is flaky on 0.40.13 and the parser corruption fix is still in review. If you ship agents on these models, track [#19524](https://github.com/ollama/ollama/issues/19524) and PR [#19705](https://github.com/ollama/ollama/pull/19705) before assuming a version bump is safe.
- **Concurrency is getting faster, but only on MLX for now.** The saved-prefix reuse and batched speculative verification work in #19677 / #19663 specifically benefits multi-slot workloads with shared prompts — expect throughput gains in agent loops and RAG pipelines once merged. CUDA-side adaptive history (#19730) is the first step toward parity.
- **Opt into metrics if you operate shared inference.** #19723 gives you per-request token counts in JSONL with two env vars and no schema changes. Cheap observability for capacity planning and per-tenant cost attribution.
- **GPU VRAM handling remains the top source of user-visible weirdness.** #19632 consolidates four long-standing splitting/eviction bugs. If users report "model won't load" or "spread across GPUs unnecessarily," this PR is the likely fix.
- **Ascend NPU support is coming.** If you're constrained by NVIDIA availability, watch #19732 — it's the first credible path to running Ollama on CANN hardware.

---
*Sources: [ollama/ollama](https://github.com/ollama/ollama) issues and PRs updated 2026-11-16 → 2026-11-17.*

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-17

## 1. Today's Highlights

Release v1.108.10 ships as the current patch on the 1.108 LTS line, with a wave of LTS backports landing today (Gemini tool-call parsing, Cohere `COHERE_API_BASE`, OpenRouter streaming, DeepSeek effort passthrough) — signaling the project is stabilizing the LTS branch rather than main. The dominant theme in open work is a Rust migration: parallel request limiter, model capacity/dynamic rate limiter, spend logs, and `/v1/messages` beta-header loading are all being ported to Rust `CustomLoggerV2` callbacks ([#51537](https://github.com/BerriAI/litellm/pull/51537), [#51540](https://github.com/BerriAI/litellm/pull/51540), [#52182](https://github.com/BerriAI/litellm/pull/52182), [#52188](https://github.com/BerriAI/litellm/pull/52188)). On the stability side, several correctness bugs affecting billing and routing surfaced today, most notably Vertex `global` deployments being priced as `us-central1` ([#52043](https://github.com/BerriAI/litellm/issues/52043)).

## 2. Releases & Breaking Changes

- **v1.108.10** released. Docker image is cosign-signed; verify with the published `cosign verify` command against `ghcr.io/berriai/litellm:v1.108.10`. Release notes are truncated ("## What's…"), so review the full changelog before upgrading.
- **LTS branch policy in effect**: fixes now need explicit backports to `lts/1.108.x` (e.g., [#52201](https://github.com/BerriAI/litellm/pull/52201), [#52200](https://github.com/BerriAI/litellm/pull/52200), [#52194](https://github.com/BerriAI/litellm/pull/52194), [#52196](https://github.com/BerriAI/litellm/pull/52196)). If you pin to 1.108.x, expect main-line fixes to arrive via separate LTS PRs.
- **Breaking-in-progress (watch, not merged)**: [#52172](https://github.com/BerriAI/litellm/pull/52172) `feat(cost-map)!` moves OpenAI/Anthropic billing to typed per-provider configs — marked breaking. Draft, not ready to consume.
- **Behavioral config change (fix)**: [#21554](https://github.com/BerriAI/litellm/issues/21554) — `completion_model` in `general_settings` always overriding client-specified model instead of acting as fallback (closed today).

## 3. New Model & Hardware Support

- **OpenAI GPT-5.6 family / Azure GPT-6 Astra**: model map corrections — `supports_max_reasoning_effort` missing or wrong for `gpt-5.6-{sol,luna,terra}` and Azure `gpt-6-astra` in `model_prices_and_context_window.json` ([#47884](https://github.com/BerriAI/litellm/issues/47884), open).
- **Snowflake Cortex (`snowflake/`)**: provider gaps reported — streaming tool-calls dropped, misleading endpoint docs, OpenAI/Anthropic-compatible Cortex endpoint issues ([#30762](https://github.com/BerriAI/litellm/issues/30762), open).
- **Z.AI `glm-5.2[1m]`**: documented 1M variant returned `Unknown Model` through proxy; closed today ([#32218](https://github.com/BerriAI/litellm/issues/32218)).
- **Bedrock Canada inference profiles (`ca.*`)**: `reasoning_effort` was silently dropped on Claude via `ca.` profiles while `us.` worked; closed today ([#52110](https://github.com/BerriAI/litellm/issues/52110)).
- **DeepSeek V4 on Azure AI Foundry**: reasoning not applied via `azure_ai` provider; closed today ([#33202](https://github.com/BerriAI/litellm/issues/33202)).

## 4. Performance & Optimization

- **Rate limiter Redis write elimination**: skip post-call Redis counter writes for keys/users/teams with no configured limits — avoids wasted writes at high throughput ([#31880](https://github.com/BerriAI/litellm/issues/31880), closed).
- **Rust parallel request limiter v3**: port of the proxy's limiter to a Rust `CustomLoggerV2` callback ([#51537](https://github.com/BerriAI/litellm/pull/51537), draft, not run against live proxy).
- **Rust model capacity / dynamic rate limiter v3**: replaces the Python handler and deletes it; stacked on #51537 ([#51540](https://github.com/BerriAI/litellm/pull/51540), draft).
- **Rust spend-log callback**: awaited on `attempt_ended` / `post_call_failure`, part of the LTS→Rust callback migration stack ([#52182](https://github.com/BerriAI/litellm/pull/52182)).
- **`/v1/messages` beta-map load fix**: Rust worker was downloading the Anthropic beta-headers map on every cold worker even without `anthropic-beta` present ([#52188](https://github.com/BerriAI/litellm/pull/52188), open).
- **Memory leak fix**: cached `GenericAPILogger` reused so config reloads stop leaking background flush tasks — idle gateway CPU previously climbed until restart ([#50879](https://github.com/BerriAI/litellm/pull/50879), open).
- **Rust-backed pip wheel program**: ongoing tracker for install issues with Rust extensions in default `pip install litellm` ([#31261](https://github.com/BerriAI/litellm/issues/31261), closed/stale).

## 5. Stability & Regressions

Ranked by severity (all open unless noted):

1. **Billing correctness — Vertex `global` priced as `us-central1`** on `/v1/messages`, `/v1/responses`, streamed chat, and cache hits, applying regional uplift multipliers incorrectly ([#52043](https://github.com/BerriAI/litellm/issues/52043)). No fix PR referenced.
2. **Router misroutes `/v1/decisions`** to a Bedrock deployment first, so every request fails once before fallback ([#52064](https://github.com/BerriAI/litellm/issues/52064), closed).
3. **Spend cap blocks free/local models**: exceeding a key's spend limit prevents use of free models routed through the same proxy ([#52071](https://github.com/BerriAI/litellm/issues/52071), open, 👍2).
4. **`stream_chunk_builder` TypeError** when a provider streams `reasoning_content` as a list of structured blocks (GPT reasoning models) ([#50893](https://github.com/BerriAI/litellm/issues/50893), open).
5. **Gemini intermittent 503 / `APIConnectionError`** through the gateway, alternating across retries ([#50434](https://github.com/BerriAI/litellm/issues/50434), open).
6. **`completion(tools=...)` requires `mcp` module** on base install; `ModuleNotFoundError` for ordinary function tools ([#50781](https://github.com/BerriAI/litellm/issues/50781), closed).
7. **Groq 401 mapped to `BadRequestError`** instead of `AuthenticationError` — wire status correct, client-side classification wrong ([#51994](https://github.com/BerriAI/litellm/issues/51994), closed).
8. **Cohere embeddings ignore `COHERE_API_BASE`** (rerank honors it); LTS backport in [#52194](https://github.com/BerriAI/litellm/pull/52194) ([#50248](https://github.com/BerriAI/litellm/issues/50248), closed).
9. **MCP JWT signer overwrites static `auth_value`** on keyed MCP servers → 401s ([#47988](https://github.com/BerriAI/litellm/issues/47988), closed).
10. **Gemini 500 on prior tool calls with null/cut-off args**; shared parser fix on main ([#50020](https://github.com/BerriAI/litellm/pull/50020)) and LTS backport ([#52201](https://github.com/BerriAI/litellm/pull/52201)).
11. **Anthropic thinking blocks closed without signature** breaks Vercel AI SDK reasoning between tool steps; duplicate fix PRs [#52116](https://github.com/BerriAI/litellm/pull/52116) / [#52117](https://github.com/BerriAI/litellm/pull/52117) (open).
12. **End-user spend reset** applies proxy-wide default budget instead of key-specific default ([#50837](https://github.com/BerriAI/litellm/issues/50837), open).
13. **SSO multi-app-role**: first `app_roles` entry picked rather than highest-privilege ([#33434](https://github.com/BerriAI/litellm/issues/33434), open).
14. **MCP context leakage** (`_mcp_active_toolset_id`) under async stream interruption — static analysis finding ([#30416](https://github.com/BerriAI/litellm/issues/30416), closed).
15. **Unexplained 502s** in steady state through proxy ([#37168](https://github.com/BerriAI/litellm/issues/37168), open).
16. **Community confidence flag**: maintainers criticized for unresolved production-critical bugs and PR handling ([#31416](https://github.com/BerriAI/litellm/issues/31416), closed, 👍3) — worth weighing if you depend on fast turnaround on main.

**Features in flight**: `litellm.agent_eval()` for scoring harnesses/models through `litellm.agent()` ([#52143](https://github.com/BerriAI/litellm/issues/52143)); Bedrock guardrail image scanning on `/apply_guardrail`, previously silently "passed" images ([#51016](https://github.com/BerriAI/litellm/pull/51016)); Anthropic `anthropic-user-profile-id` forwarding for per-end-user safety actions ([#51866](https://github.com/BerriAI/litellm/pull/51866)).

## 6. What This Means for Application Developers

- **Pin and track the LTS line deliberately.** If you're on 1.108.x, the fixes you want (Gemini tool args, Cohere base URL, OpenRouter usage trailers, DeepSeek effort) land as separate backports — check `lts/1.108.x` PRs, not just main, before assuming a bug is fixed.
- **Audit Vertex cost accuracy if you use `global` deployments.** Until [#52043](https://github.com/BerriAI/litellm/issues/52043) is resolved, spend logs may overstate cost by applying `us-central1` uplift multipliers — reconcile against GCP billing before trusting budget enforcement.
- **Budget enforcement has edge cases.** Free/local models can be blocked by key spend caps ([#52071](https://github.com/BerriAI/litellm/issues/52071)) and end-user resets can apply the wrong default tier ([#50837](https://github.com/BerriAI/litellm/issues/50837)). If you gate free models behind the same key as paid traffic, verify behavior in staging.
- **Streaming robustness still requires defensive parsing.** `stream_chunk_builder` crashes on list-form `reasoning_content` ([#50893](https://github.com/BerriAI/litellm/issues/50893)), and Anthropic `/v1/messages` thinking blocks may arrive unsigned on the Vercel AI SDK path — validate/guard tool-step boundaries on the client side.
- **The Rust migration will change operational tuning knobs.** Rate limiting, model capacity, and spend logging are moving from Python handlers to Rust callbacks (#51537, #51540, #52182). These are drafts, but expect the old Python implementations to be deleted — plan config reviews and load tests once they merge.
- **For high-volume gateways**, the Redis write skip for unlimited keys ([#31880](https://github.com/BerriAI/litellm/issues/31880)) and the `GenericAPILogger` leak fix ([#50879](https://github.com/BerriAI/litellm/pull/50879)) are the two most impactful reliability wins available today — worth tracking into your next upgrade.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-17

## Today's Highlights
Unsloth shipped **v0.1.918-beta**, introducing beta **computer use** (local models interacting with screen/apps) plus **MCP integrations** for Unity, Unreal Engine, Blender and Roblox, and first-class support for **MiniMax-H3-Image** (GGUF/FP8/INT8 + LoRA training). A large wave of post-release stabilization work followed, with several regressions tied to the v0.1.918 beta model loading path and the bundled llama.cpp update. In parallel, the training side saw significant multi-GPU work land: adaptive DDP/FSDP2 selection, tensor-parallel embedding offload to CPU, and a GradScaler fix for forced-float32 families (Gemma-3/4).

## Releases & Breaking Changes
- **v0.1.918-beta** — ["Computer Use, MiniMax-H3-Image + Perf fixes"](https://github.com/unslothai/unsloth/releases): adds `computer use (beta)`, MCP integrations for Unity/Unreal/Blender/Roblox, new model picker, redesigned UI. No formal migration notes, but see regressions below.
- **Bundled llama.cpp update** is implicated in a desktop crash: [Issue #17981](https://github.com/unslothai/unsloth/issues/17981). Treat the matching `llama.cpp` revision as a rollback candidate if you pin builds.
- **Tool-name API contract drift (docs):** the curl/HTTP guide lists `bash` as a built-in tool, but the backend actually registers it as `terminal` — callers using `enabled_tools: ["bash"]` silently fail. Fix PRs: [#18056](https://github.com/unslothai/unsloth/issues/18056); stale tool-policy defaults also flagged in [#18055](https://github.com/unslothai/unsloth/issues/18055).

## New Model & Hardware Support
- **MiniMax-H3-Image (-Image)**: now supports GGUF, FP8, and INT8 inference with LoRA training ([release notes](https://github.com/unslothai/unsloth/releases)).
- **AMD NPU / Q4NX export**: new export path added, but a correctness caveat — Q4NX currently packs Q4_0/Q4_1/Q8_0 blocks without validating layout compatibility; Qwen3.5-4B from a Q4_0 GGUF emits repeated slashes on NPU. Fix PR: [#18064](https://github.com/unslothai/unsloth/pull/18064).
- **Intel XPU**: FP8 training enabled via a new XPU code path (no `fbgemm`; uses more memory-efficient but lower-token/s FP8). PR: [#12535](https://github.com/unslothai/unsloth/pull/12535).
- **AMD ROCm / iGPU confusion**: Studio VRAM planner still queries the wrong device on mixed GPU setups — see [Issue #17787](https://github.com/unslothai/unsloth/issues/17787) (SYCL build reads `nvidia-smi` VRAM) and fix PR [#14039](https://github.com/unslothai/unsloth/pull/14039) (iGPU/false 36 GiB capacity, blocks dual R9700 testing).

## Performance & Optimization
- **Tensor parallel embedding offload**: under `UNSLOTH_PARALLEL="tp=2"`, a large frozen input embedding can now live in CPU memory, enabling Qwen3.8-27B 4-bit on 2×T4 (vocab 248320, hidden 5120) without duplicating whole copies per rank. PR: [#18068](https://github.com/unslothai/unsloth/pull/18068).
- **Adaptive parallelism**: `UNSLOTH_PARALLEL=auto` now picks DDP when model + training state fit on every GPU, else native FSDP2 — benchmarks show FSDP2 is often slower and heavier on 2×T4 Kaggle. PR: [#18061](https://github.com/unslothai/unsloth/pull/18061).
- **FSDP2 generate memory**: gather one decoder block at a time during generation instead of all-gathering the whole model; fixes OOM on Mistral Nemo 12B / 2×T4. PR: [#18038](https://github.com/unslothai/unsloth/pull/18038).
- **ROCm VRAM planning**: decline context-free KFD readings when a KFD render node isn't openable, preventing over-commitment on restricted AMD containers. PR: [#16148](https://github.com/unslothai/unsloth/pull/16148).
- **Forced float32 training divergence fixed**: float16 weights now get a GradScaler, resolving Gemma-4 E2B loss blow-up (2.5 → 9.5 over 60 steps on T4). PR: [#18065](https://github.com/unslothai/unsloth/pull/18065).

## Stability & Regressions
Ranked by severity, with fix status:
1. **🔴 High — Gemini 3 RAG auto-inject broken**: chats with attached files fail on first message ("Function call is missing a thought_signature"). PR: [#18014](https://github.com/unslothai/unsloth/pull/18014).
2. **🔴 High — Ollama Modelfile SYSTEM prompt dropped**: `ollama create` personas/fine-tunes answer as the base model in Studio. PR: [#18045](https://github.com/unslothai/unsloth/pull/18045).
3. **🟠 Medium — v0.1.918 model loading + sluggish UI**: does not restore last-used model, forces Gemma E2B, laggy UI. [Issue #18002](https://github.com/unslothai/unsloth/issues/18002); related lag/crash reports: [#18063](https://github.com/unslothai/unsloth/issues/18063), [#18013](https://github.com/unslothai/unsloth/issues/18013) (with fix PR [#18051](https://github.com/unslothai/unsloth/pull/18051)).
4. **🟠 Medium — Desktop crash after llama.cpp update**: [Issue #17981](https://github.com/unslothai/unsloth/issues/17981).
5. **🟠 Medium — AMD image generation black screen**: [Issue #17985](https://github.com/unslothai/unsloth/issues/17985).
6. **🟡 Low — Ollama scanner omits new models** with OCI manifest-reference layer: [Issue #18058](https://github.com/unslothai/unsloth/issues/18058).
7. **🟡 Low — Cohere Command R+ shape error** in fast attention/decode (q_norm/k_norm applied post-transpose). PR: [#17940](https://github.com/unslothai/unsloth/pull/17940).
8. **🟡 Low — Model-size/parameter display missing** in new composer picker. PR: [#18067](https://github.com/unslothai/unsloth/pull/18067).
9. **🟡 Low — Docs/telemetry**: graceful backend stop logged as crash ([#18057](https://github.com/unslothai/unsloth/issues/18057)); `

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*