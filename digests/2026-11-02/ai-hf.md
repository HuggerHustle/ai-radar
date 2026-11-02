# Hugging Face Trending Models Weekly 2026-11-02

> Source: [Hugging Face Hub](https://huggingface.co/) | 30 models | Generated: 2026-11-02 00:34 UTC

---

# 🤗 Hugging Face Trending Models Digest — 2026-11-02

## 1. Today's Highlights

This week's leaderboard is dominated by **Qwen's Qwen3.8-27B**, which tops both likes (18,926) and downloads (7.89M) among language models, cementing Alibaba's family as the ecosystem's default open-weight workhorse. **Lightricks/LTX-2.5** is the viral breakout, pulling a stunning 2.43M downloads and 10,220 likes — the highest like count on the entire list — as image-to-video generation goes fully mainstream. **DeepSeek's V4.1-Flash** launch has spawned a substantial quantization cottage industry, with ISTA-DASLab's GGUF build already at 2.29M downloads despite only 534 likes, suggesting heavy silent deployment. Meanwhile, **LiquidAI has flooded the chart with seven LFM3 variants** (text, VL, Omni, Audio, GGUF, d1, plus community derivatives), signaling an aggressive push for efficient, small-footprint multimodal models. Uncensored and comfy-optimized derivatives of Qwen-Image continue to rack up millions of downloads, underscoring persistent demand for customization over safety-tuned defaults.

---

## 2. Trending Models

### 🧠 Language Models (LLMs, chat models, instruction-tuned)

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) | Qwen | 18,926 | 7,892,866 | The flagship Qwen3.8 dense model at 27B parameters, tagged for image-text-to-text and conversational use. It is the single most-liked and most-downloaded model on this list, making it the de facto open-weight default this week. |
| [mistralai/Mistral-Large-4-1T-A52B](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B) | mistralai | 1,451 | 4,576 | A massive 1T-parameter sparse MoE (52B active) with image-text capabilities and first-class vLLM/SGLang support. It represents Europe's largest open-weight frontier push, with likes far outpacing downloads as users study rather than deploy it. |
| [RecursiveSI/flint](https://huggingface.co/RecursiveSI/flint) | RecursiveSI | 1,294 | 26,703 | A conversational text-generation model built on a distinctive "flint" architecture. Its strong like-to-download ratio suggests genuine enthusiast traction rather than bulk automated pulls. |
| [Nanbeige/Nanbeige4.3-33B](https://huggingface.co/Nanbeige/Nanbeige4.3-33B) | Nanbeige | 970 | 15,795 | A 33B Llama-architecture LLM, notable for a strong likes count at a modest download volume. It signals healthy interest in independent Chinese labs outside the Qwen/DeepSeek orbit. |
| [XHToken/Spark-X2.6-4B](https://huggingface.co/XHToken/Spark-X2.6-4B) | XHToken | 947 | 16,707 | A compact 4B text-generation model in the Spark family, aimed at lightweight deployment. Its likes-to-downloads balance reflects appeal as an accessible edge-LLM candidate. |
| [LiquidAI/LFM3-1.7B](https://huggingface.co/LiquidAI/LFM3-1.7B) | LiquidAI | 695 | 37,568 | The base liquid-architecture LFM3 model at 1.7B, the anchor of LiquidAI's sprawling release cluster. It is the reference checkpoint others in the LFM3 family are derived from or quantized against. |
| [nvidia/NVIDIA-Nemotron-3.5-Bolt-E4B-4GB](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-E4B-4GB) | nvidia | 323 | 83,901 | A ~4GB Nemotron-3.5 variant shipped with both transformers and GGUF artifacts for local inference. NVIDIA's Bolt line is gaining traction as a turnkey, memory-constrained deployment option. |
| [Diffuspace/Clover-35B-A3B-Preview](https://huggingface.co/Diffuspace/Clover-35B-A3B-Preview) | Diffuspace | 204 | 2,352 | A preview 35B MoE with only 3B active parameters under the new "clover_moe" architecture. It is an early look at an efficiency-focused entrant with a novel routing design. |
| [facebook/sam3](https://huggingface.co/facebook/sam3) | facebook | 5,629 | 1,891,055 | Meta's third-generation Segment Anything model, now with video segmentation (sam3_video) and mask-generation pipeline. Its 1.89M downloads confirm SAM remains the default segmentation backbone for vision pipelines. |

### 🎨 Multimodal & Generation (image, video, audio, text-to-X)

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [deepseek-ai/DeepSeek-V4.1-Flash-1017](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017) | deepseek-ai | 4,302 | 170,353 | DeepSeek's V4.1 Flash reasoning/vision model with a new deepseek_v41 architecture. It leads the entire list by likes among non-Qwen models and has already seeded a quantization ecosystem. |
| [Lightricks/LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5) | Lightricks | 10,220 | 2,431,846 | A diffusion-single-file video model supporting image-, text-, and video-to-video generation. Its 2.43M downloads and 10,220 likes make it the week's breakout generative-media release. |
| [Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) | Qwen | 18,926 | 7,892,866 | Although listed under LLMs, its image-text-to-text pipeline and conversational tags make it a multimodal powerhouse as well. Its dual role across categories explains its unmatched aggregate numbers. |
| [abenzerps/Qwen-Image-2.1-Uncensored-Quantized](https://huggingface.co/abenzerps/Qwen-Image-2.1-Uncensored-Quantized) | abenzerps | 5,473 | 2,548,468 | An uncensored, GGUF-quantized derivative of Qwen-Image 2.1 tailored for ComfyUI. Its 2.55M downloads show community demand for unfiltered, locally runnable image generation. |
| [black-forest-labs/flux-3-image-klein-comfy](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy) | black-forest-labs | 2,266 | 970,633 | A ComfyUI-optimized FLUX 3 image generation and editing checkpoint. Nearly a million downloads reflect FLUX's continued status as a preferred open image stack. |
| [baidu/Unlimited-OCR-2](https://huggingface.co/baidu/Unlimited-OCR-2) | baidu | 515 | 109,519 | Baidu's second-generation OCR model for image-text extraction at scale. Its 109K downloads indicate strong enterprise-style ingestion use. |
| [Pika-Labs/Pika-H3-Flex](https://huggingface.co/Pika-Labs/Pika-H3-Flex) | Pika-Labs | 310 | 404 | A diffusers-based video generation model with audio-video and LoRA support. The tiny download count against 310 likes suggests it is still in an early buzz phase. |
| [speridlabs/idol](https://huggingface.co/speridlabs/idol) | speridlabs | 299 | 4,194 | An Apache-2.0 image-to-3D model using Gaussian splatting. It is a rare open 3D-generation entry on the chart, appealing to the splatting research community. |
| [LiquidAI/LFM3-Omni-2B](https://huggingface.co/LiquidAI/LFM3-Omni-2B) | LiquidAI | 270 | 8,376 | An any-to-any 2B omni model combining text and image understanding in the liquid family. It extends LFM3's reach into unified multimodal input handling. |
| [Edge0/Audio8-TTS-Realistic-0.6b](https://huggingface.co/Edge0/Audio8-TTS-Realistic-0.6b) | Edge0 | 207 | 4,613 | A small 0.6B text-to-speech model tuned for realistic voice synthesis. Its compact size and 207 likes signal growing interest in lightweight TTS. |
| [LiquidAI/LFM3-VL-2B](https://huggingface.co/LiquidAI/LFM3-VL-2B) | LiquidAI | 200 | 9,121 | A 2B vision-language model in the LFM3 line for image-text-to-text tasks. It is part of LiquidAI's broad multimodal sweep across the leaderboard. |
| [LiquidAI/LFM3-Audio-2B](https://huggingface.co/LiquidAI/LFM3-Audio-2B) | LiquidAI | 176 | 5,688 | An any-to-any audio model supporting automatic-speech-recognition and more. It rounds out LiquidAI's audio cap. |
| [LiquidAI/d1-2B](https://huggingface.co/LiquidAI/d1-2B) | LiquidAI | 156 | 4,256 | A small vision-capable model built on the lfm3_vl stack for feature extraction. It is the lowest-profile of LiquidAI's core releases but part of the same coordinated launch. |
| [Efficient-Large-Model/Open-H3-Regenerate-2K](https://huggingface.co/Efficient-Large-Model/Open-H3-Regenerate-2K) | Efficient-Large-Model | 153 | 0 | A diffusers LoRA for video-to-video refinement targeting the minimax-h3 lineage. Zero downloads but 153 likes marks it as a freshly posted, buzz-only artifact. |

### 🔧 Specialized Models (code, math, medical, embeddings)

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [nvidia/NVIDIA-Nemotron-3.5-Transcribe-30B-A4B](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Transcribe-30B-A4B) | nvidia | 598 | 29,364 | A 30B MoE (4B active) automatic speech recognition model under the nemotron-3.5 speech LM line. Its 598 likes at this launch stage signal strong demand for high-accuracy transcription. |
| [ccore/Qwen3.5-4B-3D-Coder](https://huggingface.co/ccore/Qwen3.5-4B-3D-Coder) | ccore | 478 | 44,825 | A specialized Qwen3.5-4B coder fine-tune targeting Three.js and 3D web code, with GGUF variants included. Its 44K downloads show a niche but real appetite for domain-specific coding assistants. |
| [openbmb/MiniCPM-OCR-1.0](https://huggingface.co/openbmb/MiniCPM-OCR-1.0) | openbmb | 383 | 3,513 | A compact OCR and document-parsing model in the MiniCPM family. It competes directly with Baidu's Unlimited-OCR but at a much smaller footprint. |
| [burner22/numbat](https://huggingface.co/burner22/numbat) | burner22 | 198 | 5,846 | An 8-bit modelopt-optimized checkpoint using custom_code under the "numbat" label. Its custom implementation and low-bit format suggest an experimental efficiency study. |

### 📦 Fine-tunes & Quantizations (community fine-tunes, GGUF, AWQ)

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [ISTA-DASLab/DeepSeek-V4.1-Flash-1017-GSQ-RCO-GGUF](https://huggingface.co/ISTA-DASLab/DeepSeek-V4.1-Flash-1017-GSQ-RCO-GGUF) | ISTA-DASLab | 534 | 2,294,642 | A mixed-precision GGUF quantization of DeepSeek V4.1 Flash using GSQ + RCO techniques. Its 2.29M downloads — dwarfing the likes — reveal massive invisible downstream deployment of the aggressive quant. |
| [AtomicChat/LFM3-1.7B-Uncensored-GGUF](https://huggingface.co/AtomicChat/LFM3-1.7B-Uncensored-GGUF) | AtomicChat | 177 | 46,155 | A community uncensored GGUF build of LFM3-1.7B for llama.cpp. It shows the quantization community attaching itself to LiquidAI's new model within days of release. |
| [LiquidAI/LFM3-1.7B-GGUF](https://huggingface.co/LiquidAI/LFM3-1.7B-GGUF) | LiquidAI | 172 | 150,260 | The official first-party GGUF release of LFM3-1.7B for llama.cpp. At 150K downloads it comfortably outpaces its community uncensored fork, indicating users prefer the sanctioned build. |
| [OliviaRossi/Minimax-h3_Singularity-x-10Eros-Max_PRISM](https://huggingface.co/OliviaRossi/Minimax-h3_Singularity-x-10Eros-Max_PRISM) | OliviaRossi | 179 | 167,612 | A merge of Minimax-h3 (ref2va) with TenStrip's 10Eros-Max under the PRISM label. Its 167K downloads with only 179 likes typify the high-volume, low-visibility merge/quant subculture. |

---

## 3. Ecosystem Signal

Three families dominate momentum this cycle: **Qwen** (Qwen3.8, Qwen-Image derivatives) owns the mainstream open-weight crown, **LiquidAI** is executing an unusually coordinated multi-front launch across text, vision, audio, and omni at compact 1.7–2B scales, and **DeepSeek** is seeding an ecosystem through its V4.1-Flash release. Open-weight releases remain overwhelming: every model here is downloadably open, and even frontier-scale efforts like Mistral-Large-4 (1T params) and NVIDIA's Nemotron-3.5 line ship weights rather than staying API-only. The strongest structural signal is **quantization as a first-class channel** — ISTA-DASLab's GGUF build of DeepSeek V4.1 hit 2.29M downloads, nearly 13× the original's 170K, showing that quantized derivatives frequently reach far more users than the base checkpoints. Community fine-tuning activity clusters around two poles: **uncensored/ComfyUI-optimized image models** (Qwen-Image-Uncensored, +2.5M downloads) and **GGUF conversions** of hot new releases. Merge culture persists quietly (Minimax-h3 merges at 167K downloads with minimal likes), while video generation — LTX-2.5 especially — has crossed into genuine mass adoption. Small models (under 3B) are proliferating rapidly, signaling a shift toward efficient, locally runnable multimodal systems.

---

## 4. Worth Exploring

1. **[LiquidAI/LFM3-1.7B](https://huggingface.co/LiquidAI/LFM3-1.7B) + the LFM3 family** — Worth studying as a *coordinated release strategy*: seven variants spanning text, VL, Omni, Audio, and GGUF shipped together. If you want to understand how a small lab competes on breadth rather than scale, this cluster is the case study.

2. **[Lightricks/LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5)** — With 2.43M downloads and 10,220 likes, it is the week's clearest proof that open video generation has hit mainstream utility. A diffusion-single-file design supporting image-, text-, AND video-to-video in one checkpoint makes it the most practically deployable video model on the list.

3. **[ISTA-DASLab/DeepSeek-V4.1-Flash-1017-GSQ-RCO-GGUF](https://huggingface.co/ISTA-DASLab/DeepSeek-V4.1-Flash-1017-GSQ-RCO-GGUF)** — The 2.29M-download quant of DeepSeek V4.1 Flash is worth examining less for the model than for the *pattern*: mixed-precision GSQ+RCO quantization delivering a frontier model to consumer hardware at 13× the reach of the original. It is a masterclass in how open-weight distribution actually happens.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*