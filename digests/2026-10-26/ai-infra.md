# AI Infrastructure Digest 2026-10-26

> Generated: 2026-10-25 23:09 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Date: 2026-10-26**

---

## 1. Ecosystem Overview

The AI infrastructure stack continues to specialize along layer boundaries, with serving engines (vLLM, SGLang) competing on frontier-hardware kernel work while local runtimes (llama.cpp, Ollama) focus on backend parity and correctness. Across all six projects, no releases landed in the last 24h — a notable pause that suggests teams are consolidating before Q4 feature pushes. Activity is dominated by three themes: **next-generation model bring-up** (DeepSeek V4.1, Kimi-K3, Qwen3.8-Flash-Next, GLM-5.3, Gemma 4), **hardware platform expansion** (SM107/SM120 Blackwell-refresh, gfx1150/1151 RDNA, Xe2 SYCL), and **silent-correctness bugs** in quantized/cached paths. Notably, gateway-layer (LiteLLM) and local-runtime (Ollama, llama.cpp) projects are being hit hardest by *user-visible* correctness issues rather than throughput regressions. Meanwhile, the appearance of explicit AI-generated kernel PRs in vLLM and a native Rust gateway in LiteLLM signals the next wave of infrastructure churn.

---

## 2. Activity Comparison

| Project | Issues (active/recent) | PRs (active/recent) | Releases (last 24h) | Activity Signal |
|---|---|---|---|---|
| **vLLM** | ~15 notable (starting with #63505 crash) | Heavy: ~15+ kernel/optimization PRs | **0** (last: v0.32 nightly line) | Very high — decode-path fusion for DSv4.1 |
| **SGLang** | ~10 notable + ~14 closed-as-inactive | ~413 active PRs | **0** | Very high — Kimi-K3 + Rust `api.v1` migration |
| **llama.cpp** | ~8 open regressions | Multiple landed + in-flight | **9 builds** (b11877–b11887) | High — CUDA prefill fusion + grammar policy |
| **Ollama** | ~10 open (tool-calling, ROCm, Metal) | ~6 fix PRs | **0** | Moderate — runner-level parity fixes |
| **LiteLLM** | ~15 open bugs (cost/budget/OOM) | ~12 fix PRs + Rust-gateway stack | **4 patches** (v1.106.4, v1.105.5, v1.104.7, v1.103.9) | Very high — Rust gateway landing |
| **Unsloth** | ~10 open (Studio regressions) | ~8 PRs | **0** | Moderate — Studio beta fallout + Flows |

**Reading:** LiteLLM is the only project shipping releases (4 patches), while llama.cpp is the only project shipping many builds (9). vLLM and SGLang are in heavy *PR-only* mode — significant code in flight, nothing stabilized. Unsloth and Ollama are in fix-heavy, feature-light cycles dominated by regression management.

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | LiteLLM | Unsloth |
|---|---|---|---|---|---|---|
| **DeepSeek V4 / V4.1** | ✅ + DSpark spec-decode under PP (#63619); SM90 mega-MoE still gapped (#57772) | 〰️ (DeepSeek-V4-Flash DeepEP on SM90 closed inactive) | — | — | ✅ reasoning_effort fix (#27439) | ✅ GGUF chat-template bug (#15285, PR #15288) |
| **Kimi-K3** | Tracking (#50587); sub-PRs landing | ✅ ✅ Core focus: SM107 decode (#46474), FP4 MoE routing (#46475) | — | — | — | — |
| **Qwen3.8-Flash-Next / Qwen4exp** | ✅ but broken on GB10 (#62776) | ✅ GLM-5.3-Flash on SM90 (#45373) | ✅ MRoPE fusion (b11878, b11886) | 〰️ (Qwen3.5 4B perf validation requested) | — | — |
| **Llama 3.2 / NextTokenStrategy** | ✅ PR #63589 (`/v1/systemone`, `/v1/decisions`) | — | — | — | — | — |
| **GLM-5.3-Flash** | — | ✅ SM90 tracking (#45373) | — | — | ✅ Vertex Model Garden (partial, #48238) | — |
| **Gemma 4 / Gemma-3** | ✅ (parser bug #51284) | — | ✅ Gemma 4 12B QAT in scope (Windows CUDA bug #30436) | ✅ parser fix (#19274) | — | 〰️ Gemma-3 FastDecision fails training (#14439) |
| **HunyuanImage-3** | — | ❌ Broken on CUDA (#46461) | — | — | — | — |
| **Beam model** | — | ✅ kernels PT 3/7 (#45254) | — | — | — | — |
| **Ministral / decision models** | — | — | — | — | ✅ Decision Models (#46901) | — |
| **Qwen3-TTS** | ⚠️ concurrency crash (#44933) | — | — | — | — | — |
| **Nanbeige4.3-33B** | — | — | — | — | — | 📩 Requested (#15278) |
| **Hy-MT2-30B-A3B** | ❌ closed stale (#46043) | — | — | — | — | — |

**Who's ahead:**
- **SGLang** clearly leads Kimi-K3 (frontier MoE) and has the broadest new-hardware coverage (AMD MI45x, Ryzen AI Halo, Apple Silicon roadmap still unclaimed).
- **vLLM** leads DeepSeek V4.1 with the deepest decode-fusion work but has a serious SM90 gap for DSv4/V4.1 mega-MoE kernels.
- **llama.cpp** leads on *local-model completeness* (Qwen4exp, RDNA4, SYCL Xe2) and is the only engine with concrete Gemma 4 QAT execution paths.
- **LiteLLM** wins on *provider breadth* (Sideren, Decision Models, Vertex Model Garden) but with quality gaps.
- **Ollama** is nearly out of the frontier-model race — MoE offload requests (#11772) still unfulfilled and no new model support landed.

---

## 4. Performance Frontier

Optimization effort is concentrated in distinct zones per project:

**KV cache** — the single most contentious area:
- vLLM: persistent-cache namespacing bug (#49261); HiSparse host KV pool via hugetlbfs (#58852); KV correctness tracking #63149.
- SGLang: HiCache PP-sync drain throughput regression (#45351); split-KV verify merge fixes (#44466/#44468).
- llama.cpp: RDNA4 32-value K-block decode rework (#30803) explicitly to fix quantized-KV slowness vs. f16.
- Ollama: none.
- Unsloth: KV-pool admission correctness — the *only* project fixing token *accounting* for KV budgets (#15294).

**Kernels / fusion** — the biggest engineering spend:
- vLLM: DeepSeek V4.1 flash-decode fusion stack (#63296 → #63579); Triton top-k regression on MiMo-V2.6 (#61998).
- SGLang: Kimi-K3 SM107 decode/MoE collective fusion (#46474, #46475); FP32 warp split-K GEMM (#46464); deterministic two-stage all-reduce for ROCm (#46325).
- llama.cpp: CUDA MMQ FFN gate+up fusion with GLU-in-writeback (b11879); SYCL DPAS quantized-KV flash attention (#31125); Metal GQA vec-decode in review (#30728).
- Ollama/LiteLLM/Unsloth: minimal kernel work — these are consumers, not producers, of kernels.

**Quantization:**
- llama.cpp: dominant — 4D-tensor quantization bug fix (#30820), SYCL vectorized dequant extended to K-quants/IQ3/MXFP4 (#30976).
- Unsloth: native int8 image transformers with g256 ConvRot rotation cached (#15289).
- vLLM: MXFP4→bf16 dequant forced on SM90 (#57772), NVFP4 torch.compile garbage (#48898).

**Distributed serving:**
- SGLang: prefill/decode `Transport` abstraction (#46455, #46460) — the most structured PD work.
- vLLM: DSpark spec-decode under PP (#63619); HiSparse double-pinning on K8s (#58852).
- Ollama: multi-GPU VRAM eviction race on 6-GPU hosts (#19279).

**Loader / cold-start:**
- SGLang's Weight Cache Daemon (#33522) is the standout: **306s → <1s** weight-load on Qwen3-235B FP8. This is a materially different ceiling than anything else in the digests.

**Verdict:** Kernel-level optimization leadership is split between **vLLM** (fused decode for DSv4.1) and **SGLang** (SM107 Kimi-K3 + ROCm determinism). **llama.cpp** leads on cross-backend quantized kernels. **SGLang** leads on cold-start economics.

---

## 5. Layer Positioning

| Layer | Project(s) | Role Today | Differentiator |
|---|---|---|---|
| **Production serving engine** | vLLM, SGLang | Multi-tenant GPU serving, PD disaggregation, frontier MoE | vLLM = breadth of model support; SGLang = PD/transport polish and AMD |
| **Local runtime** | llama.cpp, Ollama | Desktop/edge/Mac/consumer GPUs | llama.cpp = hardware coverage (SYCL/Vulkan/Metal/ROCm); Ollama = UX + cloud bridge |
| **LLM gateway** | LiteLLM | Multi-provider routing, budget enforcement, key management | Rust gateway migration is the strategic bet |
| **Training / fine-tuning** | Unsloth | LoRA/QLoRA, quantized training, Studio desktop | Native int8 + FSDP2 + Studio Flows (node editor) |

**Observations:**
- The **serving engines** are increasingly *kernel companies* and *model-quality companies* — the actual HTTP surface is being abstracted (SGLang's Rust `api.v1`, vLLM's Anthropic `/v1/messages` compat).
- The **gateway** layer remains weakly differentiated — LiteLLM's main threats are not competing gateways but *silent correctness bugs in its own cost/budget tracking* across multi-pod deployments.
- **Local runtimes** are converging on the "second-class citizen" problem for tool-calling and multimodal — Ollama and llama.cpp both ship parsers with silent-drop bugs (#19273, #51284).
- **Unsloth** is the only project here with an application-visible product layer (Studio) on top of a training lib, and it is being punished for it — 3 of its top-5 regressions are Studio-specific.

---

## 6. Trend Signals

**Signal 1 — Frontier MoE has bifurcated by hardware.**
Kimi-K3, DeepSeek V4.1, and GLM-5.3 are being tuned *specifically* for Blackwell-refresh (SM107) and GB300, while Hopper (SM90) is being treated as a degraded target (vLLM #57772, SGLang #45755, #45367). **Developers planning hardware refresh cycles should assume SM90 will not be the top-tier path in 2027.**

**Signal 2 — Silent-correctness bugs outnumber crash bugs.**
Across the six digests, the highest-severity open issues are repeatedly *silent wrong output* rather than crashes: vLLM NVFP4 garbage (#48898), SGLang MXFP4 wrong activation (#45755), llama.cpp prompt-cache LoRA contamination (#26207), Unsloth preserve_thinking forced (#15115). **Add output-hash regression tests against a golden model before adopting any new version.**

**Signal 3 — Tool-call parsing is the new "TLS handshake" bug class.**
Every project that exposes an OpenAI-compatible API shipped a tool-calling parser fix or bug this cycle: vLLM (qwen3_coder, gemma4, Anthropic 500), Ollama (#19273, #19151), LiteLLM (#26507, #48191, #48324), Unsloth (#15285). **Agent developers should normalize tool calls at their own layer and not trust the runtime's JSON extraction.**

**Signal 4 — Speculative decoding remains fragile under structured output.**
vLLM #61383 (XGrammar + DFlash intermittent termination), SGLang #43412 (spec-decode SIGKILL on non-greedy), llama.cpp DPAS kernel covering 1–31 query tokens "incl. spec-decode drafts." **Structured output + spec-decoding is a combination to disable for latency-critical flows.**

**Signal 5 — Cold-start is becoming a first-class metric.**
SGLang's 306s → <1s weight-load (#33522) is a category shift, not a tuning win. Combined with vLLM's K8s wedging issues on startup (#58852) and Ollama's fresh-install regression (#19276), **engine recovery time is emerging as a first-class KPI for autoscaling fleets.**

**Signal 6 — AI-generated kernel PRs are entering the mainstream code path.**
vLLM's DeepSeek V4.1 flash-decode stack (#63296–#63579) is *explicitly* self-labeled untested AI-generated code. This is a genuine governance inflection — **infra teams should treat "AI-generated" labels on kernel PRs as a require-manual-validation gate, not an advisory.**

**Signal 7 — The Rust rewrite is spreading.**
SGLang is migrating `sgl-processor`/`sgl-router` to a Rust server with shared `api.v1` (#45816), and LiteLLM has a stacked Rust gateway effort (#48337, #48338, #48350). **The Python control plane is being deprioritized in both projects — vendors building on top should not assume Python-side stability.**

**Signal 8 — DST and calendar boundaries are infrastructure bugs.**
LiteLLM's proxy OOM-kill during the DST fall-back hour (#48286) is a reminder that time-arithmetic in scheduled-job code is a production attack surface. **Audit cron/job-stagger logic in any Python control plane ahead of your next DST shift.**

---

### What to Watch This Week
- **vLLM:** whether #63505 (sm_86 PP=3 illegal memory access) gets a fix PR — currently a hard, no-workaround blocker.
- **SGLang:** whether the Kimi-K3 SM90 MXFP4 wrong-activation (#45755) resolves upstream in FlashInfer.
- **llama.cpp:** whether the Windows CUDA flash-attention IMA (#30436) gets a patch before the next build cut.
- **LiteLLM:** whether the DST OOM (#48286) and multi-pod budget-leak (#29142) enter the next patch line — both are silent-in-production class.
- **Unsloth:** whether Studio v0.1.910 rollback guidance appears or a patch ships (#15142, #15022).
- **Ollama:** whether the ROCm gfx1150 regression (#19290) is acknowledged by the team — currently only a user-side downgrade to 0.33.3.

---
*Report compiled from 2026-10-26 project digests. Data reflects GitHub activity within the stated 24-hour window.*

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-10-26

## 1. Today's Highlights
No releases landed in the last 24h, but activity is heavy on **DeepSeek V4.1 decode-path optimization** (a stacked chain of AI-generated attention/kernel-fusion PRs from @elvircrn) and on **KV cache correctness** (new tracking issue #63149 plus a persistent-cache namespacing bug #49261). On the stability side, the most severe new report is #63505 — a regression since v0.28.0 causing illegal memory access (Xid 31) on sm_86 with PP=3 and prefix caching for Qwen3.8-27B. ROCm also picked up multiple CI/bugfix PRs today.

## 2. Releases & Breaking Changes
None in the last 24h. (Note: no new tags, and no API/config deprecations announced today.)

## 3. New Model & Hardware Support
- **Llama for structured decisions** — PR #63589 registers `LlamaForCausalLM` with `NextTokenStrategy` for `/v1/systemone` and `/v1/decisions`, listing `meta-llama/Llama-3.2-1B-Instruct` as supported. https://github.com/vllm-project/vllm/pull/63589
- **DeepSeek V4.1 + DSpark speculative decoding under pipeline parallelism** — PR #63619 enables DSpark spec-decode with PP (depends on #63617 for KV allocation). https://github.com/vllm-project/vllm/pull/63619
- **Hy-MT2-30B-A3B (Tencent)** — model request closed as stale, not added. https://github.com/vllm-project/vllm/issues/46043
- **sm_121 (Blackwell) on aarch64** — still unsupported; open bug for DGX Spark / Acer GN100. https://github.com/vllm-project/vllm/issues/36821
- **Kimi K3 optimization** — tracking issue open; several sub-PRs landed, one (#50478) still pending. https://github.com/vllm-project/vllm/issues/50587

## 4. Performance & Optimization
- **DeepSeek V4.1 flash-decode fusion stack** (all flagged untested/AI-generated): fold SWA validity mask + tail fill into index kernels (#63296), batch per-group SWA decode index builds into one launch (#63393), remove per-step host metadata torch dispatches (#63523), and follow-ups on DFlash pad split / native decode lens / Gumbel finalize (#63579). Tracking PR #63308. https://github.com/vllm-project/vllm/pull/63308
- **Triton top-k kernel regression** — `_topk_topp_kernel` falls back to full-vocab search on MiMo-V2.6 logits because the Gaussian-fit pivot (from first 8192 logits) is too high for 6–10% of rows. https://github.com/vllm-project/vllm/issues/61998
- **ROCm AWQ slowdown** — AutoAWQ checkpoints never select the RDNA W4A16 kernel on gfx1151; AWQ decode is ~2.5× slower than BF16. https://github.com/vllm-project/vllm/issues/63455
- **DeepSeek-V4/V4.1 on SM90** — mega-MoE paths gated away from Hopper, forcing weight-only Marlin (dequant MXFP4→bf16). Feature request open. https://github.com/vllm-project/vllm/issues/57772
- **Qwen3.8-Flash-Next on DGX Spark TP2** — long-prefill periodically starves active decode for 3–7 minutes. https://github.com/vllm-project/vllm/issues/54919
- **HiSparse host KV pool** — PR #58852 proposes backing the 384–480 GiB pool with hugetlbfs to avoid double-pinning (cudaHostRegister + NIXL/RDMA) that wedges K8s nodes at startup. https://github.com/vllm-project/vllm/pull/58852
- **ROCm CI/perf fixes** — skip flaky AITER MoE fp8 test (#63559), keep AITER GDN fast path off for DS conv-state layout (#63558), NIXL PD side-channel port range fix (#63557). https://github.com/vllm-project/vllm/pull/63558

## 5. Stability & Regressions (by severity)
1. **Illegal memory access / gibberish, sm_86, PP=3** — Qwen3.8-27B (GDN hybrid) with prefix caching triggers Xid 31; regression since v0.28.0 (affects v0.31.0, v0.32.0). No fix PR yet. https://github.com/vllm-project/vllm/issues/63505
2. **Prompt truncation to ~2K tokens** — Qwen3.8-Flash-Next on GB10 (v0.32 nightly): content past `indexer_budget` (2048) is invisible to the model. https://github.com/vllm-project/vllm/issues/62776
3. **Spec-decode misdispatch → silent GDN state loss** — prefill with token count == `uniform_decode_query_len * num_reqs` is routed into the spec-decode FULL cudagraph; garbage output on hybrid/Qwen3-Next models (ROCM, MRv1-only). https://github.com/vllm-project/vllm/issues/53051
4. **NVFP4 garbage output under torch.compile** — per-rank K not 32-aligned (TP8, SM120) causes padded block-scale reads of stale memory; eager/Marlin/aligned-TP correct. https://github.com/vllm-project/vllm/issues/48898
5. **XGrammar intermittent termination** — V2 DFlash probabilistic drafting + block rejection. https://github.com/vllm-project/vllm/issues/61383
6. **Persistent KV offload cache not namespaced by model revision** — cache collisions across model updates. https://github.com/vllm-project/vllm/issues/49261
7. **Qwen3-TTS concurrency crash** — `ref_context_size` mismatch kills the stage engine instead of queueing when concurrency > `--max-num-seqs`. https://github.com/vllm-project/vllm/issues/44933
8. **Tool-call parser bugs** — qwen3_coder behavior changed between 0.22/0.23 (closed) https://github.com/vllm-project/vllm/issues/46493; gemma4 parser keeps literal quotes for array/object values. https://github.com/vllm-project/vllm/issues/51284
9. **Anthropic `/v1/messages` 500 on malformed tool args** — fix PR #57244 turns truncated/non-object args into `input: {}` with a warning. https://github.com/vllm-project/vllm/pull/57244
10. **RoPE NTK/Dynamic NTK OOB crash** — cos/sin cache length not scaled; fix PR #55910. https://github.com/vllm-project/vllm/pull/55910

## 6. What This Means for Application Developers
- **Pin your versions if you rely on Qwen3.8-27B + PP + prefix caching.** #63505 is a hard failure with no fix yet; consider disabling prefix caching or avoiding PP=3 on sm_86 until resolved.
- **Don't trust `--kv-cache-dtype auto` on Blackwell SM120 for DeepSeek-V4** — it can fail silently instead of resolving to `fp8_ds_mla` (#47174).
- **Structured output + speculative decoding is still fragile.** If you use XGrammar with DFlash probabilistic drafting, expect intermittent request termination (#61383); fall back to non-spec decode for latency-critical structured flows.
- **Tool-calling parsers are the most common source of user-visible breakage** this cycle (qwen3_coder, gemma4, Anthropic frontend). If you're on `/v1/messages` non-streaming, watch for #57244 to land — it converts a 500 into a degraded-but-usable response.
- **KV offload cache is not model-revision aware** (#49261). If you swap model weights in place, purge the offload cache to avoid serving stale KV entries.
- **ROCm users on RDNA (gfx1151):** AWQ currently gives you no speedup over BF16 (#63455); stick with BF16 or wait for the W4A16 kernel dispatch fix.
- **DeepSeek V4/V4.1 on H100/H20:** expect Marlin weight-only MoE rather than the new mega-MoE kernels — budget for dequant overhead in your capacity planning (#57772).
- **Watch the DSv4.1 fusion stack** (#63308 chain): if it lands cleanly it should meaningfully reduce decode host-dispatch overhead on 8×H200 PD deployments, but the PRs are explicitly self-labeled untested AI-generated code — validate before adopting.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-10-26

## 1. Today's Highlights

SGLang's Q4 roadmap activity is in full swing: four major roadmaps (#42473 general, #46462 AMD, #33522 fast recovery, #39499 dLLM serving) all saw updates in the last 24h, alongside 413 active PRs. The bulk of the day's engineering effort is centered on Kimi-K3 optimization (SM107 low-latency paths, FP4 MoE routing) and the shared `Transport` abstraction for prefill/decode backends (#46455, #46460). On the stability side, several pre-existing correctness bugs remain open around FlashInfer+MXFP4 on SM90 and speculative decoding crashes on pip CUDA 13 bundles.

## 2. Releases & Breaking Changes

No new releases in the last 24h.

Ongoing API-level work worth watching:
- **[RFC] Complete migration to shared `api.v1` backend API** (#45816) — `sgl-processor` and `sgl-router` are being migrated behind a Rust-server shared `Generate` API. Expect gradual deprecation of the Python-side generation path. https://github.com/sgl-project/sglang/issues/45816
- **[PD] Per-backend transport interface** (#46455) — formalizes Mooncake/NIXL/Mori under a common `Transport` contract (Step 2 of #34510). https://github.com/sgl-project/sglang/issues/46455
- **[PR] Extract MooncakeTransport behind common Transport interface** (#46460) — implementation of the above; preserves protocol and wire format. https://github.com/sgl-project/sglang/pull/46460
- **[PR] rust-server: render, tokenize, serve chat through sglang-processor** (#45449) and follow-up parity fix (#45659) — Rust server is losing model-specific tokenizer/template code in favor of `sglang-processor`. https://github.com/sgl-project/sglang/pull/45449

No breaking config changes landed today. Several `[inactive]`-closed issues include deprecation-style bugs (e.g. `--config` rejecting canonical `mamba-radix-cache-strategy` due to `DeprecatedAliasStoreAction`, #36326) that suggest config plumbing is being tightened.

## 3. New Model & Hardware Support

- **Apple Silicon roadmap (2026 Q2)** (#19137) — still open; contributor call-out for tasks. SGLang has no Apple Silicon support yet. https://github.com/sgl-project/sglang/issues/19137
- **AMD Q4 2026 roadmap** (#46462) — new hardware targets: **Helios rack-scale**, **MI45x (gfx1250)**, **Ryzen AI Halo (gfx1151/1152)**; monokernel focus. https://github.com/sgl-project/sglang/issues/46462
- **dLLM Serving roadmap** (#39499) — block-diffusion serving continued; crash/wrong-result fixes prioritized over features. https://github.com/sgl-project/sglang/issues/39499
- **New diffusion models** (#27214) — `omni-dreams` still unclaimed; `ideogram-4-nf4` and `JoyEcho` landed. https://github.com/sgl-project/sglang/issues/27214
- **Beam model kernels** (#45254) — kernels part 3/7 for Beam, including `beam_attention_gate` and fused ops. https://github.com/sgl-project/sglang/pull/45254
- **GLM-5.3-Flash on Hopper (SM90)** tracking (#45373) under Q4 kernel-optimization umbrella #42473. https://github.com/sgl-project/sglang/issues/45373
- **HunyuanImage-3** on CUDA currently broken (see Stability). https://github.com/sgl-project/sglang/issues/46461

## 4. Performance & Optimization

- **Weight Cache Daemon / Fast Engine Recovery** (#33522) — Phase 1 landed: per-rank daemon serving post-quantized weights over CUDA IPC drops weight-load from **~306–327s to <1s** on Qwen3-235B FP8. Roadmap continues toward full engine recovery. https://github.com/sgl-project/sglang/issues/33522
- **Kimi-K3 SM107 low-latency decode** (#46474) — fuses MoE front projection, shared-expert path, and finalize all-reduce; carries SM107-tuned K3 collectives. https://github.com/sgl-project/sglang/pull/46474
- **Kimi-K3 device-prepared expert-tile routing metadata** (#46475) — moves FlashInfer FP4 MoE routing metadata construction from host to device; wins at small M via `TrtllmMoERoutingMetadataSlot`. https://github.com/sgl-project/sglang/pull/46475
- **Kimi-K3 FP32 warp split-K GEMM** (#46464, closed) — warp split-K with cp.async ring loads for the merged MoE front projection at `M = 8, 16, 32` on SM107. https://github.com/sgl-project/sglang/pull/46464
- **AMD deterministic two-stage all-reduce** (#46325) — fixed-order two-stage for large inputs in deterministic mode on ROCm; addresses the n× reads of the current 1-stage kernel at TP4/TP8. https://github.com/sgl-project/sglang/pull/46325
- **Forward-pass decode interference metrics** (#29879) — three per-step histograms sampled by the attention TP/CP rank-0 on final PP stage. https://github.com/sgl-project/sglang/pull/29879
- **Attention fixes with perf implications**: FP32 partials for shared-KV verify split (#44466), ignoring inactive splits in split-KV verify merge (#44468), opt-in table-gated CUDA verify for Frozen-KV MTP (#44830). These fix NaN/precision loss that also costs throughput. https://github.com/sgl-project/sglang/pull/44466

## 5. Stability & Regressions

Ranked by severity:

1. **Speculative decoding SIGKILLs server on first non-greedy request** (#43412, OPEN) — pip-installed bundle (no system CUDA), enabling speculative decoding kills the process tree on any sampled (non-greedy) request. Root cause: JIT compile failure (bundled cccl vs pip cu13 toolkit). Greedy traffic unaffected. No fix PR cited. https://github.com/sgl-project/sglang/issues/43412
2. **HunyuanImage-3 generates pure noise on CUDA** (#46461, OPEN, new today) — shared MLP reads in-place FusedMoE output. Regression affecting image generation entirely. No fix PR cited. https://github.com/sgl-project/sglang/issues/46461
3. **FlashInfer prefill is not split-invariant** (#46259, OPEN) — radix-cache hit or chunked prefill flips greedy output on Qwen3.5 hybrid GDN models. Reproduced on v0.5.19 and present on main at `d0a7565`. Correctness bug affecting cache-assisted serving. https://github.com/sgl-project/sglang/issues/46259
4. **Kimi-K3 AR fusion: prefill rows exceed symmetric-buffer capacity** (#46447, OPEN) — 2-node GB300, TP8/attn-DP2/DCP4, real prefill+decode (non-PD) with concurrency 8 / ISL 4096 fails in `k3_ar_fusion.symm_buffer()`. Related follow-up in #45367. https://github.com/sgl-project/sglang/issues/46447
5. **Kimi-K3 DCP a2a garbled decode on 2-node GB300** (#45367, OPEN) — decode corruption; `NCCL_GRAPH_REGISTER=0` restores smoke-test output, and a production patch matches #45824 `9cb1de5`. Workaround exists. https://github.com/sgl-project/sglang/issues/45367
6. **Kimi-K3 SM90 flashinfer_mxfp4 computes wrong activation** (#45755, OPEN) — silently applies GPT-OSS SwiGLU instead of SiTU. Persists on v0.5.22 and main `ce66b3a`. Depends on flashinfer-ai/flashinfer#4209. Silent wrong output. https://github.com/sgl-project/sglang/issues/45755
7. **sgl_kernel AOT per-op cubin gap on sm_75 (Turing)** (#38515, OPEN) — `rmsnorm` fails with `NoKernelImageForDevice` while `silu_and_mul`/`gelu_and_mul` work; no soft fallback to torch/Triton. https://github.com/sgl-project/sglang/issues/38515
8. **HiCache PP-sync drain forces lock-step across PP ranks** (#45351, OPEN) — PP0 scheduler loop can't run ahead of PP1, which is held by PP2. Throughput regression when HiCache enabled on pipeline-parallel prefill. https://github.com/sgl-project/sglang/issues/45351

Closed-as-inactive today: #35808 (KV cache observability feature), #36302 (HiCache L3 segfault with nvcc 12.8 + CUDA 13), #35385 (WSL2 CUDA IPC crash), #35557 (DeepSeek-V4-Flash DeepEP on SM90), #36326 (config alias), #31719 (hybrid-GDN conv_states dtype), #36395 (`bench_one_batch` ignores `--moe-runner-backend`), #36383 (MXFP4 KV cache feature), #36352 (NGRAM + torch_native warmup crash), #36338 (FP8 KV dequant for DSA), #36303 (MegaMoE multi-node TP crash), #36291 (deterministic inference no-op on NVFP4+hybrid Mamba), #36276 (Qwen3.6-35b-a3b repeat). These may be resolved elsewhere or dropped — worth tracking separately if they affect your deployment.

## 6. What This Means for Application Developers

- **Kimi-K3 deployments are getting real attention** — SM107 (Blackwell-refresh) decode latency, MoE routing, and FP32 front-projection GEMM are all being tuned in parallel. If you're on Hopper (SM90) with Kimi-K3, #45755 (silent wrong activation) and #45367 (garbled decode / NCCL workaround) require verification before trusting outputs.
- **Speculative decoding + pip CUDA 13 installs are currently unsafe for non-greedy traffic** (#43412). Pin to a system-CUDA build or keep `temperature=0` if you must run spec decoding in this configuration.
- **Weight load times are dropping dramatically** (306s → <1s on Qwen3-235B FP8 per #33522). If cold-start is your bottleneck for large FP8 models, this roadmap is the one to watch.
- **Rust server + `api.v1` migration (#45816, #45449)** is underway. If you build on `sgl-router` or `sgl-processor`, expect a consolidated OpenAI-compatible surface over the next quarter; start planning for the processor-side changes now.
- **AMD is opening new target hardware** (MI45x, Ryzen AI Halo, Helios) and ROCm deterministic all-reduce is improving (#46325). If you're evaluating AMD for serving, Q4 roadmap #46462 is the canonical reference.
- **Apple Silicon remains unsupported** (#19137). Mac-based local development still requires a remote SGLang instance.
- **Diffusion serving is a first-class track now** (#39499, #27214, #36703, #37809). If you're serving image/diffusion models, residency planning and warmup calibration PRs are actively landing — expect memory behavior changes between releases.

---
*Digest generated from github.com/sgl-project/sglang data for 2026-10-26. Comment counts shown as "undefined" in the source PR feed were omitted rather than estimated.*

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-10-26

## Today's Highlights

A heavy CUDA-focused day: FFN gate/up matmul fusion and GLU-in-writeback for MMQ landed on the prompt-processing path, alongside qwen MRoPE + set-rows fusion, directly benefiting dense-FFN prefill throughput. Two notable stability fixes also landed — a CPU/memory exhaustion bug in the dry sequence breaker and a 4D tensor quantization bug that silently dropped rows. Meanwhile, a wave of SYCL and Metal GQA/decode optimizations is working through the PR queue, and the grammar recursion depth limit is now mandated project-wide.

## Releases & Breaking Changes

Nine builds shipped (b11877–b11887). No API-breaking changes, but one process-level requirement is now enforced:

- **b11882 / PR #31153** — `grammar`: recursion depth is now hard-limited to prevent stack overflow ([#29495](https://github.com/ggml-org/llama.cpp/issues/29495), [#29755](https://github.com/ggml-org/llama.cpp/pull/29755)). A repo-wide policy now requires every recursive function to carry a hard limit, checked by the `code-review` skill. Custom grammar authors should audit deeply-nested repetition rules. ([PR #31153](https://github.com/ggml-org/llama.cpp/pull/31153))
- **b11887** — test-only: default thread count adjusted for `test-llama-context`, paired with `#31157` enabling automatic parallel test workers. ([#31157](https://github.com/ggml-org/llama.cpp/pull/31157))

Other builds: b11886 (qwen tensor merge on convert), b11884 (dry sequence breaker fix), b11883 (4D tensor quantization fix), b11881 (`no_alloc` respected in all memory caches), b11880 (merge rejects truncated GGUF), b11879 (CUDA MMQ FFN fusion), b11878 (CUDA qwen MRoPE fusion).

## New Model & Hardware Support

- **qwen4exp / Qwen3.8-Flash-Next**: convert path now merges tensors and pre-scales rather than emitting constants; CUDA gains fused MRoPE + set-rows. ([b11886](https://github.com/ggml-org/llama.cpp/releases), [b11878](https://github.com/ggml-org/llama.cpp/releases))
- **RDNA4 (gfx12xx)**: HIP KV-cache decode path reworked to load a 32-value K block once per lane instead of re-reading per query head — quantized cache was previously slower than f16 at long context. ([PR #30803](https://github.com/ggml-org/llama.cpp/pull/30803))
- **Vulkan conv3d / coopmat2**: larger tile size added for conv3d where shared memory isn't needed for output. ([#29920](https://github.com/ggml-org/llama.cpp/pull/29920))
- **SYCL Xe2 (B580/B570/B70, Lunar Lake, Panther Lake)**: new DPAS flash-attention kernel operating directly on q4_0/q8_0 KV cache for decode and small batches (1–31 query tokens, incl. spec-decode drafts); head sizes 64/96/128/192. ([PR #31125](https://github.com/ggml-org/llama.cpp/pull/31125))
- **SYCL MoE**: device-side MoE scheduler makes the CPU-side scheduler optional, keeping GPU graphs unbroken. ([PR #30156](https://github.com/ggml-org/llama.cpp/pull/30156))

## Performance & Optimization

**Landed:**
- **CUDA MMQ FFN fusion** (b11879): gate and up matmuls of a dense FFN now run as a single `mul_mat_q` launch with interleaved gate/up rows, GLU applied in writeback — targets prompt processing. ([#29948](https://github.com/ggml-org/llama.cpp/pull/29948))
- **CUDA qwen MRoPE + set-rows fused** (b11878), reducing graph node count on the qwen path. ([#31025](https://github.com/ggml-org/llama.cpp/pull/31025))

**In flight:**
- **Metal GQA vec decode** ([PR #30728](https://github.com/ggml-org/llama.cpp/pull/30728)): `kernel_flash_attn_ext_vec` currently runs one threadgroup per query head, so G query heads sharing a KV head each re-stream that cache G times. Patch mirrors CUDA's `use_gqa_opt`.
- **SYCL vectorized dequant stores** ([PR #30976](https://github.com/ggml-org/llama.cpp/pull/30976)): flat launch + vectorized stores extended from Q8_0 to Q4_0, K-quants, IQ3, MXFP4 reordered-layout kernels.
- **SYCL argmax / conv-transpose bounding** ([PR #31110](https://github.com/ggml-org/llama.cpp/pull/31110), [PR #31109](https://github.com/ggml-org/llama.cpp/pull/31109)).
- **MoE cache tuning**: `llama_moe_cache` can spill missed experts to CPU, with `--moe-cache-cpu-share` and `--moe-cache-mib` acting as knobs; small caches that can't hold one token now warn. ([PR #30966](https://github.com/ggml-org/llama.cpp/pull/30966), [PR #30848](https://github.com/ggml-org/llama.cpp/pull/30848))

## Stability & Regressions

**Fixed today:**
- **CPU/memory exhaustion via dry sequence breaker** — b11884. ([#31035](https://github.com/ggml-org/llama.cpp/pull/31035))
- **4D tensor quantization silently dropped rows** — `llama-quant` used `ne[1]*ne[2]` for `nrows_total`, so only the first `ne[2]` slices of a 4D tensor were quantized. Now uses `ggml_nrows()` plus name-based expert detection. ([#30820](https://github.com/ggml-org/llama.cpp/pull/30820))
- **Truncated GGUF tensors** now rejected in merge. ([#31044](https://github.com/ggml-org/llama.cpp/pull/31044))
- **`no_alloc` respected in all memory caches** (b11881), avoiding stray allocations. ([#31087](https://github.com/ggml-org/llama.cpp/pull/31087))

**Open regressions, by severity:**
1. **CUDA illegal memory access** on Windows releases with flash attention (Gemma 4 12B QAT Q4_0 + mmproj, RTX 4080 Super); `-fa off` works around it. No fix PR yet. ([#30436](https://github.com/ggml-org/llama.cpp/issues/30436))
2. **~45% Vulkan prompt-processing regression on RDNA1 (gfx1010)** between b10455 and b11429 (v0.6.0) with a GDN-hybrid Qwen3.5-9B model; TG unaffected. Bisect range is narrow — worth attention. ([#30039](https://github.com/ggml-org/llama.cpp/issues/30039))
3. **Decode emits 1 token then EOS at long context on Metal** with qwen4exp, stochastic at a threshold that moves with model quant / KV quant / n_ctx — silent empty output. ([#28805](https://github.com/ggml-org/llama.cpp/issues/28805))
4. **Vulkan prefers shared over dedicated memory** on RX 9070, blocking models larger than shared VRAM from loading. ([#12748](https://github.com/ggml-org/llama.cpp/issues/12748))
5. **`flash_attn_ext_rows`** work to fix unified-KV multi-seq masking penalty remains open across backends. ([PR #29510](https://github.com/ggml-org/llama.cpp/pull/29510))
6. **WebGPU memset race** exposed by newly-parallel CI workers. ([PR #31162](https://github.com/ggml-org/llama.cpp/pull/31162))

**Correctness / server-side:**
- **Prompt cache reuse across differing per-request `lora`** silently contaminating output with the previous adapter's KV — closed as stale, but if you serve multiple LoRAs per process this is a real correctness hazard worth re-verifying on your build. ([#26207](https://github.com/ggml-org/llama.cpp/issues/26207))
- **`reasoning_effort` appears broken** on the server. ([#27023](https://github.com/ggml-org/llama.cpp/issues/27023))

## What This Means for Application Developers

- **Prefill-heavy workloads on CUDA get faster for free** by pulling b11879/b11878 — dense FFN gate/up is now one kernel launch with GLU folded into writeback. If you're latency-sensitive on prompt processing, upgrade and re-benchmark.
- **Quantization correctness matters if you ship 4D tensors** (expert weights, MoE). The b11883 fix means previously produced GGUFs may have dropped rows — re-quantize any 4D-tensor models built on affected builds and validate.
- **Grammar-driven apps should adopt depth limits now.** The project treats unbounded recursion as a review blocker; if you maintain custom GBNF for tool-call or structured-output parsing, add explicit limits before a stack overflow takes down your server.
- **Multi-LoRA per-process servers: audit prompt-cache keying.** The stale but unresolved `#26207` indicates cache is not namespaced by adapter; if you serve several adapters from one server, either isolate processes or verify KV reuse behavior on your build.
- **Speculative decoding on SYCL/Metal is advancing**: the DPAS quantized-KV flash attention kernel covers 1–31 query tokens specifically to serve spec-decode drafts, and Metal GQA decode is in review — both are direct wins for draft-heavy agent loops on those backends.
- **MoE serving is becoming tunable**: `--moe-cache-mib` / `--moe-cache-cpu-share` let you trade CPU expert reads against device cache pressure; small-cache configurations now warn instead of thrashing silently.
- **Windows + CUDA + flash attention remains the riskiest combination** in this release window — pin `-fa off` in production configs if you use Gemma 4 12B QAT Q4_0 with mmproj until the illegal-memory-access issue is resolved.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-10-26

## 1. Today's Highlights

No releases landed in the last 24 hours, but the issue and PR queues were unusually active with runner-level fixes. Two long-standing correctness gaps got targeted PRs today: stop sequences on the MLX backend ([#19267](https://github.com/ollama/ollama/pull/19267)) and the `/v1/completions` endpoint applying chat templates to raw prompts ([#19289](https://github.com/ollama/ollama/issues/19289)). Meanwhile, a cluster of macOS Metal watchdog failures ([#19278](https://github.com/ollama/ollama/issues/19278)) and ROCm regressions on Radeon iGPUs ([#19290](https://github.com/ollama/ollama/issues/19290)) continue to generate reports.

## 2. Releases & Breaking Changes

None. No new versions or API/config changes were published in the last 24h.

## 3. New Model & Hardware Support

- **MoE CPU offload** — Feature request [#11772](https://github.com/ollama/ollama/issues/11772) (73 👍) asks Ollama to expose the MoE-to-CPU layer offload path already supported in `llama.cpp` ([ggml-org/llama.cpp#15077](https://github.com/ggml-org/llama.cpp/pull/15077)), proposed as `OLLAMA_MOE_OFFLOAD=FULL|PARTIAL|NONE`. No implementation PR yet.
- **F16/BF16 safetensors metadata** — PR [#19275](https://github.com/ollama/ollama/pull/19275) fixes blank `ModelFamily`, `ModelFamilies`, and `FileType` in `ConfigV2` for non-quantized safetensors imports (closes [#16557](https://github.com/ollama/ollama/issues/16557)).
- **HuggingFace import workflow** — Community request [#19277](https://github.com/ollama/ollama/issues/19277) proposes a shell-based GGUF importer from HF into Ollama.

## 4. Performance & Optimization

- **MLX prefill chunk shrinking** — PR [#19280](https://github.com/ollama/ollama/pull/19280) reduces prefill chunk size as context grows, preventing Metal command buffers from exceeding the macOS GPU watchdog timeout on very long prompts.
- **Prompt processing guidance request** — Issue [#19282](https://github.com/ollama/ollama/issues/19282) requests validation of Qwen3.5 4B GGUF prompt-processing throughput on a 16GB M4 (100% GPU via llama.cpp). No numbers posted yet.
- **Download rate limiting** — PR [#19288](https://github.com/ollama/ollama/pull/19288) implements `ollama pull --limit-rate` and `--limit-streams` (with env var equivalents), addressing [#2006](https://github.com/ollama/ollama/issues/2006). Note: this is a bandwidth throttle, not a throughput improvement.

## 5. Stability & Regressions

Ranked by severity:

1. **ROCm regression on Radeon 890M (gfx1150 iGPU)** — [#19290](https://github.com/ollama/ollama/issues/19290): garbage output and `Memory access fault by GPU` on 0.40.6 and 0.40.7. **0.33.3 works.** No fix PR yet; downgrade is the current workaround.
2. **macOS Metal crashes** — [#19278](https://github.com/ollama/ollama/issues/19278): `mlx runner failed: panic: mlx: [METAL] Command buffer execution failed` on 0.40.9 during long XML analysis. PR [#19280](https://github.com/ollama/ollama/pull/19280) opens a mitigation path.
3. **6-GPU VRAM eviction bug** — [#19279](https://github.com/ollama/ollama/issues/19279): the 3s free-memory refresh times out around model loads, causing stale VRAM readings and spurious eviction of CPU-only runners. PR [#19284](https://github.com/ollama/ollama/pull/19284) fixes the CPU-only eviction half.
4. **Fresh install broken on 0.40.x** — [#19276](https://github.com/ollama/ollama/issues/19276): model pull completes but `ollama run` still fails after clean reinstall.
5. **gemma4 tool-call parsing** — [#19273](https://github.com/ollama/ollama/issues/19273): unclosed `]` in tool args causes silent drop of the entire call (no `tool_calls`, no `content`). PR [#19274](https://github.com/ollama/ollama/pull/19274) adds list-closing repair.
6. **OpenAI-compat `tool_calls` misrouting** — [#19151](https://github.com/ollama/ollama/issues/19151): assistant messages with `"content": []` are dropped and their `tool_calls`/`reasoning` are attached to the previous message.
7. **`/v1/completions` templating** — [#19289](https://github.com/ollama/ollama/issues/19289) (closed same day): raw prompts were wrapped in the chat template, diverging from OpenAI semantics and from `/api/generate` with `raw: true`.
8. **Cloud/Beam intermittent empty responses** — [#19270](https://github.com/ollama/ollama/issues/19270): Beam via Ollama Cloud returns empty assistant messages through OMP while working via OpenCode Go.
9. **Claude Code ↔ cloud model** — [#19281](https://github.com/ollama/ollama/issues/19281): connection refused on Windows 11, Ollama 0.40.11.
10. **Claude-format streaming drops trailing thinking** — PR [#19110](https://github.com/ollama/ollama/pull/19110): thinking arriving after text/tool_use on `/v1/messages` never reaches the client.

## 6. What This Means for Application Developers

- **Tool-calling reliability is the current sore spot.** If you're shipping agents on gemma4 or using the OpenAI-compat endpoint, pin attention to [#19273](https://github.com/ollama/ollama/issues/19273) and [#19151](https://github.com/ollama/ollama/issues/19151) — both can silently produce empty assistant turns rather than explicit errors. Add server-side detection for `done_reason: "stop"` with both `tool_calls` and `content` empty.
- **MLX and llama.cpp paths are not at parity.** Stop sequences ([#19267](https://github.com/ollama/ollama/pull/19267)) and template handling ([#19289](https://github.com/ollama/ollama/issues/19289)) differ per engine. If your client relies on strict stop semantics, verify on the specific backend you deploy.
- **Hold off on 0.40.x where hardware is constrained.** ROCm on gfx1150 is actively regressed ([#19290](https://github.com/ollama/ollama/issues/19290)) and 0.33.3 remains the last known-good for that target. Multi-GPU Linux hosts should watch [#19279](https://github.com/ollama/ollama/issues/19279) before scaling out.
- **Bandwidth control is coming.** If you operate fleets pulling large models, PR [#19288](https://github.com/ollama/ollama/pull/19288) gives you per-pull ceilings without patching. Useful for CI runners on metered links.
- **MoE offload is not yet exposed.** Requests to run MoE layers on CPU ([#11772](https://github.com/ollama/ollama/issues/11772)) remain unimplemented — if your deployment plan assumes cheaper VRAM via CPU offload, that's still `llama.cpp`-only for now.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-10-26

## Today's Highlights
LiteLLM shipped a stacked series of patch releases (v1.106.4, v1.105.5, v1.104.7, v1.103.9) with cosign-verifiable images across all variants. The issue tracker is dominated by cost-tracking and budget-enforcement correctness bugs in multi-pod deployments, plus a notable proxy OOM crash tied to the DST fall-back hour. A large batch of gateway-auth PRs signals active work on a native Rust gateway implementation.

## Releases & Breaking Changes
- **[v1.106.4](https://github.com/BerriAI/litellm/releases)** — latest patch; verify with `cosign verify --key .../cosign.pub ghcr.io/berriai/litellm:v1.106.4`. Same command applies to `litellm-database`, `litellm-non_root`, and `docker.io/litellm/*` images.
- **[v1.105.5](https://github.com/BerriAI/litellm/releases)**, **[v1.104.7](https://github.com/BerriAI/litellm/releases)**, **[v1.103.9](https://github.com/BerriAI/litellm/releases)** — maintenance patches on older lines.
- No documented breaking config/API changes in the release notes surfaced today; no migration actions required.

## New Model & Hardware Support
- **[PR #48356](https://github.com/BerriAI/litellm/pull/48356)** — Adds **Sideren** as a JSON-configured OpenAI-compatible provider; `sideren/<model>` works on chat completions, responses, and messages with only `SIDEREN_API_KEY`.
- **[PR #46901](https://github.com/BerriAI/litellm/pull/46901)** — Adds **Decision Models** (decisionmodels.io) as a decisions provider in the shared Jev flow, with pricing, UI form, and tests.
- **[Issue #27439](https://github.com/BerriAI/litellm/issues/27439)** (CLOSED) — DeepSeek V4 graded `reasoning_effort` (`high`/`max`) was being stripped to `thinking: {"type": "enabled"}`; resolved.
- **[Issue #48238](https://github.com/BerriAI/litellm/issues/48238)** — Vertex Model Garden (`vertex_ai/openai/...`, SGLang backend, GLM-5.3) drops `reasoning_content` and extra tool calls during streaming; open.

## Performance & Optimization
- **[PR #48353](https://github.com/BerriAI/litellm/pull/48353)** — Vector store listing now returns stable ID-ordered pages and rejects nonpositive page numbers; dashboard follows every page beyond the first 100.
- **[PR #48337](https://github.com/BerriAI/litellm/pull/48337)** — Adds virtual-key store and cache ports for the Rust gateway to avoid a DB hit on every request (Postgres/Redis wiring lands in later PRs).
- **[PR #48338](https://github.com/BerriAI/litellm/pull/48338) & [#48350](https://github.com/BerriAI/litellm/pull/48350)** — Rust gateway auth refactor; Python-compatible credential extraction (`x-api-key`, `x-litellm-api-key`, Gemini `?key=`) so clients authenticate once natively.
- **[Issue #26190](https://github.com/BerriAI/litellm/issues/26190)** — Reports ~10 CVEs fixed in `aiohttp==3.13.5` while LiteLLM 1.83.8+ pins `aiohttp==3.13.3`; open, needs dependency bump.

## Stability & Regressions
Ranked by severity:

1. **[Issue #48286](https://github.com/BerriAI/litellm/issues/48286)** — **Proxy startup loops forever and is OOM-killed during the DST fall-back hour** (`scheduled_job_stagger`) — reproduced 2026-10-25 in Europe/Paris at 02:00 CET; restarts grow unbounded before `Application startup complete`. High severity for EU-deployed proxies; no fix PR referenced yet.
2. **[Issue #29142](https://github.com/BerriAI/litellm/issues/29142)** — Cross-end-user **budget leak**: cached `UserAPIKeyAuth` retains per-request `end_user_max_budget` across requests sharing one virtual key (OpenWebUI pattern). Correctness/security-adjacent; open.
3. **[Issue #34238](https://github.com/BerriAI/litellm/issues/34238)** — End-user budget bypass via stale per-pod fallback spend after Redis counter clean-miss (60s default TTL). Open.
4. **[Issue #33873](https://github.com/BerriAI/litellm/issues/33873)** — **Spend-log batches dropped** when a non-transport DB write fails; transport half fixed, non-transport half still open.
5. **[Issue #48304](https://github.com/BerriAI/litellm/issues/48304)** — Auth failure handler 500s on any non-object JSON body (`[]`, `null`, `"s"`, `1`, `true`) → `AttributeError`; **[fix PR #48329](https://github.com/BerriAI/litellm/pull/48329)** exists.
6. **[Issue #47947](https://github.com/BerriAI/litellm/issues/47947)** — Proxy rewrites JSON integers >64-bit as floats before forwarding (e.g. tool schema `maximum` silently corrupted). Silent data mutation; open.
7. **[Issue #26233](https://github.com/BerriAI/litellm/issues/26233)** — Redis env vars ignored when `cache_params` has any key; breaks spend tracking across multiple pods. Open.
8. **[Issue #48197](https://github.com/BerriAI/litellm/issues/48197)** (CLOSED) — `/v1/messages` client disconnect before first chunk leaves upstream request running.
9. **[Issue #46045](https://github.com/BerriAI/litellm/issues/46045)** (CLOSED) — `ModuleNotFoundError: No module named 'mcp'` on tool-bearing requests.
10. **[Issue #48226](https://github.com/BerriAI/litellm/issues/48226)** (CLOSED) — `completion_cost()` raised `ModelNotMappedError` for `groq/openai/gpt-oss-*` despite correct in-request pricing.

Additional open streaming/translation regressions: Fireworks ` thinking` leakage into `content` (**[#26326](https://github.com/BerriAI/litellm/issues/26326)**), MCP semantic tool filter dropping all tools with client-added ID suffixes (**[#26507](https://github.com/BerriAI/litellm/issues/26507)**), Ollama `api_base` resolution precedence inverted vs. OpenAI provider (**[#26170](https://github.com/BerriAI/litellm/issues/26170)**), and Vertex Gemini embeddings silently fusing list inputs into one vector while billing all (**[#38823](https://github.com/BerriAI/litellm/issues/38823)**).

Fix PRs in flight: **[#48355](https://github.com/BerriAI/litellm/pull/48355)** (soft-budget alerts use current spend), **[#48354](https://github.com/BerriAI/litellm/pull/48354)** (clear model budget on explicit null), **[#48334](https://github.com/BerriAI/litellm/pull/48334)** (Presidio placeholder collision), **[#48191](https://github.com/BerriAI/litellm/pull/48191)** (tool params for unmapped JSON providers), **[#48324](https://github.com/BerriAI/litellm/pull/48324)** (Ollama string stop sequences), **[#46695](https://github.com/BerriAI/litellm/pull/46695)** (unpriced savings recorded as NULL, not fabricated $0.00), **[#48349](https://github.com/BerriAI/litellm/pull/48349)** (null deployment metadata in cost callbacks).

## What This Means for Application Developers
- **Pin and verify your image.** With four patch releases in 24h, use the provided cosign key for supply-chain integrity; track the [aiohttp CVE gap (#26190)](https://github.com/BerriAI/litellm/issues/26190) if you build your own image.
- **Multi-pod cost/budget deployments need auditing.** Several open bugs (#29142, #34238, #33873, #26233) can silently under-enforce budgets or drop spend logs when Redis counters miss and DB writes fail. If you share one virtual key across end-users (OpenWebUI-style), watch #29142 closely.
- **Reasoning-model streaming is uneven.** Vertex Model Garden reasoning streams lose `reasoning_content` and tool calls (#48238); Fireworks leaks raw ` thinking` tags into `content` (#26326). Normalize at the app layer or test per-provider before shipping agent loops.
- **Don't trust integer passthrough for tool schemas.** #47947 can silently mutate large JSON integers — avoid >64-bit values in schemas until fixed.
- **Scheduled-job reliability:** if you deploy in DST-observing regions, delay or guard proxy restarts around the fall-back hour until #48286 is resolved.
- **Watch the Rust gateway.** Auth/policy/store ports landing (#48336, #48337, #48338, #48350) mean native virtual-key auth parity with the Python proxy is approaching — worth tracking if you're planning a gateway migration.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-10-26

## 1. Today's Highlights

No releases landed in the last 24h, but the issue tracker is dominated by fallout from the 2026-10-23 → v0.1.910-beta Studio update: multiple Windows and Linux users report GGUF loads being killed by a false port-ownership check, and a follow-on v0.1.910 regression where all models fail to load. On the engineering side, the big incoming feature is **Studio Flows** (a node editor for AI pipelines, formerly #14730), now stacked with 3D world/action-gameplay work, and a batch of hosted-API admission fixes (prepared-prompt token counting before GGUF KV admission) that matter for anyone running Unsloth as a local OpenAI/Anthropic-compatible endpoint.

---

## 2. Releases & Breaking Changes

**No new releases in the last 24h.** However, breaking behavior is concentrated in the recent Studio beta line:

- **v0.1.910-beta model load regression (Windows):** all tested models fail to load after update — [issue #15142](https://github.com/unslothai/unsloth/issues/15142).
- **False "our child is not listening" port-ownership check (Windows):** llama-server passes `/health` 200 then is killed by Studio; introduced by the 2026-10-23 update — [issue #15022](https://github.com/unslothai/unsloth/issues/15022).
- **Studio forces `preserve_thinking=true` at llama-server launch:** overrides user-supplied chat templates and makes `--no-reasoning-preserve` a no-op — [issue #15115](https://github.com/unslothai/unsloth/issues/15115).
- **Config migration pain:** `~/.unsloth` deletion advice (issue #8865) plus no bulk import/export means users lose settings, conversations, model configs, RAG configs — feature request to import the entire Unsloth environment automatically — [issue #15292](https://github.com/unslothai/unsloth/issues/15292).

---

## 3. New Model & Hardware Support

- **Nanbeige4.3-33B** requested for support/optimization as a dense coding model — [issue #15278](https://github.com/unslothai/unsloth/issues/15278).
- **DeepSeek-V4.1-Flash GGUF chat template bug:** the shipped template raises on ordinary discussion of the image marker token, breaking conversation history; Studio-side fix in PR to neutralize the marker in replayed assistant text — [issue #15285](https://github.com/unslothai/unsloth/issues/15285) / [PR #15288](https://github.com/unslothai/unsloth/pull/15288).
- **MiniCPM-V-4.7-1B on Vulkan:** text generation failure reported — [issue #14987](https://github.com/unslothai/unsloth/issues/14987).
- **AMD audio stack:** `audio.cpp` still installs the CPU build on AMD GPUs; request to ship ROCm/HIP bundles and fall back to Vulkan — [issue #13042](https://github.com/unslothai/unsloth/issues/13042).
- **Desktop integrations:** PR adds Claude Desktop and Codex Desktop integration via a new Agents tab (macOS), with synced context, MTP and keep-alive — [PR #15155](https://github.com/unslothai/unsloth/pull/15155).
- **HF-Mirror support** with parallel downloads requested (relevant for China-region users; see also mainland search-unavailable bug [#15143](https://github.com/unslothai/unsloth/issues/15143)) — [issue #15274](https://github.com/unslothai/unsloth/issues/15274).

---

## 4. Performance & Optimization

- **Native int8 image transformers:** per-tensor W8A8 builds with g256 ConvRot rotation now cached in the local prequant cache; cache-miss path previously fell back to dense bf16 — [PR #15289](https://github.com/unslothai/unsloth/pull/15289), [PR #15283](https://github.com/unslothai/unsloth/pull/15283).
- **KV-pool admission correctness for hosted APIs:** OpenAI passthrough, Responses, and Anthropic paths used character-based prompt estimates instead of llama-server's rendered prompt; numeric text and tool schemas could overcommit the shared KV pool. PR counts prepared messages with tools and rendering options — [PR #15294](https://github.com/unslothai/unsloth/pull/15294).
- **CPU conversation-archive embeddings stall:** long tool-heavy chats spend minutes in CPU embedding before llama.cpp receives any inference request; Stop does not cancel archiving. Closed, but indicates a prefill-latency hotspot on Desktop — [issue #14519](https://github.com/unslothai/unsloth/issues/14519).
- **Context accounting gap:** auto-compact ignores image tokens on local GGUF chats, so tool loops with screenshots overflow the context window — [issue #14968](https://github.com/unslothai/unsloth/issues/14968).
- **CI sharding:** multi-rank gloo and tensor/pipeline parallel suites split into their own shards after the catch-all CPU shard repeatedly hit its 2100s pytest cap — [PR #15291](https://github.com/unslothai/unsloth/pull/15291), [PR #15290](https://github.com/unslothai/unsloth/pull/15290).

---

## 5. Stability & Regressions (ranked)

1. **v0.1.910-beta total load failure (Windows)** — every tested model fails to load post-update; no fix PR yet — [issue #15142](https://github.com/unslothai/unsloth/issues/15142).
2. **False port-ownership kill on every GGUF load (Windows, 2026-10-23 update)** — llama-server healthy, then killed; no fix PR visible — [issue #15022](https://github.com/unslothai/unsloth/issues/15022).
3. **Coredumps on model eject / stall after a few turns** since updates in the last two weeks — [issue #14411](https://github.com/unslothai/unsloth/issues/14411).
4. **`preserve_thinking` forced at launch** — silently overrides user chat templates; correctness issue for reasoning models — [issue #15115](https://github.com/unslothai/unsloth/issues/15115).
5. **Linux desktop WebKitWebProcess SIGABRT** with AT-SPI/atk-bridge active (KDE Plasma); reproducible on NVIDIA CUDA — [issue #15260](https://github.com/unslothai/unsloth/issues/15260).
6. **Image generation core dump** in Studio web UI — [issue #15172](https://github.com/unslothai/unsloth/issues/15172).
7. **Gemma-3 FastDecisionModel (Clef head) fails to train** — flat loss, chance-level accuracy — [issue #14439](https://github.com/unslothai/unsloth/issues/14439).
8. **Assistant messages not editable after refresh** — [issue #15004](https://github.com/unslothai/unsloth/issues/15004); **browser preview missing in Projects** — [issue #15046](https://github.com/unslothai/unsloth/issues/15046).
9. **Orpo/DPO/KTO chunked head fallback under torch global module hooks** — training-path fix PR open — [PR #15259](https://github.com/unslothai/unsloth/pull/15259); ORPO text-tokenizer test helper fix — [PR #15262](https://github.com/unslothai/unsloth/pull/15262).
10. **Native FSDP2 fixes:** one writer rank for TP×FSDP2 saves — [PR #15257](https://github.com/unslothai/unsloth/pull/15257); fp16 fused-optimizer inf-check sync only in `unscale_`, needs parity when nothing unscales — [PR #15245](https://github.com/unslothai/unsloth/pull/15245).

---

## 6. What This Means for Application Developers

- **Pin your Studio beta.** If you deploy Studio on Windows or KDE desktops, avoid auto-updating to the 2026-10-23+/v0.1.910 line until #15142 and #15022 are fixed — they are total availability failures, not cosmetic.
- **Don't trust `--no-reasoning-preserve`.** If you serve reasoning models (Qwen3.8-class) with custom chat templates, Studio's forced `preserve_thinking=true` can silently change model behavior on your endpoint (#15115). Verify the rendered prompt in `llama-server` logs.
- **KV budget for hosted-style endpoints is getting real.** PR #15294 fixes pre-admission token counting for OpenAI/Anthropic-compatible routes; until it lands, don't size KV pools by character count — tool schemas and numeric payloads will overcommit and evict/fail requests under concurrency.
- **Multimodal agent loops are risky on local GGUF today.** Auto-compact ignores image tokens (#14968), so screenshot-in-tool-loop agents will blow context. Budget context pessimistically or cap screenshot frequency until fixed.
- **Template-fragile models:** DeepSeek-V4.1-Flash GGUF rejects normal text mentioning its image marker (#15285); Studio PR #15288 patches replay, but any external client sending that token in user content will still 500 on the template.
- **Flows is coming to your embedding layer.** PR #14730 turns Studio into a local node-graph pipeline runner on top of the same MCP capabilities (chat, tools) — for teams evaluating local orchestration, this is a one-file-shareable alternative to external workflow engines.
- **Multi-user/large setups:** chat pins are currently browser-localStorage only (#15293 in flight), and there is no supported bulk import/export of settings/RAG/conversations (#15292) — plan backup/restore around `~/.unsloth` manually.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*