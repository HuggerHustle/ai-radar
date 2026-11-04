# AI Open Source Trends 2026-11-04

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-04 01:13 UTC

---

# AI Open Source Trends Report — 2026-11-04

## 1. Today's Highlights

Today's trending data shows an overwhelming surge of **agent infrastructure and context/memory tooling** dominating the charts. `vercel-labs/agent-desktop` exploded with +3,791 stars, signaling intense demand for "computer use" CLIs, while `thedotmack/claude-mem` (+1,139) and `mattpocock/skills` (+1,164) show developers rapidly converging on persistent context and skill packaging for coding agents. A notable new direction is **local/on-device inference optimization**: `JustVugg/colibri` (+802) brings hierarchical MoE inference to consumer hardware, and `Picovoice/picollm` pushes on-device quantization. Meanwhile `p-e-w/heretic` (+701) highlights a growing appetite for training-free model behavior modification (censorship removal, slop/sycophancy reduction). The RAG category has quietly rebranded itself toward **"AI memory" and "context databases"** (mem0, cognee, OpenViking), reflecting the shift from static retrieval to self-evolving agent memory.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [vercel-labs/agent-desktop](https://github.com/vercel-labs/agent-desktop) | Rust | (+3,791 today) | A computer-use CLI for AI agents, giving agents direct desktop control primitives. It tops today's trending list by a wide margin, a strong signal that "computer use" is becoming a first-class infra layer. |
| [JustVugg/colibri](https://github.com/JustVugg/colibri) | C | (+802 today) | A hierarchical inference engine for frontier MoE models, keeping hot experts on GPU and streaming cold ones from NVMe. Written in C, it targets running large models on hardware you already own. |
| [max-sixty/worktrunk](https://github.com/max-sixty/worktrunk) | Rust | (+438 today) | A CLI for Git worktree management purpose-built for parallel AI agent workflows. Its traction reflects how agent-driven development is reshaping developer tooling. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 185,818 | The de facto local LLM runner, now supporting Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, and Gemma. Its sustained scale makes it the anchor of the local-inference ecosystem. |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 168,508 | The model-definition framework for state-of-the-art text, vision, audio, and multimodal models. Remains the universal substrate for both inference and training. |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 141,870 | Turns any codebase, docs, SQL schemas, and PDFs into a queryable knowledge graph via a Claude Code/Cursor/Codex/Gemini skill. Uses deterministic AST parsing, no vector store. |
| [Mirrowel/LLM-API-Key-Proxy](https://github.com/Mirrowel/LLM-API-Key-Proxy) | Python | 559 | A universal LLM gateway offering OpenAI/Anthropic-compatible endpoints with multi-provider translation and intelligent load-balancing. Useful plumbing for multi-model agent stacks. |
| [Picovoice/picollm](https://github.com/Picovoice/picollm) | Python | 318 | On-device LLM inference powered by X-bit quantization. A small but telling signal that edge/private inference is maturing beyond demos. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 111,923 (+1,139 today) | Captures everything an agent does during sessions, compresses it with AI, and re-injects relevant context into future sessions. Works across Claude Code, OpenClaw, Codex, Gemini, Hermes, Copilot, and OpenCode. |
| [mattpocock/skills](https://github.com/mattpocock/skills) | Shell | (+1,164 today) | A curated set of "skills for real engineers" pulled straight from the author's `.agents` directory. Its velocity shows skill-sharing for coding agents has become a community ritual. |
| [Donchitos/Claude-Code-Game-Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) | Shell | (+1,182 today) | Turns Claude Code into a full game dev studio with 49 AI agents, 72 workflow skills, and a coordination system mirroring real studio hierarchy. A vivid example of multi-agent orchestration via skills. |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 296,569 | An agent harness performance optimization system covering skills, instincts, memory, and security across Claude Code, Codex, Opencode, and Cursor. Its enormous star count underscores the hunger for harness-level tuning. |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 260,252 | "The agent that grows with you," from a lab known for open model work. A long-running flagship in the personal-agent space. |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Python | 108,446 | Gives AI agents the ability to read and search Twitter, Reddit, YouTube, GitHub, Bilibili, and XiaoHongShu via one CLI, with zero API fees. A strong signal for social/web perception layers. |
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | Python | 119,964 | Open-source Python library for AI browser agents, plus a hosted cloud with stealth browsers. The reference point for web-acting agents. |
| [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) | Python | 44,410 | A framework for building resilient, stateful agents. Continues as a backbone for production agent graphs. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [Usagi-org/ai-goofish-monitor](https://github.com/Usagi-org/ai-goofish-monitor) | Python | (+228 today) | A Playwright + AI system for real-time/scheduled monitoring and analysis of Xianyu (Goofish) listings, with a full admin UI. Shows vertical AI commerce tools finding real traction. |
| [shiyu-coder/Kronos](https://github.com/shiyu-coder/Kronos) | Python | (+503 today) | A foundation model for the "language of financial markets." Notable as a domain-specific foundation model climbing today's trend list. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 138,339 | Generates HD short videos from a topic or keyword using an automated AI workflow. A persistent favorite in the generative-media app space. |
| [HKUDS/DeepTutor](https://github.com/HKUDS/DeepTutor) | Python | 54,730 | Lifelong personalized tutoring powered by LLMs. Represents the education vertical's AI-native push. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 73,098 | Turns documents or topics into native PowerPoint decks with shapes, transitions, charts, and audio narration. A concrete productivity vertical with real output fidelity. |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 67,505 | An LLM-powered multi-market stock analysis system with real-time news, decision dashboards, and cost-free scheduled runs. Financial-analysis agents are clearly a hot vertical. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 79,876 | An open-source AI job search agent that scans boards, scores jobs against your CV, and tailors resumes. Runs locally in Codex/OpenCode or as a Claude Code plugin. |
| [anomalyco/hex](https://github.com/anomalyco/hex) | Rust | (+410 today) | Local voice dictation for Mac, Windows, and Linux. A small but growing on-device AI utility. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [p-e-w/heretic](https://github.com/p-e-w/heretic) | Python | (+701 today) | Training-free language model modification: remove censorship, suppress slop, reduce sycophancy. Its momentum signals rising demand for post-hoc behavioral editing without retraining. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,061 | A Rust framework for building modular, scalable LLM applications. Represents the maturing Rust-for-AI stack. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,563 | An LLM evaluation platform supporting OpenAI, Anthropic, Gemini, Qwen, GLM, DeepSeek and more across 100+ datasets. Evaluation remains critical infrastructure. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,534 | Teaches building a tiny vLLM + Qwen inference system on Apple Silicon for systems engineers. A strong educational entry for inference internals. |
| [datamllab/OpenEBFM](https://github.com/datamllab/OpenEBFM) | Python | 248 | Open-source code for training and scaling energy-based foundation models. A quieter but technically distinctive research direction. |
| [Eigenwise/atomic-agents](https://github.com/Eigenwise/atomic-agents) | Python | 6,317 | A framework for "building AI agents, atomically." Reflects the modularization trend in agent construction. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 107,771 | Implements a ChatGPT-like LLM in PyTorch step by step. Continues as the canonical hands-on LLM learning resource. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 93,447 | A RAG engine that has evolved into "agent-native" context infrastructure. The category's clearest signpost from RAG toward context databases. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 68,350 | The memory layer for AI agents: drop-in persistent memory infrastructure for production. Memory is now treated as infra, not a feature. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 39,966 | A document index for vectorless, reasoning-based RAG. Notable as a counter-trend to vector-database orthodoxy. |
| [topoteretes/cognee](https://github.com/topoteretes/cognee) | Python | 33,033 | An open-source AI memory platform giving agents persistent long-term memory with small models. Riding the memory-infra wave. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | 41,462 | A self-evolving context database unifying agent memory, knowledge RAG, and skills. A notable hyperscaler-adjacent entry into the memory space. |
| [StarTrail-org/LEANN](https://github.com/StarTrail-org/LEANN) | Python | 13,763 | RAG on everything with 97% storage savings and 100% private on-device operation (MLSys 2026 Best Paper). Efficiency + privacy in one package. |
| [milvus-io/milvus](https://github.com/milvus-io/milvus) | Go | 46,578 | A high-performance, cloud-native vector database for scalable ANN search. Still the reference vector store at scale. |
| [qdrant/qdrant](https://github.com/qdrant/qdrant) | Rust | 35,412 | A high-performance, massive-scale vector database and search engine. A durable Rust-based alternative in the vector wars. |

---

## 3. Trend Signal Analysis

The most explosive attention today is concentrated in **agent context and memory**, not in models themselves. Three of the top trending repos (`claude-mem`, `agent-desktop`, `skills`) are all about making agents more capable across sessions and across the desktop — a clear pivot from "which model" to "how do we make agents remember, act, and coordinate." The RAG category's rebranding reinforces this: RAGFlow now calls itself "agent-native context infrastructure," mem0 and cognee sell "memory," and OpenViking pitches a "self-evolving context database." Retrieval has collapsed into the broader memory/context stack.

A second signal is the **local and on-device inference push**: `colibri` (hierarchical MoE streaming), `picollm` (X-bit quantization), and `hex` (local dictation) all point to developers wanting capable models on their own hardware. This aligns with the steady drumbeat of strong small/open models (Qwen, GLM, DeepSeek, gpt-oss) that make local inference viable.

Third, **training-free model modification** (`heretic`) and **skill packaging** (`skills`, `Claude-Code-Game-Studios`) show the community increasingly treats models as fixed artifacts to be shaped via prompting, skills, and post-hoc edits rather than retrained. Multi-agent orchestration via skills — as in the 49-agent Game Studios repo — is emerging as a distinct design pattern.

---

## 4. Community Hot Spots

- **[vercel-labs/agent-desktop](https://github.com/vercel-labs/agent-desktop)** — +3,791 stars today. Computer use is the fastest-growing agent capability; expect a wave of competing desktop-control CLIs and security tooling around them.
- **[thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)** and **[mem0ai/mem0](https://github.com/mem0ai/mem0)** — Persistent agent memory is becoming essential infrastructure. Watch for standardization efforts and head-to-head benchmarks.
- **[p-e-w/heretic](https://github.com/p-e-w/heretic)** — Training-free behavioral modification (censorship, sycophancy, slop) is a fast-emerging tooling niche with real demand for local/open models.
- **[JustVugg/colibri](https://github.com/JustVugg/colibri)** and **[Picovoice/picollm](https://github.com/Picovoice/picollm)** — Efficient local inference of frontier-class models is a durable trend; MoE streaming and extreme quantization are both worth tracking.
- **[Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify)** and **[VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex)** — Vectorless/structured knowledge retrieval is challenging vector-DB orthodoxy; code-graph and reasoning-based indexing are the ones to watch.

*Note: Star totals and "today" figures are reproduced verbatim from the source data; several entries listed only today's increment, so total-star cells are left blank where no total was provided.*

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*