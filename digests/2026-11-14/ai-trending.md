# AI Open Source Trends 2026-11-14

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-14 01:24 UTC

---

# AI Open Source Trends Report — 2026-11-14

## 1. Today's Highlights

Today's GitHub AI landscape is dominated by *coding agents and agent harnesses*—tools that wrap, secure, or extend LLM-powered development workflows. OpenAI's `codex-security` and Alibaba's `open-code-review` both hit the trending list, signaling that enterprises are now shipping production-grade, LLM-native security and code-review pipelines rather than demos. The agent-infrastructure layer is maturing fast: `ECC` (302k stars), `NousResearch/hermes-agent` (263k stars), and `paperclipai/paperclip` point to a consolidation around "agent management" as its own product category. Meanwhile, context/memory infrastructure (`claude-mem`, `OpenViking`, `cognee`, `PageIndex`) is emerging as the new battleground, with vectorless RAG and persistent agent memory challenging traditional vector-DB assumptions. On the vertical side, finance is the clear breakout domain this week, with at least four stock/trading agent projects trending simultaneously.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [openai/codex-security](https://github.com/openai/codex-security) | TypeScript | 0 (+751) | OpenAI's official Codex Security CLI and TypeScript SDK for finding, validating, and fixing vulnerabilities. Its +751 same-day star spike and first-party provenance make it the most-watched launch on today's list. |
| [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | TypeScript | 0 (+67) | Chrome DevTools exposed as an MCP server so coding agents can inspect and debug live browsers. Signals browser tooling is being rewritten as agent-native infrastructure. |
| [alibaba/open-code-review](https://github.com/alibaba/open-code-review) | Go | 0 (+215) | Hybrid code review tool combining deterministic pipelines with an LLM Agent, battle-tested at Alibaba scale with line-level comments and multi-language security rules. Shows big-tech productionization of LLM review workflows. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 186,900 | Local model runner supporting Kimi, GLM, MiniMax, DeepSeek, Qwen, Gemma and more. Remains the default on-ramp for local inference across the ecosystem. |
| [Picovoice/picollm](https://github.com/Picovoice/picollm) | Python | 319 | On-device LLM inference powered by X-Bit quantization. Notable for pushing edge inference efficiency beyond standard quantization schemes. |
| [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) | TypeScript | 38,968 | A coding agent with the IDE wired in, built by Stencil Labs. Represents the "agent-first IDE" trend where the editor serves the agent, not the reverse. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 302,475 | Agent harness performance optimization system covering skills, instincts, memory, security, and research-first development for Claude Code, Codex, Cursor, and beyond. The single largest starred project in today's dataset, underscoring demand for agent "operating systems." |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 263,225 | "The agent that grows with you," from the team behind the Hermes model family. Vertically integrated model + agent stacks are becoming a competitive pattern. |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Python | 111,577 | Gives agents eyes across Twitter, Reddit, YouTube, GitHub, Bilibili, and XiaoHongShu via one CLI with zero API fees. A striking example of the "agent data-access layer" commoditizing. |
| [zhayujie/CowAgent](https://github.com/zhayujie/CowAgent) | Python | 47,919 | Open-source personal AI assistant and agent harness with multi-agent, multi-model, multi-channel support and self-evolving memory. One-line install and broad channel support make it a strong self-hosted contender. |
| [codewhale-hq/Codewhale](https://github.com/codewhale-hq/Codewhale) | Rust | 41,173 | Open-source terminal coding agent in Rust, model-agnostic, with multi-agent task splitting. Rust + fully-readable source appeals to security-conscious teams. |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | 38,692 | Frontend stack for agents and generative UI across React, Angular, Mobile, and Slack; makers of the AG-UI Protocol. The protocol angle positions it as the "React of agent frontends." |
| [paperclipai/paperclip](https://github.com/paperclipai/paperclip) | TypeScript | 113,709 | Open-source app for managing agents at work. Signals that "agent ops" is consolidating into a distinct product category. |
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | Python | 120,957 | Open-source Python library for AI browser agents plus a hosted cloud offering. Remains the reference implementation for browser automation in agent stacks. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 71,619 (+256) | LLM-powered multi-market stock analysis with multi-source data, real-time news, decision dashboards, and cost-free scheduled runs. Appears in both today's trending and the AI topic search, confirming cross-signal momentum. |
| [HUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | Python | 38,169 | "Your Personal Trading Agent," from the HKU Data Science lab. Part of the finance-agent cluster dominating today's vertical applications. |
| [tradermonty/claude-trading-skills](https://github.com/tradermonty/claude-trading-skills) | Python | 0 (+69) | Claude Code skills for equity investors covering charting, economic calendars, screeners, and strategy development. Shows the "skills" packaging pattern spreading into finance. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 143,308 | Generates HD short videos from a topic or keyword via an automated AI workflow. A perennial favorite illustrating the generative-media app category's staying power. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 76,590 | Turns documents or topics into native PowerPoint decks with shapes, transitions, charts, and narration. Notable for producing true native `.pptx` output rather than flat images. |
| [HKUDS/nanobot](https://github.com/HKUDS/nanobot) | Python | 50,067 | Lightweight open-source personal agent from HKUDS. Continues the lab's strong showing across agent and vertical categories. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 168,951 | The model-definition framework for state-of-the-art text, vision, audio, and multimodal models. Still the substrate most of the ecosystem builds on. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 108,366 | Step-by-step implementation of a ChatGPT-like LLM in PyTorch. Remains the most-recommended educational path into LLM internals. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,734 | Teaches LLM inference systems on Apple Silicon by building a tiny vLLM + Qwen. Notable for targeting systems engineers and Apple hardware specifically. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,142 | Modular, scalable LLM application framework in Rust. Part of the broader Rust-in-AI-tooling push visible across today's list. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,595 | LLM evaluation platform covering 100+ datasets across knowledge, reasoning, coding, science, and safety. Evaluation infra is quietly becoming mission-critical as model counts explode. |
| [FonaTech/Project_Chronos](https://github.com/FonaTech/Project_Chronos) | Python | 207 | Zero-stall MoE inference via lookahead prediction and async DMA prefetching, optimized for SSD I/O. A research-grade signal that MoE serving efficiency is an active frontier. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 116,856 | Persistent cross-session context for agents, compressing session history and re-injecting relevant context. Works across Claude Code, Codex, Gemini, Hermes, and more—an emerging "memory standard." |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 94,130 | RAG engine that has evolved into "agent-native database" and context infrastructure. Reflects RAG's migration from pipeline to platform. |
| [Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps) | Python | 144,585 | 100+ AI agents, agent skills, and RAG apps, all free and open source. A high-signal index of what practitioners are actually building. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | 42,205 | Self-evolving context database unifying agent memory, knowledge RAG, and skills. ByteDance's entry into the memory-infrastructure race. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 40,408 | "Vectorless, reasoning-based RAG" document index. A direct challenge to the assumption that vector stores are required for retrieval. |
| [topoteretes/cognee](https://github.com/topoteretes/cognee) | Python | 33,297 | Open-source AI memory platform giving agents persistent long-term memory via small, free models. Positions smaller models as sufficient for memory tasks. |
| [StarTrail-org/LEANN](https://github.com/StarTrail-org/LEANN) | Python | 13,797 | MLsys 2026 Best Paper implementation delivering 97% storage savings for fully private, on-device RAG. A rare combination of academic recognition and practical utility. |
| [zilliztech/claude-context](https://github.com/zilliztech/claude-context) | TypeScript | 12,691 | Code-search MCP for Claude Code that makes an entire codebase available as context to any coding agent. Directly addresses the "context window as bottleneck" problem. |

---

## 3. Trend Signal Analysis

**Agent harnesses are the breakout category.** The top three most-starred projects in the dataset (`ECC` at 302k, `hermes-agent` at 263k, `firecrawl` at 201k) all sit in the agent infrastructure/harness layer. This is a shift from 2024–2025, when model weights and frameworks dominated. The community is now betting that *how you orchestrate, secure, and give memory to agents* matters more than which model you call.

**Context and memory are the new database wars.** At least six projects today—`claude-mem`, `OpenViking`, `cognee`, `PageIndex`, `LEANN`, `headroom`—attack the problem of what agents remember and how. Crucially, two of them (`PageIndex`, `LEANN`) explicitly position *against* vector databases, suggesting the vector-DB consensus is fracturing into "vectorless" and compression-first approaches. `headroom`'s claim of 60–95% token reduction on JSON is the kind of concrete number that reshapes architectures.

**Rust and Go are gaining in AI tooling.** `Codewhale` (Rust), `rig` (Rust), `qdrant` (Rust), `open-code-review` (Go), `Project_Chronos` (Go), and `ragflow` (Go) all appear. This tracks with the maturation of AI from research (Python) to production (systems languages).

**Finance is the vertical of the week.** `daily_stock_analysis`, `Vibe-Trading`, and `claude-trading-skills` all trended together, with `daily_stock_analysis` appearing in both data sources. The pattern—LLM + market data + scheduled runs—is replicable and clearly resonating with retail and prosumer investors.

**First-party enterprise entries.** OpenAI (`codex-security`) and Alibaba (`open-code-review`, `zvec`) shipping open tools is a notable signal: hyperscalers are using open source as a distribution channel for security and review workflows, not just model weights.

---

## 4. Community Hot Spots

- **Agent memory infrastructure (`claude-mem`, `OpenViking`, `cognee`)** — Persistent, cross-session memory is the single most-requested missing primitive in agent stacks. Projects that solve context compression and re-injection cleanly will define the next layer of the stack; the 116k stars on `claude-mem` alone show demand is already proven.

- **Vectorless RAG (`PageIndex`, `LEANN`)** — Two independent projects now claim reasoning-based or compressed retrieval beats vector search on storage and privacy. Worth close attention: if the MLsys 2026 Best Paper result generalizes, a large slice of the vector-DB market narrative shifts.

- **First-party coding-agent security (`openai/codex-security`, `alibaba/open-code-review`)** — Both OpenAI and Alibaba launched LLM-native security/review tools today. Expect this to become table stakes for enterprise agent adoption, and expect acquisition/consolidation around the space.

- **MCP as the integration standard (`chrome-devtools-mcp`, `claude-context`)** — MCP servers for browsers and code search proliferating suggests MCP is winning the "how agents talk to tools" protocol war. Developers should treat MCP server authoring as a core skill.

- **Finance agent stack (`daily_stock_analysis`, `Vibe-Trading`, `claude-trading-skills`)** — Three finance-focused agents trending simultaneously indicates a vertical ripe for consolidation. The winning pattern appears to be: multi-source data + scheduled zero-cost runs + LLM reasoning + push notifications.

- **Rust-based coding agents (`Codewhale`, `rig`)** — Rust's memory safety and single-binary distribution make it attractive for agents that run with broad system access. Watch for more Rust entrants in the coding-agent and inference-server space.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*