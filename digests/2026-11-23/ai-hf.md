# Hugging Face Trending Models Weekly 2026-11-23

> Source: [Hugging Face Hub](https://huggingface.co/) | 30 models | Generated: 2026-11-23 01:33 UTC

---

# Hugging Face Trending Models Digest — 2026-11-23

## 1. Today's Highlights

This week's leaderboard is dominated by the **Qwen3.8-27B** family, whose base release (20,889 likes, 6.3M downloads) has spawned a thriving quantization ecosystem led by unsloth's GGUF (7.7M downloads) and a long-tail of community fine-tunes. The **Inkling-2** lineup from thinkingmachines continues to attract attention, with the flagship Mini (~5K likes) and its unsloth GGUF (~806K downloads) showing strong adoption. Video and image generation remain a hot frontier: **Lightricks/LTX-2.5** (~13K likes) and **MiniMax-H3-Image** (~952K downloads) illustrate how rapidly diffusion-based multimodal releases are scaling. Notably, "uncensored" and "heretic" community variants are pulling substantial download volumes, while Apple's research releases (DepthPro2, FastFrames-L) show big-tech continuing to publish open weights. The week also features a broad crop of speech, depth, and segmentation models, underlining that the ecosystem is diversifying well beyond pure LLMs.

## 2. Trending Models

### 🧠 Language Models (LLMs, chat models, instruction-tuned)

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) | Qwen | 20,889 | 6,297,396 | Flagship 27B multimodal conversational LLM and the week's dominant release. Its massive like/download volume has made it the base for a whole ecosystem of quantizations and fine-tunes. |
| [DeepSeek-V4.1-Flash-1017](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017) | deepseek-ai | 5,869 | 515,306 | DeepSeek's latest Flash-tier multimodal text-generation model, positioned for efficient deployment. It keeps DeepSeek competitive in the open-weight frontier race with strong early adoption. |
| [tencent/Hy4-flash](https://huggingface.co/tencent/Hy4-flash) | tencent | 621 | 6,617 | Tencent's Hunyuan V4 Flash text-generation model in the image-text-to-text pipeline. Early traction reflects interest in the Hunyuan line as a domestic alternative. |
| [maxwell-model/Maxwell-V1-Flash](https://huggingface.co/maxwell-model/Maxwell-V1-Flash) | maxwell-model | 360 | 3,317 | A Mixture-of-Experts conversational text-generation model. Represents the emerging wave of smaller labs shipping MoE architectures. |
| [NVIDIA-Nemotron-3.5-Bolt-E4B-4GB](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-E4B-4GB) | nvidia | 728 | 203,420 | NVIDIA's compact 4B "Bolt" Nemotron variant shipped with GGUF support for edge deployment. Strong downloads signal demand for small, efficient enterprise-grade models. |

### 🎨 Multimodal & Generation (image, video, audio, text-to-X)

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [Inkling-2-Mini](https://huggingface.co/thinkingmachines/Inkling-2-Mini) | thinkingmachines | 4,990 | 23,543 | Flagship conversational image-text-to-text model built on the inkling2_loop architecture. High likes with modest downloads suggest strong mindshare and early-stage adoption. |
| [LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5) | Lightricks | 13,078 | 2,993,088 | Versatile diffusion video model supporting image-to-video, text-to-video, and video-to-video. Its ~3M downloads make it one of the week's most-adopted generative video releases. |
| [flux-3-image-klein-comfy](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy) | black-forest-labs | 3,696 | 950,169 | ComfyUI-optimized single-file FLUX 3 image generation/editing model. Bundled ComfyUI support drives rapid adoption among creative workflows. |
| [MiniMax-H3-Image](https://huggingface.co/MiniMaxAI/MiniMax-H3-Image) | MiniMaxAI | 1,740 | 952,024 | Text-to-image and image-to-image diffusion model in the MiniMax-H3 family. Near-million downloads reflect strong uptake for its generative imaging. |
| [sam3](https://huggingface.co/facebook/sam3) | facebook | 7,210 | 1,806,893 | Segment Anything Model 3 with a sam3_video variant for feature extraction and mask generation. One of the week's highest-download research releases, cementing SAM's dominance in segmentation. |
| [sam-3d-body-dinov3](https://huggingface.co/facebook/sam-3d-body-dinov3) | facebook | 1,721 | 18,709 | SAM-based 3D human mesh recovery and pose-estimation model. Extends the SAM family into 3D body understanding with strong interest. |
| [Haru-4B](https://huggingface.co/higurashi-ai/Haru-4B) | higurashi-ai | 894 | 8,608 | Full-duplex speech-to-speech audio model enabling real-time conversational audio. Notable as a compact, open speech-to-speech offering. |
| [voice-isolator](https://huggingface.co/inworld/voice-isolator) | inworld | 636 | 0 | Speech-enhancement and denoising audio-to-audio model for voice isolation. High likes with zero downloads indicate a fresh, just-launched release. |
| [DepthPro2](https://huggingface.co/apple/DepthPro2) | apple | 285 | 0 | Apple's monocular and video metric-depth estimation model. A brand-new release with research significance for depth estimation. |
| [FastFrames-L](https://huggingface.co/apple/FastFrames-L) | apple | 538 | 0 | Text-to-video model fine-tuned from Wan2.1-T2V-14B, accompanied by an arXiv paper. Signals Apple's continued open research in video generation. |
| [LongCat-Video-Avatar-1.6](https://huggingface.co/meituan-longcat/LongCat-Video-Avatar-1.6) | meituan-longcat | 439 | 3,483 | Audio-and-text-to-video avatar generation model shipped in ONNX and diffusers formats. Reflects growth in talking-avatar video synthesis. |
| [Qwen-Image-2.1-Uncensored-Omni-Quantized](https://huggingface.co/chatrlabs/Qwen-Image-2.1-Uncensored-Omni-Quantized) | chatrlabs | 808 | 381,769 | Quantized, uncensored Qwen-Image 2.1 text-to-image model in diffusers/GGUF. Strong downloads highlight demand for unfiltered image generation. |
| [tiny-voca](https://huggingface.co/n4ze3m/tiny-voca) | n4ze3m | 422 | 10,768 | Tiny English text-to-speech model in ONNX and GGUF formats. Its small footprint makes it attractive for on-device speech synthesis. |
| [SenseNova-Loop-9B](https://huggingface.co/sensenova/SenseNova-Loop-9B) | sensenova | 546 | 1,863 | Multimodal text-generation model built on the sensenova_loop architecture. Early traction for SenseTime's open multimodal line. |
| [Inkling-2-Small](https://huggingface.co/thinkingmachines/Inkling-2-Small) | thinkingmachines | 692 | 48,974 | Smaller sibling of Inkling-2-Mini, also conversational image-text-to-text. Offers a lighter entry point into the Inkling-2 family. |
| [RMBG-3.0](https://huggingface.co/briaai/RMBG-3.0) | briaai | 333 | 225 | Background-removal and alpha-matting image-segmentation model. A fresh release continuing BRIA's popular remove-background line. |

### 🔧 Specialized Models (code, math, medical, embeddings)

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [Qwen3.8-27B-pi-adapted](https://huggingface.co/harness-hub/Qwen3.8-27B-pi-adapted) | harness-hub | 992 | 2,831 | PEFT/GRPO adaptation of Qwen3.8-27B using async-GRPO reinforcement learning. Notable as a case study in applying GRPO to a major base model. |

### 📦 Fine-tunes & Quantizations (community fine-tunes, GGUF, AWQ)

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [Qwen3.8-27B-GGUF](https://huggingface.co/unsloth/Qwen3.8-27B-GGUF) | unsloth | 6,311 | 7,683,660 | Official unsloth GGUF quantization of Qwen3.8-27B. Its ~7.7M downloads make it the week's most-downloaded model overall. |
| [Qwen3.8-27B-TURBO-Fable-Cold-Fusion-735-882-Heretic-Uncensored-NEO-CODER-MAX-MTP-GGUF](https://huggingface.co/DavidAU/Qwen3.8-27B-TURBO-Fable-Cold-Fusion-735-882-Heretic-Uncensored-NEO-CODER-MAX-MTP-GGUF) | DavidAU | 3,526 | 1,827,784 | A heavily fine-tuned, uncensored GGUF build of Qwen3.8-27B aimed at coding. Demonstrates how a single base model can spawn massive community derivatives. |
| [Qwen3.5-9B-The-Defiant-Fable-Uncensored-Heretic-NEO-IMATRIX-MAX-MTP-GGUF](https://huggingface.co/DavidAU/Qwen3.5-9B-The-Defiant-Fable-Uncensored-Heretic-NEO-IMATRIX-MAX-MTP-GGUF) | DavidAU | 2,082 | 2,266,182 | Uncensored GGUF fine-tune of Qwen3.5-9B with NEO Imatrix quantization. Over 2M downloads show strong appetite for compact, unfiltered models. |
| [Inkling-2-Mini-GGUF](https://huggingface.co/unsloth/Inkling-2-Mini-GGUF) | unsloth | 885 | 805,993 | unsloth's GGUF (MoE) quantization of Inkling-2-Mini. Downloads far exceed the base model's, showing quantization as the primary adoption path. |
| [Inkling-2-Mini-Uncensored-GGUF](https://huggingface.co/AtomicChat/Inkling-2-Mini-Uncensored-GGUF) | AtomicChat | 493 | 129,693 | Uncensored GGUF/LoRA derivative of Inkling-2-Mini for llama.cpp. Reflects the recurring "uncensored GGUF" pattern across popular base models. |
| [Sulphur-3](https://huggingface.co/SulphurAI/Sulphur-3) | SulphurAI | 790 | 78,931 | A fine-tune of MiniMax-H3 with a custom "other" license. Notable for building on the MiniMax family rather than the more common Qwen base. |
| [DaisyRose-27B](https://huggingface.co/RadixArk/DaisyRose-27B) | RadixArk | 313 | 1,815 | A qwen3_5-based image-text-to-text fine-tune. A smaller community derivative of the Qwen3.8 architecture. |
| [Sentinel7/h3](https://huggingface.co/Sentinel7/h3) | Sentinel7 | 1,169 | 0 | A region-restricted, not-for-all-audiences model with no listed pipeline. High likes but zero downloads suggest a just-published or gated release. |

## 3. Ecosystem Signal

The **Qwen3.8-27B** family is the clear center of gravity this week: the base model, unsloth's GGUF, and two DavidAU derivatives together account for tens of millions of downloads. This reflects a persistent pattern—a strong open flagship model is released, quantization specialists (notably unsloth) drive mass adoption, and community fine-tuners layer "uncensored," "heretic," and coder-focused variants on top. The **Inkling-2** line from thinkingmachines shows a similar but earlier-stage dynamic, with the Mini variant's GGUF far outpacing the base model in downloads. Open-weight releases dominate the leaderboard; proprietary or gated models are largely absent, and even major labs (Apple, Meta, NVIDIA) are publishing open research weights. Quantization activity remains the single biggest adoption lever, with GGUF versions routinely out-downloading their source models. Meanwhile, multimodal generation—video (LTX-2.5), image (FLUX 3, MiniMax-H3), and speech (Haru-4B, tiny-voca)—is diversifying the ecosystem beyond text LLMs.

## 4. Worth Exploring

1. **[Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B)** — The week's defining release and the foundation of nearly half the leaderboard. Studying it (and its ecosystem of derivatives) is the single best way to understand current open-model dynamics, from base capability to quantization and fine-tuning patterns.

2. **[unsloth/Qwen3.8-27B-GGUF](https://huggingface.co/unsloth/Qwen3.8-27B-GGUF)** — The most-downloaded model of the week (~7.7M downloads) and the practical entry point for anyone actually running Qwen3.8-27B. A useful case study in how quantization specialists capture adoption.

3. **[Lightricks/LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5)** — The standout generative video model at ~13K likes and ~3M downloads, supporting text-, image-, and video-to-video. A strong reference point for the rapidly maturing open video-generation space.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*