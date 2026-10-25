# Hugging Face Trending Models Weekly 2026-10-26

> Source: [Hugging Face Hub](https://huggingface.co/) | 30 models | Generated: 2026-10-25 23:09 UTC

---

# Hugging Face Trending Models Digest — 2026-10-26

## 1. Today's Highlights

This week's leaderboard is dominated by multimodal and video generation, with **Lightricks/LTX-2.5** (9,331 likes, 2.1M downloads) leading in engagement and **Qwen/Qwen3.8-27B** (18,391 likes, 7.8M downloads) leading in raw reach. DeepSeek's **V4.1-Flash-1017** has spawned a full ecosystem of derivatives within days of release — quantized (ISTA-DASLab GSQ-RCO), abliterated/uncensored variants (dealignai, orcarouter), and distilled fine-tunes — signaling extremely fast community uptake. The ComfyUI ecosystem continues to act as a distribution channel: **Comfy-Org/MOSS-Image** (2.2M downloads) and **flux-3-image-klein-comfy** (660K downloads) show packaging-for-ComfyUI is now as important as the base model itself. Meanwhile, uncensored and "heretic" fine-tunes (abenzerps, DavidAU) pull millions of downloads, underlining persistent organic demand for unconstrained variants. Notably, timestamped releases (V4.1-Flash-**1017**, qwen3.5 tag on a "3.8" model) suggest rapid iterative versioning cycles.

## 2. Trending Models

### 🧠 Language Models (LLMs, chat models, instruction-tuned)

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [RecursiveSI/flint](https://huggingface.co/RecursiveSI/flint) | RecursiveSI | 854 | 6,444 | A conversational text-generation model with a distinctive recursive-design branding. It's trending as both a base model and the source of downstream GGUF quantizations. |
| [XHToken/Spark-X2.6-4B](https://huggingface.co/XHToken/Spark-X2.6-4B) | XHToken | 494 | 3,488 | A compact 4B-parameter LLM in the Spark family, aimed at efficient local inference. Its small size combined with solid engagement makes it a notable lightweight contender. |
| [Nanbeige/Nanbeige4.3-33B](https://huggingface.co/Nanbeige/Nanbeige4.3-33B) | Nanbeige | 349 | 0 | A 33B LLaMA-architecture text-generation model from Nanbeige. Despite zero recorded downloads, it is trending on likes, suggesting strong pre-release interest. |
| [MiniMaxAI/MiniMax-M3.1-Flash](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash) | MiniMaxAI | 350 | 7,355 | A multimodal image-text-to-text "Flash" model from MiniMax. Its listing under MiniMax's flagship line points to continued competition in fast multimodal LLMs. |
| [Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) | Qwen | 18,391 | 7,762,014 | The week's most-liked model overall: a 27B conversational multimodal LLM. With nearly 7.8M downloads, it is the dominant general-purpose release this cycle. |
| [Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) *(variant)* | Qwen | 18,391 | 7,762,014 | *(See above — listed once.)* |
| [InternScience/Sage-A1.5](https://huggingface.co/InternScience/Sage-A1.5) | InternScience | 290 | 3,875 | A Qwen3.5-MoE-based multimodal text-generation model with sparse expert routing. It reflects the rising popularity of MoE architectures for efficient scaling. |
| [KRAFTON/Raon-1-mini-preview](https://huggingface.co/KRAFTON/Raon-1-mini-preview) | KRAFTON | 186 | 1,177 | A preview mini model from game studio KRAFTON's Raon line. Its presence highlights non-traditional labs entering the LLM space. |
| [HuggingFaceBio/Carbon-X](https://huggingface.co/HuggingFaceBio/Carbon-X) | HuggingFaceBio | 179 | 807 | A Qwen3-based DNA/text-generation model for biological sequence work. It's a niche but notable sign of domain-specific foundation models emerging from Hugging Face's own bio initiative. |
| [ornith-ai/Ornith-1.5-122B](https://huggingface.co/ornith-ai/Ornith-1.5-122B) | ornith-ai | 177 | 48,477 | A large 122B Qwen3.5-MoE multimodal text-generation model. Its size and architecture place it among the more ambitious open releases this week. |

### 🎨 Multimodal & Generation (image, video, audio, text-to-X)

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [deepseek-ai/DeepSeek-V4.1-Flash-1017](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017) | deepseek-ai | 2,975 | 85,275 | DeepSeek's flagship V4.1 Flash multimodal image-text-to-text model. It is the seed of a vast derivative ecosystem and a top-3 trending release. |
| [black-forest-labs/flux-3-image-klein-comfy](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy) | black-forest-labs | 1,600 | 660,874 | A ComfyUI-packaged Flux 3 image-to-image diffusion model. Its 660K downloads show the power of the ComfyUI distribution channel for image editing. |
| [Lightricks/LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5) | Lightricks | 9,331 | 2,107,108 | A versatile image-to-video / text-to-video / video-to-video diffusion model. With over 2.1M downloads and 9.3K likes, it is the standout video-generation release of the week. |
| [OpenMOSS-Team/MOSS-Image-SFT](https://huggingface.co/OpenMOSS-Team/MOSS-Image-SFT) | OpenMOSS-Team | 726 | 10,757 | An SFT-tuned text-to-image diffusers model in the MOSS-Image family. It's trending as a fine-tuned companion to the MOSS-Image base. |
| [abenzerps/Qwen-Image-2.1-Uncensored-Quantized](https://huggingface.co/abenzerps/Qwen-Image-2.1-Uncensored-Quantized) | abenzerps | 5,038 | 2,235,846 | A GGUF-quantized, uncensored Qwen-Image 2.1 text-to-image model for ComfyUI. Its 2.2M downloads make it one of the highest-traffic community image models this week. |
| [fishaudio/drama-3](https://huggingface.co/fishaudio/drama-3) | fishaudio | 1,010 | 21,375 | A multi-speaker text-to-speech model in the Fish-Omni family. It represents the audio-generation niche within an otherwise vision-heavy board. |
| [lodestones/Kromoss](https://huggingface.co/lodestones/Kromoss) | lodestones | 259 | 23,972 | A diffusers text-to-image model derived from the MOSS-Image base. It's a community re-packaging of a trending base architecture. |
| [OpenMOSS-Team/MOSS-Image-Base](https://huggingface.co/OpenMOSS-Team/MOSS-Image-Base) | OpenMOSS-Team | 554 | 7,641 | The base text-to-image diffusion model underpinning several trending derivatives. It's trending both directly and as an upstream dependency. |
| [Comfy-Org/MOSS-Image](https://huggingface.co/Comfy-Org/MOSS-Image) | Comfy-Org | 450 | 2,161,961 | A ComfyUI single-file packaging of the MOSS-Image base (Apache-2.0). Its 2.2M downloads demonstrate how ComfyUI re-hostings can massively amplify a base model's reach. |
| [datalab-to/indra-ocr](https://huggingface.co/datalab-to/indra-ocr) | datalab-to | 425 | 4,636 | An ONNX-format image-to-text OCR model optimized for CPU inference. It's a practical, deployment-focused release rather than a generative showpiece. |
| [orcarouter/OrcaCyber-Nano-1.0](https://huggingface.co/orcarouter/OrcaCyber-Nano-1.0) | orcarouter | 254 | 30,330 | A GGUF vision-language model specialized for cybersecurity and reverse engineering. It's a rare example of a domain-specialized multimodal local model. |
| [facebook/sam3](https://huggingface.co/facebook/sam3) | facebook | 5,106 | 1,849,059 | Meta's Segment Anything 3 model for mask generation and video segmentation. With 5.1K likes and 1.8M downloads, it remains a dominant vision foundation model. |
| [jialinyyzz/humanizer](https://huggingface.co/jialinyyzz/humanizer) | jialinyyzz | 2,154 | 143,152 | A Gemma4-unified "humanizer" model with image-text-to-text support. Its 2.1K likes suggest strong interest in text naturalization / authorship-style tasks. |
| [Comfy-Org/Fibo-2.0](https://huggingface.co/Comfy-Org/Fibo-2.0) | Comfy-Org | 178 | 124,557 | A ComfyUI packaging of briaai's Fibo-2.0-dev (citation arXiv:2511.06876). It's a newer image model gaining traction via community packaging. |

### 🔧 Specialized Models (code, math, medical, embeddings)

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [mistralai/Timestral-209M](https://huggingface.co/mistralai/Timestral-209M) | mistralai | 366 | 9,765 | A 209M-parameter time-series-forecasting foundation model from Mistral AI. It marks a notable expansion of a major LLM lab into non-text modalities. |
| [google/embeddinggemma-2](https://huggingface.co/google/embeddinggemma-2) | google | 2,921 | 212,769 | Google's EmbeddingGemma 2 feature-extraction model for text embeddings. With nearly 3K likes, it's trending as a leading open embedding option. |

### 📦 Fine-tunes & Quantizations (community fine-tunes, GGUF, AWQ)

| Model | Author | Likes | Downloads | Summary |
| :--- | :--- | ---: | ---: | :--- |
| [ISTA-DASLab/DeepSeek-V4.1-Flash-1017-GSQ-RCO-GGUF](https://huggingface.co/ISTA-DASLab/DeepSeek-V4.1-Flash-1017-GSQ-RCO-GGUF) | ISTA-DASLab | 278 | 412,392 | A mixed-precision GGUF quantization (GSQ/RCO) of DeepSeek V4.1 Flash. Its 412K downloads show heavy demand for compressed access to a flagship model. |
| [dealignai/DeepSeek-V4.1-Flash-1017-UNCENSORED-FP8](https://huggingface.co/dealignai/DeepSeek-V4.1-Flash-1017-UNCENSORED-FP8) | dealignai | 364 | 6,792 | An FP8-uncensored repackaging of DeepSeek V4.1 Flash. It typifies the fast "aligned-removal" follow-ons to major releases. |
| [unsloth/flint-GGUF](https://huggingface.co/unsloth/flint-GGUF) | unsloth | 248 | 103,369 | Unsloth's GGUF quantization of RecursiveSI/flint. Over 103K downloads — more than the base model itself — illustrate how quantization often widens reach substantially. |
| [DavidAU/Qwen3.8-27B-TURBO-Fable-Cold-Fusion-735-882-Heretic-Uncensored-NEO-CODER-MAX-MTP-GGUF](https://huggingface.co/DavidAU/Qwen3.8-27B-TURBO-Fable-Cold-Fusion-735-882-Heretic-Uncensored-NEO-CODER-MAX-MTP-GGUF) | DavidAU | 2,090 | 1,671,015 | A heavily-fine-tuned, uncensored "heretic" GGUF of Qwen3.8-27B. With 1.67M downloads, it's one of the most-trafficked community quantizations this cycle. |
| [orcarouter/DeepSeek-V4.1-Flash-1017-abliterated-GGUF](https://huggingface.co/orcarouter/DeepSeek-V4.1-Flash-1017-abliterated-GGUF) | orcarouter | 215 | 7,293 | An abliterated GGUF version of DeepSeek V4.1 Flash for llama.cpp/local use. It's part of a cluster of abliterated V4.1 derivatives appearing within days of the base release. |

## 3. Ecosystem Signal

**Model families gaining momentum.** Qwen's Qwen3.8-27B is clearly the anchor release this cycle, spawning dozens of derivatives (DavidAU, ornith-ai, MiniMax's adjacent M-series). DeepSeek's V4.1-Flash-1017 is the other gravitational center: within days it has quantizations (ISTA-DASLab), abliterated/uncensored variants (dealignai, orcarouter), and full fine-tune ecosystems around it, all before most users have even run the base model. Lightricks' LTX-2.5 and Meta's SAM3 show that video and vision foundation models remain high-value, high-download assets.

**Open-weight vs proprietary.** The board is overwhelmingly open-weight — even the most liked entries (Qwen, DeepSeek, LTX, SAM3) are fully downloadable, and the most-downloaded items are community re-hostings. This suggests the open ecosystem now closes the gap on proprietary releases within a single news cycle.

**Quantization & fine-tuning activity.** GGUF quantizations of top models routinely out-download their bases (unsloth/flint-GGUF ≥ RecursiveSI/flint; DavidAU's Qwen3.8 GGUF at 1.67M), and ComfyUI-packaged diffusions (MOSS-Image at 2.2M) dwarf their upstream bases. The "uncensored / abliterated / heretic" niche remains a structurally large, persistent demand segment rather than an edge case.

## 4. Worth Exploring

1. **[Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B)** — The week's most-liked, most-downloaded generalist (18,391 likes / 7.76M downloads). A 27B multimodal conversational model is a strong default to study for anyone benchmarking modern open LLM quality, and it's the base for many of the board's fine-tunes.

2. **[Lightricks/LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5)** — The top video model this cycle (9,331 likes / 2.1M downloads) supporting image-to-video, text-to-video, and video-to-video in one diffusion release. Worth investigating for anyone tracking the fast-moving open video-generation frontier.

3. **[unsloth/flint-GGUF](https://huggingface.co/unsloth/flint-GGUF)** — A clean case study in quantization leverage: a small conversational model whose GGUF (103K downloads) massively out-performs the base (6.4K). Useful for understanding how local-first distribution reshapes which models actually get used in practice.

---

*Note: One model in the input list — [MiniMaxAI/MiniMax-M3.1-Flash](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash) — appears under LLMs because its pipeline is image-text-to-text but its family is a text/multimodal chat line; it could also reasonably sit under Multimodal. All links and download/like figures are preserved verbatim from the source list.*

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*