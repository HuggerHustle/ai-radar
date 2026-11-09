# Hugging Face Trending Models Weekly 2026-11-09

> Source: [Hugging Face Hub](https://huggingface.co/) | 30 models | Generated: 2026-11-09 00:44 UTC

---

# Hugging Face Trending Models Digest — 2026-11-09

## Today's Highlights

Qwen continues its dominance with **Qwen3.8-27B** leading all likes (19,413) and downloads (7.67M), while **moonshotai/Kimi-K3.1-Pro** and **mistralai/Mistral-Large-4-1T-A52B** signal a fierce race among flagship frontier models. Video generation is exploding — **Lightricks/LTX-2.5** tops the download chart at 2.66M with 11,132 likes, making it today's single most-liked release. The uncensored/heretic fine-tune ecosystem remains vibrant, with **DavidAU's Qwen3.8-27B TURBO** variant pulling 2.7K likes and 1.55M downloads. Meanwhile, Meta's **facebook/sam3** (6,108 likes) confirms segmentation and mask-generation tooling remains a high-demand utility class.

---

## Trending Models

### 🧠 Language Models

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) | Qwen | 19,413 | 7,668,187 | Alibaba's flagship 27B multimodal conversational model, topping the entire board in both likes and downloads. Its blend of image-text reasoning and efficient size makes it the default open-weight daily driver this week. |
| [moonshotai/Kimi-K3.1-Pro](https://huggingface.co/moonshotai/Kimi-K3.1-Pro) | moonshotai | 1,729 | 25,569 | Moonshot's compressed-tensor flagship aimed at long-context reasoning and agentic workloads. Strong like-to-download ratio suggests heavy developer experimentation despite a fresh drop. |
| [mistralai/Mistral-Large-4-1T-A52B](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B) | mistralai | 1,638 | 11,628 | A million-million-parameter-class MoE (52B active) tuned for vLLM and SGLang serving. Signals Mistral's return to the top tier of open frontier-scale releases. |
| [LiquidAI/LFM3-1.7B](https://huggingface.co/LiquidAI/LFM3-1.7B) | LiquidAI | 1,558 | 73,562 | Liquid's third-gen compact 1.7B model targeting on-device efficiency. Strong download velocity shows continued appetite for tiny, deployable LLMs. |
| [Scantist/GLM-5.3-SLIM-GGUF](https://huggingface.co/Scantist/GLM-5.3-SLIM-GGUF) | Scantist | 1,275 | 4,938 | Zhipu's GLM-5.3 MoE shipped in a SLIM GGUF packaging for llama.cpp users. Demonstrates how Chinese MoE families are increasingly consumed via quantized community builds. |
| [NousResearch/Arete-27B](https://huggingface.co/NousResearch/Arete-27B) | NousResearch | 291 | 1,747 | A supervised fine-tune of the Qwen3.5-27B base focused on reasoning and philosophical alignment. Small but engaged audience typical of NousResearch releases. |
| [webAI-Official/TwIL-8B](https://huggingface.co/webAI-Official/TwIL-8B) | webAI-Official | 232 | 22,737 | An 8B Granite-based text-generation model with GGUF availability. Modest likes but solid downloads indicate quiet production uptake. |
| [baidu/ERNIE-5.5-Flash-Base](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base) | baidu | 230 | 1,400 | Baidu's ERNIE 5.5 MoE base model in open weights. Early low-traffic release, but a notable signal of Baidu's continued open-weight strategy. |

### 🎨 Multimodal & Generation

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [Lightricks/LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5) | Lightricks | 11,132 | 2,661,026 | The week's most-liked model overall — a single-file diffusion video model supporting text/image/video-to-video. Its 2.66M downloads cement LTX as the dominant open video-generation family. |
| [facebook/sam3](https://huggingface.co/facebook/sam3) | facebook | 6,108 | 1,982,669 | Meta's third-generation Segment Anything model with native video support. Nearly 2M downloads in a week underscores SAM's status as essential infrastructure. |
| [abenzerps/Qwen-Image-2.1-Turbo-Quantized](https://huggingface.co/abenzerps/Qwen-Image-2.1-Turbo-Quantized) | abenzerps | 5,726 | 76,804 | A GGUF-quantized build of Qwen-Image 2.1 Turbo for ComfyUI. Strong likes reflect demand for low-VRAM image-gen pipelines. |
| [deepseek-ai/DeepSeek-V4.1-Flash-1017](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017) | deepseek-ai | 5,408 | 295,747 | DeepSeek's latest Flash-tier multimodal model with vision and text reasoning. Fast adoption shows the V4.1 line is now the go-to Chinese frontier multimodal option. |
| [nvidia/NVIDIA-Nemotron-3.5-Transcribe-30B-A4B](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Transcribe-30B-A4B) | nvidia | 3,107 | 67,230 | An MoE speech-recognition model (A4B active) for transcription at scale. A rare ASR entrant on the trending list, filling a critical enterprise need. |
| [black-forest-labs/flux-3-image-klein-comfy](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy) | black-forest-labs | 2,757 | 1,167,959 | BFL's FLUX 3 "Klein" variant packaged for ComfyUI image generation/editing. Over 1.1M downloads confirms FLUX remains the image-gen benchmark. |
| [speridlabs/idol](https://huggingface.co/speridlabs/idol) | speridlabs | 1,380 | 22,854 | A Gaussian-splatting image-to-3D model under Apache-2.0. Top-liked 3D asset generation tool this week — a signal that 3D reconstruction is having a moment. |
| [unsloth/Qwen3.8-Flash-Next-GGUF](https://huggingface.co/unsloth/Qwen3.8-Flash-Next-GGUF) | unsloth | 1,535 | 1,548,621 | Unsloth's GGUF build of Qwen3.8-Flash-Next for multimodal inference. 1.5M downloads in a week shows quantized multimodal is now mainstream. |
| [Pika-Labs/Pika-H3-Flex](https://huggingface.co/Pika-Labs/Pika-H3-Flex) | Pika-Labs | 516 | 1,083 | A diffusers-format audio-video generation model from Pika. Low initial traffic but notable for its joint audio-video generation capability. |
| [PrunaAI/P-H3-Image-Comfy](https://huggingface.co/PrunaAI/P-H3-Image-Comfy) | PrunaAI | 252 | 625,136 | Pruna's ComfyUI text-to-image / image-to-image optimization of a base H3 image model. The 625K downloads are remarkable for a niche-optimized release. |
| [PrunaAI/P-H3-Image](https://huggingface.co/PrunaAI/P-H3-Image) | PrunaAI | 170 | 893 | The diffusers-native counterpart to the Comfy build. Smaller footprint here reflects users preferring the ComfyUI variant. |
| [Viggle/Viggle-Remake](https://huggingface.co/Viggle/Viggle-Remake) | Viggle | 194 | 76,308 | A video-to-video character-replacement / video-editing model built on MiniMax-H3. Positions Viggle's motion-editing pipeline in open weights. |

### 🔧 Specialized Models

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [ccore/Qwen3.5-4B-3D-Coder](https://huggingface.co/ccore/Qwen3.5-4B-3D-Coder) | ccore | 917 | 254,053 | A 4B code model fine-tuned specifically for Three.js / 3D scene generation. 254K downloads in a week betrays a real appetite for 3D-scene coding assistants. |
| [ccore/Qwen3.5-4B-GLB-3D-Coder](https://huggingface.co/ccore/Qwen3.5-4B-GLB-3D-Coder) | ccore | 272 | 33,641 | A sibling 4B model targeting GLB-format 3D outputs. Complements the 3D-Coder series as a specialized asset-generation toolkit. |

### 📦 Fine-tunes & Quantizations

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [DavidAU/Qwen3.8-27B-TURBO-Fable-Cold-Fusion-735-882-Heretic-Uncensored-NEO-CODER-MAX-MTP-GGUF](https://huggingface.co/DavidAU/Qwen3.8-27B-TURBO-Fable-Cold-Fusion-735-882-Heretic-Uncensored-NEO-CODER-MAX-MTP-GGUF) | DavidAU | 2,708 | 1,553,252 | DavidAU's maximalist uncensored fusion of Qwen3.8-27B in GGUF, tuned for coding and MTP. 1.55M downloads confirms the "kitchen sink" naming formula still sells. |
| [xtools-at/DeepSeek-V4-Pro-Qwen3.5-9B-UNCENSORED-heretic](https://huggingface.co/xtools-at/DeepSeek-V4-Pro-Qwen3.5-9B-UNCENSORED-heretic) | xtools-at | 837 | 7,088 | A distilled, uncensored 9B merge mixing DeepSeek-V4-Pro lineage with Qwen3.5. Small footprint makes it a popular local-inference pick for unfiltered use. |
| [FusionCow/Sulphur-3](https://huggingface.co/FusionCow/Sulphur-3) | FusionCow | 418 | 1,003 | A MiniMax-H3 finetune released as a community merge. Niche but engaged audience around MiniMax-based open experiments. |
| [ricursiveAI/Ripple-65B-Preview](https://huggingface.co/ricursiveAI/Ripple-65B-Preview) | ricursiveAI | 401 | 5,087 | A 65B custom-code model under Apache-2.0. Early preview traffic suggests a new lab worth watching. |
| [burner22/numbat](https://huggingface.co/burner22/numbat) | burner22 | 391 | 10,197 | An 8-bit modelopt quantized custom-code release with strong local-inference focus. Reflects continued demand for efficient mid-tier checkpoints. |
| [AtomicChat/DeepSeek-V4.1-Flash-1017-Uncensored-GSQ-RCO-GGUF](https://huggingface.co/AtomicChat/DeepSeek-V4.1-Flash-1017-Uncensored-GSQ-RCO-GGUF) | AtomicChat | 390 | 130,020 | A GGUF uncensored quantization of DeepSeek-V4.1-Flash using GSQ/RCO. 130K downloads shows uncensored DeepSeek variants are consumed at scale. |
| [ISTA-DASLab/DeepSeek-V4.1-Flash-1017-GSQ-RCO-Coder-GGUF](https://huggingface.co/ISTA-DASLab/DeepSeek-V4.1-Flash-1017-GSQ-RCO-Coder-GGUF) | ISTA-DASLab | 206 | 258,719 | A research-lab GGUF quantization of DeepSeek-V4.1-Flash Coder with vision support. High download-to-like ratio indicates it's being used industrially, not just starred. |
| [mradermacher/DeepSeek-V4-Pro-Qwen3.5-9B-UNCENSORED-heretic-i1-GGUF](https://huggingface.co/mradermacher/DeepSeek-V4-Pro-Qwen3.5-9B-UNCENSORED-heretic-i1-GGUF) | mradermacher | 185 | 136,706 | mradermacher's i1-GGUF of the xtools-at heretic 9B. Shows the classic pattern of an uncensored base getting a quantization remix from a top quantizer. |

---

## Ecosystem Signal

The Qwen3.x family is the gravitational center of the open-weight ecosystem this week — it underpins the top model (**Qwen3.8-27B**), multiple fine-tunes, quantizations, and specialized derivatives (3D-Coder, Flash-Next). Chinese labs broadly dominate trending: DeepSeek's V4.1 Flash line spawned at least four quantized/uncensored derivatives in the top 30 alone, and Moonshot, Baidu, and Zhipu (GLM) all appear. On the proprietary-vs-open axis, Mistral's 1T-parameter MoE and Meta's SAM3 show that Western labs are still shipping frontier open weights — but the fine-tune economy is almost entirely Chinese-derived or community-merged. Quantization activity is extremely dense: GGUF builds from Unsloth, mradermacher, and AtomicChat account for a large slice of downloads, and the repeated "GSQ-RCO" prefix hints at a shared new quantization stack gaining adoption. Uncensored/heretic models remain a durable subculture, with DavidAU's maximalist naming style still pulling serious traffic.

---

## Worth Exploring

1. **[Lightricks/LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5)** — With 11K+ likes and 2.6M downloads in a single week, this is the open video-generation model to benchmark against. Its single-file diffusion format and multi-modal input support (text/image/video-to-video) make it both practically useful and a strong study in efficient video diffusion packaging.

2. **[speridlabs/idol](https://huggingface.co/speridlabs/idol)** — An Apache-2.0 image-to-3D Gaussian-splatting model that became the most-liked 3D asset generator this week. Worth studying as an example of where 3D reconstruction is heading and how quickly community interest in 3D tooling is growing.

3. **[ccore/Qwen3.5-4B-3D-Coder](https://huggingface.co/ccore/Qwen3.5-4B-3D-Coder)** — A compact 4B model specialized for Three.js/3D scene code, drawing 254K downloads. A great case study in vertical specialization: small models trained for narrow domains can outshine generalists of their size in production workflows.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*