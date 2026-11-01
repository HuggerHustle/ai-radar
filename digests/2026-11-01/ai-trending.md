# AI Open Source Trends 2026-11-01

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-01 00:02 UTC

---

# AI Open Source Trends Report — 2026-11-01

## 1. Today's Highlights

Today's GitHub trending is dominated by the **agent harness and skills layer**: `claude-mem` (+1,723), `skills` (+883), `Claude-Code-Game-Studios` (+742), and `superpowers` (+665) all sit in the top tier, signaling that the community's energy has shifted from building *agents* to building the *scaffolding around agents* — memory, skills, methodology, and coordination. A second strong cluster is **local-first / on-device agent runtimes**, with `Orkas` (+1,044), `lightpanda/browser` (+929), and `OpenMausBot` (+1,303) pushing the "own your AI team" narrative. The emergence of `impeccable` (+1,338) — a Rust tool explicitly marketed as "catching AI slop before it ships" — marks a new quality-assurance niche for the agent era. Notably, several repos in the topic search show unusually high star counts (e.g. `hermes-agent` at 259k, `ECC` at 294k), suggesting either rapid viral growth or data snapshot anomalies worth verifying. Across all categories, **context/memory infrastructure** (RAG, vector DB, compression) remains the deepest and most crowded investment lane.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 107,836 (+1,723) | Persistent cross-session context capture and AI-compressed memory injection for every major agent CLI. Today's #1 star gainer, it embodies the "memory as infrastructure" thesis now sweeping the ecosystem. |
| [lightpanda-io/browser](https://github.com/lightpanda-io/browser) | Zig | 0 (+929) | A headless browser purpose-built for AI and automation, written in Zig for minimal footprint. Its strong debut suggests demand for agent-native web access primitives beyond Playwright/Puppeteer. |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Rust | 0 (+1,338) | A design-quality vocabulary layer for coding agents ("polish", "bolder", "critique", "audit") that catches AI slop before shipping. A novel category — agent output QA — with immediate traction. |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 294,057 | Agent harness performance optimization covering skills, instincts, memory, and security across Claude Code, Codex, Cursor and beyond. Its massive footprint reflects how central harness tuning has become. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 78,474 | Compresses tool outputs, logs, files, and RAG chunks before they reach the LLM (20% fewer tokens for coding agents, 60–95% for JSON). Token economics as a first-class infra concern. |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | 38,436 | The frontend stack for agents and generative UI, spanning React, Angular, Mobile, and Slack; makers of the AG-UI Protocol. Critical for teams shipping agent UX rather than just agent backends. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,030 | Modular, scalable LLM application framework in Rust. Signals the continued Rust-ification of the AI stack for performance-sensitive deployments. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [Orkas-AI/Orkas](https://github.com/Orkas-AI/Orkas) | JavaScript | 0 (+1,044) | Local-first desktop AI team: a Commander orchestrates 16 specialist agents plus external CLIs, with projects, automations, and connectors. Free macOS/Windows app — a strong "personal AI org" pitch. |
| [milind-soni/OpenMausBot](https://github.com/milind-soni/OpenMausBot) | TypeScript | 0 (+1,303) | Open-source Grok Bot alternative giving bots a full virtual machine to operate in. High debut stars reflect appetite for open, VM-based autonomous agents. |
| [Donchitos/Claude-Code-Game-Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) | Shell | 0 (+742) | Turns Claude Code into a full game dev studio: 49 AI agents, 72 workflow skills, and a studio-hierarchy coordination system. A vivid example of vertical multi-agent orchestration. |
| [obra/superpowers](https://github.com/obra/superpowers) | Shell | 0 (+665) | An agentic skills framework and software development methodology. Popularizes the idea that agent effectiveness is a *methodology* problem, not just a model problem. |
| [mattpocock/skills](https://github.com/mattpocock/skills) | Shell | 0 (+883) | A curated `.agents` directory of skills "for real engineers," from a well-known TypeScript educator. Demonstrates that shareable, opinionated skill packs are becoming a distribution format. |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 259,180 | "The agent that grows with you" — a self-improving personal agent from a major open-model lab. Its enormous star count makes it one of the most-watched agent projects in the dataset. |
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | Python | 119,677 | Open-source Python library for AI browser agents, plus a hosted cloud with stealth browsers. Remains the canonical entry point for web-automation agents. |
| [HKUDS/nanobot](https://github.com/HKUDS/nanobot) | Python | 49,705 | Lightweight open-source personal agent from HKUDS. Part of a broader HKUDS cluster (DeepTutor, LightRAG, Vibe-Trading) showing unusually broad agent ambition. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [HKUDS/DeepTutor](https://github.com/HKUDS/DeepTutor) | Python | 52,783 (+1,034) | Lifelong personalized tutoring agent. Combines education vertical depth with the RAG/memory stack — one of the clearest "agent for a real domain" launches today. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 79,068 | Open-source AI job-search agent that scans boards, scores jobs 1–5 vs. your CV, tailors ATS-friendly resumes, and preps interviews. Human-in-the-loop by design ("you press Submit"). |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 136,911 | Generates HD short videos from a topic or keyword via an automated AI workflow. Continued high stars confirm short-form content automation as a durable category. |
| [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | Python | 119,049 | Multi-agent LLM framework for financial trading. Part of a visible finance-agent cluster alongside Vibe-Trading, daily_stock_analysis, and Qlib. |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 67,339 | LLM-powered multi-market stock analysis with news, dashboards, and cost-free scheduled runs. Lowering the barrier to always-on market monitoring. |
| [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | Python | 37,300 | A personal trading agent in the "vibe coding" mold. Illustrates how the vibe paradigm is bleeding into high-stakes verticals. |
| [siyuan-note/siyuan](https://github.com/siyuan-note/siyuan) | TypeScript | 47,023 | Privacy-first, self-hosted knowledge workspace where humans and AI agents collaborate. Local-first knowledge + agents as a coherent product. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 71,650 | Turns documents or topics into native PowerPoint decks with shapes, animations, charts, and narration. A crisp example of format-native agent output. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 185,479 | Local model runner now supporting Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, Gemma, and more. Its model roster is a useful proxy for which open models the community considers current. |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 168,399 | The model-definition framework for text, vision, audio, and multimodal models. Still the default substrate for nearly all open-model work. |
| [jingyaogong/minimind](https://github.com/jingyaogong/minimind) | Python | 64,691 | Train a 64M-parameter LLM from scratch in just 2 hours. The "learn LLMs by building one" genre remains one of the most effective on-ramps. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 107,610 | Step-by-step PyTorch implementation of a ChatGPT-like LLM. Persistent high stars show enduring demand for first-principles education. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,559 | LLM evaluation platform covering OpenAI, Anthropic, Gemini, Qwen, GLM, DeepSeek across 100+ datasets. Evaluation as the bottleneck for agent reliability. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,491 | Build a tiny vLLM + Qwen inference system on Apple Silicon for systems engineers. Bridges the inference-systems and education audiences. |
| [Picovoice/picollm](https://github.com/Picovoice/picollm) | Python | 317 | On-device LLM inference powered by X-bit quantization. A small but strategically placed bet on edge inference. |
| [datamllab/OpenEBFM](https://github.com/datamllab/OpenEBFM) | Python | 219 | Open-source code for training and scaling energy-based foundation models. A rare non-transformer research direction on the list. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 140,027 | Turns any codebase (docs, SQL schemas, configs, PDFs) into a queryable knowledge graph with deterministic AST parsing and no vector store. Its "vectorless RAG" stance is a notable counter-trend. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 93,266 | Fuses cutting-edge RAG with agent capabilities to form a context layer for LLMs. One of the most mature end-to-end RAG engines. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 68,170 | Drop-in memory infrastructure for AI agents and apps, built for production. Directly overlaps with today's hottest theme — persistent agent context. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | 41,248 | Self-evolving context database unifying agent memory, knowledge RAG, and skills. ByteDance's volcengine entering the memory-infra race is a meaningful competitive signal. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 39,931 | Document index for vectorless, reasoning-based RAG. Together with graphify, suggests a real "beyond embeddings" research wave. |
| [topoteretes/cognee](https://github.com/topoteretes/cognee) | Python | 32,965 | Open-source AI memory platform for agents with persistent long-term memory using small models. Free small-model memory is a compelling cost story. |
| [StarTrail-org/LEANN](https://github.com/StarTrail-org/LEANN) | Python | 13,734 | MLSys 2026 Best Paper: 97% storage savings with fast, accurate, fully private on-device RAG. Strong research-to-repo translation. |
| [alibaba/zvec](https://github.com/alibaba/zvec) | C++ | 16,168 | Lightweight, lightning-fast, in-process vector database. In-process vector DBs are becoming the default for local-first agents. |

---

## 3. Trend Signal Analysis

The single loudest signal today is that **the agent's surrounding scaffold — not the agent itself — is where the community is investing**. The top four trending repos by daily stars are all harness-layer projects: memory (`claude-mem`), skills (`skills`), vertical orchestration (`Claude-Code-Game-Studios`), and methodology (`superpowers`). This reflects a maturing market: base models are increasingly treated as commodities routed through `ollama`/provider CLIs, and differentiation has moved to context persistence, token efficiency (`headroom`), and output quality (`impeccable`).

A second, quieter signal is the **"vectorless / reasoning-based RAG"** theme appearing simultaneously in `graphify` and `PageIndex`, plus graph-backed memory in `cognee` and `OpenViking`. This challenges the default embedding-and-vector-store architecture that has dominated since 2023, and pairs with `LEANN`'s extreme storage compression and `alibaba/zvec`'s in-process DB to suggest the retrieval layer is being rethought for local, private, agent-native use.

Third, the **vertical agent wave is now unmistakably finance- and education-heavy**: TradingAgents, Vibe-Trading, daily_stock_analysis, Qlib, OpenBB, and DeepTutor/OpenMAIC all appeared together. Finance is the most crowded vertical, with DeepSeek/Qwen-class open models now good enough for credible multi-agent trading research.

Finally, `lightpanda/browser`, `zvec`, `impeccable`, and `rig` indicate **Rust and Zig are gaining ground** in AI infrastructure where latency, memory, or footprint matter. This is consistent with the local-first, on-device direction implied by `ollama`, `picollm`, and `LEANN`. The absence of any major new frontier-model training repository today reinforces that the open-source community's center of gravity has shifted decisively from *training* to *orchestration and deployment*.

---

## 4. Community Hot Spots

- **[thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)** — Today's top gainer (+1,723) and the clearest expression of the "persistent agent context" thesis. If memory becomes standard in every agent CLI, this class of project becomes load-bearing infrastructure.
- **Agent skills & methodology repos** — [obra/superpowers](https://github.com/obra/superpowers), [mattpocock/skills](https://github.com/mattpocock/skills), and [Donchitos/Claude-Code-Game-Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) show that shareable skill packs and methodologies are becoming a distribution format. Worth studying for anyone packaging agent expertise.
- **"Vectorless" / graph-based retrieval** — [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) and [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) are the leading edge of a possible post-embedding retrieval wave. High-risk, high-signal direction for RAG practitioners.
- **Token-compression and output-QA tooling** — [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) and [pbakaus/impeccable](https://github.com/pbakaus/impeccable) address two emerging pain points (cost and AI slop) that every production agent team will hit. Early-mover advantage is real here.
- **Local-first multi-agent desktop runtimes** — [Orkas-AI/Orkas](https://github.com/Orkas-AI/Orkas), [milind-soni/OpenMausBot](https://github.com/milind-soni/OpenMausBot), and [lightpanda-io/browser](https://github.com/lightpanda-io/browser) collectively argue that the next battleground is the user's own machine, not the cloud. Watch for integration standards (MCP, AG-UI) to consolidate this space.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*