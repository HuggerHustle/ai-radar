# AI Open Source Trends 2026-11-21

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-21 02:06 UTC

---

# AI Open Source Trends Report — 2026-11-21

## 1. Today's Highlights

The dominant theme today is the **"Agent Skills" meta-layer** — reusable skill bundles and harnesses for coding agents (Claude Code, Codex, Cursor, Gemini CLI) rather than new foundation models. **elementalsouls/Claude-BugHunter** exploded with **+1,622 stars today**, a security-focused skill bundle with 82 skills, signaling that community energy is shifting from building agents to arming them. **obra/superpowers** (+890) and **google-labs-code/stitch-skills** (+315) reinforce this: an emergent standard is forming around the "Agent Skills open standard." Meanwhile, **firecrawl/firecrawl** (+1,241) led today's trending among AI-knowledge infrastructure, and **jingyaogong/minimind** (+847) kept small-model training in the spotlight. The RAG ecosystem has decisively rebranded toward **agent memory and context infrastructure** (mem0, OpenViking, claude-mem, LEANN), moving away from pure vector similarity.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [openvinotoolkit/openvino](https://github.com/openvinotoolkit/openvino) | C++ | 0 (+217) | Open-source toolkit for optimizing and deploying AI inference across hardware. Its sustained relevance reflects continued demand for edge/heterogeneous inference optimization. |
| [cursor/plugins](https://github.com/cursor/plugins) | TypeScript | 0 (+299) | Cursor's official plugin specification and plugins. Marks the formalization of a proprietary plugin ecosystem competing with the open Agent Skills standard. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 80,221 | Compresses tool outputs, logs, files and RAG chunks before they reach the LLM — 20% fewer tokens for coding agents, up to 95% for JSON. A direct response to context-window cost pressure in agent loops. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,797 | Teaches LLM inference-system building on Apple Silicon (tiny vLLM + Qwen). Strong pick for systems engineers wanting to understand inference internals. |
| [dg/ai-access](https://github.com/dg/ai-access) | PHP | 68 | A unified PHP library for calling OpenAI, Claude, Gemini, DeepSeek and Grok. Notable as evidence that multi-provider abstraction is reaching non-Python server ecosystems. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 265,003 | "The agent that grows with you." A massively starred agent framework from NousResearch, sitting among the highest-starred repositories in the entire dataset. |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 307,877 | Agent-harness performance optimization: skills, instincts, memory, security and research-first development for Claude Code, Codex, Opencode and Cursor. The single highest total-star count in this dataset — a strong momentum signal for harness tuning. |
| [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter) | Python | 0 (+1,622) | Claude Code skill bundle for bug hunting and red-team work: 82 skills, 15 slash commands, 681 disclosed-report patterns across 24 vulnerability classes. **Today's #1 gainer** — security automation via agent skills is clearly resonating. |
| [obra/superpowers](https://github.com/obra/superpowers) | Shell | 0 (+890) | An agentic skills framework and software development methodology. Codifies how agents should work, not just what they should do. |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | Python | 0 (+681) | Agent skill that researches any topic across Reddit, X, YouTube, HN, Polymarket and the web, then synthesizes a grounded summary. Compact example of the "skill as product" pattern. |
| [HKUDS/nanobot](https://github.com/HKUDS/nanobot) | Python | 50,237 | A lightweight open-source personal agent. HKUDS continues to ship popular agent tooling at high velocity. |
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | Python | 121,623 | Open-source library for AI browser agents plus a hosted cloud. Remains the reference implementation for web-acting agents. |
| [trycua/cua](https://github.com/trycua/cua) | Rust | 32,718 | Open-source drivers, cross-OS sandboxes and benchmarks for computer-use agents. Points toward the next frontier after browser agents: full desktop control. |
| [Tracer-Cloud/opensre](https://github.com/Tracer-Cloud/opensre) | Python | 0 (+466) | The open-source agent for CI/CD reliability. Vertical application of agents to SRE workflows. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 144,840 | Generates HD short videos from a topic or keyword via an automated AI workflow. A perennial application-layer favorite for content automation. |
| [zhouxiaoka/autoclip](https://github.com/zhouxiaoka/autoclip) | Python | 0 (+979) | Open-source AI video clipping & content repurposing desktop tool: turns podcasts, interviews and courses into shorts with subtitles, covers and publish copy for Douyin, Xiaohongshu, TikTok, Reels and Shorts. **Today's #2 gainer** — short-form video repurposing is a hot, monetizable niche. |
| [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | Python | 123,300 | Multi-agent LLM financial trading framework. Vertical agent frameworks for finance keep attracting large audiences. |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 73,571 | LLM-powered multi-market stock analysis with multi-source data, news, dashboards and cost-free scheduled runs. Another strong signal in the AI-finance vertical. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 83,968 | Open-source AI job search agent that scans boards, scores jobs against your CV, tailors resumes and preps applications locally. Practical, high-utility agent application. |
| [mjmirza/app-store-compliance](https://github.com/mjmirza/app-store-compliance) | Shell | 0 (+869) | Open playbook and pre-submission guard with 117 documented rejection patterns, plus tracked EU AI Act/DSA/COPPA deadlines and a skill for AI coding agents. Compliance-as-skill is a novel twist. |
| [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) | HTML | 0 (+636) | Editorial diagram design for multiple coding agents: 45 diagram types, self-contained HTML + SVG. Niche but energetic agent-skill product. |
| [toeverything/AFFiNE](https://github.com/toeverything/AFFiNE) | TypeScript | 0 (+676) | Next-gen knowledge base blending docs and whiteboards, privacy-first and open-source. Positioned as an AI-era Notion/Miro alternative. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [jingyaogong/minimind](https://github.com/jingyaogong/minimind) | Python | 67,705 (+847) | Train your own 64M-parameter LLM from scratch in 2 hours. **Among today's top gainers** and one of the best on-ramps to LLM training fundamentals. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 187,768 | Local model runner supporting Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, Gemma and more. Remains the default local-LLM entry point. |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 169,331 | The model-definition framework for state-of-the-art text, vision, audio and multimodal models. Still the ecosystem's bedrock. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 108,719 | Implements a ChatGPT-like LLM in PyTorch step by step. The definitive educational companion to minimind's hands-on training ethos. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,205 | Build modular, scalable LLM applications in Rust. Rust's LLM-app layer keeps maturing. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,609 | LLM evaluation platform covering OpenAI, Anthropic, Gemini, Qwen, GLM, DeepSeek across 100+ datasets. Evaluation infrastructure is gaining weight as model choice multiplies. |
| [thinkwee/AgentsMeetRL](https://github.com/thinkwee/AgentsMeetRL) | HTML | 1,887 | Awesome list for Agentic RL. Early signal that RL-for-agents is becoming a named research direction. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [open-webui/open-webui](https://github.com/open-webui/open-webui) | Svelte | 159,174 | User-friendly AI interface supporting Ollama, OpenAI API and more. The most-starred project in the RAG topic set. |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 151,200 | Turns any codebase (plus docs, SQL schemas, configs, PDFs) into a queryable knowledge graph via a `/graphify` skill — local deterministic AST parsing, every edge explained, **no vector store**. A notable anti-vector-store stance. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 118,659 | Persistent context across sessions for every agent — captures agent activity, compresses it with AI, injects relevant context back. Cross-tool memory is becoming table stakes. |
| [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai) | Python | 87,607 | Apache-2.0 web crawler powering a hosted scraping/extraction/search API for AI agents (free tier, 1,000 credits/month). The crawling substrate of the agent web. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | 42,543 | Self-evolving context database unifying agent memory, knowledge RAG and skills. A cloud-vendor entry into agent memory. |
| [StarTrail-org/LEANN](https://github.com/StarTrail-org/LEANN) | Python | 13,806 | MLsys2026 Best Paper implementation: 97% storage savings for private on-device RAG. Strong efficiency story for personal-device RAG. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 40,512 | Document index for **vectorless, reasoning-based RAG**. Part of the same "beyond vector similarity" wave as graphify and KAG. |
| [milvus-io/milvus](https://github.com/milvus-io/milvus) | Go | 46,708 | High-performance, cloud-native vector database for scalable ANN search. The established incumbent still posting strong numbers. |

---

## 3. Trend Signal Analysis

The clearest explosive signal today is the **"Agent Skills" ecosystem**. Three of the top five trending repositories — Claude-BugHunter (+1,622), superpowers (+890) and stitch-skills (+315) — are skill bundles or harnesses rather than models or apps. Community attention has moved up the stack: from *building* agents to *equipping and governing* them. The simultaneous appearance of `cursor/plugins` (a proprietary spec) and `google-labs-code/stitch-skills` (citing an "Agent Skills open standard") suggests an impending standards contest over how agent capabilities are packaged and shared.

A second signal is the **de-vectorization of retrieval**. `Graphify-Labs/graphify` explicitly markets "no vector store," `VectifyAI/PageIndex` pitches "vectorless, reasoning-based RAG," and `OpenSPG/KAG` frames itself as overcoming "traditional RAG vector similarity." Combined with memory-layer projects like `mem0`, `cognee`, `claude-mem` and `OpenViking`, the RAG narrative is being rewritten as **agent memory and context infrastructure** — persistent, compressible, graph-structured — rather than embedding lookup.

Third, **efficiency and cost control** — headroom's token compression, caveman's "why use many token," LEANN's 97% storage savings — reflect agents running long loops and the resulting token/storage bills. Fourth, vertical applications are diversifying fast: AI finance (TradingAgents, daily_stock_analysis, Vibe-Trading), AI video repurposing (autoclip, MoneyPrinterTurbo, ppt-master), and compliance (app-store-compliance). Notably, `openvino` and `tiny-llm` underscore that inference optimization and systems-level LLM education remain durable niches even as hype concentrates on agents.

---

## 4. Community Hot Spots

- **Agent Skills bundles build a moat** — [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter) (+1,622) and [obra/superpowers](https://github.com/obra/superpowers) (+890): watch this pattern become the standard distribution unit for agent capabilities. Developers should learn the emerging skill spec before it fragments.
- **Agent memory & context infrastructure** — [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem), [volcengine/OpenViking](https://github.com/volcengine/OpenViking), [mem0ai/mem0](https://github.com/mem0ai/mem0): persistence across sessions is becoming the differentiator that separates demos from production agents.
- **Vectorless / reasoning-based RAG** — [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) and [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex): a genuine architectural alternative to embedding search that's worth benchmarking against your current stack.
- **AI video repurposing to vertical shorts** — [zhouxiaoka/autoclip](https://github.com/zhouxiaoka/autoclip) (+979): short-form clipping into Douyin/TikTok/Reels is a monetizable, fast-moving application layer with clear product-market pull.
- **Small-model / from-scratch training education** — [jingyaogong/minimind](https://github.com/jingyaogong/minimind) (+847) and [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm): with frontier models closed, hands-on small-model and inference-system skills are becoming the most transferable engineering knowledge.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*