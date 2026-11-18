# AI Open Source Trends 2026-11-18

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-18 02:50 UTC

---

# AI Open Source Trends Report
**Date: 2026-11-18**

---

## 1. Today's Highlights

Today's GitHub trending landscape is overwhelmingly dominated by **agent skills and harnesses** — reusable skill bundles, plug-in frameworks, and performance-optimization layers for coding agents like Claude Code, Codex, and Cursor. The single biggest signal is **obra/superpowers** (+1,917 today), an agentic skills framework that essentially redefines how developers ship software with agents, alongside **dream-num/univer** (+1,774) pushing "AI office" SDKs and **ag-ui-protocol/ag-ui** (+1,445) standardizing the Agent-User Interaction Protocol. Meanwhile, **Tencent/LoopForge** and **alibaba/open-code-review** show that major cloud vendors are now shipping self-hosted, enterprise-grade agent orchestration and code-review infrastructure. The RAG/knowledge category is also maturing fast, with context compression (**headroom**), persistent agent memory (**claude-mem**, **mem0**), and vectorless RAG (**PageIndex**) all drawing strong community traction.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [obra/superpowers](https://github.com/obra/superpowers) | Shell | 0 (+1,917) | An agentic skills framework and software development methodology that works across coding agents. It leads today's trending list by a wide margin, signaling that standardization of agent skill workflows is the hottest infra theme right now. |
| [ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui) | TypeScript | 0 (+1,445) | The Agent-User Interaction Protocol that brings agents into frontend applications. Its rapid rise suggests the ecosystem is converging on a standard protocol for agent-frontend communication, similar to what MCP did for tool use. |
| [alibaba/open-code-review](https://github.com/alibaba/open-code-review) | Go | 0 (+763) | A battle-tested hybrid code review tool combining deterministic pipelines with LLM agents, with built-in multi-language security rulesets. Its Alibaba-scale provenance and OpenAI/Anthropic compatibility make it a strong enterprise-grade alternative to closed tools. |
| [Tencent/LoopForge](https://github.com/Tencent/LoopForge) | Go | 0 (+591) | Self-hosted workflows for coding-agent delivery, orchestrating CodeBuddy, Codex, and Claude Code with human approval gates. Its emergence from Tencent signals big-tech interest in governable, self-hosted agent pipelines. |
| [cursor/plugins](https://github.com/cursor/plugins) | TypeScript | 0 (+201) | The official Cursor plugin specification and plugins. It formalizes an extension surface for a leading AI IDE, giving plugin developers a first-class distribution channel. |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 305,595 (+883) | An agent harness performance optimization system covering skills, instincts, memory, and security for Claude Code, Codex, Opencode, and Cursor. Its massive cumulative star count reflects sustained demand for squeezing more capability out of existing agent harnesses. |
| [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) | TypeScript | 0 (+350) | A library of Agent Skills designed for the Stitch MCP server, following the Agent Skills open standard for compatibility with Antigravity, Gemini CLI, Claude Code, and Cursor. It shows Google is actively investing in cross-agent skill portability. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,168 | A modular, scalable framework for building LLM applications in Rust. It represents the growing Rust-native alternative for teams that need performance and safety in LLM app backends. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter) | Python | 0 (+1,005) | A Claude Code skill bundle for bug hunting and red-team work with 82 skills and 681 disclosed-report patterns. Its breakout +1,005 day shows security-focused agent skills are a fast-emerging niche. |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | Python | 0 (+696) | An AI agent skill that researches any topic across Reddit, X, YouTube, HN, and Polymarket, then synthesizes a grounded summary. It exemplifies the trend of packaging real-time multi-source research into a single reusable skill. |
| [backnotprop/plannotator](https://github.com/backnotprop/plannotator) | TypeScript | 0 (+691) | A workspace to stay in the loop with agents — shape, decide, plan, annotate, and send feedback with one click. It addresses the human-in-the-loop gap that becomes critical as agents take on longer autonomous tasks. |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 264,250 | "The agent that grows with you" — a personal agent framework from NousResearch. Its enormous cumulative star base cements NousResearch as a major open-agent player. |
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | Python | 121,342 | An open-source Python library for AI browser agents, plus a hosted cloud offering with stealth browsers and a hosted agent API. It remains the reference implementation for web-automation agents. |
| [HKUDS/nanobot](https://github.com/HKUDS/nanobot) | Python | 50,159 | A lightweight open-source personal agent. Its popularity reflects demand for small, self-hostable personal agents that don't require heavy infrastructure. |
| [zhayujie/CowAgent](https://github.com/zhayujie/CowAgent) | Python | 47,982 | An open-source personal AI assistant and agent harness that plans tasks, runs tools and skills, and self-evolves with memory. Its one-line install and multi-channel support make it a practical on-ramp for personal agent users. |
| [google-research/paper-orchestra](https://github.com/google-research/paper-orchestra) | Python | 0 (+1,072) | A multi-agent framework for automated AI research paper writing. Its strong debut suggests automated research workflows are becoming a legitimate agent application area. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [dream-num/univer](https://github.com/dream-num/univer) | TypeScript | 0 (+1,774) | An AI office SDK bringing editing, calculation, collaboration, and file processing to products for both people and AI agents. Its +1,774 day shows strong appetite for embeddable "AI-native" office/document infrastructure. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 83,377 | An open-source AI job search agent that scans job boards, scores jobs against your CV, and tailors resumes and cover letters. It's a compelling example of a vertical agent that runs locally in common AI CLIs. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 77,973 | AI turns documents or topics into native PowerPoint decks with shapes, transitions, charts, and audio narration. It targets the very common enterprise need of automated high-fidelity slide generation. |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 73,114 | An LLM-powered multi-market stock analysis system with real-time news, decision dashboards, and scheduled runs. It reflects the growing intersection of LLM agents and personal finance tooling. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 144,239 | Generates HD short videos from a topic or keyword using an automated AI workflow. Its large star base shows short-video generation remains one of the most accessible AI application categories. |
| [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | Python | 38,452 | A personal trading agent from HKUDS. It extends the HKUDS agent lineup into finance, complementing their nanobot and DeepTutor projects. |
| [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | Python | 122,978 | A multi-agent LLM financial trading framework. It is one of the most established open frameworks for LLM-driven trading research. |
| [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) | TypeScript | 39,328 | A coding agent with the IDE wired in, built by Stencil Labs. It represents the "IDE-native agent" pattern that is competing with terminal-based agents. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [jingyaogong/minimind](https://github.com/jingyaogong/minimind) | Python | 0 (+192) | Train a 64M-parameter LLM from scratch in just 2 hours. It remains a popular educational entry point for understanding LLM training end to end. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 187,445 | Get up and running with Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, Gemma, and other models. Its model lineup reflects how rapidly the open-weight frontier has diversified beyond a handful of families. |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 169,323 | The model-definition framework for state-of-the-art ML across text, vision, audio, and multimodal models. It remains the default hub for model definitions and inference/training APIs. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,752 | Learn LLM inference systems on Apple Silicon by building a tiny vLLM + Qwen for systems engineers. It's a rare systems-level LLM learning resource targeting Apple hardware. |
| [Picovoice/picollm](https://github.com/Picovoice/picollm) | Python | 320 | On-device LLM inference powered by X-bit quantization. It points to continued interest in running capable models fully locally on constrained devices. |
| [FonaTech/Project_Chronos](https://github.com/FonaTech/Project_Chronos) | Python | 207 | Zero-stall MoE inference via lookahead prediction and async DMA prefetching, optimized for SSD I/O. It's a technically deep entry addressing MoE inference bottlenecks. |
| [Eigenwise/atomic-agents](https://github.com/Eigenwise/atomic-agents) | Python | 6,339 | Building AI agents "atomically" — a compositional approach to agent construction. It appeals to developers who want fine-grained control over agent primitives. |
| [pytorch/pytorch](https://github.com/pytorch/pytorch) | Python | 105,813 | Tensors and dynamic neural networks in Python with strong GPU acceleration. It remains the foundational training framework underpinning most of the ecosystem above. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 149,701 | Turns any codebase, docs, SQL schemas, configs, and PDFs into a queryable knowledge graph with local deterministic AST parsing and no vector store. It is a leading proponent of the "vectorless" knowledge-graph approach to RAG. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 118,020 | Persistent context across sessions for every agent — capturing activity, compressing it with AI, and re-injecting relevant context. It directly addresses the session-amnesia problem that limits long-running agents. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 69,147 | The memory layer for AI agents — drop-in persistent memory infrastructure for production. It has become a de facto standard for agent memory in the open-source stack. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 79,929 | Compresses tool outputs, logs, files, and RAG chunks before they reach the LLM, cutting tokens 20% for coding agents and 60–95% for JSON. It targets the increasingly painful cost/latency of context bloat. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 40,458 | A document index for vectorless, reasoning-based RAG. It represents the emerging "reasoning-based retrieval" alternative to embedding similarity search. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | 42,387 | A self-evolving context database unifying agent memory, knowledge RAG, and skills. Backed by Volcengine, it signals cloud-vendor investment in unified context infrastructure. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 94,341 | An agent-native database that grew from a RAG engine into context infrastructure. It exemplifies the convergence of RAG engines and agent context layers. |
| [milvus-io/milvus](https://github.com/milvus-io/milvus) | Go | 46,680 | A high-performance, cloud-native vector database built for scalable vector ANN search. It remains a cornerstone of production RAG deployments. |

---

## 3. Trend Signal Analysis

The most explosive attention today is going to **agent skills and harnesses** — not new models, but the tooling layer that makes existing coding agents more capable. `obra/superpowers` (+1,917), `Claude-BugHunter` (+1,005), `last30days-skill` (+696), and `plannotator` (+691) all fit one pattern: packaging reusable, domain-specific capabilities as skills that plug into Claude Code, Codex, Cursor, and Gemini CLI. A second cluster is **standardization**: `ag-ui` (+1,445) is pushing a frontend-agent interaction protocol, `google-labs-code/stitch-skills` follows an open Agent Skills standard, and `cursor/plugins` formalizes an extension spec. This looks like the ecosystem moving from ad-hoc agent hacking toward interoperable interfaces.

A notably fresh direction is **"vectorless" / reasoning-based retrieval**: `graphify` (149,701 stars) and `VectifyAI/PageIndex` both explicitly reject vector stores in favor of knowledge graphs and reasoning-based indexing, while `headroom` attacks the same context-cost problem from the compression angle. This coincides with widespread discussion of context-window economics and RAG cost, and suggests the community is actively questioning whether embedding-based RAG is the endgame. Finally, big-tech entries — `Tencent/LoopForge`, `alibaba/open-code-review`, `volcengine/OpenViking`, and Google Research's `paper-orchestra` — indicate that cloud vendors now view self-hosted agent orchestration, secure code review, and automated research as strategic open-source battlegrounds rather than side projects.

---

## 4. Community Hot Spots

- **[obra/superpowers](https://github.com/obra/superpowers)** — The day's top gainer (+1,917). If agent skills become the new "npm packages," the framework defining how they're written and composed will be highly influential; worth tracking as a potential standard.
- **[ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui)** — A protocol play for agent-frontend interaction. Protocols tend to have winner-take-most dynamics, so early involvement carries outsized upside; watch whether CopilotKit and other frontend stacks converge on it.
- **[Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) & [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex)** — The vectorless-RAG direction is the most credible challenge to embedding-based retrieval in years. Developers building knowledge systems should prototype against these to see whether reasoning-based indexing fits their workloads.
- **[headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom)** — Context compression is a direct cost lever (20% fewer tokens for coding agents, 60–95% for JSON). Any team running agents at scale should evaluate it as a drop-in proxy or MCP server.
- **[dream-num/univer](https://github.com/dream-num/univer)** — At +1,774 today, it's the strongest non-agent signal. Embeddable, AI-native office/document infrastructure is a large underserved market for product teams building agent-facing tools.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*