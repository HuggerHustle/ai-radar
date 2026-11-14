# AI Infrastructure Digest 2026-11-14

> Generated: 2026-11-14 01:24 UTC | Projects covered: 6

- [vLLM](https://github.com/vllm-project/vllm)
- [SGLang](https://github.com/sgl-project/sglang)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://github.com/ollama/ollama)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Unsloth](https://github.com/unslothai/unsloth)

---

## Cross-Project Comparison

# Cross-Project AI Infrastructure Report — 2026-11-14

## 1. Ecosystem Overview

The ecosystem is in a **hardening-over-expansion phase**: no project shipped a feature release in the window except llama.cpp's v1.0.0, and four of six digests lead with stability, correctness, or migration stories. Hardware fragmentation is the dominant tax — **SM120 (consumer Blackwell) is simultaneously the top theme for vLLM and SGLang and both report it partly broken**, while AMD (ROCm/gfx942/gfx950/gfx1151) and edge accelerators (Hexagon, Ascend, MLU) absorb an outsized share of new kernel work. Meanwhile the **agent tooling surface is where silent correctness bugs are concentrating**: tool-call parsers (Ollama, vLLM), fallback configs (LiteLLM), and KV-cache dtype bugs (vLLM) all produce wrong output without errors. The strategic kernel race has a clear direction — vLLM is migrating off Marlin to Humming for FP4/FP6/FP8 formats, and Unsloth is bringing INT8 attention to diffusion DiTs — while llama.cpp's v1.0.0 signals that local runtimes are formalizing their APIs like production infrastructure.

## 2. Activity Comparison

| Project | Notable open issues (top severity / tracker) | Notable open/moving PRs | Release status | Trajectory |
|---|---|---|---|---|
| **vLLM** | SM120 CUDA graphs broken for DSv4.1 (#56892); FP8 silent KV corruption (#41343); SM8x DSv4-Flash blocked (#50576, 130 comments); Humming migration tracker (#65560) | KV connector fixes (#62916, #58525, #67532); tree-shaped draft verification (#64844); Engram pool (#67539); AWQ MoE configs (#66488) | **No release in 24h**; in-review API removal `mamba_cache_mode` (#63830) | Heavy on correctness + new-format kernels; hardware bring-up lagging |
| **SGLang** | Scheduler `double free` hang (#42508); Blackwell B200 Xid 13 crashes (#46203); FP8 Marlin nondeterminism (#45000); sm_120 unusable OOTB (#49209) | Prefill CP for DS-V4.1 on MI355X (#44730); SM90 FP4 KV attention (#43852); GQA decode fix (#47802) | **No release in 24h**; 1.0 tracker declares stability release (#50045) | Explicit stability pivot; AMD prefill story advancing |
| **llama.cpp** | Tokenizer stack overflow (#27783, open); CUDA `mul_mat_vec_f` race (#32235, fix open); Vulkan NaN/forever-fence issues (multiple) | HIP MMQ tuning (#30021, #30022, #32224); Vulkan coopmat2 GATED_DELTA_NET ~40% (#32111); cgroup-aware threads (#30267) | **v1.0.0 shipped** — breaking public-API removal; `--spec-draft-p-min` semantics change | Mature release; backend work AMD/edge-weighted |
| **Ollama** | Qwen3.5/3-Coder tool-call corruption (#19694, new); cloud Mimo tool-call flood (#19672); ZDR vs cached-pricing ambiguity (#17489) | VRAM accounting/GPU splitting (#19632); auto `num_ctx` (#13619); DeepSeek V4.1 Flash MLX (#19667) | **No release in 24h** | Consolidating runtime + hardening parsers; cloud quality questions open |
| **LiteLLM** | Gemini intermittent 503s (#50434); budget-reservation leak without DB (#45907); non-HttpOnly cookie carrying proxy key (#36997) | Rust router core as only core (#51396); MCP passthrough auth (#49261, #51756); ParallelLoggerV2 port (#51526) | **v1.108.8 LTS** (+ dev .111, maint .106.10) | Rust migration + strict validation = breaking behavior |
| **Unsloth** | ROCm 7.14/MI300X flash-attn backward (#17548); mmap forced in 0.1.917-beta (#17605); GPU idle after update (#17663) | Diffusion DiT INT8 attention (#17718); slot-KV persistence (#17121, closed); benchmarks page (#11808) | **No release in 24h**; 0.1.917-beta flagged as regressiony | Studio GUI + diffusion inference expansion; beta rough |

**Two deltas worth calling out:** vLLM and SGLang each carry **multiple open silent-correctness bugs**, while LiteLLM and Ollama's bugs are mostly availability/validation. llama.cpp is the only project with a shipped breaking release, and Unsloth is the only one where the beta channel itself is cited as a deployment hazard.

## 3. Model Support Race

**Leaders by discipline:**

- **DeepSeek-V4 / V4.1 family** — vLLM is the broadest but not the fastest: it has Engram pool sharding (#67539), DSpark spec-decode fixes (#65647), and KV-connector paths in flight, yet **Ampere (SM8x) support for V4-Flash remains blocked** and **SM120 graph capture is broken**. SGLang has the deeper hardware-specific wins: **FP4 packed main-KV attention on SM90 (#43852)** and **prefill context-parallel on MI355X (#44730)**. Ollama is entering via MLX with a mixed MXFP4/MXFP8 checkpoint (#19667); Unsloth has a community DS-V4.1 `torch.compile` re-enable (#17660). **Net: vLLM leads on feature breadth, SGLang leads on AMD/FP4 depth, nobody has clean Ampere or SM120 coverage.**
- **Qwen3.5 / Qwen3.8 hybrids** — vLLM carries ROCm gfx950 optimization trackers for Qwen3.8-2.4T-A95B and Qwen3.8-Flash-Next; llama.cpp's Vulkan GATED_DELTA_NET coopmat2 (~40%) targets exactly this hybrid family; Ollama owns the tool-parsing surface (and its bugs).
- **Multimodal / vision** — llama.cpp registered Granite 4 Vision conversion and has open Vulkan GLM-OCR failures; Ollama's MLX PR includes vision; vLLM's Qwen-VL FP8 KV bug (#41343) is the cautionary example.
- **Diffusion / image-video** — **Unsloth is alone here**, with INT8 DiT attention covering MiniMax-H3, FLUX.3 klein, and video DiTs on sm75–sm120 + gfx1151.

**Verdict:** Nobody leads universally. **SGLang is ahead on new-hardware kernel depth; vLLM on model-format breadth; llama.cpp on GPU-agnostic coverage (by volume of backends) but not on frontier models.** The gap that matters commercially is Ampere: a large installed base of A100/A800 fleets still cannot run DSv4-Flash on either major engine.

## 4. Performance Frontier

Optimization effort splits along backend lines, which is itself the signal:

| Area | vLLM | SGLang | llama.cpp | Unsloth |
|---|---|---|---|---|
| **Quantization kernels** | Marlin→Humming migration for INT4/8, FP8, MXFP8/4, NVFP4, MXFP6 | AITER pin splits (gfx1250); FP4 KV on SM90 | Hexagon IQ2_XXS/NVFP4; OpenCL Q4_K GEMM; HIP few-row WMMA (RDNA3.5) | **INT8 DiT attention w/ Hadamard rotation** (NVIDIA + Strix Halo) |
| **KV cache** | Connector correctness (engine-ID, block size, cross-PP); CUDA checkpoint/restore RFC (#34303) | **Unified Memory roadmap** (#49944): one GPU arena for full+SWA KV, recurrent & request state | Slot KV persistence (via Unsloth) | — |
| **Batching / graphs** | Tree-shaped draft verification (#64844); mixed prefill-decode 6× gap (#44806) | bs-1 decode graph regression (#49900); breakable prefill CUDA graphs (#45369) | — | — |
| **Distributed serving** | KV disaggregation/Mooncake multi-node fixes | DP attention tail-graph fixes (#49170) | Hexagon multi-device split | — |
| **Non-kernel wins** | Spec-decode logit cutoffs (#66534); engram pool over NVLink/RDMA | AR-fusion symmetric buffer writes (#50002) | **Jinja template overhead (#32023)**; cgroup-aware threads | Slot-KV reload avoidance (#17121) |

**Reading the table:** vLLM and SGLang are competing on kernel *formats* and memory arbitration; llama.cpp is grinding GPU-specific MMQ/coopmat paths (AMD/Intel) plus hexagon/Adreno edge kernels; Unsloth is vertically integrating inference speed into a GUI training product. **KV cache is the new battleground** — SGLang's Unified Memory roadmap and vLLM's checkpoint/restore RFC are both trying to solve cold-start and fragmentation, but neither ships a unified memory slab yet. Note the inverse finding: at low batch, SGLang's graph specialization (#49900) and llama.cpp's small-Metal-offset class bugs show CUDA graphs have become a correctness liability, not just a perf lever.

## 5. Layer Positioning

| Layer | Project | Role in stack | Differentiator vs peers |
|---|---|---|---|
| **Serving engine (GPU, datacenter)** | vLLM | High-throughput multi-model serving, KV disaggregation, spec-decode | Breadth of quant formats + most model checkpoints; most exposed to hardware-bring-up bugs |
| **Serving engine (GPU, datacenter)** | SGLang | Serving engine with the most aggressive new-hardware kernel work (SM90 FP4, AMD gfx950) | Deeper hardware/format specialization; 1.0 betting on stability + named errors |
| **Local/edge runtime** | llama.cpp | Single-binary, CPU/GPU/special-accelerator inference; now also a server control plane (daemon, Unix socket, cgroup threads) | Broadest backend matrix (CUDA/HIP/Metal/Vulkan/Hexagon/OpenCL); v1.0 API freeze |
| **Local/edge runtime + model distribution** | Ollama | Package manager + runtime for local models, plus cloud throughput | Ease-of-use; cloud layer introduces compliance/quality questions it does not fully control |
| **LLM gateway** | LiteLLM | Unified API/proxy across providers, auth, budgets, MCP gateway | Cross-provider normalization + cost governance; Rust migration trades leniency for strictness |
| **Fine-tuning / training** | Unsloth | Fast fine-tuning + GUI Studio/Desktop, expanding into inference (GGUF, diffusion) | GUI + low-VRAM training; only project owning diffusion DiT inference |

**Key layering observation:** the boundaries are eroding. llama.cpp is building server-infrastructure features (daemon, sockets, cgroup awareness); LiteLLM is building a router core in Rust; Unsloth is embedding inference into a training GUI; Ollama is a local runtime with a commercial cloud. **The only clean separation left is gateway (LiteLLM) vs engine (vLLM/SGLang).** For stack design, treat llama.cpp's v1.0 API and LiteLLM's Rust core as *new contracts*, not feature additions.

## 6. Trend Signals

1. **Consumer/workstation Blackwell (SM120) is the current weakest link, and it's a revenue tier now.** vLLM (#56892, #47130, #47436) and SGLang (#49209, #33422) both report SM120 broken or slow, with vLLM explicitly recommending pinning to 0.23.0. If you're buying RTX PRO 6000 fleets, validate on your exact build before committing.
2. **Silent correctness is the top systemic risk, and it clusters in the *serving → agent* boundary.** vLLM's `fp8_e5m2` Qwen-VL corruption (#41343), SGLang's FP8 Marlin nondeterminism with overlap scheduler (#45000), Ollama's Qwen tool-call parser corruption (#19694), and LiteLLM's fallback hard-fail (#51396) all either produce wrong output or fail in ways downstream retries can't detect. **Recommendation: add output validation at the gateway, not just at the engine.**
3. **Speculative decoding is being refined, not expanded.** vLLM (tree-shaped verification #64844), llama.cpp (`--spec-draft-p-min` now *skipped* for sampled drafts), Unsloth (benchmarks page sweeping MTP/ngram/DSpark/DFlash) all show spec-decode moving from "acceptance rate" to "acceptance correctness and tuneability." Flag: llama.cpp's behavior change means tuned p_min settings may now be inert.
4. **AMD and edge accelerators are where compounding perf gains are landing, but ecosystems are less mature.** ROCm 7.14 + MI300X flash-attn backward is broken (Unsloth #17548); SGLang's gfx1250 needs a separate AITER pin with no automated CI (#47562); vLLM has multiple active gfx942/gfx950 trackers. The direction is right; the reliability isn't yet. Re-measure if you evaluated ROCm 3–6 months ago.
5. **Agent workloads are exposing low-concurrency and small-batch pathologies.** SGLang's bs-1 decode being slower than bs-2 (#49900), Ollama's Mimo tool-call storm (#19672), and LiteLLM's budget-reservation leak (#45907) all hit single-session or bursty agent patterns disproportionately. **Agents are the workload class that tests the *least* optimized paths of every engine.**
6. **Gateways are choosing strictness over leniency, migrating to Rust.** LiteLLM's LTS-vs-dev split with breaking validation means app developers should pin `:lts` until they've audited fallback configs, Bedrock tiers, and Anthropic tool-choice handling. This is the same "named errors over silent coercion" philosophy SGLang is adopting — expect every infra layer to follow.

**Watch list for the next 30 days:** SM120 fixes on both engines; SGLang's Unified Memory roadmap; llama.cpp v1.0 migration fallout and the spec-decode flag behavior; Unsloth's INT8 DiT kernel merge (#17718) and whether 0.1.917-beta regressions clear before production adoption.

---

## Per-Project Reports

<details>
<summary><strong>vLLM</strong> — <a href="https://github.com/vllm-project/vllm">vllm-project/vllm</a></summary>

# vLLM Digest — 2026-11-14

## 1. Today's Highlights

No new releases landed in the last 24h, but issue and PR activity is heavy across hardware bring-up and correctness. The most consequential threads: **SM8x (Ampere) support for DeepSeek-V4-Flash remains blocked** (#50576, 130 comments), **SM120 (Blackwell consumer/workstation) CUDA graph capture is broken for DSv4.1-Flash** causing severe decode-throughput loss (#56892), and the long-running **replace-Marlin-with-Humming** quantization migration is now an active tracker (#65560). On the PR side, notable movement on KV-connector correctness (#62916, #58525), buffered online quantization for RL reload (#67576), and tree-shaped speculative draft verification (#64844).

## 2. Releases & Breaking Changes

- **No new releases in the last 24h.**
- **API/config removal (in-review):** PR [#63830](https://github.com/vllm-project/vllm/pull/63830) removes `mamba_cache_mode` — with only `"align"` and `"none"` remaining, Mamba code reads `cache_config.enable_prefix_caching` directly. The `--mamba-cache-mode` flag was already deprecated; anyone scripting that flag should migrate now.
- **Transformers v5 test-coverage tracker** ([#38379](https://github.com/vllm-project/vllm/issues/38379)) remains open — still a living list of skipped/capped tests pending v5 migration.

## 3. New Model & Hardware Support

- **DeepSeek-V4-Flash / V4-Flash-0731 on SM8x (A100/A800, RTX 30xx):** still unsupported. Feature request [#50576](https://github.com/vllm-project/vllm/issues/50576) (130 comments, +16) is the top-traffic issue; neither checkpoint runs on Ampere today.
- **DSpark (spec-decode) for DeepSeek-V4:** fix PR [#65647](https://github.com/vllm-project/vllm/pull/65647) adds missing `packed_modules_mapping` to `DSparkDeepseekV4ForCausalLM` across AMD/NVIDIA/XPU. Fixes #65618.
- **DeepSeek-V4.1 Engram pool:** PR [#67539](https://github.com/vllm-project/vllm/pull/67539) adds `vllm/distributed/engram_pool/` — read-only lookup tables sharded by row across engines over NVLink/RDMA.
- **AWQ MoE configs:** PR [#66488](https://github.com/vllm-project/vllm/pull/66488) makes `MoeWNA16Config` accept AWQ key names (`w_bit`/`q_group_size`), fixing the AutoAWQ MoE fallback path that currently raises `ValueError`.
- **Rust frontend parallel sampling:** PR [#66078](https://github.com/vllm-project/vllm/pull/66078) extends gRPC `GenerateStream` to return multiple candidates per prompt.

## 4. Performance & Optimization

- **Marlin → Humming migration tracker** ([#65560](https://github.com/vllm-project/vllm/issues/65560), +3): Humming now covers INT4/INT8 GPTQ/AWQ, FP8, MXFP8/MXFP4, NVFP4, MXFP6, plus INT8/FP8 activations for dense and MoE. Marlin is SM80-era with no Hopper/Blackwell-specific paths — this is the strategic kernel direction for new formats.
- **ROCm/MI355X optimization trackers** are active: Qwen3.8-2.4T-A95B gfx950 ([#57149](https://github.com/vllm-project/vllm/issues/57149), 34 comments), Qwen3.8-Flash-Next gfx950 ([#59575](https://github.com/vllm-project/vllm/issues/59575)), and Muse Spark Open PTPC-FP8 gfx942 ([#64018](https://github.com/vllm-project/vllm/issues/64018)). All land as stacked PRs on main.
- **Spec-decode top-k/top-p cutoffs on logits load:** PR [#66534](https://github.com/vllm-project/vllm/pull/66534) (draft, stacked on #65102) extends on-load masking to rows with active `top_k`.
- **Tree-shaped draft verification:** PR [#64844](https://github.com/vllm-project/vllm/pull/64844) lets custom speculators hand vLLM a candidate *tree* (not one chain per request) on the V2 model runner; scheduler queries draft counts per step.
- **CUDA checkpoint/restore for near-zero cold starts** ([#34303](https://github.com/vllm-project/vllm/issues/34303), +19) — RFC still under discussion for multi-model serving and swap latency.
- **Mixed prefill-decode slowdown:** [#44806](https://github.com/vllm-project/vllm/issues/44806) reports a **6× gap** between mixed prefill-decode and decode-only steps on Qwen3.5-397B NVFP4 DEP8 (8×B200), with nsys profiles.

## 5. Stability & Regressions

Ranked by severity:

1. **SM120 CUDA graphs unusable for DSv4.1-Flash** — [#56892](https://github.com/vllm-project/vllm/issues/56892). 8×RTX PRO 6000 Blackwell, `--enforce-eager` required; decode throughput extremely low. No fix PR yet.
2. **`kv_cache_dtype="fp8_e5m2"` silently corrupts Qwen-VL output** — [#41343](https://github.com/vllm-project/vllm/issues/41343). Silent correctness failure on Qwen2-VL/Qwen2.5-VL with default scaling. Highest-risk class of bug (wrong answers, no error).
3. **DeepSeek V4 Flash garbled output** — [#43416](https://github.com/vllm-project/vllm/issues/43416) (v0.21.0, `--enable-prefix-caching`).
4. **ROCm/gfx942 GPU memory access fault** — [#48266](https://github.com/vllm-project/vllm/issues/48266). DeepSeek V4 flash arch + sparse_attn_indexer + FP8 KV, MI325X TP=4; crash when sequences cross 2048 tokens.
5. **EngineCore assert on async KV transfer finish for aborted requests** — [#43226](https://github.com/vllm-project/vllm/issues/43226). `_update_from_kv_xfer_finished` asserts `req_id in self.requests`; crashes when a connector reports a finished transfer for a freed request.
6. **SM120 FP8 warmup regressions in v0.24.0** — [#47130](https://github.com/vllm-project/vllm/issues/47130, +6) DeepGEMM "Unknown recipe"; [#47436](https://github.com/vllm-project/vllm/issues/47436) "Unknown SF transformation" for block-scaled W8A8. Both regress vs 0.23.0.
7. **MTP spec-decode divergence on Qwen3.8-27B (GDN hybrid)** — [#63593](https://github.com/vllm-project/vllm/issues/63593) at K≥5, n≥8, L≥192.
8. **CPU spec-decode uninitialized memory** — [#55005](https://github.com/vllm-project/vllm/issues/55005) (closed): CPU `expand_kernel` shim discards output; non-greedy spec decode read uninitialized temperature/top_k/top_p.
9. **KV connector correctness fixes in flight:** engine-ID sync across PCP ranks ([#62916](https://github.com/vllm-project/vllm/pull/62916), draft, PP2/PCP8/TP2 multi-node startup), Mooncake physical KV group block size ([#58525](https://github.com/vllm-project/vllm/pull/58525)), and cross-PP-size KV reuse via Mooncake ([#67532](https://github.com/vllm-project/vllm/pull/67532)).

## 6. What This Means for Application Developers

- **Ampere fleets: DeepSeek-V4-Flash is off the table for now.** If you're on A100/A800, don't plan a DSv4-Flash deployment until #50576 lands.
- **SM120 (RTX PRO 6000 Blackwell) is a minefield for FP8 + CUDA graphs.** v0.24.0 regressions (#47130, #47436) and DSv4.1 graph-capture failure (#56892) mean you should pin to 0.23.0 on this hardware or run eager — and validate output quality, not just that it starts.
- **Audit any Qwen-VL deployment using `fp8_e5m2` KV cache.** #41343 is a silent-corruption bug with no error signal.
- **Prefix caching is getting first-class observability:** [#60044](https://github.com/vllm-project/vllm/issues/60044) requests per-request miss attribution (prompt divergence vs. eviction) — directly useful for RAG/agent scaffolds with long shared prefixes.
- **RL training loops:** two threads to watch — direct weight reload for RL training ([#54477](https://github.com/vllm-project/vllm/issues/54477), now revised after silent-error findings on stale MLA weights) and buffered online quantization for direct reload ([#67576](https://github.com/vllm-project/vllm/pull/67576)). Both target zero train-inference mismatch; [#66550](https://github.com/vllm-project/vllm/pull/66550) points users at the `zero-mismatch-rl` recipes.
- **If you run KV disaggregation/Mooncake across heterogeneous PP topologies,** expect fixes for engine-ID sync and block-size mismatches to land soon; today those paths can fail at startup or mis-key transfers.
- **Tool-calling/reasoning parsers got several fixes:** reserved Python keywords as tool args ([#66174](https://github.com/vllm-project/vllm/pull/66174)), dropped pre-` thinking` text ([#66333](https://github.com/vllm-project/vllm/pull/66333)), and buffered-prefix leaks in the streaming parser ([#66337](https://github.com/vllm-project/vllm/pull/66337)). Worth tracking if you parse model output.

</details>

<details>
<summary><strong>SGLang</strong> — <a href="https://github.com/sgl-project/sglang">sgl-project/sglang</a></summary>

# SGLang Digest — 2026-11-14

## 1. Today's Highlights

SM120 (consumer Blackwell / RTX PRO 6000) hardware support is the dominant theme today: a fresh bug reports that CUDA 13 wheels cannot run *any* model out-of-the-box on sm_120, while a separate perf thread questions why DeepSeek-V4 prefill on 4× RTX PRO 6000 trails vLLM/marlin by roughly 2×. On the roadmap side, the SGLang 1.0 release tracker and the Unified Memory roadmap both saw updates, signaling hardening work over new features. A cluster of long-lived "inactive" CLOSED issues (many auto-triaged in bulk) suggests ongoing issue-hygiene automation.

## 2. Releases & Breaking Changes

- No new releases in the last 24h.
- **[roadmap] SGLang 1.0 Release Tracker** (#50045) — Declares 1.0 a *stability* release: hardening existing functionality, replacing silent config changes with named errors, and defining a 1.x compatibility policy. Upgrading from 0.5.x may require changes. https://github.com/sgl-project/sglang/issues/50045
- **[Tracking] Unified Memory Roadmap** (#49944) — Full-attention KV, sliding-window KV, recurrent state, and request state converge into a single GPU arena, eliminating fixed partitions. Forward-looking but relevant to memory-config expectations. https://github.com/sgl-project/sglang/issues/49944

## 3. New Model & Hardware Support

- **[Bug] sm_120 (RTX 50-series consumer Blackwell) cannot run any model out-of-the-box with CUDA 13 wheel** (#49209) — Newly supported hardware path effectively broken on install; no fix PR referenced. https://github.com/sgl-project/sglang/issues/49209
- **[Roadmap][NPU][Multimodal] Ascend model support & serving features (Q4 2026)** (#43519) — Tracks NPU multimodal workstream under the broader NPU roadmap. https://github.com/sgl-project/sglang/issues/43519
- **[Roadmap][Feature] Cambricon MLU Backend Support** (#45615) — New accelerator backend proposal. https://github.com/sgl-project/sglang/issues/45615
- **[AITER-Upgrade] PR readiness gfx1250 (MI45x)** (#47562) — gfx1250 uses a separate AITER pin from CDNA (gfx942/gfx950); no automated Scout CI for this target. https://github.com/sgl-project/sglang/issues/47562
- **[PR] [NVIDIA] dsv4.1: [2/N] Add SM90 attention for packed FP4 Main KV** (#43852) — Extends FP4 KV attention to SM90. https://github.com/sgl-project/sglang/pull/43852
- **[PR] [Feat] [AMD] DeepSeek-V4.1 prefill CP fixes** (#44730) — Enables prefill context parallel for DS-V4.1 on HIP/MI355X. https://github.com/sgl-project/sglang/pull/44730

## 4. Performance & Optimization

- **[Perf] DeepSeek-V4 dsv4 prefill on SM120 (4× RTX PRO 6000, TP=4): ~2–7K tok/s vs ~12.5K via vLLM/marlin** (#33422) — Open question on tuning; relevant given the sm_120 breakage above. https://github.com/sgl-project/sglang/issues/33422
- **[Bug][Perf] [DeepSeek-V4.1] Decode step with one running request is ~12 ms slower than with two** (#49900) — `_w8a8_block_fp8_matmul` measured ~1.7× slower per call in the bs-1 CUDA graph — a small-batch graph-capture regression. https://github.com/sgl-project/sglang/issues/49900
- **[Bug] [Intel] XPU: GDN chunk prefill 2.6× slower and wrong `recompute_w_u` output for K != V since #47944** (#50249) — Both a regression and a correctness bug on XPU. https://github.com/sgl-project/sglang/issues/50249
- **[PR] [Perf] [NVIDIA] gemma4: write o_proj/down_proj partials straight into the AR-fusion symmetric buffer** (#50002) — Eliminates a `[T, 5376]` bf16 copy before every fused all-reduce site, twice per layer (44 layers). https://github.com/sgl-project/sglang/pull/50002
- **[PR] [Perf] kda: Capture the GLM-5.3-Flash FlashInfer KDA prefill in breakable prefill CUDA graphs** (#45369) — Previously every KDA layer broke the graph under FlashInfer on SM100/SM103. https://github.com/sgl-project/sglang/pull/45369
- **[Perf] Fuse quantization and storage for existing fp4_mx_block16 KV cache** (#39429, CLOSED/inactive) — Would collapse four indexed writes into a fused path. https://github.com/sgl-project/sglang/issues/39429

## 5. Stability & Regressions

Ranked by severity:

1. **[Bug] Scheduler aborts with `double free or corruption` in idle-loop invariant check (`session_held_tokens` walk); server hangs permanently** (#42508) — Memory corruption + permanent hang. https://github.com/sgl-project/sglang/issues/42508
2. **[Bug] Xid 13 "CTA Not Present" in HiCache kvcacheio transfer kernels on Blackwell (B200)** (#46203) — 7 crashes across 4 machines / 7 GPU instances under agentic load. https://github.com/sgl-project/sglang/issues/46203
3. **[Bug] HiCache on hybrid GDN: host-tier hits drop to zero once evicted working set exceeds ~3 long prefixes** (#45400) — Host mamba pool exhausted while KV stays on host. https://github.com/sgl-project/sglang/issues/45400
4. **[Bug] FP8 block-quantized checkpoint on SM86 (FP8 Marlin) intermittently gives wrong tokens with overlap scheduler** (#45000) — Non-deterministic wrong output; exact without overlap scheduler. https://github.com/sgl-project/sglang/issues/45000
5. **[Bug]XEagle] GLM-5.3-Flash: NaN logits latched for all later requests after CUDA-graph batch padding** (#49881, CLOSED) — 9-running→bs-10 graph; fixed as of latest. https://github.com/sgl-project/sglang/issues/49881
6. **[Bug] FlashInfer autotune cache discarded every boot under MoE expert parallelism (EP>1)** (#40320) — `_drop_diverged_autotune_cache()` wipes the cache when per-rank shapes disagree (normal with EP>1), forcing full re-tune each start. https://github.com/sgl-project/sglang/issues/40320
7. **[Bug] sm_120 + CUDA 13 wheel cannot run any model OOTB** (#49209) — See §3. https://github.com/sgl-project/sglang/issues/49209
8. **[Bug] sgl-router: `/v1/messages` returns 400 for requests with inline `role="system"`** (#50348) — Anthropic-compatible endpoint correctness. https://github.com/sgl-project/sglang/issues/50348
9. **[PR] [Fix] attention: Triton decode reads wrong KV head for GQA groups > 16 not divisible by 16 (GLM-4-32B breaks)** (#47802) — gsm8k drops ~93% → ~51%; fix PR open. https://github.com/sgl-project/sglang/pull/47802
10. **[PR] [Fix] deepseek-v4.1: Keep active DP decode ranks out of idle tail replay** (#49170) — Fix PR for colocated prefill/decode DP attention tail-graph bug. https://github.com/sgl-project/sglang/pull/49170

CI health: **[Tracking] CI Test Failures and Fixes** (#17050) auto-update reports **1 broken, 5 flaky, 915 recently fixed** as of 2026-11-14 01:18 UTC. https://github.com/sgl-project/sglang/issues/17050

## 6. What This Means for Application Developers

- **Avoid sm_120 + CUDA 13 wheels for now.** If you're deploying on RTX 50-series / RTX PRO 6000, issue #49209 indicates no model runs OOTB, and #33422 shows prefill throughput well below vLLM on the same hardware. Pin to a known-good CUDA/arch combo until resolved.
- **Watch batch-size sensitivity in decode.** #49900 shows a *single-request* decode step slower than two requests due to CUDA-graph shape specialization — low-concurrency agentic workloads (one session at a time) may see unexpected latency cliffs.
- **Hybrid GDN + HiCache users should cap long-prefix working sets.** #45400's ~3-prefix threshold means agentic apps with several long system prompts will silently lose host-tier cache hits.
- **Overlap scheduler + FP8 Marlin on SM86 is not deterministic.** #45000 produces intermittent wrong tokens; disable overlap scheduling if you need reproducible outputs on Ampere consumer cards.
- **sgl-router Anthropic-compat has a gap.** Inline `role="system"` messages return 400 (#50348) — relevant for apps bridging Claude-style message formats.
- **Expect config errors, not silent fallbacks, in 1.x.** The 1.0 tracker (#50045) explicitly replaces silent configuration changes with named errors — audit your launch flags before upgrading, and review the Unified Memory roadmap (#49944) if you tune KV-cache partitioning today.

</details>

<details>
<summary><strong>llama.cpp</strong> — <a href="https://github.com/ggml-org/llama.cpp">ggml-org/llama.cpp</a></summary>

# llama.cpp Digest — 2026-11-14

## 1. Today's Highlights

llama.cpp shipped **v1.0.0**, its first major version: the deprecated public API is removed and the NextN/speculative-decoding path is promoted to a first-class interface, accompanied by a Hugging Face blog post. Alongside that, the project cleared a very large stale-issue backlog (most items updated today were close-outs), while active engineering work concentrated on HIP/GCN MMQ tuning, Hexagon SSM/quantized kernel coverage, and Vulkan correctness fixes. Notably, the day's backend work is heavily AMD- and edge-accelerator-focused rather than NVIDIA-centric.

---

## 2. Releases & Breaking Changes

- **v1.0.0 — major release, breaking for API consumers.** Deprecated public API removed; NextN/speculative-decoding interface promoted to stable. Downstream projects that still call the old public C API will need to migrate. [Release](https://github.com/ggml-org/llama.cpp/releases) · [Hugging Face blog](https://huggingface.co/blog/ggml-org/llama-cpp-v1)
- **b12364 — speculative decoding semantics change/warning.** `--spec-draft-p-min` is now skipped for sampled MTP and DFlash2 drafts (under rejection sampling, acceptance at a position is `1 - TV(p,q)`, which the draft's top probability does not reflect). Expect log warnings if you use it; flag behavior may differ. [PR #31294](https://github.com/ggml-org/llama.cpp/pull/31294)
- Builds b12363–b12374 are rolling incremental builds (Vulkan keepalive, Metal offset fix, Hexagon SSM_SCAN support, CUDA SM103 SASS).

---

## 3. New Model & Hardware Support

- **Hexagon: `SSM_SCAN` op support** — unlocks state-space model layers on Snapdragon NPU, including multi-device splitting. [b12373 / #31921](https://github.com/ggml-org/llama.cpp/pull/31921)
- **Hexagon: IQ2_XXS and NVFP4 quantization** — tiled repack layouts, HVX GEMV (n≤4) and HMX paths (n>4), per-tensor NVFP4 scale (PR in merge-ready state). [PR #31954](https://github.com/ggml-org/llama.cpp/pull/31954)
- **CUDA: SM103 SASS added to non-native builds** — forward compatibility for newer Blackwell parts. [b12367 / #30099](https://github.com/ggml-org/llama.cpp/pull/30099)
- **HIP: gfx1013 (AMD BC250) registered as RDNA1.** [PR #32236](https://github.com/ggml-org/llama.cpp/pull/32236)
- **BF16 support in `RMS_NORM`** on CPU and CUDA — relevant for bf16-native checkpoints. [b12366 / #32135](https://github.com/ggml-org/llama.cpp/pull/32135)
- **Vulkan: `TOP_K_MASK` op.** [b12365 / #31544](https://github.com/ggml-org/llama.cpp/pull/31544)
- **Granite 4 Vision conversion registered** (`Granite4VisionForConditionalGeneration`) — fixes `convert_hf_to_gguf.py` failures on newer Granite 4 Vision checkpoints. [PR #32237](https://github.com/ggml-org/llama.cpp/pull/32237)
- Backlog: **`nemotron_h_moe` tensor support** still unimplemented. [Issue #30798](https://github.com/ggml-org/llama.cpp/issues/30798)

---

## 4. Performance & Optimization

- **HIP GCN MMQ configs tuned**; stream_k algorithm tuned for GCN and enabled for specific MMQ configs (benchmarked in the PR). [b12370 / #30021](https://github.com/ggml-org/llama.cpp/pull/30021) · [PR #30022](https://github.com/ggml-org/llama.cpp/pull/30022)
- **HIP: few-row MMQ via WMMA for RDNA3.5** — a new `mul_mat_q_few_wmma` kernel using the RDNA3 16×16×16 int8 WMMA path (CUDA version relies on NVIDIA MMA fragments/`cp.async`, so a separate kernel was required). [PR #32224](https://github.com/ggml-org/llama.cpp/pull/32224)
- **HIP: DPP-based warp sum reduction** (`__builtin_amdgcn_mov_dpp` instead of `ds_permute_*`), avoiding the LDS bridge. [PR #32215](https://github.com/ggml-org/llama.cpp/pull/32215)
- **Vulkan: coopmat2 GATED_DELTA_NET**, with scalar-path row→thread remapping; **~40% average speedup** over the prior path (stacked on #30207). Relevant to Qwen3.5/Kimi-linear style hybrid models. [PR #32111](https://github.com/ggml-org/llama.cpp/pull/32111)
- **Jinja template rendering overhead reduction** — removes accidental builtin-table copies, shrinks `Value` storage, cuts temporary allocations, avoids string copies. Directly affects chat-template-heavy `llama-server` workloads. [PR #32023](https://github.com/ggml-org/llama.cpp/pull/32023)
- **Hexagon buffer/mmap stacking improvements** — combined queue/fence buffers, thread-count-based queue sizing, host-side buffer stacking to avoid IOVA fragmentation. [b12368 / #32144](https://github.com/ggml-org/llama.cpp/pull/32144)
- **OpenCL: optimized Q4_K non-MoE GEMM bin kernel for Adreno X1.** [PR #30948](https://github.com/ggml-org/llama.cpp/pull/30948)
- **cgroup-aware default thread count** for `llama-server` — caps math threads by effective CPU quota instead of host CPU count, preventing oversubscription in containers. [PR #30267](https://github.com/ggml-org/llama.cpp/pull/30267)

---

## 5. Stability & Regressions

Ranked by severity:

1. **Metal: `mul_mv` destination offset 32-bit overflow** → silent unwritten output slices when `im * ne0 * ne1 > INT32_MAX` (large batched outputs). **Fixed** in b12374 by promoting offset math to `uint64_t`. [PR #32221](https://github.com/ggml-org/llama.cpp/pull/32221)
2. **Metal: per-file mmap mapping spans CPU-resident tensors** → a 27 GiB lazy-read table between GPU tensors counted against the GPU working set, causing OOM on Qwen3.8-Flash-Next. Closed/stale. [Issue #29465](https://github.com/ggml-org/llama.cpp/issues/29465)
3. **CUDA: shared-memory data race in `mul_mat_vec_f` warp reduction** — multiple threads per warp writing partial results. Fix PR open. [PR #32235](https://github.com/ggml-org/llama.cpp/pull/32235)
4. **CPU AMX `mul_mat` incorrect batching** (since #19925) — no 2D weight broadcast over batched `src1`, mis-scaled byte offsets → garbage output with ≥2 parallel sequences and SIGSEGV in `tileloadd`. Affects `llama-server -np` on Sapphire Rapids. Closed/stale — **verify on your build**. [Issue #29670](https://github.com/ggml-org/llama.cpp/issues/29670)
5. **`llama-server` tokenizer stack overflow** — `unicode_regex_split_stl` recurses per character for the o200k/GPT-4o pre-tokenizer; ~26k-character unbroken runs crash the process. **Still open.** [Issue #27783](https://github.com/ggml-org/llama.cpp/issues/27783)
6. **glm5-next + `--spec-type draft-dflash` aborts** on first request: `GGML_ASSERT(t_layer_inp[il] != nullptr)` — architecture never sets `t_layer_inp`. **Open.** [Issue #30093](https://github.com/ggml-org/llama.cpp/issues/30093)
7. **Vulkan: all-NaN logits on Radeon 680M**, disappears with integer dot product disabled; present since b10343. **Open.** [Issue #31509](https://github.com/ggml-org/llama.cpp/issues/31509)
8. **Vulkan: GLM-OCR vision encoder garbage output on Intel Arc A380** for full-page images (CPU and SYCL correct). **Open.** [Issue #31836](https://github.com/ggml-org/llama.cpp/issues/31836)
9. **Vulkan: spin-forever in `ggml_vk_wait_for_fence`** when the driver never reports device loss after a GPU fault (RTX 4090, open kernel module). **Open.** [Issue #29926](https://github.com/ggml-org/llama.cpp/issues/29926)
10. **`--split-mode tensor` instability**: dual Intel B70 SYCL memory leak during generation (closed, 28 comments), and a hard machine reboot mid-generation on 2× RTX A6000 (closed). Worth tracking if you use tensor split in production. [Issue #27845](https://github.com/ggml-org/llama.cpp/issues/27845) · [Issue #29549](https://github.com/ggml-org/llama.cpp/issues/29549)
11. **Termux Vulkan builds fail shader optimization** (`Invalid capability operand: 5447`). **Open.** [Issue #28234](https://github.com/ggml-org/llama.cpp/issues/28234)
12. **`/infill` endpoint accepts out-of-range token IDs** that `/completion` rejects — input-validation gap. Closed/stale. [Issue #29458](https://github.com/ggml-org/llama.cpp/issues/29458)
13. **Server sleep race with `--sleep-idle-seconds`** — request arriving during the falling-asleep window strands queued tasks and crashes on model unload. **Fix PR open.** [PR #30012](https://github.com/ggml-org/llama.cpp/pull/30012)
14. **MCP server does not handle non-text tool results.** Closed/stale. [Issue #28783](https://github.com/ggml-org/llama.cpp/issues/28783)
15. **iGPU: CPU-resident layers allocated from the Vulkan host buffer**, consuming device memory. **Open.** [Issue #31538](https://github.com/ggml-org/llama.cpp/issues/31538)

---

## 6. What This Means for Application Developers

- **Treat v1.0.0 as a migration event, not a routine bump.** If you link against llama.cpp directly or use bindings that wrap the public C API, budget for a compatibility pass before adopting. Server/CLI users are largely unaffected by the API removal but should validate speculative-decoding behavior.
- **Speculative decoding needs re-tuning.** The `p_min` change means the cutoff is deliberately not applied to sampled MTP/DFlash2 drafts. If you tuned `--spec-draft-p-min` for acceptance-rate gains, re-benchmark — the flag may now be effectively inert on those draft types.
- **Server-mode is getting operationally serious.** The daemon + Unix-socket control plane (ACL instead of API key) [PR #31489](https://github.com/ggml-org/llama.cpp/pull/31489), cgroup-aware thread defaults [PR #30267](https://github.com/ggml-org/llama.cpp/pull/30267), and the sleep-race fix [PR #30012](https://github.com/ggml-org/llama.cpp/pull/30012) all point toward containerized/Kubernetes deployment. The sleep-idle crash in particular is a real hazard for scale-to-zero setups — track that PR if you use `--sleep-idle-seconds`.
- **Two unresolved crash-class bugs affect common agent workloads:** (a) tokenizer stack overflow on long unbroken token runs — adversarial or code-heavy prompts can kill the server, so add input-length guards at the gateway layer; (b) the `/infill` token-ID validation gap — do not forward untrusted token arrays to that endpoint.
- **Batching on Intel AMX is not fully trustworthy.** The `-np` multi-sequence corruption on Sapphire Rapids is severe if real; validate with your own concurrency tests before relying on AMX variants for parallel serving.
- **AMD is where the performance work is landing.** RDNA3.5 few-row MMQ and GCN MMQ/stream_k tuning are incremental but compounding; if you evaluated ROCm inference a few months ago, it is worth re-measuring.
- **Vulkan remains the least predictable backend.** Fourteen of the notable open issues involve Vulkan across Intel, AMD, NVIDIA and Termux. Prefer CUDA/Metal/HIP for production paths; keep Vulkan for edge and desktop convenience, and pin builds.

</details>

<details>
<summary><strong>Ollama</strong> — <a href="https://github.com/ollama/ollama">ollama/ollama</a></summary>

# Ollama Digest — 2026-11-14

## 1. Today's Highlights

No new releases landed in the past 24 hours, but issue and PR activity points to active hardening across three fronts: **tool-call parsing reliability** (two new correctness bugs affecting Qwen3.5/Qwen3-Coder and cloud Mimo), **VRAM accounting and GPU-splitting fixes**, and **expanded model coverage** via a DeepSeek V4.1 Flash MLX PR. A long-standing AMD 780M Vulkan regression (#17748) was closed today after months of reports, and the cloud/ZDR pricing question (#17489) remains unresolved and open.

---

## 2. Releases & Breaking Changes

None in the last 24h. No released versions, deprecations, or migration notices today.

---

## 3. New Model & Hardware Support

- **[PR #19667] mlx: add DeepSeek V4.1 Flash and host-backed table lifecycle** — Open. Implements the publisher's mixed **MXFP4/MXFP8** checkpoint in MLX, including host-backed engrams, compressed sparse attention, vision, batched decode, and chat/tool rendering. Shares host-backed tensor mapping with Qwen 3.8 Flash Next and accounts for host-resident weights in model admission.
  https://github.com/ollama/ollama/pull/19667

- **[PR #19688] cmake: support compatible binary MLX-C and XGrammar** — Open. Lets packagers supply MLX-C and XGrammar binaries independently of the Ollama build; relevant for downstream distributors (Homebrew, distro maintainers).
  https://github.com/ollama/ollama/pull/19688

- **[Issue #17748] AMD Radeon 780M Vulkan regression (≥0.32.10)** — **Closed** after updates today. Users reported `radv/amdgpu: Not enough memory for command submission` / `ErrorDeviceLost` on larger models under the Vulkan backend, with identical hardware/config working on earlier versions. Worth verifying against your current pinned build if you deploy on RDNA3 iGPUs.
  https://github.com/ollama/ollama/issues/17748

---

## 4. Performance & Optimization

- **[PR #19632] llm/server: Fix VRAM accounting and GPU splitting** — Open. Addresses multiple VRAM accounting defects that caused models to be **incorrectly evicted, refuse to load, or spread across GPUs unnecessarily**. Consolidates fixes for #19463, #18679, #18349, #16599.
  https://github.com/ollama/ollama/pull/19632

- **[PR #13619] Auto-size `num_ctx` to VRAM budget (#12353)** — Open. Automatically sizes the context window to available GPU VRAM, targeting the common failure mode where an over-large `num_ctx` causes VRAM overflow and a costly fallback to CPU inference.
  https://github.com/ollama/ollama/pull/13619

- **[PR #18181] api: clamp `keep_alive` durations that overflow int64** — Open. Prevents a `keep_alive` value large enough to overflow int64 nanoseconds from wrapping negative, which currently causes the scheduler to immediately expire the runner. Low severity, but relevant if you construct `keep_alive` programmatically.
  https://github.com/ollama/ollama/pull/18181

---

## 5. Stability & Regressions

Ranked by severity for agent/application workloads:

1. **[Issue #19694] Qwen3.5 / Qwen3-Coder parsers: tool-call arguments corrupted or calls lost** — **OPEN, new today**, no fix PR yet. Affects `model/parsers/qwen3coder.go` and `model/parsers/qwen35.go` on v0.40.15; `qwenTagRegex` unchanged on `main`. Failure depends on content and stream chunking. **High impact for anyone shipping tool-calling agents on Qwen3.**
   https://github.com/ollama/ollama/issues/19694

2. **[Issue #19672] Cloud: mimo-v2.6-pro — tool-call flooding storm in agentic sessions** — **OPEN**. Single assistant turn emits hundreds of near-identical tool calls, fills the transcript with duplicates, and renders sessions unusable. Reporter flags it as a possible upstream defect and asks which checkpoint is served. Questionable whether an Ollama-side fix is possible; worth escalating to the cloud team.
   https://github.com/ollama/ollama/issues/19672

3. **[Issue #17904] ornith-1.5:35b identifies as Claude** — **CLOSED**. Model claims to be Claude (Anthropic) in response to identity questions. Not fatal, but publishing an undisclosed fine-tune of an Anthropic model as a distinct model is a licensing/compliance problem if you ship it in products.
   https://github.com/ollama/ollama/issues/17904

4. **[Issue #9247] CUDA: unspecified launch failure** — **CLOSED**. Long-standing report of `CUDA error: unspecified launch failure` on GPU inference (workaround: CPU-only mode). Closed today with 4 comments.
   https://github.com/ollama/ollama/issues/9247

5. **[Issue #17489] Cloud "cached input" pricing vs. Zero Data Retention** — **OPEN**. User asks how $0.30/M cached input pricing reconciles with a ZDR promise, citing the Kimi K3 model page. Unanswered; potentially material for anyone relying on the ZDR guarantee when routing sensitive workloads to Ollama Cloud.
   https://github.com/ollama/ollama/issues/17489

6. **[PR #19689] model/parsers: drop whitespace after `` in later chunks** — **OPEN**. DeepSeek3 and olmo3-think parsers only trim post-`` whitespace when the tag and whitespace arrive in the same chunk; in practice `\n\n` arrives separately, so streamed content begins with `"\n\n"`. Cosmetic-to-moderate depending on your output handling.
   https://github.com/ollama/ollama/pull/19689

7. **[PR #19266] server: retry /compact after 413 by dropping images and old items** — **OPEN**. Long Codex sessions containing screenshots can currently fail to compact against Ollama Cloud. Related to #19155.
   https://github.com/ollama/ollama/pull/19266

8. **[PR #19686] api: preserve unmodeled tool schema keywords** — **CLOSED**. Tool JSON Schemas lost keywords (`default`, `minimum`, etc.) because the Go struct only models `type`/`description`. Relevant if you send rich schemas and rely on validation constraints downstream.
   https://github.com/ollama/ollama/pull/19686

---

## 6. What This Means for Application Developers

- **Pin your parser version carefully if you use Qwen3.5 or Qwen3-Coder for tools.** #19694 landed today with no fix PR; tool-call argument corruption under streaming is exactly the kind of silent failure that produces malformed agent actions. Consider short-lived feature flags or response validation until a patch ships.
- **Mimo-v2.6-pro on Cloud is unsafe for multi-turn agents** until #19672 is triaged. Add circuit breakers on repeated tool-call emissions if you route to it.
- **VRAM accounting fixes are landing but not yet merged.** If you run multi-GPU and have suffered from unexplained evictions or unnecessary tensor splits, PR #19632 is the one to watch; consider testing against a fork if it's blocking.
- **`num_ctx` is about to get smarter.** PR #13619 auto-sizing removes a common footgun for users who don't know their GPU's budget. If you manage model loading programmatically, expect semantics to shift.
- **Tool-schema fidelity is improving** (#19686 closed), but until it ships, do not rely on `default`/`minimum`/`maximum` surviving the Ollama layer if you validate downstream.
- **Compliance:** Issues #17904 (Anthropic-derived model) and #17489 (ZDR vs. caching) both warrant a check against your own publishing or data-handling policy before they surface as customer questions.

</details>

<details>
<summary><strong>LiteLLM</strong> — <a href="https://github.com/BerriAI/litellm">BerriAI/litellm</a></summary>

# LiteLLM Digest — 2026-11-14

## 1. Today's Highlights

LiteLLM shipped an LTS patch (v1.108.8) alongside continued `v1.111.0` dev iterations, but the day's developer attention is dominated by the newly Rust-only router core — issue #51396 confirms malformed `fallbacks`/`max_fallbacks` payloads now hard-fail with HTTP 500 instead of degrading gracefully. A separate cluster of Gemini translation bugs (intermittent 503s, snake_case `system_instruction` serialization) is drawing sustained commentary and remains unfixed. MCP gateway auth and cost-accounting correctness continue to generate the highest-volume PR activity.

## 2. Releases & Breaking Changes

- **v1.108.8 (LTS)** — Latest LTS patch; the `lts` image tag now points here. Cosign verification uses key from [commit `e82a3c6`](https://github.com/BerriAI/litellm/commit/e82a3c646908ba0a6ee0beddc4310d7a6cac4065). Pull `ghcr.io/berriai/litellm:lts`.
- **v1.111.0-dev.2 / dev.1** — Ongoing dev line, no notable API surface changes called out.
- **v1.106.10** — Maintenance release, cosign-signed.

⚠️ **Behavioral breaking changes landing (fix PRs merged, not yet released):**
- **Rust router core is now the only core** — requests with non-list `fallbacks`/`context_window_fallbacks`/`content_policy_fallbacks` or non-integer `max_fallbacks` now raise `ValueError` → HTTP 500 instead of being silently coerced. See [#51396](https://github.com/BerriAI/litellm/issues/51396) (closed).
- **Bedrock service tiers** — requests for tiers Bedrock cannot serve will now return 400 rather than silently running at a different tier. [#50516](https://github.com/BerriAI/litellm/pull/50516).
- **Anthropic malformed tool choices** — now return 400 instead of 500 or silent auto-selection. [#46188](https://github.com/BerriAI/litellm/pull/46188).

## 3. New Model & Hardware Support

- **Soniox STT v6** — `stt-async-v6` and `stt-rt-v6` released Nov 3; v5 models deprecate Dec 15, 2026. Cost map PR requested. [#50934](https://github.com/BerriAI/litellm/issues/50934).
- **Ollama text-to-image** — Feature request for first-class `litellm.image_generation(model="ollama/...")` support (currently returns empty `ImageResponse.data`). [#28026](https://github.com/BerriAI/litellm/issues/28026).
- **Vertex Claude versioned IDs** — fix in flight to resolve correct `max_tokens` (e.g., Haiku 4.5 at 64000 vs. the hardcoded 128000 fallback that Vertex rejects). [#40376](https://github.com/BerriAI/litellm/pull/40376).
- **Shared input/output context windows** — feature request to let `model_map` express a single combined context budget (newer Gemini-era models). [#51723](https://github.com/BerriAI/litellm/issues/51723).

## 4. Performance & Optimization

- **Ollama non-default host latency** — `get_runtime_model_info` ignores the request `api_base` and falls back to `localhost:11434`, incurring ~8s of silent connect timeouts per completion on remote Ollama deployments. Open, tagged stale. [#37041](https://github.com/BerriAI/litellm/issues/37041).
- **Parallel first-request race** — burst of parallel requests to a freshly-started proxy worker could fail with internal schema errors during response-object construction. Fix builds chat/text/embedding schemas eagerly. [#51733](https://github.com/BerriAI/litellm/pull/51733).
- **Rust CustomLoggerV2** — callback contract and proxy request-scope binding PR opened; five port PRs stacked behind it. [#51526](https://github.com/BerriAI/litellm/pull/51526).

## 5. Stability & Regressions

Ranked by severity:

1. **LLM translation: OpenAI-like servers force `/responses`** — cannot force `/chat/completions` even with `openai/` prefix; breaks Reflection.AI and any server supporting only chat completions. Closed; verify fix. [#51547](https://github.com/BerriAI/litellm/issues/51547).
2. **Budget-reservation leak with no DB logger** — when `custom_auth_run_common_checks` reserves spend with no `database_url`, the reservation sticks until TTL and the *next* request fails. Fix PR open. [#45907](https://github.com/BerriAI/litellm/pull/45907).
3. **Retried budget reset erases rollover-capped spend** — reset job commits end-user spend per page before the window advance; a later failure re-walks the same users and drops carried spend. Closed. [#50898](https://github.com/BerriAI/litellm/issues/50898).
4. **Gemini intermittent 503 / APIConnectionError** — alternating service-unavailable and server-disconnected errors through the translation layer. Open, highest comment count today. [#50434](https://github.com/BerriAI/litellm/issues/50434).
5. **Gemini custom `api_base` sends `system_instruction` not `systemInstruction`** — snake_case causes duplicate protobuf oneof assignment on some Gemini-compatible proxies. Open, stale. [#37028](https://github.com/BerriAI/litellm/issues/37028).
6. **Bedrock Llama native streaming undercounts prompt tokens** — provider `prompt_token_count` and cumulative `generation_token_count` are dropped; prompt usage logs as zero. Open. [#51456](https://github.com/BerriAI/litellm/issues/51456).
7. **Admin UI session cookie is non-HttpOnly JWT carrying proxy key** — `key` claim holds the caller's real proxy key. Security-relevant; open, stale. [#36997](https://github.com/BerriAI/litellm/issues/36997).
8. **Upstream MCP server URL leaked in public model hub modal** — exposes internal infra URLs to end users. Closed. [#30472](https://github.com/BerriAI/litellm/issues/30472).
9. **`_read_request_body` returns `{}` on parse failure** — large (~1.9MB) embedding batches hit `ProxyModelNotFoundError: model=None`. Closed. [#32114](https://github.com/BerriAI/litellm/issues/32114).
10. **Budget reservation leak (dup of #45907 category)** and **sticky session routing** — router ignores session affinity and re-routes to different endpoints. Open. [#50029](https://github.com/BerriAI/litellm/issues/50029).

Active fix PRs worth tracking: Transcribe pass-through `soundfile` import (#45379, closed), Anthropic Responses adapter preserving `[text, tool_use, text]` ordering (#45478), Generic Guardrail API now writes rewritten `tool_calls` back to client (#50413), and MCP `true_passthrough` returning 401 on expired upstream token (#49261).

## 6. What This Means for Application Developers

- **Pin to LTS (`:lts` / v1.108.8) for production** if you rely on lenient input handling — the Rust router core no longer coerces malformed fallback configs, and Bedrock/Anthropic invalid inputs now 400 instead of degrading.
- **Audit your `fallbacks` config as a list of lists** before upgrading past v1.109 — non-list shapes will hard-fail requests with 500.
- **Gemini users**: expect intermittent 503s and be aware custom `api_base` proxies may reject the `system_instruction` key; consider disabling system messages via that path until #37028 lands.
- **If you run without `database_url`** (SDK-only or stateless proxy), check whether budget reservations are being released — #45907's leak can poison subsequent requests until TTL.
- **Bedrock Claude on Invoke** with computer-use/browser-use tools is currently broken due to placeholder tool naming; fix PR #51756 addresses it — avoid those toolsets on Bedrock until released.
- **MCP gateway operators**: expired upstream OAuth tokens currently surface as opaque failures on `tools/list`; #49261 restores a proper 401 to trigger client re-auth.

</details>

<details>
<summary><strong>Unsloth</strong> — <a href="https://github.com/unslothai/unsloth">unslothai/unsloth</a></summary>

# Unsloth Digest — 2026-11-14

## 1. Today's Highlights

No new releases in the last 24 hours, but PR/issue traffic is heavy and centered on **Unsloth Studio/Desktop** (the new GUI surface). Headline items: an **INT8 attention kernel for diffusion DiTs** spanning NVIDIA sm75–sm120 and AMD gfx1151 (#17718), a fix for the **DeepSeek-V4.1 torch.compile regression** (#17660), and a **Gemma 4 chat training fix** that was incorrectly stripping `<bos>` (#17678, closed). On the bug side, a **mmap regression in 0.1.917-beta** (#17605) and **ROCm 7.14 / MI300X flash-attention backward failures** (#17548) are the most consequential for production users.

## 2. Releases & Breaking Changes

None — no releases published in the reporting window.

**Version-adjacent regression worth flagging:** [Unsloth 0.1.917-beta] ignores an explicit `--load-mode none` and forces mmap, causing excessive RAM/SSD usage ([#17605](https://github.com/unslothai/unsloth/issues/17605)). Reported on Strix Halo (Ryzen AI Max+ 395, 128 GB) with a 97 GiB EXL3 GGUF. If you're pinned to 0.1.916, defer the upgrade until fixed.

## 3. New Model & Hardware Support

- **Diffusion DiT INT8 attention kernel** — in-progress PR covering **MiniMax-H3 / H3-Image, FLUX.3 klein**, and video DiTs; targets **NVIDIA sm75 / sm80 / sm86 / sm89 / sm120** and **AMD gfx1151 (Strix Halo, Linux + Windows)**. Uses a 16-point Hadamard rotation before INT8 Q·Kᵀ ([#17718](https://github.com/unslothai/unsloth/pull/17718)).
- **DeepSeek-V4.1 (community port)** — re-enables `torch.compile` now that `unsloth_zoo` aligns checkpoint recompute behavior ([#17660](https://github.com/unslothai/unsloth/pull/17660), closed).
- **Gemma 4 chat training** — restores the leading `<bos>` token that `format_and_template_dataset` was stripping for all Gemma-name-matched models; the previous behavior was correct for Gemma 1/2/3/3n but wrong for Gemma 4 ([#17678](https://github.com/unslothai/unsloth/pull/17678), closed).
- **AMD NPU (FastFlowLM/Lemonade)** — context sizing now scales to free RAM instead of a flat 8192 tokens, capped at 65536 ([#17511](https://github.com/unslothai/unsloth/pull/17511), closed).
- **Qwen-Image 2.1 edit mode** — Edit toggle now works on shared-library `sd.cpp` builds by scanning `stable-diffusion.{dll,so,dylib}` for the edit marker ([#17720](https://github.com/unslothai/unsloth/pull/17720)).

## 4. Performance & Optimization

- **INT8 attention for diffusion DiTs** ([#17718](https://github.com/unslothai/unsloth/pull/17718)) — the main perf item; enablement for both NVIDIA and Strix Halo (gfx1151) matters because DiT attention is a primary bottleneck at high resolutions / long video contexts.
- **Slot KV persistence across GGUF reloads** ([#17121](https://github.com/unslothai/unsloth/pull/17121), closed) — a Context Length change no longer triggers a full re-prefill; only the paths that previously persisted slot KV (idle unload, media swap, `/unload`) are honored. Directly improves long-chat latency after any reload event.
- **Downstream `pip install` isolation in Studio** ([#17626](https://github.com/unslothai/unsloth/pull/17626), open) — prevents user `pip install` from mutating Studio's own venv; a stability win as much as a perf one (no more accidentally upgraded `huggingface_hub` breaking model loads).
- **Benchmarks page** ([#11808](https://github.com/unslothai/unsloth/pull/11808), open, >3000 LOC) — will sweep speculative decoding (MTP/ngram/DSpark/DFlash), KV cache type, context length, parallel slots, and GPU offload on the *currently loaded* GGUF. Useful once it lands for tuning real deployments.
- **huggingface_hub 1.18+ partial download progress** ([#17715](https://github.com/unslothai/unsloth/pull/17715), open) — count in-flight `.partial` files so multi-GB image/video loads don't appear stalled.

## 5. Stability & Regressions

Ranked by severity:

1. **ROCm 7.14 / MI300X (gfx942): stride assertion in `_scaled_dot_product_flash_attention_backward` requiring MATH fallback** ([#17548](https://github.com/unslothai/unsloth/issues/17548), open). Training-side correctness/perf blocker on AMD MI300X with recent ROCm. No fix PR linked.
2. **`mmap` forced despite `--load-mode none` on 0.1.917-beta** ([#17605](https://github.com/unslothai/unsloth/issues/17605), open). Regression vs 0.1.916; causes elevated RAM and disk churn. No fix PR linked yet.
3. **`config.json` missing after HF upload of a fine-tuned Llama 3 8B** ([#368](https://github.com/unslothai/unsloth/issues/368), closed). Old issue, re-touched 2026-11-13 — worth knowing if you saw the same OSError; the resolution path should be verified in the thread.
4. **GPU idle after engine update; only "Restore installation" recovers inference** ([#17663](https://github.com/unslothai/unsloth/issues/17663), open). v0.1.917-beta, RTX 5090 Laptop. Recovery works but is buried in a UI flow.
5. **Docker: `audio.cpp` update fails with "invalid cross-device link"** ([#17638](https://github.com/unslothai/unsloth/issues/17638), open). Affects the provided Studio docker image (host Ubuntu 26.04).
6. **Studio Transcribe: MOSS-Transcribe-Diarize fails on long audio because `max_tokens` is never sent** ([#17598](https://github.com/unslothai/unsloth/issues/17598), open).
7. **Combined CSV export loses chat boundaries** ([#17655](https://github.com/unslothai/unsloth/issues/17655), open) — round-trip import merges N chats into one.
8. **Web UI file picker hides Markdown exports in Import chats** ([#17651](https://github.com/unslothai/unsloth/issues/17651), open).
9. **Docker image tags do not track the latest release** ([#17470](https://github.com/unslothai/unsloth/issues/17470), closed).
10. **Mobile (Cloudflare) chat updates not reconciled in Desktop embedded WebView** ([#17689](https://github.com/unslothai/unsloth/issues/17689), open) — v0.1.917-beta, RX 9070 XT + ROCm.

## 6. What This Means for Application Developers

- **Pin off 0.1.917-beta if you rely on explicit load modes or Docker.** Two independent regressions (mmap forcing, Docker cross-device link) plus a GPU-idle-after-update bug suggest this beta is not production-ready for edge-GPU deployments.
- **AMD users: treat ROCm 7.14 + MI300X training as unstable until #17548 clears.** The MATH fallback is a correctness-preserving workaround but will tank throughput on flash-attention-heavy training loops. Strix Halo (gfx1151) inference looks healthier — the new INT8 DiT kernel explicitly targets it.
- **If you build on Studio's chat/session layer:** the slot-KV persistence fix (#17121) and the upcoming token-usage limiter (#16500) change long-session and quota behavior. The token limiter returns HTTP 429 after the allowance, with a one-time override — design your retry/backoff paths accordingly if you proxy Studio.
- **If you embed Studio in your own infra:** #17626 matters — until it lands, any `pip install` from Studio's Terminal or Python tool can corrupt the runtime environment. Sandbox or block that path.
- **Diffusion app builders:** once #17718 lands, DiT inference (MiniMax-H3, FLUX.3 klein, video) should see meaningful speedups on both NVIDIA (down to Turing sm75) and Strix Halo. Worth tracking the merge commit before benchmarking.
- **Hub search ergonomics improve:** #17721 adds `owner/model` and `owner/` filtering to Hub search, matching the feature request in #17665 — useful if you're building model-picker UIs mirroring Studio's behavior.

</details>

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*