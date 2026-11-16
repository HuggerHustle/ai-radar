# AI Infrastructure Digest 2026-11-16

> Generated: 2026-11-16 00:56 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Snapshot date: 2026-11-16**

---

## 1. Ecosystem Overview

The stack is splitting cleanly along maturity lines: serving engines (vLLM, SGLang) are consolidating around a *stability* narrative — vLLM's Rust frontend roadmap and SGLang's explicit "1.0 = no silent config changes" tracker both signal that feature velocity is giving way to compatibility guarantees. Meanwhile, the local-runtime layer (llama.cpp, Ollama) is racing on multimodal breadth — TTS, STT, and vision landed in a single day at llama.cpp — while remaining exposed to per-hardware regressions (V100, HIP, Vulkan, SYCL). The gateway layer (LiteLLM) is quietly rewriting its critical path in Rust (budgets, Bedrock invoke) even as streaming-correctness bugs persist across Anthropic/Responses/Bedrock translation surfaces. Training (Unsloth) had the most consequential *correctness* day: a silent MoE router aux-loss gradient drop under gradient checkpointing, plus FSDP2/DDP hardening — the kind of bug that produces plausible-looking loss curves and undertrained models. Across all six projects, the dominant risk theme is **silent failure**: wrong activations, dropped gradients, collapsed cache hits, and accepted-but-corrupted tool calls, rather than crashes.

---

## 2. Activity Comparison

