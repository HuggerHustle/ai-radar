# AI Open Source Trends 2026-11-20

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-20 02:14 UTC

---

# AI Open Source Trends Report — 2026-11-20

## 1. Today's Highlights

Today's GitHub AI landscape is overwhelmingly dominated by **agent skills and harnesses** — a striking cluster of repos (Claude-BugHunter, superpowers, stitch-skills, last30days-skill, diagram-design, app-store-compliance) are all "skill bundles" that plug into coding agents like Claude Code, Cursor, and Codex, signaling that the ecosystem is maturing from *building agents* to *equipping* them. A second powerful wave is **token/memory economy**: caveman, headroom, and claude-mem all attack the same problem — shrinking context and tool output to cut cost while preserving recoverability. The top of the topic charts is still held by mega-incumbents (ECC, hermes-agent, firecrawl, AutoGPT), but today's new stars (+1,349, +2,028, +954) show grassroots skill packs outpacing them in velocity. Notably, **CLI-Anything** and **graphify** both push "make everything agent-native / queryable," hinting that agents are becoming the new primary interface layer to software.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) | TypeScript | 204,302 (+825) | Knowledge infrastructure giving agents search, scrape, and access to 550+ data providers through one API. Its presence on both the trending list and the llm topic shows it's become default agent plumbing. |
| [openvinotoolkit/openvino](https://github.com/openvinotoolkit/openvino) | C++ | (+246 today) | Open-source toolkit for optimizing and deploying AI inference across hardware. Steady daily traction reflects continued enterprise demand for edge/CPU inference. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 187,675 | Get up and running locally with Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, Gemma and more. Remains the de facto local model runtime. |
| [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | Go | 121,580 | Skill + local proxy that shortens answers and tool output for coding agents while keeping every original recoverable. A sharp signal that token-cost optimization is now a first-class dev-tool category. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 80,174 | Compresses tool outputs, logs, files, and RAG chunks before they hit the LLM — 20% fewer tokens for coding agents, up to 95% for JSON. Ships as library, proxy, and MCP server. |
| [cursor/plugins](https://github.com/cursor/plugins) | TypeScript | (+384 today) | Cursor's plugin specification and official plugins. Marks Cursor formalizing an extensibility surface, mirroring the agent-skills standard wars. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,789 | Teaches systems engineers to build a tiny vLLM + Qwen inference stack on Apple Silicon. High-value educational infra for the inference-engineering talent pipeline. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 307,319 | Agent harness performance optimization system spanning skills, instincts, memory, security, and research-first development for Claude Code, Codex, Opencode, Cursor and beyond. Tops the llm topic by raw stars. |
| [obra/superpowers](https://github.com/obra/superpowers) | Shell | (+2,028 today) | An agentic skills framework and software development methodology. Today's single biggest gainer — a strong signal that "skills frameworks" are the hottest new agent primitive. |
| [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter) | Python | (+1,349 today) | Claude Code skill bundle for bug hunting and red-team work: 82 skills, 15 slash commands, 681 disclosed-report patterns. Security-focused agent skills arriving fast, with +1,349 stars in a day. |
| [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) | Python | (+898 today) | "Making ALL Software Agent-Native" — a hub to expose any CLI as an agent-callable tool. Aims to be the universal bridge between agents and existing software. |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | Python | (+954 today) | Agent skill that researches any topic across Reddit, X, YouTube, HN, Polymarket, and the web, then synthesizes a grounded summary. Shows vertical, single-purpose skills hitting mainstream traction. |
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | Python | 121,529 | Open-source Python library for AI browser agents, plus hosted stealth-browser cloud. The canonical browser-agent library keeps compounding. |
| [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) | Python | 45,164 | Build resilient agents as graphs. Remains the reference orchestration layer for production agent systems. |
| [trycua/cua](https://github.com/trycua/cua) | Rust | 32,687 | Open-source drivers, cross-OS sandboxes, and benchmarks for computer-use agents. Positions "computer-use 2.0" as an infrastructure-grade discipline. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 144,720 | Generates HD short videos from a topic or keyword via an automated AI workflow. A perennial favorite in the AI-content-creation wave. |
| [zhouxiaoka/autoclip](https://github.com/zhouxiaoka/autoclip) | Python | (+126 today) | Open-source AI video clipping tool that turns long podcasts/interviews/courses into short clips with subtitles, covers, and copy for Douyin, TikTok, Reels, YouTube Shorts. Vertical AI content repurposing continues to pull new stars. |
| [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | Python | 123,184 | Multi-agent LLM financial trading framework. One of the largest finance-agent repos, riding the ongoing agentic-finance theme. |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 73,491 | LLM-powered multi-market stock analysis with news, dashboard, and cost-free scheduled runs. Lower-cost, self-hostable finance agents are proliferating. |
| [HKUDS/DeepTutor](https://github.com/HKUDS/DeepTutor) | Python | 60,834 | Lifelong personalized tutoring agent. Education is emerging as a strong agent application vertical. |
| [CherryHQ/cherry-studio](https://github.com/CherryHQ/cherry-studio) | TypeScript | 53,665 | AI workspace unifying models, agents, and productivity tools. A consumer-facing hub competing in the "AI desktop client" space. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 83,804 | Open-source AI job-search agent that scans boards, scores jobs against your CV, and tailors resumes. A vivid example of agents colonizing everyday workflows. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [jingyaogong/minimind](https://github.com/jingyaogong/minimind) | Python | 66,942 (+238) | Train your own 64M LLM from scratch in 2 hours. Appears on both the trending list and llm-model topic — the go-to entry point for hands-on LLM training. |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 169,292 | The model-definition framework for state-of-the-art text, vision, audio, and multimodal models. Still the backbone of the open model ecosystem. |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 264,770 | "The agent that grows with you." Nous Research's continued push into self-improving agent models keeps it near the top of the llm topic. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,604 | LLM evaluation platform covering OpenAI, Anthropic, Gemini, Qwen, GLM, DeepSeek across 100+ datasets. Evaluation rigor matters as the model field widens. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,189 | Build modular, scalable LLM applications in Rust. Reflects Rust's steady advance into the LLM app stack. |
| [thinkwee/AgentsMeetRL](https://github.com/thinkwee/AgentsMeetRL) | HTML | 1,885 | Curated list for Agentic RL. A fresh signal that RL-for-agents is coalescing into its own research area. |
| [thinkwee/AwesomeOPD](https://github.com/thinkwee/AwesomeOPD) | — | 883 | Curated list for On-Policy Distillation. Niche but notable — distillation technique lists appearing suggests training-efficiency focus. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps) | Python | 145,092 | 100+ AI agents, agent skills, and RAG apps, free and open source. A high-traffic discovery hub for the entire RAG/agent app space. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 118,464 | Persistent context across sessions — captures agent activity, compresses it, and re-injects relevant context into future sessions. Cross-agent memory is becoming table stakes. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 94,449 | RAG engine evolved into "context infrastructure" and an agent-native database. A bellwether for RAG reframing itself around agents. |
| [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai) | Python | 87,572 | Open-source crawler powering a hosted scraping/extraction/search API for AI agents. Web-to-context pipelines remain essential RAG feedstock. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 69,253 | Drop-in memory infrastructure for AI agents and apps. One of the most-cited memory layers in production agent stacks. |
| [run-llama/llama_index](https://github.com/run-llama/llama_index) | Python | 52,964 | The document-processing platform for AI. Still a cornerstone of retrieval and indexing workflows. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | 42,484 | Self-evolving context database unifying agent memory, knowledge RAG, and skills. A notable attempt to merge memory + RAG + skills into one store. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 40,492 | "Vectorless, reasoning-based RAG" document index. A contrarian direction worth watching as teams question pure vector search. |

---

## 3. Trend Signal Analysis

The single most explosive category today is **agent skills and harnesses**. The trending list's top three gainers — superpowers (+2,028), Claude-BugHunter (+1,349), and last30days-skill (+954) — are all skill packs, not models or frameworks. This marks a clear maturation: the community has largely settled on Claude Code, Codex, Cursor, and Gemini CLI as host runtimes, and is now competing to *equip* them. ECC's 307K stars and the emergence of cross-agent standards (Google's stitch-skills, Cursor's plugins) suggest a standardization race around the "Agent Skills" open format.

A second emerging direction is the **token and memory economy**. caveman, headroom, and claude-mem attack context bloat from different angles — compression, output shrinking, and persistent memory — while OpenViking and mem0 push unified memory stores. This is new as a first-class tooling category and connects directly to rising inference costs and longer agent sessions. The appearance of Agentic RL and On-Policy Distillation awesome-lists hints the research frontier is shifting from pretraining to *post-training agents efficiently*. Finally, "vectorless RAG" (PageIndex) and "agent-native databases" (ragflow, graphify) signal teams are rethinking retrieval itself. Overall, momentum is flowing from model-building toward the tooling, memory, and skills that make existing frontier models productive.

---

## 4. Community Hot Spots

- **Agent Skills Frameworks** — [obra/superpowers](https://github.com/obra/superpowers), [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills), [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter): the fastest-growing primitive; building a skill pack today is the highest-leverage way to reach agent users.
- **Token/Memory Optimization** — [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman), [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom), [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem): directly cuts inference cost and enables long-horizon agents; likely to become default middleware.
- **Universal Agent Bridges** — [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) and [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify): making arbitrary software and codebases agent-callable; a land-grab for the "agent-native everything" layer.
- **Agentic RL & Post-Training** — [thinkwee/AgentsMeetRL](https://github.com/thinkwee/AgentsMeetRL): early signal that RL-for-agents is becoming a distinct, fundable research direction as scaling shifts to post-training.
- **Self-Hosted Memory/RAG Stacks** — [mem0ai/mem0](https://github.com/mem0ai/mem0), [volcengine/OpenViking](https://github.com/volcengine/OpenViking), [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex): the memory + retrieval layer is consolidating and innovating (vectorless RAG); strong ground for builders targeting privacy-first deployments.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*