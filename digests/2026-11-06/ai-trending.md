# AI Open Source Trends 2026-11-06

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-06 01:28 UTC

---

# AI Open Source Trends Report — 2026-11-06

## 1. Today's Highlights

The dominant theme today is **agent infrastructure for the real world** — not new models, but the scaffolding around them. Vercel Labs shipped two Rust-based CLIs (`agent-desktop`, `agent-browser`) that give agents computer-use and browser control, while `max-sixty/worktrunk` targets parallel agent git workflows. A second surge is the "Skills" pattern: five separate repos today (mattpocock, google, scenario-labs, ConardLi, plus ECC's harness) package reusable agent capabilities, signaling Skills are becoming a distribution format. NVIDIA's `auto-ontology` (+2,679 today) leads the trending list, reflecting growing demand for deterministic, graph-based reasoning layers to replace brittle vector-only retrieval. Microsoft's `VibeVoice` continues frontier open voice AI momentum.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [vercel-labs/agent-desktop](https://github.com/vercel-labs/agent-desktop) | Rust | 0 (+2,173) | Computer-use CLI that lets AI agents control the desktop. Vercel Labs' entry into agent OS-level automation pulled 2,173 stars on day one, a strong signal for the computer-use category. |
| [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | Rust | 0 (+150) | Browser automation CLI purpose-built for AI agents. Complements agent-desktop; together they position Vercel Labs as an agent-tooling vendor. |
| [max-sixty/worktrunk](https://github.com/max-sixty/worktrunk) | Rust | 0 (+546) | CLI for Git worktree management designed for parallel AI agent workflows. Solves a real pain point as multi-agent coding becomes common. |
| [D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling) | Python | 0 (+1,655) | Web scraping framework scaling from single requests to full crawls. Heavy star velocity (+1,655) shows scraping remains critical agent plumbing. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 186,039 | Local model runner supporting Kimi, GLM, MiniMax, DeepSeek, Qwen, Gemma and more. The de facto local inference standard; catalog now spans the full Chinese and Western model ecosystem. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,072 | Modular framework for building scalable LLM applications in Rust. Rust is increasingly the language of choice for agent infrastructure. |
| [Picovoice/picollm](https://github.com/Picovoice/picollm) | Python | 319 | On-device LLM inference via X-Bit quantization. Notable for pushing inference to the edge without cloud dependency. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 260,882 | "The agent that grows with you" — a self-improving personal agent. Massive star count reflects NousResearch's community leverage. |
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | Python | 120,142 | Open-source Python library for AI browser agents, plus a hosted cloud. The reference implementation for browser-based agent automation. |
| [HKUDS/nanobot](https://github.com/HKUDS/nanobot) | Python | 49,865 | Lightweight open-source personal agent from HKUDS. Praised for minimal footprint versus heavier agent stacks. |
| [zhayujie/CowAgent](https://github.com/zhayujie/CowAgent) | Python | 47,806 | Personal AI assistant & agent harness with memory, multi-agent and multi-channel support. One-line install lowers the barrier to self-hosted agents. |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | 38,532 | Frontend stack for agents and generative UI across React, Angular, Mobile and Slack. Makers of the AG-UI Protocol, a candidate standard for agent-UI communication. |
| [esengine/DeepSeek-Reasonix](https://github.com/esengine/DeepSeek-Reasonix) | Go | 36,095 | Reliable coding agent for complex software engineering tasks. Rides the DeepSeek ecosystem's momentum in the coding-agent niche. |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Python | 109,239 | CLI giving agents read/search access to Twitter, Reddit, YouTube, GitHub, Bilibili and XiaoHongShu with zero API fees. Addresses the agent data-access bottleneck directly. |
| [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | Python | 120,835 | Multi-agent LLM framework for financial trading. Representative of the verticalization of multi-agent systems. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [microsoft/VibeVoice](https://github.com/microsoft/VibeVoice) | Python | 0 (+223) | Open-source frontier voice AI from Microsoft. A rare big-lab frontier release in the voice category. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 139,797 | One-click HD short-video generation from a topic or keyword. Persistent high stars show sustained appetite for generative video automation. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 80,478 | Open-source AI job search agent that scans boards, scores jobs against your CV, and tailors ATS-friendly resumes. A concrete, high-utility vertical agent. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 73,955 | Turns documents or topics into native PowerPoint decks with shapes, animations, charts and audio narration. Native .pptx output is the differentiator. |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 67,616 | LLM-powered multi-market stock analysis with news, dashboards and scheduled notifications. Cost-free scheduled runs lower the ops barrier. |
| [Usagi-org/ai-goofish-monitor](https://github.com/Usagi-org/ai-goofish-monitor) | Python | 0 (+240) | Playwright + AI monitor for Xianyu (Goofish) marketplace listings with admin UI. Illustrates regional vertical agents thriving outside Western platforms. |
| [siyuan-note/siyuan](https://github.com/siyuan-note/siyuan) | TypeScript | 47,093 | Privacy-first, self-hosted knowledge workspace where humans and agents collaborate. A rare "agent-native" note app entry. |
| [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | Python | 37,731 | Personal trading agent from HKUDS. Another data point in the finance-agent surge. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 168,588 | The model-definition framework for state-of-the-art text, vision, audio and multimodal models. Remains the default training and inference toolkit. |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 297,888 | Agent harness performance optimization system covering skills, instincts, memory and security for Claude Code, Codex, Cursor and more. Highest star count in today's dataset. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,634 | Educational build of a tiny vLLM + Qwen inference system on Apple Silicon. Valuable for systems engineers learning inference internals. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 107,877 | Step-by-step PyTorch implementation of a ChatGPT-like LLM. Continues to anchor the ML education category. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,564 | LLM evaluation platform spanning OpenAI, Anthropic, Gemini, Qwen, GLM and DeepSeek across 100+ datasets. Evaluation infrastructure is increasingly load-bearing for model selection. |
| [Mirrowel/LLM-API-Key-Proxy](https://github.com/Mirrowel/LLM-API-Key-Proxy) | Python | 559 | Universal LLM gateway with OpenAI/Anthropic-compatible endpoints and intelligent load-balancing. Reflects the multi-provider reality of 2026 stacks. |
| [datamllab/OpenEBFM](https://github.com/datamllab/OpenEBFM) | Python | 273 | Training and scaling code for energy-based foundation models. A research-bet outside the dominant autoregressive paradigm. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [open-webui/open-webui](https://github.com/open-webui/open-webui) | Svelte | 157,870 | User-friendly AI interface supporting Ollama, OpenAI API and more. The leading self-hosted AI UI. |
| [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | Python | 149,106 | The agent engineering platform. Still the default orchestration layer despite growing competition. |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 143,002 | Turns any codebase, docs, SQL schemas, configs and PDFs into a queryable knowledge graph with no vector store. Local deterministic AST parsing + explainable edges is a notable anti-vector-store stance. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 113,559 | Persistent context across sessions for any agent, compressing activity and re-injecting relevant context. Cross-agent memory portability is the key differentiator. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 93,630 | Agent-native RAG engine positioned as context infrastructure. A leading open RAG engine continuing to evolve toward agent-native semantics. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 68,480 | Drop-in memory layer for AI agents and apps. Memory infrastructure is now table stakes for production agents. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 78,942 | Compresses tool outputs, logs, files and RAG chunks before they reach the LLM, cutting 60-95% of tokens on JSON. Token-cost optimization is becoming its own category. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 40,040 | "Vectorless" reasoning-based document index for RAG. Another signal that pure vector retrieval is being challenged. |
| [NVIDIA/auto-ontology](https://github.com/NVIDIA/auto-ontology) | Python | 0 (+2,679) | Framework for building semantic, graph-based reasoning layers over data with deterministic query generation and explainable AI. Today's top trending repo — NVIDIA is betting on explainability as the next RAG frontier. |

---

## 3. Trend Signal Analysis

**What is exploding.** Agent *harnesses and skills* dominate, not models. Five "Skills" repositories appear in one day, `affaan-m/ECC` sits at 297,888 stars, and both Vercel Labs CLIs (`agent-desktop` +2,173, `agent-browser`) treat the OS and browser as first-class agent surfaces. The community is standardizing the reusable-capability layer — Skills are becoming to agents what Docker images were to microservices.

**New stacks and directions.** Two stand out. First, **Rust is now the default language of agent infrastructure**: `worktrunk`, `agent-desktop`, `agent-browser`, `Codewhale`, `rig`, `caveman`. Second, **anti-vector / deterministic retrieval** is a genuine movement: `auto-ontology` (graph reasoning), `graphify` (knowledge graph, "no vector store"), and `PageIndex` (vectorless, reasoning-based RAG) all challenge the vector-DB orthodoxy. Token-economics tooling (`headroom`, `caveman`) also emerges as its own niche, targeting the cost of agent loops rather than their capabilities.

**Industry connections.** The breadth of `ollama`'s catalog — Kimi, GLM, MiniMax, DeepSeek, Qwen alongside Western models — reflects a genuinely multi-polar model landscape. Microsoft's `VibeVoice` release and NVIDIA's tooling push show large labs competing on *infrastructure and modality* rather than model weights alone. Meanwhile, the heavy presence of DeepSeek- and Qwen-adjacent tooling suggests Chinese open-weight models are now structurally embedded in Western agent stacks.

---

## 4. Community Hot Spots

- **[NVIDIA/auto-ontology](https://github.com/NVIDIA/auto-ontology)** — Today's top trending repo (+2,679). Graph-based, explainable reasoning layers are a credible challenger to naive vector RAG; watch whether it becomes an integration target for major agent frameworks.
- **[vercel-labs/agent-desktop](https://github.com/vercel-labs/agent-desktop) + [agent-browser](https://github.com/vercel-labs/agent-browser)** — Vercel Labs' twin Rust CLIs indicate a serious vendor bet on computer-use agents. Worth tracking as a potential standard interface.
- **[affaan-m/ECC](https://github.com/affaan-m/ECC)** — At 297,888 stars, the harness optimization system (skills, memory, security) is arguably the most-followed repo in the dataset; a bellwether for agent-harness design patterns.
- **[headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) & [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)** — Two independent bets on token-compression (60-95% JSON reduction; caveman-speak prompting). Token cost is becoming the primary agent-scaling constraint.
- **[Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify), [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex), [NVIDIA/auto-ontology](https://github.com/NVIDIA/auto-ontology)** — The emerging "vectorless / graph-native retrieval" cluster is worth deep attention; if it matures, it reshapes the entire RAG toolchain.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*