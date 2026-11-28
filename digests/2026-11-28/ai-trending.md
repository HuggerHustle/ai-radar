# AI Open Source Trends 2026-11-28

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-28 03:13 UTC

---

# AI Open Source Trends Report — 2026-11-28

## 1. Today's Highlights

Today's AI open-source activity is dominated by **agent skills and harnesses** rather than new models: Claude Code skill bundles (Claude-BugHunter, superpowers, diagram-design, last30days-skill, stitch-skills) collectively pulled thousands of new stars in a single day. The "agent-native" reframing of existing software is a second major current — HKUDS' CLI-Anything ("making ALL software agent-native") and Firecrawl's knowledge infrastructure both trend strongly. Training-from-scratch education projects (minimind, tiny-llm, LLMs-from-scratch) remain persistently popular, signaling sustained demand for low-cost, hands-on LLM literacy. Memory and context infrastructure continues to mature as its own layer, with claude-mem, mem0, OpenViking, and headroom all present. Notably, several top trending repos are explicitly *skill* packages rather than applications — the ecosystem is standardizing around the Agent Skills open standard.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure (frameworks, SDKs, inference engines, dev tools, CLI)

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) | Python | ⭐0 (+666) | Aims to make all software agent-native via a CLI hub. Strong same-day momentum (+666) marks it as a breakout infra play. |
| [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) | TypeScript | ⭐211,743 (+822) | Knowledge/scraping infrastructure giving agents search and access to 550+ data providers through one API. Appears in both trending and topic lists, reinforcing its position as default agent data layer. |
| [openvinotoolkit/openvino](https://github.com/openvinotoolkit/openvino) | C++ | ⭐0 (+151) | Intel's open toolkit for optimizing and deploying AI inference. Steady enterprise-grade adoption signal. |
| [cursor/plugins](https://github.com/cursor/plugins) | TypeScript | ⭐0 (+243) | Cursor's plugin specification and official plugins. Signals the IDE vendor formalizing an extension ecosystem around coding agents. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | ⭐188,332 | Local model runtime supporting Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen and more. The de facto local inference entry point. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | ⭐9,294 | Modular, scalable LLM application framework in Rust. Represents the growing Rust-for-AI tooling niche. |
| [Mirrowel/LLM-API-Key-Proxy](https://github.com/Mirrowel/LLM-API-Key-Proxy) | Python | ⭐565 | Universal LLM gateway with OpenAI/Anthropic-compatible endpoints and load balancing. Useful glue for multi-provider setups. |

### 🤖 AI Agents / Workflows (agent frameworks, automation, multi-agent systems)

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter) | Python | ⭐0 (+1,608) | Claude Code skill bundle for bug hunting/red-team work: 85 skills, 16 slash commands, 681 disclosed-report patterns. Today's #1 trending repo by new stars — a strong signal for vertical security-agent skills. |
| [obra/superpowers](https://github.com/obra/superpowers) | Shell | ⭐0 (+922) | Agentic skills framework and software development methodology. High same-day traction suggests demand for opinionated agent workflows. |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | ⭐311,920 | Agent harness performance optimization system with skills, instincts, memory and security for Claude Code, Codex, Cursor and beyond. Huge total star count underlines harness-layer competition. |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | ⭐266,611 | "The agent that grows with you." NousResearch's flagship agent entry, among the largest agent repos by stars. |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Python | ⭐115,391 | Gives agents "eyes" to read/search Twitter, Reddit, YouTube, GitHub, Bilibili and XiaoHongShu via one CLI with zero API fees. Addresses the agent data-access gap. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | ⭐85,237 | Open-source AI job-search agent that scores jobs against your CV and tailors applications. A clear vertical-agent success story. |
| [zhayujie/CowAgent](https://github.com/zhayujie/CowAgent) | Python | ⭐48,117 | Open-source personal AI assistant and agent harness with memory, multi-agent, multi-model support. One-line install lowers the barrier to personal agents. |
| [codewhale-hq/Codewhale](https://github.com/codewhale-hq/Codewhale) | Rust | ⭐41,219 | Rust coding agent for terminal, web and desktop with multi-agent fleets, MCP and sandboxing. Notable as a Rust-based coding-agent contender. |

### 📦 AI Applications (specific apps, vertical solutions)

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) | HTML | ⭐0 (+725) | Editorial diagram design skill for Claude Code, Codex, Copilot, Cursor and others; 52 diagram types, self-contained HTML+SVG. A polished example of "skill-as-product." |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | Python | ⭐0 (+675) | Agent skill that researches any topic across Reddit, X, YouTube, HN, Polymarket and synthesizes a grounded summary. Demonstrates multi-source research agents as a consumer-facing pattern. |
| [zhouxiaoka/autoclip](https://github.com/zhouxiaoka/autoclip) | Python | ⭐0 (+718) | Open-source, local-first OpusClip alternative: AI clipping of long video into shorts with captions, covers and copy, plus an MCP server. Zero-subscription positioning drives strong interest. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | ⭐80,807 | AI generates native PowerPoint decks with real shapes, animations, charts and narration. Native-file output (not slide images) is the differentiator. |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | ⭐75,028 | LLM-powered multi-market stock analysis with dashboards, news and scheduled zero-cost runs. Finance vertical agent with production-shaped features. |
| [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) | TypeScript | ⭐0 (+311) | Agent Skills library for the Stitch MCP server, following the Agent Skills open standard. Google Labs' entry into the skills ecosystem. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | ⭐146,020 | One-click HD short-video generation from a topic via automated AI workflow. Persistent consumer-app appeal. |

### 🧠 LLMs / Training (model weights, training frameworks, fine-tuning tools)

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [jingyaogong/minimind](https://github.com/jingyaogong/minimind) | Python | ⭐72,252 (+660) | Train a 64M LLM from scratch in 2 hours. Appears in both trending and topic lists — education-grade training remains a top draw. |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | ⭐169,309 | The model-definition framework for text, vision, audio and multimodal models. Still the ecosystem's backbone. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | ⭐109,162 | Step-by-step PyTorch implementation of a ChatGPT-like LLM. Belongs to the same "learn by building" wave as minimind. |
| [pytorch/pytorch](https://github.com/pytorch/pytorch) | Python | ⭐105,694 | Core deep-learning framework with GPU acceleration. Unchanged but foundational. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | ⭐5,815 | Build a tiny vLLM + Qwen inference system on Apple Silicon for systems engineers. Fills a gap in systems-level LLM education. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | ⭐7,652 | LLM evaluation platform spanning 100+ datasets across reasoning, coding, science and safety. Evaluation tooling is increasingly critical as model counts grow. |
| [ultralytics/ultralytics](https://github.com/ultralytics/ultralytics) | Python | ⭐63,809 | YOLO family for detection, segmentation, classification and tracking. The dominant CV training/inference toolkit. |

### 🔍 RAG / Knowledge (vector databases, retrieval-augmented generation, knowledge management)

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | ⭐120,234 | Persistent cross-session context for agents: captures session activity, compresses it with AI, reinjects relevant context. Memory-as-a-skill is a fast-emerging category. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | ⭐94,840 | Agent-native RAG engine grown into "context infrastructure." Positions RAG as a database layer rather than a pipeline. |
| [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai) | Python | ⭐88,054 | Apache-2.0 crawler powering a hosted extraction/search API for agents. Open-core crawler with a free tier. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | ⭐81,013 | Compresses tool outputs, logs, files and RAG chunks before they hit the LLM (60–95% fewer tokens for JSON). Token-cost optimization is a hot, practical pain point. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | ⭐69,563 | Drop-in memory layer for AI agents with persistent context. Production-oriented memory infrastructure. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | ⭐42,946 | Self-evolving context database unifying agent memory, knowledge RAG and skills. A notable "context DB" contender from Volcengine. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | ⭐40,821 | Vectorless, reasoning-based document index for RAG. Challenges the default vector-store assumption. |
| [qdrant/qdrant](https://github.com/qdrant/qdrant) | Rust | ⭐35,746 | High-performance vector database and search engine. A mainstay of the vector-DB layer. |

---

## 3. Trend Signal Analysis

The most explosive attention today is going to **agent skills and harnesses**, not models. Claude-BugHunter's +1,608 stars for a security-skill bundle, alongside superpowers (+922), diagram-design (+725) and last30days-skill (+675), shows that the community is treating *skill packages* as products. The Agent Skills open standard (referenced by stitch-skills and others) is quietly becoming the distribution format for agent capabilities, and vendors like Cursor (plugins) and Google Labs (stitch-skills) are formalizing ecosystems around it.

A second clear direction is **context and memory as infrastructure**. claude-mem, mem0, OpenViking, headroom, ragflow and PageIndex all address the same problem — getting the right context into the model cheaply. Headroom's token-compression angle and PageIndex's "vectorless" reasoning-based indexing suggest the vector-store default is being questioned, while claude-mem's cross-session persistence shows memory is moving from library to agent-native skill.

New stack signals: **Rust** is appearing repeatedly in agent and vector-DB tooling (Codewhale, qdrant, lancedb, rig), and **local-first/zero-subscription** positioning is a recurring marketing hook (autoclip, Agent-Reach, anything-llm). Education projects (minimind, tiny-llm, LLMs-from-scratch) keep pulling steady traffic, reflecting continued demand for hands-on LLM literacy as a counterweight to API-only development. There is no new frontier model release driving today's list — the momentum is in the tooling layer around existing models.

---

## 4. Community Hot Spots

- **[elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter)** — Today's top gainer (+1,608). Vertical security skills for coding agents are a proven demand signal; expect more domain-specific skill bundles (compliance, finance, healthcare).
- **[HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything)** — "Agent-native everything" is a compelling framing; if it delivers reliable CLI wrapping for arbitrary software, it becomes core agent infrastructure.
- **[thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)** & **[headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom)** — Memory persistence and token compression are the two highest-leverage cost/quality levers for agent builders right now; both are worth evaluating early.
- **[VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex)** — "Vectorless RAG" is a contrarian bet against the vector-DB consensus; worth watching as a potential simplification of retrieval stacks.
- **[google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills)** & **[cursor/plugins](https://github.com/cursor/plugins)** — Vendor-backed skill/plugin ecosystems are forming; building against the Agent Skills open standard early reduces lock-in risk.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*