| Project | Layer | Issues (active/tracked) | PRs (active) | Releases (24h) | Notable status |
|---|---|---|---|---|---|
| **vLLM** | Serving engine | High (many long-context + correctness) | Very high (spec-dec, NVFP4, KV offload) | **None** | Rust frontend experimental; `llguidance` now mandatory (#66345) |
| **SGLang** | Serving engine | 43 | 418 | **None** | 1.0 tracker (#50045); Unified Memory roadmap (#49944) |
| **llama.cpp** | Local runtime | High (HW-specific regressions) | High | **7 builds (b12419–b12428)** | Jinja revert/reland; multimodal surge |
| **Ollama** | Local runtime | Moderate (some high-severity open) | Moderate | **None** | VRAM accounting fix in flight (#19632) |
| **LiteLLM** | Gateway | High (streaming correctness) | Moderate–high | **v1.111.0-dev.4** | Keyless Sigstore signing (breaking for CI) |
| **Unsloth** | Fine-tuning | Moderate | **Very high** (maintainer PR wave) | **None** | Silent MoE grad bug fixed (#17873) |

**Read:** SGLang shows the highest raw PR volume (418); llama.cpp is the only project shipping releases today; Unsloth's PR density reflects a concentrated correctness push rather than feature expansion.

---

## 3. Model Support Race

| Model / Arch | vLLM | SGLang | llama.cpp | Ollama | LiteLLM | Unsloth |
|---|---|---|---|---|---|---|
| **GLM-5.3 / Flash** | ✅ KDA via FlashInfer (#63544), Hopper decode (#67536) | ⚠️ Chat template fix requested (#50408) | — | — | — | — |
| **Kimi-K3.1-Pro** | ✅ MI355X recipe (#67817) | ⚠️ mxfp4 activation bug (#45755, closed) | — | — | — | — |
| **MiniMax-M3.1** | ✅ B200/B300 decode (#65483) | — | ✅ mainline (#32301) | — | — | — |
| **DeepSeek-V4.1** | ✅ ROCm MegaMoE (#67584) | ✅ Ascend NPU cookbook | ⚠️ Vulkan `-fa 1` bug | — | — | ✅ training fixes (#17881) |
| **Qwen3.8-Flash-Next** | ✅ (TP parity) | — | — | — | — | ✅ SFT packing (#17827) |
| **Zonos3-mini TTS** | — | — | ✅ (#32020) | — | — | — |
| **Higgs v3 / VibeVoice-ASR** | — | — | ✅ (#32329) | — | — | — |
| **Gemma 4 vision** | — | — | — | ⚠️ Windows broken (#16532) | — | ✅ decode graphs (#17871) |
| **Vertex Meta Muse** | — | — | — | — | ✅ (#50768) | — |
| **AxForge** | — | — | — | — | ✅ (#51865) | — |

**Who's ahead:**
- **Serving engines:** vLLM leads decisively on frontier-LLM *performance* support (GLM-5.3, Kimi-K3.1, MiniMax-M3.1 specialized decode paths). SGLang lags on model-specific kernels but is ahead on **hardware diversity** (Ascend NPU, gfx1250, gfx942 EAGLE).
- **Local runtime:** llama.cpp is the clear winner on **multimodal breadth** — it shipped TTS + STT + ASR + vision in 24h, and is the only project adding new modality classes.
- **Gateway:** LiteLLM is expanding the *provider matrix* (Vertex Muse, AxForge) rather than model architectures.
- **Training:** Unsloth leads on DeepSeek-V4.1 and Qwen3.8-Flash-Next trainability, but its **inference-side regression** (UD 3.1 GGUFs + mismatched MTP heads, acceptance 74%→56–66%, #17402) is the standout open item.

---

## 4. Performance Frontier

| Optimization axis | Where the effort is concentrated |
|---|---|
| **KV cache & memory tiering** | vLLM: KV-offload DMA thresholds (#57555), encoder-cache events (#67030). SGLang: **Unified Memory roadmap** collapsing full-attn KV + SWA + recurrent state into one arena (#49944); HiCache/Mamba host pooling (#45400, #47867). Ollama: context-shift RoPE drift (#19680). |
| **Speculative decoding** | vLLM: top-k/top-p cutoffs at logits load (#66534), K0 spec-window release (#66169). SGLang: EAGLE on gfx942 (#49883). llama.cpp: HIP draft-MTP prefill collapse (~80%, #31495). Unsloth: **MTP head mismatch regression** (#17402). |
| **Quantization** | vLLM: NVFP4 validation, ModelOpt 52 GiB RAM bug (#46268), GLM-5.3 online quant (#64373), MXFP4 CPU fallback (#61346). |
| **Kernels** | llama.cpp: SYCL fast-division (#32213), Grouped XMX GEMM (#31428), HIP stream_k (#30022), OpenCL FA kernel (#32302). vLLM: FlashInfer MoE workspace reuse (#62948). SGLang: `fast_topk` overflow fix (#38144). |
| **Distributed / disaggregated serving** | SGLang: PD-disaggregation correctness (#39846, #39764, #50547), gfx1250 custom all-reduce (#50660). vLLM: ROCm DP-group routing (#67584). |
| **Tokenizer / TTFT floor** | SGLang: `toktier` chunk-parallel backend (#44374) — **the clearest TTFT signal today** (100K-token Qwen3-8B turn still pays single-core CPU cost). |
| **Gateway hot path** | LiteLLM: Rust budget engine (#51535), priority queueing on 429/529 (#51892), cache-key double-stringify regression (#51935). |
| **Training step time** | Unsloth: block-compile recompile storm (#17864), vision mask-divergence stalls (#17880), GKD teacher placement (#17876). |

**Takeaway:** Serving engines are optimizing *down the memory hierarchy* (KV offload → host tier → unified arena), while local runtimes are still fighting *kernel-level and hardware-specific* wins. The gateway's frontier is *admission control*, not inference.

---

## 5. Layer Positioning

```
┌─────────────────────────────────────────────────────────────────┐
│  GATEWAY / CONTROL PLANE      LiteLLM                            │
│  routing, budgets, provider normalization, spend, auth           │
├─────────────────────────────────────────────────────────────────┤
│  SERVING ENGINES              vLLM        SGLang                 │
│  high-throughput GPU serving, PD-disagg, KV/prefix cache,        │
│  spec decode, multi-tenant production                            │
├─────────────────────────────────────────────────────────────────┤
│  LOCAL RUNTIME                llama.cpp   Ollama                 │
│  single-node / edge, GGUF, multimodal, hardware breadth,         │
│  developer ergonomics                                            │
├─────────────────────────────────────────────────────────────────┤
│  TRAINING / FINE-TUNING       Unsloth                            │
│  LoRA/QLoRA, GRPO, FSDP2/DDP, quantization-aware training        │
└─────────────────────────────────────────────────────────────────┘
```

- **vLLM vs SGLang** — Direct competitors, diverging on strategy: vLLM pursues frontier-model kernels + a Rust frontend; SGLang pursues a stability contract (1.0) and unified memory. Both are targeting the same production deployment.
- **llama.cpp vs Ollama** — llama.cpp is the *engine* (breadth, kernels, multimodal); Ollama is the *productized runtime* (model management, OpenAI-compatible API, VRAM heuristics). Ollama's issues (reranking #3368, tool-call parser #19705) are product-layer; llama.cpp's are engine-layer.
- **LiteLLM** — Sits above all of them; its correctness bugs (streaming usage undercount, reasoning-model mis-encoding) propagate to every downstream app regardless of which engine serves the request.
- **Unsloth** — Orthogonal: it produces the artifacts (GGUFs, adapters) that the runtime and serving layers consume. The MTP head mismatch (#17402) is a **cross-layer** bug — a training-side artifact regression that surfaces as an inference-side throughput loss.

---

## 6. Trend Signals

### Signal 1 — "Silent failure" is the dominant risk class
- Unsloth: MoE router aux-loss gradient dropped with no error (#17873) — *loss curve looked normal*.
- SGLang: Kimi-K3 mxfp4 silently computed GPT-OSS SwiGLU instead of SiTU (#45755).
- vLLM: glm47 tool parser silently drops calls with unknown function names (#67684).
- llama.cpp: Vulkan all-NaN logits (#31509), control vectors diverging via KV (#32341).
- Ollama: Qwen tool-call argument corruption depending on stream chunking (#19705).

**Implication:** Validation must be *output-aware*, not status-code-aware. Teams should build client-side semantic checks (tool-call shape, logit sanity, cache-hit assertions) rather than trusting 200 responses.

### Signal 2 — Rust is entering the critical path of the control plane
- vLLM: Rust frontend (`VLLM_USE_RUST_FRONTEND=1`, experimental, #44280).
- SGLang: Rust server + sgl-router (#48170, #50151).
- LiteLLM: `callbacks-budgets` crate, Rust-only Bedrock invoke (#51330, #51535).

**Implication:** Expect a bifurcation where the *data plane* stays Python (for kernel ecosystem) and the *control plane* migrates to Rust for latency and safety. Budget/auth/signing logic will be the first to move.

### Signal 3 — Long-context + MoE + hybrid state is a fragile combination
- vLLM: Kimi-K3 NaN-logit poisoning after ~240K prefill persists across requests (#51039).
- SGLang: HiCache host hits collapse to zero on hybrid GDN after ~3 long prefixes (#45400).
- vLLM: Long-prefill decode starvation on GB10 (#62574); `--prefix-match-unit` costs ~30ms TTFT (#67674).

**Implication:** Isolate long-context traffic to dedicated replicas; do not co-locate with latency-sensitive short-context traffic. Measure host-tier cache hit rates under *multi-prefix* load, not single-prefix tests.

### Signal 4 — Multimodal local serving is becoming real
llama.cpp shipped TTS (Zonos3-mini), STT (Higgs v3, VibeVoice-ASR), and ASR in one day; Fish S2 and Inkling 1 are in review. A full audio loop (STT → LLM → TTS) is now plausible in a single `llama-server` process.

**Implication:** Voice-agent developers can prototype entirely local. But watch Ollama's Windows Gemma 4 vision bug (#16532) and Unsloth's diffusion-tool-call immaturity (#17815) — vision/tool integration is not production-ready on all runtimes.

### Signal 5 — Signing and supply-chain policy is a migration event
LiteLLM moved to keyless Sigstore signing (#v1.111.0-dev.3+), breaking `cosign verify --key`. Ollama decoupled MLX-C/XGrammar for packagers (#19688). SGLang bumped `pulldown-cmark` for a RUSTSEC advisory.

**Implication:** CI/CD verification pipelines are a *breaking-change surface* as much as APIs. Treat signing policy changes as upgrade blockers and audit before adopting new minor versions.

### Signal 6 — Budget/admission control is not yet a hard guarantee
LiteLLM: `max_budget_per_session` can be exceeded under concurrency (#34732); spend-log batches drop (#33873); streaming usage undercounted (#36114).

**Implication:** If you have financial or quota guarantees, enforce them at *your* gateway layer, not LiteLLM's. The Rust budget engine (#51535) is intended to close this gap — track it, but don't assume it's shipped.

---

### What Agent & Application Developers Should Watch

| Priority | Action |
|---|---|
| 🔴 **Now** | Pin draft heads to quant version (Unsloth #17402); add tool-call validation (vLLM #67684, Ollama #19705); isolate long-context replicas (vLLM #51039, SGLang #45400). |
| 🟠 **This sprint** | Audit LiteLLM `/v1/messages` path for reasoning models (#32357); benchmark `toktier` if re-sending full history (SGLang #44374); verify Sigstore CI migration before adopting v1.111.0+. |
| 🟡 **Track** | SGLang 1.0 config-breaking changes (#50045); Unified Memory roadmap (#49944); vLLM Rust frontend parity (#44280); LiteLLM Rust budget engine (#51535). |
| 🟢 **Awareness** | Multimodal local serving (llama.cpp TTS/STT); reranking outside Ollama core (#3368, #19706); hardware-specific regressions (V100 #32245, Vulkan #31480/#31509, SYCL #27198). |

**Bottom line:** The ecosystem is healthy on *features* and fragile on *silent correctness*. The next 6–12 months will be defined by who ships stability contracts (SGLang 1.0, vLLM Rust parity) and who closes the silent-failure gap first. Application developers should assume every layer has at least one open silent-failure bug and instrument accordingly.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-16

## 1. Today's Highlights

No releases landed in the last 24h, but activity is heavy across the Rust frontend roadmap (#44280, 61 comments), AMD MI355X performance work for Qwen3.8 and Kimi-K3.1-Pro (#57149, #67817), and a growing cluster of long-context / prefill-decode interleaving issues (#62574, #57413, #67674). Speculative decoding, NVFP4 quantization validation, and KV-offload tiering continued to dominate PR traffic. Two new correctness bugs in tool-call parsing (#67684) and MoE kernel selection (#67575) are worth immediate attention for production deployments.

## 2. Releases & Breaking Changes

No new releases in the last 24h.

**Notable config/behavior changes in flight (not yet merged or shipped):**

- **Encoder cache events (PR #67030)** — Adds `--ec-events-config` (`ECEventsConfig`) so routers can subscribe to encoder-output cache events, mirroring KV cache events. Relevant if you build cache-aware orchestration. [PR #67030](https://github.com/vllm-project/vllm/pull/67030)
- **Conditional log prefixing (PR #28582)** — Long-running PR now proposing explicit `--log-prefix` / `--no-log-prefix` CLI flags instead of an env var. [PR #28582](https://github.com/vllm-project/vllm/pull/28582)
- **`llguidance` made unconditional** — Issue #66345 reports `vllm==0.33.0` now hard-requires `llguidance<1.8.0,>=1.7.0` on all x86_64/arm64/aarch64/ppc64le/s390x builds, breaking install and import on glibc < 2.31 hosts (e.g. RHEL 7/8-era, CentOS Stream 8). No fix PR linked yet. [Issue #66345](https://github.com/vllm-project/vllm/issues/66345)
- **Rust frontend feature parity tracking** — `VLLM_USE_RUST_FRONTEND=1` is live but explicitly experimental; gaps are being tracked roadmap-style. Do not assume parity with the Python API server for production use yet. [Issue #44280](https://github.com/vllm-project/vllm/issues/44280)

## 3. New Model & Hardware Support

- **NVIDIA Nemotron 3.5 ASR Streaming (`nemotron-3.5-asr-streaming-0.6b`)** — Feature request for 600M multilingual streaming ASR, OpenMDW-1.1 license. [Issue #47455](https://github.com/vllm-project/vllm/issues/47455)
- **GLM-5.3-Flash on SM120 (RTX PRO 6000, TP=2)** — Community production report at 1M context with MTP k=3; gaps to a fully maintained main-base config are cataloged. [Issue #66218](https://github.com/vllm-project/vllm/issues/66218)
- **GLM-5.3-Flash KDA via FlashInfer (PR #63544)** — Moves KDA layers (fused single-token decode, packed multi-token decode for draft-verify, optional CuTe DSL chunked prefill) onto FlashInfer kernels. [PR #63544](https://github.com/vllm-project/vllm/pull/63544)
- **GLM-5.3 online quant reaching BF16 attention projections (PR #64373)** — Fixes silent skip of KDA/MLA/DSA indexer projections under `--quantization-config`. [PR #64373](https://github.com/vllm-project/vllm/pull/64373)
- **Kimi-K3.1-Pro MI355X recipe (PR #67817, closed)** — Aligns `mi355x_agentx` TP8 preset with `kimi-k31-5c14fe8` image and sets `VLLM_K3_SP_PREFILL`. [PR #67817](https://github.com/vllm-project/vllm/pull/67817)
- **CPU: BF16 fallback for MXFP4 MoE without AMX (PR #61346)** — Auto-selects portable CPU expert path when AMX is unavailable. [PR #61346](https://github.com/vllm-project/vllm/pull/61346)
- **XPU: per-expert offload by routing rank (PR #66369)** — New `--cpu-offload-expert-rankings <file>` for int4 GPTQ MoE on Intel GPUs. [PR #66369](https://github.com/vllm-project/vllm/pull/66369)

## 4. Performance & Optimization

- **FlashInfer TRT-LLM MoE workspace reuse (PR #62948)** — Caches caller-owned scratch across sequential layers and smaller batches (sized to max row count), gated by `VLLM_FLASHINFER_MOE_USE_WORKSPACE`. [PR #62948](https://github.com/vllm-project/vllm/pull/62948)
- **Spec-decode verification: top-k / top-p cutoffs applied on target logits load (PR #66534)** — Stacked on #65102; targets reduced verification cost by masking at load time. [PR #66534](https://github.com/vllm-project/vllm/pull/66534)
- **GLM-5.3-Flash Hopper specialized decode (PR #67536)** — H200 TP4, MTP5, `hopper/` stage kernels chosen per token count via a Hopper policy; opt-in via `decode_backend` additional config. [PR #67536](https://github.com/vllm-project/vllm/pull/67536)
- **MiniMax-M3.1-Flash specialized decode on B200/B300 (PR #65483)** — Off by default; `{"decode_backend": "latency_specialized"}`. [PR #65483](https://github.com/vllm-project/vllm/pull/65483)
- **Hybrid mamba spec-window slot release (PR #66169)** — Releases K0 spec windows at high batch counts for hybrid mamba+attention models running MTP. [PR #66169](https://github.com/vllm-project/vllm/pull/66169)
- **ROCm DeepSeek-V4 MegaMoE route selection (PR #67584)** — AITER path now picks small/large/staged routes per call from DP-group max rows instead of always staged. [PR #67584](https://github.com/vllm-project/vllm/pull/67584)
- **KV offload DMA/Triton threshold needs retuning** — Constants in `swap_blocks_triton.py` were tuned on an H100 PCIe Gen5 (`THRESHOLD_BYTES = 28 * 1...`); per-device profiling requested. [Issue #57555](https://github.com/vllm-project/vllm/issues/57555)
- **`--prefix-match-unit` on Triton/FLA GDN backend** — Recovers hybrid-model prefix hits but costs ~30 ms TTFT on nearly every request (measured on L40, Qwen3.5-4B, replayed agent traces). [Issue #67674](https://github.com/vllm-project/vllm/issues/67674)
- **Long-prefill decode starvation** — Still reproducible on 2× DGX Spark GB10 even with prefill/decode interleaving; a 4×98k-prefill OOM boundary was also mapped. [Issue #62574](https://github.com/vllm-project/vllm/issues/62574)

## 5. Stability & Regressions

Ranked by severity:

1. **Kimi-K3 long-context degeneration (Issue #51039)** — After a ~240K-token prefill (well within the 1M spec), *all* subsequent requests return a repeated degenerate token with NaN logits. Suspected packed KDA prefill. Production-impacting for long-context deployments; no fix PR linked. [Issue #51039](https://github.com/vllm-project/vllm/issues/51039)
2. **ModelOpt NVFP4 checkpoint forces ~52 GiB CPU RAM allocation (Issue #46268)** — OOMs 64GB hosts even for a 0.8B model, on RTX PRO 6000 Blackwell / 62 GiB RAM. Reproducible. [Issue #46268](https://github.com/vllm-project/vllm/issues/46268)
3. **flashinfer_cutlass MoE `cudaErrorIllegalAddress` at startup with `--data-parallel-size 2` (EP16) (Issue #67575)** — Fine at dp=1 and with `moe-backend auto`; nightly wheel `0.34.0rc1.dev378`, 16× RTX 6000D SM120. Workaround: avoid explicit `flashinfer_cutlass` backend. [Issue #67575](https://github.com/vllm-project/vllm/issues/67575)
4. **glm47 tool parser silently drops tool calls with unknown function names (Issue #67684)** — Returns empty responses, trapping clients in retry loops. No fix PR linked. [Issue #67684](https://github.com/vllm-project/vllm/issues/67684)
5. **DelegatingParser ignores `model_output_token_ids` (Issue #64326)** — Markers written as plain text become spurious tool calls or terminate reasoning (non-streaming); reproduced on CPU with `glm45` reasoning + `glm47` tool parsers. [Issue #64326](https://github.com/vllm-project/vllm/issues/64326)
6. **GDN Triton/FLA prefill non-determinism on Hopper H20 (Issue #65385)** — `chunk_scaled_dot_kkt_fwd` autotune configs with `BK < K` and `num_warps >= 4` produce wrong, non-deterministic results under Triton 3.6. [Issue #65385](https://github.com/vllm-project/vllm/issues/65385)
7. **Async MTP align mode reads accepted counts from mutable InputBatch rows (Issue #51571)** — mrv1-only; source audit done, runtime repro pending. [Issue #51571](https://github.com/vllm-project/vllm/issues/51571)
8. **ROCm SR-IOV: multiple vLLM processes on one MI300X hang (Issue #62588)** — Queue head dispatch accepted, no waves, GFX at 100%. gfx942, ROCm 10.1 host stack. [Issue #62588](https://github.com/vllm-project/vllm/issues/62588)
9. **Qwen2.5-0.5B CUDA illegal memory access during init warmup (Issue #66244)** — Closed as of 2026-11-15. [Issue #66244](https://github.com/vllm-project/vllm/issues/66244)
10. **NVIDIA nightly CI failures (Issue #67307)** — Tracks failures across builds #102057 → #102861; a CPU-offload latency-test alignment PR (#67761) references this tracker. [Issue #67307](https://github.com/vllm-project/vllm/issues/67307)

## 6. What This Means for Application Developers

- **Tool-calling is not yet safe to trust blindly.** Two open bugs (#67684, #64326) cause silently dropped or spuriously injected tool calls for GLM-5.3 Flash deployments. Add client-side validation: if a tool call is expected but the response is empty or the function name is unknown, fail loudly rather than retrying.
- **Long-context (≥200K) MoE on some kernels is risky.** #51039's NaN-logit poisoning persists across subsequent requests — a single bad long prompt can take down an instance. Isolate long-context traffic to dedicated replicas until fixed.
- **KV offload tuning is still device-specific.** If you use KV offload/prefix caching across tiers, review #66782 (request-level KV promotions with pin-until-load semantics, RFC in progress) and #57555 (per-device DMA thresholds). Expect configuration drift between H100, MI300X, and newer parts.
- **Spec decode + hybrid mamba is maturing but opt-in.** If you run MTP or hybrid state models, monitor PR #66169 for the K0 slot-release fix; until then, high-batch MTP can waste KV budget.
- **Rust frontend is not production-ready.** Track #44280 if you are considering moving off the Python API server, but budget for missing features and no stability guarantees yet.
- **Install footprint changed.** If you build on glibc < 2.31 or minimal container images, verify `vllm==0.33.0` imports cleanly before upgrading — `llguidance` is now mandatory on supported architectures (#66345).
- **GLM-5.3 and MiniMax-M3.1 Flash users**: watch the FlashInfer KDA PR (#63544) and the Hopper/B200/B300 specialized decode PRs (#67536, #65483) — these are the paths to meaningful TTFT and decode throughput gains on the current model generation.

*Data source: [github.com/vllm-project/vllm](https://github.com/vllm-project/vllm) — snapshot 2026-11-16.*

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-16

## 1. Today's Highlights

The highest-signal item today is the newly opened **SGLang 1.0 Release Tracker** ([#50045](https://github.com/sgl-project/sglang/issues/50045)), which frames 1.0 as a *stability* release: silent config changes become hard errors, and a 1.x compatibility policy will be defined. Alongside it, the **Unified Memory Roadmap** ([#49944](https://github.com/sgl-project/sglang/issues/49944)) proposes collapsing full-attention KV, sliding-window KV, and recurrent state into a single dynamically-sized GPU arena — a structural change to memory management. No new releases shipped in the last 24h; issue volume (43) and PR volume (418) remain high, with most activity on AMD/ROCm kernels, HiCache/Mamba host pooling, and PD-disaggregation correctness.

## 2. Releases & Breaking Changes

No releases in the last 24h. However, breaking-change direction is being set:

- **[roadmap] SGLang 1.0 Release Tracker** ([#50045](https://github.com/sgl-project/sglang/issues/50045)) — Explicitly states "silent configuration changes" will be replaced with errors that name the offending setting, and that upgrading from 0.5.x may require changes. An "Upgrade notes" section is referenced but not yet detailed. If you pin SGLang versions in production, start tracking this issue now — configs that currently no-op or are silently coerced are the likely breakage surface.
- **sgl-router security dependency bump** ([#48170](https://github.com/sgl-project/sglang/pull/48170), closed) — `pulldown-cmark` bumped to 0.13.6 for RUSTSEC-2026-0433. Relevant if you build the Rust router from source.

## 3. New Model & Hardware Support

- **GLM-5.3 / GLM-5.3-Flash chat template** ([#50408](https://github.com/sgl-project/sglang/issues/50408)) — Request to stop encoding message content as ordinary text in the built-in template for these models. Feature request, not yet landed; if you serve GLM-5.3 today, check whether tool/role content is being flattened.
- **AMD gfx1250 custom all-reduce** ([#50660](https://github.com/sgl-project/sglang/pull/50660), [#50656](https://github.com/sgl-project/sglang/pull/50656)) — New `hier_ring_simple` ring all-reduce exploiting partition-pair topology on gfx1250; plus retuning of `carv2` and removal of a thread-count clamp. Both open.
- **AMD gfx942 EAGLE** ([#49883](https://github.com/sgl-project/sglang/pull/49883)) — EAGLE target verify moves to `unified_attention` by default on gfx942. Open.
- **Ascend NPU cookbook** ([#49167](https://github.com/sgl-project/sglang/pull/49167)) — DeepSeek-V3.2 PD-disaggregated (1P1D) deployment docs for Ascend A3, prefill and decode each spanning two servers. Documentation only.
- **Opt-in `toktier` tokenizer backend** ([#44374](https://github.com/sgl-project/sglang/issues/44374)) — Exact incremental and chunk-parallel CPU tokenization, with a worker pool ([#44382](https://github.com/sgl-project/sglang/pull/44382), closed). Not a model but a backend that changes tokenization semantics — see §4.

## 4. Performance & Optimization

- **Parallel prompt encoding extended** ([#44392](https://github.com/sgl-project/sglang/pull/44392), closed) — `parallel_prompt_encode` now cuts rendered prompts at added-token boundaries inside a message for Qwen2/Qwen3, gpt-oss, and DeepSeek-V3, not just GLM/Llama-3. This matters for agentic workloads where a single message dominates the prompt. Closed (merged or superseded — verify).
- **Tokenization as a TTFT bottleneck** ([#44373](https://github.com/sgl-project/sglang/pull/44373), [#44382](https://github.com/sgl-project/sglang/pull/44382)) — Concrete data point: on v0.5.19, a Qwen3-8B chat turn with a 100K-token cached prefix still spends meaningful TTFT on single-core CPU encoding, because the radix cache helps the model but not the tokenizer. The `toktier` backend addresses this via chunk-parallel encode and a worker pool. **If your agents re-send full history every turn, this is your TTFT floor.**
- **ROCm decode/verify without host `seq_lens`** ([#50665](https://github.com/sgl-project/sglang/pull/50665)) — Removes a host sync (`Event.wait()`, described as a "Temporary workaround" that regressed TPOT on MI355) before resolving spec-v2 decode/verify `seq_lens`. Direct TPOT improvement on AMD.
- **Diffusion serving profiling** ([#50658](https://github.com/sgl-project/sglang/pull/50658)) — `bench_serving --profile` now starts/stops profiling across HTTP process and GPU workers with host and per-rank traces. Tooling, but useful for diffusion latency work.
- **TeaCache coefficient calibration** ([#36767](https://github.com/sgl-project/sglang/pull/36767)) — Adds the missing tool to generate polynomial coefficients, unblocking TeaCache for models that don't ship hand-copied upstream values.
- **`fast_topk` threshold-bin overflow fix** ([#38144](https://github.com/sgl-project/sglang/pull/38144)) — `radix_select_topk` assumed ≤SMEM_INPUT_SIZE candidates per threshold bin; observed 16K and 34K candidates at long context. Correctness fix with perf implications.
- **Crash recorder memory/lock bounds** ([#50151](https://github.com/sgl-project/sglang/pull/50151)) — Rust server: stops copying `partial_out` for every in-flight request while holding the state lock.

## 5. Stability & Regressions

Ranked by severity:

1. **[OPEN] HiCache on hybrid GDN: host-tier hits drop to zero** ([#45400](https://github.com/sgl-project/sglang/issues/45400), 👍5) — Once the evicted working set exceeds ~3 long prefixes, the host Mamba pool is exhausted while KV stays on host, so host hits collapse. Silent cache-performance cliff on hybrid Mamba/GDN models; high impact for long-context serving with `--hicache-*`. 5 upvotes suggests broad reproduction. No linked fix.
2. **[CLOSED] GLM-5.2 FP4 + EAGLE illegal memory access** ([#30209](https://github.com/sgl-project/sglang/issues/30209)) — `flashinfer_trtllm` bf16 batched-GEMM in the nextn draft MoE crashes on B200/B300 with NVFP4 + EAGLE. Closed as inactive. Note the related detail: triton nextn default is HIP-gated after #30137 — check whether this affects your path.
3. **[OPEN] CUDA Coredump Tracker** ([#26340](https://github.com/sgl-project/sglang/issues/26340), 368 comments) — Auto-collected CI coredumps, still the loudest thread in the repo. Not a single bug, but the aggregate signal is worth watching if you track CUDA stability.
4. **[OPEN] Responses API: replayed Codex turn split into three assistant blocks** ([#42110](https://github.com/sgl-project/sglang/issues/42110)) — The `_merge_consecutive_assistant_messages` phase check causes the model to learn to end its turn *before* the tool call. This is a subtle training/serving-semantics bug with real consequences for agent reliability on the Responses API. Open.
5. **[CLOSED] v0.5.10 2×H100 GLM-5 health check failure** ([#22511](https://github.com/sgl-project/sglang/issues/22511), 👍4) — "server could not get a response from detokenizer for last 20 seconds." Closed/inactive; historically high-priority. Detokenizer liveness remains a recurring theme (see also #39689 below).
6. **[CLOSED] Kimi-K3 `flashinfer_mxfp4` silently computes GPT-OSS SwiGLU instead of SiTU** ([#45755](https://github.com/sgl-project/sglang/issues/45755)) — Silent wrong-activation, not a crash. Closed, but depends on an upstream flashinfer issue still open — verify whether your build is affected.
7. **[CLOSED] Unauthenticated `PUT /route` on Bootstrap HTTP** ([#39400](https://github.com/sgl-project/sglang/issues/39400)) — Route poisoning / metadata redirection. Closed as inactive — **if you run the bootstrap HTTP endpoint, confirm your deployment isn't exposing it**, since "inactive" does not necessarily mean "fixed."
8. **[CLOSED] PD + NIXL: receiver declares transfer complete after first component** ([#39846](https://github.com/sgl-project/sglang/issues/39846)) — Multi-component state transfer race. Closed/inactive.
9. **[OPEN] `pd`: decode should compute prompt tail and sample first token** ([#50547](https://github.com/sgl-project/sglang/issues/50547)) — RFC, but it highlights a real constraint: in PD mode decode never runs a forward over the prompt, so prefill must hand over the first token, its logprobs, draft proposals, and hidden states.
10. **[OPEN] Unbounded `chunk_idx` in PD staging → decode OOM** ([#39764](https://github.com/sgl-project/sglang/issues/39764)) — Closed/inactive, but the class of bug (unbounded metadata growth in the disaggregation path) recurs.
11. **[CLOSED] Cold TokenizerWorker hang on pause/continue** ([#39689](https://github.com/sgl-project/sglang/issues/39689)) — Uninitialized receive loop. Closed/inactive.
12. **[CLOSED] Qwen4-Exp DFLASH crash in decode CUDA-graph capture** ([#39685](https://github.com/sgl-project/sglang/issues/39685)) — `too many values to unpack`, fix is the Qwen4-Exp capture guard in #38642. Verify that guard is in your build.
13. **[CLOSED] Session traffic trips "pool memory leak detected"** ([#39838](https://github.com/sgl-project/sglang/issues/39838)) — Scheduler crash under streaming/tree sessions with aborts and `/close_session`, lease pool OFF. Closed/inactive.
14. **[OPEN] CI failure tracker: PR Test (AMD)** ([#45847](https://github.com/sgl-project/sglang/issues/45847)) — Active failure in `test_torch_compile_moe.py::TestTorchCompileMoe.setUpClass` on HIP stream. If you build on ROCm, expect CI noise.

**CI health snapshot** ([#17050](https://github.com/sgl-project/sglang/issues/17050)): as of 2026-11-16 00:54 UTC — **0 broken, 11 flaky, 911 recently fixed**. The flaky count is worth noting for anyone gating releases on CI.

## 6. What This Means for Application Developers

- **Two structural changes are coming, both aimed at you.** SGLang 1.0 ([#50045](https://github.com/sgl-project/sglang/issues/50045)) will start *erroring* on configs it currently accepts silently. Audit your launch flags and config files against the eventual upgrade notes before you're forced to. Unified Memory ([#49944](https://github.com/sgl-project/sglang/issues/49944)) promises to end fixed KV/state partitioning — good for mixed workloads, but it changes memory-capacity planning and OOM behavior.
- **Tokenizer is your hidden TTFT tax on multi-turn agents.** The 100K-token Qwen3-8B data point in [#44373](https://github.com/sgl-project/sglang/pull/44373) is the clearest number today: radix caching helps the model, not the tokenizer. If you re-send full history every turn, benchmark `toktier` in staging and consider prompt-structure changes (fewer, larger messages) as a stopgap.
- **Long-context + hybrid Mamba/GDN + HiCache is a fragile combination right now.** [#45400](https://github.com/sgl-project/sglang/issues/45400) shows host-tier hits silently collapsing after a few long prefixes due to Mamba pool exhaustion. If you run long-context serving on Qwen3.5/GDN-class models with `--hicache-*`, measure host hit rates under realistic multi-prefix load, not single-prefix tests. The proposed `--hicache-mamba-size-gb` flag ([#47867](https://github.com/sgl-project/sglang/pull/47867), open) is the intended remedy — track it.
- **Audit your Responses API path if you serve coding agents.** [#42110](https://github.com/sgl-project/sglang/issues/42110) causes replayed Codex turns to split into multiple assistant blocks, teaching the model to terminate before tool calls. This is the kind of bug that looks like a model-quality problem but is a serving bug. Verify against your own tool-call traces.
- **Verify closures, don't trust them.** A large fraction of today's issues are `[CLOSED] [inactive]`, which here functions as a housekeeping label, not a "fixed" label — several (the bootstrap auth issue [#39400](https://github.com/sgl-project/sglang/issues/39400), the silent mxfp4 activation bug [#45755](https://github.com/sgl-project/sglang/issues/45755)) describe real defects whose fixes are unclear. Treat "inactive" as "unresolved but deprioritized" in your risk register.
- **AMD/ROCm users get real TPOT traction.** [#50665](https://github.com/sgl-project/sglang/pull/50665) removes a known host-sync regression on MI355, and [#49883](https://github.com/sgl-project/sglang/pull/49883) defaults EAGLE verify to `unified_attention` on gfx942. Both are open; test them before adopting.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-16

## 1. Today's Highlights

A heavy multimodal day: the project landed a broad expansion of audio/vision support including Zonos3-mini TTS, Higgs v3 STT, VibeVoice-ASR, and MiniMax-M3.1, while the server gained MCP discovery optimizations and Jinja proceeded through a chaotic land-revert-reland cycle. Concurrently, several performance patches targeting SYCL (Flash Attention mask fix, fast division) and HIP (stream_k tuning) are in review, though a V100 prefill regression and multiple Vulkan/HIP correctness bugs remain open.

## 2. Releases & Breaking Changes

- **b12428** — Jinja: add 4 missing features ([#32352](https://github.com/ggml-org/llama.cpp/pull/32352)); re-applied after revert (see b12423/b12422).
- **b12427** — `server`: skip MCP discovery for router children ([#32359](https://github.com/ggml-org/llama.cpp/pull/32359)).
- **b12426** — `mtmd`: support Higgs v3 STT and VibeVoice-ASR ([#32329](https://github.com/ggml-org/llama.cpp/pull/32329)); introduces `mtmd_helper_get_media_meta`.
- **b12425** — Qwen3-VL: read output head size from tensor ([#32349](https://github.com/ggml-org/llama.cpp/pull/32349)) — enables Qwen3-ForcedAligner.
- **b12424** — `mtmd`: Zonos3-mini TTS with voice cloning ([#32020](https://github.com/ggml-org/llama.cpp/pull/32020)).
- **b12423** — Revert "jinja: add 4 missing features" (a681a53).
- **b12422** — Jinja: add 4 missing features.
- **b12421** — Docs: move per-model TTS to `/docs` ([#32304](https://github.com/ggml-org/llama.cpp/pull/32304)).
- **b12420** — Model: MiniMax-M3.1 support ([#32301](https://github.com/ggml-org/llama.cpp/pull/32301)).
- **b12419** — `server`: ignore empty stop strings ([#32093](https://github.com/ggml-org/llama.cpp/pull/32093)).

No API- or config-level breaking changes were published in this window. Note the Jinja feature set landed late after a same-day revert/reland (land in b12428 should be treated as authoritative).

## 3. New Model & Hardware Support

- **MiniMax-M3.1** — mainline arch support ([#32301](https://github.com/ggml-org/llama.cpp/pull/32301), b12420).
- **Zonos3-mini** — TTS with voice clone, delivery params, text normalization, default voice via GGUF metadata ([#32020](https://github.com/ggml-org/llama.cpp/pull/32020), b12424).
- **Higgs v3 STT + VibeVoice-ASR** — audio input via `mtmd` ([#32329](https://github.com/ggml-org/llama.cpp/pull/32329), b12426).
- **Qwen3-ForcedAligner** — output head resized from tensor metadata ([#32349](https://github.com/ggml-org/llama.cpp/pull/32349), b12425).
- **Fish Audio S2** (in review) — Qwen3-4B backbone + Fast AR for multi-codec frame prediction ([#32330](https://github.com/ggml-org/llama.cpp/pull/32330)).
- **Inkling 1** (in review) — text, vision, audio ([#32354](https://github.com/ggml-org/llama.cpp/pull/32354)); requires Jinja `sort_keys=true` ([#32366](https://github.com/ggml-org/llama.cpp/pull/32366)).
- **Zaya1 8B (Zyphra)** (in review) — includes SSM_CONV CUDA fix ([#32071](https://github.com/ggml-org/llama.cpp/pull/32071)).
- **OpenCL** — new `FLASH_ATTN_EXT` GMEM kernel ([#32302](https://github.com/ggml-org/llama.cpp/pull/32302)).
- **RPC** — cross-server tensor copy proposal (HELLO / REMOTE_COPY_TENSOR) ([#8032](https://github.com/ggml-org/llama.cpp/pull/8032)).

## 4. Performance & Optimization

- **SYCL bin-bcast** — replace per-element software modulo with `init_fastdiv_values`/`fast_div_modulo` in `k_bin_bcast`/`k_bin_bcast3`; avoids ~30-instruction division sequences on Intel GPUs ([#32213](https://github.com/ggml-org/llama.cpp/pull/32213)).
- **SYCL Grouped XMX GEMM** — reduce SLM staging traffic vs. #30156 ([#31428](https://github.com/ggml-org/llama.cpp/pull/31428)).
- **HIP/GCN** — stream_k algorithm and MMQ config tuning ([#30022](https://github.com/ggml-org/llama.cpp/pull/30022)).
- **CI (HIP)** — occupancy regression check + static analysis report ([#32365](https://github.com/ggml-org/llama.cpp/pull/32365)).
- **CMake** — `-march` microarchitecture level propagation for `GGML_CPU_ALL_VARIANTS` builds ([#28621](https://github.com/ggml-org/llama.cpp/pull/28621)).
- **Server** — shared-prefix prompt reuse across slots ([#32358](https://github.com/ggml-org/llama.cpp/pull/32358)) can substantially cut prefill cost for multi-session serving with common system prompts.
- **Recent regression context:** HIP MoE prefill down 15–50% since #29948 ([#31599](https://github.com/ggml-org/llama.cpp/issues/31599)); HIP `--spec-type draft-mtp` cuts prefill ~80% ([#31495](https://github.com/ggml-org/llama.cpp/issues/31495)); V100 (sm_70) prefill significantly slower in v1.0.0 vs v0.8.0 ([#32245](https://github.com/ggml-org/llama.cpp/issues/32245)). None have merged fixes yet.

## 5. Stability & Regressions

Ranked by severity:

1. **V100 prefill regression (sm_70, v1.0.0)** — significant throughput loss vs v0.8.0; no fix PR yet ([#32245](https://github.com/ggml-org/llama.cpp/issues/32245)).
2. **Server memory DoS via `X-Conversation-Id`** — client-set header disables disconnect cancellation and accumulates uncapped resumable-stream sessions ([#29498](https://github.com/ggml-org/llama.cpp/issues/29498)).
3. **Vulkan: DeepSeek-V4.1-Flash gibberish with `-fa 1`** — correct with FA off ([#31480](https://github.com/ggml-org/llama.cpp/issues/31480)).
4. **Vulkan: random all-NaN logits on Radeon 680M** — mitigated when integer dot product disabled ([#31509](https://github.com/ggml-org/llama.cpp/issues/31509)).
5. **HIP draft-MTP prefill collapse (~80%)** — Vulkan unaffected ([#31495](https://github.com/ggml-org/llama.cpp/issues/31495)).
6. **SYCL `--split-mode tensor`** — DEVICE_LOST on dual Arc Pro B70; second report of 3× slowdown vs single GPU with quantized KV cache (closed stale; issue may persist) ([#27198](https://github.com/ggml-org/llama.cpp/issues/27198), [#26409](https://github.com/ggml-org/llama.cpp/issues/26409)).
7. **Control vectors and KV cache** — steering vectors written into and re-read from KV, diverging behavior from LoRAs in multi-turn chats ([#32341](https://github.com/ggml-org/llama.cpp/issues/32341)).
8. **MoE cache hit rate collapse** — 0.6% at one token of slots since #30637 ([#31421](https://github.com/ggml-org/llama.cpp/issues/31421)).
9. **High CPU usage with GPU-resident model** — regression introduced in b10423 ([#29858](https://github.com/ggml-org/llama.cpp/issues/29858)).
10. **DFlash2 abort** in `post_decode seq_rm` with `--parallel 8` ([#31656](https://github.com/ggml-org/llama.cpp/issues/31656)); **Glimmer mmproj memory/prefill degradation** ([#26873](https://github.com/ggml-org/llama.cpp/issues/26873)).
11. **NixOS build failure** on webui from `flake.nix` ([#32252](https://github.com/ggml-org/llama.cpp/issues/32252)); **`moe-cache-tune.py` crash on Windows** ([#32041](https://github.com/ggml-org/llama.cpp/issues/32041)).

Fix PRs in flight: SYCL FA mask OOB ([#31536](https://github.com/ggml-org/llama.cpp/pull/31536)); RPC server resilience on client disconnect + UBSan fixes ([#32318](https://github.com/ggml-org/llama.cpp/pull/32318)); `n_cmpl > 1` context-size fix with SWA-aware cell reuse ([#32364](https://github.com/ggml-org/llama.cpp/pull/32364)).

## 6. What This Means for Application Developers

- **Multimodal serving is broadening fast.** If you're shipping voice agents or transcription, Zonos3-mini TTS + Higgs v3/VibeVoice-ASR + Fish S2 (soon) mean llama-server can plausibly cover both directions of an audio loop in a single process.
- **Shared-prefix slot reuse ([#32358](https://github.com/ggml-org/llama.cpp/pull/32358)) is the single biggest lever for multi-tenant chat apps.** If all sessions share a long system prompt, expect materially lower prefill cost per new session once it lands.
- **Token-aware chat parsing ([#29307](https://github.com/ggml-org/llama.cpp/pull/29307)) will resolve a class of tool-calling/reasoning-parser bugs** where ` thinking`-style delimiters appeared as literal text rather than special tokens.
- **Better error semantics for reasoning effort:** invalid `reasoning_effort` values currently 500 from the template's `raise_exception`; [#32332](https://github.com/ggml-org/llama.cpp/pull/32332) converts this to a 400 so clients can distinguish user error from server fault.
- **Pin your hardware path.** If you run V100, HIP/ROCm, or Vulkan on Radeon 680M/RDNA2-class iGPUs, there are open regressions and correctness issues on current master — validate with `llama-bench` against a known-good build (e.g., v0.8.0) before upgrading.
- **Review your server's exposure to `X-Conversation-Id`** if you front llama-server with resumable streaming and multi-user traffic ([#29498](https://github.com/ggml-org/llama.cpp/issues/29498)); consider a proxy that strips client-supplied session identifiers until the unbounded-session issue is fixed.
- **Jinja churn is ongoing.** If you rely on custom chat templates with newer constructs (floor division, etc.), wait for builds past b12428 and add template parse tests to your CI.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-16

## 1. Today's Highlights

No releases landed in the last 24 hours, but the issue/PR queue shows sustained activity on the serving and memory-management layers. The most substantial in-flight work is PR #19632, a broad fix to VRAM accounting and GPU-splitting heuristics that addresses four long-standing reports of incorrect model eviction and unnecessary multi-GPU sharding. On the observability side, PRs #19710 and #19708 tighten `logprobs`/`top_logprobs` handling — documentation and duplicate validation, respectively — signaling that the OpenAI-compatible sampling surface is being stabilized.

## 2. Releases & Breaking Changes

None. No releases published in the last 24h, and no API or config-breaking changes are proposed in the current PR set.

## 3. New Model & Hardware Support

- **Reranking models (Issue #3368, OPEN, 👍290, 110 comments)** — The most-upvoted open request on the tracker: native support for cross-encoder rerankers such as `BAAI/bge-reranker-large` and `mixedbread-ai/mxbai-rerank-large-v1`. Still unaddressed by core, which has prompted community workarounds (see PR #19706 below). https://github.com/ollama/ollama/issues/3368
- **Compatible binary MLX-C / XGrammar (PR #19688, OPEN)** — Decouples MLX-C and XGrammar from Ollama's build, letting packagers supply prebuilt libraries staged into the runner directory and build the XGrammar wrapper against them, with additional Go linker flags permitted. Relevant for downstream distribution and Metal-adjacent packaging on macOS. https://github.com/ollama/ollama/pull/19688
- **Gemma 4 image token budget (Issue #15626, CLOSED)** — The request to expose `max_soft_tokens` as a runtime parameter for Gemma 4's variable-resolution vision encoder (hardcoded to `280` in `model/models/gemma4/process_image.go`) has been closed. https://github.com/ollama/ollama/issues/15626

## 4. Performance & Optimization

- **VRAM accounting and GPU splitting (PR #19632, OPEN)** — Fixes multiple accounting defects causing incorrect eviction, load refusal, and model spreading across GPUs when unnecessary. Explicitly closes out #19463, #18679, #18349, and #16599. This is the highest-impact memory-management change in the queue. https://github.com/ollama/ollama/pull/19632
- **Windows iGPU weight placement (PR #19636, CLOSED)** — Keeps weights out of pinned host memory on Windows integrated GPUs. Previously a model larger than ~half of system RAM failed on AMD Strix Halo with `failed to allocate ROCm0 buffer of size 17716740096` during KV cache allocation. https://github.com/ollama/ollama/pull/19636
- **Context-shift amplitude drift (PR #19680, OPEN)** — With `--context-shift`, `llama_kv_cache::build_rope_shift` re-applied the YaRN amplitude factor to already-roped KV keys on every shift, compounding the scaling per shift. Fixes #19457. https://github.com/ollama/ollama/pull/19680
- **Configurable mmproj headroom (Issue #19407, OPEN)** — Request to make the hardcoded 1 GiB multimodal projector safety margin configurable while preserving automatic `--fit` padding. Relevant for large-mmproj vision models where the fixed reserve causes conservative placement. https://github.com/ollama/ollama/issues/19407

## 5. Stability & Regressions

Ranked by severity:

- **HIGH — Streaming goroutine and semaphore leaks (Issue #17131, OPEN)** — `GenerateHandler`, `PushHandler`, `ChatHandler`, and `handleNativeChat` stream via unbuffered channels with bare blocking sends; client disconnects leak goroutines and runner semaphore slots. Over time this degrades or exhausts runner capacity. No fix PR identified. https://github.com/ollama/ollama/issues/17131
- **HIGH — Gemma 4 image processing broken on Windows (Issue #16532, OPEN)** — Vision inputs on Gemma 4 under Windows fail to reach the model, returning text suggesting the image was never seen. 54 comments and no resolution. https://github.com/ollama/ollama/issues/16532
- **MEDIUM — Qwen tool-call parser corruption (PR #19705, OPEN)** — `qwen3.5`/`qwen3-coder` parsers corrupt tool-call arguments or drop calls depending on content and stream chunking; `qwenTagRegex` matched any `<Name=value>`, including text inside parameter values. Fixes five reported cases (#19694). https://github.com/ollama/ollama/pull/19705
- **MEDIUM — Anthropic `/v1/messages` effort mapping (Issue #17906, OPEN)** — `xhigh` is mapped to `high`, breaking Qwen3.8 chat templates that distinguish `xhigh`/`medium`/`low`. `ollama launch claude` then fails before inference. https://github.com/ollama/ollama/issues/17906
- **LOW — Responses stream `created_at` inconsistency (PR #19106, OPEN)** — `/v1/responses` re-reads the clock per event, so any generation crossing a second boundary produces a `response.completed` timestamp differing from `response.created`. https://github.com/ollama/ollama/pull/19106
- **LOW — Port 11434 bind conflict (Issue #3575, CLOSED)** — Long-running report on `listen tcp 127.0.0.1:11434: bind` under Windows; closed. https://github.com/ollama/ollama/issues/3575
- **LOW — Parser error messages for missing `FROM` file (PR #19707, OPEN)** — `ollama create` reports an invalid model name rather than a missing file when a Modelfile `FROM` path is wrong. https://github.com/ollama/ollama/pull/19707

## 6. What This Means for Application Developers

- **Pin your tool-calling Qwen workloads until #19705 lands.** If you stream Qwen3.5/3-coder tool calls with non-trivial argument payloads, expect intermittent argument corruption or dropped calls today. Chunking behavior affects correctness, so retries are not a reliable mitigation — validate arguments before execution.
- **Long-lived streaming clients carry a hidden cost (#17131).** If your gateway opens and abandons generate/chat streams frequently (timeouts, user cancels), leaked semaphore slots may reduce effective runner concurrency over time. Monitor for throughput decay under churn; a process restart is currently the only recovery.
- **Plan for reranking outside the core server.** With #3368 still open, RAG pipelines needing cross-encoder rerank should run a sidecar. PR #19706 adds `tiebreak`, an MIT-licensed CPU rerank server exposing Cohere and Jina `/v1/rerank` alongside Ollama — no GPU or PyTorch required. https://github.com/ollama/ollama/pull/19706
- **OpenAI/Anthropic compatibility edge cases persist.** `logprobs`/`top_logprobs` are supported and validated but were until now undocumented (#19710); `/v1/responses` streaming timestamps are unstable across second boundaries (#19106); and effort-level translation breaks `xhigh`-aware templates (#17906). Normalize timestamps and avoid relying on `xhigh` if you proxy through Ollama.
- **Watch #19632 if you run multi-GPU or memory-constrained deployments.** The eviction and sharding bugs it addresses are the kind that manifest as unexplained load failures or models spread across devices at reduced throughput — worth tracking if your capacity planning has felt unpredictable.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-16

## 1. Today's Highlights
LiteLLM is mid-migration to a keyless Sigstore signing model (starting `v1.111.0-dev.3`), with `cosign verify --key` no longer valid for new releases. In parallel, the team is pushing Rust-native engines into the critical path: budget reservation/settlement is being moved to a `callbacks-budgets` crate, and Bedrock invoke is becoming Rust-only. Issue traffic remains dominated by streaming correctness bugs across the Anthropic `/v1/messages`, Responses API, and Bedrock translation layers.

## 2. Releases & Breaking Changes
- **v1.111.0-dev.4** — current recommended dev build. [Release](https://github.com/BerriAI/litellm/releases/tag/v1.111.0-dev.4)
  - **Breaking:** release signing moved to **keyless cosign via Sigstore (GitHub OIDC)**. `cosign verify --key cosign.pub ...` no longer works for releases `>= v1.111.0-dev.3`. Use keyless verification (`cosign verify --certificate-identity ... --certificate-oidc-issuer ...`). Earlier releases still verify with the old key.
- **v1.111.0-dev.3** — **do not use**; only partially published (same commit as dev.4). [Release](https://github.com/BerriAI/litellm/releases/tag/v1.111.0-dev.3)
- **v1.110.0-rc.3** — Docker images signed with the key from commit `e82a3c6`. [Release](https://github.com/BerriAI/litellm/releases/tag/v1.110.0-rc.3)

**Action item:** Update any CI/CD cosign verification pipelines pinned to the old public key before adopting `v1.111.0+`.

## 3. New Model & Hardware Support
- **Vertex AI "Meta Muse" models** — PR [#50768](https://github.com/BerriAI/litellm/pull/50768) adds catalog entries (Wonder 1.0, Ember 1.0, Spark 1.3) with native Responses API routing on Vertex.
- **AxForge** — PR [#51865](https://github.com/BerriAI/litellm/pull/51865) registers a new OpenAI-compatible provider (`https://api.axforge.ai/v1`, chat completions + Responses).
- **Bedrock invoke → Rust-only** — PR [#51330](https://github.com/BerriAI/litellm/pull/51330) fully removes the Python path for Bedrock invoke messages (logic retained for Bedrock "mantle" config coupling).
- **LM Studio context-window auto-detection** — feature request [#36948](https://github.com/BerriAI/litellm/issues/36948) proposes pulling `max_input_tokens` from LM Studio's native metadata API rather than static config.

## 4. Performance & Optimization
- **Rust budget engine** — PR [#51535](https://github.com/BerriAI/litellm/pull/51535) replaces the Python budget hold/settle engine with a Rust `callbacks-budgets` crate (`NativeBudgets.reserve(plan, observed)` / `settle`) admitted at auth time. Highest-impact infra change in flight.
- **Priority queueing for congested providers** — PR [#51892](https://github.com/BerriAI/litellm/pull/51892) queues requests during 429/529, prioritizing P0, then resumes normal dispatch on recovery.
- **Cache-key hot path regression** — Issue [#51935](https://github.com/BerriAI/litellm/issues/51935) reports `Cache.get_cache_key()` stringifies the full request (including base64 images) **twice per request**; large image payloads (>200 MB) block the event loop for seconds. No fix PR linked yet.
- **Typing cleanup on hot modules** — PR [#36544](https://github.com/BerriAI/litellm/pull/36544) removes 1,929 `Any`-seam basedpyright errors across Google GenAI, response polling and provider handlers.

## 5. Stability & Regressions
Ranked by severity (all verified against current `main` unless noted):

1. **`/v1/messages` mis-encodes reasoning models** — [#32357](https://github.com/BerriAI/litellm/issues/32357) (OPEN, 8👍). `thinking_delta` emitted inside a text block + duplicate `message_start`; empty content in Claude Code/Anthropic SDK when fronting GLM/DeepSeek-R1 via vLLM/SGLang. **No fix PR yet.**
2. **Streaming usage undercounted (chained proxies)** — [#36114](https://github.com/BerriAI/litellm/issues/36114) (CLOSED). Root cause in stream aggregation, not provider transform. Billing-distorting.
3. **Valkey semantic cache** — [#36124](https://github.com/BerriAI/litellm/issues/36124): static similarity threshold (0.8) proposed to become adaptive.
4. **Concurrent requests bypass `max_budget_per_session`** — [#34732](https://github.com/BerriAI/litellm/issues/34732) (OPEN). Admission doesn't reserve in-flight capacity; hard cap can be exceeded.
5. **Spend-log batch loss** — [#33873](https://github.com/BerriAI/litellm/issues/33873) (OPEN). Local non-Prisma failures (e.g. `jsonify_object` TypeError) drop batches after dequeue.
6. **Spend-log ID collision** — [#35563](https://github.com/BerriAI/litellm/issues/35563) (CLOSED). Provider response IDs used as primary key; distinct calls collapse.
7. **Generic stream predicate accepts incomplete chunks** — [#43487](https://github.com/BerriAI/litellm/issues/43487) (OPEN). Raises `KeyError` on missing fields.
8. **`unpack_defs` unbounded recursion** — [#34328](https://github.com/BerriAI/litellm/issues/34328) (CLOSED). Recursive high-fan-in tool schemas hang; no byte budget for Bedrock/Vertex callers.
9. **Responses-to-Chat bridge drops role/reasoning items** — [#40887](https://github.com/BerriAI/litellm/issues/40887) (OPEN).
10. **Middleware/admission semantics** — admin-only denials return 401 instead of 403 and log `exception_status="None"` (Prometheus): [#37108](https://github.com/BerriAI/litellm/issues/37108).

Other open items: `ModelNotMappedError` from `litellm/utils.py` [#51452](https://github.com/BerriAI/litellm/issues/51452); mistral-medium-3-5 tool-result concatenation TypeError [#46209](https://github.com/BerriAI/litellm/issues/46209); Bedrock encrypted-reasoning rejection after model switches [#41792](https://github.com/BerriAI/litellm/issues/41792); Helm chart still on bitnami postgres/redis dependencies [#19769](https://github.com/BerriAI/litellm/issues/19769).

**Fix PRs landed/in flight:** budget-duration multi-month reset [#50815](https://github.com/BerriAI/litellm/pull/50815); Gemini null/cut-off tool-call args [#50020](https://github.com/BerriAI/litellm/pull/50020); Responses mid-stream fallback billing of cut primary [#51861](https://github.com/BerriAI/litellm/pull/51861); customer cascade-delete timeouts [#51969](https://github.com/BerriAI/litellm/pull/51969); team-member default model reset on team budget window [#51960](https://github.com/BerriAI/litellm/pull/51960).

## 6. What This Means for Application Developers
- **Pin and verify signing policy now.** If your CI verifies LiteLLM Docker images, switch from `--key cosign.pub` to keyless Sigstore verification for `v1.111.0+`; older releases remain key-based.
- **Reasoning models via Anthropic endpoint need a version floor.** If you front GLM/DeepSeek-R1 through `/v1/messages` with streaming, expect empty content in the Anthropic SDK / Claude Code until [#32357](https://github.com/BerriAI/litellm/issues/32357) is fixed. Route around it via the OpenAI-compatible path if possible.
- **Budget caps aren't hard caps under concurrency.** `max_budget_per_session` can be exceeded with parallel requests ([#34732](https://github.com/BerriAI/litellm/issues/34732)); Rust budget engine ([#51535](https://github.com/BerriAI/litellm/pull/51535)) is intended to close this gap. For financial guarantees today, enforce at your own gateway layer.
- **Large multimodal payloads can stall the proxy.** If you send many/oversized base64 images, `get_cache_key` recomputes the full string hash twice per request ([#51935](https://github.com/BerriAI/litellm/issues/51935)) — cap image size or disable response caching for those routes.
- **Audit spend reconciliation.** Streaming usage undercount ([#36114](https://github.com/BerriAI/litellm/issues/36114)) and spend-log loss/dedup bugs ([#33873](https://github.com/BerriAI/litellm/issues/33873), [#35563](https://github.com/BerriAI/litellm/issues/35563)) mean LiteLLM's spend logs should not be the sole source of truth for billing at scale. Reconcile against provider invoices.
- **Vertex Muse and AxForge support** expand the fallback matrix — worth cataloguing if you run multi-provider redundancy.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-16

## Today's Highlights

A large PR wave from the maintainer landed over the past 24h, dominated by training-loop correctness fixes: DeepSeek-V4.1 compiled training hang and engram-hash failures, MoE router aux-loss gradients silently dropped under gradient checkpointing, and DDP/FSDP2 hardening for VLM, GRPO, and tokenizer saves. Separately, a production-reported mismatch between Unsloth Dynamic v3.1 GGUFs and existing MTP draft heads for Qwen3.8-Flash-Next shows speculation acceptance collapsing from ~74% to 56–66%, which is the most consequential open issue for inference users. No new releases shipped in this window.

## Releases & Breaking Changes

None in the last 24h.

## New Model & Hardware Support

- **DeepSeek-V4.1** — native support follow-ups: compiled training no longer hangs, `merged_16bit` export on released layout, 5.22 SFT, fp4 full finetuning ([PR #17881](https://github.com/unslothai/unsloth/pull/17881)); engram hash host tables now built at bind time instead of in forward, fixing first-forward failure under compiled loads ([PR #17865](https://github.com/unslothai/unsloth/pull/17865)).
- **Qwen3.8-Flash-Next (Qwen4Exp)** — text SFT packing with processor, no KV cache on packed rows, fla 0.6 GDN op fix, `offload_layers` refusals ([PR #17827](https://github.com/unslothai/unsloth/pull/17827)). Tensor-parallel parity tests for gated-query attention (Qwen3.5 / Qwen3-Next) added ([PR #17870](https://github.com/unslothai/unsloth/pull/17870)).
- **Whisper, CSM, Gemma 3n** — decode CUDA graphs now engage; previously plan counted 128 mel bins as prompt and only inspected `input_ids`, so `generate()` ran fully eager ([PR #17871](https://github.com/unslothai/unsloth/pull/17871)).
- **Llama 3.2 Vision (Mllama)** — LoRA under block CUDA graphs fixed; chunked DPO head for VLM batches ([PR #17850](https://github.com/unslothai/unsloth/pull/17850)).
- **ROCm / gfx1151** — GDN causal conv1d was falling back to MIOpen via a HIP gate costing 3.1× step time; Triton kernel confirmed correct ([Issue #17734](https://github.com/unslothai/unsloth/issues/17734), closed).
- **Transformers upper bound** — request to bump to 5.18 to unblock `trl.SFTConfig(assistant_only_loss=True)` ([Issue #17847](https://github.com/unslothai/unsloth/issues/17847), open).
- **AMD RX 6700s (gfx1032)** not detected on Windows 11 with 0.1.917-beta ([Issue #17874](https://github.com/unslothai/unsloth/issues/17874), open).

## Performance & Optimization

- **Speculative decoding regression (Qwen3.8-Flash-Next):** UD 3.1 GGUFs paired with current MTP draft heads drop acceptance ~74% → 56–66% at production (non-greedy) temperature on Ryzen AI Max+ 395. Matching 3.1-trained heads not yet confirmed ([Issue #17402](https://github.com/unslothai/unsloth/issues/17402), open).
- **Block compile recompile storm:** seq_len crossing multiples of 8 triggered Inductor SDPA stride-alignment recompiles on torch 2.14; fixed ([PR #17864](https://github.com/unslothai/unsloth/pull/17864)).
- **Vision training stalls:** padded/unpadded micro-batch mask divergence caused 40–140s mid-run recompiles on `gemma-4-E2B-it` LoRA (steps 11/26 took 116s/50s on Colab L4); a single graph for both paths is proposed ([PR #17880](https://github.com/unslothai/unsloth/pull/17880)).
- **Host-RAM fork OOM:** Block Swap on Qwen3.8-Flash-Next 180B MoE OOM-killed before step 1 because tokenization forks the loaded trainer; in-process tokenization PR open ([PR #17701](https://github.com/unslothai/unsloth/pull/17701)).
- **GKD teacher placement:** frozen 4-bit teacher was pinned to GPU 0 or refused on the second card; PR keeps it off the training GPU ([PR #17876](https://github.com/unslothai/unsloth/pull/17876)).
- **Zero-disk token streaming & in-memory GGUF v3 Hub exporter** proposed to avoid NVMe staging for massive datasets ([PR #16043](https://github.com/unslothai/unsloth/pull/16043), open, marked defer).

## Stability & Regressions

Ranked by severity:

1. **MoE router aux loss gradient silently dropped** under default `"unsloth"` gradient checkpointing — logged value retained but gradient lost (grad norm 0.0261 vs 0.0486 on gpt-oss step 1). Fix merged ([PR #17873](https://github.com/unslothai/unsloth/pull/17873)). Correctness-critical for MoE training.
2. **DeepSeek-V4.1 first-forward failure** under any compiled FastLanguageModel load on main. Fix merged ([PR #17865](https://github.com/unslothai/unsloth/pull/17865)).
3. **FSDP2 save crash** — missing bitsandbytes made `isinstance(m, Linear4bit)` raise `TypeError`, breaking every full DCP state dict including `Trainer.save_model`. Fix merged ([PR #17869](https://github.com/unslothai/unsloth/pull/17869)).
4. **GRPO under FSDP2 sharded layout** crashed at first loss forward (`FSDPCommContext` missing `all_gather_copy_in_stream`). Fix open ([PR #17875](https://github.com/unslothai/unsloth/pull/17875)).
5. **FSDP2 tokenizer save race** — concurrent ranks writing `tokenizer_config.json` caused `JSONDecodeError`. Fix open ([PR #17862](https://github.com/unslothai/unsloth/pull/17862)).
6. **DDP duplicate Hub commits** — every rank uploaded; now rank-0-only via `tp_world_push` ([PR #17868](https://github.com/unslothai/unsloth/pull/17868)).
7. **DDP for VLM full finetuning / tower LoRA / DPO ref adapter** was broken or wasted GPU 0 memory; fixed with `find_unused=False` defaults and `cuda:LOCAL_RANK` binding ([PR #17867](https://github.com/unslothai/unsloth/pull/17867)).
8. **`padding_free=True` silently disabled** without a message; now warns like `packing=True` ([PR #17866](https://github.com/unslothai/unsloth/pull/17866)).
9. **0.1.917 beta forces mmap** despite `--load-mode none`, causing excess RAM/SSD use on Strix Halo ([Issue #17605](https://github.com/unslothai/unsloth/issues/17605), closed).
10. **Windows drive leak**: 200–400 MB residual per Unsloth Desktop use with no clear path ([Issue #14487](https://github.com/unslothai/unsloth/issues/14487), open, since Oct 21).
11. **SYCL multi-GPU VRAM misdetection** — Studio queries `nvidia-smi` on Intel Arc SYCL builds, capping context and forcing `--no-mmproj-offload` ([Issue #17787](https://github.com/unslothai/unsloth/issues/17787), open).

## What This Means for Application Developers

- **Pin your draft heads to your quant version.** If you deployed Qwen3.8-Flash-Next with UD 3.1 GGUFs and reused older MTP heads, your speculative decoding throughput is materially degraded in real (non-greedy) traffic. Re-validate acceptance rate before scaling, and track [Issue #17402](https://github.com/unslothai/unsloth/issues/17402) for matched heads.
- **Re-run MoE fine-tunes post-#17873.** Any gpt-oss or MoE router training done with Unsloth gradient checkpointing before this fix may have undertrained load-balancing behavior; the loss curve looked fine, which is exactly the trap.
- **Distributed training on this main is moving fast.** If you use FSDP2, plain DDP, or GRPO across multiple GPUs, pull after [#17875](https://github.com/unslothai/unsloth/pull/17875), [#17869](https://github.com/unslothai/unsloth/pull/17869), [#17868](https://github.com/unslothai/unsloth/pull/17868), and [#17862](https://github.com/unslothai/unsloth/pull/17862) merge; the pre-fix failure modes are silent (duplicate commits, wrong grads) or late (save-time crashes).
- **Vision and audio training got step-time wins.** Whisper/CSM/Gemma 3n decode graphs and Mllama block-graph LoRA are now usable; expect eager-fallback slowness on older builds.
- **Agent/MCP surface is expanding but immaturity shows.** Built-in tools and MCP are injected into DiffusionGemma prompts while the execution loop is disabled by design, surfacing raw `<|tool_call>` text ("Worked for 0s") — don't wire diffusion models into tool-using agent flows yet ([Issue #17815](https://github.com/unslothai/unsloth/issues/17815)). Requests for a centralized loaded-models/runtime manager ([#17878](https://github.com/unslothai/unsloth/issues/17878)), macOS launchd persistence ([#17877](https://github.com/unslothai/unsloth/issues/17877)), and remote-API backend exposure concerns ([#17819](https://github.com/unslothai/unsloth/issues/17819)) all point to Studio's serving layer still maturing; review remote-access firewall scoping before exposing beyond LAN.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*