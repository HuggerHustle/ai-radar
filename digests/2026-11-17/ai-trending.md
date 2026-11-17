# AI Open Source Trends 2026-11-17

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-17 03:41 UTC

---

# AI Open Source Trends Report — 2026-11-17

---

## 1. Today's Highlights

Today's AI open-source landscape is dominated by the **"Agent Skills" ecosystem**: a striking cluster of skill bundles, evaluators, and skill libraries (Claude-BugHunter, NVIDIA SkillEvaluator, google-labs-code/stitch-skills, ffmpeg-skill, last30days-skill) signals that the community is standardizing how capabilities are packaged, shared, and quality-gated for coding agents. Second, **agent-facing infrastructure** is booming — AG-UI's protocol for frontend-agent interaction (+791 stars) and ChromeDevTools MCP (+841) show agents are being wired into browsers, IDEs, and UIs as first-class citizens. Third, **context/memory compression** is emerging as its own discipline, with headroom, caveman, and claude-mem all attacking token bloat. Finally, Alibaba's open-code-review (+951) demonstrates enterprise-grade hybrid (deterministic + LLM) tooling going open source at scale.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui) | TypeScript | 0 (+791) | The Agent-User Interaction Protocol for bringing agents into frontend applications. Its +791 daily surge and adoption by CopilotKit signal it is becoming the de-facto standard for agent-frontend wiring. |
| [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | TypeScript | 0 (+841) | Chrome DevTools exposed as an MCP server for coding agents. First-party Google backing gives this unusual credibility for agentic browser debugging. |
| [NVIDIA/SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator) | Python | 0 (+873) | Multi-tier framework for evaluating AI agent skills and plugins with quality gates and semantic overlap detection. Fills a critical gap as the skills ecosystem explodes without quality standards. |
| [alibaba/open-code-review](https://github.com/alibaba/open-code-review) | Go | 0 (+951) | Battle-tested hybrid code review tool combining deterministic pipelines with LLM agents, with built-in multi-language security rules. Enterprise-scale validation makes it a strong OSS entry. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 79,860 | Compresses tool outputs, logs, and RAG chunks before they reach the LLM — 60-95% token reduction on JSON. Directly targets the cost crisis in agentic workflows. |
| [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | Go | 120,790 | A viral proxy/skill that cuts 65% of coding-agent tokens by "talking like a caveman." Meme packaging masks a serious prompt-compression technique. |
| [Picovoice/picollm](https://github.com/Picovoice/picollm) | Python | 320 | On-device LLM inference via X-bit quantization. Small but notable for pushing private, edge inference forward. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter) | Python | 0 (+1,094) | A Claude Code skill bundle for bug hunting with 82 skills and 681 disclosed-report patterns. Today's biggest agent-skill launch by daily stars. |
| [backnotprop/plannotator](https://github.com/backnotprop/plannotator) | TypeScript | 0 (+696) | A workspace for shaping, reviewing, and feeding feedback to agents in one click. Addresses the human-in-the-loop bottleneck in agentic coding. |
| [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) | TypeScript | 0 (+529) | Library of Agent Skills built on the open Agent Skills standard, compatible with Antigravity, Gemini CLI, Claude Code, and Cursor. Google's endorsement of cross-agent skill portability is significant. |
| [kajisho5/ffmpeg-skill](https://github.com/kajisho5/ffmpeg-skill) | Python | 0 (+367) | Local video editor exposing 42 FFmpeg tools via MCP for coding agents. A clean template for wrapping CLI tools as agent skills. |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | Python | 0 (+135) | Agent skill that researches topics across Reddit, X, YouTube, HN, and Polymarket. Demonstrates multi-source grounding as a reusable skill. |
| [tradermonty/claude-trading-skills](https://github.com/tradermonty/claude-trading-skills) | Python | 0 (+837) | Claude Code skills for equity investors — market analysis, charting, screeners, strategy dev. Vertical skill bundles are proving a fast route to adoption. |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | 38,748 | Frontend stack for agents and generative UI; makers of the AG-UI Protocol. Benefits directly from today's AG-UI momentum. |
| [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) | TypeScript | 39,225 | Coding agent with the IDE wired in, by Stencil Labs. Representative of the crowded but still-growing terminal/IDE agent race. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [dream-num/univer](https://github.com/dream-num/univer) | TypeScript | 0 (+1,828) | Office SDK for building AI-native document/spreadsheet products for humans and agents. Today's single largest daily gainer (+1,828) — AI office tooling is white-hot. |
| [google-research/paper-orchestra](https://github.com/google-research/paper-orchestra) | Python | 0 (+313) | Multi-agent framework for automated AI research paper writing. Google Research's entry into autonomous research agents. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 83,137 | Open-source AI job search agent that scans boards, scores fit, and tailors resumes. Runs locally in Codex/OpenCode or as a Claude Code plugin. |
| [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | Python | 38,392 | A personal trading agent from HKUDS. Part of a visible wave of finance-vertical agents. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 144,048 | One-click HD short-video generation from a topic via automated AI workflow. Sustained high star count shows content-automation demand persists. |
| [openbq-org/OpenBB](https://github.com/openbq-org/OpenBB) | Python | 75,479 | Open data platform for analysts, quants, and AI agents. Bridges financial data and agent workflows. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 187,283 | Local model runner now supporting Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, and Gemma. Remains the default on-ramp for local LLMs. |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 169,089 | The model-definition framework for text, vision, audio, and multimodal models. Still the canonical training/inference library. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,747 | Build a tiny vLLM + Qwen on Apple Silicon, aimed at systems engineers. A rare, high-quality inference-systems learning resource. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,163 | Build modular, scalable LLM applications in Rust. Rust's LLM tooling matures further. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,597 | LLM evaluation platform covering 100+ datasets across knowledge, reasoning, coding, and safety. Evaluation remains a durable need. |
| [Eigenwise/atomic-agents](https://github.com/Eigenwise/atomic-agents) | Python | 6,335 | Building AI agents "atomically" — composable, testable primitives. Interesting counterpoint to monolithic agent frameworks. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [open-webui/open-webui](https://github.com/open-webui/open-webui) | Svelte | 158,869 | User-friendly AI interface supporting Ollama and OpenAI APIs. Still the dominant self-hosted frontend. |
| [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | Python | 149,726 | The agent engineering platform. Repositioning from chains to agents reflects the market shift. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 94,273 | RAG engine evolving into "agent-native" context infrastructure. Signals RAG merging into agent memory. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 117,742 | Persistent cross-session context that captures, compresses, and reinjects agent activity. Memory is becoming a standalone product category. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 69,087 | Drop-in memory layer for AI agents, built for production. The reference implementation for agent memory. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 40,452 | Document index for "vectorless," reasoning-based RAG. A notable challenge to the default vector-store paradigm. |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 149,110 | Turns codebases and docs into queryable knowledge graphs with no vector store. Knowledge-graph RAG gains a strong contender. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | 42,323 | Self-evolving context database unifying agent memory, RAG, and skills. ByteDance's volcengine entering the context-infra race. |

---

## 3. Trend Signal Analysis

The clearest signal today is the **industrialization of "Agent Skills."** Nearly a third of trending repos are skill bundles, skill libraries, or skill evaluators. The community has moved past asking *whether* agents work and is now building the packaging, distribution, and QA layers around them. NVIDIA's SkillEvaluator and Google's stitch-skills are especially telling: when a GPU giant and a hyperscaler both ship skill infrastructure on the same day, a standard is forming. The Agent Skills open standard and MCP are converging into the agent equivalent of npm + CI.

A second signal is **token economics as a first-class engineering concern.** caveman (65% token cuts), headroom (60-95% on JSON), and claude-mem all attack context bloat from different angles — compression, memory, and retrieval. This directly reflects the industry's shift toward long-running, tool-heavy agents where context windows and costs are the binding constraint.

Third, **RAG is being absorbed into agent memory.** ragflow's rebrand as "agent-native context infrastructure," plus mem0, OpenViking, and claude-mem, show retrieval and memory merging into a single "context layer." Vectorless approaches (PageIndex, graphify) are also gaining traction, suggesting the default vector-store assumption is being questioned.

Finally, the day's biggest gainer — univer (+1,828) — is an AI office SDK, echoing the productivity-app gold rush. Enterprise-grade OSS (Alibaba's code review) and vertical agents (trading, job search) round out a day defined by **agent infrastructure maturing into platforms.**

---

## 4. Community Hot Spots

- **[ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui)** — The Agent-User Interaction Protocol is becoming the frontend standard for agents. With CopilotKit behind it and +791 daily stars, it's the highest-leverage integration point for agent builders today.

- **[NVIDIA/SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator) & [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills)** — Skill quality and portability are the new battleground. If you're shipping skills, align with the open standard and evaluation tooling now before fragmentation sets in.

- **[headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) & [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)** — Token compression is a rare area with immediate, measurable ROI. Both are worth benchmarking against your agent's context pipeline.

- **[VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) & [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify)** — Vectorless/reasoning-based retrieval is a genuine paradigm challenger. Worth watching if you're dissatisfied with vector-store recall and cost.

- **[alibaba/open-code-review](https://github.com/alibaba/open-code-review)** — Enterprise-scale hybrid (deterministic + LLM) tooling with security rules built in. A strong reference architecture for anyone building production code-review agents.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*