# AI Infrastructure Digest 2026-10-27

> Generated: 2026-10-27 00:21 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Date: 2026-10-27**

---

## 1. Ecosystem Overview

Today's activity confirms a maturing but deeply uneven inference stack. The serving-engine tier (vLLM, SGLang) is now dominated by **DeepSeek-V4.1 optimization work and SM120/Blackwell consumer-GPU growing pains**, with both projects simultaneously shipping performance PRs and reporting high-severity correctness regressions — a sign of velocity outpacing validation. The local-runtime tier (llama.cpp, Ollama) is converging on the same model families but on far messier hardware surfaces (RDNA, Strix Halo, SYCL, Apple Silicon), and both are visibly pivoting from CLI to agent/MCP serving surfaces. LiteLLM's day is almost entirely a **sanitization pass** — credential scoping, session revocation, and cost-accounting integrity — reflecting the gateway layer's maturation from feature-race to trust-and-observability work. Unsloth is the only project in this set pushing training-side (diffusion + FSDP2 numerics) alongside an expanding desktop agent runtime, suggesting the fine-tuning layer is fusing with local inference. Across the board, **speculative decoding, KV caching, and CUDA-graph coverage are the recurring correctness battlegrounds**, and silent corruption outranks crashes as the dominant risk class.

---

## 2. Activity Comparison

| Project | Issues (24h, open/updated) | PRs (24h, open/updated) | Release Status | Notable 24h Signal |
|---|---|---|---|---|
| **vLLM** | ~8 high-severity open; multiple new | ~12 open PRs (spec-decode MRV2 series, ROCm MLA) | No release; Q4 roadmap thread active | PD-disaggregation cross-request contamination (CRITICAL) |
| **SGLang** | ~9 open; 2 closed | ~8 open PRs (DSV4.1 KV sizing, MI355X fusion) | No release | CUDA-graph padding-row NaN corruption (HIGH) |
| **llama.cpp** | ~10 open (multi-GPU correctness cluster) | ~15 open PRs incl. security fix | **Dense release window b11901–b11913** | RPC integer-overflow OOB read (security) |
| **Ollama** | ~8 open | ~6 open PRs (OpenCode v2 fixes) | **v0.40.12-rc0** | `/v1/systemone` hard-400 regression; RADV ~30× slowdown |
| **LiteLLM** | 116 updated / many open | 299 updated | No release | Revoked-session MCP token minting (security) |
| **Unsloth** | ~10 open | ~10 open PRs (diffusion, FSDP2) | **v0.1.911-beta** | Fine-tune assigned to base model in serving path |

