# AI Open Source Trends 2026-11-23

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-23 01:33 UTC

---

# AI Open Source Trends Report — 2026-11-23

---

## 1. Today's Highlights

The dominant theme today is the **agent skill ecosystem**: three of the top four trending repos (Claude-BugHunter, superpowers, last30days-skill) are skill bundles or agentic frameworks for coding agents, and Google's `stitch-skills` plus Cursor's `plugins` confirm that major vendors are now shipping formalized, portable agent capabilities. **Agent-native infrastructure** is the second big signal — `CLI-Anything` ("making ALL software agent-native") and `firecrawl` (a 550+ provider knowledge API) both point to a world where tools are designed for agents first, humans second. The **RAG/knowledge layer** continues to mature away from naive vector search: `graphify` (deterministic knowledge graphs, no vector store), `headroom` (token compression before the LLM), and `PageIndex` (vectorless reasoning-based RAG) all attack retrieval cost and quality from different angles. On the model side, `minimind` continues its run, showing sustained appetite for from-scratch, small-scale LLM training as an educational path. Finally, **token economics** is now a first-class concern, visible in `caveman` and `headroom` — both dedicated to cutting token spend for production agents.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [openvinotoolkit/openvino](https://github.com/openvinotoolkit/openvino) | C++ | 0 (+158) | Intel's open-source toolkit for optimizing and deploying AI inference across CPU/GPU/NPU. Its trending appearance signals continued demand for vendor-neutral, edge-deployable inference runtimes. |
| [cursor/plugins](https://github.com/cursor/plugins) | TypeScript | 0 (+294) | The plugin specification and official plugin set for Cursor, formalizing how third parties extend the editor. Notable as an editor vendor codifying an extensibility standard rather than leaving it ad hoc. |
| [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) | TypeScript | 0 (+494) | A library of Agent Skills built for the Stitch MCP server, following the open Agent Skills standard for compatibility with Antigravity, Gemini CLI, Claude Code, and Cursor. Google Labs backing the cross-agent skill standard is a strong interoperability signal. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 80,511 | Compresses tool outputs, logs, files, and RAG chunks before they reach the LLM, claiming 20% fewer tokens for coding agents and 60-95% for JSON. Token-efficiency infrastructure is becoming a standalone product category. |
| [juliusbrussee/caveman](https://github.com/JuliusBrussee/caveman) | Go | 122,186 | A skill plus local proxy that forces coding agents to produce shorter answers and smaller tool output while keeping originals recoverable. Another direct bet that inference cost, not capability, is the near-term bottleneck. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,226 | A modular, scalable framework for building LLM applications in Rust. Represents the steady Rust-ification of the AI application layer, prioritizing performance and type safety. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter) | Python | 0 (+1,716) | A Claude Code skill bundle for bug bounty and red-team work: 82 skills, 15 slash commands, and 681 disclosed-report patterns across 24 vulnerability classes. Today's single biggest gainer, showing security operations is an early killer app for agent skills. |
| [obra/superpowers](https://github.com/obra/superpowers) | Shell | 0 (+788) | An agentic skills framework plus software development methodology intended to make agents reliably productive. Its high velocity suggests developers are hungry for opinionated structure, not just raw tooling. |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | Python | 0 (+668) | An agent skill that researches any topic across Reddit, X, YouTube, HN, and Polymarket, then synthesizes a grounded summary. The "multi-source, grounded synthesis" pattern is becoming the default research-agent skill. |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Python | 114,028 | Gives agents read/search access to Twitter, Reddit, YouTube, GitHub, Bilibili, and XiaoHongShu through one CLI with zero API fees. Addresses the single biggest practical blocker for agent research: friction-free data access. |
| [zhayujie/CowAgent](https://github.com/zhayujie/CowAgent) | Python | 48,043 | An open-source personal AI assistant and agent harness with planning, tool/skill execution, and self-evolving memory. Multi-agent, multi-model, and multi-channel in a lightweight, one-line install. |
| [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) | TypeScript | 39,673 | A coding agent with the IDE wired in, built by Stencil Labs. Illustrates the ongoing convergence of terminal agents and IDE-native experience. |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | 38,890 | The frontend stack for agents and generative UI across React, Angular, mobile, and Slack, and makers of the AG-UI Protocol. Critical infrastructure for putting agents in front of real end users. |
| [codewhale-hq/Codewhale](https://github.com/codewhale-hq/Codewhale) | Rust | 41,200 | An open-source terminal coding agent in Rust that works with any model and can split one task across several agents. A fully auditable alternative to closed coding agents. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) | TypeScript | 207,063 (+915) | Knowledge infrastructure letting agents search, scrape, and access 550+ data providers through a single API. Its dual appearance in trending and the LLM topic list underscores how central reliable web access is to agent quality. |
| [zhouxiaoka/autoclip](https://github.com/zhouxiaoka/autoclip) | Python | 0 (+641) | An open-source AI video clipping desktop tool that turns long podcasts, interviews, and courses into short-form clips with subtitles, covers, and post copy for TikTok, Reels, Shorts, and 小红书. A concrete, monetizable vertical application. |
| [hkuds/DeepTutor](https://github.com/HKUDS/DeepTutor) | Python | 61,618 | A lifelong personalized tutoring agent. One of several HKUDS entries today, signaling the lab's aggressive expansion across agent verticals. |
| [microsoft/…] — n/a | — | — | — |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 145,098 | Generates HD short videos from a topic or keyword using an automated AI workflow. A long-running favorite that keeps resurfacing as short-form video demand persists. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 79,292 | Turns documents or topics into native PowerPoint decks with real shapes, animations, charts, tables, and audio narration, plus custom .pptx template support. High-value office automation with real fidelity rather than image dumps. |
| [MJmirza/app-store-compliance](https://github.com/mjmirza/app-store-compliance) | Shell | 0 (+621) | An open compliance playbook and pre-submission guard with 124 documented rejection patterns, privacy manifest checks, and 112 tracked regulatory deadlines. Notably includes a skill for AI coding agents — compliance as an agent capability. |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 73,711 | An LLM-powered multi-market stock analysis system with multi-source market data, real-time news, dashboards, and zero-cost scheduled runs. Finance remains the most reliably popular vertical for agentic LLM apps. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [jingyaogong/minimind](https://github.com/jingyaogong/minimind) | Python | 68,686 (+473) | Train your own 64M-parameter LLM from scratch in two hours. Its repeated trending appearances confirm durable demand for small, reproducible, educational model training. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 108,844 | Step-by-step implementation of a ChatGPT-like LLM in PyTorch. Remains the canonical learning resource and continues to accumulate stars steadily. |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 169,400 | The model-definition framework for state-of-the-art text, vision, audio, and multimodal models. Still the foundational dependency for nearly the entire ecosystem. |
| [galilai-group/stable-pretraining](https://github.com/galilai-group/stable-pretraining) | Python | 352 | A reliable, minimal, scalable library for pretraining foundation and world models. Small but notable for its focus on *pretraining stability* and world models rather than fine-tuning. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,803 | Teaches systems engineers to build a tiny vLLM plus Qwen inference stack on Apple Silicon. Bridges the gap between using LLMs and understanding inference internals. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,625 | An LLM evaluation platform spanning OpenAI, Anthropic, Gemini, Qwen, GLM, and DeepSeek across 100+ datasets covering knowledge, reasoning, coding, science, and safety. Evaluation rigor is increasingly the gate for production deployment. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 152,074 | Turns any codebase, docs, SQL schemas, configs, and PDFs into a queryable knowledge graph via local deterministic AST parsing, with every edge explained and no vector store. A notable anti-vector-store thesis gaining serious traction. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 119,097 | Provides persistent context across agent sessions by capturing activity, compressing it with AI, and reinjecting relevant context later. Session memory is emerging as essential agent infrastructure. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 69,352 | Drop-in memory infrastructure for AI agents and apps, built for production. Continues to hold the "memory layer" position as competitors multiply. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 40,747 | A document index for vectorless, reasoning-based RAG. Another signal that the community is actively probing alternatives to embedding similarity retrieval. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | 42,620 | A self-evolving context database unifying agent memory, knowledge RAG, and skills. Volcano Engine's entry shows cloud vendors consolidating the fragmented memory/RAG/skills stack. |
| [StarTrail-org/LEANN](https://github.com/StarTrail-org/LEANN) | Python | 13,808 | An MLSys 2026 Best Paper implementation enabling RAG on everything with 97% storage savings while running fast, accurate, fully private RAG on-device. Strong research-to-code credibility. |
| [alibaba/zvec](https://github.com/alibaba/zvec) | C++ | 16,276 | A lightweight, lightning-fast, in-process vector database. Points toward embedded, zero-ops vector search as local agents become commonplace. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 94,548 | An agent-native database that evolved from a RAG engine into context infrastructure. Its repositioning mirrors the category's broader shift from retrieval tool to agent substrate. |

---

## 3. Trend Signal Analysis

The clearest signal today is that **agent skills have become a distribution format**. Claude-BugHunter (+1,716), superpowers (+788), last30days-skill (+668), and stitch-skills (+494) are all, at core, packaged capabilities rather than applications. This is a meaningful structural shift: instead of building vertical AI products, developers are increasingly shipping reusable, cross-agent skill bundles that plug into Claude Code, Cursor, Codex, Gemini CLI, and Antigravity. The presence of both **Google Labs** (stitch-skills) and **Cursor** (plugins) in the same trending window suggests vendors are competing to define the standard rather than lock users in — the Agent Skills open standard and MCP are the connective tissue.

The second signal is **token economics as a product category**. `caveman` (122K stars) and `headroom` (80K stars) both exist purely to reduce token consumption and tool-output bloat. When two independent projects reach six-figure star counts on pure cost-reduction premises, it indicates that production agent deployments are now hitting real inference budgets — a shift from the "demo era" to the "unit economics era."

Third, **retrieval is fracturing**. `graphify` (no vector store, AST-derived knowledge graphs), `PageIndex` (vectorless reasoning RAG), `LEANN` (97% storage reduction), and `OpenViking` (unified memory/RAG/skills) all reject the naive "embed everything" approach. The community is converging on the view that vector similarity alone is insufficient for professional-domain retrieval, with logical-form and graph-based reasoning (KAG, Graphify) gaining ground. Meanwhile `Agent-Reach` and `firecrawl` — both six-figure-star projects — address the input side, ensuring agents can actually reach the data.

Finally, the continued presence of `minimind` and `tiny-llm` signals that **small-model literacy** — training and inference from scratch — remains a persistent community interest, likely amplified by the run of efficient small-model releases (Qwen, Gemma, gpt-oss) that make local and edge agent deployment viable.

---

## 4. Community Hot Spots

- **[Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify)** — At 152K stars with a "no vector store, deterministic AST parsing, every edge explained" thesis, graphify is the strongest challenger to embedding-based RAG. Worth studying as a drop-in `/graphify` skill for Claude Code, Cursor, Codex, and Gemini CLI.

- **[headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom)** and **[JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)** — Token compression is now a standalone category. If you run production agents, these are the two most direct levers on cost today; the fact that both reached six-figure stars independently makes them required reading.

- **[Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach)** — Zero-API-fee access to Twitter, Reddit, YouTube, GitHub, Bilibili, and XiaoHongShu in one CLI removes the biggest practical blocker to multi-source agent research. High leverage for anyone building research or monitoring agents.

- **[elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter)** — Today's biggest gainer (+1,716) and the clearest evidence that security operations is among the earliest agent-skills killer apps. The 681-pattern, 24-vulnerability-class structure is a template for how domain expertise gets encoded into skills.

- **[volcengine/OpenViking](https://github.com/volcengine/OpenViking)** and **[mem0ai/mem0](https://github.com/mem0ai/mem0)** — The memory/context layer is consolidating. OpenViking's unification of memory, RAG, and skills, backed by a major cloud vendor, is worth watching as the shape of the post-RAG agent substrate.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*