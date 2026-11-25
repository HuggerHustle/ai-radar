# AI Open Source Trends 2026-11-25

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-25 04:05 UTC

---

# AI Open Source Trends Report — 2026-11-25

---

## 1. Today's Highlights

Today's GitHub AI landscape is overwhelmingly dominated by **agentic infrastructure and "Agent Skills" as a packaging format** — Claude Code skill bundles, MCP-compatible skill libraries, and agent frameworks collectively occupy the majority of the hot list. The highest-velocity new entrant is `elementalsouls/Claude-BugHunter` (+1,826 today), a security-focused skill bundle that signals agents moving into specialized professional verticals. Meanwhile, `HKUDS/CLI-Anything` (+1,074) pushes the "make all software agent-native" thesis, and `firecrawl/firecrawl` (+991) reinforces the emerging "knowledge infrastructure for agents" category. On the topic-search side, RAG and memory layers show sustained maturation, with `thedotmack/claude-mem` and `mem0ai/mem0` indicating persistent context is now table stakes. Notably, several previously distinct categories — vector DBs, memory, RAG, context compression — are converging into a single "agent context infrastructure" layer.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [cursor/plugins](https://github.com/cursor/plugins) | TypeScript | 0 (+360) | Official Cursor plugin specification and plugins. Signals that IDE vendors are formalizing extension standards for agent-native editors, a bellwether for the coding-agent ecosystem. |
| [openvinotoolkit/openvino](https://github.com/openvinotoolkit/openvino) | C++ | 0 (+185) | Open-source toolkit for optimizing and deploying AI inference across Intel hardware. Continued relevance shows deployment/inference optimization remains a durable, non-hyped priority. |
| [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) | Python | 0 (+1,074) | "Making ALL Software Agent-Native" via a CLI-Hub. Explosive day-one traction (+1,074) makes it the clearest signal that CLI-as-agent-interface is a rising design pattern. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,807 | Teaches LLM inference-system engineering on Apple Silicon by building a tiny vLLM + Qwen. Valuable for systems engineers entering the inference-stack domain. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,254 | Modular, scalable LLM application framework in Rust. Represents the growing Rust-for-AI-systems trend alongside Codewhale and qdrant. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,638 | LLM evaluation platform covering 100+ datasets across major model providers. Evaluation tooling is increasingly critical as model choice proliferates. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter) | Python | 0 (+1,826) | Claude Code skill bundle for bug hunting and red-team work with 84 skills and 681 disclosed-report patterns. Today's #1 gainer — agents entering offensive security is a notable verticalization signal. |
| [obra/superpowers](https://github.com/obra/superpowers) | Shell | 0 (+1,003) | An agentic skills framework and software development methodology. +1,003 today shows the "skills framework" abstraction is consolidating beyond single-vendor implementations. |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 265,930 | "The agent that grows with you." Enormous star count reflects Nous Research's position as a leading open agent lab, with self-improving agent framing. |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Python | 114,554 | Gives agents eyes across Twitter, Reddit, YouTube, GitHub, Bilibili, XiaoHongShu via one CLI, zero API fees. Massive adoption signals demand for cheap, unified social/web perception for agents. |
| [zhayujie/CowAgent](https://github.com/zhayujie/CowAgent) | Python | 48,063 | Open-source personal AI assistant with planning, tools, self-evolving memory, multi-model/multi-channel. One-line install lowers the barrier to personal-agent experimentation. |
| [codewhale-hq/Codewhale](https://github.com/codewhale-hq/Codewhale) | Rust | 41,203 | Open-source Rust coding agent for terminal/web/desktop with multi-agent fleets, MCP, sandboxing. Represents the Rust + multi-agent + sandboxing convergence. |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | 38,957 | Frontend stack for agents and generative UI, makers of the AG-UI Protocol. Frontend-agent integration is becoming a distinct layer. |
| [Tracer-Cloud/opensre](https://github.com/Tracer-Cloud/opensre) | Python | 0 (+398) | Open-source agent for CI/CD reliability. Illustrates agents moving into DevOps/SRE operations, a high-value vertical. |
| [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) | TypeScript | 0 (+403) | Agent Skills library for the Stitch MCP server, following the Agent Skills open standard. Google explicitly backing a cross-agent skills standard is strategically significant. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) | HTML | 0 (+802) | Editorial diagram design skill for Claude Code, Codex, Copilot, Cursor, and more — 52 diagram types, self-contained HTML+SVG. +802 today shows design/visual skill bundles are a hot niche. |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | Python | 0 (+703) | Agent skill that researches any topic across Reddit, X, YouTube, HN, Polymarket, and synthesizes a grounded summary. Combines multi-source perception with synthesis — a template for research skills. |
| [mjmirza/app-store-compliance](https://github.com/mjmirza/app-store-compliance) | Shell | 0 (+928) | Open playbook and pre-submission guard for App Store/Google Play, with 124 rejection patterns and 112 tracked deadlines. +928 today shows compliance-as-agent-skill is a validated demand vector. |
| [zhouxiaoka/autoclip](https://github.com/zhouxiaoka/autoclip) | Python | 0 (+980) | Open-source AI video clipping tool turning long podcasts/interviews into short videos with subtitles and covers. +980 today reflects continued appetite for AI content repurposing for short-form platforms. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 84,669 | AI job-search agent that scans boards, scores jobs against your CV, tailors resumes, and preps interviews. Runs locally in Codex/OpenCode or as a Claude Code plugin. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 79,936 | Turns documents or topics into native PowerPoint decks with charts, animations, and narration. Document-to-deliverable agents are proving highly popular. |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 74,390 | LLM-powered multi-market stock analysis with news, dashboards, alerts, zero-cost scheduling. Finance vertical agents continue to accumulate large followings. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 145,533 | Generates HD short videos from a topic/keyword via automated AI workflow. Enduring example of consumer-facing automated content generation. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [jingyaogong/minimind](https://github.com/jingyaogong/minimind) | Python | 70,399 (+727) | Train a 64M LLM from scratch in 2 hours. Appears on both trending and topic search — strong momentum for accessible from-scratch LLM education. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 109,008 | Implement a ChatGPT-like LLM in PyTorch step by step. The canonical educational reference; sustained high stars confirm continued learner influx. |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 169,288 | The model-definition framework for state-of-the-art text, vision, audio, and multimodal models. Remains the foundational library for both inference and training. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 188,028 | Run Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, Gemma and more locally. The listed model roster reflects the recent surge of Chinese and open-weight frontier models. |
| [galilai-group/stable-pretraining](https://github.com/galilai-group/stable-pretraining) | Python | 355 | Minimal, scalable library for pretraining foundation and world models. Small but notable for the "world models" framing — an emerging research direction. |
| [thinkwee/AgentsMeetRL](https://github.com/thinkwee/AgentsMeetRL) | HTML | 1,898 | Awesome list for Agentic RL. Tracks the merging of RL training with agentic behavior, a fast-growing research frontier. |
| [Eigenwise/atomic-agents](https://github.com/Eigenwise/atomic-agents) | Python | 6,347 | Framework for building AI agents "atomically." Composable agent design continues to attract framework experimentation. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) | TypeScript | 209,076 (+991) | Knowledge infrastructure for agents: search, scrape, and access 550+ data providers via one API. Appears on both trending and topic lists — a clear category leader in agent data acquisition. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 119,594 | Persistent cross-session context for every agent — captures, compresses, and reinjects relevant context. Memory-as-a-layer is one of the strongest recurring themes today. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 94,670 | Agent-native database that evolved from a RAG engine into context infrastructure. The "RAG → context infrastructure" repositioning is emblematic of the category's evolution. |
| [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai) | Python | 87,772 | Apache-2.0 web crawler powering a hosted scraping/extraction/search API for agents. Crawling-for-agents remains a high-demand, high-star niche. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 80,791 | Compresses tool outputs, logs, files, and RAG chunks before they reach the LLM — 20% fewer tokens for coding agents, 60-95% for JSON. Token-efficiency tooling is newly prominent. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 69,434 | The Memory Layer for AI Agents — drop-in persistent memory infrastructure for production. Along with claude-mem, confirms memory as a first-class infrastructure layer. |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 153,046 | Turns any codebase with docs, SQL schemas, configs, and PDFs into a queryable knowledge graph — deterministic AST parsing, no vector store. Notable for explicitly rejecting vector stores in favor of graph-based retrieval. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 40,773 | "Vectorless, reasoning-based RAG" document index. Another signal that reasoning-based retrieval is challenging pure vector-similarity RAG. |

---

## 3. Trend Signal Analysis

The most explosive community attention today is directed at **"Agent Skills" as a distribution format**. The top three trending repos — `Claude-BugHunter` (+1,826), `CLI-Anything` (+1,074), and `superpowers` (+1,003) — are all fundamentally about packaging agent capabilities into reusable, composable units rather than building monolithic agents. This is a maturation signal: the ecosystem is moving from "how do I build an agent" to "how do I ship and share agent capabilities," and Google's `stitch-skills` explicitly targeting an "Agent Skills open standard" suggests an imminent standardization battle.

A second, quieter shift is the emergence of **agent context/memory as a consolidated infrastructure category**. Memory (`claude-mem`, `mem0`), context compression (`headroom`), and codebase graphs (`graphify`) all attack the same problem — fitting the right context into a limited window — from different angles. Notably, two projects (`graphify`, `PageIndex`) explicitly market themselves as "vectorless" or "no vector store," indicating a **backlash against naive vector-similarity RAG** in favor of graph- and reasoning-based retrieval.

The stack is also diversifying into **Rust** (Codewhale, rig, qdrant, lancedb) for performance-critical agent and retrieval components. The model landscape reflected in `ollama`'s description — Kimi, GLM, MiniMax, DeepSeek, Qwen — shows open-weight Chinese frontier models now firmly part of the default local-model conversation, and world-models (`stable-pretraining`) and Agentic RL (`AgentsMeetRL`) point to where research attention is rotating next.

---

## 4. Community Hot Spots

- **Agent Skills bundles & standards** — [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills), [obra/superpowers](https://github.com/obra/superpowers), [cursor/plugins](https://github.com/cursor/plugins): watch for who defines the winning cross-agent skill format; betting on the standard early has outsized leverage.
- **Agent memory & context layers** — [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem), [mem0ai/mem0](https://github.com/mem0ai/mem0), [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom): persistent context and token compression are becoming mandatory infrastructure; integration points are still contested.
- **Vectorless / graph-based retrieval** — [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify), [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex), [OpenSPG/KAG](https://github.com/OpenSPG/KAG): a genuine architectural challenge to vector-similarity RAG worth tracking for teams building retrieval systems.
- **Verticalized professional agent skills** — [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter), [mjmirza/app-store-compliance](https://github.com/mjmirza/app-store-compliance), [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops): domain-specific skill packs (security, compliance, careers) are proving that verticalization, not generalization, drives current adoption.
- **Agent data acquisition at scale** — [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl), [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai), [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach): unified, low-cost web/social perception remains one of the highest-demand and most monetizable agent layers.

---

*Note: Star totals are reproduced verbatim from the provided data. Some trending entries list "0" total stars, likely reflecting newly-indexed repositories where only today's delta is reported; these are treated as momentum signals rather than absolute adoption.*

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*