# AI Open Source Trends 2026-11-05

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-05 01:25 UTC

---

# AI Open Source Trends Report — 2026-11-05

---

## 1. Today's Highlights

Today's GitHub landscape is dominated by **agent memory and context infrastructure**: `claude-mem` (+1,172 today, 112,877 total) and NVIDIA's `auto-ontology` (+2,050 today) both attack the "context decay" problem, signaling that persistent agent memory has become a first-class concern rather than an afterthought. **Computer-use and desktop agents** are also surging — Vercel Labs' `agent-desktop` (+2,470 today) is today's single largest gainer, suggesting the CLI-for-agent-desktops niche is heating up fast. On the model side, `kimi-k3-in-c` (+351 today) demonstrates a 2.78T-parameter model running inference on a single CPU in 8.24 GB RAM, a striking data point for edge/decentralized inference. Meanwhile, the RAG/vector-db ecosystem continues its shift toward **reasoning-based, vectorless retrieval** (PageIndex, Graphify, LEANN), challenging the assumption that embeddings are always necessary.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [vercel-labs/agent-desktop](https://github.com/vercel-labs/agent-desktop) | Rust | 0 (+2,470) | A "computer use" CLI purpose-built for AI agents, letting them drive a desktop environment directly. Today's top gainer by a wide margin — Vercel Labs entering the computer-use space is a strong signal of platform-level commitment. |
| [max-sixty/worktrunk](https://github.com/max-sixty/worktrunk) | Rust | 0 (+531) | A Git worktree management CLI explicitly designed for parallel AI agent workflows. Solves the very real problem of agents stepping on each other in the same checkout. |
| [FareedKhan-dev/kimi-k3-in-c](https://github.com/FareedKhan-dev/kimi-k3-in-c) | C | 0 (+351) | Portable C99 implementation running a 2.78-trillion-parameter Kimi K3 on a single CPU in 8.24 GB RAM — no BLAS, no framework, no GPU. A landmark demo for extreme-quantization and CPU-only inference. |
| [Picovoice/picollm](https://github.com/Picovoice/picollm) | Python | 318 | On-device LLM inference powered by X-bit quantization. Complements the edge-inference narrative alongside kimi-k3-in-c. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,065 | Modular, scalable LLM application framework in Rust. Growing Rust-native alternative to Python-first stacks. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,554 | Educational build-your-own-vLLM + Qwen inference system for Apple Silicon. Strong learning resource as systems engineers enter LLM infra. |
| [Mirrowel/LLM-API-Key-Proxy](https://github.com/Mirrowel/LLM-API-Key-Proxy) | Python | 559 | Universal LLM gateway with OpenAI/Anthropic-compatible endpoints and multi-provider load-balancing. Utility layer for provider-agnostic apps. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 297,268 | "Agent harness performance optimization system" providing skills, memory, security, and research-first development for Claude Code, Codex, Cursor, and beyond. The largest-starred agent harness in today's data. |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 260,572 | An agent framework described as "the agent that grows with you." Nous Research's continued push into open agent tooling. |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Python | 108,830 | Gives agents read/search access to Twitter, Reddit, YouTube, GitHub, Bilibili, XiaohongShu via one CLI with zero API fees. Data-access layer for agents at scale. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 80,212 | Open-source AI job-search agent that scans boards, scores jobs 1–5 against your CV, tailors resumes, and preps interviews. Vertical agent with a clear, high-value use case. |
| [HKUDS/nanobot](https://github.com/HKUDS/nanobot) | Python | 49,827 | Lightweight open-source personal agent from HKUDS. Notable for how small the footprint is while still supporting tool use. |
| [zhayujie/CowAgent](https://github.com/zhayujie/CowAgent) | Python | 47,789 | Personal AI assistant and agent harness with planning, tool/skill execution, and self-evolving memory. One-line install, multi-channel. |
| [codewhale-hq/Codewhale](https://github.com/codewhale-hq/Codewhale) | Rust | 41,157 | Open-source terminal coding agent in Rust, provider/model agnostic. Rust-native agents are becoming a recurring pattern. |
| [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) | TypeScript | 37,823 | Coding agent with the IDE wired in, by Stencil Labs. Represents the "agent-in-the-editor" consolidation trend. |
| [mattpocock/skills](https://github.com/mattpocock/skills) | Shell | 0 (+1,379) | Curated agent Skills pulled straight from a real `.agents` directory. Part of the emerging "agent skills" packaging convention. |
| [garrytan/gstack](https://github.com/garrytan/gstack) | TypeScript | 0 (+290) | Garry Tan's opinionated Claude Code setup: 23 tools acting as CEO, Designer, EM, Release Manager, Doc Engineer, QA. High-profile influencer contribution to agent workflow norms. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) | TypeScript | 198,671 | Web data layer for AI agents — crawling, extraction, and search. Continues to be the de facto ingestion pipe for agentic apps. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 138,987 (+617) | One-click HD short-video generation from a topic/keyword using LLMs and automated workflows. Persistent popularity for consumer-facing generative video. |
| [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | Python | 120,645 | Multi-agent LLM framework for financial trading. Combines two of today's hottest verticals — agents and finance. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 73,518 | Turns documents/topics into native PowerPoint decks with real shapes, transitions, charts, and narration. Vertical agent for office workflows. |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 67,567 | LLM-driven multi-market stock analysis with news, dashboards, and scheduled cost-free runs. |
| [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | Python | 37,659 | Personal trading agent from HKUDS. Another signal that finance is a top vertical for agent deployment. |
| [siyuan-note/siyuan](https://github.com/siyuan-note/siyuan) | TypeScript | 47,087 | Privacy-first, self-hosted knowledge workspace where humans and agents collaborate. Interesting fusion of PKM and agent workspace. |
| [agentscope-ai/QwenPaw](https://github.com/agentscope-ai/QwenPaw) | TypeScript | 37,358 | Personal AI assistant supporting multiple chat apps, self-hosted or cloud. AgentScope's consumer-facing entry. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 168,551 | The model-definition framework for state-of-the-art ML across text, vision, audio, and multimodal. Still the canonical reference. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 185,938 | Local model runner now explicitly listing Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, Gemma. Local-inference default for developers. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 107,826 | Step-by-step ChatGPT-like LLM implementation in PyTorch. Most-cited educational LLM resource. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,564 | LLM evaluation across 100+ datasets and all major model providers. Critical infrastructure as model count explodes. |
| [datamllab/OpenEBFM](https://github.com/datamllab/OpenEBFM) | Python | 260 | Open-source code for training and scaling energy-based foundation models. An uncommon architecture direction worth tracking. |
| [RiccardoBiosas/awesome-MLSecOps](https://github.com/RiccardoBiosas/awesome-MLSecOps) | Astro | 487 | Curated MLSecOps list covering adversarial defense, LLM security, AI red teaming, and supply-chain protection. Timely given agent deployment scale. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 112,877 (+1,172) | Persistent cross-session context for every major agent (Claude Code, Codex, Gemini, Copilot, OpenCode, and more). Compresses session activity with AI and reinjects relevant context. Today's clearest signal that memory is now table stakes. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 93,507 | Rebranded as "agent-native database" — RAG engine evolved into context infrastructure. Reflects the RAG→context-infra convergence. |
| [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai) | Python | 86,911 | Apache-2.0 crawler plus a hosted Cloud API for AI-agent web scraping/extraction/search. Dual open-core + hosted model. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 78,863 | Compresses tool outputs, logs, files, and RAG chunks before they hit the LLM. 20% fewer tokens for coding agents, 60–95% for JSON. Directly attacks the token-cost pain point. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 68,415 | The drop-in memory layer for AI agents. Now a production standard for persistent context. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | 41,548 | Self-evolving context database unifying agent memory, knowledge RAG, and skills. Volcengine entering the context-infra fray. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 39,988 | "Vectorless, reasoning-based RAG" document index. Notably anti-embedding — worth watching as a contrarian bet. |
| [StarTrail-org/LEANN](https://github.com/StarTrail-org/LEANN) | Python | 13,771 | MLSys 2026 Best Paper implementation: 97% storage savings for private on-device RAG. Strong efficiency narrative. |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 142,461 | Turns any codebase + docs + SQL schemas + PDFs into a queryable knowledge graph via local deterministic AST parsing — no vector store. Graph-over-vector is a rising alternative. |
| [qdrant/qdrant](https://github.com/qdrant/qdrant) | Rust | 35,429 | High-performance, massive-scale vector database. Still the leading Rust vector store. |
| [NVIDIA/auto-ontology](https://github.com/NVIDIA/auto-ontology) | Python | 0 (+2,050) | Builds semantic, graph-based reasoning layers over data for deterministic queries and explainable LLM/agent workflows. NVIDIA's entry into structured context for agents; today's second-largest gainer. |

---

## 3. Trend Signal Analysis

**The dominant theme today is agent memory and context.** `claude-mem` (+1,172), NVIDIA's `auto-ontology` (+2,050), `mem0`, `OpenViking`, and `cognee` all compete in the same arena: making agent state persistent, compressed, and semantically queryable. The field is splitting into three architectural camps — **vector-based** (qdrant, milvus, LEANN), **graph-based** (Graphify, auto-ontology, cognee), and **reasoning/vectorless** (PageIndex). The emergence of vectorless RAG as a credible alternative is notable; it suggests the community is questioning whether embedding cost and retrieval fuzziness are worth it when deterministic AST/graph parsing can do better on structured corpora.

**Computer-use agents are the newest fast-rising frontier.** `agent-desktop` (+2,470) leading today's chart, combined with the steady stream of `browser-use`, `oh-my-pi`, and terminal coding agents, shows the "agent gets its own machine" pattern going mainstream. Rust is unusually well-represented in this cohort (worktrunk, codewhale, agent-desktop, rig) — the systems language is becoming the default for performance-sensitive agent tooling.

**The "skills" packaging convention is congealing.** `mattpocock/skills`, `scenario-labs/skills`, `graphify`'s `/graphify skill`, and `gstack` all ship as installable skills for Claude Code / Cursor / Codex rather than as standalone apps. This is a shift from "build an app" to "publish a capability that the agent consumes."

**Vertical agents in finance remain hot**, with four finance-specific projects (TradingAgents, daily_stock_analysis, Vibe-Trading, career-ops adjacent) in the top quartile by stars — LLM finance appears to be the most consistently high-traction vertical.

**Efficiency is a first-class concern.** `caveman` (65% token cut), `headroom` (20–95% token cut), `LEANN` (97% storage savings), and `kimi-k3-in-c` (8.24 GB RAM for a 2.78T model) all point to a community increasingly optimizing for cost and footprint rather than raw capability. Tied to recent Kimi K3 and DeepSeek releases, this suggests the open-source ecosystem is pivoting from "can it run?" to "can it run cheaply?"

---

## 4. Community Hot Spots

- **[thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) (+1,172 today)** — Cross-session memory for every major agent harness. If you build agents, this or its competitors (`mem0`, `OpenViking`, `cognee`) are becoming mandatory infrastructure rather than optional polish.

- **[vercel-labs/agent-desktop](https://github.com/vercel-labs/agent-desktop) (+2,470 today)** — Today's biggest gainer. A platform-level bet on computer-use agents by Vercel Labs. Worth studying if you're building anything that needs an agent to control a GUI or desktop.

- **[NVIDIA/auto-ontology](https://github.com/NVIDIA/auto-ontology) (+2,050 today)** — Graph-based reasoning layers from NVIDIA. Watch this space if you care about explainable retrieval and deterministic LLM outputs; the "ontology over embeddings" argument is gaining institutional backing.

- **[FareedKhan-dev/kimi-k3-in-c](https://github.com/FareedKhan-dev/kimi-k3-in-c) (+351 today)** — A 2.78T-parameter model in 8.24 GB of RAM on CPU. Even if not production-ready, the technique is a marker for how far quantization and CPU inference have come in 2026.

- **The "skills" pattern** — [mattpocock/skills](https://github.com/mattpocock/skills), [garrytan/gstack](https://github.com/garrytan/gstack), [scenario-labs/skills](https://github.com/scenario-labs/skills). Agent capabilities are being packaged as portable, installable skills. Developers should decide now whether to consume or publish in this format — it looks like the emerging distribution channel for agent tooling.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*