# AI Open Source Trends 2026-11-07

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-07 00:50 UTC

---

# AI Open Source Trends Report — 2026-11-07

## 1. Today's Highlights

Today's AI open-source scene is dominated by **agent infrastructure and "skills" tooling**. Three skills-related repos (mattpocock/skills, cloudflare/security-audit-skill, google/skills) exploded with 2,070 / 2,548 / 534 new stars respectively, signaling that "agent skills" has become a first-class packaging primitive. NVIDIA's `auto-ontology` (+2,015) brings semantic graph reasoning to LLM/agent pipelines, directly challenging the vector-store orthodoxy. Meanwhile, NousResearch/hermes-agent (⭐261k) and ZhuLinsen's daily_stock_analysis illustrate how vertical agent applications are reaching massive scale. The RAG layer is visibly pivoting away from pure vector search toward knowledge graphs, memory compression, and token-efficiency (Graphify, headroom, claude-mem, caveman).

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [NVIDIA/auto-ontology](https://github.com/NVIDIA/auto-ontology) | Python | 0 (+2,015) | Python framework for building semantic, graph-based reasoning layers over data, enabling deterministic query generation and explainable AI for LLM/agent workflows. Today's #2 trending repo — NVIDIA is staking a claim in structured reasoning infrastructure. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 186,145 | The de-facto local LLM runner supporting Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen and Gemma. Remains the front door for self-hosted inference at massive scale. |
| [Picovoice/picollm](https://github.com/Picovoice/picollm) | Python | 319 | On-device LLM inference powered by X-bit quantization. Notable for pushing inference to the extreme edge without cloud dependency. |
| [FonaTech/Project_Chronos](https://github.com/FonaTech/Project_Chronos) | Python | 207 | Zero-stall MoE inference via lookahead prediction and async DMA prefetching, optimized for SSD I/O with hybrid MLA + sliding window attention. A rare systems-level MoE optimization project. |
| [Mirrowel/LLM-API-Key-Proxy](https://github.com/Mirrowel/LLM-API-Key-Proxy) | Python | 559 | Universal LLM gateway with OpenAI/Anthropic-compatible endpoints, multi-provider translation, and load balancing. Useful glue layer for cost/rate-limit management. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,081 | Modular, scalable LLM application framework in Rust. Growing signal that Rust is becoming a serious LLM app language. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,679 | Learn LLM inference systems on Apple Silicon by building a tiny vLLM + Qwen. Excellent systems-engineering educational resource. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [mattpocock/skills](https://github.com/mattpocock/skills) | Shell | 0 (+2,070) | "Skills for Real Engineers," pulled straight from the author's `.agents` directory. Today's #1 trending repo — evidence that reusable agent skills are becoming a shared community artifact. |
| [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) | JavaScript | 0 (+2,548) | A coding-agent skill for multi-phase security audits with independently verified, machine-readable findings. Today's biggest star gainer — a major vendor shipping agent-native security tooling. |
| [google/skills](https://github.com/google/skills) | Python | 0 (+534) | Agent Skills for Google products and technologies. Google formalizing its agent ecosystem through the "skills" abstraction. |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 261,209 | "The agent that grows with you." The highest-starred agent framework today, signaling NousResearch's continued dominance in open agent tooling. |
| [HKUDS/nanobot](https://github.com/HKUDS/nanobot) | Python | 49,887 | Lightweight open-source personal agent from HKUDS. Strong academic-to-OSS signal in the personal agent space. |
| [codewhale-hq/Codewhale](https://github.com/codewhale-hq/Codewhale) | Rust | 41,156 | Open-source terminal agent in Rust supporting any provider or model. A Rust-native alternative to the Node/Python agent CLIs. |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | 38,548 | Frontend stack for agents and generative UI across React, Angular, Mobile, and Slack; makers of the AG-UI Protocol. The most mature agent-frontend integration layer. |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 298,591 | Agent harness performance optimization system covering skills, instincts, memory, and security for Claude Code, Codex, Cursor and beyond. Topped by raw star count — a meta-layer over all agent CLIs. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 67,649 | LLM-powered multi-market stock analysis system with multi-source data, real-time news, decision dashboards, and zero-cost scheduled runs. A clear example of LLM-driven vertical finance automation. |
| [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | Python | 37,796 | "Your Personal Trading Agent." Another finance-focused agent, reinforcing the trading-agent vertical as a breakout category. |
| [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | Python | 121,021 | Multi-agent LLM financial trading framework. Now a canonical reference for multi-agent finance research and simulation. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 80,728 | Open-source AI job search agent that scans boards, scores jobs against your CV, and tailors resumes/cover letters. Runs locally in Codex/Claude Code. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 74,262 | AI turns documents/topics into native PowerPoint decks with real shapes, animations, charts, and audio narration. High-signal document-to-deck vertical. |
| [HKUDS/DeepTutor](https://github.com/HKUDS/DeepTutor) | Python | 55,935 | Lifelong personalized AI tutoring system. Education is emerging as a strong LLM application vertical. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 140,263 | Generates HD short videos from a topic or keyword via AI workflow automation. Still one of the largest consumer-facing generative media apps. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 168,606 | The model-definition framework for state-of-the-art text, vision, audio, and multimodal models. Still the backbone of open model work. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 107,931 | Implement a ChatGPT-like LLM in PyTorch step by step. Perennial favorite for engineers learning LLM internals. |
| [pytorch/pytorch](https://github.com/pytorch/pytorch) | Python | 105,219 | Tensors and dynamic neural networks with GPU acceleration. The default training substrate. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,569 | LLM evaluation platform covering OpenAI, Anthropic, Gemini, Qwen, GLM, DeepSeek across 100+ datasets. Critical neutral evaluation infrastructure. |
| [datamllab/OpenEBFM](https://github.com/datamllab/OpenEBFM) | Python | 281 | Open-source code for training and scaling energy-based foundation models. An early bet on a non-transformer foundation-model paradigm. |
| [labmlai/annotated_deep_learning_paper_implementations](https://github.com/labmlai/annotated_deep_learning_paper_implementations) | Python | 67,715 | 60+ deep learning paper implementations with side-by-side notes. Best-in-class for turning papers into runnable code. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 143,556 | Turns any codebase (docs, SQL, configs, PDFs) into a queryable knowledge graph via deterministic AST parsing — explicitly "no vector store." A direct challenge to vector-RAG orthodoxy. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 93,697 | Agent-native database that grew from a RAG engine into context infrastructure. One of the highest-starred RAG systems. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 79,025 | Compresses tool outputs, logs, files, and RAG chunks before they reach the LLM — 20% fewer tokens for coding agents, 60-95% for JSON. Token-efficiency infrastructure. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 68,531 | Drop-in memory infrastructure for AI agents with persistent context. Production-ready memory layer. |
| [Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm) | JavaScript | 68,014 | Local-first agent experience for owning your own intelligence. The leading self-hosted "ChatGPT-with-your-docs" stack. |
| [topoteretes/cognee](https://github.com/topoteretes/cognee) | Python | 33,114 | Open-source AI memory platform giving agents persistent long-term memory with small free models. Combines graph + vector memory. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 114,023 | Persistent context across sessions for every agent — captures, compresses, and reinjects context for Claude Code, Codex, Gemini, Copilot and more. Cross-CLI memory portability is a real pain point it addresses. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | 41,706 | Self-evolving context database unifying agent memory, knowledge RAG, and skills. ByteDance's volcengine entering the agent-context race. |

---

## 3. Trend Signal Analysis

The dominant storyline today is the **industrialization of "Agent Skills"**. Three skills repos landed in the top-3 trending slots with a combined ~4,650 new stars in one day — and notably, they come from three distinct sources: an independent engineer (mattpocock), a hyperscaler (cloudflare), and a platform giant (google). That triangulation suggests skills have crossed from ad-hoc prompt folders into a vendor-backed packaging format. A second signal is **token economics as an engineering discipline**: headroom (60-95% JSON compression), caveman (65% token cuts via "caveman speech"), and claude-mem (context compression) all monetize or optimize the same scarce resource — context window budget. Third, the RAG layer is **splitting away from pure vector search**: Graphify explicitly markets "no vector store," NVIDIA's auto-ontology pushes semantic graph reasoning, and cognee/OpenViking fuse graph + memory + RAG. This looks like a direct response to the industry's realization that embedding-only retrieval struggles with multi-hop reasoning and deterministic queries. Finally, Rust continues its quiet march into AI infra (Codewhale, rig, chronos, qdrant, ruff), signaling performance-oriented engineers are moving into the stack. No major new LLM checkpoint appeared today, so community attention has shifted from models to the scaffolding around them — agents, memory, skills, and cost control.

---

## 4. Community Hot Spots

- **[cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill)** (+2,548 today) — The single biggest gainer; watch how a hyperscaler defines a reusable, verifiable agent skill, since that pattern will likely be copied across security, compliance, and SRE.
- **[mattpocock/skills](https://github.com/mattpocock/skills)** (+2,070 today) — A grassroots, engineer-authored skills collection that outperformed most corporate repos; strong evidence that community skill libraries are becoming the new "dotfiles."
- **[NVIDIA/auto-ontology](https://github.com/NVIDIA/auto-ontology)** (+2,015 today) — NVIDIA's bet on deterministic, graph-based reasoning layers for agents; if this matures it competes directly with vector-DB-centric RAG architectures.
- **[Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify)** (⭐143k) — "No vector store" knowledge graphs for codebases; represents the leading edge of the post-vector RAG counter-movement.
- **[headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom)** (⭐79k) — Token compression as a first-class infra layer; with context still priced as the primary cost driver, expect more projects in this space.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*