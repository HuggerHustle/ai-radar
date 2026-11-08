# AI Open Source Trends 2026-11-08

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-08 00:24 UTC

---

# AI Open Source Trends Report — 2026-11-08

---

## 1. Today's Highlights

The dominant story today is the **explosive emergence of "Agent Skills" as a first-class ecosystem primitive**. Three major vendors — Anthropic, Google, and Cloudflare — all shipped or trended skill repositories simultaneously, with Cloudflare's `security-audit-skill` (+2,085) and mattpocock's personal skills repo (+1,100) leading today's star velocity. Simultaneously, the **context/memory compression layer for agents** is heating up fast: `claude-mem`, `headroom`, `cognee`, and `billion-context` all clustering around the same problem of persistent, cheap agent context. Meanwhile, **browser and computer-use agents** (`agent-browser`, `OpenMausBot`, `browser-use`) continue to accumulate momentum, and the vector-DB/RAG category is fragmenting into specialized niches — vectorless RAG, codebase knowledge graphs, and zero-cloud personal RAG.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [anthropics/skills](https://github.com/anthropics/skills) | Python | 0 (+390) | Anthropic's official public repository for Agent Skills — reusable capability modules for Claude-based agents. Its rapid traction signals that "skills" are becoming the standard packaging format for agent behavior. |
| [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) | JavaScript | 0 (+2,085) | A coding-agent skill performing multi-phase security audits with independently verified, machine-readable findings. It is today's single biggest star gainer on the trending list, showing strong demand for verifiable agent tooling. |
| [google/skills](https://github.com/google/skills) | Python | 0 (+443) | Agent Skills for Google products and technologies. Google's entry into the skill-packaging race underscores vendor competition to own the agent capability layer. |
| [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | Rust | 0 (+190) | Browser automation CLI purpose-built for AI agents. Written in Rust for speed, it competes directly with Python browser-agent libraries and signals infra vendors moving down-stack. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 186,283 | The de-facto local LLM runner, now covering Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, and Gemma. Its breadth of model support keeps it the default substrate for local agent experiments. |
| [open-webui/open-webui](https://github.com/open-webui/open-webui) | Svelte | 158,036 | User-friendly AI interface supporting Ollama and OpenAI-compatible APIs. It remains the most-starred self-hosted LLM frontend and a common pairing with local RAG stacks. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,085 | A modular Rust framework for building scalable LLM applications. Worth watching as Rust gains ground against Python in production LLM serving. |
| [Mirrowel/LLM-API-Key-Proxy](https://github.com/Mirrowel/LLM-API-Key-Proxy) | Python | 559 | Universal LLM gateway exposing OpenAI/Anthropic-compatible endpoints with multi-provider translation and load-balancing. Useful glue for teams juggling many model vendors. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 261,511 | "The agent that grows with you" — NousResearch's flagship agent framework. With over 261K stars it is one of the largest agent projects on GitHub and a key open alternative to closed agent harnesses. |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 299,179 | An agent harness performance-optimization system covering skills, instincts, memory, security, and research-first development for Claude Code, Codex, Opencode, and Cursor. Its star count makes it today's largest agent-tooling repo in the dataset. |
| [milind-soni/OpenMausBot](https://github.com/milind-soni/OpenMausBot) | TypeScript | 0 (+1,955) | Open-source Grok Bot alternative giving bots a full virtual machine to operate in. Its +1,955 daily gain shows intense appetite for open computer-use agents. |
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | Python | 120,267 | Open-source Python library for AI browser agents, plus a hosted stealth-browser cloud offering. It remains the reference implementation for web-operating agents. |
| [zhayujie/CowAgent](https://github.com/zhayujie/CowAgent) | Python | 47,832 | Open-source personal AI assistant and agent harness with planning, tools, skills, memory, and multi-channel support. Its one-line install and self-evolution loop make it a strong personal-agent contender. |
| [HKUDS/nanobot](https://github.com/HKUDS/nanobot) | Python | 49,905 | A lightweight open-source personal agent from HKUDS. It reflects the trend toward small, deployable personal agents rather than heavyweight orchestration. |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | 38,557 | The frontend stack for agents and generative UI, and makers of the AG-UI protocol. It is becoming the default way to wire agent backends into React/Angular frontends. |
| [codewhale-hq/Codewhale](https://github.com/codewhale-hq/Codewhale) | Rust | 41,161 | Open-source terminal coding agent written in Rust, provider-agnostic. Rust-based coding agents are a notable new stack trend this cycle. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 140,753 | Generates HD short videos from a topic or keyword via an automated AI workflow. It remains the highest-starred turnkey AI content-generation app in the dataset. |
| [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | Python | 121,188 | Multi-agent LLM framework for financial trading. It anchors a fast-growing cluster of LLM-finance applications. |
| [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | Python | 37,841 | "Your Personal Trading Agent" — a consumer-facing trading agent from HKUDS. Its rise alongside TradingAgents confirms finance as a breakout vertical for agents. |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 67,736 | LLM-powered multi-market stock analysis with news, dashboards, and free scheduled runs. The "zero-cost scheduled run" pitch resonates with retail quants. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 80,940 | Open-source AI job-search agent that scans boards, scores jobs against your CV, and tailors applications locally. A clean example of vertical agent productization. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 74,535 | Turns documents or topics into native PowerPoint decks with real shapes, charts, narration, and template support. Native-format output (not HTML slides) is its differentiator. |
| [acon96/home-llm](https://github.com/acon96/home-llm) | Python | 1,490 | Home Assistant integration for controlling smart homes with a local LLM. A small but telling signal of local-LLM smart-home adoption. |
| [HKUDS/DeepTutor](https://github.com/HKUDS/DeepTutor) | Python | 56,369 | Lifelong personalized tutoring agent. Education is emerging as another strong vertical for personal agents. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 168,636 | The model-definition framework for state-of-the-art text, vision, audio, and multimodal models. It remains the backbone of nearly all open model releases. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 107,976 | Step-by-step implementation of a ChatGPT-like LLM in PyTorch. Its huge star count shows durable demand for first-principles LLM education. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,572 | LLM evaluation platform covering OpenAI, Anthropic, Gemini, Qwen, GLM, DeepSeek across 100+ datasets. Evaluation is becoming critical as model choice explodes. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,689 | Learn LLM inference on Apple Silicon by building a tiny vLLM + Qwen. Notable for targeting Apple Silicon systems engineers specifically. |
| [Picovoice/picollm](https://github.com/Picovoice/picollm) | Python | 319 | On-device LLM inference powered by X-bit quantization. A signal that edge inference is moving from demo to product. |
| [thinkwee/AgentsMeetRL](https://github.com/thinkwee/AgentsMeetRL) | HTML | 1,878 | Awesome-list for agentic reinforcement learning. It captures the emerging intersection of RL training and agent behavior. |
| [datamllab/OpenEBFM](https://github.com/datamllab/OpenEBFM) | Python | 287 | Open-source code for training and scaling energy-based foundation models. A less-common architecture direction worth tracking. |
| [tensorflow/tensorflow](https://github.com/tensorflow/tensorflow) | C++ | 201,387 | The original open-source ML framework. Still the most-starred ML repo, though ecosystem momentum has shifted toward PyTorch and LLM-native stacks. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | Python | 149,177 | Now positioned as "the agent engineering platform." LangChain's rebrand reflects the industry's migration from pure RAG chains to agent orchestration. |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 143,994 | Turns any codebase, docs, SQL schemas, configs, and PDFs into a queryable knowledge graph — no vector store, deterministic AST parsing. A strong "vectorless RAG" signal for code understanding. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 114,473 | Persistent cross-session context for every agent — captures, compresses, and reinjects relevant context. Works across Claude Code, OpenClaw, Codex, Gemini, Copilot, and more. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 79,079 | Compresses tool outputs, logs, files, and RAG chunks before they reach the LLM — 20–95% token savings with same answers. Token economics are becoming a first-class RAG concern. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 68,582 | The memory layer for AI agents — drop-in persistent context infrastructure for production. It defines the "agent memory" product category. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 93,734 | RAGFlow is an agent-native database — a RAG engine that grew into context infrastructure. Its agent-native repositioning mirrors the broader RAG→context shift. |
| [milvus-io/milvus](https://github.com/milvus-io/milvus) | Go | 46,612 | High-performance, cloud-native vector database built for scalable ANN search. Still the reference production vector DB alongside Qdrant. |
| [qdrant/qdrant](https://github.com/qdrant/qdrant) | Rust | 35,464 | High-performance, massive-scale vector database and search engine. Rust implementation keeps it a favorite for latency-sensitive deployments. |

---

## 3. Trend Signal Analysis

**Agent Skills are becoming the packaging format of 2026.** The single clearest signal today is the simultaneous trending of `anthropics/skills`, `google/skills`, `cloudflare/security-audit-skill`, and `mattpocock/skills`. Three major vendors plus a prominent individual developer all shipping skill repositories on the same day indicates that "skills" have crystallized into a portable, shareable unit of agent capability — analogous to how npm packages standardized JS libraries. Cloudflare's security-audit skill pulling +2,085 stars shows enterprises want verifiable, machine-readable agent outputs, not just chat.

**The context/memory compression layer is the new battleground.** `claude-mem` (114K stars), `headroom` (79K), `mem0` (68K), `cognee` (33K), `billion-context`, and Cloudflare's `security-audit-skill` all attack the same problem: agents waste tokens on context. The emergence of `ranxianglei/billion-context` (context compression for month-long sessions) and `JuliusBrussee/caveman` (cutting 65% of tokens by "talking like a caveman") shows the community treating token efficiency as a viral, competitive sport. This connects directly to recent long-context and reasoning-model releases, where context windows are larger but per-token costs remain the binding constraint.

**Computer-use and browser agents are maturing into infrastructure.** `OpenMausBot` (+1,955), `agent-browser` (+190), and `browser-use` (120K) form a coherent stack: VM-backed agents, CLI browser control, and Python libraries. Rust is appearing repeatedly in this category (`agent-browser`, `Codewhale`, `oh-my-pi`), signaling that performance-sensitive agent tooling is migrating away from Python-only implementations. Finally, RAG is visibly fragmenting — vectorless reasoning-based RAG (`PageIndex`, `graphify`) and codebase knowledge graphs are challenging the default "embed everything into a vector DB" assumption.

---

## 4. Community Hot Spots

- **[cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill)** — Today's top star gainer (+2,085). The "independently verified, machine-readable findings" framing defines what enterprise-grade agent skills will look like: auditable, not conversational. Worth studying as a template for any agent producing compliance-relevant output.

- **[Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify)** & **[VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex)** — The "vectorless RAG" direction is the most interesting technical counter-trend of the cycle. Deterministic AST parsing and reasoning-based document indexing offer explainability and cost advantages over embedding pipelines, especially for codebases.

- **[thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)** & **[headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom)** — Cross-session memory and token compression are the two halves of the same problem. Developers building any long-running agent should evaluate these before rolling their own context management.

- **[milind-soni/OpenMausBot](https://github.com/milind-soni/OpenMausBot)** & **[browser-use/browser-use](https://github.com/browser-use/browser-use)** — Open computer-use agents are attracting both massive hype (+1,955 today) and real library infrastructure. This is the highest-upside and highest-risk category for builders right now.

- **[open-compass/opencompass](https://github.com/open-compass/opencompass)** — As model choice fragments across OpenAI, Anthropic, Gemini, Qwen, GLM, and DeepSeek, standardized evaluation becomes a bottleneck. OpenCompass is quietly becoming essential infrastructure for anyone choosing models rather than defaulting to one vendor.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*