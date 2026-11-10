# AI Open Source Trends 2026-11-10

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-10 03:25 UTC

---

# AI Open Source Trends Report — 2026-11-10

---

## 1. Today's Highlights

The AI open-source ecosystem today is dominated by the **agent infrastructure layer**: Anthropic's official `skills` repo (+1,038 today) and `claude-quickstarts` (+551) signal that vendor-blessed agent tooling is becoming a first-class distribution channel, while Vercel Labs' `agent-browser` (+916) and milind-soni's `OpenMausBot` (+1,587) show explosive demand for giving agents real-world execution surfaces (browsers, VMs). Meta's `astryx` (+3,278) leads the day's raw momentum, betting that "agent-ready" design systems become a new frontend category. In the topic data, memory and context infrastructure (`claude-mem`, `mem0`, `cognee`, `headroom`, `OpenViking`) form a dense cluster, suggesting "persistent agent memory" has moved from experiment to commodity. Meanwhile, token-efficiency projects (`caveman`, `headroom`) and Rust-based agent tooling (`Codewhale`, `rig`, `lancedb`) point to a maturing concern with cost, performance, and production readiness.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [anthropics/skills](https://github.com/anthropics/skills) | Python | 0 (+1,038) | Anthropic's public repository for Agent Skills, defining a reusable capability format for Claude-based agents. It is today's clearest signal that skill packaging is being standardized at the vendor level. |
| [anthropics/claude-quickstarts](https://github.com/anthropics/claude-quickstarts) | Python | 0 (+551) | A collection of deployable starter projects for the Claude API. Its strong debut suggests developers want opinionated scaffolds rather than raw SDK docs. |
| [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | Rust | 0 (+916) | A browser automation CLI purpose-built for AI agents. Rust + agent tooling is a recurring 2026 pattern, and Vercel Labs' backing gives it immediate credibility. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 186,461 | The de facto local model runner, now supporting Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen and Gemma. Its 186K stars make it the anchor of the self-hosted inference stack. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,103 | A modular Rust framework for building scalable LLM applications. It represents the growing Rust-native LLM tooling niche alongside agent-browser and Codewhale. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,700 | A teaching project that builds a tiny vLLM + Qwen inference system on Apple Silicon. Valuable for systems engineers wanting to understand inference internals. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 79,257 | Compresses tool outputs, logs, files and RAG chunks before they reach the LLM — 20% fewer tokens for coding agents, up to 95% for JSON. Token economics is now a first-class infra concern. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 262,107 | "The agent that grows with you" — Nous Research's flagship agent harness. Its 262K stars make it the single largest agent project in today's dataset. |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 300,286 | An agent harness performance optimization system covering skills, instincts, memory, security and research-first development for Claude Code, Codex, Opencode and Cursor. Highest total star count in the entire dataset. |
| [Significant-Gravitas/AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) | Python | 187,973 | The original autonomous agent project, now positioned as accessible AI tooling for everyone. Still relevant as the reference point against which newer agent frameworks are measured. |
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | Python | 120,459 | Open-source Python library for AI browser agents plus a hosted cloud offering. The browser-agent category keeps compounding as web tasks prove the highest-value agent use case. |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Python | 110,659 | Gives agents read/search access to Twitter, Reddit, YouTube, GitHub, Bilibili and XiaoHongShu via one CLI with zero API fees. Solves the "agent can't see the social web" problem directly. |
| [codewhale-hq/Codewhale](https://github.com/codewhale-hq/Codewhale) | Rust | 41,174 | An open-source terminal agent written in Rust supporting any provider or model. A strong representative of the Rust-agent-CLI wave. |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | 38,585 | The frontend stack for agents and generative UI across React, Angular, Mobile and Slack, and makers of the AG-UI Protocol. Critical for teams shipping agent UX rather than just agent backends. |
| [milind-soni/OpenMausBot](https://github.com/milind-soni/OpenMausBot) | TypeScript | 0 (+1,587) | An open-source Grok Bot alternative bundling a virtual machine that bots can use. Today's second-highest trending gainer, reflecting demand for sandboxed agent execution. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 69,038 (+506) | An LLM-powered multi-market stock analysis system with real-time news, decision dashboards and zero-cost scheduled runs. Appears on both the trending list and the ai-agent topic list today. |
| [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | Python | 121,664 | A multi-agent LLM framework for financial trading. Demonstrates that vertical multi-agent applications can reach six-figure star counts. |
| [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | Python | 37,976 | A personal trading agent from HKUDS. Part of a visible cluster of finance-focused agent apps gaining traction simultaneously. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 141,672 | Generates HD short videos from a topic or keyword via automated AI workflow. A long-running proof that consumer-facing generative media apps sustain massive audiences. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 75,310 | Turns documents or topics into native PowerPoint decks with shapes, transitions, charts and audio narration. Office-document generation remains one of the highest-adoption agent verticals. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 81,507 | An open-source AI job search agent that scans boards, scores jobs against your CV and tailors resumes. Runs locally in Codex, OpenCode or as a Claude Code plugin. |
| [homeassistant-ai/ha-mcp](https://github.com/homeassistant-ai/ha-mcp) | Python | 0 (+31) | Configures and automates Home Assistant via Claude, ChatGPT and other assistants through MCP. Small but notable as smart-home MCP integration matures. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 168,714 | The model-definition framework for state-of-the-art text, vision, audio and multimodal models. Remains the canonical entry point for both inference and training. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 108,118 | Step-by-step PyTorch implementation of a ChatGPT-like LLM. Continues to be the reference educational resource for LLM internals. |
| [pytorch/pytorch](https://github.com/pytorch/pytorch) | Python | 105,302 | Tensors and dynamic neural networks with strong GPU acceleration. Still the substrate nearly every other project in this report depends on. |
| [tensorflow/tensorflow](https://github.com/tensorflow/tensorflow) | C++ | 201,425 | The long-standing open-source ML framework. Its 201K stars keep it the largest single ML repo in the dataset despite PyTorch's research dominance. |
| [Picovoice/picollm](https://github.com/Picovoice/picollm) | Python | 319 | On-device LLM inference powered by X-bit quantization. Small but directionally important as edge inference gains attention. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,579 | An LLM evaluation platform covering 100+ datasets across knowledge, reasoning, coding, science, long-context and safety. Evaluation tooling is becoming essential as model counts explode. |
| [thinkwee/AgentsMeetRL](https://github.com/thinkwee/AgentsMeetRL) | HTML | 1,878 | An awesome list for Agentic RL. Signals that reinforcement learning for agents is emerging as a distinct research direction. |
| [genieincodebottle/generative-ai](https://github.com/genieincodebottle/generative-ai) | Jupyter Notebook | 2,668 | Comprehensive generative AI resources including roadmap, projects, use cases and interview prep. Reflects sustained demand for structured learning paths. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [open-webui/open-webui](https://github.com/open-webui/open-webui) | Svelte | 158,244 | A user-friendly AI interface supporting Ollama and OpenAI-compatible APIs. The most-starred RAG-tagged project, effectively the default self-hosted chat UI. |
| [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | Python | 149,284 | The agent engineering platform, now repositioned around agents rather than pure chains. Its continued dominance shows the framework layer has consolidated. |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 145,088 | Turns codebases, docs, SQL schemas, configs and PDFs into a queryable knowledge graph with deterministic AST parsing and no vector store. A notable "vectorless RAG" entrant. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 115,441 | Captures agent session activity, compresses it with AI and injects relevant context into future sessions across Claude Code, OpenClaw, Codex, Gemini and more. Persistent memory is clearly the hottest RAG subcategory today. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 93,918 | Describes itself as an agent-native database that grew from a RAG engine into context infrastructure. The "RAG → context infrastructure" rebranding is a telling industry shift. |
| [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai) | Python | 87,156 | Apache-2.0 crawler powering a hosted scraping, extraction and search API for AI agents. Web data acquisition remains the unglamorous bottleneck everyone needs solved. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 68,719 | Drop-in memory infrastructure for AI agents and apps, built for production. Alongside claude-mem and cognee, it defines the emerging agent-memory stack. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | 41,884 | A self-evolving context database unifying agent memory, knowledge RAG and skills from ByteDance's Volcengine. Notable as a major cloud vendor entering the context-database space. |

---

## 3. Trend Signal Analysis

Today's data reveals three converging currents. First, **agent execution surfaces are the new battleground**: `agent-browser` (+916), `OpenMausBot` (+1,587) and `Agent-Reach` all give agents the ability to act on browsers, VMs and social platforms, moving beyond chat toward embodied task completion. Second, **memory and context have become infrastructure**: `claude-mem` (115K stars), `mem0` (68K), `cognee`, `OpenViking` and `headroom` collectively form a dense cluster around persistent agent context, token compression and context databases. RAGFlow's self-description as "context infrastructure" rather than a RAG engine is a telling semantic shift — the industry is reframing retrieval as memory management.

Third, **Rust is quietly becoming the agent-tooling language**: `agent-browser`, `Codewhale`, `lancedb`, `qdrant`, `meilisearch` and `rig` all ship in Rust, suggesting performance-sensitive agent and retrieval components are migrating away from Python. Meanwhile, Anthropic's simultaneous rise of `skills` and `claude-quickstarts` indicates vendors are competing on developer scaffolding and skill standardization, not just model quality. The appearance of `AgentsMeetRL` and `Awesome-Embodied-Robotics-and-Agent` hints that agentic RL and embodied agents are the next research frontier following the memory-infrastructure wave. Notably, finance verticals (`daily_stock_analysis`, `TradingAgents`, `Vibe-Trading`) appear three times across categories, confirming trading as the most crowded agent application domain.

---

## 4. Community Hot Spots

- **[anthropics/skills](https://github.com/anthropics/skills) + [anthropics/claude-quickstarts](https://github.com/anthropics/claude-quickstarts)** — Anthropic shipping two agent-focused repos on the same day (+1,038 and +551) signals that skill packaging and deployable scaffolds are becoming the vendor's primary developer-relations strategy. Worth watching as a de facto standard.

- **[thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)** — At 115K stars, persistent cross-session memory is arguably today's single hottest subcategory. Developers building any long-running agent should evaluate it against [mem0ai/mem0](https://github.com/mem0ai/mem0) and [topoteretes/cognee](https://github.com/topoteretes/cognee).

- **[vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) + [browser-use/browser-use](https://github.com/browser-use/browser-use)** — Browser control is the highest-leverage agent capability right now. The Rust CLI and Python library are complementary, and both are gaining fast.

- **Vectorless / graph-based RAG** — [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) (145K stars, no vector store) and [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) (reasoning-based RAG) challenge the default embedding-pipeline assumption. Worth benchmarking if your RAG costs or recall are unsatisfactory.

- **Token-efficiency tooling** — [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) and [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) (65% token reduction via terse prompting) both attack inference cost. As agent loops multiply token consumption, compression proxies and MCP servers are becoming standard production middleware.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*