# AI Infrastructure Digest 2026-10-28

> Generated: 2026-10-28 00:25 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Date: 2026-10-28 | Projects: vLLM, SGLang, llama.cpp, Ollama, LiteLLM, Unsloth**

---

## 1. Ecosystem Overview

The ecosystem is in a **frontier-model enablement race** rather than a serving-logic race: every engine's backlog is dominated by hardware-specific gaps (Ampere for DeepSeek-V4-Flash, SM120 graph capture, gfx950 for MiniMax-M3.1-Flash) rather than by new abstractions. A clear **AMD/ROCm convergence** is underway — vLLM, SGLang, llama.cpp, and Unsloth all landed AMD/AITER/XPU work today, but each is exposing accuracy regressions that only appear at high concurrency. Simultaneously, **agent correctness is emerging as a distinct failure class**: tool-call parsing, streaming semantics, and silent schema drops now occupy the highest-severity slots across llama.cpp, Ollama, SGLang, and LiteLLM. Non-engine layers (LiteLLM, Unsloth) are shipping **breaking-but-security-adjacent changes** today (MCP hidden-tool bypass, user-directory scoping, key expiration semantics) that shape the trust boundary more than any kernel PR.

---

## 2. Activity Comparison

| Project | Layer | Active Issues (today) | Active PRs (today) | Release status (last 24h) |
|---|---|---|---|---|
| **vLLM** | Server engine | ~13 ranked (2 closed RFCs incl. accuracy collapse) | ~8 perf PRs + model enablements | **No release**; Q4 roadmap is canonical artifact |
| **SGLang** | Server engine | ~10 ranked (1 P0 spec-decode crash) | ~10 (5-PR AMD gfx950 series) | **No release**; baseline v0.5.22 referenced |
| **llama.cpp** | Local runtime | ~9 ranked (#25618 quant spec-decode divergence) | ~5 perf + new-op PRs | **4 releases** (b11927 → b11938) |
| **Ollama** | Local runtime | ~10 ranked (#17778 tool-loop 500s, 32 👍) | ~7 (2 major MLX PRs) | **No release**; 0.40.4 as affected base |
| **LiteLLM** | Gateway | ~12 ranked (2 HIGH security) | ~10 (guardrail cluster + backports) | **4 releases** (v1.106.5 / 1.105.6 / 1.104.8 / 1.103.10) |
| **Unsloth** | Training/fine-tune | ~10 ranked (CI breakage, Anthropic passthrough) | ~10 (Studio + Benchmarks + perf) | **No release**; stabilization push |

**Reading:** Server engines (vLLM, SGLang) traded release cadence for kernel breadth. Local runtimes diverged — llama.cpp ships fast, Ollama stabilizes. The gateway (LiteLLM) and training layer (Unsloth) are absorbing correctness/compatibility debt into their own CI.

---

## 3. Model Support Race

**Leaders by footprint today:**

- **llama.cpp — broadest surface, fastest shipping.** LFM3 family fully landed (base, VL, video, `/v1/realtime` voice, d1 decision heads), plus MiniCPM-OCR-Jev, GigaChat 3.5 432B-A28B (in review), `d2t` draft vocab for Qwen3.5-MoE MTP. Ships as 12 tagged builds in 24h.
- **SGLang — deepest single-model investment.** Five coordinated PRs on **MiniMax-M3.1-Flash** for MI350X/MI355X (sparse attention, NVFP4 KV, DSpark verify, MoE/router GEMV, block-FP8 GEMM, decode indexer CP). Follows the same playbook it used for DeepSeek-V4.1.
- **vLLM — frontier enablement via long-tail trackers.** DeepSeek-V4-Flash on Ampere (#50576, 121 comments), DeepSeek-V4.1-Flash MXFP8/SM120, GLM-5.3, Qwen3.8, Nemotron-H MoE block configs, Gemma 4 on RDNA. Coverage is *planned* across many models; landing is per-body-of-work.
- **Ollama — narrow, MLX-weighted.** Nemotron 3.5 Bolt 74B-A9B with LiLiCorr spec decode (#19229) and Kolibri 1 (#18780) both open; LFM3 GGUF loading just fixed (#19344) after the "unknown architecture 'lfm3'" break.
- **LiteLLM — API-surface expansion, not kernels.** xAI X Search (native with citations + billing), Morph open models, Bedrock Mantle-native Claude token counting. Cloudflare Workers AI proposals are ~10 months stale.
- **Unsloth — demand-driven backlog.** LFM3-1.7B, Intel Arc B580 XPU, exllamav3, AMD iGPU VRAM fix (#14039) — all in request/queue stage, none shipped.

**Winner:** llama.cpp on breadth-per-hour; SGLang on depth for a single frontier model on AMD.

---

## 4. Performance Frontier

| Vector | Current hot spots |
|---|---|
| **KV cache & offloading** | vLLM dominates: P2P fault semantics (#63602), GDS filesystem offload (#48504), Mooncake descriptor overhead (#63006), reusable compression RFC (#59538). SGLang: HiCache prefill fastpath re-enabled (#46884), PD+HiCache stale-KV fix (#44070). |
| **MoE routing / EP** | vLLM `MoETPCollectiveOptimizationPass` (#63479), Triton naive-block-assignment regression (#63943); SGLang `--max-payload` + LoRA-PP csgmv grid bounding (#46743); llama.cpp `--moe-cache-cpu-share` CPU spill (#30966). |
| **Speculative decoding** | vLLM structured-output distribution preservation (#62818, closed); llama.cpp quant-target divergence (#25618, open, correctness); SGLang FlashInfer verify-sampling JIT crash (#43412, open); Ollama LiLiCorr in Nemotron PR (#19229). |
| **Kernels / fused ops** | SGLang DeepSeek-V4.1 mHC+combine+RMSNorm fusion (#46088), AITER GDN prefill (#39873); llama.cpp Metal fused TOP_K_MASK (b11927), Hexagon TOP_K (~42% of DFlash draft time); vLLM AITER fused AR+RMSNorm+quant (#56326). |
| **Quantization** | llama.cpp OCP FP8 E4M3 saturating in ggml (#27512); vLLM FlashInfer FP8 block-scale GEMM fix (#64040); SGLang NVFP4 KV + block-FP8 GEMM for MiniMax-M3.1. |
| **Distributed serving** | vLLM TP MoE collective optimization; SGLang LoRA under PP (memory + throughput); llama.cpp `--models-memory-max` router eviction (b11930); Ollama concurrent MLX generation (#19197). |
| **Sampling & determinism** | vLLM `--routing zipf` for MoE bench (#64167), nondeterministic greedy (#58899); llama.cpp fused TOP_K for spec-decode draft batches; SGLang top-k/top-p consistency fix (#41916). |

**The unsatisfiable tension today:** every engine is fusing more kernels for throughput, but at least three projects (vLLM, SGLang, llama.cpp) have *open correctness bugs on fused/reordered paths* — determinism, distribution drift, silent divergence. Speed is no longer the only axis.

---

## 5. Layer Positioning

```
┌──────────────────────────────────────────────────────────────────┐
│ APPLICATION / AGENT LAYER                                        │
│   tool-calling loops · MCP · streaming parsers · spec decode     │
└────────────┬─────────────────────────────────────────────────────┘
             │
┌────────────▼─────────────────────────────────────────────────────┐
│ GATEWAY — LiteLLM                                                │
│   multi-provider routing · guardrails · budgets · key mgmt       │
│   exposing MCP hidden-tool bypass + secret-redaction surface     │
└────────────┬─────────────────────────────────────────────────────┘
             │
┌────────────▼─────────────────────────────────────────────────────┐
│ SERVER ENGINES — vLLM  |  SGLang                                 │
│   PD disaggregation · KV offload tiers · distributed serving     │
│   frontier-model enablement on A100/H100/H200/MI355X/SM120       │
└────────────┬─────────────────────────────────────────────────────┘
             │
┌────────────▼─────────────────────────────────────────────────────┐
│ LOCAL RUNTIMES — llama.cpp  |  Ollama                            │
│   GGUF/MLX quant · CPU/GPU/Metal/Vulkan/SYCL · on-device agents  │
│   router-mode multi-model · /v1/realtime voice · LFM3 stack      │
└────────────┬─────────────────────────────────────────────────────┘
             │
┌────────────▼─────────────────────────────────────────────────────┐
│ TRAINING / FINE-TUNING — Unsloth                                 │
│   LoRA SFT · DPO (online) · Studio UI · MLX/GGUF export          │
│   bridged to serving via llama.cpp/vLLM backends                 │
└──────────────────────────────────────────────────────────────────┘
```

Layer differentiation is *sharpening*: vLLM and SGLang are converging on the same set of primitives (PD disaggregation, KV tiering, EP/TP MoE collective optimization), while llama.cpp and Ollama are converging on **on-device multimodal agents** (LFM3 VL/Audio/Omni, `/v1/realtime` voice, mini decision heads). LiteLLM and Unsloth are sandwiching the engines: one owning policy, one owning production of weights.

---

## 6. Trend Signals

**1. Agent correctness is the new P0.**
Highest-severity items in llama.cpp (#25618 quant spec-decode divergence), Ollama (#17778 tool loop 500s, #17892 thinking loop, #19187 silent schema drop), SGLang (#35564 streaming tool-call parsers, closed as inactive), and LiteLLM (#48171 MCP hidden-tool bypass) are all *agent loop* failures, not throughput failures. **Watch:** your eval suite must exercise streaming, multi-turn, and spec-decode paths end-to-end — buffered smoke tests pass through every one of these bugs.

**2. AMD is production-viable but env-var-fragile.**
vLLM #60160 (**AITER accuracy collapse**, concurrency-dependent), SGLang gfx950 illegal memory access (#48043) and SM121 QSA gap (#36558), llama.cpp ROCm split-mode garbage (#16424). **Watch:** pin `VLLM_ROCM_USE_AITER`, add concurrency-swept accuracy sweeps, and gate upgrades behind gfx-target-specific tests.

**3. Quantization × architecture interactions are silent killers.**
llama.cpp IQ3_S on RTX 5060 Ti (#28581), Ollama q2_K/q3_K of qwen2.5-coder:3b (#18252, 0/15 on functional suite), SGLang Kimi-K3 SM90 silently computes SwiGLU instead of SiTU (#45755). **Watch:** pin quants by hash and run a small functional eval on every quant level, not perplexity alone.

**4. Gateway security boundary is being redrawn.**
LiteLLM's MCP hidden-tool bypass (#48171, now fixed on `tools/call` *and* pre-upstream), and the in-flight secret-redaction expansion to tool inputs, outputs, args, and system prompts (#47122) mean the same agents that were safe yesterday can leak or invoke unexpectedly today. **Watch:** diff guardrail coverage when you upgrade LiteLLM; verify `x-litellm-applied-guardrails` isn't over-reporting (#48472).

**5. KV offloading is becoming a multi-tier connector, not a feature.**
vLLM's P2P + GDS + Mooncake + compression RFC stack is the blueprint: heterogeneous KV backends behind one abstraction. SGLang's HiCache is on the same trajectory (read-done fastpath, stale-KV fix). **Watch:** plan for a connector interface now; single-backend designs will be re-written next quarter.

**6. Determinism is not a product guarantee — yet.**
vLLM #58899 (greedy nondeterminism between restarts), llama.cpp #25618 (spec-decode output differs from non-spec), SGLang top-k/top-p cross-path inconsistency (#41916). **Watch:** for audit-grade or regulated agent flows, disable timing-tuned reduction kernels and spec decode, or add a hash-based drift check to CI.

**7. Release hygiene is bifurcating:**
- **Hot release lines** (llama.cpp: b11927 → b11938 in 24h; LiteLLM: four stable-lines-today) demand rolling pins and fast rollback.
- **Frozen release lines** (vLLM, SGLang Q4 roadmaps; Ollama's 0.40.4 known-broken on `/v1/systemone`; Windows CUDA prebuilt stuck at b11828) mean **"latest tag" ≠ "latest fix."** Ask for the PR, not the version.
- **CI itself is a risk surface:** Unsloth torch-config drift breaks 55–70 errors per PR; llama.cpp BYOG evals RFC (#61698) and vLLM's Zipf MoE bench (#64167) are attempts to make perf claims reproducible — but coverage is uneven across projects.

**What to do next quarter:**
1. Add **streaming + spec-decode + multi-turn** cases to your eval gate — they're where the current silent faults live.
2. Pin every **quant, ROCm AITER env var, and guardrail config** by artifact hash, not by version string.
3. Assume **one KV backend won't be enough**: design an offloading connector.
4. Treat **LiteLLM guardrail updates as security upgrades** — read the PR diff before deploying.
5. If you're integrating agents through **MCP or browser tools**, Unsloth #14348 (per-tool switches) and current SGLang/Ollama tool-parser bugs are the config surface you'll need to test against.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-10-28

## 1. Today's Highlights

No releases landed in the last 24h, but the queue is dominated by frontier-model enablement: DeepSeek-V4-Flash on Ampere (SM8x), DeepSeek-V4.1-Flash CUDA-graph capture on SM120 Blackwell, and GLM-5.3 / Qwen3.8 optimization trackers. On the infra side, the Q4 2026 roadmap ([#61024](https://github.com/vllm-project/vllm/issues/61024)) is now the canonical planning artifact, and KV offloading/compression continues to attract the most design debate. Notably, two accuracy-sensitive RFCs closed today: structured-output + speculative decoding distribution preservation ([#62818](https://github.com/vllm-project/vllm/issues/62818)) and the ROCm AITER accuracy regression ([#60160](https://github.com/vllm-project/vllm/issues/60160)).

## 2. Releases & Breaking Changes

None in the last 24h. No API or config changes were announced. The Q4 2026 roadmap ([#61024](https://github.com/vllm-project/vllm/issues/61024)) is worth tracking as the source of upcoming compatibility work across SIGs.

## 3. New Model & Hardware Support

- **DeepSeek-V4-Flash on SM8x (Ampere A100/A800, RTX 30xx)** — feature request with heavy community traction (121 comments, 16 👍). Neither the original nor the 0731 checkpoint runs on Ampere today; tracked at [#50576](https://github.com/vllm-project/vllm/issues/50576).
- **Qwen3-ASR checkpoints on the Rust frontend** — startup failure due to missing `tokenizer.json` and nested `vocab_size`; blocks serving the official ASR checkpoints via `VLLM_USE_RUST_FRONTEND=1` ([#61057](https://github.com/vllm-project/vllm/issues/61057)).
- **Muse Spark AMD MonoKernel on MI350P** — decode path is hard-wired to MI355X's 256 CUs and refuses to run on the 128-CU MI350P despite the same `gfx950` ISA ([#63712](https://github.com/vllm-project/vllm/issues/63712)).
- **Nemotron-H heterogeneous MoE** — PR adds per-layer `block_configs` fallback so "puzzle" variants (e.g. Nemotron 3.5 Bolt 74B-A9B, 12 distinct MoE configs) load correctly ([#62362](https://github.com/vllm-project/vllm/pull/62362)).
- **FlashInfer attention sinks with fp8/NVFP4 KV cache** — prefill path unblocked; NVFP4 served via fa2 paged prefill with epilogue sink rescale (SM12x-only for the NVFP4 case) ([#63826](https://github.com/vllm-project/vllm/pull/63826)).
- **Gemma 4 on RDNA** — `ROCM_SEGMENTED_ATTN` extended to D=512 for Gemma 4's mixed D=256/D=512 attention on Radeon AI PRO R9700 ([#62666](https://github.com/vllm-project/vllm/pull/62666)).

## 4. Performance & Optimization

- **DeepSeek-V4.1-Flash MXFP8 decode** — pinning low-latency GEMM tactics for TP8 without autotuning, stacked on #64146/#64144 ([#64147](https://github.com/vllm-project/vllm/pull/64147)).
- **TP MoE collective optimization** — new `torch.compile` pass (`MoETPCollectiveOptimizationPass`) sharding output projections to reduce all-reduce/all-gather traffic; also modifies a Triton TP-sharding kernel ([#63479](https://github.com/vllm-project/vllm/pull/63479)).
- **Triton MoE naive block assignment regression** — on GB10, `_prepare_expert_assignment` re-reads shared experts for device-resident weights, costing 8% to 2× decode slowdown when `num_tokens * top_k * 4 <= num_experts` ([#63943](https://github.com/vllm-project/vllm/issues/63943)).
- **ROCm MI355X trackers** — Qwen3.8-2.4T-A95B ([#57149](https://github.com/vllm-project/vllm/issues/57149), 26 comments) and Qwen3.8-Flash-Next ([#59575](https://github.com/vllm-project/vllm/issues/59575)) remain the largest active perf plans; both land as stacked PRs on main.
- **ROCm DSA indexer** — PR allows native decode above `next_n=2` via `VLLM_ROCM_INDEXER_NATIVE_DECODE_MAX_NEXT_N`, avoiding row-flattening re-reads for MTP with 2+ draft tokens ([#59421](https://github.com/vllm-project/vllm/pull/59421)); a separate PR routes paged MQA logits through AITER's `paged_mqa_logits` so kernel selection lives in AITER ([#60042](https://github.com/vllm-project/vllm/pull/60042)).
- **DeepSeek R1 on AMD** — fused AR + RMSNorm + per-token quant (all KLL-bound), mirroring ATOM ([#56326](https://github.com/vllm-project/vllm/pull/56326)).
- **GLM-5.3** — optimization follow-up on the shared `glm_moe_dsa` architecture; CUDA work planned ([#57406](https://github.com/vllm-project/vllm/issues/57406)).
- **Dynamic PDL enablement** — feature request to auto-enable `TRTLLM_ENABLE_PDL` / `TORCHINDUCTOR_ENABLE_PDL` rather than requiring undocumented flags ([#40543](https://github.com/vllm-project/vllm/issues/40543)).
- **Benchmarking** — `vllm bench forward` gains `--routing zipf` (α=1.25) for skewed synthetic MoE routing with dummy weights; `auto` picks Zipf for dummy weights and real routing otherwise ([#64167](https://github.com/vllm-project/vllm/pull/64167)).

## 5. Stability & Regressions

Ranked by severity:

1. **ROCm AITER accuracy collapse** — Qwen3.8-27B-FP8 (TP4, MI355X) at high concurrency with `VLLM_ROCM_USE_AITER=1`; fine with AITER off. **Closed** ([#60160](https://github.com/vllm-project/vllm/issues/60160)).
2. **Structured-output + spec-decode distribution drift** — `StructuredOutputManager` trimming draft tokens without committing grammar state can skew output distribution; RFC **closed** ([#62818](https://github.com/vllm-project/vllm/issues/62818)).
3. **SM120 CUDA graph capture unusable for DeepSeek-V4.1-Flash** — 8×TP on RTX PRO 6000 Blackwell gives extremely low decode throughput with `--enforce-eager`; graphs unusable. Requesting priority on SM120 graph capture ([#56892](https://github.com/vllm-project/vllm/issues/56892)).
4. **P2P KV offload tier doesn't fail fast on peer faults** — H200 + NIXL 1.5.0 + `OffloadingConnector` reproducer; missing fast-fail semantics on peer failure ([#63602](https://github.com/vllm-project/vllm/issues/63602)).
5. **Greedy output nondeterminism** — q/k-norm + RoPE combo kernel picks reduction config by timing, so greedy output changes between restarts even with `VLLM_BATCH_INVARIANT=1` ([#58899](https://github.com/vllm-project/vllm/issues/58899)).
6. **Rust frontend 500s on auto tool parser resolution failure** — every request returns 500 when `auto` can't resolve a parser for the model ([#63584](https://github.com/vllm-project/vllm/issues/63584)); a separate Rust completions `echo` + `return_token_ids` fix is open ([#62684](https://github.com/vllm-project/vllm/pull/62684)).
7. **Gemma Qwen4Exp PLE n-gram padding under piecewise CUDA graphs** — ROCm replays read stale `query_start_loc`/`ngram_context` rows; fix PR open ([#62675](https://github.com/vllm-project/vllm/pull/62675)).
8. **SM90 FlashInfer FP8 block-scale GEMM wrong results** — kernel binding assumes row-contiguous activations; fix passes packed rows ([#64040](https://github.com/vllm-project/vllm/pull/64040)).
9. **FlashInfer one-sided workspace leak** — EPLB communicator teardown didn't release all-to-all resources; fix PR open ([#63874](https://github.com/vllm-project/vllm/pull/63874)).
10. **CPU offload `num_cpu_blocks` inconsistency across PP ranks** — 4×B300, PP4 reproducer; upstream fix proposed ([#50821](https://github.com/vllm-project/vllm/issues/50821)).
11. **DeepSeek-V4.1-Flash tool calls strip Persian half-spaces (U+200C)** — tokenizer/tool-parser interaction, breaking Persian output ([#63794](https://github.com/vllm-project/vllm/issues/63794)).
12. **ROCm Triton paged attention illegal memory access on gfx950** — `hipErrorLaunchFailure` under long-context decode on MI350X ([#48043](https://github.com/vllm-project/vllm/issues/48043)).
13. **Qwen3.6-27B spurious "System message must be at the beginning"** ([#41114](https://github.com/vllm-project/vllm/issues/41114)).

## 6. What This Means for Application Developers

- **Frontier-model coverage is the bottleneck, not serving logic.** DeepSeek-V4-Flash on Ampere and DeepSeek-V4.1-Flash on SM120 are both blocked by hardware-specific gaps. If you're choosing accelerators today, verify graph-capture support for your target model/GPU pair before committing.
- **ROCm is production-viable but kernel-version-sensitive.** The AITER accuracy collapse ([#60160](https://github.com/vllm-project/vllm/issues/60160)) shows that a single env var can flip accuracy at high concurrency. Pin your `VLLM_ROCM_USE_AITER` setting and add a concurrency-swept accuracy check to CI.
- **Determinism is not yet a guarantee.** Greedy decoding can vary across restarts ([#58899](https://github.com/vllm-project/vllm/issues/58899)). If your agent depends on reproducible outputs, avoid `torch.compile`-tuned reduction kernels or pin the reduction config.
- **The Rust frontend is close but not drop-in.** Auto tool-parser resolution and tokenizer edge cases ([#63584](https://github.com/vllm-project/vllm/issues/63584), [#61057](https://github.com/vllm-project/vllm/issues/61057)) mean Python remains the safer default for tool-calling workloads.
- **KV offloading is becoming a multi-tier design surface.** P2P tier fault semantics ([#63602](https://github.com/vllm-project/vllm/issues/63602)), GDS for filesystem offload ([#48504](https://github.com/vllm-project/vllm/issues/48504)), Mooncake descriptor overhead ([#63006](https://github.com/vllm-project/vllm/issues/63006)), and a reusable KV compression layer RFC ([#59538](https://github.com/vllm-project/vllm/issues/59538)) all landed in the last weeks. Plan for a connector abstraction rather than a single offload backend.
- **Benchmarking for MoE routing is improving.** Zipf routing in `vllm bench forward` ([#64167](https://github.com/vllm-project/vllm/pull/64167)) plus the BYOG evals RFC ([#61698](https://github.com/vllm-project/vllm/issues/61698)) should make PR-level perf claims easier to reproduce on your own hardware.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-10-28

## 1. Today's Highlights
No releases shipped in the last 24h, but activity is dominated by two themes: an aggressive AMD/gfx950 enablement push for **MiniMax-M3.1-Flash** (PRs [#46690](https://github.com/sgl-project/sglang/pull/46690), [#46691](https://github.com/sgl-project/sglang/pull/46691), [#46692](https://github.com/sgl-project/sglang/pull/46692), [#46693](https://github.com/sgl-project/sglang/pull/46693), [#46694](https://github.com/sgl-project/sglang/pull/46694)) and continued DeepSeek-V4.1 decode kernel fusion work ([#46088](https://github.com/sgl-project/sglang/pull/46088)). The Q4 roadmaps for **PD Disaggregation** ([#43699](https://github.com/sgl-project/sglang/issues/43699)) and **SGLang-Diffusion** ([#43313](https://github.com/sgl-project/sglang/issues/43313)) are actively being refined, signaling the strategic priorities for the next quarter. Meanwhile, the flaky-CI tracker ([#42752](https://github.com/sgl-project/sglang/issues/42752)) continues to accumulate 134+ comments, indicating ongoing friction in PR velocity.

## 2. Releases & Breaking Changes
None in the last 24h. Note however that several closed bugs reference version **v0.5.22** and `main` at `ce66b3ab` as affected baselines (e.g., [#45755](https://github.com/sgl-project/sglang/issues/45755)), so if you're tracking a specific bug fix, confirm the commit is in your pin.

Two minor API additions are in-flight:
- `--max-payload-size` server flag for HTTP bodies (fixes Uvicorn/Granian default limits for base64 multimodal payloads) — [PR #46482](https://github.com/sgl-project/sglang/pull/46482)
- Consistency fix for top-k/top-p sampling across sampling paths (supersedes earlier attempt) — [PR #41916](https://github.com/sgl-project/sglang/pull/41916)

## 3. New Model & Hardware Support
- **MiniMax-M3.1-Flash on AMD MI350X/MI355X (gfx950)**: Full bring-up of sparse attention, NVFP4 KV cache, DSpark verify kernels, MoE/router GEMV, block-FP8 GEMM, and decode indexer CP. This is a multi-PR series on `main` with callers landing in [#46693](https://github.com/sgl-project/sglang/pull/46693). ([#46690](https://github.com/sgl-project/sglang/pull/46690), [#46691](https://github.com/sgl-project/sglang/pull/46691), [#46692](https://github.com/sgl-project/sglang/pull/46692), [#46693](https://github.com/sgl-project/sglang/pull/46693), [#46694](https://github.com/sgl-project/sglang/pull/46694))
- **Muse Spark Open on MI35x**: New nightly accuracy gate (GSM8K + MMMU) covering both FP4 cookbook cells. ([#44586](https://github.com/sgl-project/sglang/pull/44586))
- **XPU simple enablements consolidated** into a single reviewable PR as part of the weekly XPU model-enablement lifecycle. ([#46623](https://github.com/sgl-project/sglang/pull/46623))
- **AMD monokernels**: New daily pin-bump automation for `sgl-amd-mono`, needed for GLM-5.3 FP8 E4M3 KV cache monokernel. ([#46685](https://github.com/sgl-project/sglang/pull/46685))

Closed/inactive hardware gaps worth noting (no active fix landed):
- **QSA decode has no working kernel on SM121 (GB10 / DGX Spark)** — Qwen3.8-Flash-Next is unservable on that arch. ([#36558](https://github.com/sgl-project/sglang/issues/36558))
- **Apple Silicon serving redesign** still in RFC: Torch-owned SRT path with whole-model MLX region export. ([#32321](https://github.com/sgl-project/sglang/issues/32321))

## 4. Performance & Optimization
- **DeepSeek-V4.1 decode**: fuse mHC post + four-stream combine + RMSNorm into a single kernel, removing back-to-back small kernel launches at every layer boundary in decode and target-verify. ([#46088](https://github.com/sgl-project/sglang/pull/46088))
- **LoRA under pipeline parallelism**: throughput and GPU memory improvements for multi-LoRA serving with PP; also bound csgmv CUDA-graph segment grids by token count (was sized to the max captured batch, wasting launch slots). ([#45951](https://github.com/sgl-project/sglang/pull/45951), [#46743](https://github.com/sgl-project/sglang/pull/46743))
- **HiCache prefill read-done fastpath** re-enabled when offload copies are fenced on the forward stream — avoids falling back to `wait_stream(forward_stream)` and lets the schedule stream run ahead. ([#46884](https://github.com/sgl-project/sglang/pull/46884))
- **Decode transfer queue**: stop device admission at the first refusal rather than probing every later host-staged request near a full KV pool. ([#46898](https://github.com/sgl-project/sglang/pull/46898))
- **Qwen3-Next GDN prefill**: consume the AITER fused kernel to eliminate a 4-kernel chain and intermediate tensor round-trips. ([#39873](https://github.com/sgl-project/sglang/pull/39873))
- **GLM-5.3-Flash on Hopper (SM90)** optimization tracking issue opened. ([#45373](https://github.com/sgl-project/sglang/issues/45373))

## 5. Stability & Regressions
Ranked by severity:

1. **Speculative decoding crashes server on first non-greedy request** — FlashInfer verify-sampling JIT fails on pip-installed bundles without system CUDA toolkit (bundled cccl vs pip cu13 mismatch), and the process tree is SIGKILLed. Greedy traffic is unaffected, so this can hide in staging. **Open, no fix PR yet.** ([#43412](https://github.com/sgl-project/sglang/issues/43412))
2. **EP2 (tp=2 + ep=2) illegal memory access on Qwen3.8-Flash-Next NVFP4 (RTX PRO 6000, sm_120)** — reproduced on two builds. **Open.** ([#44291](https://github.com/sgl-project/sglang/issues/44291))
3. **Kimi-K3 on SM90: `flashinfer_mxfp4` silently computes GPT-OSS SwiGLU instead of SiTU** — silent numerical divergence in the MoE activation; the referenced upstream fix (flashinfer#4209) is still open. **Open.** ([#45755](https://github.com/sgl-project/sglang/issues/45755))
4. **PD prefill + HiCache: stale KV on decode** — early cached-prefix send can transfer KV before the HiCache load-back finishes when a prefix lives only in host memory. Now **closed**, check the fix is in your pin. ([#44070](https://github.com/sgl-project/sglang/issues/44070))
5. **FlashInfer autotune cache discarded every boot under MoE EP>1** — per-rank shapes never agree, so the fused-MoE tactic is re-drawn each start (adds startup latency). **Open.** ([#40320](https://github.com/sgl-project/sglang/issues/40320))
6. **Non-causal sliding-window attention ignored in `TorchNativeAttnBackend`** — correctness bug on a fallback path. **Open.** ([#39300](https://github.com/sgl-project/sglang/issues/39300))
7. **8 tool-call parsers emit wrong/missing calls under token-by-token streaming** — directly hits agent reliability; **closed as inactive** without an obvious fix reference. ([#35564](https://github.com/sgl-project/sglang/issues/35564))
8. **Dynamic LoRA loading unsupported with `--tokenizer-worker-num > 1`** — per-worker registry, no cross-worker sync. **Closed/inactive.** ([#31084](https://github.com/sgl-project/sglang/issues/31084))
9. **BF16 RL weight update with `moe_runner_backend=flashinfer_trtllm` crashes** — blocked/padded w13 layout not restored on `update_weights_from_tensor`. **Closed/inactive.** ([#27787](https://github.com/sgl-project/sglang/issues/27787))
10. **FP8 DeepSeek-V4-Flash on MI300X (gfx942) degrades with context** — coherent <100 tokens, garbage by ~300, NIAH 0/3. **Closed/inactive.** ([#36390](https://github.com/sgl-project/sglang/issues/36390))

Also notable: `deepseek_nextn` hardcodes `quant_config=None` for `modelopt_fp4`, breaking quantized NextN drafts (GLM-5.3-Flash NVFP4 spec decoding) — [closed, #36599](https://github.com/sgl-project/sglang/issues/36599); and `ModelOptFp4Config.is_layer_excluded` misses fused and `model.`-prefixed names, crashing mixed-precision NVFP4 loads — [closed, #36596](https://github.com/sgl-project/sglang/issues/36596).

## 6. What This Means for Application Developers
- **If you're on AMD MI35x and running MiniMax-M3.1-Flash**, the gfx950 kernel series is converging on `main` in review order; pin to `main` only after [#46693](https://github.com/sgl-project/sglang/pull/46693) (the callers PR) — the earlier kernel PRs are inert alone.
- **If you enable speculative decoding on a pip-installed environment without a system CUDA toolkit**, you're exposed to [#43412](https://github.com/sgl-project/sglang/issues/43412). Greedy-only smoke tests will not catch it. Validate with at least one sampled request in your deploy gate.
- **Multimodal or agent apps sending large JSON bodies** should watch [#46482](https://github.com/sgl-project/sglang/pull/46482) for the `--max-payload-size` flag; until then, put a reverse proxy in front or chunk base64 payloads.
- **Agent builders relying on streaming tool calls**: [#35564](https://github.com/sgl-project/sglang/issues/35564) documents multiple parsers producing wrong token-by-token output. If you're on an affected parser, test with `stream=True` end-to-end, not just buffered mode.
- **LoRA-heavy multi-tenant serving with PP** gets meaningful memory and throughput wins from [#45951](https://github.com/sgl-project/sglang/pull/45951) once merged.
- **HiCache + PD disaggregation operators**: the stale-KV fix in [#44070](https://github.com/sgl-project/sglang/issues/44070) is closed, but verify your pin — the bug is silent (correct-looking output with wrong KV), which is the worst class for production debugging.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-10-28

## 1. Today's Highlights

The LiquidAI LFM3 family lands in force: core support for `LFM3-1.7B` / `LFM3-VL-2B` (b11938), video input plumbing for the same family (#31283), a `/v1/realtime` voice-chat path (#31269), and decision-model variants `d1-2B` / `d1-omni-2B` (#31275). The server gains a much-requested operational lever: `--models-memory-max` for dynamic model unloading in router mode (b11930). Meanwhile a new class of quantized-target speculative-decoding divergence bug is drawing sustained attention (#25618), and Metal gains the fused `TOP_K_MASK` op (b11927).

---

## 2. Releases & Breaking Changes

Rapid release cadence continues (b11927 through b11938 in ~24h). Notable items:

- **b11929 — `common`: `--model` or `-hf` is now required.** CLI invocations that previously fell through to an implicit default will now error out. Scripts and CI wrappers should pass an explicit model path or Hugging Face repo. https://github.com/ggml-org/llama.cpp/releases
- **b11930 — new `--models-memory-max` server flag** (router mode): enables dynamic unloading of models when the combined resident footprint (including a to-be-loaded model) exceeds a byte threshold. This is opt-in; existing behavior is unchanged if unset. https://github.com/ggml-org/llama.cpp/pull/21231
- **Windows CUDA prebuilt binaries appear frozen at b11828** while tags advance past b11852 — an ongoing packaging discrepancy, not an upstream code issue. Track #31085. https://github.com/ggml-org/llama.cpp/issues/31085
- No API breaking changes to `libllama` or the HTTP server surface in this window (the reasoning-effort capability probe in #31271 is additive).

---

## 3. New Model & Hardware Support

| Item | Type | Link |
|---|---|---|
| `LiquidAI/LFM3-1.7B` + `LFM3-VL-2B` core support | New models | b11938 / #31252 |
| LFM3 video input (incl. video + soundtrack) | mtmd / convert | #31283 |
| `LiquidAI/d1-2B` + `d1-omni-2B` decision models (CLOSED/merged) | New models | #31275 |
| `MiniCPM-OCR-Jev` — Qwen3.5-VL trunk + value head, scoring not generation | New arch | b11928 / #30980 |
| `/v1/realtime` voice chat + interleaved transcription (LFM3-Audio-2B, LFM3-Omni-2B) | Server feature | #31269 |
| OCP FP8 E4M3 (saturating) in ggml | Quantization format | #27512 |
| Qwen3.5/3.5-MoE `d2t` trimmed draft vocab for MTP spec decode | Model feature | #29143 |
| GigaChat 3.5 432B-A28B (MLA + DeepSeek MoE hybrid attn) | New model (open PR) | #25342 |
| Metal: `GGML_OP_TOP_K_MASK` (ported from CUDA) | Backend op | b11927 / #31230 |
| Hexagon: faster TOP_K backend sampler; transposed CONCAT DDR BW | Backend opt | #31279, #31277 |
| CPU LoRA fine-tuning for dense + hybrid models (assistant-only SFT masks) | Training | #31258 |

Note: `d1-2B`/`d1-omni-2B` (#31275) is closed — verify whether it merged or was superseded by the LFM3 work before relying on it.

---

## 4. Performance & Optimization

- **Server memory management (b11930, #21231):** `--models-memory-max` computes load-time memory requirements (via `no_alloc`) and evicts resident models when the next model would exceed the budget. Directly targets multi-model router deployments where the working set exceeds VRAM/RAM.
- **Sparse attention / KV selection (b11936, #31243):** k-pool sparse selection (Qwen4-EXP/QSA, GLM5-next) is now built independently of `kq_mask` shape — a necessary decoupling for index-based cache-cell selection at long context.
- **Metal TOP_K mask fused kernel (b11927):** single-pass `-inf` fill + kept-cell copy per row, replacing separate scorers. Reduces sampler overhead, especially relevant for speculative decoding draft batches.
- **Hexagon TOP_K (PR #31279):** reported as 42% of DFlash draft batch time and 25% of DSpark on X2 Elite with full-vocab (248k) TOP_K per draft row. New kernel avoids full per-tile sort.
- **ggml-vulkan MUL_MAT dim-3 broadcast (b11933, #31239):** unblocks mul_mm/mul_mmq/mul_mat_vec paths previously rejected by `supports_op`, fixing llvmpipe CI and enabling broader shader coverage.
- **MoE expert cache spill to CPU (PR #30966):** `--moe-cache-cpu-share` executes cache-missed experts on CPU; decode speed impact depends on host memory bandwidth.
- **Test infra (b11934, #31145):** model saving no longer instantiates a `llama_context`, and tensor generation drops `std::normal_distribution` for a faster sampler — shortens the test feedback loop.
- **OpenCL tiled q4_K lm_head GEMM (PR #30412):** batch > 1 path for vocab-scale q4_K weights on X2-90 / Adreno 830/840; previously GEMV-only layout.

---

## 5. Stability & Regressions

Ranked by severity and reproducibility:

1. **Quantized-target speculative decoding divergence (#25618, 32 comments, OPEN).** Under greedy sampling (`temp=0`, `top_k=1`), draft-model spec decode produces *different text* than non-speculative runs when the target is Q4_K_M-class; bf16 targets match. This is a correctness bug, not a perf issue — output is silently wrong. No fix PR referenced yet. https://github.com/ggml-org/llama.cpp/issues/25618
2. **CUDA graphs hang GPU channel on RTX 5090 Laptop / sm_120 (#27330, OPEN).** RC watchdog + Xid 8; `GGML_CUDA_DISABLE_GRAPHS=1` is a complete workaround. https://github.com/ggml-org/llama.cpp/issues/27330
3. **`-np 2 --kv-unified` prompt processing drop of 42–54%** from the second long request onward (#28495). Root cause identified: CUDA/HIP FA kernels skip only KQ-mask *tails*, not interior all-`-INF` blocks, so sequences pay for foreign KV cells. Known limitation, no fix landed. https://github.com/ggml-org/llama.cpp/issues/28495
4. **Vulkan device-lost class of bugs** — multiple open: Vega 8 iGPU at ~50K ctx (#26447), R9700 server crash with ctx-checkpoints (#27560), RX 6900 XT (#27076), Radeon 680M with `--load-mode auto` (#27360, mmap avoids it), Intel Gen9.5 UHD 630 q8_0 KV hang (#29054, `vk::Error` escapes as `std::terminate`). Vulkan remains the least stable backend for long-context and large-model workloads.
5. **SYCL issues:** DFlash2 draft triggers Windows TDR reset on dual Arc B70 (#28778); bad output on Qwen3.6-35B-A3B (#28728); OOB/VRAM overcommit kernel panic addressed by temporary guard PR #31285.
6. **CUDA IQ3_S produces garbage on RTX 5060 Ti / Blackwell (#28581)** — quantization × architecture interaction worth verifying before serving IQ3_S on sm_120.
7. **Security-adjacent:** `ggml_nbytes()` integer overflow permitting OOB read via malicious tensor in the RPC path — fix PR open (#31217). Relevant if you run `ggml-rpc-server` against untrusted peers.
8. **Vulkan `count_experts.comp` inefficiency (#31163):** `zero_skipped_rows()` loops over all expert IDs per thread — performance defect, not correctness.
9. **Fixed/closed:** ROCm split-mode garbage output (#16424), tensor-split memory leak on dual Intel B70 SYCL (#27845), Ling 3.0 autoparser tool-call terminator (#27462), ngram-cache per-slot cache leak across requests (#27852 — acceptance 86%→11%, worth reading if you enable ngram spec decode).

---

## 6. What This Means for Application Developers

- **Router-mode multi-model serving is now first-class.** If you multiplex several models behind one `llama-server`, adopt `--models-memory-max` (b11930) rather than hand-rolling eviction. Pair with `--models-memory-max` accounting that includes the incoming model's size — it does this for you.
- **Pass `--model`/`-hf` explicitly** after b11929. Audit launch scripts and Docker entrypoints.
- **Do not ship speculative decoding on quantized targets without an eval gate.** #25618 means your Q4_K_M + draft-model pipeline can silently emit different text than your non-spec baseline under greedy decoding. Either validate against a bf16 target in CI or run speculation off for correctness-critical paths.
- **LiquidAI LFM3 is now a viable local stack for multimodal + voice.** LFM3-VL (vision), LFM3-Audio/Omni (voice chat via `/v1/realtime`), and the d1 decision models cover perception-plus-routing in a 1.7–2B envelope. Attractive for on-device agents where a frontier VLM is overkill.
- **MiniCPM-OCR-Jev (#30980) is a scorer, not a generator** — it produces a scalar judgment, so wire it as a validation/ranking node in an agent graph rather than a text endpoint.
- **Blackwell/IQ3_S and Vulkan long-context remain risk areas.** For production on sm_120 use Q4_K_M/Q5_K_M and validate; for Vulkan prefer `--load-mode mmap` and keep ctx below the reported failure thresholds (heading toward 50K+ on iGPUs).
- **RPC exposure:** if you run `ggml-rpc-server` in a shared or untrusted network, track #31217 — the overflow is a memory-safety issue in the tensor-size check path.
- **Metal users get cheaper sampling** via the fused TOP_K mask (b11927) — measurable on Apple Silicon spec-decode and any wide-vocab sampler config.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-10-28

## 1. Today's Highlights

No new releases shipped in the last 24 hours, but the issue tracker is unusually active on **agent-loop and tool-calling correctness**: a Qwen3.8 `/api/chat` streaming failure (#17778, 32 👍), a DeepSeek-V4-Flash thinking-loop on Cloud (#17892), and silent dropping of out-of-schema function calls (#19187) all point to agent reliability as the current pain point. On the infrastructure side, two large MLX PRs land in-progress support for **Nemotron 3.5 Bolt 74B-A9B with speculative decoding** (#19229) and **concurrent MLX generation via `OLLAMA_NUM_PARALLEL`** (#19197), plus a first fix for LFM3 GGUF loading (#19344).

---

## 2. Releases & Breaking Changes

*No new releases in the last 24h.*

Two behavior changes worth tracking for anyone pinning versions:

- **[#19292](https://github.com/ollama/ollama/issues/19292) — `/v1/systemone` rejects decision-head GGUF models since 0.40.4.** Models declaring `CAPABILITY decision` without a `decision.type` key now return HTTP 400 (worked on 0.40.3). Affects custom decision/classifier heads.
- **[#19155](https://github.com/ollama/ollama/issues/19155) — Cloud `/v1/responses` returns 413 for ~10.7 MiB requests** well under the model context window. A related in-flight PR (#19309) adds a single compaction retry with a smaller serialized summary after a bare 413.

---

## 3. New Model & Hardware Support

- **[#19229 — mlx: Nemotron 3.5 Bolt 74B-A9B](https://github.com/ollama/ollama/pull/19229)** (open). Adds per-layer expert configs, LiLiCorr speculative decoding through the existing DFlash runner, prequantized affine 3-bit import with per-module metadata, and mixed-precision expert stacking.
- **[#18780 — mlx: Kolibri 1 support](https://github.com/ollama/ollama/pull/18780)** (open), authored by jmorganca.
- **[#19344 — LFM3 GGUF fixes + llama-server TTS](https://github.com/ollama/ollama/pull/19344)**. Honors explicit `tokenizer.ggml.add_bos_token=false` (fixes LFM3 and `lfm2:24b` template BOS stripping); text-to-speech path activates once llama.cpp advances past b11901. This is the fix for the "unknown model architecture: 'lfm3'" failure in [#19347](https://github.com/ollama/ollama/issues/19347) and the MLX-runtime complaint in [#19343](https://github.com/ollama/ollama/issues/19343).
- **[#19329 — AMD Radeon RX 6750 GRE 10GB (Navi 23) support request](https://github.com/ollama/ollama/issues/19329)**. Open, no PR.
- **[#19338 — discover: use newest library version supporting all GPUs](https://github.com/ollama/ollama/pull/19338)**. Fixes stale `anyMissing` state in `filterOverlapByLibrary` that caused the newest CUDA/library bundle to be permanently rejected after any partial GPU match failure. Relevant to mixed-GPU hosts.

---

## 4. Performance & Optimization

- **[#19197 — mlx: concurrent generation via `OLLAMA_NUM_PARALLEL`](https://github.com/ollama/ollama/pull/19197)** (open). Ready requests share projection and feed-forward work; attention remains per-request. Default stays at 1 — higher parallelism consumes proportional memory. Directly relevant to the OOM complaints in [#19262](https://github.com/ollama/ollama/issues/19262), where `OLLAMA_NUM_PARALLEL=1` did not visibly serialize two Goa sessions.
- **[#18978 — retry llama-server startup with eager CUDA module loading](https://github.com/ollama/ollama/pull/18978)** (open). Fixes `CUDA error: shared object initialization failed` in `fattn_mma` on partial-offload loads (RTX 5060 Ti + 16 GB host RAM). Addresses [#19122](https://github.com/ollama/ollama/issues/19122) and the Vulkan-adjacent slowness report in [#13567](https://github.com/ollama/ollama/issues/13567).
- **[#19326 — scheduler evicts by model path on keep_alive ties](https://github.com/ollama/ollama/issues/19326)** (open, no PR). `findRunnerToUnload` sorts by `sessionDuration` then model path; with uniform `keep_alive` the deciding key is lexicographic path, not recency or size. Predictable but surprising behavior for multi-model deployments.

---

## 5. Stability & Regressions

Ranked by severity:

1. **Qwen3.8 `/api/chat` 500s in tool loops** — [#17778](https://github.com/ollama/ollama/issues/17778), open, 32 👍, 56 comments, updated today. `ResponseError during chat streaming: no user query found in messages` at 205k context while the model iterates tool calls. Highest-signal bug in the tracker.
2. **DeepSeek-V4-Flash:0731 thinking loop on Cloud** — [#17892](https://github.com/ollama/ollama/issues/17892), open. Same reasoning paragraph emitted 221 times over ~1m45s, zero usable output, only 4 tool calls. No `` marker involved — not a template-marker issue.
3. **Silent drop of out-of-schema function calls** — [#19187](https://github.com/ollama/ollama/issues/19187), open. `qwen3:8b` calling a tool not in the request's `tools` yields an empty response with `eval_count > 0`. Fails closed without an error — dangerous for agent orchestration.
4. **macOS Metal crashes in MLX runner** — [#19278](https://github.com/ollama/ollama/issues/19278) (`kIOGPUCommandBufferCallbackErrorImpactingInteractivity`) and [#18885](https://github.com/ollama/ollama/issues/18885) (`panic: mlx` on M6/16 GB). Both open.
5. **Windows connection resets after ~15s on large prompts** — [#19139](https://github.com/ollama/ollama/issues/19139), open, needs more info. Ollama 0.40.4, RTX 3090, 24 GB.
6. **Broken q2_K/q3_K quantizations of qwen2.5-coder:3b-instruct** — [#18252](https://github.com/ollama/ollama/issues/18252), open. 0/15 on a functional smoke suite where sibling quants score 87–100%. Official library artifacts; worth pinning.
7. **Pull resume broken after >1h server restart** — [#19337](https://github.com/ollama/ollama/issues/19337). Fix PR [#19339](https://github.com/ollama/ollama/pull/19339) keeps interrupted downloads resumable across restarts.
8. **DNS64 / NAT64 pull failures** — [#19345](https://github.com/ollama/ollama/issues/19345), open. `hf.co` CDN resolves to `64:ff9b::/96`, rejected as non-public. Blocks all `ollama pull hf.co/...` on DNS64 networks.
9. **REPL state bugs** — [#19340](https://github.com/ollama/ollama/issues/19340) (Ctrl+C mid-multiline leaves REPL stuck in multiline mode) and [#19341](https://github.com/ollama/ollama/issues/19341) (`/load` resets messages but not `opts.System`). Both open, both from the same reporter, both low-blast-radius.
10. **OpenAI-compat: empty-content assistant messages lose tool_calls** — [#19151](https://github.com/ollama/ollama/issues/19151), **closed**. Relevant if you replay history with `"content": []`.

Also closed today: [#19303](https://github.com/ollama/ollama/issues/19303) (`ollama launch opencode` fails on OpenCode v2 due to array-typed `debug config`), [#19155](https://github.com/ollama/ollama/issues/19155) (Cloud 413).

---

## 6. What This Means for Application Developers

- **Treat tool-call loops as a first-class failure mode.** #17778, #17892, and #19187 are three distinct manifestations of the same class of problem: the model, the parser, and the server disagree about turn boundaries. If you're building agents, add your own wall-clock and iteration caps rather than relying on the model to terminate, and log `eval_count` alongside empty responses — #19187 fails silently.
- **Pin your quants.** #18252 shows official library artifacts can be functionally dead at specific quantization levels with no error at load time. Validate against a functional eval set, not just perplexity.
- **Concurrency semantics are still settling.** MLX models on `OLLAMA_NUM_PARALLEL > 1` land in #19197; `OLLAMA_NUM_PARALLEL=1` on the llama-server path is disputed in #19262. If you size memory budgets around serialized inference, verify empirically on your version.
- **Cloud has its own limits.** #19155 (413 on ~10.7 MiB) and #19309's compaction retry mean large coding sessions need client-side request compaction; don't assume the advertised context window is the operative limit.
- **EE / network-constrained environments should test `ollama pull hf.co/...` explicitly** before relying on it — #19345 breaks the entire path on DNS64 resolvers with no workaround short of changing resolvers.
- **Windows + partial offload + Blackwell is the least-covered configuration** in today's data (#19139, #19122). If that's your deployment target, budget for the CUDA eager-load retry in #18978 and watch for the fix to land.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-10-28

## Today's Highlights
A heavy release cadence continues across four stable lines (v1.106.5, v1.105.6, v1.104.8, v1.103.10), but the most consequential work today is in the PR queue: a large guardrail-security cluster (MCP hidden-tool bypass, secret redaction in tool traffic), a gzip-scoping backport being cherry-picked onto both 1.105.x and 1.106.x, and a batch of `[risk:high]`/breaking changes around key expiration and user-directory scoping. On the ops side, a still-unbackported eMudhra root CA fix on `stable/1.106.x` remains the sharpest open supply-chain concern for anyone shipping 1.106.x images.

## Releases & Breaking Changes
- **v1.106.5 / v1.105.6 / v1.104.8 / v1.103.10** published — all cosign-verifiable against `cosign.pub`; same procedure applies to `litellm-database`, `litellm-non_root`, and `docker.io/litellm/*` images. https://github.com/BerriAI/litellm/releases
- **Backport: gzip scoping (#48680, #48679)** — on both 1.105.x and 1.106.x, *every* response over 500 bytes is currently gzipped (including inference streams/tokens) and sub-1 MiB bodies are compressed on the event loop, stalling other requests. Cherry-pick of #46712 lands in v1.106.6 / v1.105.7. https://github.com/BerriAI/litellm/pull/48680 · https://github.com/BerriAI/litellm/pull/48679
- **BREAKING — key expiration semantics (#48672)** — `expires` was silently dropped by request schemas; keys will now honor an absolute timestamp on create/update/regenerate. Audit any tooling that relied on the implicit duration behavior. https://github.com/BerriAI/litellm/pull/48672
- **BREAKING — user directory search scoping (#48671)** — user search is now scoped to the caller's organizations by default; proxy admins get a compatibility opt-out. https://github.com/BerriAI/litellm/pull/48671
- **BREAKING — Usage "Ask AI" model access (#41851)** — with no model selected, Ask AI now returns 403 unless the caller can call `gpt-4o-mini`. Grant access or pick an allowed model before upgrading. https://github.com/BerriAI/litellm/pull/41851
- **Unresolved: eMudhra root CA (#47904)** — fix #47670 is only on `main`; every published 1.106.x image still trusts *emSign ECC Root CA - G3*. Requesting a `stable/1.106.x` backport. https://github.com/BerriAI/litellm/issues/47904

## New Model & Hardware Support
- **xAI X Search (#48677)** — native support via the Search API and WebSearch interception; returns citation URLs as results and records xAI-reported billing (tokens + tool usage). https://github.com/BerriAI/litellm/pull/48677
- **Morph open models (#48676)** — adds tools, structured output, and reasoning controls to Morph's open-weight chat models, plus eight model entries with cached-input pricing. https://github.com/BerriAI/litellm/pull/48676
- **Bedrock Mantle-native Claude (#48682)** — adds `token_count_model` to three rows that documented counting in an allowed region but couldn't be counted; 115 AWS price records verified against catalog in us-east-1/eu-west-1/ap-northeast-1. https://github.com/BerriAI/litellm/pull/48682
- **Cloudflare Workers AI (open, stale)** — image (#35055) and audio/STT/TTS (#35056) support proposed; provider also flagged as ~10 months out of date vs. Cloudflare's expanded API (#21115). https://github.com/BerriAI/litellm/issues/21115

## Performance & Optimization
- **Streaming fast path restored (#47735)** — a request-only guardrail was forcing the per-chunk response check on every streamed token; the gateway now skips it unless a guardrail actually inspects streamed pieces. https://github.com/BerriAI/litellm/pull/47735
- **Router Redis round-trip reduction (#48645)** — shared session-tier pin read now joins pending Redis work, saving one round trip; fixes cross-worker tier-pin coherence for identical tool continuations. https://github.com/BerriAI/litellm/pull/48645
- **CI guard speedup (#48683)** — spend-logs-guard and cost-map-guard drop the Rust extension build + 157-package install, cutting 3–5 min runs to seconds. https://github.com/BerriAI/litellm/pull/48683
- **Rust gateway cost catalog (#48210)** — bundled prices with non-blocking background refresh; installed map's source/revision inspectable via authenticated endpoint, failed refreshes retain current catalog. https://github.com/BerriAI/litellm/pull/48210

## Stability & Regressions
Ranked by severity:

1. **MCP hidden-tool bypass (HIGH)** — a tool excluded from `tools/list` by a `pre_mcp_call` guardrail remained callable by exact name. Two fixes merged: #48187 (enforce on `tools/call`/`mcp_tool_call`) and #48669 (refuse before upstream execution, incl. calls without prior listing). https://github.com/BerriAI/litellm/issues/48171 · https://github.com/BerriAI/litellm/pull/48669
2. **Secret leakage in tool traffic (HIGH, PR open)** — `[risk:high]` #47122 extends hide-secrets to tool results, tool inputs, tool call arguments, and system prompts for coding agents; every other guardrail sees unchanged input. https://github.com/BerriAI/litellm/pull/47122
3. **Gzip on inference responses (HIGH)** — see backports above; affects all 1.105.x/1.106.x deployments until v1.106.6/v1.105.7. https://github.com/BerriAI/litellm/issues/47904
4. **Budget-exceeded false positives (#27735)** — team-scoped virtual keys rejected with `BudgetExceededError` while `/key/info` shows spend under `max_budget`; stale spend on the enforcement path. Open, 12 comments. https://github.com/BerriAI/litellm/issues/27735
5. **Silent upstream + `request_timeout` never fires (#38358)** — streaming request to an upstream that accepts TCP but never writes a byte hangs past `litellm_settings.request_timeout`. Closed. https://github.com/BerriAI/litellm/issues/38358
6. **MCP parallel-request slot leak (#46093)** — every streamed `/v1/messages` carrying a `web_search` tool permanently consumes one `max_parallel_requests` slot. Closed. https://github.com/BerriAI/litellm/issues/46093
7. **Budget reservation sized by `max_input_tokens` (#47396)** — Anthropic-format `tool_choice` on `/v1/messages` triggers a `token_counter` KeyError and over-reserves budget. Closed. https://github.com/BerriAI/litellm/issues/47396
8. **`/v1/messages` `message_start` reports zero usage (#48481)** — Chat Completions adapter emits `input_tokens: 0` on the first stream event; real counts land in `message_delta`. Closed. https://github.com/BerriAI/litellm/issues/48481
9. **`reasoning_effort: "none"` removes thinking config instead of disabling it (#47924)** — on default-on Claude models the upstream default silently re-enables thinking. Open. https://github.com/BerriAI/litellm/issues/47924
10. **500 instead of 400 on non-object JSON bodies (#43711)** — `[]`/scalars hit `AttributeError` in `pre_db_read_auth_checks`. Closed. https://github.com/BerriAI/litellm/issues/43711
11. **SpendLogs partition misalignment (#34364)** — partition boundaries shift when DB session timezone ≠ UTC. Open. https://github.com/BerriAI/litellm/issues/34364
12. **Guardrail header lists unexecuted steps (#48472)** — `x-litellm-applied-guardrails` and spend logs over-report after early pipeline stop. PR open. https://github.com/BerriAI/litellm/pull/48472

## What This Means for Application Developers
- **If you pin 1.105.x or 1.106.x, plan the gzip upgrade now.** Until v1.106.6/v1.105.7, inference responses are compressed on the event loop, and any client that mishandles `Content-Encoding` on streaming bodies can corrupt tokens. Pin to the patched build once published.
- **Agent builders should treat MCP tool discovery as authoritative.** The listing-then-calling bypass is now blocked both at call time and before upstream execution — but if you cached tool names client-side to bypass `tools/list`, re-verify the allowlist semantics. Likewise, the hide-secrets expansion to tool args/results/system prompts (#47122) will change what agents see in tool history.
- **Budget enforcement is not yet trustworthy at the edge.** The #27735 stale-spend discrepancy plus #47396's max-input over-reservation mean you should keep your own hard caps on key spend and not rely solely on `BudgetExceededError` as a customer-facing boundary.
- **Timeouts on streaming paths need a belt-and-braces approach.** #38358 shows `/v1/messages` and completions can hang past `litellm_settings.request_timeout` when an upstream is silent from the first byte; add an application-level watchdog for agent loops.
- **Cosign verification remains a first-class part of the release process** — every tagged release ships a `cosign.pub` and reproducible verification commands; wire this into your image-promotion pipeline before deploying to production.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-10-28

## Today's Highlights
No releases shipped in the last 24h, but the repo is in a heavy stabilization push: a batch of CI/test fixes from the core team (torch dynamo/inductor config drift, pytest pinning, import-hoist verifier), plus several correctness/perf fixes for Studio (safetensors context overflow, MLX 4-bit decode speed, Stop responsiveness, ChatML role casing). On the feature side, the Flows editor rebuild (Studio component/theme parity) and the Benchmarks expansion (llama-bench, lm-eval-harness Evals tab) are the most substantive in-flight PRs. Hardware coverage debates continue: AMD iGPU VRAM accounting, Intel Arc finetuning, and exllamav3 are all open requests.

## Releases & Breaking Changes
None in the last 24h.

Note for API consumers: PR [#15417](https://github.com/unslothai/unsloth/issues/15417) reports that the Anthropic passthrough endpoint `/v1/messages` returns a hard `400 exceed_context_size_error` on context overflow **instead of** applying auto-compaction — a behavioral inconsistency vs. the OpenAI-compatible path. Not yet fixed.

## New Model & Hardware Support
- **LFM3-1.7B** support requested (LiquidAI LFM3 family, new backbone) — [issue #15588](https://github.com/unslothai/unsloth/issues/15588)
- **Intel Arc B580 (XPU)** finetuning workflow question/open request — [issue #15583](https://github.com/unslothai/unsloth/issues/15583)
- **exllamav3 (exl3 quants)** inference engine support requested; prior PR stalled — [issue #15527](https://github.com/unslothai/unsloth/issues/15527)
- **AMD multi-GPU**: PR [#14039](https://github.com/unslothai/unsloth/pull/14039) excludes iGPU shared-RAM from Train-page VRAM totals and default GPU pick (fixes bogus 100 GiB reporting on dual R9700 + Ryzen iGPU systems)
- **MLX / Apple**: Gemma 4 26B MLX vision producing `<unused6226>` tokens — [issue #15473](https://github.com/unslothai/unsloth/issues/15473); mixed NVIDIA+AMD Linux detection broken under custom llama.cpp — [issue #15444](https://github.com/unslothai/unsloth/issues/15444)

## Performance & Optimization
- **MLX 4-bit chat (~30% decode speedup)**: Studio now keeps embeddings and output head in 4-bit for MLX-loaded safetensors (e.g. Qwen3-0.6B ~350 → ~460 tok/s) — [PR #15617](https://github.com/unslothai/unsloth/pull/15617)
- **GGUF tokenizer load (50–200 ms CPU saved per read)**: string arrays (150k–262k tokens/merges) now walked through a single buffer instead of per-entry `read`/`unpack`/`seek`; cold loads read the header multiple times — [PR #15593](https://github.com/unslothai/unsloth/pull/15593)
- **Linux sandboxed tool spawn**: removal of Python pre-exec (`_sandbox_preexec`) reduces per-call launch overhead — [PR #15625](https://github.com/unslothai/unsloth/pull/15625)
- **Desktop launch**: login-shell PATH probe no longer blocks window open (previously unbounded wait) — [PR #15567](https://github.com/unslothai/unsloth/pull/15567)
- **Benchmarks expansion**: `llama-bench` tab for real prompt-processing/generation throughput, plus `lm-eval-harness` Evals tab (MMLU, MMLU-Pro, HellaSwag, ARC-C, GSM8K, TruthfulQA) — [PR #12522](https://github.com/unslothai/unsloth/pull/12522), [PR #12521](https://github.com/unslothai/unsloth/pull/12521)
- **Image/video API queueing**: `POST /v1/videos` now queues during an active render (was 409), and waiting `/v1/images/generations` batch — [PR #15613](https://github.com/unslothai/unsloth/pull/15613)

## Stability & Regressions
Ranked by severity:

1. **CI-wide breakage (torch config drift)** — `torch._dynamo.config.recompile_limit`, `suppress_errors`, `_inductor.config.emulate_precision_casts` no longer exist; 55–70 errors per PR across Backend CI shards. Fix PRs open: [PR #15626](https://github.com/unslothai/unsloth/pull/15626), [PR #15624](https://github.com/unslothai/unsloth/pull/15624)
2. **Context overflow on safetensors → opaque "internal error"** across Studio chat, OpenAI-compat, and Anthropic-compat APIs; crash is a tensor size mismatch. Fix: [PR #15616](https://github.com/unslothai/unsloth/pull/15616)
3. **Anthropic passthrough /v1/messages fails on overflow instead of auto-compacting** — breaks coding agents that rely on compaction; no fix PR yet — [issue #15417](https://github.com/unslothai/unsloth/issues/15417)
4. **Online DPO + `use_vllm=True` crashes at trainer init** (`UnboundLocalError: generation_kwargs`) for LoRA, full FT, and fast_inference — fix: [PR #15598](https://github.com/unslothai/unsloth/pull/15598)
5. **Windows training floods Recycle Bin** with sqlite WAL/SHM temp files (~10k entries / ~40 MB in 90 min) — [issue #15552](https://github.com/unslothai/unsloth/issues/15552)
6. **Memory leak**: ~200–400 MB loss on C: per use, no cleanup path — [issue #14487](https://github.com/unslothai/unsloth/issues/14487)
7. **Stop button unresponsive on MLX** while prompt is still being read (non-batched replies: Tools on, JSON format, logprobs) — fix: [PR #15615](https://github.com/unslothai/unsloth/pull/15615)
8. **ChatML datasets with capitalized roles silently produce empty rows** on Qwen3/Phi-4, halting training — fix: [PR #15599](https://github.com/unslothai/unsloth/pull/15599)
9. **Studio training stack trace** — [issue #15538](https://github.com/unslothai/unsloth/issues/15538)
10. **Qwen3.5-2B Studio resume fails**: `_MODEL_WEIGHT_RE` misses `model.safetensors-00001-of-00001.safetensors` — [issue #15405](https://github.com/unslothai/unsloth/issues/15405)

## What This Means for Application Developers
- **Pin your torch**: if you build on Unsloth CI or vendor its test harness, expect dynamo/inductor config symbol removals to break test suites until #15626/#15624 land. Pin pytest < 9.2 in the interim.
- **Handle overflow explicitly in client code**: the Anthropic passthrough path does not auto-compact — implement your own truncation/summarization before hitting `/v1/messages`, or route through the OpenAI-compat endpoint where compaction works.
- **Safetensors serving is safer for chat after #15616**, but until merged, wrap generation calls with explicit context-length pre-checks and don't rely on generic error messages for diagnostics.
- **Mac/MLX users get a material throughput win** from #15617; if you're benchmarking inference cost on Apple silicon, re-measure after that lands. Also track #15615 if you enable Tools, JSON mode, or logprobs — Stop semantics were broken there.
- **GPU inventory logic matters on mixed systems**: the AMD iGPU fix (#14039) shows VRAM totals can be inflated by shared system RAM — validate device selection in your own orchestration layer rather than trusting the UI's default GPU pick.
- **Agent builders**: multi-agent orchestration ([#10776](https://github.com/unslothai/unsloth/issues/10776)), full-page screenshots for Browser Use ([#15448](https://github.com/unslothai/unsloth/issues/15448)), optional visual Computer Use ([#15532](https://github.com/unslothai/unsloth/issues/15532)), and MCP per-tool switches ([#14348](https://github.com/unslothai/unsloth/pull/14348)) are all queued — if you're integrating agents via MCP or browser tools, watch #14348 for the config surface you'll need to support.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*