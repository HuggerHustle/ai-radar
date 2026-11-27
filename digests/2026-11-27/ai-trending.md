# AI Open Source Trends 2026-11-27

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-27 03:35 UTC

---

# AI Open Source Trends Report — 2026-11-27

## 1. Today's Highlights

Today's trending data is dominated by the **"agent skills" meta-layer**: a surge of reusable skill bundles, plugins, and MCP-compatible extensions targeting Claude Code, Codex, Cursor, and Gemini CLI, signaling that the ecosystem is standardizing around portable agent capabilities rather than monolithic agents. Alongside this, **context/memory infrastructure** (compression, persistent memory, knowledge graphs, vectorless RAG) is maturing rapidly, with projects like `headroom`, `claude-mem`, and `PageIndex` attacking the token-cost and retrieval-quality bottlenecks of production agents. **Small-model accessibility** also stands out, with `minimind` (train a 64M LLM in 2 hours) pulling massive cumulative stars, while **vertical AI applications** (video clipping, trading, job search, CI/CD reliability) proliferate as agents move from demo to domain-specific deployment.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) | TypeScript | 211,049 (+1,046) | Knowledge infrastructure giving agents search, scrape, and access to 550+ data providers via one API. Its dual appearance on both the trending list and the LLM topic search signals it has become default agent web-access plumbing. |
| [openvinotoolkit/openvino](https://github.com/openvinotoolkit/openvino) | C++ | — (+176) | Open-source toolkit for optimizing and deploying AI inference across Intel hardware. Continued daily traction shows edge/inference optimization remains a durable infrastructure concern. |
| [cursor/plugins](https://github.com/cursor/plugins) | TypeScript | — (+270) | Cursor's official plugin specification and reference plugins. Its rise reflects editor vendors formalizing extension standards to compete in the agent-tooling layer. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 188,254 | Local model runner supporting Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, and Gemma. Remains the de facto local-inference entry point as new open-weight models ship. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 80,953 | Compresses tool outputs, logs, files, and RAG chunks before they reach the LLM (20% fewer tokens for coding agents, 60–95% for JSON). Token-cost optimization is emerging as its own infrastructure category. |
| [Mirrowel/LLM-API-Key-Proxy](https://github.com/Mirrowel/LLM-API-Key-Proxy) | Python | 565 | Universal LLM gateway with OpenAI/Anthropic-compatible endpoints, multi-provider translation, and load-balancing. A lightweight signal that multi-provider routing is now table stakes. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [obra/superpowers](https://github.com/obra/superpowers) | Shell | — (+854) | An agentic skills framework and software development methodology. Its high today-stars show developers converging on skills-as-methodology rather than ad-hoc prompting. |
| [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) | Python | — (+746) | "Making ALL Software Agent-Native" via a CLI-Hub for exposing tools to agents. Directly addresses the tool-integration gap that limits real-world agent autonomy. |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 311,370 | Agent harness performance optimization system covering skills, instincts, memory, and security for Claude Code, Codex, Cursor, and beyond. Its enormous star count marks it as a flagship in the harness-optimization wave. |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 266,433 | "The agent that grows with you," a general-purpose personal agent. Top-tier star volume reflects sustained appetite for open personal-agent platforms. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 85,089 | Open-source AI job-search agent that scans boards, scores jobs against your CV, and tailors ATS-friendly applications. A strong example of agents targeting concrete, high-value personal workflows. |
| [Tracer-Cloud/opensre](https://github.com/Tracer-Cloud/opensre) | Python | — (+327) | Open-source agent for CI/CD reliability. Brings agentic automation into SRE/DevOps, a less crowded but high-leverage vertical. |
| [trycua/cua](https://github.com/trycua/cua) | Rust | 33,024 | Open-source drivers, cross-OS sandboxes, and benchmarks for computer-use agents. Computer-use 2.0 infrastructure is a notable new frontier appearing in the data. |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | 39,004 | Frontend stack for agents and generative UI across React, Angular, Mobile, and Slack; makers of the AG-UI Protocol. Signals the emerging "agent frontend" layer. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter) | Python | — (+1,597) | Claude Code skill bundle for bug hunting and red-team work with 85 skills and 681 disclosed-report patterns. Today's #1 trending repo, showing security is a breakout agent-skill vertical. |
| [zhouxiaoka/autoclip](https://github.com/zhouxiaoka/autoclip) | Python | — (+774) | Local-first AI video clipping tool and MCP server, an open-source OpusClip alternative. Zero-subscription, privacy-first vertical AI continues to attract strong daily stars. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 145,880 | Generates HD short videos from a topic or keyword via an automated AI workflow. A long-running proof that AI content-generation apps sustain mass appeal. |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 74,872 | LLM-powered multi-market stock analysis with real-time news and automated notifications, runnable at zero cost. Agentic finance is a recurring, fast-growing application cluster. |
| [HKUDS/DeepTutor](https://github.com/HKUDS/DeepTutor) | Python | 63,419 | Lifelong personalized tutoring system. Demonstrates education as a durable agent-application domain. |
| [open-webui/open-webui](https://github.com/open-webui/open-webui) | Svelte | 159,649 | User-friendly AI interface supporting Ollama and OpenAI APIs. Remains the dominant self-hosted chat front end. |
| [mjmirza/app-store-compliance](https://github.com/mjmirza/app-store-compliance) | Shell | — (+562) | Compliance playbook with 125 rejection patterns and an AI coding-agent skill covering EU AI Act, DSA, and COPPA deadlines. Shows regulatory-compliance skills becoming a distinct app niche. |
| [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) | HTML | — (+955) | Editorial diagram design skill for Claude Code, Codex, Copilot, and Cursor with 52 diagram types. A high-momentum example of design-oriented agent skills. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [jingyaogong/minimind](https://github.com/jingyaogong/minimind) | Python | 71,770 (+702) | Train your own 64M LLM from scratch in 2 hours. Its dual trending/topic presence confirms strong demand for accessible from-scratch training education. |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 169,383 | The model-definition framework for state-of-the-art text, vision, audio, and multimodal models. Still the canonical backbone of the open model ecosystem. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 109,104 | Step-by-step PyTorch implementation of a ChatGPT-like LLM. Continues to anchor the "learn by building" segment. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,814 | Learn LLM inference systems on Apple Silicon by building a tiny vLLM + Qwen. A notable new entry targeting inference-systems engineers rather than model trainers. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,646 | LLM evaluation platform spanning OpenAI, Anthropic, Gemini, Qwen, GLM, and DeepSeek across 100+ datasets. Evaluation rigor is rising in importance as model diversity grows. |
| [galilai-group/stable-pretraining](https://github.com/galilai-group/stable-pretraining) | Python | 354 | Reliable, minimal library for pretraining foundation and world models. A small but pointed signal toward world-model pretraining tooling. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 188,254 | Local runner for Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, and Gemma. Listed here as the primary distribution channel for open-weight models. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 153,896 | Turns any codebase, docs, SQL schemas, and PDFs into a queryable knowledge graph with no vector store. Its explicit "no vector store" stance marks the graph-based RAG countercurrent. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 120,024 | Persistent cross-session context for agents, compressing session activity and re-injecting relevant context. Memory persistence is now a first-class RAG concern. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 94,789 | Agent-native database and RAG engine that evolved into context infrastructure. Reflects RAG engines merging with agent runtime concerns. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 40,798 | Document index for vectorless, reasoning-based RAG. Part of the same anti-vector-store trend as graphify, favoring reasoning over embedding similarity. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 69,518 | Drop-in memory layer for AI agents with persistent production context. A leading commercial-OSS memory primitive. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | 42,886 | Self-evolving context database unifying agent memory, knowledge RAG, and skills. Notable as a major cloud vendor's bid to own the agent-context layer. |
| [milvus-io/milvus](https://github.com/milvus-io/milvus) | Go | 46,748 | High-performance cloud-native vector database for scalable ANN search. Still the reference open vector DB at scale. |
| [topoteretes/cognee](https://github.com/topoteretes/cognee) | Python | 33,657 | Open-source AI memory platform giving agents persistent long-term memory with small models. Highlights the small-model-plus-memory cost strategy. |

---

## 3. Trend Signal Analysis

The clearest explosive signal today is the **agent-skills layer**. Four of the top five trending repos (`Claude-BugHunter`, `superpowers`, `CLI-Anything`, `diagram-design`) are skill bundles or skill frameworks, and topic search adds `stitch-skills`, `last30days-skill`, and `app-store-compliance` — all conforming to a portable "Agent Skills" open standard targeting Claude Code, Codex, Cursor, Gemini CLI, and Antigravity. This is the ecosystem's response to a fragmented tool market: skills, not agents, are becoming the unit of reuse.

A second signal is **context economics**. `headroom` (token compression), `claude-mem` (persistent memory), `caveman` (shorter answers, recoverable originals), and `ponytail` (lazy-senior-dev minimalism) all attack the same problem from different angles — agents waste tokens. Expect this "context efficiency" layer to consolidate quickly.

Third, **vectorless / graph-based RAG** appears as a genuinely new direction: `graphify` (153k stars, explicitly no vector store) and `PageIndex` (reasoning-based retrieval) challenge embedding-similarity orthodoxy, suggesting the community is questioning whether vector DBs are the right default for code and document retrieval.

Finally, **verticalization is accelerating** — bug bounty, video clipping, trading, job search, CI/CD, and compliance all now have dedicated agent tooling, while `minimind` and `tiny-llm` show parallel demand for small-model and inference-systems literacy.

---

## 4. Community Hot Spots

- **[elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter)** — Today's #1 trending repo (+1,597). Security/red-team is the breakout agent-skill vertical, and 681 curated vulnerability patterns give it real depth beyond prompt packs.
- **[obra/superpowers](https://github.com/obra/superpowers) & [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything)** — The skills-framework and tool-integration pair. If skills become the standard unit of agent capability, the frameworks that define and expose them capture the ecosystem's value.
- **[headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom)** — Token compression for agents is an underrated, high-leverage infrastructure bet: 60–95% token reduction on JSON is a direct cost win for production deployments.
- **[Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) & [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex)** — The vectorless-RAG countercurrent. Worth tracking as a potential architectural shift for code and document retrieval.
- **[jingyaogong/minimind](https://github.com/jingyaogong/minimind) & [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm)** — Small-model training and inference-systems education. As agent stacks mature, engineers need systems-level understanding, not just API calls.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*