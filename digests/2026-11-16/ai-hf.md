# Hugging Face Trending Models Weekly 2026-11-16

> Source: [Hugging Face Hub](https://huggingface.co/) | 30 models | Generated: 2026-11-16 00:56 UTC

---

# Hugging Face Trending Models Digest — 2026-11-16

## 1. Today's Highlights

This week's trending list is dominated by the **Qwen3.8-27B** family, which has spawned an entire ecosystem of derivatives: the base model, an official GGUF from unsloth, an abliterated community variant, and heavily-modified "heretic" fine-tunes all appear in the top 30. **MiniMax** is having a breakout moment with three separate entries (H3, H3-Image, and a ComfyUI port), signaling strong momentum in open multimodal generation. Uncensored/"heretic" fine-tunes remain a persistent and highly-liked subculture, with DavidAU and mradermacher continuing to dominate that niche. Meanwhile, established research labs (Meta's SAM3 and DINOv3, pyannote's diarization) show that foundational vision and audio tooling still commands strong engagement alongside the LLM hype.

---

## 2. Trending Models

### 🧠 Language Models (LLMs, chat models, instruction-tuned)

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) | Qwen | 20,123 | 6,547,772 | The flagship Qwen3.8 release, a 27B multimodal conversational model. It tops the list by a wide margin, reflecting Qwen's continued dominance in open-weight LLMs. |
| [Qwen/Qwen3.8-Flash-Next](https://huggingface.co/Qwen/Qwen3.8-Flash-Next) | Qwen | 7,154 | 2,997,819 | A faster, lighter sibling to Qwen3.8-27B tagged with the experimental `qwen4_exp` architecture. Its high likes suggest strong interest in the next-gen Qwen line. |
| [deepseek-ai/DeepSeek-V4.1-Flash-1017](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017) | deepseek-ai | 5,735 | 460,551 | DeepSeek's V4.1 Flash iteration, a multimodal text-generation model. It continues DeepSeek's streak of high-engagement open releases. |
| [moonshotai/Kimi-K3.1-Pro](https://huggingface.co/moonshotai/Kimi-K3.1-Pro) | moonshotai | 2,107 | 46,766 | Moonshot's Kimi K3.1 Pro uses compressed-tensors for efficient inference. It represents the growing trend of compression-aware open releases. |
| [NousResearch/Arete-27B](https://huggingface.co/NousResearch/Arete-27B) | NousResearch | 613 | 7,497 | A supervised fine-tune of Qwen3.5-27B from Nous Research. Lower downloads but solid likes indicate a niche, quality-focused following. |
| [thinkingmachines/Inkling-2-Small](https://huggingface.co/thinkingmachines/Inkling-2-Small) | thinkingmachines | 343 | 7,329 | A small conversational multimodal model from a newer lab. It signals continued interest in efficient small-scale chat models. |
| [Edge0/Edge0-145B-NVFP4](https://huggingface.co/Edge0/Edge0-145B-NVFP4) | Edge0 | 289 | 41,606 | A 145B latent-MoE model quantized to NVFP4 for edge inference. It stands out for pushing large MoE models toward edge deployment. |
| [meituan-longcat/LongCat-2.5](https://huggingface.co/meituan-longcat/LongCat-2.5) | meituan-longcat | 269 | 1,573 | Meituan's LongCat 2.5 multimodal model (tagged `pro_v`). Modest numbers so far but worth watching as a new entrant. |

### 🎨 Multimodal & Generation (image, video, audio, text-to-X)

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [Lightricks/LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5) | Lightricks | 12,061 | 2,754,355 | A diffusion model supporting image-, text-, and video-to-video generation. It's the top video model this week, showing strong open video-gen demand. |
| [MiniMaxAI/MiniMax-H3](https://huggingface.co/MiniMaxAI/MiniMax-H3) | MiniMaxAI | 6,947 | 6,057,372 | MiniMax's flagship image-text-to-video diffusion model. Its massive download count makes it one of the most-used generative models on the list. |
| [black-forest-labs/flux-3-image-klein-comfy](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy) | black-forest-labs | 3,251 | 1,182,267 | A ComfyUI-ready single-file FLUX 3 image editing model. It's trending for its seamless integration into the ComfyUI ecosystem. |
| [speridlabs/idol](https://huggingface.co/speridlabs/idol) | speridlabs | 2,366 | 33,423 | An image-to-3D model using Gaussian splatting, Apache-2.0 licensed. It's a rare 3D-generation entry, highlighting growth in open 3D assets. |
| [MiniMaxAI/MiniMax-H3-Image](https://huggingface.co/MiniMaxAI/MiniMax-H3-Image) | MiniMaxAI | 1,185 | 571,067 | MiniMax's text-to-image and image-to-image diffusion model. It anchors the H3 family's image-generation arm with strong download volume. |
| [Comfy-Org/MiniMax-H3-Image](https://huggingface.co/Comfy-Org/MiniMax-H3-Image) | Comfy-Org | 411 | 1,973,388 | The official ComfyUI single-file port of MiniMax-H3-Image. Its near-2M downloads show how critical ComfyUI packaging is for adoption. |
| [Zyphra/ZONOS3-Mini](https://huggingface.co/Zyphra/ZONOS3-Mini) | Zyphra | 395 | 39,862 | A text-to-speech model available in both safetensors and GGUF. It's notable for bringing TTS into the quantized-weights ecosystem. |
| [higurashi-ai/Haru-4B](https://huggingface.co/higurashi-ai/Haru-4B) | higurashi-ai | 308 | 2,098 | A full-duplex speech-to-speech audio model. It reflects rising interest in real-time conversational audio AI. |
| [adventists-ai/Sophon-Realtime-v1](https://huggingface.co/adventists-ai/Sophon-Realtime-v1) | adventists-ai | 273 | 0 | An any-to-any full-duplex voice agent with paralinguistics support. Zero downloads yet, but it's a fresh and intriguing realtime-speech release. |
| [Abiray/MiniMax-H3-Image-GGUF](https://huggingface.co/Abiray/MiniMax-H3-Image-GGUF) | Abiray | 235 | 127,803 | A GGUF quantization of MiniMax-H3-Image for text-to-image and editing. It demonstrates community demand for quantized diffusion models. |

### 🔧 Specialized Models (code, math, medical, embeddings)

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [facebook/sam3](https://huggingface.co/facebook/sam3) | facebook | 6,657 | 2,011,153 | Meta's Segment Anything Model 3, supporting video mask generation and feature extraction. It's the highest-liked specialized model, cementing SAM's foundational status. |
| [pyannote/speaker-diarization-community-1](https://huggingface.co/pyannote/speaker-diarization-community-1) | pyannote | 4,429 | 4,905,484 | The community edition of pyannote's speaker diarization pipeline. Its ~4.9M downloads make it a de facto standard for audio workflows. |
| [facebook/dinov3-vitl16-pretrain-lvd1689m](https://huggingface.co/facebook/dinov3-vitl16-pretrain-lvd1689m) | facebook | 2,285 | 687,007 | Meta's DINOv3 ViT-L/16 image feature extractor. It remains a go-to backbone for vision tasks requiring strong pretrained features. |
| [Cactus-Compute/mirage](https://huggingface.co/Cactus-Compute/mirage) | Cactus-Compute | 319 | 28,553 | A zero-shot object detection and image-to-text model. It's a compact, task-specific vision tool gaining modest traction. |
| [ConceptCountry/qwen-concept-27b](https://huggingface.co/ConceptCountry/qwen-concept-27b) | ConceptCountry | 267 | 63,964 | A weight-editing experiment on Qwen-27B targeting reasoning via "concept" manipulation. It's a novel research direction worth studying. |

### 📦 Fine-tunes & Quantizations (community fine-tunes, GGUF, AWQ)

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [xtools-at/DeepSeek-V4-Pro-Qwen3.5-9B-UNCENSORED-heretic](https://huggingface.co/xtools-at/DeepSeek-V4-Pro-Qwen3.5-9B-UNCENSORED-heretic) | xtools-at | 7,536 | 27,037 | An uncensored "heretic" merge built on a Qwen3.5 9B base. It tops the fine-tune category by likes, showing strong appetite for unrestricted models. |
| [unsloth/Qwen3.8-27B-GGUF](https://huggingface.co/unsloth/Qwen3.8-27B-GGUF) | unsloth | 5,999 | 6,566,295 | Unsloth's official GGUF quantization of Qwen3.8-27B. Its enormous download count makes it the most-used quantized model this week. |
| [DavidAU/Qwen3.8-27B-TURBO-Fable-Cold-Fusion-735-882-Heretic-Uncensored-NEO-CODER-MAX-MTP-GGUF](https://huggingface.co/DavidAU/Qwen3.8-27B-TURBO-Fable-Cold-Fusion-735-882-Heretic-Uncensored-NEO-CODER-MAX-MTP-GGUF) | DavidAU | 3,168 | 1,708,637 | A maximalist GGUF fine-tune merging heretic, coder, and MTP techniques. It exemplifies the elaborate, kitchen-sink naming culture of the quant community. |
| [huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF](https://huggingface.co/huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF) | huihui-ai | 2,175 | 4,202,683 | An abliterated (refusal-removed) GGUF of Qwen3.8-27B. Its 4.2M downloads show abliteration remains a mainstream community demand. |
| [DavidAU/Qwen3.5-9B-The-Defiant-Fable-Uncensored-Heretic-NEO-IMATRIX-MAX-MTP-GGUF](https://huggingface.co/DavidAU/Qwen3.5-9B-The-Defiant-Fable-Uncensored-Heretic-NEO-IMATRIX-MAX-MTP-GGUF) | DavidAU | 1,791 | 2,139,859 | A smaller Qwen3.5 9B heretic fine-tune with NEO Imatrix and MTP variants. High downloads confirm DavidAU's pull in the uncensored GGUF space. |
| [chatrlabs/Qwen-Image-2.1-Uncensored-Omni-Quantized](https://huggingface.co/chatrlabs/Qwen-Image-2.1-Uncensored-Omni-Quantized) | chatrlabs | 316 | 120,618 | An uncensored, quantized Qwen-Image 2.1 text-to-image model. It merges two trends: image-gen and uncensored community fine-tuning. |
| [mradermacher/gemma-4-31B-it-ARA-heretic-GGUF](https://huggingface.co/mradermacher/gemma-4-31B-it-ARA-heretic-GGUF) | mradermacher | 296 | 149,532 | A decensored/heretic GGUF of Gemma-4-31B-it. It shows the uncensored trend extends beyond Qwen to Google's Gemma line. |

---

## 3. Ecosystem Signal

**Qwen is the undisputed center of gravity this week.** The Qwen3.8-27B base model alone pulled over 6.5M downloads, and its derivatives — unsloth's official GGUF, huihui's abliterated version, and DavidAU's heretic merges — collectively account for millions more. This "one base model, many derivatives" pattern is now the dominant open-weight dynamic.

**MiniMax is the breakout multimodal family**, with H3 (video), H3-Image, and a ComfyUI port all trending simultaneously. The near-2M downloads of Comfy-Org's port underscore a key ecosystem lesson: **ComfyUI packaging is now a first-class distribution channel** for generative models.

**Open-weight releases dominate** — every model here is open, with no proprietary API-only entries. Quantization activity remains intense and is increasingly applied beyond LLMs to diffusion models (MiniMax-H3-Image-GGUF) and TTS (ZONOS3-Mini). Uncensored/abliterated fine-tunes persist as a high-engagement niche, while foundational tools like SAM3 and pyannote show that research-grade vision and audio infrastructure still commands massive download volume.

---

## 4. Worth Exploring

1. **[Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B)** — The week's clear winner by likes and the root of an entire derivative ecosystem. Studying it reveals what makes a base model "fine-tune friendly," and it's the most practical single model to evaluate for multimodal chat.

2. **[MiniMaxAI/MiniMax-H3](https://huggingface.co/MiniMaxAI/MiniMax-H3)** — With 6M+ downloads, this is the most-used open video-generation model on the list. It's essential for anyone tracking open video diffusion, and its ComfyUI port makes it immediately testable.

3. **[facebook/sam3](https://huggingface.co/facebook/sam3)** — A foundational vision model that keeps proving its staying power. Worth studying for its video mask-generation and feature-extraction capabilities, which underpin countless downstream pipelines.

*Digest generated from Hugging Face Hub trending data as of 2026-11-16.*

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*