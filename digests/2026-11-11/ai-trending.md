# AI Open Source Trends 2026-11-11

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-11 01:11 UTC

---

# AI Open Source Trends Report — 2026-11-11

## 1. Today's Highlights

Today's GitHub AI ecosystem is dominated by **agent skills and agent harnesses** — three of the top four trending repos (anthropics/skills, addyosmani/agent-skills, mattpocock/skills) are skill libraries for coding agents, signaling that "skills as reusable artifacts" has become a first-class developer primitive. Meta's **astryx** design system explicitly ships "agent ready," showing major vendors designing human+agent interfaces from the ground up. A strong **context/memory compression wave** is visible (billion-context, headroom, caveman, claude-mem, LEANN), all competing to cut token costs by 60–97%. Meanwhile, **Home Assistant MCP** and **agent-browser** show agents escaping the terminal into home automation and browser control. The vector DB space also sees a notable "vectorless/self-evolving context" challenger theme (PageIndex, OpenViking, cognee).

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [anthropics/skills](https://github.com/anthropics/skills) | Python | (+1,679 today) | Anthropic's public repository of Agent Skills — reusable capability packages for Claude-style agents. Trending #2 today, it legitimizes "skills" as a distributable format and is likely to become a de-facto standard. |
| [meta/astryx](https://github.com/meta/astryx) | TypeScript | (+3,108 today) | An open source, fully customizable design system built to be "agent ready." Today's #1 trending repo overall, it signals Meta betting that agent-facing UI primitives will be as important as human-facing ones. |
| [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | Rust | (+780 today) | A browser automation CLI purpose-built for AI agents. Vercel Labs entering agent tooling with Rust suggests performance-focused infrastructure is where the platform players are converging next. |
| [homeassistant-ai/ha-mcp](https://github.com/homeassistant-ai/ha-mcp) | Python | (+790 today) | Configure and automate Home Assistant using Claude, ChatGPT, and other assistants via MCP. A clear example of MCP escaping dev tooling into consumer IoT, with strong same-day traction. |
| [google-deepmind/mujoco](https://github.com/google-deepmind/mujoco) | C++ | (+456 today) | DeepMind's general-purpose physics simulator for multi-joint dynamics with contact. Steady re-emergence on trending reflects continued embodied-AI/robotics momentum. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,111 | Build modular and scalable LLM applications in Rust. A key data point for the Rust-LLM stack maturing alongside Python incumbents. |
| [Picovoice/picollm](https://github.com/Picovoice/picollm) | Python | 319 | On-device LLM inference powered by X-Bit quantization. Small but notable for the edge-inference niche. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 262,456 | "The agent that grows with you." The highest-starred repo in the agent topic today; NousResearch's move from models into a flagship agent framework is a major ecosystem signal. |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Python | 110,916 | Gives agents "eyes" to read/search Twitter, Reddit, YouTube, GitHub, Bilibili, and XiaoHongShu via one CLI with zero API fees. Data-access tooling for agents remains a massive pain point, hence the traction. |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 300,823 | Agent harness performance optimization system covering skills, instincts, memory, and security for Claude Code, Codex, OpenCode, and Cursor. The star count underscores how much developers will pay (in attention) for cross-harness optimization. |
| [HKUDS/nanobot](https://github.com/HKUDS/nanobot) | Python | 49,998 | A lightweight open-source personal agent. HKUDS continues to ship multiple agent-adjacent hits in parallel. |
| [zhayujie/CowAgent](https://github.com/zhayujie/CowAgent) | Python | 47,873 | Open-source personal AI assistant and agent harness with planning, tools, skills, and self-evolving memory; multi-agent, multi-model, multi-channel, one-line install. |
| [codewhale-hq/Codewhale](https://github.com/codewhale-hq/Codewhale) | Rust | 41,175 | Open-source terminal agent in Rust, provider-agnostic. Another entry in the fast-growing Rust terminal-agent cohort. |
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | Python | 120,611 | Open-source Python library for AI browser agents, plus a hosted cloud with stealth browsers. Remains the reference implementation for web-operating agents. |
| [juliusbrussee/caveman](https://github.com/JuliusBrussee/caveman) | Go | 118,898 | A viral skill/proxy for coding agents that cuts ~65% of tokens by "talking like a caveman." A meme-shaped project with a serious cost-optimization thesis. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 141,988 | Generates HD short videos from a topic or keyword via an automated AI workflow. Persistent top-tier traction shows consumer content generation remains the biggest AI app category by volume. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 75,647 | Turns documents or topics into native PowerPoint decks with real shapes, transitions, charts, and audio narration. "Office-artifact generation" is a durable vertical. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 81,754 | AI job-search agent that scans boards, scores jobs 1–5 against your CV, and tailors resumes/cover letters (human still clicks Submit). A strong example of the "agent does the labor, human keeps the decision" design pattern. |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 69,562 | LLM-powered multi-market stock analysis with dashboards, real-time news, and cost-free scheduled runs. |
| [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | Python | 38,007 | A personal trading agent. Finance-vertical agents are clearly a growth cluster today (with daily_stock_analysis above). |
| [HKUDS/DeepTutor](https://github.com/HKUDS/DeepTutor) | Python | 58,003 | Lifelong personalized tutoring agent. Education is emerging as a high-signal vertical for persistent-memory agents. |
| [paperclipai/paperclip](https://github.com/paperclipai/paperclip) | TypeScript | 112,955 | "The open-source app everyone uses to manage agents at work." Agent management/ops tooling is becoming its own application layer. |
| [mattpocock/skills](https://github.com/mattpocock/skills) | Shell | (+1,225 today) | "Skills for Real Engineers," extracted directly from the author's `.agents` directory. High same-day stars despite being "just" a skills folder — proof that curated agent know-how is now a product. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 186,579 | Local model runner supporting Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, Gemma, and more. Continues to be the default on-ramp for local inference. |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 168,753 | The model-definition framework for state-of-the-art text, vision, audio, and multimodal models. Unchanged in role, still the bedrock. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,583 | LLM evaluation platform covering OpenAI, Anthropic, Gemini, Qwen, GLM, DeepSeek, and 100+ datasets. Evaluation is the quiet bottleneck as model count explodes. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,712 | Learn LLM inference systems on Apple Silicon by building a tiny vLLM + Qwen. Excellent systems-engineering learning resource for a scarce skill. |
| [genieincodebottle/generative-ai](https://github.com/genieincodebottle/generative-ai) | Jupyter Notebook | 2,668 | Comprehensive Generative AI roadmap, projects, and interview prep. |
| [thinkwee/AgentsMeetRL](https://github.com/thinkwee/AgentsMeetRL) | HTML | 1,878 | Awesome list for Agentic RL. Tracks the research direction that is starting to shape next-gen agent training. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 108,202 | Implement a ChatGPT-like LLM in PyTorch step by step. Remains the canonical from-scratch learning path. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) | TypeScript | 200,544 | Web data layer for AI agents — scrape, extract, and search. One of the highest-starred AI infra repos overall; "agent-grade web data" is now a platform category. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 115,838 | Persistent cross-session context for every agent; captures, compresses, and re-injects relevant memory. Works across Claude Code, Codex, Gemini, Hermes, Copilot, and more. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 93,974 | RAG engine that has grown into "agent-native" context/database infrastructure. Illustrates the RAG→context-infrastructure pivot across the whole category. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 79,318 | Compresses tool outputs, logs, files, and RAG chunks before they hit the LLM — 20% fewer tokens for coding agents, 60–95% for JSON. Token-economics infra with a clean measurable pitch. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 68,772 | Drop-in memory layer for AI agents and apps. Still the reference "memory-as-a-service" library. |
| [StarTrail-org/LEANN](https://github.com/StarTrail-org/LEANN) | Python | 13,789 | MLSys 2026 Best Paper: 97% storage savings for private on-device RAG. The most research-credentialed entrant in the compression/private-RAG wave. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 40,351 | Vectorless, reasoning-based document index for RAG. A genuinely contrarian direction worth watching against embedding-first designs. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | 41,962 | Self-evolving context database unifying agent memory, knowledge RAG, and skills. ByteDance/Volcengine entering the context-infrastructure layer is a notable competitive signal. |

---

## 3. Trend Signal Analysis

**The dominant signal today is that "agent skills" have become a packaging format, not a feature.** Three of the four fastest-rising trending repos (anthropics/skills, addyosmani/agent-skills, mattpocock/skills) are effectively curated folders of markdown/scripts — yet they are pulling thousands of stars per day. The community has concluded that an agent's *knowledge of how to do things* is a separable, shareable asset, and ecosystem players (Anthropic publicly, Vercel and others via tooling) are racing to define the container.

**The second signal is a full-blown token-economics wave.** billion-context, headroom, caveman, claude-mem, and LEANN all attack the same problem from different angles — compression, memory persistence, retrieval efficiency — with quantified claims (5× token savings, 65% cut, 97% storage savings, 60–95% on JSON). This is not coincidence: it reflects enterprises moving agents from demos into month-long production sessions where context windows and per-token costs are the binding constraint.

**New stacks appearing:** Rust agent infrastructure is now a real cohort rather than a curiosity (Codewhale, agent-browser, qdrant, lancedb, meilisearch), and MCP has visibly escaped developer tooling into consumer domains via ha-mcp's Home Assistant integration. On the retrieval side, "vectorless" and "self-evolving context database" framings (PageIndex, OpenViking) are the first serious challengers to the embedding-first orthodoxy in years.

**Industry context:** The skill-library explosion maps directly onto recent Claude Code / Codex / OpenCode harness competition — each harness now needs a skills ecosystem to be taken seriously, and skills repos are harness-agnostic by design. Meanwhile the volume of finance-vertical agents (Vibe-Trading, daily_stock_analysis, OpenBB) and tutoring agents (DeepTutor) suggests teams are moving past generic assistants toward vertical, memory-heavy applications.

---

## 4. Community Hot Spots

- **[anthropics/skills](https://github.com/anthropics/skills) + [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) + [mattpocock/skills](https://github.com/mattpocock/skills)** — The skills format is being standardized in real time. If you maintain a coding-agent workflow, publishing it as a skill is currently the highest-leverage distribution channel available.

- **[headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) & [StarTrail-org/LEANN](https://github.com/StarTrail-org/LEANN)** — Token compression with measurable, published numbers (20–95% reductions) and a best-paper backing respectively. These are the projects most likely to be adopted as defaults inside existing agent stacks rather than as standalone tools.

- **[vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) & [homeassistant-ai/ha-mcp](https://github.com/homeassistant-ai/ha-mcp)** — Agents are expanding beyond the terminal into browsers and physical-home control via MCP. Watch for MCP becoming the universal "agent-to-real-world" adapter layer.

- **[VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) & [volcengine/OpenViking](https://github.com/volcengine/OpenViking)** — The first credible alternatives to embedding-first RAG (vectorless reasoning-based indexing, unified self-evolving context). Worth prototyping against now while the category is still unsettled.

- **[thinkwee/AgentsMeetRL](https://github.com/thinkwee/AgentsMeetRL) & [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)** — Agentic RL is moving from paper lists into product framing ("an agent that grows with you"). This is the research-to-product pipeline to track for the next 6–12 months.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*