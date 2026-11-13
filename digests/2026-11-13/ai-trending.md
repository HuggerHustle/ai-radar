# AI Open Source Trends 2026-11-13

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-13 01:46 UTC

---

# AI Open Source Trends Report — 2026-11-13

## 1. Today's Highlights

Today's AI ecosystem is dominated by **agent infrastructure and coding-agent tooling**: the two fastest-rising repos in the trending list are `meta/astryx` (+1,830 stars, an "agent-ready" design system) and `addyosmani/agent-skills` (+816 stars, production engineering skills for coding agents), while `openai/codex-security` (+643) and `GoogleChrome/modern-web-guidance-src` (+739) both target coding agents. A second strong signal is the **token-efficiency and cost-optimization wave** — `headroom` (compression of tool outputs/RAG chunks) and `caveman` (token-cutting proxy) are climbing in the topic search. The **local/self-hosted** theme is also visible: `TensorFold` (Zig inference engine for Metal/CUDA/Vulkan), `ollama`, `llama.cpp`, and `anything-llm`. Meanwhile, RAG tooling is diversifying into "vectorless" and "context database" approaches (`PageIndex`, `OpenViking`), suggesting retrieval is being rethought rather than just scaled up.

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [openai/codex-security](https://github.com/openai/codex-security) | TypeScript | 0 (+643) | OpenAI's Codex Security CLI and TypeScript SDK for finding, validating, and fixing security vulnerabilities. A brand-new official OpenAI repo with 643 stars in one day — a clear signal that security is becoming a first-class layer of the coding-agent stack. |
| [ashhart/TensorFold](https://github.com/ashhart/TensorFold) | Zig | 0 (+54) | An LLM inference engine for Metal, CUDA, and Vulkan. A notable early-stage entrant using Zig for GPU-accelerated inference, reflecting growing interest in cross-platform, low-overhead inference engines. |
| [ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp) | C++ | 0 (+176) | LLM inference in C/C++. The long-running standard for local inference, still gaining 176 stars today — steady, durable momentum as the default local LLM engine. |
| [meta/astryx](https://github.com/meta/astryx) | TypeScript | 0 (+1,830) | An open source design system that's fully customizable and agent-ready. By far the highest star gain today; Meta's "agent-ready" design system is a strong bet that UI and frontend components are being re-architected for AI agents. |
| [GoogleChrome/modern-web-guidance-src](https://github.com/GoogleChrome/modern-web-guidance-src) | TypeScript | 0 (+739) | Keeps your coding agent up to date with the latest web best practices. A Google/Chrome-blessed knowledge feed for coding agents; 739 stars in one day shows demand for "agent context" tools. |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | JavaScript | 0 (+816) | Production-grade engineering skills for AI coding agents. A skills library from a well-known author, trending strongly (+816) — the "skills/context" layer for coding agents is hot. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 302,038 | The agent harness performance optimization system — skills, instincts, memory, security, and research-first development for Claude Code, Codex, Opencode, Cursor, and beyond. A massive star base (302K) and an explicit "harness" focus, positioning itself as a universal agent layer. |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 262,981 | "The agent that grows with you." A highly-starred agent from NousResearch, continuing the trend of self-evolving agents with memory and personalization. |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Python | 111,364 | Gives AI agents "eyes" to read and search Twitter, Reddit, YouTube, GitHub, Bilibili, and XiaoHongShu — one CLI, zero API fees. A very practical "agent access" layer, showing how agents are being connected to real-world social/web data. |
| [paperclipai/paperclip](https://github.com/paperclipai/paperclip) | TypeScript | 113,412 | The open-source app everyone uses to manage agents at work. A management layer for agent workflows, reflecting the shift from "build an agent" to "operate agents." |
| [CopilotKit/OpenBot](https://github.com/CopilotKit/OpenBot) | TypeScript | 0 (+298) | Open-source AI coworkers that each get a computer of their own — browser, files, and tools — with every action decided before it happens and recorded after. A notable trend: "agent with its own computer" + full auditability, trending today. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 82,226 | An open-source AI job search agent that scans boards, scores jobs against your CV, and prepares applications. A vertical agent with strong adoption (82K), demonstrating demand for agentic applications. |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 71,091 | LLM-powered multi-market stock analysis with multi-source data, decision dashboard, and scheduled runs. A vertical agent with 71K stars, another sign of finance/agent verticals. |
| [HKUDS/nanobot](https://github.com/HKUDS/nanobot) | Python | 50,047 | A lightweight open-source personal agent. A minimal, hackable personal agent from a strong research group — a good template for custom agent builds. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm) | JavaScript | 68,227 | A local-first, "own your intelligence" agent/LLM experience. A strong local/self-hosted application with 68K stars, showing continued appetite for privacy-first AI apps. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 76,311 | Turns documents/topics into native PowerPoint decks with charts, animations, and narration. A 76K-star vertical application; AI-native document generation is a strong application trend. |
| [siyuan-note/siyuan](https://github.com/siyuan-note/siyuan) | TypeScript | 47,206 | A privacy-first, self-hosted knowledge workspace where humans and AI agents collaborate. A 47K-star note-taking app with AI-agent collaboration, blending productivity and agents. |
| [QwenLM/qwen-code](https://github.com/QwenLM/qwen-code) | TypeScript | 0 (+151) | An open-source AI coding agent that lives in your terminal. A trending terminal coding agent from Alibaba's Qwen team; a key new entrant in the terminal coding-agent race. |
| [Alishahryar1/free-claude-code](https://github.com/Alishahryar1/free-claude-code) | Python | 0 (+415) | A multi-harness free-token CLI (Claude Code, Codex, etc.) with 1.3B+ free tokens. 415 stars today; a high-interest "cost-avoidance" tooling layer for coding agents. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 142,949 | One-click AI short-video generation from a topic/keyword. A 142K-star automation app; short-video generation remains a major consumer-facing AI use case. |
| [open-webui/open-webui](https://github.com/open-webui/open-webui) | Svelte | 158,507 | A user-friendly AI interface supporting Ollama, OpenAI API, and more. A 158K-star self-hosted AI front-end; the most popular open-source AI chat UI. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 168,929 | The model-definition framework for state-of-the-art ML across text, vision, audio, and multimodal. A 168K-star foundational library; the canonical training/inference stack. |
| [pytorch/pytorch](https://github.com/pytorch/pytorch) | Python | 105,459 | Tensors and dynamic neural networks with GPU acceleration. The default deep-learning framework; still 105K stars. |
| [tensorflow/tensorflow](https://github.com/tensorflow/tensorflow) | C++ | 201,585 | An open-source machine learning framework for everyone. The 201K-star legacy ML framework; still relevant for production and education. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 108,315 | Implements a ChatGPT-like LLM in PyTorch step by step. A 108K-star educational resource; a top entry for LLM learning. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,588 | An LLM evaluation platform across 100+ datasets and many providers. A 7.5K-star evaluation platform; evaluation remains critical for LLM development. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,728 | Learn LLM inference systems on Apple Silicon — build a tiny vLLM + Qwen. A 5.7K-star systems-engineering course; a good signal for LLM infrastructure education. |
| [Picovoice/picollm](https://github.com/Picovoice/picollm) | Python | 319 | On-device LLM inference powered by X-bit quantization. A small but notable repo for on-device LLM inference. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | Python | 149,422 | The agent engineering platform. A 149K-star foundational framework, still central to RAG and agent workflows. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 94,095 | An agent-native database grown from a RAG engine into context infrastructure. A 94K-star RAG/context platform; "context infrastructure" is a notable framing. |
| [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai) | Python | 87,285 | An Apache-2.0 web crawler/extraction API for AI agents. A 87K-star web-data layer for AI; a key dependency for RAG and agent pipelines. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 79,497 | Compresses tool outputs, logs, files, and RAG chunks before they reach the LLM — 20% fewer tokens for coding agents, 60–95% fewer for JSON. A 79K-star token-efficiency layer, directly relevant to agent cost. |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 146,780 | Turns a codebase, docs, SQL schemas, and PDFs into a queryable knowledge graph — local AST parsing, no vector store. A 146K-star "knowledge graph over vector store" approach; a strong signal for vectorless RAG. |
| [milvus-io/milvus](https://github.com/milvus-io/milvus) | Go | 46,650 | A high-performance, cloud-native vector database for scalable ANN search. A 46K-star vector DB; the standard large-scale option. |
| [qdrant/qdrant](https://github.com/qdrant/qdrant) | Rust | 35,528 | A high-performance, massive-scale vector database and search engine. A 35K-star Rust vector DB; a strong production choice. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 40,400 | "PageIndex: Document Index for Vectorless, Reasoning-based RAG." A 40K-star alternative to embedding-based RAG; part of the broader "vectorless RAG" trend. |

## 3. Trend Signal Analysis

**Agent infrastructure is the explosive category.** Today's trending list is dominated by coding-agent tooling: `meta/astryx` (+1,830) is an "agent-ready" design system, `addyosmani/agent-skills` (+816) is a skills library, `GoogleChrome/modern-web-guidance-src` (+739) feeds web best practices to coding agents, and `openai/codex-security` (+643) adds a security layer. The message is clear: the community is moving from *building agents* to *equipping, securing, and optimizing agents* — the "harness" layer.

**New stacks and directions.** Two notable firsts: **Zig** appears as an inference-engine language (`TensorFold`), and **"agent with its own computer"** + full auditability (`OpenBot`) is a fresh pattern. Also notable: **token-efficiency** as a product category (`headroom`, `caveman`), and **vectorless RAG** (`PageIndex`, `Graphify`), suggesting the RAG stack is being rethought rather than just scaled.

**Connection to industry events.** The official OpenAI `codex-security` repo and Google's `modern-web-guidance-src` both indicate that major vendors are now shipping *agent context* products, not just models. The terminal coding-agent race (`QwenLM/qwen-code`, `free-claude-code`) is intensifying as Alibaba's Qwen team enters the space. Local/self-hosted inference (`TensorFold`, `ollama`, `llama.cpp`) remains durable, with the "own your intelligence" framing (`anything-llm`) still attracting users.

## 4. Community Hot Spots

- **`meta/astryx`** — the day's highest star gain (+1,830). "Agent-ready" design systems are a new direction; if UI components are being re-architected for agents, this is a category to watch.
- **`openai/codex-security`** — OpenAI's official security CLI/SDK for coding agents. Security tooling is becoming a first-class layer; worth evaluating early.
- **`headroomlabs-ai/headroom`** — token compression for agent outputs (20–95% token savings). Cost-efficiency is a real pain point; this repo directly addresses it.
- **`VectifyAI/PageIndex`** — "vectorless, reasoning-based RAG" with 40K stars. A meaningful alternative to embedding-based RAG; worth testing for document-heavy workloads.
- **`ashhart/TensorFold`** — Zig-based GPU inference for Metal/CUDA/Vulkan. A new stack (Zig) in a crowded space; early but worth watching for cross-platform local inference.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*