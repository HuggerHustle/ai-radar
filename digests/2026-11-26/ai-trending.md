# AI Open Source Trends 2026-11-26

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-26 03:29 UTC

---

# AI Open Source Trends Report — 2026-11-26

## 1. Today's Highlights

Agent skills and harnesses dominate today's leaderboard, with six of the top trending repos being skill bundles or agent frameworks targeting Claude Code, Cursor, Codex, and Gemini CLI. The "agent-native infrastructure" theme is unmistakable: CLI-Anything, firecrawl, and last30days-skill all position themselves as tools that give agents broader reach into software, the web, and social platforms. RAG is quietly being re-architected — several new entrants (PageIndex, LEANN, OpenViking) explicitly pitch *vectorless* or *self-evolving* context layers rather than traditional vector stores. On the application side, AI video repurposing (autoclip, MoneyPrinterTurbo) and domain-specific agents (TradingAgents, career-ops, QwenPaw) show verticalization accelerating. Memory persists as a category of its own, with claude-mem, mem0, and cognee all competing for the "persistent context layer for agents" position.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) | TypeScript | 210,154 (+1,135) | Knowledge/scraping infrastructure giving agents unified access to 550+ data providers via one API. Today's 1,135 new stars reflect its role as the default web layer for agent stacks. |
| [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) | Python | 0 (+1,106) | "Making ALL software agent-native" via a CLI hub. A brand-new repo crossing 1,100 stars on day one signals strong demand for standardizing agent-to-software interfaces. |
| [cursor/plugins](https://github.com/cursor/plugins) | TypeScript | 0 (+416) | Cursor's official plugin specification and plugin set. Notable as the first mainstream IDE vendor formally standardizing a plugin contract around agent skills. |
| [openvinotoolkit/openvino](https://github.com/openvinotoolkit/openvino) | C++ | 0 (+191) | Intel's toolkit for optimizing and deploying AI inference. Steady traction as an on-prem/edge inference alternative to CUDA-centric stacks. |
| [Eigenwise/atomic-agents](https://github.com/Eigenwise/atomic-agents) | Python | 6,349 | Composable, "atomic" primitives for building agents. Smaller but growing, notable for its minimalist design philosophy versus heavyweight frameworks. |
| [Tracer-Cloud/opensre](https://github.com/Tracer-Cloud/opensre) | Python | 0 (+348) | Open-source agent for CI/CD reliability. A specialized harness applying agentic patterns to SRE workflows — an emerging niche. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [obra/superpowers](https://github.com/obra/superpowers) | Shell | 0 (+903) | Agentic skills framework plus a software development methodology. Nearly 900 stars today shows appetite for opinionated, methodology-level agent frameworks. |
| [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter) | Python | 0 (+1,652) | Claude Code skill bundle for offensive security: 85 skills, 16 slash commands, patterns across 24 vulnerability classes. Today's #1 gainer at +1,652, illustrating how quickly vertical skill packs go viral. |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 310,783 | Agent harness performance optimization — skills, instincts, memory, and security for Claude Code, Codex, Cursor, and more. Enormous star count reflects the "agent harness" layer consolidating. |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 266,145 | "The agent that grows with you." Nous Research's flagship agent, with a strong cult following around open-weight models. |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | 38,981 | Frontend stack for agents and generative UI, plus makers of the AG-UI Protocol. The leading answer to "how do I embed agents in a React app." |
| [zhayujie/CowAgent](https://github.com/zhayujie/CowAgent) | Python | 48,080 | Open-source personal assistant and agent harness with memory, skills, and multi-channel support. Represents the "personal agent OS" pattern growing in China's OSS scene. |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Python | 114,764 | Gives agents read/search access to Twitter, Reddit, YouTube, GitHub, Bilibili, and more via one CLI with zero API fees. A strong signal that agent *reach* (not reasoning) is the current bottleneck. |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | Python | 0 (+945) | Agent skill that researches any topic across Reddit, X, YouTube, HN, and Polymarket then synthesizes a grounded summary. +945 stars today for a *single skill* shows the skills marketplace is thriving. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 145,743 | Generate HD short videos from a topic or keyword with an automated AI workflow. A perennial favorite; the Chinese-language AI content creation market remains huge. |
| [zhouxiaoka/autoclip](https://github.com/zhouxiaoka/autoclip) | Python | 0 (+880) | Open-source AI clipping tool turning podcasts, interviews, and courses into short videos for Douyin/Xiaohongshu/TikTok/Reels. +880 today confirms short-form repurposing is a killer app. |
| [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | TypeScript | 123,784 | Multi-agent framework for financial research. Part of a cluster of trading-agent repos trending simultaneously (see Vibe-Trading, daily_stock_analysis). |
| [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | Python | 38,940 | "Your Personal Trading Agent." HKUDS appears repeatedly today — a lab building an end-to-end personal-agent portfolio. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 84,896 | AI job-search agent that scans boards, scores roles against your CV, tailors resumes, and preps interviews. A high-traction example of vertical agent products. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 80,250 | Converts documents/topics into native PowerPoint decks with real shapes, transitions, and narration. Native-format output (not images) is the differentiator vs. earlier AI slides tools. |
| [mjmirza/app-store-compliance](https://github.com/mjmirza/app-store-compliance) | Shell | 0 (+858) | Compliance playbook and pre-submission guard for App Store/Google Play, plus an agent skill. Shows AI-agent skills expanding into legal/regulatory domains. |
| [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) | HTML | 0 (+1,141) | Editorial diagram design skill for Claude Code, Codex, Copilot, Cursor and others — 52 diagram types in self-contained HTML/SVG. +1,141 today because it directly attacks Mermaid's visual ceiling. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 169,339 | The canonical model-definition framework for state-of-the-art ML across text, vision, audio, and multimodal. Still the bedrock dependency of the ecosystem. |
| [jingyaogong/minimind](https://github.com/jingyaogong/minimind) | Python | 71,094 (+826) | Train your own 64M LLM from scratch in 2 hours. Today's +826 shows the "learn by training your own tiny LLM" genre remains a top on-ramp. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 109,060 | Step-by-step PyTorch implementation of a ChatGPT-like LLM. The most enduring educational LLM repo. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,813 | Learn LLM inference systems on Apple Silicon — build a tiny vLLM + Qwen. A new entrant focused on *systems* rather than modeling, filling a real gap. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,268 | Modular, scalable LLM application framework in Rust. Part of the broader Rust-in-AI push alongside qdrant and Codewhale. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,644 | LLM evaluation platform covering OpenAI, Anthropic, Gemini, Qwen, GLM, DeepSeek across 100+ datasets. Evaluation is quietly becoming a first-class infra category. |
| [galilai-group/stable-pretraining](https://github.com/galilai-group/stable-pretraining) | Python | 354 | Minimal, scalable pretraining library for foundation and world models. Small but notable for the "world models" framing. |
| [thinkwee/AgentsMeetRL](https://github.com/thinkwee/AgentsMeetRL) | HTML | 1,901 | Curated awesome-list for agentic RL. Reflects the industry turning toward RL post-training for agent behavior. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | Python | 150,004 | The agent engineering platform (formerly "the LLM framework"). Still the default orchestration layer despite constant challengers. |
| [open-webui/open-webui](https://github.com/open-webui/open-webui) | Svelte | 159,580 | User-friendly AI interface supporting Ollama, OpenAI API, and more. The de facto self-hosted ChatGPT alternative. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 94,726 | Agent-native RAG engine that has evolved into context infrastructure. Repositioning from "RAG" to "context infra" mirrors the broader category shift. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 119,799 | Persistent cross-session memory for every agent — Claude Code, OpenClaw, Codex, Gemini, Copilot and more. Memory is clearly separating from RAG as a distinct layer. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 69,483 | Drop-in memory infrastructure for AI agents. Production-grade persistence and the strongest brand in the agent-memory niche. |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 153,433 | Turns any codebase plus docs, SQL, configs, and PDFs into a queryable knowledge graph. Explicitly "no vector store" — a leading vectorless RAG play. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 40,789 | Reasoning-based, vectorless document index. Reinforces the anti-vector-store wave alongside LEANN and graphify. |
| [StarTrail-org/LEANN](https://github.com/StarTrail-org/LEANN) | Python | 13,814 | MLSys 2026 Best Paper implementation delivering 97% storage savings for private, on-device RAG. Research-backed efficiency claims make this one to watch. |

---

## 3. Trend Signal Analysis

The dominant signal today is **the rise of the agent skills layer as a product category**. Six of the top trending repos are skill bundles or harnesses — Claude-BugHunter (+1,652), CLI-Anything (+1,106), last30days-skill (+945), superpowers (+903), app-store-compliance (+858), and diagram-design (+1,141). What's striking is the *verticalization*: skills are no longer generic (read files, run tests) but domain-specific (bug bounty, App Store compliance, editorial diagrams, market research). This is a direct consequence of the maturity of Claude Code, Cursor, and Codex as execution runtimes — the model providers have commoditized the reasoning loop, so value is migrating to curated domain knowledge packaged as skills.

The second signal is **"vectorless" RAG** emerging as a real challenger. PageIndex, LEANN, and graphify all explicitly reject or de-emphasize vector stores in favor of graphs, reasoning, or compressed indexes. Combined with LEANN's MLSys best-paper backing and OpenViking's "self-evolving context database" framing, this suggests the RAG stack is being re-architected around *structure and reasoning* rather than embedding similarity.

Third, **memory is separating from RAG** as its own layer: claude-mem (119k stars), mem0 (69k), cognee (33k), and OpenViking (42k) all compete on persistent agent state rather than retrieval. This is likely downstream of long-running agent frameworks like LangGraph and the Claude Code/OpenClaw ecosystem where session persistence is a first-order UX problem.

Finally, the **Rust-in-AI stack** continues to inch up (rig, qdrant, Codewhale, meilisearch, lancedb), and **evaluation/inference-systems** education repos (opencompass, tiny-llm) point to a maturing talent pipeline.

---

## 4. Community Hot Spots

- **[elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter)** — Today's #1 gainer at +1,652. Vertical security skills bundled for Claude Code; a template for how any regulated domain (legal, medical, finance) can be packaged as an agent skill pack.
- **[Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) & [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex)** — The vectorless-RAG wave. If these gain traction, expect significant churn in vector-DB positioning (Qdrant, Milvus, Weaviate). Worth close tracking.
- **[firecrawl/firecrawl](https://github.com/firecrawl/firecrawl)** — At 210k stars and +1,135 today, it's becoming the default web-access layer for agents. Any team building agents that need live web data should evaluate it as a dependency.
- **[thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) & [mem0ai/mem0](https://github.com/mem0ai/mem0)** — The agent-memory layer is coalescing. Cross-session persistence is becoming table stakes for any serious coding or personal agent.
- **[HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything)** — Brand-new and already +1,106. Making arbitrary software callable by agents via CLI is a foundational interface question; if this standardizes, it reshapes tool-use architecture.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*