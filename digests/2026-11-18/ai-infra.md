# AI Infrastructure Digest 2026-11-18

> Generated: 2026-11-18 02:50 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Digest
**Date: 2026-11-18 | Scope: vLLM, SGLang, llama.cpp, Ollama, LiteLLM, Unsloth**

---

## 1. Ecosystem Overview

The 2026-11-18 digest confirms a market that has bifurcated into **production serving engines** (vLLM, SGLang) racing on frontier hardware (Blackwell SM120, MI355X/gfx950, Ascend NPU) and **local/edge runtimes** (llama.cpp, Ollama) quietly absorbing multimodal and TTS workloads. The dominant engineering theme across the top two engines is no longer raw throughput but **silent correctness**: vLLM disclosed a SwiGLU clamp omission producing severe log-prob mismatches, and SGLang reported fp16 MHA NaN that degrades output without a crash. Meanwhile LiteLLM is executing the most architecturally significant change of the day — a native **Rust rewrite of the proxy data plane** — while simultaneously fixing long-standing O(n²) and memory-retention bugs in the Python path. On the training side, Unsloth's silent drop of MoE router aux loss (corrected only today) reinforces that eval-equivalence across framework versions remains an unsolved trust problem. The layer that benefits most from today's work is agent/tool-calling, where reliability is now the binding constraint rather than model capability.

---

## 2. Activity Comparison

| Project | Layer | Issues (open / notable) | PRs (open / notable) | Release status (last 24h) | Breaking-change signal |
|---|---|---|---|---|---|
| **vLLM** | Serving engine (datacenter) | ~10 ranked stability items; trackers with 36+ comments | ~15 active perf/feature PRs, 6-PR ROCm stack | None | RFC: weight reload semantics (Rev 2); frontend `tool_choice` divergence |
| **SGLang** | Serving engine (datacenter) | CUDA coredump tracker (380); CI flakiness (211); 33–45% regression | KDA overflow, grammar LRU, SPF reservation, HiCache | None | 1.0 tracker converts silent config → errors |
| **llama.cpp** | Local runtime (library/server) | ~16 ranked; Vulkan/RDNA3, i915, SYCL | Kokoro TTS, conv2d F32, few-row MMQ, V100 MoE | **b12484–b12494 merged** | `grammar`+`ignore_eos` now returns HTTP 400 |
| **Ollama** | Local runtime (product) | ~9 ranked; RDNA1 regression, glm-ocr EOS | CANN/Ascend, MLX cache, VRAM splitting, streaming buffer | None | None |
| **LiteLLM** | Gateway / proxy | ~10 ranked; read-replica dead, audit 500, stream builder | Rust gateway port (multiple), FIPS AES-GCM, cache-key fix | **v1.110.0, v1.111.0-rc.1, v1.108.11 LTS** | `enable_projects_ui` removed; FIPS crypto swap |
| **Unsloth** | Fine-tuning / Studio | ~10 ranked; ROCm VAE NaN, qk_norm bug, privacy log | MCP OAuth, alias configs, MoE aux-loss fix, log redaction | **v0.1.919-beta** | SFT loss baseline moves on TRL ≥ 1.18 |

**Reading the table:** vLLM and SGLang show the highest *engineering throughput* on frontier kernels; llama.cpp is the only project with same-day merged commits at volume; LiteLLM is the only project shipping a *release + RC + LTS* in one window, and the only one undergoing a language-level rewrite.

---

## 3. Model Support Race

**New model landings in this window:**

| Model | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| DeepSeek-V4-Flash / V4.1 (incl. Vision) | ✅ RTX PRO 6000 Blackwell preset (8/4-GPU) | ✅ FP8 DeepGEMM Hopper + gfx950/RDNA trackers | — | — | — |
| Kimi K3 | ✅ structured-output protocol (draft) | ✅ MLA under DCP (NPU) | — | — | — |
| Qwen3.5 / 3.8 family | tracker issues (3.5-27B slow batch) | ✅ MTP quant fix on NPU | — | tool-call parser bug | ✅ 27B GGUF + llama-server |
| GLM DSA / GLM-5.3-Flash | — | ✅ Ascend layer-split; SM120 fa4 crash | — | — | — |
| Gemma 4 26B MLX | — | — | — | — | ✅ vision bug fixed |
| MiniMax-H3-Image | — | — | — | — | ✅ **GGUF/FP8/INT8 + LoRA (first)** |
| Kokoro TTS / Qwen3-TTS ICL | — | — | ✅ **merged (b12494/b12491)** | — | — |
| gpt-oss | 500-error fix PR open | — | — | — | ✅ aux-loss SFT fix |
| PPLX Decider v1.3 | — | — | — | ✅ MLX 27B + Flash | — |

**Verdict:**
- **vLLM is ahead on frontier datacenter architectures** (DeepSeek-V4-Flash-Vision on sm_120 with validated placement presets is a shipping-grade artifact, not a feature request).
- **SGLang is ahead on Chinese-model + NPU breadth** — it is the only engine with credible Ascend coverage across GLM DSA, Kimi K3, and Qwen3.5 MTP.
- **llama.cpp now leads on audio** — Kokoro and Qwen3-TTS merging into mtmd makes it the only project where text, vision, and speech share one pipeline.
- **Unsloth is the only project shipping quantized multimodal training** for a new model on day one (MiniMax-H3-Image).

---

## 4. Performance Frontier

Optimization effort today clusters unevenly:

- **vLLM — ROCm/gfx950 decode-step launch fusion.** Six stacked PRs collapse sparse-MLA top-k from 4 launches to 1, eliminate 4 launches per decode step in compression, and reduce 8-block+merge to a single block for few-row top-512. This is *kernel-launch-count* optimization — the most mature form of inference tuning and a strong signal that AMD MI355X is now a first-class target. Secondary: last-layer FFN pruning during prefill (broadly applicable, mathematically equivalence-preserving).

- **SGLang — KV cache & scheduler economics.** HiCache unified-memory page-envelope work (hole compaction, row-granular copies) and SPF dual-budget reservation address *memory-hierarchy throughput* under multi-turn load. The EAGLE fused draft-softmax+sample kernel targets speculative-decoding latency. Notably, SGLang is fighting a **33–45% SM90 decode regression** — optimization here is partly defensive.

