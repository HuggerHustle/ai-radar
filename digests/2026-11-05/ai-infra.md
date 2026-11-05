# AI Infrastructure Digest 2026-11-05

> Generated: 2026-11-05 01:25 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — AI Infrastructure Ecosystem
**Date:** 2026-11-05 | **Sources:** vLLM, SGLang, llama.cpp, Ollama, LiteLLM, Unsloth daily digests

---

## 1. Ecosystem Overview

Today's activity reveals a maturing ecosystem in which **correctness regressions at the serving layer are beginning to outweigh raw throughput gains**. Three independent projects (vLLM, SGLang, llama.cpp) simultaneously reported cross-request KV/data contamination bugs (#61160, #34259, #27422) — a class of issue that signals shared-prefix caching and disaggregated serving have outgrown their correctness harnesses. Meanwhile, the **model-support race has shifted to Blackwell-adjacent architectures** (Qwen3.8-Flash-Next, Kimi-K3.x, GLM-5.x, DeepSeek-V4.x) with hybrid GDN/MoE layers that stress every layer of the stack. Notably, **no project shipped a stable release except llama.cpp (v0.9.0)** — the others are either in RC (LiteLLM v1.109.0-rc.1), beta (Unsloth v0.1.915-beta), or between releases (vLLM, SGLang, Ollama). The gateway layer (LiteLLM) is undergoing a broad control-plane upgrade (audit sinks, OTel span propagation), while training (Unsloth) absorbed a meaningful inference-side win (CUDA-graphs decode).

---

## 2. Activity Comparison

