# AI Open Source Trends 2026-11-24

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-24 05:16 UTC

---

# AI Open Source Trends Report — 2026-11-24

## 1. Today's Highlights

Today's AI open-source landscape is dominated by the **"Agent Skills" meta-trend**: multiple trending repos are skill bundles, harnesses, or context/memory layers designed to make coding agents (Claude Code, Codex, Cursor, Gemini CLI) dramatically more capable, led by `elementalsouls/Claude-BugHunter` (+2,029 today). Second, **agent-native tooling is eating general software**: `HKUDS/CLI-Anything` ("Making ALL Software Agent-Native") and `obra/superpowers` signal a push to standardize how agents invoke and orchestrate tools. Third, the **context/compression layer** is heating up — `headroomlabs-ai/headroom`, `JuliusBrussee/caveman`, and `thedotmack/claude-mem` all attack the token-efficiency and persistent-memory problem from different angles. Finally, the **RAG/KG revival** continues: vectorless, reasoning-based retrieval (`VectifyAI/PageIndex`, `Graphify-Labs/graphify`, `OpenSPG/KAG`) is challenging pure vector similarity as the default retrieval paradigm.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) | TypeScript | 208,092 (+924) | Knowledge infrastructure giving agents search/scrape access to 550+ data providers via one API. It is now one of the largest agent-data layers, trending strongly again today. |
| [openvinotoolkit/openvino](https://github.com/openvinotoolkit/openvino) | C++ | (+184) | Intel's open-source toolkit for optimizing and deploying AI inference across edge and cloud. Steady infrastructure momentum as deployment moves off cloud-only. |
| [hkuds/cli-anything](https://github.com/HKUDS/CLI-Anything) | Python | (+790) | Aims to make "ALL software agent-native" through a CLI hub. Its rapid climb reflects the industry push to standardize agent-to-tool interfaces. |
| [obra/superpowers](https://github.com/obra/superpowers) | Shell | (+840) | An agentic skills framework plus software-development methodology. High daily stars show strong appetite for reusable agent skill standards. |
| [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) | TypeScript | (+422) | Library of Agent Skills built on the Agent Skills open standard for Stitch MCP, compatible with Antigravity, Gemini CLI, Claude Code and Cursor. Google's entry legitimizes cross-agent skill portability. |
| [cursor/plugins](https://github.com/cursor/plugins) | TypeScript | (+397) | Cursor's plugin specification and official plugins. Signals a maturing IDE-agent extension ecosystem. |
| [tracer-cloud/opensre](https://github.com/Tracer-Cloud/opensre) | Python | (+436) | Open-source agent for CI/CD reliability. Represents AI agents moving into DevOps/SRE workflows. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 265,701 | "The agent that grows with you" — a personal agent framework from Nous Research. Its enormous star count makes it a flagship open agent project. |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Python | 114,311 | Gives agents "eyes" across Twitter, Reddit, YouTube, GitHub, Bilibili and XiaoHongShu through one CLI with zero API fees. Broad social-source coverage is a notable differentiator. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 84,459 | AI job-search agent that scores jobs against your CV, tailors resumes and runs locally in Codex/Claude Code. A strong example of vertical agent products. |
| [HKUDS/nanobot](https://github.com/HKUDS/nanobot) | Python | 50,294 | Lightweight open-source personal agent from HKUDS. Continues the lab's rapid agent-tooling output streak. |
| [zhayujie/CowAgent](https://github.com/zhayujie/CowAgent) | Python | 48,054 | Personal AI assistant & agent harness with memory, skills, multi-agent and multi-channel support. Notable for one-line install and self-evolution features. |
| [codewhale-hq/Codewhale](https://github.com/codewhale-hq/Codewhale) | Rust | 41,199 | Open-source terminal coding agent written in Rust, model-agnostic with multi-agent task splitting. Rust + full auditability is a distinctive combo. |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | 38,921 | Frontend stack for agents and generative UI, and maker of the AG-UI Protocol. Key infrastructure for agent-to-UI integration. |
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | Python | 121,880 | Open-source Python library for AI browser agents plus a hosted cloud. Remains the default reference for web-automation agents. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter) | Python | (+2,029) | Claude Code skill bundle for bug hunting and red-teaming: 84 skills, 15 slash commands, 681 disclosed-report patterns across 24 vulnerability classes. Today's #1 trending AI repo with +2,029 stars. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 145,279 | Generates HD short videos from a topic or keyword via AI workflow. A durable viral app in the AI video space. |
| [zhouxiaoka/autoclip](https://github.com/zhouxiaoka/autoclip) | Python | (+907) | Open-source AI video clipping desktop tool turning long podcasts/courses into shorts with subtitles and covers. High daily stars show strong creator-economy demand. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 79,641 | AI turns documents/topics into native PowerPoint decks with real shapes, charts, narration and custom templates. Standout for producing true native .pptx output. |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 74,071 | LLM-powered multi-market stock analysis system with real-time news and automated push. Illustrates the finance-vertical agent wave. |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | Python | (+797) | Agent skill that researches any topic across Reddit, X, YouTube, HN, Polymarket and the web, then synthesizes a grounded summary. Strong daily momentum for research agents. |
| [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) | HTML | (+620) | Editorial diagram design skill for Claude Code, Codex, Copilot, Cursor and more, with 52 diagram types in self-contained HTML+SVG. Notable as a "taste" layer for agent output. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 169,273 | The model-definition framework for state-of-the-art text, vision, audio and multimodal models. Still the canonical foundation for model work. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 108,938 | Step-by-step PyTorch implementation of a ChatGPT-like LLM. Remains the top educational LLM resource. |
| [jingyaogong/minimind](https://github.com/jingyaogong/minimind) | Python | 69,635 (+828) | Train your own 64M LLM from scratch in 2 hours. Trending again today, reflecting enduring demand for small-model education and DIY training. |
| [pytorch/pytorch](https://github.com/pytorch/pytorch) | Python | 105,704 | Tensors and dynamic neural networks with strong GPU acceleration. The default deep-learning framework. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,634 | LLM evaluation platform spanning OpenAI, Anthropic, Gemini, Qwen, GLM, DeepSeek across 100+ datasets. Central to the growing eval/benchmark discipline. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,805 | Learn LLM inference systems on Apple Silicon by building a tiny vLLM + Qwen. Bridges systems engineering and LLM serving. |
| [galilai-group/stable-pretraining](https://github.com/galilai-group/stable-pretraining) | Python | 354 | Minimal, scalable library for pretraining foundation and world models. Early-stage but signals world-model pretraining interest. |
| [FonaTech/Project_Chronos](https://github.com/FonaTech/Project_Chronos) | Python | 208 | Zero-stall MoE inference via lookahead prediction and async DMA prefetching for SSD I/O. Notable for tackling MoE inference efficiency at the systems level. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [open-webui/open-webui](https://github.com/open-webui/open-webui) | Svelte | 159,380 | User-friendly AI interface supporting Ollama, OpenAI API and more. Still the dominant self-hosted AI front end. |
| [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | Python | 149,952 | The agent engineering platform. Continues to anchor the RAG/agent app stack. |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 152,597 | Turns codebases, docs, SQL schemas, configs and PDFs into a queryable knowledge graph with deterministic AST parsing and no vector store. A leading "vectorless" knowledge-graph contender. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 119,369 | Persistent cross-session context for every agent — captures, compresses and re-injects relevant context. Addresses the memory gap central to long-running agents. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 94,617 | RAG engine that has grown into agent-native context infrastructure. A heavyweight in the retrieval space. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 69,397 | Drop-in memory layer for AI agents with persistent context, built for production. One of the most widely adopted memory SDKs. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 40,766 | Document index for vectorless, reasoning-based RAG. Part of the emerging "reason-over-retrieve" camp challenging vector similarity. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 80,683 | Compresses tool outputs, logs, files and RAG chunks before they hit the LLM — 20% fewer tokens for coding agents, 60-95% for JSON. A timely answer to context-cost pressure. |

---

## 3. Trend Signal Analysis

The clearest signal today is that **the agent "skill/harness" layer is exploding**. Claude-BugHunter, superpowers, stitch-skills, CLI-Anything, last30days-skill and diagram-design are all variations on the same theme: packaging reusable, standardized capabilities for coding agents. This is a maturation phase — instead of building new agents, the community is building the *ecosystem* around them (skills, plugins, specs), with Google's `stitch-skills` explicitly adopting the Agent Skills open standard.

A second signal is **token economics and memory**. Headroom (compression), caveman (shorter outputs), and claude-mem (persistent context) all attack the cost/context ceiling of long-running agents. As agents run longer and invoke more tools, output compression and durable memory are becoming first-class infrastructure rather than nice-to-haves.

Third, **vectorless and graph-based retrieval** is gaining real traction. Graphify, PageIndex and OpenSPG/KAG all explicitly de-emphasize pure vector similarity in favor of deterministic AST parsing, reasoning-based indexing, or logical-form retrieval — a direct response to RAG's precision and cost problems.

Finally, the tooling is getting **vertically applied**: bug hunting, job search, stock analysis, video clipping, PPT generation. The generic agent frameworks are now spawning domain agents at speed, and the strongest daily-star performers (Claude-BugHunter +2,029, autoclip +907) are vertical, not horizontal.

---

## 4. Community Hot Spots

- **[elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter)** — Today's runaway leader (+2,029). Security + agent skills is a potent combination; expect rapid forks into other red-team domains.
- **[HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything)** — The "make all software agent-native" thesis is a bet on where the ecosystem is heading. Worth watching as a potential standard.
- **[headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom)** & **[JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)** — Token compression is quietly becoming essential plumbing; both are high-leverage if you run agents at scale.
- **[Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify)** & **[VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex)** — The vectorless-RAG challenge is the most interesting technical debate in retrieval right now; worth prototyping against your existing vector pipeline.
- **[thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)** — Persistent cross-session memory across Claude Code, Codex, Gemini and more. As multi-session agent work becomes normal, this layer will only grow in importance.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*