**Reading:** LiteLLM operates at an order-of-magnitude higher churn (395 combined updates) but that reflects a backlog/SLA-bot cadence rather than a velocity edge. vLLM and SGLang show the **highest density of high-severity engineering signal per PR**, while llama.cpp and Unsloth are the only two shipping in the window.

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|---|---|---|---|---|
| **DeepSeek-V4.1-Flash** | ✅ (SM120 field config #56700) | ✅ (KV sizing #46684, roadmap #42170) | ⚠️ (conversion #31086; **corruption bug**) | 🟡 (weights requested) | ⚠️ (GGUF chat-template bug #15285) |
| **Kimi K3** | ✅ (ROCm MLA fusion, SP+PP) | ⚠️ (SM90 mxfp4 SiTU bug #45755) | — | — | — |
| **Qwen3.8-Flash-Next** | ✅ (checkpoint fix) | — | — | — | — |
| **MiniMax-M3.1-Flash** | — | — | — | — | ✅ (v0.1.911-beta) |
| **MiniMax-H3** | — | 🟡 (Q4 stress test #43313) | — | — | — |
| **Laguna (MoE)** | — | — | ✅ (amax rescaling b11912) | ✅ (MLX prompt speedup) | — |
| **Flint** | — | 🟡 (PR #45624) | — | ✅ (MLX window_size) | — |
| **Muse Spark / MegaMoE** | ✅ (routing fixes) | ✅ (persistent top-k) | — | — | — |
| **GLM-5.3-Flash** | — | 🟡 (qualification #37813) | — | — | — |
| **FLUX-3 edit** | — | — | — | — | ✅ (release) |

**Who's ahead:**
- **DeepSeek-V4.1 is the ecosystem's center of gravity** — every project except LiteLLM is actively integrating it, and *four of six* have an open correctness or deployment caveat. w.
- **vLLM leads on frontier-model breadth** (Kimi K3, Qwen3.8-Flash-Next, MegaMoE) with the deepest hardware coverage.
- **SGLang is strongest on DeepSeek-V4.1 optimization depth** (KV layout, fused q-norm-rope, shared-expert fusion) but lags on SM120 kernel parity.
- **llama.cpp and Ollama compete on architecture diversity at the edge** (Laguna, Flint, Gemma4 vision) where cloud engines don't tread.
- **Unsloth is the only project on MiniMax-M3.1 and FLUX-3**, extending its reach from text fine-tuning into diffusion.

---

## 4. Performance Frontier

Optimization effort is concentrated in **five distinct arenas**, each with a different lead:

| Arena | Lead Project(s) | Representative Win | Watch Item |
|---|---|---|---|
| **KV cache & memory layout** | SGLang, vLLM | DSV4.1 288B vs 584B slot sizing (#46684); DiffKV 3.0× prefill on SM80 (#61095) | vLLM GDN KV-pool cliff ~24% at c32 (#55580) |
| **Batching / scheduling** | vLLM, llama.cpp | Rust frontend hash off GIL (#63842); mixed-chunk scheduling | Mixed-chunk + CUDA-graph padding bugs dominate *both* engines' regressions |
| **Quantization** | SGLang, llama.cpp | MI355X shared-expert fusion 2.0–6.6% TPT; IQ4 precompute speedup (#31201) | NVFP4 + torch.compile garbage on SM120 (#48898); NVFP4 CPU fallback (Unsloth #15409) |
| **Distributed serving** | llama.cpp, SGLang | SYCL `-sm tensor` +19% prefill (#30956); SYCL graph replay (#28725) | Multi-GPU is the **riskiest config across every local runtime** |
| **Kernels / fusion** | vLLM, llama.cpp | Kimi K3 ROCm q_proj+W_UK GEMM fold (#60110); Vulkan RMS-norm subgroup (#29882) | Triton top-k full-vocab fallback 6–10% (#61998) |

**Cross-cutting:** The single most valuable optimization classifier emerging is **cold-start/topology cost** — SGLang's Weight Cache Daemon drops Qwen3-235B FP8 load from ~5 min to <1s, which changes autoscaling economics more than any per-token win in the digest.

---

## 5. Layer Positioning

| Layer | Projects | Core Job | Today's Defining Concern |
|---|---|---|---|
| **Serving engine (datacenter)** | vLLM, SGLang | Maximize throughput & model breadth on fixed GPU fleets | Correctness under PD-disaggregation and CUDA-graph capture |
| **Local runtime (edge/desktop)** | llama.cpp, Ollama | Run anywhere; portability across heterogeneous backends | Multi-GPU silent corruption; agent/MCP surface maturation |
| **Gateway / policy plane** | LiteLLM | Auth, quota, cost attribution, provider abstraction | Credential scoping, session revocation, spend integrity |
| **Training / fine-tuning** | Unsloth | Efficient training + increasingly, local serving/synthesis | Train→serve lineage; diffusion determinism |

**Key structural insight:** the boundaries are dissolving. llama.cpp and Ollama are becoming *serving engines* (prompt cache, tool registry, MCP, RPC); Unsloth is becoming an *agent runtime* (scheduled tasks, browser access, MCP for Codex); LiteLLM is becoming a *security kernel*. The only clean separation left is **datacenter-throughput vs edge-portability vs control-plane**. Decision-makers should not treat these as interchangeable layers when planning procurement — the highest-leverage stack today is vLLM/SGLang for throughput behind LiteLLM for policy, with llama.cpp/Ollama for on-device.

---

## 6. Trend Signals

**1. Silent corruption > crashes as the top risk class.** vLLM PD-disaggregation cross-request leakage (#61160), SGLang Inkling NaN logits (#46572), llama.cpp HIP wrong logits (#28211), Ollama empty responses (#19060), and Unsloth base-model-instead-of-fine-tune (#15449) all share one property: **the system returns plausible, wrong output.** Traditional uptime monitoring will not catch these. *Watch:* add cached-vs-cold and fine-tune-vs-base eval gates to CI.

**2. Speculative decoding is the new correctness frontier.** It appears as a regression source in *every* engine: vLLM MRV2 series + hybrid GDN pool collapse, SGLang non-greedy SIGKILL (#43412) and DSpark draft-width bug, llama.cpp MTP state-bleed and CUDA lockups, Ollama DFlash2. *Watch:* do not enable spec decoding on sampled (temp>0) traffic without regression coverage.

**3. The Blackwell SM120 gap is the biggest portability tax.** Both vLLM and SGLang report severe DeepSeek-V4 prefill/decode deficits on RTX PRO 6000-class hardware vs datacenter parts, forcing `--enforce-eager` and NVFP4 workarounds. *Watch:* if you're planning consumer-Blackwell fleets, price in 20–30% effective throughput loss and TP-layout compatibility checks until kernel coverage closes.

**4. Agent surfaces are becoming first-class, and brittle.** Ollama's OpenCode v2 breakage, Unsloth's MCP/Codex/browser roadmap, LiteLLM's MCP gateway auth fixes, and llama.cpp's MCP stdio deadlock together show **agent harnesses are now a primary API consumer** — and the least standardized one. *Watch:* normalize empty-content (`[]` vs `null`) and tool-argument serialization yourself; these are the recurring breakage vectors.

**5. Cost-accounting integrity is a live gateway gap.** LiteLLM's cluster of spend-log issues (cache-hit ambiguity #39057, classifier cost not attributed #46469, $0 on reload #43444) plus the multimodal TPM admission hole (#48099) mean **multimodal + cached workloads have unreliable quota/billing today.** *Watch:* deduplicate on `response.id`; don't trust token-column sums; expect multimodal admission to tighten.

**6. Security debt is surfacing at the edges.** The llama.cpp RPC integer-overflow OOB read, LiteLLM's revoked-session MCP bypass and Anthropic OAuth token leakage, and the long-open llama.cpp WebUI `?q=` injection all point to **reachable attack surfaces in systems deployed on untrusted networks.** *Watch:* patch llama.cpp to #31217 and audit MCP consent flows.

**7. Cold-start economics are being rewritten.** SGLang's <1s weight reload and vLLM's Rust-frontend off-GIL work both target the same thing: making restarts and autoscaling cheap. *Watch:* this is the highest-ROI roadmap item for anyone running bursty inference.

---

**Bottom line for decision-makers:** performance is no longer the binding constraint on most deployments — **correctness under advanced serving features (PD-disaggregation, mixed-chunk, spec decode, multimodal) is.** Budget validation effort accordingly, pin known-good commits per engine, and treat every "it returns output" claim as unverified until you've diffed against a cold-path baseline.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-10-27

## 1. Today's Highlights

No new releases in the last 24h, but the issue/PR queue is unusually active. The most consequential signals today are around **SM120 (consumer Blackwell) support gaps for DeepSeek-V4.1-Flash** — CUDA graph capture fails and `enable_adaptive_verification` is rejected, forcing `--enforce-eager` with severe throughput loss ([#56892](https://github.com/vllm-project/vllm/issues/56892), [#63343](https://github.com/vllm-project/vllm/issues/63343)). A **correctness-severity bug in PD-disaggregated deployments** is also live: automatic prefix caching can leak context across requests with NIXL prefill/decode disaggregation ([#61160](https://github.com/vllm-project/vllm/issues/61160)). On the roadmap side, the **Q4 2026 roadmap** thread continues to consolidate SIG-level direction ([#61024](https://github.com/vllm-project/vllm/issues/61024)).

## 2. Releases & Breaking Changes

None today. No new tags, wheels, or config/API deprecations were published in the last 24h.

## 3. New Model & Hardware Support

- **Muse Spark / MegaMoE**: dummy-load and balanced-routing fixes landing for forward benchmarking ([#63871](https://github.com/vllm-project/vllm/pull/63871), [#63872](https://github.com/vllm-project/vllm/pull/63872)).
- **DeepSeek-V4.1-Flash on SM120**: field report with a working 8× RTX PRO 6000 configuration for 1M-context serving, plus a documented pitfall map ([#56700](https://github.com/vllm-project/vllm/issues/56700)). Short-context sparse-indexer graph warmup for the same model in PR ([#63876](https://github.com/vllm-project/vllm/pull/63876)).
- **Qwen3.8-Flash-Next**: checkpoint loading fix for mixed quantized-q/k/v + BF16 QSA indexer ([#62318](https://github.com/vllm-project/vllm/pull/62318)).
- **Kimi K3**: ROCm MLA chunked-context gather fusion ([#53166](https://github.com/vllm-project/vllm/pull/53166)), sequence-parallelism + pipeline-parallelism support ([#54347](https://github.com/vllm-project/vllm/pull/54347)), and a ROCm MLA query-projection GEMM fold ([#60110](https://github.com/vllm-project/vllm/pull/60110)).
- **ROCm/RDNA**: `ROCM_ATTN` correctness fix needed for head size ≥96 with KV block ≠16, and MHA head sizes 192/256 on RDNA4 ([#62697](https://github.com/vllm-project/vllm/issues/62697)); AWQ W4A16 kernel selection on gfx1151 is broken ([#63455](https://github.com/vllm-project/vllm/issues/63455)).
- **Speculative decoding**: pluggable out-of-tree speculator registry ([#62962](https://github.com/vllm-project/vllm/pull/62962)) and non-chain verification hooks ([#62963](https://github.com/vllm-project/vllm/pull/62963)).

## 4. Performance & Optimization

- **Qwen GDN decode**: −5.8% decode latency at batch 1 on Qwen3.8-27B (TP4, B300) by trimming per-layer work and MRV2 attention metadata ([#62961](https://github.com/vllm-project/vllm/pull/62961)).
- **Kimi K3 MLA decode on ROCm**: fusing `q_b_proj` + `W_UK` into one GEMM eliminates a launch per layer at c14/TP8 ([#60110](https://github.com/vllm-project/vllm/pull/60110)).
- **DiffKV prefill on SM80**: `BLOCK_M=128` + KV tile 64 yields **3.0×** on 200K-context chunks ([#61095](https://github.com/vllm-project/vllm/issues/61095)).
- **Triton top-k sampling**: monolithic kernel falls back to full-vocab search for 6–10% of rows due to an 8192-logit heuristic ([#61998](https://github.com/vllm-project/vllm/issues/61998)).
- **Rust frontend**: prompt block-hash computation moved off the engine input thread / GIL ([#63842](https://github.com/vllm-project/vllm/pull/63842)).
- **GDN hybrid (Qwen3.8-27B)**: c32 aggregate throughput drops ~24% when the profiled KV pool is below ~190k tokens — a real cliff worth profiling against ([#55580](https://github.com/vllm-project/vllm/issues/55580)).

## 5. Stability & Regressions

Ranked by severity:

1. **[CRITICAL — correctness] Cross-request context contamination** in PD-disaggregated NIXL deployments with automatic prefix caching enabled (default). Intermittent response content from other requests; disabling prefix caching is the stated clean workaround ([#61160](https://github.com/vllm-project/vllm/issues/61160)). **No fix PR referenced yet.**
2. **[HIGH — crash] `/v1/chat/completions` and `/v1/completions` return HTTP 500** from `IndexError` in `_create_chat_logprobs` when `top_logprobs` is shorter than `token_ids` ([#63751](https://github.com/vllm-project/vllm/issues/63751)).
3. **[HIGH — incorrect output] NVFP4 + `torch.compile` on SM120** with non-32-aligned per-rank K (TP8) reads stale padded block-scale memory, producing garbage. Eager, Marlin, and 32-aligned TP are correct ([#48898](https://github.com/vllm-project/vllm/issues/48898)).
4. **[HIGH — perf regression] DeepSeek-V4.1-Flash on SM120**: `--enforce-eager` required because CUDA graphs are unusable; adaptive verification also rejected ([#56892](https://github.com/vllm-project/vllm/issues/56892), [#63343](https://github.com/vllm-project/vllm/issues/63343)).
5. **[MEDIUM — availability] P2P KV offload tier doesn't fail fast on peer faults** ([#63602](https://github.com/vllm-project/vllm/issues/63602)).
6. **[MEDIUM — correctness] ROCm `ROCM_ATTN` wrong attention on RDNA** for specific head-size/KV-block combos; can fault the GPU ([#62697](https://github.com/vllm-project/vllm/issues/62697)).
7. **[MEDIUM — correctness] Qwen3.6 GDN greedy divergence** from batch-dependent numerics and preemption/recompute ([#62851](https://github.com/vllm-project/vllm/issues/62851)).
8. **[LOW — spec decode] KV-cache pool collapse** when a draft model introduces a hybrid GDN + DFlash cache spec ([#59117](https://github.com/vllm-project/vllm/issues/59117)).
9. **[LOW — tool calling] Qwen strict mode with zero-argument tools** enters a doom loop on token 197 ([#50989](https://github.com/vllm-project/vllm/issues/50989)).
10. **[LOW — startup] Memory-profiling assertion aborts** whenever free memory grows, contradicting GPU co-tenancy docs ([#56830](https://github.com/vllm-project/vllm/issues/56830)).
11. **[FIXED/CLOSED] `persistent_topk` silently dropping candidates** with coarse histogram bins ([#51782](https://github.com/vllm-project/vllm/issues/51782)).
12. **[FIXED/CLOSED] AMD gfx1030 (W6800/V620/6900XT/6800XT) severe perf regression** ([#38107](https://github.com/vllm-project/vllm/issues/38107)).

Fix PRs exist for several spec-decode regressions: KV cache pages for hybrid models with draft layers ([#62800](https://github.com/vllm-project/vllm/pull/62800)), draft MoE communication overrides ([#63875](https://github.com/vllm-project/vllm/pull/63875)), draft `max_model_len` validation before config hooks ([#63853](https://github.com/vllm-project/vllm/pull/63853)), and CUDA-graph eligibility with differing draft attention heads ([#62964](https://github.com/vllm-project/vllm/pull/62964)). Teardown cleanup for FlashInfer one-sided NVLink workspaces is also in review ([#63874](https://github.com/vllm-project/vllm/pull/63874)).

## 6. What This Means for Application Developers

- **If you run PD disaggregation (NIXL) on DeepSeek-V4.1-Flash, disable prefix caching today** (`--no-enable-prefix-caching`). The cross-request leakage ([#61160](https://github.com/vllm-project/vllm/issues/61160)) is a correctness hazard for multi-tenant and agent workloads where response text is returned verbatim to a different user.
- **On RTX PRO 6000 (SM120), don't assume upstream parity.** Budget for `--enforce-eager` on DeepSeek-V4.1-Flash and treat NVFP4 + `torch.compile` with non-32-aligned TP as unsafe until [#48898](https://github.com/vllm-project/vllm/issues/48898) lands.
- **If you depend on OpenAI-compatible logprobs, add defensive handling.** The `top_logprobs` length mismatch ([#63751](https://github.com/vllm-project/vllm/issues/63751)) produces intermittent 500s under load; retries may mask but won't fix it.
- **Watch the spec-decode MRV2 series** ([#62962](https://github.com/vllm-project/vllm/pull/62962), [#62963](https://github.com/vllm-project/vllm/pull/62963), [#62682](https://github.com/vllm-project/vllm/pull/62682)). Pluggable speculators and opt-in budgeted verification are the shape of coming out-of-tree customization — good time to prototype integrations.
- **Long-context, no-FA3 hardware**: DiffKV tiling ([#61095](https://github.com/vllm-project/vllm/issues/61095)) is worth tracking for prefill-heavy workloads if you're still on SM80/consumer Ampere.
- **Tool-calling with Qwen**: avoid strict mode on zero-argument tools until [#50989](https://github.com/vllm-project/vllm/issues/50989) is resolved — the doom loop burns tokens and stalls agent loops.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-10-27

## 1. Today's Highlights

The biggest cross-cutting story today is **DeepSeek-V4.1 optimization work maturing on multiple fronts** — a KV-pool sizing fix (#46684), a vision-path routed-expert capture fix (#46671), and a tail-metadata refactor (#46526) all landed, while the V4.1 optimization roadmap (#42170) continues to tick off prefill items. Meanwhile, **SM120 (Blackwell RTX PRO 6000) users are still reporting substantial throughput gaps** vs. vLLM on DeepSeek-V4 prefill (#33422), and GLM-5.3-Flash qualification (#37813) remains an open tracking item. On the correctness side, a cluster of **CUDA-graph padding-row and mixed-chunk bugs** (#46572, #46615, #46446, #37606) is drawing attention as mixed-chunk scheduling and breakable CUDA graphs become more widely deployed.

---

## 2. Releases & Breaking Changes

No new releases in the last 24h. Two closed issues are worth noting for downstream awareness:

- **[CLOSED] [inactive] HiCache storage keys omit `kv_cache_dtype` → silent cross-run cache collisions** — #33268 ([link](https://github.com/sgl-project/sglang/issues/33268)). Closed as inactive, but the underlying behavior (cache keys derived from model name + TP/PP/CP geometry, no dtype component) may still warrant a workaround in production HiCache deployments. Verify your storage backend namespacing.
- **[CLOSED] [inactive] `mem_cache` pool/allocator restructure RFC** — #25371 ([link](https://github.com/sgl-project/sglang/issues/25371)). Roadmap v2 rewritten; no landed API change, but allocator internals are being reorganized — expect churn in `mem_cache/` for contributors.

---

## 3. New Model & Hardware Support

- **Flint (RecursiveSI/flint) model support** — PR #45624 ([link](https://github.com/sgl-project/sglang/pull/45624)), open. Adds a new model family to SGLang's model registry; CI-gated.
- **Apple Silicon roadmap (2026 Q2)** — Issue #19137 ([link](https://github.com/sgl-project/sglang/issues/19137)), still open with 30 comments. No support landed; contributors being solicited. No change today beyond activity.
- **NPU Development Roadmap (2026 H2)** — Issue #25598 ([link](https://github.com/sgl-project/sglang/issues/25598)). Focus areas: P/D disaggregation, all parallelism strategies, spec decoding, hierarchical cache, and load balancing on NPUs.
- **SGLang-Diffusion Roadmap (2026 Q4)** — Issue #43313 ([link](https://github.com/sgl-project/sglang/issues/43313)). Center Q4 on MiniMax-H3 as a stress test; GB200/GB300 recipes and lossless TP/Ulysses overlap planned.
- **MLU CI reliability tracking** — Issue #42935 ([link](https://github.com/sgl-project/sglang/issues/42935)). Weekly report maintained by CI bot.

---

## 4. Performance & Optimization

- **DSV4.1 compressed KV pools sized from allocated layout** — PR #46684 ([link](https://github.com/sgl-project/sglang/pull/46684)). Fixes wasted memory budget: allocator selects 288-byte FP4 layout by default but planner charges legacy 584-byte FlashMLA slot size. For source ratios `[2,2,2,1]` with 68-byte index-K slots, this is a meaningful capacity recovery.
- **MegaMoE persistent top-k reduce** — PR #39832 ([link](https://github.com/sgl-project/sglang/pull/39832)). Eliminates decode latency overhead from a static-grid top-k reduce launch sized from workspace capacity. 256-token decode steps currently pay for full-capacity launch.
- **AMD MI355X: fuse shared expert by default on gfx950** — PR #42496 ([link](https://github.com/sgl-project/sglang/pull/42496)). DeepSeek-V4.1 TP4 median time-per-token 2.0–6.6% lower at 10 of 13 points, slower at none. Cookbook recipes already enable via `--enforce-shared-experts-fusion`.
- **QSA: remove D2D copy in prefill generated KV gather** — PR #45753 ([link](https://github.com/sgl-project/sglang/pull/45753)). Perf-oriented; removes device-to-device copy in the prefill KV gather path.
- **HiCache opt-in async ready-count sync** — PR #45795 ([link](https://github.com/sgl-project/sglang/pull/45795)). With `--enable-hierarchical-cache`, scheduler currently calls `check_hicache_events` every step and MIN-all-reduces ack counts over the attention-TP CPU group. PR makes this opt-in async.
- **Fast Engine Recovery: Weight Cache Daemon (roadmap)** — Issue #33522 ([link](https://github.com/sgl-project/sglang/issues/33522)). Phase 1 landed in #27139: per-rank daemon holds post-quantized weights over CUDA IPC; weight load drops from **~306–327s to <1s** on Qwen3-235B FP8. Phase 2 in progress.
- **Prompt-only hybrid cache tracking** — PR #46683 ([link](https://github.com/sgl-project/sglang/pull/46683)). Skips decode tracking masks/indices and checkpoint bookkeeping when generated tails are never inserted into the cache.
- **DSV4.1 prefill: fold `q_rope_store` into `fused_q_norm_rope`** — completed under #42170 ([link](https://github.com/sgl-project/sglang/issues/42170)). `mHC SP + engram fusion` still open (#43065).

---

## 5. Stability & Regressions

Ranked by severity (correctness/silent-data-loss first):

1. **Inkling NVFP4: fused attention prologue stores CUDA-graph padding rows into KV slot 0 → NaN logits** — Issue #46572 ([link](https://github.com/sgl-project/sglang/issues/46572)). `inkling_attn_prologue_extend_kernel` stores K/V for every token in its launch grid, including padding. Manifests as `probability tensor contains either inf, nan or element < 0`. **High severity — silent corruption.** No fix PR referenced yet.
2. **DeepSeek-V4.1 decoder SWA bounded replay cuts mixed-batch decode rows to a one-token late-layer window** — Issue #46615 ([link](https://github.com/sgl-project/sglang/issues/46615)), **CLOSED**. Silent accuracy loss with `--enable-mixed-chunk` + `--enable-decoder-swa-bounded-replay`. Closed same day; verify whether a fix landed or it was closed as duplicate.
3. **Speculative decoding crashes server on first non-greedy request** — Issue #43412 ([link](https://github.com/sgl-project/sglang/issues/43412)). SIGKILL on first sampled (temp > 0) request under pip-installed bundle. Root cause: flashinfer verify-sampling JIT fails due to bundled cccl vs pip cu13 toolkit mismatch. Greedy traffic unaffected. **No fix PR referenced.**
4. **DSpark draft query width incorrect on FA3/FA4 when `sample_from_anchor=False`** — Issue #46476 ([link](https://github.com/sgl-project/sglang/issues/46476)). Spec decoding correctness on FlashAttention 3/4 backends.
5. **Kimi-K3 on SM90: `flashinfer_mxfp4` silently computes GPT-OSS SwiGLU instead of SiTU** — Issue #45755 ([link](https://github.com/sgl-project/sglang/issues/45755)). Silent wrong activation; depends on flashinfer-ai/flashinfer#4209 (still open). No fix available.
6. **Prefill breakable CUDA graph reuses weak-ref'd break inputs across buckets** — Issue #37606 ([link](https://github.com/sgl-project/sglang/issues/37606)). Wrong greedy output / illegal memory access. BCG keeps graph-break inputs as weak refs; mempool `use_count` pins pool, not blocks.
7. **Qwen3.5-9B deterministic greedy output differs with mixed-chunk scheduling** — Issue #46446 ([link](https://github.com/sgl-project/sglang/issues/46446)). Determinism regression under mixed-chunk.
8. **FLA kernels fail to compile on nightly-cu134-20261020: Triton removed `tl.make_block_ptr`** — Issue #45426 ([link](https://github.com/sgl-project/sglang/issues/45426)). Qwen3.5-397B-A17B-NVFP4 TP2 dies during prefill CUDA-graph capture on the nightly image. Blocks nightly users.
9. **MiMoDetector: `"null"` becomes `None`, invalid booleans become `false`, text around tool calls dropped** — Issue #46566 ([link](https://github.com/sgl-project/sglang/issues/46566)). `--tool-call-parser mimo` silently changes/drops model output. Behavior-policy discussion requested before fix.
10. **Non-causal sliding-window attention ignored in `TorchNativeAttnBackend`** — Issue #39300 ([link](https://github.com/sgl-project/sglang/issues/39300)). Correctness bug in the Torch-native fallback path.
11. **DeepSeek-V4.1 vision-aware routing path misses routed-expert capture** — PR #46671 ([link](https://github.com/sgl-project/sglang/pull/46671)), **CLOSED**. Fix for capture buffer under `vision_n_layers > 0`.

---

## 6. What This Means for Application Developers

- **If you're on DeepSeek-V4/V4.1 with vision or mixed-chunk**: upgrade carefully. The vision routing capture fix (#46671) and the SWA bounded-replay bug (#46615) both touch paths that can silently degrade output. Pin a known-good commit and validate greedy output determinism against a baseline.
- **If you use speculative decoding on a pip-installed bundle**: non-greedy traffic can hard-crash the server (#43412). Until fixed, run sampled requests with a system CUDA toolkit installed, or keep spec decoding off for temp > 0 workloads.
- **If you use `--tool-call-parser mimo`**: audit your tool-call outputs for silently dropped text and `"null"` → `None` coercion (#46566). This affects agent reliability directly.
- **If you're on SM120 Blackwell**: prefill throughput for DeepSeek-V4 is still well below vLLM/marlin on identical hardware (#33422). Budget for tuning time or consider TP layouts that avoid the current kernel-coverage gaps.
- **Weight load times are about to get much faster**: the Weight Cache Daemon (#33522) Phase 1 already drops Qwen3-235B FP8 load from ~5 minutes to <1s on supported paths. If you run frequent restarts or autoscaling, track this roadmap — it materially changes cold-start economics.
- **HiCache users**: the dtype-collision issue (#33268) is closed as inactive but the underlying design gap (cache key omits `kv_cache_dtype`) may still bite you across dtype-switching runs. Namespace your storage backends defensively until a fix is confirmed.

---

*Generated from github.com/sgl-project/sglang activity on 2026-10-26/27. Links point to the corresponding issues and PRs.*

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-10-27

## 1. Today's Highlights

A dense release window (b11901–b11913) landed mostly on non-CUDA backends: Hexagon got VTCM sizing and MUL_MAT_ID row-skipping, Vulkan gained an RMS-norm subgroup optimization, and SYCL saw two memory/launch refinements. On the model side, MoE amplitude (amax) rescaling was extended to the Laguna architecture to fix Metal overflow on larger prefills. Meanwhile, the issue tracker is dominated by multi-GPU and long-context correctness problems (HIP gfx1151 wrong logits, SYCL DeltaNet token soup, Vulkan int8 matmul), several of which now have fix PRs in flight.

## 2. Releases & Breaking Changes

- **b11908** — `llama : move no_alloc out of llama_hparams` ([#31141](https://github.com/ggml-org/llama.cpp/pull/31141)). Internal refactor of the memory planner; context/graph parameterization changes for anyone touching `llama_hparams` downstream.
- **b11907** — `models : replace ggml_tensor** out-params with output structs` ([#31142](https://github.com/ggml-org/llama.cpp/pull/31142)). Graph builders for hyper-connections and DSA now return a struct rather than mutating `ggml_tensor**` out-params. Affects out-of-tree model additions.
- **PR #31200** — `llama : remove obsolete n_pad from memory instances` ([#31200](https://github.com/ggml-org/llama.cpp/pull/31200)). Dead since #16812; all callers passed `n_pad = 1`. No behavioral change expected.
- **PR #31217** — `ggml-rpc: fix integer overflow in ggml_nbytes()` ([#31217](https://github.com/ggml-org/llama.cpp/pull/31217)). Security-relevant: a malicious RPC peer could pass an oversized `ne[]`/`nb[]` and trigger an out-of-bounds read past the deserialization bounds check. **If you run `ggml-rpc-server` on an untrusted network, treat this as a security fix.**

## 3. New Model & Hardware Support

- **Laguna (MoE)** — amax rescaling enabled in `build_moe_ffn` (b11912, [#31147](https://github.com/ggml-org/llama.cpp/pull/31147)). Brings Laguna in line with Mistral4, Mellum, and Flint for f16 activation rescaling; explicitly declares Laguna SM tensor support.
- **DeepSeek-V4.1-Flash** — model conversion/PR work ongoing ([#31086](https://github.com/ggml-org/llama.cpp/pull/31086)), but see the correctness bug in §5 before using it.
- **Hexagon** — new `GGML_HEXAGON_VTCM_SIZE` build knob (b11913, [#31221](https://github.com/ggml-org/llama.cpp/pull/31221)) for configuring on-die VTCM (TCM) capacity; relevant to Snapdragon NPU deployments.
- **XDNA backend** — feature request still open with strong community support ([#21725](https://github.com/ggml-org/llama.cpp/issues/21725), 39 👍). Not yet implemented.
- **GigaChat 3.5 (432B-A28B MoE)** — conversion PR open ([#25342](https://github.com/ggml-org/llama.cpp/pull/25342)).
- **CUDA FA head sizes 40/72** — previously fell back to the tile kernel; MMA path being extended for Gemma 3/4 and Qwen3-VL vision towers ([#30285](https://github.com/ggml-org/llama.cpp/pull/30285)).

## 4. Performance & Optimization

**Landed:**
- **Hexagon MUL_MAT_ID row skipping** (b11909, [#31169](https://github.com/ggml-org/llama.cpp/pull/31169)) — vectorized row zeroing and skip support added to fused `MM_ID_NX` kernels.
- **Vulkan RMS-norm** (b11905, [#29882](https://github.com/ggml-org/llama.cpp/pull/29882)) — subgroup-reduction based RMS norm with a fast path that skips the second subgroup add; AMD-specific vendor tuning included.
- **SYCL** — plain MMVQ launch triples templated (b11904, [#31013](https://github.com/ggml-org/llama.cpp/pull/31013)); reorder temp memory now bounded to 32 MiB (b11901, [#31062](https://github.com/ggml-org/llama.cpp/pull/31062)).
- **ggml-cpu concat rewrite** (b11906, [#31179](https://github.com/ggml-org/llama.cpp/pull/31179)) — single row kernel for all types, dense source rows become one memcpy including quantized types.

**In progress / noteworthy:**
- **SYCL `-sm tensor` prompt eval +19%** (mean across runs; range +16.7% to +20.6%) on dual Arc Pro B70s via a faster `ggml_sycl_comm_exchange()`, with no PPL change ([#30956](https://github.com/ggml-org/llama.cpp/pull/30956)). This is the most concrete throughput number in today's data.
- **SYCL graph record & replay** — CUDA-graph equivalent ported to SYCL ([#28725](https://github.com/ggml-org/llama.cpp/pull/28725), merge-ready).
- **ggml-cpu dynamic reshape/splitting** for large single-row ops when `nrows < nth` ([#31218](https://github.com/ggml-org/llama.cpp/pull/31218)).
- **IQ4 quantization speedup** — bit-identical `IQ4_NL`/`IQ4_XS` creation by precomputing the 15 halfway values instead of binary search ([#31201](https://github.com/ggml-org/llama.cpp/pull/31201)).
- **Intel Vulkan FA prefill kernel** ([#29357](https://github.com/ggml-org/llama.cpp/pull/29357)).

## 5. Stability & Regressions

Ranked by severity:

1. **DeepSeek-V4.1-Flash single-token output corruption on cached prefix reuse** ([#30944](https://github.com/ggml-org/llama.cpp/issues/30944)) — isolated to the Engram n-gram history path, reproduces with both `--lazy-mode` settings. Draft PR #30817. **Do not deploy for prefix-cached serving.**
2. **qwen4exp `ggml_abort` with merged tensors from #31028** ([#31189](https://github.com/ggml-org/llama.cpp/issues/31189)) — fresh report, Vulkan on Ryzen AI Max+ 395. Regression from a recent merge.
3. **SYCL DeltaNet token soup on long prompts** ([#29183](https://github.com/ggml-org/llama.cpp/issues/29183)) — affects Qwen3.6, Qwen3.8, Nemotron on Arc Pro B70.
4. **HIP gfx1151 wrong logits (not a crash)** ([#28211](https://github.com/ggml-org/llama.cpp/issues/28211)) — triggered by prompts longer than `n_ubatch`; silent corruption is worse than a crash for serving.
5. **ggml-rpc integer overflow → OOB read** ([#31217](https://github.com/ggml-org/llama.cpp/pull/31217)) — fix PR open, not yet merged. Security.
6. **WebUI `?q=` instruction injection** ([#25790](https://github.com/ggml-org/llama.cpp/issues/25790)) — open security issue, no fix PR referenced.
7. **Vulkan coopmat1 int8 matmul A-prefetch OOB** ([#30283](https://github.com/ggml-org/llama.cpp/pull/30283)) — fix PR open; zeroes B past `end_k` but not A. Affects non-multiple-of-`BK*BK_STEP` K dimensions.
8. **Vulkan/RADV compile break with glslc lacking `GL_KHR_cooperative_matrix`** ([#29373](https://github.com/ggml-org/llama.cpp/issues/29373)) — `fa_decode` shaders built as coopmat unconditionally since #24406.
9. **OpenCL KV-cache view write dropped on state restore** ([#30471](https://github.com/ggml-org/llama.cpp/pull/30471)) — fix landed in b11910.
10. **MCP stdio server deadlock on tool calls >~1–5 KB** ([#28723](https://github.com/ggml-org/llama.cpp/issues/28723)) — Windows, persists across b10472–b10900.
11. **Vulkan RDNA3 prompt-processing regression since b10780** ([#28752](https://github.com/ggml-org/llama.cpp/issues/28752)) — closed, but confirms a several-week regression window worth tracking if you pin builds.

Also of note: MTP (multi-token prediction) has two separate correctness reports — inter-request state bleed ([#26425](https://github.com/ggml-org/llama.cpp/issues/26425)) and CUDA lockups under `--split-mode tensor` ([#27122](https://github.com/ggml-org/llama.cpp/issues/27122)).

## 6. What This Means for Application Developers

- **Multi-GPU is the riskiest configuration right now.** HIP tensor-parallel, SYCL `-sm tensor`, and MTP combined with TP all have open correctness or stability reports. If you're serving on Strix Halo (`gfx1151`) or multi-Arc, validate outputs against a single-device baseline before trusting them — issue #28211 is silent corruption, not a crash.
- **Prompt-prefix caching needs verification per model.** The DeepSeek-V4.1-Flash Engram bug is specifically a prefix-reuse corruption. If you run any cache-heavy serving setup, add an eval that compares cached vs. cold prompts for your target model.
- **Server-side momentum is real.** Cached-prompt restoration retry after clearing idle slots ([#30997](https://github.com/ggml-org/llama.cpp/pull/30997)), version info in the startup log ([#30392](https://github.com/ggml-org/llama.cpp/pull/30392)), and the tool registry refactor ([#20673](https://github.com/ggml-org/llama.cpp/issues/20673), closed) are all moving. The server is becoming the primary surface for agents/MCP rather than the CLI.
- **Watch the API surface.** Output-struct refactors in graph builders (#31142) and `no_alloc` relocation (#31141) signal maintainers are cleaning up interfaces for out-of-tree model integrations. If you patch llama.cpp for custom architectures, budget for rebase work.
- **SYCL is closing the gap on tensor-parallel.** The +19% prompt-eval gain from #30956 makes `-sm tensor` competitive with `-sm layer` on Arc Pro B70s — meaningful if you're cost-optimizing Intel inference rigs.
- **RPC deployments: patch to #31217.** The `ggml_nbytes()` overflow is reachable from a malicious RPC peer and bypasses the deserialization bounds check.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-10-27

## 1. Today's Highlights

MLX gained a meaningful batch of work today: DFlash2 speculative decoding support, YaRN RoPE scaling for Qwen3/Qwen3.5, and an MLX/MLX-C version bump that speeds up prompt processing for Gemma/Flint/Laguna via the new `window_size` feature. On the AMD/Vulkan side, two regressions are gaining traction — a 16 GB Radeon Pro 5700 XT returning empty responses for GPT-OSS 20B (#19060) and a ~30× generation throughput collapse on RADV with prompt cache enabled (#19201). Separately, a cluster of `ollama launch opencode` breakages against OpenCode v2 has multiple fix PRs in flight.

## 2. Releases & Breaking Changes

- **v0.40.12-rc0** — release candidate including MLX small-image detail preservation for compact Gemma 4 vision towers ([PR #19247](https://github.com/ollama/ollama/pull/19247)), MLX/MLX-C version bump for prompt speed-up ([PR #19291](https://github.com/ollama/ollama/pull/19291)), and DFlash2 support ([PR #19149](https://github.com/ollama/ollama/pull/19149)).
- **`/v1/systemone` behavior change since 0.40.4** — GGUF models declaring `CAPABILITY decision` without a `decision.type` key are now rejected with HTTP 400 and a "format no longer supported" message; previously worked on 0.40.3 ([#19292](https://github.com/ollama/ollama/issues/19292)). No fix PR yet — this is a real migration/regression concern for decision-model users.
- **`ollama launch opencode` broken on OpenCode v2.1.4** — `--model` flag removed from the bare command, and `opencode debug config` now returns an array rather than an object ([#19303](https://github.com/ollama/ollama/issues/19303), [#19296](https://github.com/ollama/ollama/issues/19296)). Fix PRs open: [#19310](https://github.com/ollama/ollama/pull/19310), [#19307](https://github.com/ollama/ollama/pull/19307), [#19298](https://github.com/ollama/ollama/pull/19298).
- **CLI behavior**: running `ollama` with no arguments will now print help and exit (root welcome entry point removed) ([PR #19248](https://github.com/ollama/ollama/pull/19248)).

## 3. New Model & Hardware Support

- **DFlash2** speculative decoding added to MLX backend — block-local dynamic convolutions plus a candidate selector that walks a chain conditioning each pick on its predecessor ([PR #19149](https://github.com/ollama/ollama/pull/19149), merged).
- **YaRN RoPE scaling** for Qwen3 and Qwen3.5 in MLX, including mRoPE and partial-rotation cases; adds fixtures for prefill/decode ([PR #19231](https://github.com/ollama/ollama/pull/19231)).
- **Intel macOS 12/13 (Monterey)** — community member has a working build of v0.40.11 for 2015 Intel iMacs; upstream currently requires macOS 14 ([#19308](https://github.com/ollama/ollama/issues/19308)). Not merged — proposal only.
- **HarmonyOS PC** native support requested, starting with CPU inference ([#19294](https://github.com/ollama/ollama/issues/19294)).
- **Korean TTS** support requested for the `phonon:40m-multilingual` model (currently EN/FR/DE/ES/PT) ([#19295](https://github.com/ollama/ollama/issues/19295)).
- **deepseek-v4.1-flash** downloadable model files requested; user also asks why Ollama paused downloadable weights alongside the cloud version ([#18379](https://github.com/ollama/ollama/issues/18379)).

## 4. Performance & Optimization

- **MLX/MLX-C version bump** leverages the new `window_size` feature to speed up prompt processing for Gemma, Flint, and Laguna models ([PR #19291](https://github.com/ollama/ollama/pull/19291)). Concrete numbers not published in the PR text.
- **Vulkan/RADV prompt-cache regression under investigation** — a ~29.7× generation throughput collapse on the second identical request with the bundled llama.cpp host-memory prompt cache on RX 6600 XT / Ubuntu 24.04.5 / Ollama 0.40.8 ([#19201](https://github.com/ollama/ollama/issues/19201)). Untriaged.
- **Incorrect VRAM estimation** flagged again — Qwen2.5 7B 1M context (262k) only consumes ~10 GB even with `OLLAMA_KV_CACHE_TYPE=q8_0` and flash attention on; suspected under-allocation for long-context workloads ([#10128](https://github.com/ollama/ollama/issues/10128), historical, still open).
- **AMD Strix Halo (gfx1151) idle power regression** — holding ≥2 runner processes pins the iGPU at max clock (~25 W) even with zero in-flight requests; exactly one resident model idles clean ([#17958](https://github.com/ollama/ollama/issues/17958)).
- **Qwen3.5 4B GGUF prompt processing on 16 GB M4** — user requests guidance on whether observed prefill performance is expected, with loaded-runtime readings attached ([#19282](https://github.com/ollama/ollama/issues/19282)).

## 5. Stability & Regressions

Ranked by severity:

1. **`/v1/systemone` rejects previously-working GGUF decision models since 0.40.4** — hard HTTP 400, no workaround besides staying on 0.40.3 or re-downloading ([#19292](https://github.com/ollama/ollama/issues/19292)).
2. **macOS Metal crash on 0.40.9** — `mlx runner failed: panic: mlx: [METAL] Command buffer execution failed: Impacting Interactivity` during XML file analysis, returns HTTP 500 ([#19278](https://github.com/ollama/ollama/issues/19278)).
3. **Vulkan/RADV ~30× slowdown after first request with prompt cache** ([#19201](https://github.com/ollama/ollama/issues/19201)).
4. **GPT-OSS 20B empty response on AMD Radeon Pro 5700 XT via Vulkan** while CPU inference works — MXFP4 GGUF, 20.9B params, Windows 10 ([#19060](https://github.com/ollama/ollama/issues/19060)).
5. **Windows `/api/chat` connection resets after ~15s with large prompts** — reproducible on 0.40.4 / RTX 3090 / Qwen3.8-27B ([#19139](https://github.com/ollama/ollama/issues/19139)).
6. **`/api/chat` intermittent 500 after long streamed reply** — `llama-server apply-template error … write: broken pipe`, affects 0.40.8 and 0.40.11 on macOS; retry succeeds ([#19293](https://github.com/ollama/ollama/issues/19293)). Related fix in review: [#19309](https://github.com/ollama/ollama/pull/19309) and [#19304](https://github.com/ollama/ollama/pull/19304) preserve retained images and state during compaction body recovery.
7. **Gemma4 tool-call parser leaves arrays unclosed** when items hold long strings, causing calls to be dropped ([PR #19274](https://github.com/ollama/ollama/pull/19274), fixes [#19273](https://github.com/ollama/ollama/issues/19273)).
8. **`ornith:35b` RENDERER/PARSER emits raw special tokens and unparsed tool-call XML** in Claude Code / OpenAI-compat clients ([#16992](https://github.com/ollama/ollama/issues/16992)).
9. **Kimi-cli tool-only assistant turns** send `content: []` instead of null/empty — fixed by [PR #19312](https://github.com/ollama/ollama/pull/19312).
10. **Claude Code auto-compaction failure** with `deepseek-v4.1-flash:1017-cloud` — long-runner loops exhaust context without compacting ([#19249](https://github.com/ollama/ollama/issues/19249)).

## 6. What This Means for Application Developers

- **SDK/agent harness authors should audit empty-content handling.** The Kimi fix ([#19312](https://github.com/ollama/ollama/pull/19312)) confirms that different agent frameworks serialize tool-only turns differently (`[]` vs `null` vs `""`). If you build an OpenAI-compatible layer on top of Ollama, normalize these yourself rather than relying on parser heuristics.
- **Decision-model users on `/v1/systemone` should pin 0.40.3 or add an explicit `decision.type` to their Modelfile** until #19292 is resolved — the failure mode is a hard 400, not a graceful fallback.
- **If you run AMD/RADV hardware, disable the prompt cache or stay on ≤0.40.7** as a mitigation for the 30× regression. Vulkan users on GMKtec/Strix Halo-class hardware should also watch #17958 for idle power burn when multiple runners are warm.
- **`ollama launch opencode` is effectively broken against OpenCode v2** right now. Three competing fix PRs are open; until one lands, invoke OpenCode directly with `OPENCODE_CONFIG_CONTENT` populated, or downgrade OpenCode to v1.
- **Compaction/continuation flows are getting real attention** — #19309 and #19304 preserve tool screenshots, tool argument counts, and image-omission warnings across compaction. If you serve long agentic sessions via `/api/chat` or `/v1/chat/completions`, this reduces the "images vanish after compaction" class of bugs.
- **Legacy Intel Mac users** without an easy path to macOS 14 have a community build of v0.40.11 (#19308) worth trialing; don't expect official support yet.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-10-27

## 1. Today's Highlights

No new releases landed in the last 24h, but maintainer activity remains intense with 116 issues and 299 PRs updated. A significant cluster of fixes targets the proxy's cost-accounting layer: DB-only deployments losing pricing on reloads, temporary member budget increases discarding reset schedules, and guardrail step attribution in spend logs. On the security/stability side, multiple PRs close a revoked-session authorization gap in the MCP gateway and scope Anthropic OAuth tokens away from third-party `api_base` hosts.

## 2. Releases & Breaking Changes

No releases in the last 24h.

Notable **behavioral changes in open PRs** worth flagging for config review:
- **`[risk:high]` Guardrail redaction scope change** ([#47122](https://github.com/BerriAI/litellm/pull/47122)): the hide-secrets guardrail will now also mask secrets in tool results, tool call arguments, tool inputs, and system prompts — content that previously reached the model untouched. Tool history and system prompts will be inspected for the first time; review redaction policies before adopting.
- **Guardrail header semantics fix** ([#48472](https://github.com/BerriAI/litellm/pull/48472)): `x-litellm-applied-guardrails` and spend logs will list only guardrails that actually executed, not the full pipeline. If downstream tooling parses this header, update expectations.
- **Migration preflight** ([#48493](https://github.com/BerriAI/litellm/pull/48493)): the proxy will refuse to run migrations that existing rows would break, instead of failing mid-migration. Deployments with non-empty `LiteLLM_SpendLogs` or index dependencies should expect explicit preflight failures.

## 3. New Model & Hardware Support

- **Refuseless provider registration** ([#48497](https://github.com/BerriAI/litellm/pull/48497)): adds Chat Completions and native Responses routes, six models with pricing, limits, and capability metadata.
- **Abliteration models** ([#48498](https://github.com/BerriAI/litellm/pull/48498)): four model entries with cache prices and capabilities; completes enum registration for reasoning-effort preservation.
- **Bedrock OpenAI GPT context-window correction** ([#48479](https://github.com/BerriAI/litellm/pull/48479)): corrects `max_input_tokens` for Bedrock OpenAI model cards (context window minus max output, e.g. 1,050K for GPT) and adds Mantle token counting for `claude-opus-5-5`.
- **Azure GPT-Image-2 pricing entry requested** ([#26765](https://github.com/BerriAI/litellm/issues/26765), closed): `azure_ai/gpt-image-2` added to `model_prices_and_context_window.json`.

## 4. Performance & Optimization

- **Multimodal quota estimates unified** ([#48099](https://github.com/BerriAI/litellm/pull/48099)): chat image/audio requests currently pass TPM admission because only text is counted, while Responses overcounts encoded media as text. The PR introduces a shared media measurement with model-aware image estimates and duration-based audio estimates — this closes a real admission-control hole for multimodal traffic.
- **Typed RedisCache operations** ([#48483](https://github.com/BerriAI/litellm/pull/48483)): internal callers move off raw redis-py clients/scripts/pipelines onto typed operations. Existing raw-access APIs remain, but the new surface is flagged experimental.
- **Lifespan-owned DB dependency foundation** ([#48496](https://github.com/BerriAI/litellm/pull/48496)): typed dependencies preparing for a future Rust backend to replace Prisma without handler rewrites.
- **Rust dependency bump** ([#44712](https://github.com/BerriAI/litellm/pull/44712)): `rustls` 0.23.42 → 0.23.45 in `/litellm-rust`.

## 5. Stability & Regressions

Ranked by severity:

1. **Revoked UI sessions authorize new gateway tokens** (MCP) — *fix PRs open*. A saved UI cookie could authorize gateway tokens after logout deleted its session. Two competing fixes: [#47399](https://github.com/BerriAI/litellm/pull/47399) (verify `_session_key_is_live` in `_session_cookie_user_id`) and [#48494](https://github.com/BerriAI/litellm/pull/48494) (require live session at authorization start, connect-flow read, and consent completion).
2. **Anthropic OAuth token leaked to third-party `api_base`** — *fix PR open*. Requests with a third-party `api_base` forwarded the client's Anthropic OAuth token even with `forward_llm_provider_auth_headers: false`. Fix scopes credentials to `api.anthropic.com` ([#42490](https://github.com/BerriAI/litellm/pull/42490)).
3. **DB-only deployments priced at $0 after reload** — *fix merged/closed*. Proxies with empty `model_list` and `STORE_MODEL_IN_DB=True` lost custom pricing on every Price Data Reload; native `/v1/messages` requests logged $0 spend until restart ([#43444](https://github.com/BerriAI/litellm/issues/43444), fixed by [#48486](https://github.com/BerriAI/litellm/pull/48486)).
4. **Temp budget increase drops team reset schedule** — *fix closed*. Giving a member inheriting the team default a temporary increase moved them onto a budget row with no reset schedule, so spend never reset and clearing the increase left no budget ([#48495](https://github.com/BerriAI/litellm/pull/48495)).
5. **Cache-hit spend attribution semantics unresolved** — *open, 26 comments*. On response-cache hits, `spend_logs` writes `spend = 0` but replays original token counts; which basis token reports should aggregate is still undecided ([#39057](https://github.com/BerriAI/litellm/issues/39057)).
6. **Classifier cost not attributed to spend/budgets** ([#46469](https://github.com/BerriAI/litellm/issues/46469), closed): `complexity_router` LLM classifier cost appears only in `routing_decision.classifier_cost`.
7. **`/v1/responses` streaming error handler masks original errors** ([#38511](https://github.com/BerriAI/litellm/issues/38511), closed): `AttributeError` on `completed_response` hid the underlying failure.
8. **GZipBufferedResponseMiddleware withholds SSE headers until first chunk** ([#46659](https://github.com/BerriAI/litellm/issues/46659), closed): MCP `tools/call` streams started only at the 15s ping since v1.105.0.
9. **`temperature` still advertised for Claude Opus 4.7 but rejected by Anthropic** ([#26444](https://github.com/BerriAI/litellm/issues/26444), open): `AnthropicConfig.get_supported_openai_params()` is out of sync.
10. **`temperature`-style parameter drift on Fireworks Kimi 2.6** ([#26257](https://github.com/BerriAI/litellm/issues/26257), closed): `tool_choice` unsupported but reported.
11. **Scaleway embeddings routing broken** ([#34503](https://github.com/BerriAI/litellm/issues/34503), open): `embedding()` raises `LiteLLMUnknownProvider`.
12. **Gemini custom `api_base` context caching** ([#34872](https://github.com/BerriAI/litellm/issues/34872), open): invalid cache URL and malformed auth header.
13. **`llm_requests_hanging` alerts ignore digest mode** ([#22753](https://github.com/BerriAI/litellm/issues/22753), open): Slack messages sent on every check despite `digest: true`.
14. **Model param deletion not persisted in UI** ([#23998](https://github.com/BerriAI/litellm/issues/23998)) — fix PR open ([#48456](https://github.com/BerriAI/litellm/pull/48456)).
15. **Timeout reported as `None seconds`** ([#14635](https://github.com/BerriAI/litellm/issues/14635), closed/stale, 👍9): log/measurement bug, not a functional timeout.

## 6. What This Means for Application Developers

- **If you run multimodal agents, TPM admission is currently unreliable** — text-only counting means large image/audio payloads slip through quotas. Watch [#48099](https://github.com/BerriAI/litellm/pull/48099); plan capacity assuming multimodal estimates will tighten.
- **If you log usage from cache hits, downstream reports are ambiguous today.** `spend_logs` writes `spend = 0` with original token counts ([#39057](https://github.com/BerriAI/litellm/issues/39057)). Deduplicate on `response.id` or join against request IDs rather than summing token columns naively.
- **If you route Anthropic traffic through OpenAI-compatible vLLM backends**, the `/v1/messages` streaming translation bug ([#29286](https://github.com/BerriAI/litellm/issues/29286), closed) emitted empty `input_json_delta` instead of `text_delta` — verify your SDK version before trusting streamed text.
- **Check session revocation assumptions in MCP setups.** The two open fixes ([#47399](https://github.com/BerriAI/litellm/pull/47399), [#48494](https://github.com/BerriAI/litellm/pull/48494)) change whether logged-out cookies can mint gateway tokens; audit consent flows accordingly.
- **Bedrock OpenAI GPT token limits changed in an open PR** ([#48479](https://github.com/BerriAI/litellm/pull/48479)): if you size prompts against `max_input_tokens`, re-check after merge — the shared input/output window is being split correctly.
- **UI model-parameter deletion is unreliable until [#48456](https://github.com/BerriAI/litellm/pull/48456) lands** — deleted keys can silently reappear from unsaved defaults; verify saved JSON after edits.
- **New provider surfaces (Refuseless, Abliteration) are arriving with pricing metadata** — if you use cost-based routing, these are now first-class citizens in the model catalog.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-10-27

## 1. Today's Highlights

Unsloth shipped **v0.1.911-beta**, adding scheduled tasks (run a prompt on a cron with a local model or an API), **MiniMax-M3.1-Flash** support, FLUX-3 edit support, image face touch-ups, and Mac chat/performance gains. In parallel, a dense PR queue from the core team targets **diffusion GPU correctness and determinism** (Qwen-Image-2.1 seed reproducibility, ROCm attention routing, W8A8 memory regressions) alongside FSDP2/Tensor-Parallel fp16 numerics. On the user-report side, the highest-signal items are Apple Silicon NVFP4 CPU fallback for MiniMax-M3.1 and a DeepSeek V4.1-Flash GGUF chat-template bug that silently corrupts conversation history.

## 2. Releases & Breaking Changes

- **v0.1.911-beta — Scheduled + MiniMax-M3.1-Flash + Perf Gains**
  Adds scheduled tasks (local model or API), FLUX-3 edit support, MiniMax-M3.1-Flash, image face touch-ups, faster performance and chats on Mac.
  https://github.com/unslothai/unsloth/releases

No documented API/config removals or migration notes in this window. Note the related open request for a **preferred default quantization** setting when none is specified in an API request (currently falls back to `UD-Q5_K_XL`); this is a behavior change request, not a landed break — https://github.com/unslothai/unsloth/issues/14362

## 3. New Model & Hardware Support

- **MiniMax-M3.1-Flash** — newly supported in v0.1.911-beta (text). https://github.com/unslothai/unsloth/releases
- **FLUX-3 edit** — image edit support added alongside the release. https://github.com/unslothai/unsloth/releases
- **Apple Silicon / Metal (NVFP4)** — MiniMax-M3.1 GGUF reports NVFP4 falling back to CPU despite 61/61 layers offloaded to GPU on macOS 27.0.1 arm64; open, needs triage. https://github.com/unslothai/unsloth/issues/15409
- **AMD ROCm** — mixed NVIDIA+AMD Linux systems fail to surface AMD GPUs in the web UI and with custom llama.cpp builds (open). https://github.com/unslothai/unsloth/issues/15444
- **Vulkan backend** — text generation failure with MiniCPM-V-4.7-1B (closed). https://github.com/unslothai/unsloth/issues/14987
- **DeepSeek V4.1 (1017) uncensored hub models** — 100% load failure reported from the model hub (open). https://github.com/unslothai/unsloth/issues/15412
- **Requested, not yet supported:** Cohere `cohere-transcribe-03-2026` (conformer ASR) — closed without support. https://github.com/unslothai/unsloth/issues/5789
- **Requested infra:** native HF-Mirror support with parallel downloads (closed). https://github.com/unslothai/unsloth/issues/15274

## 4. Performance & Optimization

**In progress (open PRs):**
- **Diffusion W8A8 linear** — keep compiled int8 W8A8 at or below the eager peak; a chunk budget of `1<<27` elements (4× eager `1<<25`) pushed peak memory above eager. Fix restores budget and honors `force-eager`. https://github.com/unslothai/unsloth/pull/15456
- **ROCm self/cross attention** — stop `_rocm_flash_length_reason` guarding query length on key length; in traced graphs cross attention has independent symbols, causing misrouting. https://github.com/unslothai/unsloth/pull/15458
- **Video compile pre-seeding** — pre-seed float specializations for denoiser regional compile (Wan2.1, Wan2.2-TI2V-5B, HunyuanVideo-1.5, dense MiniMax-H3) to avoid double-tracing per block type under `dynamic=True`. https://github.com/unslothai/unsloth/pull/15406
- **SDXL ControlNet on T4** — prevent OOM/guard rejection after resident promotion on 15–16 GB cards by not charging ControlNet against the post-load budget. https://github.com/unslothai/unsloth/pull/15446
- **FSDP2 fp16 scaler** — agree on overflow across ranks without explicit `unscale_`; collapse fused-optimizer flags to a single 0/1 over all devices. https://github.com/unslothai/unsloth/pull/15416
- **Tensor parallel fp16 dp gradients** — average in fp32 so finite fp16 gradients cannot sum to inf. https://github.com/unslothai/unsloth/pull/15415
- **gpt-oss expert layout probe** — read `config.transformers_weights` before standard filenames when deciding fused vs. split bitsandbytes experts. https://github.com/unslothai/unsloth/pull/15386

**Notable user-reported perf/degradation issues:**
- `scripts/enforce_kwargs_spacing.py` is extremely slow in pre-commit.ci, consuming disproportionate CI compute (closed). https://github.com/unslothai/unsloth/issues/14174
- Typing in the Edit image "Instructions" box is extremely slow during generation on AMD ROCm (closed). https://github.com/unslothai/unsloth/issues/15221

## 5. Stability & Regressions

Ranked by severity:

1. **DeepSeek V4.1-Flash GGUF chat template rejects ordinary discussion of the image marker**, breaking conversation history. Patch supplied and verified by reporter; still open. — High impact, silent corruption. https://github.com/unslothai/unsloth/issues/15285
2. **Auto-compact ignores image tokens on local GGUF chats** → tool loops with screenshots overflow the context window (closed). https://github.com/unslothai/unsloth/issues/14968
3. **Anthropic passthrough `/v1/messages` returns unrecoverable 400 `exceed_context_size_error`** instead of applying auto-compaction (open). https://github.com/unslothai/unsloth/issues/15417
4. **Qwen-Image-2.1 non-determinism** — same seed and settings produce different images across fresh Studio processes (int8 DiT + compile + CUDA graph). Fix PR pins the reduction-config filter. https://github.com/unslothai/unsloth/pull/15455
5. **MiniMax-M3.1 GGUF NVFP4 CPU fallback on Apple Silicon** despite full layer offload (open). https://github.com/unslothai/unsloth/issues/15409
6. **Linux desktop WebKitWebProcess SIGABRT** with AT-SPI/atk-bridge active on KDE Plasma X11 (open). https://github.com/unslothai/unsloth/issues/15260
7. **Potential memory leak** — Drive C loses 200–400 MB per use of Unsloth Desktop with no clear residual cleanup path (open). https://github.com/unslothai/unsloth/issues/14487
8. **Qwen3.5-2B resume broken** — `_MODEL_WEIGHT_RE` misses `model.safetensors-00001-of-00001.safetensors` (open, Studio). https://github.com/unslothai/unsloth/issues/15405
9. **FSDP2 `native_fsdp2_unsharded`** cleared `post_forward_mesh_info` before gathering `unshard()` (closed). https://github.com/unslothai/unsloth/pull/15426
10. **Studio tests + telemetry** — HF Hub 1.33 agent detection issues an extra `GET /api/agent-harnesses` through mocked clients; and two spoof-safety lint failures on `main` from `test_accelerator_skip_guards.py`. Both have fix PRs. https://github.com/unslothai/unsloth/pull/15453 · https://github.com/unslothai/unsloth/pull/15454

**Also of note:** fine-tuned models served via the OpenAI-compatible API were answered *by the base model* — calling chat completions with the job's `fine_tuned_model` name returned the already-loaded base weights verbatim. Fix PR: https://github.com/unslothai/unsloth/pull/15449

## 6. What This Means for Application Developers

- **Agent/context handling has an open correctness gap.** Anthropic `/v1/messages` passthrough does not auto-compact on overflow and instead hard-fails with a 400, so any Claude-compatible client routing through Unsloth must implement its own context budgeting or pre-trim history. See #15417.
- **Fine-tune → serve handoff deserves a check.** PR #15449 indicates requests for a just-trained model name could silently be answered by the base model. If you train and immediately eval via the API, verify lineage (e.g., pin an explicit adapter path or compare outputs) until this merges.
- **Multimodal tool loops need headroom.** With local GGUFs, image tokens were being excluded from auto-compact accounting (#14968), so screenshot-driven agents could overflow context. Budget conservatively.
- **Determinism is not guaranteed on diffusion paths.** Qwen-Image-2.1 could vary per process for a fixed seed (#15455); if you cache or diff generated images, do not rely on seed reproducibility until the pin lands.
- **Desktop is broadening into an agent runtime.** The incoming queue covers MCP persistence for `unsloth start codex` (#15452), agent access to manually opened browser tabs (#15447), full-page screenshots (#15448), and ACP support requests (#15356) — worth tracking if you plan to drive browser/UGC workflows through Studio.
- **Remote-provider plumbing is still limited.** Custom headers for OpenAI-compatible backends (e.g., LiteLLM passthrough for tracking or feature flags) are requested but not available (#14811) — relevant for multi-tenant or observability setups.
- **Scheduled tasks + MiniMax-M3.1-Flash in v0.1.911-beta** open a cheap path to recurring local/API workloads. Pin the version if you depend on Mac chat performance, and smoke-test FLUX-3 edit on your target backend (macOS GGUF edit was broken for `flux-3-image-klein-GGUF` in #15241).

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*