| Project | Layer | Issues (active/updated) | PRs (active/updated) | Release Status | Notable Today |
|---|---|---|---|---|---|
| **vLLM** | Serving engine | 146 updated; several high-severity opens | 500 updated | No release in 24h | 🔴 Cross-request KV contamination (#61160, no fix) |
| **SGLang** | Serving engine | Heavy; several open regressions | Heavy (kernels + CI) | No release in 24h | 🔴 PD+EAGLE decode corruption (#48356, new) |
| **llama.cpp** | Local runtime | Moderate | Moderate | **v0.9.0 + b12100–b12119** | ✅ `flash_attn_ext_rows` unified KV; FP8 E4M3 |
| **Ollama** | Local runtime | Moderate (tool-calling cluster) | Moderate | No release | 🟠 Tool-calling broken on 0.40.13; YaRN MLX fix merged |
| **LiteLLM** | Gateway | High (Anthropic `/v1/messages` churn) | 9-PR control-plane stack | **v1.108.0 + v1.106.7 + v1.109.0-rc.1** | 🟠 MCP `tools/list` 18–50s stall regression |
| **Unsloth** | Training / fine-tuning | Moderate (UI/Studio cluster) | Moderate (2 multi-GPU fixes) | **v0.1.915-beta** | ✅ CUDA-graphs decode; Qwen3.8-Flash-Next |

**Read:** vLLM is the highest-velocity project by PR volume (500 updated), but that volume is matched by its count of open high-severity issues. LiteLLM and llama.cpp are the only projects that shipped user-facing artifacts today.

---

## 3. Model Support Race

| Model / Architecture | vLLM | SGLang | llama.cpp | Ollama | Unsloth |
|---|:-:|:-:|:-:|:-:|:-:|
| **Qwen3.8-Flash-Next** | 🔧 ROCm tuning (#57149) | 🔧 gfx950 tracker (#44304) | — | ⚠️ hybrid KV over-prediction | ✅ **Shipped (v0.1.915-beta)** |
| **Kimi-K3 / K3.1-Pro** | ✅ TPU v7x recipe (#65725); ROCm decode | 🔧 AMD prefill (#48490) | — | — | — |
| **DeepSeek-V4-Flash / V4.1** | ⚠️ SM8x gap (#50576); DSpark bug (#65618) | 🔧 Hopper fused compressor (#41294) | — | ⚠️ max_tokens cloud cap (#19517) | — |
| **GLM-5.3** | 🔧 CUDA tracker (#57406) | 🔧 Hopper tracker (#45373) | — | ⚠️ HiCache fail (#48145) | — |
| **Nemotron 3.5 ASR** | 🔧 Feature request (#47455) | — | — | — | — |
| **Mistral Large 4 / Clover / Limite / Metis-1.6** | — | — | ✅ **Shipped (v0.9.0)** | — | — |
| **Ripple 65B, Nemotron-H** | — | — | ✅ PRs (#31692, #31703) | — | — |
| **MiniMax-H3** | — | 🔧 Q4 diffusion stress test | — | — | — |
| **Muse Spark** | — | ✅ Day-0 PRs merged | — | — | — |
| **Qwen3/3.5 (MLX YaRN)** | — | — | — | ✅ **Fixed (#19231)** | — |

**Who's ahead:** On **frontier-hybrid models** (Qwen3.8-Flash-Next, Kimi-K3, DeepSeek-V4.x), vLLM and SGLang are in a near-tie, both deep in ROCm/gfx950 optimization — but vLLM has the only working TPU recipe and SGLang has the only *merged* Hopper fusion. **llama.cpp is the sole project shipping new architecture *support*** (four architectures in one release), reflecting a different strategy: breadth of open-weight coverage over frontier scaling. **Unsloth** is uniquely positioned as the only project with a *shipped, user-facing* Qwen3.8-Flash-Next enablement (in a beta release, but installable today).

---

## 4. Performance Frontier

| Optimization Area | vLLM | SGLang | llama.cpp | Others |
|---|---|---|---|---|
| **KV cache / prefix caching** | 🔴 Contamination bug; Mooncake async lookup (#61292); NIXL P/D RFC (#50913) | 🟠 HiCache host-tier collapse (#45400) | ✅ **`flash_attn_ext_rows` unified KV (v0.9.0)** | Ollama: 4–8× KV over-prediction (#19463) |
| **Batching / scheduler** | ✅ Scheduler stall fix (#62532, #65466, #65773) | 🔧 LPM bounded matching (#48409) | — | — |
| **Quantization** | ✅ NVFP4 MoE CUTLASS (#61511); FP8 load fix (#60015) | ✅ FP8 per-tensor (#44486); block-FP8 gfx950 (#48043) | ✅ **OCP FP8 E4M3 (v0.9.0)** | Unsloth: FP8 support in beta |
| **Distributed serving** | 🔧 P/D TTFT RFC; KV-engine sync (#62916) | 🟠 PD+EAGLE retraction bug (#48356) | — | — |
| **Kernels** | Blackwell MoE, FA4 sparse MLA (#63104) | Hopper DSv4.1 fuse, MLA zigzag CP, Gemma3 norm fusion | OpenCL FA decode, Vulkan rms_norm, HIP fast-math | Ollama: CUDA v13 stability (#17026) |
| **Decode graphs** | — | — | — | ✅ **Unsloth CUDA-graphs decode (#16691)** |
| **MoE** | NVFP4 experts; ZCE router (#57274) | AMD row-sharded MoE front | — | — |

**Where the effort is concentrated:** **Kernel-level fusion and quantization are the common battleground** across vLLM and SGLang — both are racing to fuse norm+quant+GLU chains on AMD gfx950 and Hopper simultaneously. **KV-cache handling is the divergent branch:** llama.cpp solved *multi-sequence efficiency* (unified KV), vLLM solved *scheduler stalls around KV transfers*, SGLang is *losing* on hybrid-model host-tier hits, and Ollama is *mis-counting* KV for SSM models. The most transferable win today is llama.cpp's `flash_attn_ext_rows` — directly relevant to any multi-tenant agent workload.

---

## 5. Layer Positioning

```
┌─────────────────────────────────────────────────────────────────┐
│  GATEWAY / CONTROL PLANE                                       │
│  LiteLLM — routing, budget, guardrails, provider translation    │
│  (Anthropic /v1/messages translation = most exposed surface)    │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        ▼                                           ▼
┌───────────────────────┐              ┌───────────────────────┐
│ SERVING ENGINE        │              │ LOCAL RUNTIME         │
│ vLLM, SGLang          │              │ llama.cpp, Ollama     │
│ • P/D disaggregation  │              │ • ggml / MLX backends │
│ • Multi-GPU/TP/EP     │              │ • Single-user / edge  │
│ • Throughput-focused  │              │ • Breadth of formats  │
└───────────────────────┘              └───────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  TRAINING / FINE-TUNING                                        │
│  Unsloth — LoRA, full FT, MoE/PP/TP training, Studio UI        │
└─────────────────────────────────────────────────────────────────┘
```

**Key differentiators today:**
- **vLLM vs SGLang:** both distributed serving engines. vLLM leans **scheduler correctness + broad hardware** (TPU, Iluvatar, SM8x); SGLang leans **kernel fusion + Apple Silicon/AMD** (MLX RFC, gfx950). Today vLLM has more critical bugs *open*; SGLang has more *closed-as-inactive* (a governance signal).
- **llama.cpp vs Ollama:** llama.cpp is the **engine** (backend diversity, GGUF, architectures); Ollama is the **productized runtime** on top (model library, launcher, cloud API). llama.cpp's release cadence is aggressive (10 builds/day); Ollama is in a tool-calling stability crunch.
- **LiteLLM is orthogonal:** it does not serve models — it governs *access* to them. Its biggest exposure is translation fidelity for agent clients (Claude Code, Open WebUI).
- **Unsloth is the only project touching weights.** Its CUDA-graphs decode win (#16691) blurs the line with serving, and its transformers 5.23 incompatibility (#16667) is a cross-cutting risk for anyone training near the inference boundary.

---

## 6. Trend Signals

### Signal 1 — Shared-prefix correctness is the new class of outage
Three projects independently disclosed cross-request data leakage in one day (vLLM #61160, SGLang #34259, llama.cpp #27422). Prefix caching + disaggregation is now a **security-relevant** surface, not just a perf optimization. **Watch:** any production deployment serving multi-tenant workloads should audit prefix-cache isolation before the next release cycle.

### Signal 2 — Hybrid (GDN/Mamba/SSM) models break the KV abstraction
vLLM (#50913, MTP prefix-cache misses), SGLang (#45400 HiCache collapse, #47916 MambaPool OOM), and Ollama (#19463 KV over-prediction) all show that **the KV-cache model does not fit hybrid architectures cleanly**. **Watch:** if you serve Qwen3.5/3.8, GLM-5.3-Flash, or Kimi-K3-class models, expect cache-hit and memory-accounting surprises regardless of engine.

### Signal 3 — Tool calling is the weakest link in the agent stack
LiteLLM (server_tool_use pending loops #48384, reasoning replay 400s #49969), Ollama (native tool calls broken #19524, template struct dump #19529), vLLM (Qwen3 parser bugs #65774/#65775), and SGLang (`auto` parser fails #48172) all report tool-call correctness issues. **Watch:** agent frameworks should treat tool-call output as untrusted and validate strictly; pin explicit parsers per model family.

### Signal 4 — The control plane is becoming a first-class engineering surface
LiteLLM's 9-PR stack (audit sinks, OTel span propagation, redaction across failure paths) plus its Rust-router proposal (#49513) indicate **gateways are being rebuilt for observability and provenance**, not just routing. **Watch:** if you rely on LiteLLM for compliance, the redaction tightening (#49379–#49381) will scrub payloads previously visible in error events — review downstream parsers.

### Signal 5 — Inference wins are migrating into the training stack
Unsloth's CUDA-graphs decode (#16691) and FP8 support bring **serving-grade optimizations into fine-tuning workflows**. Together with llama.cpp's batched tensor API (#31473) and continuing FP8 E4M3 adoption, low-precision + graph-captured execution is standardizing across layers. **Watch:** validate bitwise equality before relying on CUDA-graphs in evals — the PR claims parity but has not yet been broadly battle-tested.

### Signal 6 — Hardware diversification is real, not marketing
TPU v7x (vLLM #65725), Iluvatar CoreX (vLLM #65557), Apple Silicon MLX (SGLang RFC #32321, Ollama #19231), XDNA (#21725), and gfx950 (vLLM + SGLang) all saw activity today. **Watch:** long-term capacity planning should assume **at least two non-NVIDIA inference paths are production-viable within 2–3 quarters** — but verify per-backend correctness, as Vulkan device-loss (#25664, #30010) and Intel Arc nondeterminism (#31560) show hardware breadth outpaces stability.

### What agent/application developers should watch
1. **Isolate SGLang imports** — its monkey-patch of `triton.next_power_of_2` (#48460) can silently break co-imported Triton kernels.
2. **Pin explicit parsers** for tool calling; `auto` and template-based rendering are unreliable across the stack.
3. **Monitor speculative decoding acceptance rates** — vLLM #65618 shows they can drop to 0% without errors.
4. **Audit prefix-cache isolation** in any multi-tenant deployment before the next release wave.
5. **Treat budget controls as best-effort** — LiteLLM concurrency races (#34732) mean session caps are not hard admission control.

---

*Report compiled from 2026-11-05 project digests. Issue/PR counts are approximations from digest summaries; release status reflects the trailing 24-hour window only.*

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-05

## 1. Today's Highlights

No new releases landed in the last 24 hours; activity is dominated by issue triage and a large wave of PR updates. The most significant correctness concern is a **cross-request KV cache contamination bug in P/D-disaggregated deployments** (#61160), where shared-prefix KV reuse under NIXL + automatic prefix caching can leak content between requests. On the performance side, work continues on MoE kernel optimization for Blackwell (#61511), ROCm/MI355X tuning for Qwen3.8 and Kimi-K3 (#57149, #59575, #61498), and scheduler latency reductions (#65466, #65773).

---

## 2. Releases & Breaking Changes

None. No new releases in the last 24h, and no API/config deprecations were announced. Note for awareness (not a breaking change yet):

- **`--reasoning-parser qwen3` output formatting bug** ([#61972](https://github.com/vllm-project/vllm/issues/61972), OPEN): leading `\n\n` is left in `content` after stripping the ` thinking` block — downstream consumers parsing content should be defensive.
- **`enable_adaptive_verification` gated to SM90/SM100** ([#63343](https://github.com/vllm-project/vllm/issues/63343), OPEN): rejected outright on SM120 (RTX PRO 6000 Blackwell) for DeepSeek-V4.1. If you're on SM120, this config path is unavailable.

---

## 3. New Model & Hardware Support

- **[Feature] SM8x (Ampere A100/A800) support for DeepSeek-V4-Flash / V4-Flash-0731 DSpark** — [#50576](https://github.com/vllm-project/vllm/issues/50576) (128 comments, most-discussed issue today). Neither checkpoint currently runs on Ampere; both are blocked on the same SM8x gap tracked in #40851. High community demand (16 👍).
- **[Feature] NVIDIA Nemotron 3.5 ASR Streaming (0.6B)** — [#47455](https://github.com/vllm-project/vllm/issues/47455). Request to support the streaming multilingual ASR model; updated today.
- **[Model] Glm4MoeLitePlusPlus (`ZEDA-GLM-4.7-Flash-Dynamic`)** — [PR #57274](https://github.com/vllm-project/vllm/pull/57274) (CLOSED). Dynamic MoE variant with "Zero-Compute Experts" (ZCE): router emits logits for 96 experts (64 routed + 32 ZCE) but ZCE experts consume no compute.
- **[Doc] Iluvatar CoreX GPU added to supported hardware list** — [PR #65557](https://github.com/vllm-project/vllm/pull/65557).
- **[Recipe] Kimi-K3.1-Pro TPU serving via vllm-torchtpu** — [PR #65725](https://github.com/vllm-project/vllm/pull/65725). Validated layout: TP32/EP32 across a 2×2×4 TPU v7x slice (32 chips, 4 hosts), `meta.hardware.ironwood: supported`.
- **[New Model] ZAYA1-8B** — [#42286](https://github.com/vllm-project/vllm/issues/42286) (CLOSED/stale). Reference implementation existed on a fork.

---

## 4. Performance & Optimization

- **NVFP4 MoE CUTLASS quant kernel (Blackwell B200)** — [PR #61511](https://github.com/vllm-project/vllm/pull/61511). Speeds up `scaled_fp4_experts_quant` / `silu_and_mul_scaled_fp4_experts_quant`; the per-row expert search dominates at large `n_experts`. Claims numerical equivalence, identical GSM8K accuracy and output token count vs main.
- **Engine core: handle new requests/aborts while waiting for model output** — [PR #65466](https://github.com/vllm-project/vllm/pull/65466) (CLOSED/ready). With multiproc executor, new requests previously sat in the input queue up to a full step (worse with async scheduling) because the engine busy-polled worker response queues.
- **Cheapen the spin while waiting for model output** — [PR #65773](https://github.com/vllm-project/vllm/pull/65773). Follow-up to #65466: the poll loop ran several Python calls under the GIL per `sched_yield()`, delaying engine input/output threads and costing throughput/tail latency.
- **Batch-invariance on Hopper/Blackwell routes Linear layers to Triton unnecessarily** — [#65569](https://github.com/vllm-project/vllm/issues/65569). `enable_batch_invariant_mode` installs cuBLAS (batch-invariant under mode settings) but still routes Linear to Triton; avoidable overhead on SM90/SM100.
- **Batch Invariant tracker** — [#27433](https://github.com/vllm-project/vllm/issues/27433) (105 comments, 24 👍). Core support exists; remaining work tracked under project 29.
- **ROCm: Qwen3.8-2.4T-A95B on gfx950/MI355X** — [#57149](https://github.com/vllm-project/vllm/issues/57149). Stacked-PR performance plan for `Quark-MXFP4` checkpoint.
- **ROCm: Qwen3.8-Flash-Next on gfx950/MI355X** — [#59575](https://github.com/vllm-project/vllm/issues/59575). Target model: GatedDeltaNet in 36 layers, QuerySparse Attention in 12, HyperConnection gated residual, MXFP4 MoE.
- **ROCm: Kimi-K3 Mono decode layer on MI355X** — [PR #61498](https://github.com/vllm-project/vllm/pull/61498). Extends MonoKernel (#60683) to vanilla autoregressive decode without speculative decoding; stacked, must merge after #60683.
- **FA4 sparse MLA prefill with query groups** — [PR #63104](https://github.com/vllm-project/vllm/pull/63104). 2/4/8 consecutive queries share each 128-head kernel row for 16–64 heads per rank.
- **GLM-5.3 optimization tracker** — [#57406](https://github.com/vllm-project/vllm/issues/57406). Same `glm_moe_dsa` base as GLM-5.2, further CUDA tuning in progress.
- **P/D disaggregation TTFT** — [#50913](https://github.com/vllm-project/vllm/issues/50913) (RFC). First-token seeding, fast KV side channels, concurrent router dispatch for NixlConnector.
- **Scheduler: eliminate 1.0–1.8s re-queueing stall for completed async KV pulls** — [#62532](https://github.com/vllm-project/vllm/issues/62532) (RFC). Front-of-queue re-admission for `OffloadingConnector`/tiered offloading and remote KV connectors.
- **MooncakeConnector async prefix lookup** — [PR #61292](https://github.com/vllm-project/vllm/pull/61292). Starts lookup on the engine-core input thread via `on_preschedule_request`, overlapping the busy-loop pickup wait and the scheduler waiting queue.
- **`shm_broadcast` spin tuning** — [#52916](https://github.com/vllm-project/vllm/issues/52916). Proposed adaptive spin grace + bounded arch waits (aarch64 WFET, x86 WAITPKG); current `busy_loop_s=1` is a compile-time constant.
- **CI: automatic sharding of quantization kernel tests** — [PR #65484](https://github.com/vllm-project/vllm/pull/65484). Replaces hand-tuned 6-way split with `automatic_shard` sized from per-file timings.

---

## 5. Stability & Regressions

Ranked by severity:

1. **🔴 Cross-request context contamination in P/D disaggregation** — [#61160](https://github.com/vllm-project/vllm/issues/61160). With automatic prefix caching (default) under NIXL prefill/decode disaggregation serving DeepSeek-V4.1-Flash, responses intermittently contain **content from other requests**. Scriptable reproducer on `/v1/...`. Workaround: `--no-enable-prefix-caching`. **No fix PR identified.** This is the highest-priority item today for anyone running disaggregated serving.
2. **🔴 CUDA illegal memory access on Qwen4Exp (Qwen3.8-Flash-Next) at 262,144-token boundary** — [#62383](https://github.com/vllm-project/vllm/issues/62383). Single prefill crossing the native context boundary crashes the engine. Regression: OK on v0.31.1, broken on v0.32.0 and nightly. HW: 8×H200, TP=2+EP.
3. **🟠 DSpark draft for DeepSeek-V4 has no `packed_modules_mapping` → 0% speculation acceptance** — [#65618](https://github.com/vllm-project/vllm/issues/65618). Fused layers ignore `ignored_layers`; repro on DeepSeek-V4.1-Flash. Fix PR: *(none in today's list)*.
4. **🟠 GDN attention warmup crash with `torch.compile`** — [#50046](https://github.com/vllm-project/vllm/issues/50046). Qwen3.5/Qwen3-Next stride mismatch at warmup; recurrence of #29014 on the `splitting_ops` boundary.
5. **🟠 Hybrid GDN prefix-cache misses under MTP spec decoding** — [PR #52244](https://github.com/vllm-project/vllm/pull/52244). On Qwen3.5-122B-A10B, replayed cached prompts never reach expected depth; prompts whose length is a multiple of the hash unit get **zero** hits.
6. **🟠 Batch-dependent numerics in Qwen3.6 GDN greedy DFlash2** — [#62851](https://github.com/vllm-project/vllm/issues/62851). Divergence linked to preemption/recompute; relevant to batch-invariance work.
7. **🟡 Client disconnect not detected on non-streaming chat completions** — [#61918](https://github.com/vllm-project/vllm/issues/61918) (CLOSED). Server generated to `max_tokens` and counted tokens as delivered. If you rely on `vllm:request_generation_tokens_sum`, audit before/after this fix.
8. **🟡 Qwen3 tool-call parser: repeated parameter leaves streamed arguments unterminated** — [PR #65775](https://github.com/vllm-project/vllm/pull/65775) fixes [#65774](https://github.com/vllm-project/vllm/issues/65774). Keeps first value; streamed and non-streaming arguments now produce identical valid JSON.
9. **🟡 Compressed-tensors block-FP8 checkpoint with `weight_scale_inv` fails to load** — [PR #60015](https://github.com/vllm-project/vllm/pull/60015). Scale registered as `weight_scale` in `create_weights`, renamed only *after* loading.
10. **🟡 Media cache eviction race during multimodal reads** — [PR #65363](https://github.com/vllm-project/vllm/pull #65363). Evicted entry recreated as empty file → image decode failure; treated as cache miss with retry.
11. **🟡 gpt-oss legacy tool-call header 500** — [PR #65771](https://github.com/vllm-project/vllm/pull/65771) fixes [#65770](https://github.com/vllm-project/vllm/issues/65770). Special-token text in a prior tool-call name caused HTTP 500.
12. **🟡 Flaky MiniMax-M3 decode top-k test** — [PR #65763](https://github.com/vllm-project/vllm/pull/65763). Failed 17 times since build 99886; determinism fix for CI only.
13. **🟡 Intel Arc B580 AWQ `awq_dequantize` AttributeError** — [#41469](https://github.com/vllm-project/vllm/issues/41469) (CLOSED).
14. **🟡 `runai_safetensors_weights_iterator` nondeterministic tensor order → FP8 breakage** — [#38991](https://github.com/vllm-project/vllm/issues/38991) (CLOSED). Affected DGX Spark/Thor/H100/GB200/GB300.

**In-flight fixes worth tracking:** [PR #62916](https://github.com/vllm-project/vllm/pull/62916) synchronizes KV transfer engine IDs across PCP ranks (multi-node PP2/PCP8/TP2 startup failure, hardware validation pending).

---

## 6. What This Means for Application Developers

- **If you run P/D-disaggregated serving with prefix caching, act now.** Disable prefix caching (`--no-enable-prefix-caching`) until #61160 is resolved if your workload is multi-tenant or shares system prompts across users — silent cross-request data leakage is a security and correctness issue, not just a quality issue.
- **Pin known-good versions for long-context Qwen4Exp.** If you serve Qwen3.8-Flash-Next near the 262K native boundary, v0.31.1 is currently safer than v0.32.0/nightly (#62383).
- **Tool-calling and reasoning parsers have several open edge cases** (Qwen3 repeated params, Gemma4 bare `call:`, qwen3 leading newlines). If your agent framework strictly validates JSON or parses `content` literals, add tolerance or pin parser versions.
- **Speculative decoding acceptance may silently drop to zero** on DeepSeek-V4 DSpark drafts (#65618) — monitor acceptance-rate metrics rather than assuming speedups.
- **Batch-invariance mode has a known Hopper/Blackwell performance tax** (#65569). If you enabled it for reproducibility and are latency-sensitive on SM90/SM100, benchmark before/after; the Triton routing may not be necessary for your workload.
- **Throughput and TTFT improvements are coming** for scheduler-bound deployments: async KV pull re-queueing stalls (1.0–1.8s, #62532) and Mooncake/NIXL async lookup overlap (#61292, #50913). If your P/D TTFT is dominated by connector overhead, watch these.
- **TPU and non-NVIDIA paths are maturing** — Kimi-K3.1-Pro on TPU v7x (#65725) and Iluvatar CoreX (#65557) are now documented; useful if you're evaluating hardware diversification.

---

*Digest generated from github.com/vllm-project/vllm activity for 2026-11-05. No releases in window; 146 issues and 500 PRs updated in the last 24h.*

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-05

## 1. Today's Highlights

No new releases in the last 24h, but issue and PR activity is heavy across the stack. The most notable items are a **correctness regression in PD-disaggregated EAGLE decode** (#48356), a **Kimi-K3 cross-prompt reasoning leakage bug now closed as inactive** (#34259), and a broad **Apple Silicon serving redesign RFC** (#32321) that is actively being updated. Meanwhile, kernel/optimization PRs dominated the queue: fused MoE/attention work on AMD gfx950 (#48490, #48043), Hopper fused DSv4.1 compressors (#41294), and CI infra churn as the H100 pool shrinks (#48053, #42752).

## 2. Releases & Breaking Changes

- **None in the last 24h.** No tagged releases were published.
- Ongoing **API unification RFC (#45816)**: migrating `sgl-processor` and `sgl-router` onto the shared Rust `api.v1.Generate` schema ([#45816](https://github.com/sgl-project/sglang/issues/45816)). No user-facing breaking change yet, but clients hitting the router should expect future schema alignment.
- **Import-time side effect** ([#48460](https://github.com/sgl-project/sglang/issues/48460)): importing `sglang` monkey-patches `triton.next_power_of_2` with a host-only implementation, silently breaking other Triton kernels in-process. This is a behavior hazard for any project that co-imports SGLang and custom Triton code.

## 3. New Model & Hardware Support

- **Apple Silicon redesign RFC** ([#32321](https://github.com/sgl-project/sglang/issues/32321)): updated roadmap for a Torch-owned SRT path with an exported whole-model MLX region. Implementation PR is #36164.
- **Muse Spark Open Development** ([#44678](https://github.com/sgl-project/sglang/issues/44678)): Day-0 support PRs (#44664, #44665, #44666, #47371) being merged in sequence, with a required DeepGEMM patch/bump.
- **MiniMax-H3** positioned as the Q4 stress test in the **SGLang-Diffusion roadmap** ([#43313](https://github.com/sgl-project/sglang/issues/43313)).
- **gfx950 / MI355X Qwen3.8-Flash-Next** optimization tracker opened ([#44304](https://github.com/sgl-project/sglang/issues/44304)) — GatedDeltaNet + QSA + MXFP4 MoE + NEXTN MTP.
- **GLM-5.3-Flash on Hopper (SM90)** performance tracker ([#45373](https://github.com/sgl-project/sglang/issues/45373)), part of the Q4 kernel-optimization roadmap #42473.

## 4. Performance & Optimization

- **[AMD] Kimi-K3 gfx950 prefill** ([#48490](https://github.com/sgl-project/sglang/pull/48490)): row-sharded MoE front, shared experts, and o_proj kept per-rank to avoid an all-gather per layer.
- **[AMD] Qwen3 gfx950 block-FP8** ([#48043](https://github.com/sgl-project/sglang/pull/48043)): fuses the 1x128 FP8 input quantization into RMSNorm and SiLU-and-mul, removing a standalone quant kernel per block-FP8 linear.
- **[NVIDIA] DSv4.1 fused low-ratio compressor on Hopper** ([#41294](https://github.com/sgl-project/sglang/pull/41294), closed): replaces the split two-GEMM + pooling + RMSNorm + index-K + FlashMLA cache-store sequence with a fused path.
- **MLA zigzag context parallelism** ([#45497](https://github.com/sgl-project/sglang/pull/45497)): drops the concat/slice/separate round-trip on `q_nope`/`q_rope` and feeds components separately to FlashAttention.
- **FP8 per-tensor linears** ([#44486](https://github.com/sgl-project/sglang/pull/44486)): moves bias into the cuBLASLt epilogue.
- **Gemma3 q_norm/k_norm fusion** ([#48370](https://github.com/sgl-project/sglang/pull/48370)): 3D-input path now hits fused `gemma_rmsnorm` instead of ~10 eager kernels per norm.
- **LPM bounded matching window** ([#48409](https://github.com/sgl-project/sglang/pull/48409)): opt-in cache-aware scheduling for long waiting queues, recovering prefix locality that FCFS fallback sacrifices.
- **MiniMax-sparse decode indexer CP on Hopper** ([#46597](https://github.com/sgl-project/sglang/pull/46597)): extends top-k sharing to CUDA at TP4/TP8; on 128K context, each rank currently scans 33.5 MB/request/layer.
- Open perf concern: **DeepSeek-V4 dsv4 prefill on SM120** reports ~2–7K tok/s vs ~12.5K with vLLM/marlin on identical 4× RTX PRO 6000 hardware ([#33422](https://github.com/sgl-project/sglang/issues/33422)) — no definitive root cause yet.

## 5. Stability & Regressions (ranked by severity)

1. **PD-disaggregated EAGLE decode corruption after retraction** ([#48356](https://github.com/sgl-project/sglang/issues/48356), new today) — Qwen EAGLE decode in disaggregation mode can emit corrupted output post-retraction. No fix PR referenced.
2. **DSpark + TP deadlock with grammar-constrained batching** ([#41449](https://github.com/sgl-project/sglang/issues/41449)) — any grammar-constrained request batched with another request deadlocks all ranks; GPUs spin in a collective. Reproduced on overlap and non-overlap paths.
3. **Kimi-K3 cross-prompt reasoning leakage** ([#34259](https://github.com/sgl-project/sglang/issues/34259), closed as inactive) — serious correctness/privacy class bug that auto-closed without a visible fix. Worth verifying on current main.
4. **Router circuit breaker still dispatches to decode** ([#31206](https://github.com/sgl-project/sglang/issues/31206)) — an open breaker leaves a permanent fake-dead prefill in `sgl-router` PD mode.
5. **HiCache host-tier hits collapse on hybrid GDN models** ([#45400](https://github.com/sgl-project/sglang/issues/45400)) — once evicted working set exceeds ~3 long prefixes, host hits drop to zero (mamba pool exhausted while KV remains on host).
6. **MambaPool.copy_from CUDA OOM under parallel admission bursts** ([#47916](https://github.com/sgl-project/sglang/issues/47916)) — batched gather of temporal states into one `(n × state_size)` temp; hits GLM-5.3-Flash-class hybrid models.
7. **NVFP4 MoE Marlin fallback leak** ([#38074](https://github.com/sgl-project/sglang/issues/38074), closed) — `prepare_moe_nvfp4_layer_for_marlin` leaked ~0.66 GiB/layer via a retained `{fqn: tensor}` registry, OOMing ≤48 GB cards.
8. **DSPARK/DFLASH silently ignores sampling penalties** ([#46752](https://github.com/sgl-project/sglang/issues/46752)) — `repetition_penalty`, `frequency_penalty`, `presence_penalty`, `min_tokens` have no effect under `--speculative-algorithm DSPARK`.
9. **`--tool-call-parser auto` fails on common models** ([#48172](https://github.com/sgl-project/sglang/issues/48172)) — no parser detected on Qwen2.5-0.5B, Qwen3 2507, Ling-mini-2.0; tool calls returned as plain text.
10. **Mooncake HiCache backup fails for Qwen3.8-Flash-Next-FP8** ([#48145](https://github.com/sgl-project/sglang/issues/48145)).
11. **CI flakiness tracker** ([#42752](https://github.com/sgl-project/sglang/issues/42752), 176 comments): ongoing catalog of NVIDIA `PR Test Base`/`PR Test Extra` flakes; complements #17050. Diffusion perf checks are runner-dependent and not recoverable via in-job retries ([#48311](https://github.com/sgl-project/sglang/issues/48311)); Wan VAE decode spikes 2–10× on `5090-sm*` runners ([#48196](https://github.com/sgl-project/sglang/issues/48196)).
12. **CI capacity**: H100 pool down from 40 → 16 runners; median wait 33 min, p90 394 min on per-commit base-b jobs ([#48053](https://github.com/sgl-project/sglang/pull/48053)) — landing tests on `1-gpu-small` is being triaged.

## 6. What This Means for Application Developers

- **Avoid PD + EAGLE retraction paths for now** if you serve Qwen-family models with disaggregated prefill/decode and client-side cancellations (#48356); retraction can corrupt outputs silently.
- **Grammar-constrained decoding under TP is unsafe with DSpark** (#41449). If you combine JSON-schema/grammar constraints with tensor parallelism and speculative decoding, expect hard deadlocks, not errors.
- **Speculative decoding is not penalty-transparent** (#46752) — if your agent relies on repetition/presence penalties, DFLASH/DSPARK will ignore them, producing different sampling behavior than the non-speculative path.
- **Tool calling is fragile with `auto` parser** (#48172) — pin an explicit `--tool-call-parser` per model family rather than relying on auto-detection.
- **Long-context hybrid-model serving** (GLM-5.3-Flash and similar GDN/mamba hybrids): expect HiCache host-tier benefits to vanish past ~3 long prefixes, and watch for OOMs during parallel admission bursts (#45400, #47916).
- **Kernel ecosystem co-imports**: if you import SGLang in a process that also uses custom Triton kernels, SGLang's import-time patch of `triton.next_power_of_2` (#48460) can subtly break your numerics or performance — isolate SGLang into its own process for now.
- **No release-blocking change today**, but the API unification RFC (#45816) is the item to watch for future client/router compatibility across processor, router, and generation APIs.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-05

## 1. Today's Highlights

llama.cpp cut **v0.9.0**, a substantive release adding OCP FP8 E4M3 quantization, a new `flash_attn_ext_rows` op that makes the unified KV cache efficient for multi-sequence inference, a generic batched tensor copy API, and four new architectures (Clover, Limite, Metis-1.6, Mistral Large 4) plus audio support. Alongside the release, the project landed OpenCL Flash Attention decode improvements, realtime WebSocket error hardening in the server, and the b12110–b12119 binaries. The dominant active workstreams are Vulkan/SYCL stability on Intel and AMD hardware and Flash Attention correctness across backends.

## 2. Releases & Breaking Changes

- **v0.9.0 / build b12110** — Version bump; notable additions are OCP FP8 E4M3 quantization support, `flash_attn_ext_rows` (unified KV cache efficiency for multi-sequence inference), and a generic batched tensor copy API. Four new architectures and audio support. ([release](https://github.com/ggml-org/llama.cpp/releases))
- **Builds b12119, b12118, b12116, b12114, b12109, b12102, b12101, b12100** rolled out in the last 24h, covering a server realtime fix, OpenCL perf, drama-3 TTS, WebGPU buffer sizing, a ggml sync, view-bound correctness, and GGUF writer/`-hf` tag fixes.
- **Compatibility note:** PR [#31473](https://github.com/ggml-org/llama.cpp/pull/31473) adds the batched tensor API (`get_tensor_n`/`set_tensor_n`) to WebGPU — backend implementers should track this API as it rolls out.
- **Config/metadata:** PR [#31698](https://github.com/ggml-org/llama.cpp/pull/31698) adds `{arch}.use_cfg` GGUF metadata for chatterbox, removing a hard-coded `n_parallel *= 2`.

## 3. New Model & Hardware Support

- **Architectures (v0.9.0):** Clover, Limite, Metis-1.6, and Mistral Large 4.
- **drama-3 TTS** support in model/mtmd ([b12116](https://github.com/ggml-org/llama.cpp/releases)); helper stops at the codebook tower limit.
- **Ripple (ricursiveAI) 65B** dense architecture — converter + graph, no new ops ([PR #31692](https://github.com/ggml-org/llama.cpp/pull/31692)).
- **Nemotron-H (Mamba2-hybrid)** RoPE and FFN activation fix for correct logits ([PR #31703](https://github.com/ggml-org/llama.cpp/pull/31703)).
- **WebGPU timestep embedding** kernel (for stable-diffusion.cpp downstream) ([PR #31695](https://github.com/ggml-org/llama.cpp/pull/31695)).
- **XDNA backend** feature request still open with 37 comments ([Issue #21725](https://github.com/ggml-org/llama.cpp/issues/21725)).
- **YaRN `truncate=false`** support (CPU + CUDA only; other backends marked unsupported) ([PR #30206](https://github.com/ggml-org/llama.cpp/pull/30206)).

## 4. Performance & Optimization

- **OpenCL decode:** improved perf with FA — more workgroups for q4_K gate up + GLU, FA handling for GQA 2/6 with head size 256 ([PR #31633 / b12118](https://github.com/ggml-org/llama.cpp/releases)).
- **Intel Vulkan prefill FA kernel** in progress, targeting Intel platform prefill performance ([PR #29357](https://github.com/ggml-org/llama.cpp/pull/29357)).
- **Vulkan rms_norm:** partial sums reduced through shared memory ([PR #30826](https://github.com/ggml-org/llama.cpp/pull/30826)); runtime loop count to fix Adreno miscompiles in unrolled variants ([PR #30824](https://github.com/ggml-org/llama.cpp/pull/30824)).
- **HIP fast-math** enabled without regressions ([PR #31625](https://github.com/ggml-org/llama.cpp/pull/31625)).
- **CUDA MMVQ:** host now uses `ggml_cuda_highest_compiled_arch(cc)` so launch bounds match device PTX ([PR #31679](https://github.com/ggml-org/llama.cpp/pull/31679)).
- **ggml GGUF writer:** host-buffer tensors now written directly, skipping a staging copy ([PR #31144](https://github.com/ggml-org/llama.cpp/pull/31144)).
- **Regression watch:** Gemma-4 decode on Arc B580 (Vulkan) down ~5%, bisected to `0bb496db` ([Issue #30018](https://github.com/ggml-org/llama.cpp/issues/30018)).

## 5. Stability & Regressions (ranked)

1. **Vulkan `ErrorDeviceLost` across multiple platforms** — Strix Halo RADV [Issue #25664](https://github.com/ggml-org/llama.cpp/issues/25664) (closed/stale), AMD RX 7900 XTX [Issue #30010](https://github.com/ggml-org/llama.cpp/issues/30010), and RX 6900 XT [Issue #27076](https://github.com/ggml-org/llama.cpp/issues/27076). Recurrent and highest severity for Vulkan users; no unified fix identified.
2. **Vulkan/ANV FA fallback to SCALAR causes O(N²) prefill degradation + device loss** [Issue #27638](https://github.com/ggml-org/llama.cpp/issues/27638).
3. **CUDA illegal memory access with Gemma 4 + draft-MTP after KV rollback** [Issue #31077](https://github.com/ggml-org/llama.cpp/issues/31077) — no crash with MTP off; likely related to KV-shift work in [PR #31683](https://github.com/ggml-org/llama.cpp/pull/31683).
4. **`GGML_ASSERT(ubatch->embd_state)` abort on Gemma 4 + `--mmproj` + MTP startup** [Issue #30698](https://github.com/ggml-org/llama.cpp/issues/30698).
5. **CUDA `MUL_MAT_ID` MMVQ "invalid argument" on Turing with older virtual arch** [Issue #30524](https://github.com/ggml-org/llama.cpp/issues/30524) — fix candidate in [PR #31679](https://github.com/ggml-org/llama.cpp/pull/31679).
6. **Vulkan KHR_coopmat nondeterministic wrong results on Intel Arc Pro B70** [Issue #31560](https://github.com/ggml-org/llama.cpp/issues/31560).
7. **Vulkan A770 long-running decode degradation (empty EOS replies) after ~7–8h** [Issue #29526](https://github.com/ggml-org/llama.cpp/issues/29526).
8. **Cross-slot system prompt leakage** [Issue #27422](https://github.com/ggml-org/llama.cpp/issues/27422) — serious correctness concern for multi-tenant server deployments.
9. **Server realtime crash on exceptions** — fixed in [b12119](https://github.com/ggml-org/llama.cpp/releases): error event now sent via `ex_wrapper` instead of crashing.
10. **`--load-mode none` appears ignored** on FreeBSD/Vulkan [Issue #31425](https://github.com/ggml-org/llama.cpp/issues/31425).

## 6. What This Means for Application Developers

- **Unified KV cache for multi-sequence inference** (`flash_attn_ext_rows` in v0.9.0) is the headline for serving workloads — it should improve memory efficiency when batching many concurrent sequences, directly relevant to agents with parallel tool calls or multi-turn sessions.
- **The realtime server no longer crashes on exceptions** ([b12119](https://github.com/ggml-org/llama.cpp/releases)); WebSocket clients now receive error events. Update if you run `llama-server --realtime`.
- **Watch cross-slot prompt leakage** ([Issue #27422](https://github.com/ggml-org/llama.cpp/issues/27422)) if you operate multi-tenant or multi-slot servers — this is a data-isolation issue, not just a perf bug.
- **Vulkan device-loss issues are systemic** on Intel and AMD; if you ship Vulkan builds, monitor [Issue #25664](https://github.com/ggml-org/llama.cpp/issues/25664) / [#30010](https://github.com/ggml-org/llama.cpp/issues/30010) and consider FA-disabled fallback paths for long-running decode.
- **KV shifting rework** ([PR #31683](https://github.com/ggml-org/llama.cpp/pull/31683), [#31693](https://github.com/ggml-org/llama.cpp/pull/31693)) moves per-model rope construction into the model class — relevant if you extend models or depend on context-shift behavior for long conversations.
- **FP8 E4M3 quantization** broadens low-precision serving options; verify your target backend implements the new path before switching production configs.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-05

## 1. Today's Highlights

No releases landed in the last 24 hours, but the open-issue queue is dominated by tool-calling correctness problems across Qwen 2.5/3 models — a broken `String()` rendering of tool functions in the library template (#19529, fixed by #19534) and native tool-call failures on 0.40.13 (#19524, #19439). On the positive side, the Qwen3/3.5 MLX YaRN rope-scaling gap is finally closed (#19231, merged; issues #18262, #19129), and a targeted fix restores the no-argument `ollama` launcher (#19478). Cloud API regressions (`/api/usage` percentages, DeepSeek max_tokens) are also drawing attention.

## 2. Releases & Breaking Changes

- **No new releases.** Latest stable referenced in issues: **0.40.13 / 0.40.14**. VRAM prediction and Responses API behavior in 0.40.14 are under active investigation (see §5).

## 3. New Model & Hardware Support

- **MLX Qwen3 / Qwen3.5 now honor YaRN scaling** — explicit RoPE scaling metadata is applied to text and mRoPE, with fixtures for prefill/decode/partial rotation. Closes #19129 and #18262. ([PR #19231](https://github.com/ollama/ollama/pull/19231))
- **MLX CUDA device rejection** — the MLX CUDA runner now checks `cuda.get_arch_list()` and refuses incompatible GPUs at init instead of failing later with a confusing backend error. ([PR #19521](https://github.com/ollama/ollama/pull/19521))
- **AutoTrust decision model (MLX)** — text + vision support through creation, prompt encoding, and API routing. ([PR #19399](https://github.com/ollama/ollama/pull/19399))
- **WSL2 on RTX Spark N1X** — patch to use full dedicated GPU memory instead of capping at guest-visible RAM; paired issue #19519. ([PR #19520](https://github.com/ollama/ollama/pull/19520))
- **Kimi Code CLI launcher support** added to `ollama launch` (config.toml `[providers.ollama]`, `-m <alias>`). ([PR #19506](https://github.com/ollama/ollama/pull/19506))

## 4. Performance & Optimization

- **Installer/bundle size** — active discussion on reducing Linux/Windows bundle size after CUDA v13 was added: per-GPU-class installers (CPU-only, ROCm, CUDA-12, CUDA-13) proposed. Issues [#12268](https://github.com/ollama/ollama/issues/12268), [#19512](https://github.com/ollama/ollama/issues/19512); community DEB packaging PR [#19531](https://github.com/ollama/ollama/pull/19531).
- **VRAM prediction over-counts KV cache 4–8x for hybrid (recurrent/SSM) models** and bills f16 regardless of `OLLAMA_KV_CACHE_TYPE`, causing premature eviction of runners with `keep_alive=-1`. High-impact for Qwen3.5/3.8 and Qwen3-Next-style deployments. ([Issue #19463](https://github.com/ollama/ollama/issues/19463))
- **OpenAI-compatible SSE streaming flush** — patch to flush chunks promptly through completion, addressing apparent UI hangs in Chatbox/Open WebUI. ([PR #17027](https://github.com/ollama/ollama/pull/17027))

## 5. Stability & Regressions (ranked)

1. **Critical — CUDA v13: long grammar-constrained (`format`) generation triggers "unspecified launch failure" / Xid 79, GPU falls off the bus.** cuda_v12 unaffected. No fix PR visible. ([Issue #17026](https://github.com/ollama/ollama/issues/17026))
2. **High — Native tool calling broken on 0.40.13** for `qwen2.5-coder:7b` and Qwen3 (Windows + Open WebUI), plus runner disconnects / HTTP 500 on `/tokenize` during tool calling on RTX 5090. ([#19524](https://github.com/ollama/ollama/issues/19524), [#19439](https://github.com/ollama/ollama/issues/19439))
3. **High — Template renders `{{ .Function }}` as a Go struct dump, not JSON**, causing misspelled tool names and dropped calls with the stock qwen2.5 template. Fix PR open. ([Issue #19529](https://github.com/ollama/ollama/issues/19529) → [PR #19534](https://github.com/ollama/ollama/pull/19534))
4. **Medium — Responses API silently truncates oversized input with truncation disabled** on 0.40.13/0.40.14 (Bonsai 27B). ([Issue #19492](https://github.com/ollama/ollama/issues/19492))
5. **Medium — Vision inference HTTP 500 "token repeat limit reached"** with `qwen2.5vl:3b` when vision encoder runs on NVIDIA GPU (CPU path OK). ([Issue #19483](https://github.com/ollama/ollama/issues/19483))
6. **Medium — Cloud API regressions:** `/api/usage` dropped session/weekly percentage fields ([#19511](https://github.com/ollama/ollama/issues/19511)); `deepseek-v4-pro` rejects `max_tokens > 65536` despite ~384k capability ([#19517](https://github.com/ollama/ollama/issues/19517)).
7. **Low — TLS handshake timeouts pulling models** (older but re-touched today). ([Issue #3504](https://github.com/ollama/ollama/issues/3504))
8. **Low — Ollama Cloud usage stats not exposed via `/api/me`** (feature request, 93 👍 — highest-signal ask in today's set). ([Issue #12532](https://github.com/ollama/ollama/issues/12532))

## 6. What This Means for Application Developers

- **Do not rely on native tool calling on 0.40.13 with Qwen 2.5/3 models.** If your agent stack depends on structured tool invocations, pin to a version without the template regression or apply the fix in PR #19534 locally. Validate tool JSON rendering with `_debug_render_only` before trusting outputs.
- **Hybrid/SSM models may be evicted unexpectedly** under multi-model load due to 4–8x KV cache over-prediction. If you use `keep_alive=-1` with Qwen3.5/3.8-class models, monitor `ollama ps` and reduce concurrent residency.
- **Cloud `/api/usage` consumers must migrate:** percentage fields are gone; only request-count buckets remain. If you built dashboards on this endpoint, plan for breakage or read from the web settings page.
- **Long-context MLX users on Apple Silicon** get correct YaRN behavior now (merge landed) — re-benchmark Qwen3/3.5 at >262K context; previously silent quality loss is fixed.
- **Streaming UIs (Open WebUI, Chatbox):** if you see hangs despite ongoing inference, track PR #17027 for the SSE flush fix; it directly affects perceived latency.
- **Windows installer bloat** is a known pain point; if you distribute bundles with pinned runtime selection, expect per-GPU-class installers to arrive in a future release (issues #12268 / #19512).

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-05

## 1. Today's Highlights

LiteLLM shipped v1.108.0 (with v1.106.7 and a v1.109.0-rc.1 pre-release) while the issue tracker shows heavy churn in the Anthropic `/v1/messages` translation layer — the surface most exposed to Claude Code and other agent clients. A large control-plane stack (9 PRs) is in flight, adding fleet fan-out, audit sinks (Splunk, Sentinel, S3 Object Lock), and OTel span propagation across control/data planes. Meanwhile, a v1.108.0 regression in MCP `tools/list` latency and several streaming/fallback correctness bugs are the most operationally significant items today.

## 2. Releases & Breaking Changes

- **v1.108.0** — Docker images now signed with cosign; verification key pinned to commit `e82a3c6`. ([release](https://github.com/BerriAI/litellm/releases))
- **v1.106.7** — Patch release with the same cosign verification flow across `litellm-database`, `litellm-non_root`, and `docker.io/litellm/*` images.
- **v1.109.0-rc.1** — Release candidate available for early testing.
- **Model map removal (regression, see §5):** `eu.anthropic.claude-haiku-4-5-20251001-v1:0` was dropped from `model_prices_and_context_window.json` and the model map in #49113, though AWS still serves this EU inference profile. ([#49312](https://github.com/BerriAI/litellm/issues/49312))
- **Behavior change in `/model/update`:** partial PATCH bodies silently drop `drop_params` and other extra-only `litellm_params` fields — treat updates as full replacements until fixed. ([#35842](https://github.com/BerriAI/litellm/issues/35842))

## 3. New Model & Hardware Support

- **Qoder Cloud Agents** added to the Interactions API (async text, streaming, session continuation) via PR #50041. ([PR](https://github.com/BerriAI/litellm/pull/50041))
- **Nadir** proposed as a Decisions provider and auto-router decision model. ([#41797](https://github.com/BerriAI/litellm/pull/41797))
- **QwenCloud migration path** requested for the existing DashScope provider (OpenAI- and Anthropic-compatible endpoints). ([#36150](https://github.com/BerriAI/litellm/issues/36150))
- **Cloudflare Workers AI** provider implementation flagged as ~10 months stale relative to Cloudflare's expanded API (text-to-image, text-to-speech, etc.). ([#21115](https://github.com/BerriAI/litellm/issues/21115))
- **NVIDIA Riva** STT reworked to call gRPC directly, sending the API key exactly once — fixes self-hosted Riva servers rejecting requests. ([#50140](https://github.com/BerriAI/litellm/pull/50140))
- **GitHub Copilot** auth: token now sent directly rather than exchanged, supporting company GitHub App tokens. ([#50126](https://github.com/BerriAI/litellm/pull/50126))

## 4. Performance & Optimization

- **MCP `tools/list` latency regression (v1.108.0):** 18–50 s stalls on the legacy subscription listener after `notifications/initialized` for pre-2026 protocol clients (e.g., Python `mcp` SDK used by Open WebUI). No fix PR linked yet. ([#50065](https://github.com/BerriAI/litellm/issues/50065))
- **Rust router core** proposed as an alternative to the Python core, with the host as the only boundary and no native executor path — aimed at routing throughput/latency. ([#49513](https://github.com/BerriAI/litellm/pull/49513))
- **Control-plane OTel spans + W3C `traceparent` propagation** across dataplane attempts, enabling per-attempt latency attribution. ([#49659](https://github.com/BerriAI/litellm/pull/49659))
- **Prompt-cache miss on Vertex Claude tool loops:** `/v1/messages` builds the upstream body with `messages` before `system`/`tools`, breaking cache hits on tool-loop rounds. ([#50070](https://github.com/BerriAI/litellm/issues/50070))

## 5. Stability & Regressions

Ranked by severity:

1. **Usage/billing loss on client disconnect (open, long-standing):** early stream termination before the final usage chunk drops all token accounting — billing gaps and quota drift. 4 👍. ([#14457](https://github.com/BerriAI/litellm/issues/14457))
2. **MCP `tools/list` 18–50 s stall in v1.108.0** — upgrade regression from v1.106.6. ([#50065](https://github.com/BerriAI/litellm/issues/50065))
3. **Mid-stream fallback lost on reasoning-only prefix:** `sent_first_chunk` flips on reasoning deltas, so a failure during thinking is misclassified as post-first-chunk and fallback is skipped even though the client received nothing. ([#49795](https://github.com/BerriAI/litellm/issues/49795))
4. **SSE keepalive masks upstream failure:** with `sse_keepalive_ping_interval_seconds`, the first `: ping` commits a 200 stream, so later upstream errors are written into the body instead of raised — Anthropic clients never see a proper error. ([#49711](https://github.com/BerriAI/litellm/issues/49711))
5. **`/v1/messages` streaming drops first `text_delta`** after a thinking→text block transition (now closed). ([#30765](https://github.com/BerriAI/litellm/issues/30765))
6. **Responses bridge duplicates tool-call arguments** in `/v1/chat/completions` streaming via `azure/responses` (closed). ([#48773](https://github.com/BerriAI/litellm/issues/48773))
7. **Databricks tool-only responses crash** with `KeyError: content` in `resolve_reasoning_and_content`. ([#48637](https://github.com/BerriAI/litellm/issues/48637))
8. **Anthropic `server_tool_use` (web search) surfaced as pending `tool_call`** on `/v1/chat/completions`, causing agent client loops. ([#48384](https://github.com/BerriAI/litellm/issues/48384))
9. **Guardrail gaps on `/v1/messages`:** model-level guardrails not applied (`applied_guardrails` empty) and `custom_code`/`tool_permission` guardrails cannot see MCP tools. ([#36085](https://github.com/BerriAI/litellm/issues/36085), [#40583](https://github.com/BerriAI/litellm/issues/40583))
10. **Budget accounting races:** concurrent requests can bypass `max_budget_per_session` before spend is recorded; `/key/update` during in-flight requests drops that request's cost from the window spend (closed). ([#34732](https://github.com/BerriAI/litellm/issues/34732), [#49179](https://github.com/BerriAI/litellm/issues/49179))
11. **Reasoning replay incompatibilities:** Bedrock Converse replays `reasoningText.signature` to non-Anthropic models (GLM 5.3) → 400; Groq rejects replayed `reasoning_content`; DeepSeek Anthropic-compat 400s when assistant history lacks `reasoning_content`; `chatgpt/` drops encrypted reasoning on `/v1/messages`. ([#49969](https://github.com/BerriAI/litellm/issues/49969), [#47931](https://github.com/BerriAI/litellm/issues/47931), [#31439](https://github.com/BerriAI/litellm/issues/31439), [#49046](https://github.com/BerriAI/litellm/issues/49046))
12. **Redaction leaks (fix PRs open):** proxy failure hooks write raw prompts into spend logs, Datadog, and OTel spans when redaction is enabled; callback failure events bypass per-callback message redaction. Stack of 5 PRs (#49379–#49381). ([#49379](https://github.com/BerriAI/litellm/pull/49379), [#49380](https://github.com/BerriAI/litellm/pull/49380), [#49381](https://github.com/BerriAI/litellm/pull/49381))
13. **OpenTelemetry `set_attributes` crashes** on non-dict response objects (`DecisionsResponse`, MCP `CallToolResult`, list). ([#48719](https://github.com/BerriAI/litellm/issues/48719))
14. **`bedrock/openai` invoke route ignores `model_id`** (application inference profile ARN) → 400. ([#49083](https://github.com/BerriAI/litellm/issues/49083))
15. **`json_schema` response format forwarded to providers supporting only `json_object`** → 400 surfaced as 500. ([#49198](https://github.com/BerriAI/litellm/issues/49198))

## 6. What This Means for Application Developers

- **Pin your proxy version if you use MCP.** v1.108.0 introduces a serious `tools/list` latency regression for older-protocol MCP clients; stay on v1.106.6/7 until #50065 is resolved, or test v1.109.0-rc.1.
- **Streaming is where correctness bugs concentrate.** If you rely on fallbacks, usage-based billing, or SSE keepalives, audit your failure paths: reasoning-only prefixes skip fallback (#49795), disconnects lose usage (#14457), and keepalives convert upstream errors into in-body error frames (#49711). Consider client-side handling of `data: {"error": ...}` on `/v1/messages`.
- **Agent clients on `/v1/messages` should expect translation edge cases.** Thinking-block transitions, `server_tool_use` web search, and reasoning replay across providers (Bedrock, Groq, DeepSeek, ChatGPT) all have open or recently closed bugs. Test multi-turn tool loops with thinking enabled before upgrading.
- **Guardrails are not uniformly enforced across endpoints.** If you depend on model-level or MCP-tool guardrails, verify coverage on `/v1/messages` specifically — several reports show guardrails silently skipped there.
- **Budget controls are best-effort under concurrency.** Session caps and key-window spend can be exceeded by in-flight requests; don't treat them as hard admission control for cost-sensitive workloads.
- **Redaction is being tightened.** If you enable message redaction, expect the upcoming PR stack to also scrub failure logs, Datadog, and OTel spans — good for compliance, but review any downstream parsers that assumed raw payloads in error events.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-05

## Today's Highlights
The v0.1.915-beta release adds Qwen3.8-Flash-Next support alongside a CUDA-graphs decode path in PR #16691 that targets host-bound generation on plain `generate()`. On the correctness side, two multi-GPU training bugs were caught and addressed: a tensor-parallel capability registry mismatch for OLMoE (#16709) and a pipeline-parallel MoE router aux-loss weighting bug (#16708). A large cluster of UI/Studio regressions around laggy long conversations and the repeated disappearance of the `search_conversation` tool dominated the issue tracker.

## Releases & Breaking Changes

**v0.1.915-beta** — Improved Customization + Glass + Browser Use
- Adds Qwen3.8-Flash-Next, Glass themes now in Beta, a Composer position slider, and model interaction with files in the built-in browser.
- Also includes lower idle memory usage, preserved chat context when switching GGUF models, faster MLX loading, and FP8 support.
- https://github.com/unslothai/unsloth/releases

**Upcoming transformers 5.23 incompatibility** (#16667, OPEN)
- Transformers 5.23 renames gradient checkpointing to activation checkpointing. The Trainer reads only the new names, changing behavior in four spots; old names remain as aliases until v6. No fix PR referenced yet.
- https://github.com/unslothai/unsloth/issues/16667

**Studio drops arbitrary `chat_template_kwargs`** (#16545, CLOSED)
- `_request_reasoning_kwargs()` filters `chat_template_kwargs` to only `enable_thinking`, `reasoning_effort`, and `preserve_thinking`, blocking model-specific flags such as Sage-A1.5's `verification`.
- https://github.com/unslothai/unsloth/issues/16545

**Torch 2.13/2.14 extras missing from PyPI** (#16520, CLOSED)
- `cu130-2130`/`cu130-2140` extras are in `pyproject.toml` but not published to PyPI.
- https://github.com/unslothai/unsloth/issues/16520

## New Model & Hardware Support

**Qwen3.8-Flash-Next** — shipped in v0.1.915-beta. https://github.com/unslothai/unsloth/releases

**ComfyUI single-file image models** (#16710, OPEN)
- Studio can now load Anima, Chroma1-HD, MOSS-Image `.safetensors` and Krea 2 int4 single files, plus ComfyUI's separate text encoder/VAE files for Krea 2.
- https://github.com/unslothai/unsloth/pull/16710

**ComfyUI LoRA/LoKR on image models** (#16711, OPEN)
- Applies ComfyUI-format LoRA and LoKR files to Anima, Krea 2, and MOSS-Image. Stacked on #16710.
- https://github.com/unslothai/unsloth/pull/16711

**Multi-GPU capability registry: MoE families** (#16709, CLOSED)
- Registry now refuses tensor parallel where `tp_native` cannot shard (e.g. OLMoE under `UNSLOTH_TP_SIZE=2`) and adds the zoo MoE families.
- https://github.com/unslothai/unsloth/pull/16709

## Performance & Optimization

**CUDA-graphs decode by default in `generate()`** (#16691, OPEN)
- A Qwen3-0.6B decode step launches ~675 kernels (1070–1430 with LoRA); on a T4 the GPU is busy only a fraction of each 30–75 ms step. The captured decode step is bitwise-equal to eager and includes memory release plus an eager fallback.
- https://github.com/unslothai/unsloth/pull/16691

**Faster MLX loading and lower idle memory** — v0.1.915-beta. https://github.com/unslothai/unsloth/releases

**FLUX multi-GPU placement** (#16682, #16687, OPEN)
- Automatic placement prefers a one-card + second-card copy over layer split when the primary holds the whole denoiser, so even batches can use the batch split; keeps the second-card copy alive across LoRA weight changes and failures.
- https://github.com/unslothai/unsloth/pull/16682
- https://github.com/unslothai/unsloth/pull/16687

**Context-window transparency** (#13929, OPEN)
- New `/context` command reports token allocation across system turn, tools, and messages, free space, and compaction start point. Addresses user complaints about opaque compaction (#10345).
- https://github.com/unslothai/unsloth/pull/13929

## Stability & Regressions (by severity)

1. **Pipeline-parallel MoE aux-loss bug** (#16708, OPEN) — Under `UNSLOTH_PP_SIZE=2` with `gradient_accumulation_steps > 1`, router load-balancing loss trains a different objective than single-GPU. Registry lists the cell as supported with no warning. Fix PR open.
   - https://github.com/unslothai/unsloth/pull/16708
2. **`search_conversation` tool disappearing (3rd occurrence)** (#16706, OPEN; #16602, CLOSED) — Recurring tool registration loss in desktop + web UI.
   - https://github.com/unslothai/unsloth/issues/16706
3. **UI lag on long conversations** (#16603, OPEN; #15999, OPEN) — Regression in web + desktop; AppImage also reported laggy.
   - https://github.com/unslothai/unsloth/issues/16603
   - https://github.com/unslothai/unsloth/issues/15999
4. **`web_search` always returns "No results found"** (#16664, OPEN) — ddgs request lacks Accept header (DuckDuckGo 202); yandex missing from engine allow-list.
   - https://github.com/unslothai/unsloth/issues/16664
5. **gemma-4-thinking chat template strips reasoning** (#16699, OPEN). https://github.com/unslothai/unsloth/issues/16699
6. **Cancelled queued job dropped from fine-tuning jobs list** (#16632, OPEN) — Jobs API loses a cancelled queued job when a newer job starts.
   - https://github.com/unslothai/unsloth/issues/16632
7. **Mixed ShareGPT chats lose native tool-call metadata** (#16051, CLOSED) — Dataset standardizer misdetects format.
   - https://github.com/unslothai/unsloth/issues/16051
8. **S3 audio path not rewritten for single-record `.json` manifests** (#16630, CLOSED). https://github.com/unslothai/unsloth/issues/16630
9. **AppImage fails to start on Slackware64-current** (#16605, OPEN) — GLib/AppIndicator symbol lookup error.
   - https://github.com/unslothai/unsloth/issues/16605
10. **Update to v0.1.914-beta does not complete** (#16573, CLOSED) — Windows 11. https://github.com/unslothai/unsloth/issues/16573

## What This Means for Application Developers
- **Inference latency**: The CUDA-graphs default (#16691) is the most material change for serving — expect meaningful TTFT/decode gains on short-context workloads, with a safe eager fallback. Validate bitwise equality in your evals before relying on it.
- **Custom chat templates**: If you pass model-specific `chat_template_kwargs` (e.g. agentic verification flags), Studio's 3-key allow-list (#16545) will silently drop them. Route such requests through your own inference path or track the fix.
- **Training determinism**: If you run MoE fine-tunes under pipeline parallelism with gradient accumulation, hold off until #16708 lands — the effective loss differs from single-GPU.
- **Transformers 5.23**: Pin `transformers` below 5.23 in training environments until the checkpointing rename (#16667) is audited, or verify gradient checkpointing behavior explicitly.
- **RAG ingestion quality**: Unicode and escaped-text fixes for spreadsheet parsing (#16712, #16713) matter if you index XLS/XLSX corpora — emoji/CJK names and cell escapes were being corrupted before indexing.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*