- **llama.cpp — CUDA kernel dispatch correctness.** Few-row MMQ for MoE decode (DGX Spark), conv2d F32 implicit GEMM, V100 MMQ routing (fixing a *silent slow path* where FP16 tensor cores exist but INT8 tensor cores don't), and native quantized KV dequant in flash attention. The discipline is notable: quantized matvec fusion was **proactively disabled on Pascal** rather than shipped with a regression.

- **Ollama — infrastructure & allocation efficiency.** 8 MB per-call streaming buffer → on-demand; VRAM accounting fixes ending unnecessary model splits/evictions; context-shift no longer forces reloads.

- **LiteLLM — gateway hot-path de-quadraticization.** Cache-key construction no longer stringifies the full request (200 MB payloads were spending seconds on the event loop); credential sync went from O(n²) with 10s+ blocking reloads to Rust/SQLx; router now uses per-deployment tokenizers instead of gpt-3.5's (9–14% context over-count).

**Cross-cutting observation:** the frontier has shifted from "make a token faster" to **(a) eliminate redundant kernel launches, (b) remove silent correctness gaps in fast paths, (c) fix algorithmic complexity in control planes.**

---

## 5. Layer Positioning

```
┌─────────────────────────────────────────────────────────────────┐
│  FINE-TUNING / TRAINING       │  Unsloth (Studio + kernels)     │
├─────────────────────────────────────────────────────────────────┤
│  GATEWAY / PROXY              │  LiteLLM (Python → Rust port)   │
├─────────────────────────────────────────────────────────────────┤
│  SERVING ENGINES (datacenter)  │  vLLM      │  SGLang            │
│  → multi-GPU, PD-disagg, MoE,  │  (broad    │  (NPU/China-model  │
│    spec decoding, KV tiers     │   coverage)│   + unified memory)│
├─────────────────────────────────────────────────────────────────┤
│  LOCAL RUNTIMES                │  llama.cpp  │  Ollama            │
│  → GGUF, single-node, mtmd,    │  (library)  │  (product/UX)      │
│    TTS, edge GPUs              │             │                    │
└─────────────────────────────────────────────────────────────────┘
```

- **Serving engines (vLLM, SGLang)** compete on **scale-out correctness and hardware coverage**. vLLM's differentiator is breadth (ROCm, Intel XPU FP8, Blackwell sm_120, Rust frontend). SGLang's is depth on NPU + Chinese frontier models, plus PD-disaggregation with unified memory. Both are converging on *silent-config → explicit-error* policies (SGLang 1.0 tracker; vLLM's frontend divergence RFC).

- **Local runtimes (llama.cpp, Ollama)** occupy different sub-layers: llama.cpp is the **engine/library** (mtmd now unifies text, vision, TTS); Ollama is the **productization layer** (VRAM splitting, model loading, streaming, CANN backend). Ollama's roadmap increasingly looks like "llama.cpp + UX + hardware abstraction."

- **Gateway (LiteLLM)** is the only project in the set executing a **full control-plane language migration** (Python → Rust gateway via `router-core`). This is the clearest signal that gateway latency, not model latency, is becoming the SLO bottleneck in multi-provider deployments.

- **Training/fine-tuning (Unsloth)** sits orthogonally, but its **TRL ≥ 1.18 aux-loss correction** and **MCP search-only listing** both directly affect inference-time behavior (checkpoint comparability; prompt-cache stability).

---

## 6. Trend Signals

**Six trends extracted from today's activity:**

1. **Silent correctness is the headline risk of 2026.**
   - vLLM: DeepGEMM SwiGLU clamp omission → 9 severe token mismatches per 16K tokens (#68084).
   - SGLang: fp16 MHA decode NaN when a single q·k exceeds 65504 (#51095).
   - Unsloth: MoE router aux loss silently dropped on TRL ≥ 1.18 (#18230).
   - llama.cpp: `pattern` silently overriding `minLength`/`maxLength` (#30749).
   - **Watch:** stop treating "it runs" as "it's correct"; add log-prob-diff and NaN canaries to CI across at least two engines.

2. **The Rust control plane is the new competitive battleground.**
   - LiteLLM porting the proxy to a native Rust gateway (`router-core`, SQLx auth, Rust middleware).
   - vLLM exposing a Rust HTTP frontend (with a known `tool_choice` semantic divergence vs Python, #66858).
   - SGLang's Rust frontend at multimodal parity deficit (Qwen-VL only, #48705).
   - **Watch:** gateway frontends are fragmenting by language; pin your adapter semantics and test tool-calling explicitly.

3. **Tool-call and streaming fidelity is the agent stack's weakest link.**
   - vLLM (gpt-oss 500 on special tokens in prior tool names), LiteLLM (parallel tool-call args dropped in Codex streaming #45348), Ollama (Qwen XML parse failures #14834), llama.cpp (bare-JSON Llama 3.x skips lazy grammar #32496), SGLang (Anthropic streaming drops closing `}`, #42260).
   - **Watch:** validate tool-call JSON at your application boundary; do not trust streamed delimiters from any engine today.

4. **KV cache is migrating from "a tensor" to "a tiered memory system."**
   - SGLang HiCache unified-memory page-envelope work; vLLM KV-offload promotion lifecycle redesign (#66782) and the 1.0–1.8s re-queue stall (#62532); llama.cpp native quantized KV in flash attention (#31234).
   - **Watch:** tiered KV (HBM → host → NVMe/RDMA) is becoming a first-class configurable resource; budget for promotion-latency SLOs, not just hit rates.

5. **Frontier hardware has pluralized — AMD and Ascend are no longer experimental.**
   - vLLM: 6-PR gfx950/MI355X stack, Intel XPU FP8 unification (Xe3p prefers W8A8).
   - SGLang: ROCm trackers (DeepSeek-V4.1-Flash, Qwen3.8-27B MXFP4) + AMD correctness fixes (RCCL routing for gfx1250, ROCm 7.2 masked SDPA).
   - Ollama: CANN/Ascend NPU build + device discovery PR (#19732).
   - **Watch:** if you evaluate only NVIDIA, you are now leaving validated capacity on the table.

6. **Multimodal + audio is consolidating into single-process inference.**
   - llama.cpp: Kokoro TTS + Qwen3-TTS ICL merged into mtmd (speech synthesis in the same server).
   - Unsloth: Computer Use (beta) with MCP integrations for Unity/Unreal/Blender/Roblox.
   - vLLM: Rust frontend multimodal metadata (`mm_payload: "metadata"`) for encoder-cache transfer.
   - **Watch:** voice and screen-driving agents can now collapse multiple services into one process — simplify your deployment topology.

---

### Actionable summary for technical decision-makers

| Priority | Action |
|---|---|
| **Immediate** | Apply vLLM #68084 (SwiGLU clamp) if serving DeepSeek-V4-Flash-Base on H200 + DeepEP low-latency. Sanitize `tool_call.name` for gpt-oss. |
| **Immediate** | Pin SGLang at v0.5.22 if on H20/H100/H200 with DSPARK — do not take v0.5.23 until #49336 is resolved. |
| **This quarter** | Move LiteLLM LTS users to `:lts` (v1.108.11); audit `SQL_ASCII` Postgres; set debug logging off in prod given salt-key exposure (#12448). |
| **This quarter** | Re-baseline MoE SFT evals if you upgraded to TRL ≥ 1.18 with Unsloth — loss values shifted materially (#18230). |
| **Strategic** | Treat streaming tool-call fidelity as a gate in your vendor selection matrix — no engine in this digest is clean across all providers today. |
| **Strategic** | Design agent serving for tiered KV (host/RDMA offload) and for the ~8-image computer-use KV ceiling in Unsloth Studio (#18231). |

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-18

## 1. Today's Highlights

No new releases shipped in the last 24h, but activity is heavy on the ROCm/DeepSeek-V4.1 performance track, where AMD engineers landed a dense cluster of stacked optimization PRs (sparse-MLA top-k fusion, compression/insert fusion, and top-512 kernel tuning). On the stability side, the most actionable items are a gpt-oss chat-completions 500 error (fix PR open), a DFlash acceptance collapse under TP>1, and a batch-invariance/cuBLAS routing issue that was formally withdrawn after correction. Rust frontend feature parity and KV-offload promotion semantics remain the dominant long-running design threads.

## 2. Releases & Breaking Changes

- **No releases in the last 24h.**
- [RFC] **Direct Weight Reload for RL Training (Rev 2)** — [Issue #54477](https://github.com/vllm-project/vllm/issues/54477). The revision reverses the Rev 1 approach of skipping post-load processing on reload, after validating across 17 flagship model families. Rev 1 caused **silent correctness errors** (stale MLA absorbed weights; loaders bypassing post-load). If you build RL training loops that reload weights into a running engine, treat any pre-Rev-2 behavior as unsafe and re-read the updated contract.
- **[RFC] One rule for `tools` + `response_format` under `tool_choice="auto"`** — [Issue #66858](https://github.com/vllm-project/vllm/issues/66858). Python and Rust frontends currently return **opposite behavior** for the same request. Not yet breaking, but integrators relying on tool-call routing semantics should pin to a frontend and track this.

## 3. New Model & Hardware Support

- **DeepSeek-V4-Flash-Vision-Exp on RTX PRO 6000 Blackwell (sm_120)** — [PR #64867](https://github.com/vllm-project/vllm/pull/64867). Adds 8-GPU and 4-GPU placement presets, validated launch commands, and benchmarks to the recipe.
- **Rust frontend multimodal metadata support** — [PR #68274](https://github.com/vllm-project/vllm/pull/68274). Ports `mm_payload: "metadata"` to the Rust HTTP frontend, enabling metadata-only features in the render→generate flow (relevant for disaggregated/encoder-cache transfer setups).
- **Intel XPU FP8 path unification** — [PR #67891](https://github.com/vllm-project/vllm/pull/67891) (consolidates closed [#67856](https://github.com/vllm-project/vllm/pull/67856)). Xe3p (Crescent Island / Nova Lake-P) now prefers **W8A8 FP8** GEMM; other XPUs stay W8A16. Covers both block and non-block FP8.
- **Nemotron 3.5 ASR Streaming (0.6B)** — [Issue #47455](https://github.com/vllm-project/vllm/issues/47455) still open; streaming ASR feature request, not yet landed.
- **DaVinci / Kimi K3 structured-output protocol tracking** — [PR #68279](https://github.com/vllm-project/vllm/pull/68279), experimental Draft with known chat-frontend limitations.

## 4. Performance & Optimization

**ROCm / gfx950 (MI355X) — DeepSeek-V4.1, stacked series:**
- [PR #67365](https://github.com/vllm-project/vllm/pull/67365) — decode sparse-MLA ragged top-k built in **1 launch instead of 4**, from MXFP4 indexer row bounds (DEP8 path).
- [PR #67367](https://github.com/vllm-project/vllm/pull/67367) — few-row gfx950 top-512 calls (≤32 rows, 16K–36K positions) stay in **one block instead of 8 blocks + merge**.
- [PR #67366](https://github.com/vllm-project/vllm/pull/67366) — folds consumer remap into top-512 and skips the −1 fill on all decode rows.
- [PR #67364](https://github.com/vllm-project/vllm/pull/67364) — compression launch writes cache records itself: **4 fewer launches per decode step** (4 kv-source layers).
- [PR #67584](https://github.com/vllm-project/vllm/pull/67584) — AITER MegaMoE picks small/large/staged route per call from DP-group max rows instead of always staged.
- [PR #65555](https://github.com/vllm-project/vllm/pull/65555) — DSv4.1 sparse-indexer prefill scored on ShardQ token slices.
- Trackers: [Qwen3.8-2.4T-A95B #57149](https://github.com/vllm-project/vllm/issues/57149) (36 comments), [Qwen3.8-Flash-Next #59575](https://github.com/vllm-project/vllm/issues/59575), [Qwen3.5-27B batch inference slow #36010](https://github.com/vllm-project/vllm/issues/36010) still open.

**Other:**
- **Last-layer FFN pruning during prefill** — [PR #68283](https://github.com/vllm-project/vllm/pull/68283). Skips unused final-layer FFN rows while preserving mathematical equivalence of required outputs; broadly applicable to token-wise FFN Transformers.
- **TP all-gather latency** — [Issue #65359](https://github.com/vllm-project/vllm/issues/65359): proposal to wire FlashInfer `PcieIpcAllGatherWorkspace` into `CudaCommunicator.all_gather` for chatty small gathers (DeepSeek-V4.1 Engram embedding tables, compressor, drafter).
- **Prefix-match-unit tradeoff on Triton/FLA GDN backend** — [Issue #67674](https://github.com/vllm-project/vllm/issues/67674): recovers hybrid-model prefix hits on multi-turn/agent traces but costs ~30 ms TTFT on almost every request on L40. Relevant to agent-serving workloads.
- **[Scheduler][RFC] Opt-in adaptive prefill time budget** — [PR #67811](https://github.com/vllm-project/vllm/pull/67811), draft experimental.

## 5. Stability & Regressions

Ranked by severity:

1. **Batched DeepGEMM missing SwiGLU clamp → silent correctness mismatch** — [PR #68084](https://github.com/vllm-project/vllm/pull/68084). DeepSeek-V4-Flash-Base sets `swiglu_limit=10`; with `deepep_low_latency` on 8×H200, batched DeepGEMM omitted the clamp, producing **9 severe token log-probability mismatches in 16,384 tokens** (one token at −0.31 vs −31.68). Fix PR open. **This is a correctness bug, not just a perf issue.**
2. **gpt-oss chat completions 500 on special-token text in prior tool-call names** — [Issue #65770](https://github.com/vllm-project/vllm/issues/65770) / [PR #65771](https://github.com/vllm-project/vllm/pull/65771). Reproduces on 0.31.0, 0.32.0, 0.33.0, and main. Pure-Python renderer bug, platform-independent. Fix PR open and marked ready/verified.
3. **DFlash acceptance collapse at TP>1** — [Issue #66387](https://github.com/vllm-project/vllm/issues/66387). MiMo-V2.6-Flash-MOPD drafter; fine at TP1, degrades with tensor parallelism on 8-GPU NVLink. No fix linked yet.
4. **SM120 CUDA graph capture broken → severe decode slowdown** — [Issue #56892](https://github.com/vllm-project/vllm/issues/56892). DeepSeek-V4.1-Flash on 8× RTX PRO 6000 Blackwell with `--enforce-eager`; CUDA graphs unusable on SM120. Requested fix prioritization.
5. **Forced named tool choice ~11× slower on A100 vs prior version** — [Issue #65564](https://github.com/vllm-project/vllm/issues/65564). Qwen3.5-9B, regression from v0.27.1 → v0.31.0; `tool_choice="auto"` is fast.
6. **EagleMistralLarge3 `AttributeError: 'use_mha'`** — [Issue #43298](https://github.com/vllm-project/vllm/issues/43298). Speculative decoding crash on Mistral-Large-3-675B, 8×H200, still open.
7. **KV-offload re-queueing stall, 1.0–1.8 s** — [Issue #62532](https://github.com/vllm-project/vllm/issues/62532). Async KV pulls via `OffloadingConnector` + p2p/RDMA (NixlConnector). RFC proposes front-of-queue re-admission. Related promotion-lifecycle redesign in [#66782](https://github.com/vllm-project/vllm/issues/66782).
8. **Host-buffer race in DSA indexer ShardQ path** — [PR #66052](https://github.com/vllm-project/vllm/pull/66052). Pinned buffers reused across steps could be overwritten by async scheduling before the copy runs; fix stages indices in fresh host memory each step.
9. **Batch-invariance / cuBLAS routing — withdrawn** — [Issue #65569](https://github.com/vllm-project/vllm/issues/65569) (closed). The proposal was withdrawn after finding cuBLAS is **not** batch-invariant for all shapes (narrow MoE router layers fail; boundary depends on K, workspace env vars, and GPU). Useful negative result for anyone depending on batch invariance.
10. **NVIDIA nightly CI failures** — [Issue #67307](https://github.com/vllm-project/vllm/issues/67307), now closed; tracked across several nightlies.

## 6. What This Means for Application Developers

- **If you serve DeepSeek-V4-Flash-Base with DeepEP low-latency on H200, apply the SwiGLU clamp fix** ([#68084](https://github.com/vllm-project/vllm/pull/68084)) — the failure mode is silent numerical corruption that would corrupt evals and agent reasoning long before it throws.
- **Tool-calling code that passes user-influenced tool names should route around the gpt-oss 500** ([#65770](https://github.com/vllm-project/vllm/pull/65771)). If you build agents with gpt-oss and reconstruct prior tool calls into history, sanitize `tool_call.name` until the fix lands.
- **Don't rely on the assumption that "auto" and explicit tool routing are equivalent across frontends** ([#66858](https://github.com/vllm-project/vllm/issues/66858)). If you are evaluating the Rust frontend, pin your gateway semantics and test `tools` + `response_format` + `tool_choice="auto"` explicitly.
- **Agent and multi-turn workloads on hybrid models (GDN + full attention) face a real TTFT tax** when enabling `--prefix-match-unit` on the Triton/FLA GDN backend (~30 ms request-level). Measure against your trace mix before enabling ([#67674](https://github.com/vllm-project/vllm/issues/67674)).
- **RL and continual-learning loops** should not build on pre-Rev-2 weight-reload behavior — it produced silent staleness in exactly the attention variants (MLA) that modern training pipelines use ([#54477](https://github.com/vllm-project/vllm/issues/54477)).
- **KV-offload-heavy deployments** can expect 1.0–1.8 s stalls around completed async KV pulls today; if you run tiered offload with RoCE RDMA secondary tiers, track [#62532](https://github.com/vllm-project/vllm/issues/62532) and [#66782](https://github.com/vllm-project/vllm/issues/66782), which together redesign promotion timing and pinning semantics.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-18

## 1. Today's Highlights

No releases landed in the last 24h, but issue and PR activity is heavy: the **SGLang 1.0 stability tracker (#50045)** is now the organizing theme for breaking-change planning, a **33–45% SM90 decode regression** between v0.5.22 and v0.5.23 (#49336) remains open, and PD-disaggregation roadmap work (#43699) is converging on unified-memory + speculative-decoding support over Mooncake (#50742). On the PR side, several correctness-critical fixes are in flight: KDA prefill int32 overflow (#50775), grammar-cache unbounded RSS growth (#45087), and SPF scheduler budget reservation (#47308).

## 2. Releases & Breaking Changes

- No new releases in the last 24h.
- **SGLang 1.0 release tracker** (#50045) — https://github.com/sgl-project/sglang/issues/50045. Framed as a **stability release**: silent configuration changes will be replaced with explicit errors that name the offending setting, and a 1.x compatibility policy is being defined. Upgrading from 0.5.x may require changes (upgrade notes tracked in the issue). Worth reading now if you pin SGLang in production.
- **KV cache event schema alignment with vLLM** (#39991, RFC, 👍3) — https://github.com/sgl-project/sglang/issues/39991. Since #37482 changed the KV cache event format, this RFC proposes aligning with vLLM's schema so shared consumers (routers, autoscalers, cache-aware schedulers) can consume one standard format. Relevant if you built tooling against the current event stream.

## 3. New Model & Hardware Support

- **[NPU] GLM DSA cache layer-split on Ascend** (#48389) — https://github.com/sgl-project/sglang/pull/48389. Adds hierarchical-cache layer-split support for GLM DSA on Ascend NPUs.
- **[NPU] Token-interleaved KV for DSA and Kimi K3 MLA under DCP** (#49271) — https://github.com/sgl-project/sglang/pull/49271. Reuses the Mooncake PD direct-transfer path for NPU DCP.
- **[NPU] qwen3_5_mtp: adapt mtp.fc quantization as ReplicatedLinear** (#49790) — https://github.com/sgl-project/sglang/pull/49790. Fixes quantization handling for Qwen3.5 MTP heads on NPU.
- **[CPU] FP8/INT8 quant ops and compressed-tensors support** (#41329, merged/closed) — https://github.com/sgl-project/sglang/pull/41329. Adds Xeon/AMX CPU support for FP8/INT8 quantization utilities with in-tree `sgl_kernel` CPU kernels.
- **NPU development roadmap 2026 H2** (#25598) — https://github.com/sgl-project/sglang/issues/25598. Targets full compatibility/reliability for PD disaggregation, all parallelism strategies, speculative decoding, hierarchical cache, and load balancing on NPUs.
- **ROCm/MI355X model trackers**: DeepSeek-V4.1-Flash gfx950 (#49327, https://github.com/sgl-project/sglang/issues/49327) and Qwen3.8-27B MXFP4 (#49324, https://github.com/sgl-project/sglang/issues/49324).
- **Multimodal parity tracker (Rust vs Python frontend)** (#48705) — https://github.com/sgl-project/sglang/issues/48705. The Rust frontend (`SGLANG_RUST_SERVER=1`) currently serves only Qwen-VL images; parity work is scoped to Qwen3-VL first.

## 4. Performance & Optimization

- **[Perf][Spec] Fused draft softmax + sample kernel for EAGLE rejection sampling** (#50620) — https://github.com/sgl-project/sglang/pull/50620. Single-pass JIT kernel computes draft proposal (`softmax`, sample, accept) from fp32 logits for `--speculative-use-rejection-sampling`.
- **DSV4.1-Flash FP8 DeepGEMM prefill scoring on Hopper** (#49066) — https://github.com/sgl-project/sglang/pull/49066. Extends #50719's FPGA-scoring indexer to prefill candidate consumers with ragged top-k operators.
- **HiCache: faster unified page-envelope host pool** (#50745) — https://github.com/sgl-project/sglang/pull/50745. Targets three scheduler stalls under sustained multi-turn load with `--enable-unified-memory --enable-hierarchical-cache`: per-pool shared reclaim, hole-filling compaction (replacing full sort of live pages), and row-granular host↔device copies.
- **Regression to be aware of: SM90 decode +33–45% per-step at concurrency 12** (#49336) — https://github.com/sgl-project/sglang/issues/49336. v0.5.22 → v0.5.23 on 8× H20-3e with DeepSeek-V4.1-Flash + DSPARK spec decoding, across 8K–64K contexts. Also reports `use_deep_select_decode` costs acceptance on Hopper. No fix PR referenced yet.
- **SPF scheduler: reserve capacity against both token budgets** (#47308) — https://github.com/sgl-project/sglang/pull/47308. Shortest-prefill-first could exhaust the separate input budget while reserving chunk budget; fix sizes chunked-request reservation against both.
- **Upstream NEXTN/EAGLE memory bug** (#36452, closed/inactive) — https://github.com/sgl-project/sglang/issues/36452. Draft `embed_tokens`/`lm_head` copies released *after* KV pool sizing significantly shrank `max_total_num_tokens`; workaround documented.

## 5. Stability & Regressions

Ranked by severity:

1. **CUDA coredump tracker** (#26340, 380 comments) — https://github.com/sgl-project/sglang/issues/26340. Auto-collected coredumps from `pr-test.yml` (one comment per run/job/attempt). Highest-traffic open issue; ongoing signal of stability health.
2. **SM90 decode regression 33–45%** (#49336) — see above. No fix PR; bisect window is v0.5.22 (`baa9befa38`) → v0.5.23 (`297e54fd10`).
3. **fp16 MHA decode NaN** (#51095, new) — https://github.com/sgl-project/sglang/issues/51095. `decode_attention_fwd` returns NaN in fp16 when a single q·k product exceeds 65504, because the score sum isn't accumulated in fp32 before the cast in `_fwd_kernel_stage1`. Silent wrong output, not a crash — high priority for fp16 MHA users.
4. **GLM-5.3-Flash on SM120: fa4 crashes at CUDA-graph capture** (#42012) — https://github.com/sgl-project/sglang/issues/42012. Hybrid extend reshape failure on RTX PRO 6000 (8× SM120, `v0.5.20` image); **triton is the only working backend**.
5. **KDA prefill int32 offset overflow** (#50775) — https://github.com/sgl-project/sglang/pull/50775. Three prefill kernels build row offsets in int32; `bos * H * K` wraps past ~524k tokens (H=32, K=128), reachable in packed long-context prefill. Fix PR open.
6. **Grammar cache unbounded RSS growth** (#45087) — https://github.com/sgl-project/sglang/pull/45087. `BaseGrammarBackend.cache` never evicts; measured +250–380 MB scheduler RSS per previously-unseen `json_schema` at 150k vocab. Fix adds host-memory-bounded LRU.
7. **Reasoning parser splits on quoted ``** (#48791) — https://github.com/sgl-project/sglang/issues/48791. Literal think-tag string inside CoT truncates `reasoning_content` and leaks the rest into `content`. Open, no fix PR.
8. **Anthropic streaming drops tool-call closing `}`** (#42260) and **DSML tool calls returned as content** (#40236, closed/inactive) — https://github.com/sgl-project/sglang/issues/42260, https://github.com/sgl-project/sglang/issues/40236. Tool-call streaming fidelity for qwen3_coder and DeepSeek V3.2/V4.
9. **Qwen3.8-27B batch-shape-dependent scores** (#43956) — https://github.com/sgl-project/sglang/issues/43956. Borderline decisions flip with batch shape in FP8 and BF16.
10. **macOS CPU device broken** (#50915, new) — https://github.com/sgl-project/sglang/issues/50915. `--device cpu` fails with `RuntimeError` running `lscpu` (`get_cpu_ids_by_node`) on `main` @ `f534dbaeb2`.
11. **AMD-specific correctness fixes in flight**: gfx1250 diffusion custom all-reduce returns wrong sums (relative error 0.38–0.77), fix routes TP groups over RCCL (#51135, https://github.com/sgl-project/sglang/pull/51135); ROCm 7.2 masked SDPA wrong for some head dims, fix runs under MATH (#50942, https://github.com/sgl-project/sglang/pull/50942); Q8 BF16→FP16 scale saturation in QuickReduce all-reduce (#40084, closed/inactive, https://github.com/sgl-project/sglang/issues/40084); fused diffusion QK-norm JIT repair (#40585, https://github.com/sgl-project/sglang/pull/40585).
12. **CI flakiness** (#42752, 211 comments; #17050) — https://github.com/sgl-project/sglang/issues/42752, https://github.com/sgl-project/sglang/issues/17050. As of 2026-11-18 02:04 UTC: 1 broken, 13 flaky, 931 recently fixed.

## 6. What This Means for Application Developers

- **Pin and bisect deliberately.** The v0.5.22 → v0.5.23 SM90 decode regression is a real, reproducible ~33–45% throughput loss on Hopper for spec-decode workloads. If you're on H20/H100/H200 with DSPARK, hold at v0.5.22 until #49336 is resolved and re-benchmark both release tags.
- **fp16 MHA is a silent-correctness minefield.** NaN in `decode_attention_fwd` when a q·k product exceeds fp16 max (#51095) means outputs can degrade without a crash. Prefer bf16, or verify numerically on the current build if you must use fp16 with `kv_group_num == 1`.
- **Agent workloads: cache hygiene matters now.** The unbounded grammar cache (#45087) means every novel `json_schema` from an agent framework adds hundreds of MB of scheduler RSS. If you generate schemas per-request, cap schema diversity or track the LRU fix; pair with the agentic cache roadmap (#43098, supernode-wide L1/L2 KV sharing) and the agent-harness compatibility RFC (#47763).
- **Tool-call parsing: be defensive.** Multiple open issues cover dropped closing braces in Anthropic-format streaming (#42260) and content-leaked tool calls (#40236), plus reasoning-tag quoting breaking the parser (#48791). Validate tool-call JSON at the application boundary and don't rely on the streamed delimiters being exact.
- **PD disaggregation is moving to unified memory.** PR #50742 (https://github.com/sgl-project/sglang/pull/50742) lifts the restriction on PD + speculative decoding over Mooncake with `--enable-unified-memory`. If you run hybrid-SWA targets with draft models in disaggregated deployments, this is the unlock to watch.
- **Watch the 1.0 tracker for config-behavior changes.** Silent misconfiguration becoming hard errors (#50045) is good long-term but will break setups that relied on defaults being ignored. Audit your launch flags before the 1.0 cut.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-18

## 1. Today's Highlights

Today's most notable merge is the addition of **Kokoro TTS support in mtmd** (b12494), which also introduces a scope-chain key lookup in the Jinja parser and a new `llama_model_meta_arr_str/_n` metadata API — solidifying multimodal/audio as a first-class workload alongside text. On the CUDA side, the implicit GEMM conv2d path is now used for **F32 kernels** (b12493), and **quantized matvec fusion has been disabled on all Pascal GPUs** (b12488) to avoid a regression. Finally, a **few-row MMQ path for `MUL_MAT_ID`** (b12487) targets MoE decode on small token counts, explicitly tuning for DGX Spark.

---

## 2. Releases & Breaking Changes

- **b12489 — server: return HTTP 400 when `grammar` and `ignore_eos` are both set** [#32377](https://github.com/ggml-org/llama.cpp/pull/32377)
  - Sampling previously crashed when both were combined. Now the constraint is enforced in the sampler and the server rejects the request with 400. **Migration:** clients that relied on the silent combination must drop one of the parameters or handle 400s.
- **b12494 — metadata API additions** (`llama_model_meta_arr_str` / `_n`)
  - New API surface for array-valued model metadata; relevant to tooling that inspects GGUF headers directly.
- **b12489 also removes redundant tests** previously exercised by the crash path.

No versioning/tag bumps or ABI breaks reported in this window.

---

## 3. New Model & Hardware Support

- **Kokoro TTS in mtmd (b12494)** [#32413](https://github.com/ggml-org/llama.cpp/pull/32413)
  - Adds text-to-speech via the multimodal pipeline; includes a `tts_dict` for the Kokoro G2P template and range-checking for `value_float_t`.
- **Qwen3-TTS ICL / reference mode (b12491)** [#32438](https://github.com/ggml-org/llama.cpp/pull/32438)
  - Adds voice-cloning style reference mode to Qwen3-TTS; transcription now attaches to the bitmap.
- **OpenCL: A7 Q5_K non-MoE binary kernel (b12492)** [#31002](https://github.com/ggml-org/llama.cpp/pull/31002)
- **OpenCL: A7 DP4A binary GEMM kernels for Q4_0/Q4_K/Q5_K/Q6_K/Q8_0** — open PR [#32510](https://github.com/ggml-org/llama.cpp/pull/32510)
- **Vulkan/i915, Volta, and Qwen3.6 MoE** remain in active bug triage (see Stability).
- **In-flight model support:** VoxCPM2 ([#32443](https://github.com/ggml-org/llama.cpp/pull/32443)), tiny-voca ([#32427](https://github.com/ggml-org/llama.cpp/pull/32427)), GigaChat 3.5 432B-A28B ([#25342](https://github.com/ggml-org/llama.cpp/pull/25342)), Apertus ([#26300](https://github.com/ggml-org/llama.cpp/issues/26300)).

---

## 4. Performance & Optimization

- **CUDA: implicit GEMM conv2d for F32 kernels (b12493)** [#32482](https://github.com/ggml-org/llama.cpp/pull/32482)
  - Previously F32 convolutions fell back to the naive direct path; the fast path was F16-only. This closes a large gap on conv-heavy vision models.
- **CUDA: few-row MMQ for `MUL_MAT_ID` (b12487)** [#32065](https://github.com/ggml-org/llama.cpp/pull/32065)
  - New dispatch order `MMVQ → few-row → MMQ`, tuning for MoE decode. Reported wins starting at 2 tokens on DGX Spark.
- **CUDA: block reductions for whole-row `pool_1d` (b12485)** [#31855](https://github.com/ggml-org/llama.cpp/pull/31855)
- **CUDA: use MMQ for MoE on V100** — open PR [#32504](https://github.com/ggml-org/llama.cpp/pull/32504)
  - Kernel selection did not account for GPUs with FP16 tensor cores but no INT8 tensor cores (i.e., V100); quantized MoE was falling to a slow path.
- **CUDA: support duplicate expert IDs** — open PR [#32505](https://github.com/ggml-org/llama.cpp/pull/32505)
  - Rewrites `mmid` helper with `__popc`/`__ballot` (faster than `__shfl`); notes warp-size-64 AMD needs special handling.
- **CUDA/HIP: native quantized + bf16 KV in `flash_attn_tile`** — open PR [#31234](https://github.com/ggml-org/llama.cpp/pull/31234)
  - Removes the separate dequant pass for q4_0/q4_1/q5_0/q5_1/q8_0/bf16 K/V in flash attention.
- **ggml: `F8_E4M3` decode without `ldexpf` (b12484)** [#32477](https://github.com/ggml-org/llama.cpp/pull/32477)
- **Hybrid tensor/layer multi-GPU prototype** — open PR [#32508](https://github.com/ggml-org/llama.cpp/pull/32508)
  - Author reports roughly **700 → 1500 t/s prefill** on long sequences on their setup. Explicitly marked "not suitable to merge as-is."
- **OpenCL: split `ggml-opencl.cpp`** — open PR [#29354](https://github.com/ggml-org/llama.cpp/pull/29354) (maintainability, not perf).
- **n-cpu-MoE TG improvement** — long-standing open PR [#20596](https://github.com/ggml-org/llama.cpp/pull/20596).

---

## 5. Stability & Regressions

Ranked by severity:

1. **Vulkan FA prefill crash on RDNA3/Windows (`amdvlk64.dll`)** — Issue [#32353](https://github.com/ggml-org/llama.cpp/issues/32353), closed. Flip-direct path from #31323 implicated; affects users on AMD Windows.
2. **Vulkan all-NaN logits on Radeon 680M (RADV Rembrandt)** — Issue [#31509](https://github.com/ggml-org/llama.cpp/issues/31509), open. Disappears with integer dot product disabled; regression observed since b10343.
3. **CUDA MoE on V100 running on slow path** — addressed by open PR [#32504](https://github.com/ggml-org/llama.cpp/pull/32504) (see above).
4. **`--moe-cache-mib` aborts at load on ROCm/HIP (gfx1030, Qwen3.6-35B-A3B)** — Issue [#31675](https://github.com/ggml-org/llama.cpp/issues/31675), closed, cache-size independent.
5. **Vulkan multi-ubatch prompt corruption on i915** — Issue [#32370](https://github.com/ggml-org/llama.cpp/issues/32370), open, rewritten root cause: queued GPU work >20 s corrupts state.
6. **SYCL `rms_norm_f32_sycl` launch failure on Arc Pro B60** — Issue [#30301](https://github.com/ggml-org/llama.cpp/issues/30301), open (`UR_RESULT_ERROR_UNSUPPORTED_FEATURE`).
7. **`/v1/completions` logprobs nondeterministic on SYCL + MoE** — Issue [#31206](https://github.com/ggml-org/llama.cpp/issues/31206), open, 10 comments. Request `seed` does not pin the distribution.
8. **Real-time transcription drops ASR instruction** — Issue [#32493](https://github.com/ggml-org/llama.cpp/issues/32493); **fix PR open** [#32507](https://github.com/ggml-org/llama.cpp/pull/32507) prepends `?intent=transcription`, tested on `gemma-4-E2B-it`.
9. **JSON schema `minLength`/`maxLength` silently dropped when `pattern` present** — Issue [#30749](https://github.com/ggml-org/llama.cpp/issues/30749), closed.
10. **Bare-JSON tool calls (Llama 3.x) skip lazy grammar** — Issue [#32496](https://github.com/ggml-org/llama.cpp/issues/32496); **fix PR open** [#32497](https://github.com/ggml-org/llama.cpp/pull/32497).
11. **Responses API silently drops `namespace`/`web_search` tool types** — Issue [#24295](https://github.com/ggml-org/llama.cpp/issues/24295), open, breaks Codex CLI MCP tools.
12. **Web UI hangs when Chrome default font ≥ 24 px (`effect_update_depth_exceeded`)** — Issue [#32361](https://github.com/ggml-org/llama.cpp/issues/32361), open.
13. **Pascal GPU quantized matvec fusion** — proactively disabled in b12488 [#32239](https://github.com/ggml-org/llama.cpp/pull/32239) to prevent a known regression.
14. **CUDA memory leak with `-sm tensor` on dual Intel B70 SYCL** — Issue [#27845](https://github.com/ggml-org/llama.cpp/issues/27845), closed.
15. **`GGUFReader` tensor offset uint64 overflow** — Issue [#32494](https://github.com/ggml-org/llama.cpp/issues/32494); **fix PR open** [#32495](https://github.com/ggml-org/llama.cpp/pull/32495).
16. **Control-vector generator depth shift** — Issue [#32503](https://github.com/ggml-org/llama.cpp/issues/32503), open; directions measured one block upstream and final-layer residual rejected.

---

## 6. What This Means for Application Developers

- **Audio is now a first-class modality.** With Kokoro TTS (b12494) and Qwen3-TTS ICL mode (b12491) both landing, you can wire speech synthesis directly into the mtmd pipeline. If you're building voice agents, this collapses the previously separate TTS service into the same server process.
- **Validate your request payloads.** The `grammar` + `ignore_eos` combination now returns 400 (b12489). If you generate sampling configs programmatically, add a guard.
- **Tool-calling is the current weak spot.** Two open issues plus an open fix PR ([#32497](https://github.com/ggml-org/llama.cpp/pull/32497)) target grammar-constrained tool calls for Llama 3.x bare-JSON output and the Responses API's dropped namespace/web_search types. If you're shipping agent frameworks on top of llama-server, pin a build and track these.
- **MoE decode on non-INT8-tensor-core GPUs is being actively fixed.** V100 users running quantized MoE should watch [#32504](https://github.com/ggml-org/llama.cpp/pull/32504); today's behavior is a silent fallback to a slow kernel.
- **Quantized KV-cache users gain speed on CUDA/HIP** as native KV dequant in flash attention lands ([#31234](https://github.com/ggml-org/llama.cpp/pull/31234), [#31802](https://github.com/ggml-org/llama.cpp/pull/31802)) — reduces scratch memory and removes a full conversion pass at long context.
- **Schema validation gap:** if your JSON Schemas combine `pattern` with `minLength`/`maxLength`, the length bound is silently ignored ([#30749](https://github.com/ggml-org/llama.cpp/issues/30749), now closed) — re-validate outputs if you relied on it.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-18

## 1. Today's Highlights

No releases landed in the last 24h, but the project saw significant activity across backends and runner infrastructure. Notable in-flight work includes CANN/Ascend NPU build + device discovery ([#19732](https://github.com/ollama/ollama/pull/19732)), a fix for misleading context-length failures on decision models like d1-2B ([#19743](https://github.com/ollama/ollama/pull/19743)), and MLX runner work to persist and adapt conversation caches under memory pressure ([#19745](https://github.com/ollama/ollama/pull/19745), [#19678](https://github.com/ollama/ollama/pull/19678)). On the bug front, a Vulkan RDNA1 performance regression (~13x slower prompt processing) and a `glm-ocr` runaway-generation issue surfaced.

## 2. Releases & Breaking Changes

No new releases in the last 24h. No breaking API or config changes announced today.

## 3. New Model & Hardware Support

- **CANN / Ascend NPU backend (proposal + PR)**: Adds a `ggml-cann` build option and CANN device discovery, passing selected device IDs to `llama-server`. Related to [#5315](https://github.com/ollama/ollama/issues/5315); prior attempt in [#5872](https://github.com/ollama/ollama/pull/5872) was based on an older tree. → [Issue #19735](https://github.com/ollama/ollama/issues/19735) · [PR #19732](https://github.com/ollama/ollama/pull/19732)
- **Intel NPU (OpenVINO) request**: Feature request to expose Intel Core Ultra NPUs as a first-class backend alongside CUDA/ROCm/Metal. Currently closed without merge. → [Issue #19535](https://github.com/ollama/ollama/issues/19535)
- **Intel iGPU Vulkan out-of-box**: PR proposes enabling Vulkan by default for Intel Ultra Series 1+ (MTL+) iGPUs on Windows with driver ≥ 32.0.101.9150 and ≥16 GB RAM, only when no dGPU is present. → [PR #19568](https://github.com/ollama/ollama/pull/19568)
- **PPLX Decider v1.3 on MLX**: Adds Flash and 27B checkpoints with the v4 chunked decision protocol (choice, yes/no, score, image) plus SystemOne Locate request/response. → [PR #19734](https://github.com/ollama/ollama/pull/19734)
- **AMD RX 6750 XT**: Support issue closed without resolution — `HSA_OVERRIDE_GFX_VERSION=gfx1031` still fails to initialize. → [Issue #6003](https://github.com/ollama/ollama/issues/6003)

## 4. Performance & Optimization

- **Streaming buffer allocation**: Current code allocates an 8 MB scanner buffer per streaming API call; PR #19736 grows the buffer on demand while retaining the 8 MB ceiling, with an allocation regression test for small responses. → [PR #19736](https://github.com/ollama/ollama/pull/19736)
- **VRAM accounting / GPU splitting fixes**: Addresses multiple long-standing issues (#19463, #18679, #18349, #16599) where models were evicted, refused to load, or split across GPUs unnecessarily. → [PR #19632](https://github.com/ollama/ollama/pull/19632)
- **Runner reuse across `shift` settings**: `--context-shift` is a launch flag, so clients alternating `shift: false` and default forced a model reload per request. Fix launches with context shift whenever supported and reloads only when necessary. → [PR #19748](https://github.com/ollama/ollama/pull/19748)
- **MLX cache retention**: Saved history moves from a fixed 8 GiB slot-divided allowance to memory-pressure-adaptive retention, reducing prompt reprocessing. → [PR #19678](https://github.com/ollama/ollama/pull/19678) · Prefix reuse across busy slots: [PR #19677](https://github.com/ollama/ollama/pull/19677) (closed, superseded by #19745)

## 5. Stability & Regressions

Ranked by severity:

1. **Vulkan RDNA1 ~13x prompt-processing regression** (open): RX 5700 XT (gfx1010) with `OLLAMA_VULKAN=1` shows ~40 t/s prompt processing vs ~540 t/s on upstream llama.cpp Vulkan; generation ~17% slower. → [Issue #19747](https://github.com/ollama/ollama/issues/19747)
2. **`glm-ocr` never stops generating** on 0.40.15/0.40.16 (closed): EOS handling appears broken for this model. → [Issue #19738](https://github.com/ollama/ollama/issues/19738)
3. **d1-2B multi-image failures** (open, fix PR exists): Launched with `-b 512 -ub 512`; since the model is non-causal (`lfm3.attention.causal = false`), prompts >512 tokens fail with a misleading "context length" error and images are downscaled. Fix sizes `n_ubatch` from `decision.type` metadata. → [Issue #19740](https://github.com/ollama/ollama/issues/19740) · [PR #19743](https://github.com/ollama/ollama/pull/19743)
4. **`tensor blk.0.ssm_beta.weight not found`** (open): 0.40.16.0 with llama.cpp 0.9.0-dev fails to load a custom model that other models load fine. → [Issue #19733](https://github.com/ollama/ollama/issues/19733)
5. **Qwen tool-call XML parse failures** (open): `"qwen tool call parsing failed" — XML syntax error, unexpected EOF` with `qwen3-coder:30b` under Roo Code. Related PR handles JSON arguments written directly inside `<function=...>` (MiMo v2.6 / qwen3.5 parser). → [Issue #14834](https://github.com/ollama/ollama/issues/14834) · [PR #19651](https://github.com/ollama/ollama/pull/19651)
6. **Port bind failure on 11434** (open): `listen tcp 127.0.0.1:11434: bind` — likely a second instance or port conflict; needs more info. → [Issue #19712](https://github.com/ollama/ollama/issues/19712)
7. **GCC 15 build failure** (closed): Missing `#include <cstdint>` in `llama-mmap.h` causes `uint32_t` errors under stricter GCC 15. → [Issue #19714](https://github.com/ollama/ollama/issues/19714)
8. **Parallelism unsupported for qwen35** (closed): `/v1/systemone` with Nimble forces `numParallel=1` despite `OLLAMA_NUM_PARALLEL=8`, serializing all requests. → [Issue #18750](https://github.com/ollama/ollama/issues/18750)
9. **Windows sleep during inference** (open, good first issue): Long-standing request to hold a wake lock while serving. → [Issue #4072](https://github.com/ollama/ollama/issues/4072)

CI stability PRs also landed: speech slow-reader flake ([#19746](https://github.com/ollama/ollama/pull/19746)) and Pi catalog timeout flakes ([#19742](https://github.com/ollama/ollama/pull/19742)).

## 6. What This Means for Application Developers

- **Agent / tool-calling reliability is still fragile.** If you use Qwen-family models for structured tool calls, expect intermittent XML parse failures ([#14834](https://github.com/ollama/ollama/issues/14834)); PR [#19651](https://github.com/ollama/ollama/pull/19651) broadens parser tolerance for JSON-in-`<function>` payloads, which is worth tracking if you serve MiMo or qwen3.5-parsed models.
- **Streaming clients get cheaper.** [#19736](https://github.com/ollama/ollama/pull/19736) eliminates an 8 MB per-call allocation — meaningful if you fan out many small requests from a gateway or proxy.
- **Context-shift toggling no longer forces reloads.** If your client alternates `shift` values, [#19748](https://github.com/ollama/ollama/pull/19748) removes a per-request model reload penalty — a real latency win for chat frontends.
- **Decision-style models (d1-2B) with images**: avoid prompts >512 tokens until [#19743](https://github.com/ollama/ollama/pull/19743) lands; the current failure mode masquerades as a context-length error.
- **AMD RDNA1 users**: do not enable `OLLAMA_VULKAN=1` yet — throughput regresses by ~13x on prompt processing ([#19747](https://github.com/ollama/ollama/issues/19747)).
- **Multi-GPU / VRAM-constrained deployments**: watch [#19632](https://github.com/ollama/ollama/pull/19632); the eviction and unnecessary-split fixes address several long-reported scheduling misbehaviors that affect throughput consistency under load.
- **Ascend NPU shops**: [#19732](https://github.com/ollama/ollama/pull/19732) is the first credible path to running GGUF inference on CANN hardware; expect it to be experimental if merged.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-18

## 1. Today's Highlights

LiteLLM shipped **v1.110.0** and an **v1.111.0-rc.1** release candidate, alongside a new LTS patch (**v1.108.11**) — all Docker images continue to be cosign-signed. The most consequential work today is a large, multi-PR effort to **port the proxy onto a native Rust "gateway" app**, including middleware, routing via `router-core`, and Rust-based auth/DB repositories. Meanwhile, several high-severity streaming/translation bugs (`stream_chunk_builder` crashes, Bedrock/Anthropic `/v1/messages` stream leaks, Redis cache failures) were closed with fixes or remain under active discussion.

## 2. Releases & Breaking Changes

- **[v1.111.0-rc.1](https://github.com/BerriAI/litellm/releases)** — Release candidate; Docker image signature verification via `cosign` is now documented inline in the release notes.
- **[v1.110.0](https://github.com/BerriAI/litellm/releases)** — Stable release; same cosign verification guidance.
- **[v1.108.11 (LTS)](https://github.com/BerriAI/litellm/releases)** — New LTS patch. The `lts` image tag (`ghcr.io/berriai/litellm:lts`) now tracks this line. LTS users should pin to `lts` for the newest patch.
- **Breaking-ish (UI):** [PR #49391](https://github.com/BerriAI/litellm/pull/49391) makes **Projects generally available** and *removes* the `enable_projects_ui` flag entirely (sidebar, Create/Edit Key, Key Info, Projects page no longer gated; Beta badge gone). Configs referencing this flag should drop it.
- **FIPS mode change:** [PR #51429](https://github.com/BerriAI/litellm/pull/51429) switches stored-secret encryption (model keys, credentials, MCP tokens) from XSalsa20-Poly1305 (libsodium) to the FIPS provider's **AES-256-GCM** when `general_settings.fips_mode: true`.

## 3. New Model & Hardware Support

- **Bedrock Converse structured output:** [PR #52419](https://github.com/BerriAI/litellm/pull/52419) now sends `text.format.strict` for OpenAI GPT native structured output on Bedrock Converse (previously the shape was sent without the "strict" switch).
- **Anthropic user-profile-id forwarding:** [PR #51866](https://github.com/BerriAI/litellm/pull/51866) forwards `anthropic-user-profile-id` (mappable from key/team metadata) across Anthropic, Vertex, and Azure paths, enabling per-end-user safety actions.
- **GitHub Copilot diagnostics:** [PR #52352](https://github.com/BerriAI/litellm/pull/52352) adds actionable error messages for Copilot call failures (missing user, unconnected Copilot, wrong GitHub host).
- No new CUDA/ROCm/Metal backend or quantization-format changes landed today.

## 4. Performance & Optimization

- **Response cache key cost:** [Issue #51935](https://github.com/BerriAI/litellm/issues/51935) (closed) — cache keys were built by stringifying the full request (200+ MB image payloads spent *seconds* on the event loop, computed twice per request). Fix rationale: hashing large `messages` reprs is linear in payload size.
- **Streaming memory retention:** [Issue #51936](https://github.com/BerriAI/litellm/issues/51936) (closed) — `FallbackStreamWrapper` was defined *inside* `_acompletion_streaming_iterator` on every streamed call, creating a reference cycle that pinned streamed responses until a full GC.
- **O(n²) credential sync:** [Issue #43922](https://github.com/BerriAI/litellm/issues/43922) (closed) — with `store_model_in_db: true`, credential re-sync was quadratic in credential rows and blocked the event loop **10s+ per reload** (default reload = 30s).
- **Router tokenizer correctness/perf:** [PR #49764](https://github.com/BerriAI/litellm/pull/49764) — pre-call context-window counting now uses each deployment's tokenizer (non-OpenAI deployments were over-counted ~9–14% with gpt-3.5 tokenizer).
- **Rust DB/auth migration in progress:** [PR #52173](https://github.com/BerriAI/litellm/pull/52173) bumps `RUST_RESERVED_CONNECTIONS` 0→2; [PR #52170](https://github.com/BerriAI/litellm/pull/52170) moves user/end-user/budget auth lookups off Prisma onto SQLx-backed Rust stores. This is a structural latency improvement for auth hot paths.

## 5. Stability & Regressions

Ranked by severity:

1. **[Issue #52284](https://github.com/BerriAI/litellm/issues/52284) (CLOSED) — Read-replica connection never self-heals.** With `DATABASE_URL_READ_REPLICA` set, a reconnect cancelled by its 2s timeout leaves the reader Prisma engine permanently dead; all reads (key auth, `/health/readiness`, budget jobs) fail with `httpx.ConnectError` and never fall back to the writer. **No fallback path = read outage.**
2. **[Issue #50905](https://github.com/BerriAI/litellm/issues/50905) (OPEN, 👍6) — Audit logs 500 after `/key/update` or `/team/update`.** `before_value` stored as a JSON *string* since v1.108.0 breaks `GET /audit`. Enterprise audit UI affected.
3. **[Issue #50893](https://github.com/BerriAI/litellm/issues/50893) (OPEN) — `stream_chunk_builder` TypeError.** Providers streaming `reasoning_content` as a *list of structured blocks* crash at end-of-stream.
4. **[Issue #45348](https://github.com/BerriAI/litellm/issues/45348) (OPEN) — Parallel tool-call args dropped on streaming `/v1/messages` (Codex provider).** Every `tool_use` block streams with empty `input`; non-streaming works. Directly impacts agent tool-calling.
5. **[Issue #41067](https://github.com/BerriAI/litellm/issues/41067) (OPEN) — Anthropic streaming loses prompt-cache accounting** when bridged to OpenAI-compatible upstreams. Cost-tracking accuracy regression.
6. **[Issue #51452](https://github.com/BerriAI/litellm/issues/51452) / [#47922](https://github.com/BerriAI/litellm/issues/47922) (OPEN) — `ModelNotMappedError` in `litellm/utils.py`.** Two open reports; no request context captured.
7. **[Issue #52247](https://github.com/BerriAI/litellm/issues/52247) (OPEN) — Proxy startup crash on `SQL_ASCII` Postgres.** `find_blockers` in `migration_data_checks.py` raises `ValueError` during request-log index build (v1.109.1).
8. **[Issue #12448](https://github.com/BerriAI/litellm/issues/12448) (OPEN, 👍5) — Salt-key rotation support requested.** With debug logging enabled, `master_key` and `salt_key` can leak into logs; salt rotation (unlike master-key rotation) is unsupported.
9. **[Issue #36524](https://github.com/BerriAI/litellm/issues/36524) (CLOSED) — Guardrail write-back collapses Anthropic `document` blocks into `image`** (400 for PDFs) on `/v1/messages`.
10. **[Issue #51954](https://github.com/BerriAI/litellm/issues/51954) (CLOSED) — Concatenated JSON tool-call arguments rejected** (`{"path": "/a"}{"path": "/b"}`) before request egress.

**Fix PRs landed/queued:** [PR #52223](https://github.com/BerriAI/litellm/pull/52223) (port admission-control middleware), [PR #52274](https://github.com/BerriAI/litellm/pull/52274) (router-core retries/fallbacks/cooldowns in native gateway), [PR #52352](https://github.com/BerriAI/litellm/pull/52352) (Copilot errors), [PR #43501](https://github.com/BerriAI/litellm/pull/43501) (defensive chunk-field reads), [PR #51457](https://github.com/BerriAI/litellm/pull/51457) (forward OpenAI prompt-cache fields).

## 6. What This Means for Application Developers

- **If you use virtual keys in production:** [#12448](https://github.com/BerriAI/litellm/issues/12448) is worth following — debug logging can expose your `salt_key`/`master_key` in logs, and salt rotation isn't supported yet. Treat debug mode as sensitive and rotate master keys on incident.
- **Agent/tool-calling builders:** avoid relying on **streaming** `/v1/messages` for parallel tool calls against the Codex provider until [#45348](https://github.com/BerriAI/litellm/issues/45348) is fixed — arguments arrive empty. Non-streaming is unaffected. Similarly, [#50893](https://github.com/BerriAI/litellm/issues/50893) can crash your chunk assembler if you consume list-form `reasoning_content`.
- **Cost/billing accuracy:** if you bridge Anthropic `/v1/messages` to an OpenAI-compatible upstream, [#41067](https://github.com/BerriAI/litellm/issues/41067) means prompt-cache accounting is lost in streaming mode — expect inflated spend attribution.
- **LTS users:** move to `ghcr.io/berriai/litellm:lts` for v1.108.11, and check whether your Postgres encoding is `SQL_ASCII` ([#52247](https://github.com/BerriAI/litellm/issues/52247)) before upgrading past v1.109.1.
- **Forward-looking:** the Rust gateway port ([#52173](https://github.com/BerriAI/litellm/pull/52173), [#52170](https://github.com/BerriAI/litellm/pull/52170), [#52274](https://github.com/BerriAI/litellm/pull/52274)) is the headline architecture change — expect auth-path latency improvements and, eventually, native router failover semantics. Test against RC builds if you can absorb churn.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-18

## 1. Today's Highlights

Unsloth shipped **v0.1.919-beta**, headlined by a first-cut **computer use (beta)** feature with MCP integrations for Unity, Unreal Engine, Blender and Roblox, plus a redesigned model picker and new Translate mode. **MiniMax-H3-Image** landed with GGUF/FP8/INT8 quantization and LoRA training support. Meanwhile, a cluster of Studio-side regressions around MCP OAuth token reuse, model loading lag, and GPU reporting surfaced across macOS, Linux and Windows ROCm, several with fix PRs already open.

## 2. Releases & Breaking Changes

- **v0.1.919-beta** — Computer Use (beta), Translate mode, MiniMax-H3-Image support, new model picker. ([release](https://github.com/unslothai/unsloth/releases))
- **MCP OAuth behavior change (in flight):** Studio refreshed tokens at a generic `/token` endpoint rather than the server-advertised token endpoint, causing repeated consent prompts. Fix PR #18203 corrects endpoint discovery; #18171 addresses refresh-token races. ([#18203](https://github.com/unslothai/unsloth/pull/18203), [#18171](https://github.com/unslothai/unsloth/pull/18171), [issue #18164](https://github.com/unslothai/unsloth/issues/18164))
- **Model alias load settings (PR #18217, open):** each alias can now carry its own context length, KV cache type, and speculative decoding mode — enabling two launch configs of the same weights exposed via the API. ([#18217](https://github.com/unslothai/unsloth/pull/18217), related [#17885](https://github.com/unslothai/unsloth/pull/17885))
- **SFT behavior fix on TRL ≥ 1.18 (PR #18230, merged):** Unsloth was silently dropping the MoE router aux loss; logged step-1 loss on gpt-oss shifts from 12.21 → 14.11 (i.e. matches TRL). If you have MoE SFT runs benchmarked against a specific loss value, expect a step change. ([#18230](https://github.com/unslothai/unsloth/pull/18230))
- **Config note:** `UNSLOTH_VAE_ATTN_HALF_MATH=0` is the documented workaround for ROCm VAE decode NaN on v0.1.917+. ([#18016](https://github.com/unslothai/unsloth/issues/18016))

## 3. New Model & Hardware Support

- **MiniMax-H3-Image** — GGUF, FP8, INT8 export paths plus LoRA training. ([release](https://github.com/unslothai/unsloth/releases))
- **Qwen3.8 27B** (local GGUF, llama-server, 64K context, reasoning) — noted in the wild with a hybrid-model prompt reprocessing issue (#17015). ([#17015](https://github.com/unslothai/unsloth/issues/17015))
- **Gemma 4 26B MLX** — vision bug closed today (`<unused6226>` tokens). ([#15473](https://github.com/unslothai/unsloth/issues/15473))
- **Requested / pending:** Zonos3-Mini voice cloning via audio.cpp ([#18234](https://github.com/unslothai/unsloth/issues/18234)); optional native **Strata** engine for MoE streaming/AMD ([#16626](https://github.com/unslothai/unsloth/issues/16626), 👍12).
- **Backend coverage in today's issues:** Apple MLX, CUDA, ROCm (Linux + Windows gfx1151/gfx1151), Wayland/NVIDIA. No new quant formats beyond the H3-Image FP8/INT8 additions.

## 4. Performance & Optimization

- **Prompt reprocessing across turns** with Qwen hybrid models after tool use (issue #17015, open). The `ToolLoopController` deferred-schema prefix-preservation change relates to #165x — worth reading if you run large MCP catalogs with reasoning models. ([#17015](https://github.com/unslothai/unsloth/issues/17015))
- **Search-only MCP listing (PR #18142, open)** — `UNSLOTH_STUDIO_MCP_SEARCH_ONLY=1` keeps the MCP listing stable across chat turns to avoid losing the cached prefix on topic changes. Directly targets the multi-second reprocessing cost. ([#18142](https://github.com/unslothai/unsloth/pull/18142))
- **KV cache invalidation after ~8 computer-use calls** — `MAX_TOTAL_MODEL_IMAGES = 8` in `mcp_images.py` forces cache drops on longer computer-use loops. No fix PR yet; plan around an 8-image ceiling per session. ([#18231](https://github.com/unslothai/unsloth/issues/18231))
- **fast_qk_norm_rope fallback** returns before expanding `position_ids` from `[1, seq_len]` to `[batch, ...]`, producing wrong rows and out-of-bounds reads. Fix likely needed before this path is production-safe. ([#18232](https://github.com/unslothai/unsloth/issues/18232))

## 5. Stability & Regressions

Ranked by severity for production relevance:

1. **ROCm VAE decode NaN on image gen** (v0.1.917+, head dims 384/512, half-math default). Workaround: `UNSLOTH_VAE_ATTN_HALF_MATH=0`. Closed today. ([#18016](https://github.com/unslothai/unsloth/issues/18016))
2. **`fast_qk_norm_rope` broadcast bug** — OOB read + wrong rows in fallback path. Correctness-critical for kernels users. ([#18232](https://github.com/unslothai/unsloth/issues/18232))
3. **Model loading / UI sluggishness after upgrade** — newest build forced a small Gemma E2B instead of the last-used Gemma-4-26B-A4B. Closed. ([#18002](https://github.com/unslothai/unsloth/issues/18002))
4. **Backend crash after llama.cpp update** on Desktop. Closed. ([#17981](https://github.com/unslothai/unsloth/issues/17981))
5. **macOS AMD MLX unified memory misallocation** on Ryzen 8700G / Radeon 780M. Open. ([#18001](https://github.com/unslothai/unsloth/issues/18001))
6. **GPU monitor dead on Windows ROCm** — `gpu_utilization_pct = 0.0`, `temperature_c = null` despite 100% load. Open, no PR. ([#18005](https://github.com/unslothai/unsloth/issues/18005))
7. **Driver regression:** after upgrade to 620.70.06-1 / CUDA 13.5, "unavailable vRAM" and models no longer load onto GPU (RTX 3060, Debian). Open. ([#18218](https://github.com/unslothai/unsloth/issues/18218))
8. **Ollama scanner silently drops newer models** whose legacy manifest includes an OCI manifest-reference layer. Open. ([#18058](https://github.com/unslothai/unsloth/issues/18058))
9. **MCP OAuth consent loop** — PRs #18203 / #18171 open. ([#18164](https://github.com/unslothai/unsloth/issues/18164))
10. **Privacy:** successful retrieval/tool recall logs the first 80 chars of user query at INFO, outside credential masking. Fix PR #18173 open. ([#18173](https://github.com/unslothai/unsloth/pull/18173))

Minor: pinned-chat sync toast + Linux lag ([#18063](https://github.com/unslothai/unsloth/issues/18063)), run-settings slider clipping ([#18126](https://github.com/unslothai/unsloth/issues/18126)), macOS bundle-ID collision between Studio and Desktop launchers ([#18054](https://github.com/unslothai/unsloth/issues/18054)).

## 6. What This Means for Application Developers

- **Computer use is now in beta in Studio.** If you're building agents that see the screen and drive applications, the MCP integrations for Unity/Unreal/Blender/Roblox are the interesting surface — but budget for the **8-image KV cache ceiling** before designing long tool loops, and note Wayland sessions are blocked (X11 only) per #18221.
- **API consumers get per-alias launch configs** once #18217/#17885 land, meaning you can serve one GGUF as two OpenAI-compatible endpoints (e.g. large-context q5_1 KV vs. ngram speculative). This is the right shape for routing workloads by cost/latency.
- **MCP-heavy chats get cheaper** with #18142's search-only listing, which preserves prompt cache prefixes when a catalog is oversized. If you're shipping a Studio-adjacent product, mirror that pattern: keep the tool manifest stable across turns.
- **MoE SFT numbers will move on TRL ≥ 1.18** after #18230 — re-baseline any router-aux-loss-dependent evals and checkpoint comparisons.
- **ROCm users:** set `UNSLOTH_VAE_ATTN_HALF_MATH=0` if you hit NaN at image-gen VAE decode; check the driver regression (#18218) before upgrading to 620.70.06-1.
- **Privacy:** if you're shipping Studio with retrieval, apply the log-redaction fix (#18173) before any diagnostic log leaves the box — the current INFO log leaks ~80 chars of user query per retrieval.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*