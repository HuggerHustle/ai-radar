# AI Open Source Trends 2026-11-12

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-12 02:12 UTC

---

# AI Open Source Trends Report — 2026-11-12

## 1. Today's Highlights

Today's AI open-source momentum is overwhelmingly concentrated in the **agent harness / agent tooling layer** rather than in model training itself. `affaan-m/ECC` tops the LLM topic with an astonishing 301k stars, framing itself as a performance-optimization system for coding agents (Claude Code, Codex, Cursor, Opencode), while `NousResearch/hermes-agent` leads the AI-agent topic at 262k stars — signaling that "the agent that grows with you" is the new competitive frontier. Meanwhile, token-efficiency plays are proliferating: `JuliusBrussee/caveman` and `headroomlabs-ai/headroom` both attack context bloat, cutting agent token usage by 20–95%. Infrastructure is maturing in parallel — new vectorless/reasoning-based RAG approaches (`VectifyAI/PageIndex`, `Graphify-Labs/graphify`) directly challenge the default vector-store assumption. Finally, vertical AI applications (stock analysis, trading, recruiting, PPT generation) are cross-pollinating with agent frameworks on the daily trending list.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 186,709 | The de-facto local LLM runner, now listing Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, and Gemma support. Its continued dominance shows local multi-model inference is now a baseline developer expectation rather than a specialty. |
| [JuliusBrussee/caveman](https://github.com/JuliussBrussee/caveman) | Go | 119,147 | A viral skill + proxy for coding agents that "talks like a caveman" to cut ~65% of tokens. It captures the surging demand for cheap context compression as agent workloads scale. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 79,391 | Compresses tool outputs, logs, files, and RAG chunks before they hit the LLM (20% fewer tokens for coding agents, 60–95% for JSON). A library, proxy, and MCP server — directly targeting today's biggest agent cost driver. |
| [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) | TypeScript | 38,716 | A coding agent with "the IDE wired in," built by Stencil Labs. Signals the rise of IDE-native agent tooling over standalone chat interfaces. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,720 | Teaches systems engineers to build a tiny vLLM + Qwen inference stack on Apple Silicon. Notable for its educational, systems-first approach to LLM serving. |
| [Picovoice/picollm](https://github.com/Picovoice/picollm) | Python | 319 | On-device LLM inference powered by X-bit quantization. A signal that ultra-low-footprint inference is a growing edge niche. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 262,745 | "The agent that grows with you" — the highest-starred project in the AI-agent topic today. Its scale reflects how intensely the community is converging on persistent, self-improving personal agents. |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Python | 111,139 | Gives agents "eyes to see the entire internet" — one CLI to read/search Twitter, Reddit, YouTube, GitHub, Bilibili, and XiaoHongShu with zero API fees. A strong community answer to the fragmented data-access problem for agents. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 82,012 | Open-source AI job-search agent that scores jobs against your CV, tailors ATS-friendly resumes, and preps interviews. Runs locally in Codex/OpenCode or as a Claude Code plugin — a clean template for vertical agent workflows. |
| [HKUDS/nanobot](https://github.com/HKUDS/nanobot) | Python | 50,021 | A lightweight open-source personal agent. Its simplicity and adoption signal growing appetite for minimal, hackable agent cores over heavyweight frameworks. |
| [zhayujie/CowAgent](https://github.com/zhayujie/CowAgent) | Python | 47,884 | Personal AI assistant & agent harness with planning, tools, self-evolving memory, multi-agent/multi-model/multi-channel support, and one-line install. A comprehensive "do-everything" agent stack. |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | 38,643 | The frontend stack for agents and generative UI (React, Angular, Mobile, Slack), and makers of the AG-UI Protocol. Central to the emergence of agent-native UX standards. |
| [codewhale-hq/Codewhale](https://github.com/codewhale-hq/Codewhale) | Rust | 41,179 | Open-source terminal agent in Rust, provider/model-agnostic. Part of the Rust-powered agent CLI wave emphasizing speed and portability. |
| [esengine/DeepSeek-Reasonix](https://github.com/esengine/DeepSeek-Reasonix) | Go | 36,159 | A "reliable coding agent for complex software engineering tasks." Its Go implementation and reasoning focus reflect demand for dependable, long-horizon coding agents. |

**Today's trending additions (agent-adjacent):**
- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) [JavaScript] — production-grade engineering skills for AI coding agents (+787 today)
- [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) [Rust] — browser automation CLI for AI agents (+708 today)
- [homeassistant-ai/ha-mcp](https://github.com/homeassistant-ai/ha-mcp) [Python] — configure/automate Home Assistant with Claude, ChatGPT, and other assistants (+645 today)
- [shadcn/improve](https://github.com/shadcn/improve) — use your most capable model to audit a codebase, then have cheaper models execute the plan (+361 today)

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 70,334 (+278 today) | LLM-powered multi-market stock analysis with multi-source quotes, real-time news, decision dashboards, and cost-free scheduled runs. Appears on both the daily trending list and the ai-agent topic — a strong cross-signal for finance-focused agents. |
| [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | Python | 38,066 | "Your Personal Trading Agent." Part of the same finance-agent surge as daily_stock_analysis. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 75,992 | Turns documents or topics into native PowerPoint decks with real shapes, animations, data-backed charts, and audio narration. A high-visibility example of agents producing rich, non-text artifacts. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 142,617 | Generates HD short videos from a topic/keyword via an automated AI workflow. Continues to show that generative media pipelines remain a top consumer of LLM tooling. |
| [openbq-org/OpenBB](https://github.com/openbq-org/OpenBB) | Python | 75,345 | Open data platform for analysts, quants, and AI agents. Sits at the intersection of finance data and agent consumption. |
| [paperclipai/paperclip](https://github.com/paperclipai/paperclip) | TypeScript | 113,201 | "The open-source app everyone uses to manage agents at work." A sign that agent *management* (not just creation) is becoming its own product category. |
| [siyuan-note/siyuan](https://github.com/siyuan-note/siyuan) | TypeScript | 47,191 | Privacy-first, self-hosted knowledge workspace where humans and AI agents collaborate. Blends PKM with agent collaboration. |
| [open-webui/open-webui](https://github.com/open-webui/open-webui) | Svelte | 158,421 | User-friendly AI interface supporting Ollama, OpenAI API, and more. Remains the default self-hosted chat front-end. |

**Today's trending addition:** [meta/astryx](https://github.com/meta/astryx) [TypeScript] — an open-source, fully customizable, "agent-ready" design system (+2,776 today, the day's top gainer by a wide margin).

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 168,881 | The model-definition framework for state-of-the-art text, vision, audio, and multimodal models. Still the canonical hub for both inference and training. |
| [langgenius/dify](https://github.com/langgenius/dify) | Python | 160,999 | Builds agentic workflows and RAG pipelines with rich model/tool support on one collaborative workspace (cloud, VPC, or self-hosted). A leading prototype-to-production platform. |
| [tensorflow/tensorflow](https://github.com/tensorflow/tensorflow) | C++ | 201,569 | The long-standing open-source ML framework. Its huge base continues to anchor the "ml" topic. |
| [pytorch/pytorch](https://github.com/pytorch/pytorch) | Python | 105,442 | Tensors and dynamic neural networks with strong GPU acceleration. The default research-to-production training stack. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 108,256 | Implements a ChatGPT-like LLM in PyTorch step by step. A perennial top educational resource for LLM internals. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,116 | Build modular, scalable LLM applications in Rust. Represents the growing Rust LLM-app ecosystem. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,585 | LLM evaluation platform spanning OpenAI, Anthropic, Gemini, Qwen, GLM, DeepSeek across 100+ datasets. Evaluation remains a critical, under-served layer. |
| [AkaliKong/MiniOneRec](https://github.com/AkaliKong/MiniOneRec) | Python | 1,967 | Minimal reproduction of OneRec. Notable for bringing reproducible recommender-model research to a wider audience. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm) | JavaScript | 68,193 | Local-first agent experience with "stop renting your intelligence" positioning. A flagship for private, self-hosted RAG + agents. |
| [meilisearch/meilisearch](https://github.com/meilisearch/meilisearch) | Rust | 59,842 | Lightning-fast search API bringing AI-powered hybrid search to sites and apps. Bridges classic search and vector retrieval. |
| [pathwaycom/serviette](https://github.com/pathwaycom/serviette) | Python | 58,707 | No-code RAG server that keeps answers in sync with your documents, working with 8 vector databases. Highlights the "always-fresh RAG" theme. |
| [run-llama/llama_index](https://github.com/run-llama/llama_index) | Python | 52,879 | "The document processing platform for AI." Remains a core RAG/data framework. |
| [milvus-io/milvus](https://github.com/milvus-io/milvus) | Go | 46,644 | High-performance, cloud-native vector database for scalable ANN search. A pillar of production RAG infrastructure. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | 42,029 | Self-evolving context database unifying agent memory, knowledge RAG, and skills. Notable for merging memory + RAG into one substrate. |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 146,195 | Turns any codebase (docs, SQL schemas, configs, PDFs) into a queryable knowledge graph via a Claude Code/Cursor/Codex/Gemini skill — deterministic AST parsing, no vector store. A major vectorless-RAG signal. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 40,377 | "Document Index for Vectorless, Reasoning-based RAG." Directly challenges the assumption that RAG requires embeddings. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 94,049 | An agent-native database that grew from a RAG engine into context infrastructure. Tracks the RAG→context-infrastructure evolution. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 68,832 | Drop-in memory infrastructure for AI agents — persistent context built for production. Memory is increasingly treated as a first-class RAG-adjacent layer. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 116,251 | Persistent cross-session context: captures agent activity, compresses it with AI, and reinjects relevant context. Works with Claude Code, OpenClaw, Codex, Gemini, Hermes, Copilot, and more. |
| [alibaba/zvec](https://github.com/alibaba/zvec) | C++ | 16,227 | Lightweight, lightning-fast, in-process vector database. Points to demand for embedded, low-overhead vector search. |

---

## 3. Trend Signal Analysis

The dominant signal today is **the industrialization of the agent harness**. The two largest projects in the dataset by stars — `affaan-m/ECC` (301k) and `NousResearch/hermes-agent` (262k) — are not models but agent orchestration/optimization systems, and the daily trending list adds `addyosmani/agent-skills`, `vercel-labs/agent-browser`, `homeassistant-ai/ha-mcp`, and `shadcn/improve`, all of which treat agents as the primary consumer of tooling. This suggests the community has largely stopped asking "which model?" and started asking "how do I make my agent cheaper, more reliable, and more connected?"

A second, sharper signal is **token economics**. `caveman` (~65% token cut) and `headroom` (20–95% reduction) both rank highly, and `shadcn/improve` explicitly routes expensive-model auditing to cheaper-model execution. This is a direct response to the economics of long-context, multi-step agents: context is the new bill, and compression/routing is the new optimization layer.

A third emerging direction is **vectorless and graph-based retrieval**. `Graphify-Labs/graphify` (146k stars, no vector store, deterministic AST parsing) and `VectifyAI/PageIndex` ("vectorless, reasoning-based RAG") both challenge the default embedding pipeline, while `volcengine/OpenViking` merges memory + RAG + skills into a single self-evolving context database. Combined with new in-process vector DBs like `alibaba/zvec`, retrieval architecture is clearly in flux.

Finally, **vertical finance agents** (`daily_stock_analysis`, `Vibe-Trading`, `OpenBB`) and **media-generation agents** (`ppt-master`, `MoneyPrinterTurbo`) show that the agent pattern is now being commoditized into specific job functions rather than staying generic. Connection to industry events: the emphasis on multi-provider support (Ollama listing Kimi, GLM, MiniMax, DeepSeek) and on coding-agent harnesses reflects an environment of rapidly proliferating capable open-weight models, where the moat has shifted from model access to orchestration, memory, and cost control.

---

## 4. Community Hot Spots

- **Agent harness optimization (`affaan-m/ECC`, `caveman`, `headroom`)** — The highest-leverage work right now is not building new agents but making existing ones cheaper and more reliable. Token compression, skill injection, and security/research-first development are all being packaged as reusable systems.
- **Persistent memory & cross-session context (`thedotmack/claude-mem`, `mem0ai/mem0`, `volcengine/OpenViking`)** — Memory is converging with RAG into a single "context substrate." Projects that make agents remember across sessions and tools are attracting six-figure star counts.
- **Vectorless / graph-based RAG (`Graphify-Labs/graphify`, `VectifyAI/PageIndex`)** — A genuine architectural alternative to embedding pipelines is emerging. Developers should watch whether "reasoning-based indexing" gains enterprise traction against mature vector DBs.
- **Agent-native frontends & protocols (`CopilotKit/CopilotKit`, `meta/astryx`)** — With `astryx` gaining +2,776 stars today and CopilotKit pushing the AG-UI Protocol, the UI layer for agents is becoming a distinct discipline. "Agent-ready design systems" is a phrase worth tracking.
- **Vertical agent applications (`career-ops-hq/career-ops`, `ZhuLinsen/daily_stock_analysis`, `hugohe3/ppt-master`)** — Domain-specific agents that produce concrete artifacts (resumes, stock dashboards, PowerPoint decks) are proving to be the fastest path to real usage, and they increasingly run locally inside coding-agent CLIs.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*