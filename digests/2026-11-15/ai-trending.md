# AI Open Source Trends 2026-11-15

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-15 00:58 UTC

---

# AI Open Source Trends Report — 2026-11-15

## 1. Today's Highlights

Today's AI open-source momentum is overwhelmingly concentrated in **agent tooling and token-efficiency**. A wave of "context engineering" projects—caveman (65% token cuts), headroom (60–95% fewer tokens on JSON), claude-mem (persistent cross-session memory), and Graphify (graph-based codebase context)—signals that the community's focus has shifted from raw model capability to *managing what agents read*. The trending list is dominated by "agent-adjacent" dev tools: Chrome DevTools MCP, GoogleChrome's modern-web-guidance-src, Plannotator, and Alibaba's open-code-review all ship LLM-powered workflows into existing developer surfaces. Meanwhile, the topic search reveals massive established bases (open-webui at 158k stars, langchain at 149k) alongside a striking new entrant: affaan-m/ECC at 303k stars, framed as an "agent harness performance optimization system." The category clearly crystallizing today is **agent infrastructure**—harnesses, protocols (AG-UI), orchestration (LoopForge), and context compression.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure (frameworks, SDKs, inference engines, dev tools, CLI)

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | TypeScript | 0 (+664) | Official Chrome DevTools MCP server that exposes browser debugging and inspection capabilities to coding agents. A first-party Google entry into the agent-tooling space, pulling 664 stars in a day. |
| [ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui) | TypeScript | 0 (+9) | The Agent-User Interaction Protocol for bringing agents into frontend applications. Early-stage but strategically important as a standards play for agent UX. |
| [ashhart/TensorFold](https://github.com/ashhart/TensorFold) | Zig | 0 (+37) | An LLM inference engine targeting Metal, CUDA, and Vulkan. Notable for its Zig implementation and cross-backend GPU ambition. |
| [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | Go | 120,079 (+227) | A viral skill + proxy for coding agents that cuts 65% of tokens by "talking like a caveman." Appears on both the trending list and LLM topic results, showing cross-surface traction. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 79,675 | Compresses tool outputs, logs, files, and RAG chunks before they reach the LLM—20% fewer tokens for coding agents, 60–95% for JSON. A library/proxy/MCP server triple-play for context cost reduction. |
| [Tencent/LoopForge](https://github.com/Tencent/LoopForge) | Go | 0 (+33) | Self-hosted workflows for coding-agent delivery, orchestrating CodeBuddy, Codex, and Claude Code with human approval gates. A big-vendor signal that agent orchestration is going enterprise. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | 9,146 | Build modular and scalable LLM applications in Rust. Represents the growing Rust-for-AI-applications niche. |
| [Picovoice/picollm](https://github.com/Picovoice/picollm) | Python | 320 | On-device LLM inference powered by X-bit quantization. Small but points to the edge-inference trend. |

### 🤖 AI Agents / Workflows (agent frameworks, automation, multi-agent systems)

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 303,080 | "The agent harness performance optimization system"—skills, instincts, memory, security, and research-first development for Claude Code, Codex, Opencode, Cursor and beyond. The single highest-starred repo in today's dataset, an extraordinary momentum signal for agent-harness optimization. |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 263,408 | "The agent that grows with you." A major open agent framework from NousResearch, now one of the largest agent repos by stars. |
| [paperclipai/paperclip](https://github.com/paperclipai/paperclip) | TypeScript | 113,936 | The open-source app everyone uses to manage agents at work. Positions itself as the workplace agent-management layer. |
| [QwenLM/qwen-code](https://github.com/QwenLM/qwen-code) | TypeScript | 0 (+64) | An open-source AI coding agent that lives in your terminal. Qwen's first-party terminal agent entry. |
| [HKUDS/nanobot](https://github.com/HKUDS/nanobot) | Python | 50,087 | A lightweight open-source personal agent from HKUDS. Compact, approachable personal-agent design. |
| [codewhale-hq/Codewhale](https://github.com/codewhale-hq/Codewhale) | Rust | 41,174 | An open-source terminal coding agent written in Rust; works with any model and can split tasks across agents. Rust-based agent tooling is a fresh stack signal. |
| [zhayujie/CowAgent](https://github.com/zhayujie/CowAgent) | Python | 47,934 | Open-source personal AI assistant & agent harness with planning, tools, memory, multi-agent and multi-channel support. |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | 38,703 | The frontend stack for agents & generative UI (React, Angular, Mobile, Slack); makers of AG-UI. Bridges agent backends to product surfaces. |

### 📦 AI Applications (specific apps, vertical solutions)

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [backnotprop/plannotator](https://github.com/backnotprop/plannotator) | TypeScript | 0 (+408) | A workspace to shape, decide, plan, annotate, review code, and send feedback to agents in one click. Led today's trending list by new stars, showing demand for human-in-the-loop agent review UX. |
| [alibaba/open-code-review](https://github.com/alibaba/open-code-review) | Go | 0 (+893) | Secure, fast, battle-tested code review tool with hybrid architecture: deterministic pipelines + LLM Agent, line-level comments, multi-language rulesets. The top new-star earner on the trending list; enterprise-grade AI code review. |
| [tradermonty/claude-trading-skills](https://github.com/tradermonty/claude-trading-skills) | Python | 0 (+553) | Claude Code skills for equity investors and traders—market analysis, charting, screeners, strategy development. A vertical "skills" package riding the Claude Code plugin economy. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 82,599 | Open-source AI job search agent: scans boards, scores jobs against your CV, tailors resumes and cover letters. Runs locally in Codex/OpenCode or as a Claude Code plugin. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 76,846 | AI turns documents or topics into native PowerPoint decks with shapes, transitions, charts, and narration. A concrete document-to-deck vertical agent. |
| [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) | Python | 72,262 | LLM-powered multi-market stock analysis with multi-source data, real-time news, decision dashboard, and zero-cost scheduled runs. |
| [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | Python | 38,241 | "Your Personal Trading Agent" from HKUDS. Adds to the visible cluster of AI finance/trading agents. |
| [feder-cr/Jobs_Applier_AI_Agent](https://github.com/feder-cr/Jobs_Applier_AI_Agent) | Python | 32,528 | AIHawk: automated job search and auto-apply bot. Long-running vertical automation play. |

### 🧠 LLMs / Training (model weights, training frameworks, fine-tuning tools)

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 168,980 | The model-definition framework for state-of-the-art ML across text, vision, audio, and multimodal. The ecosystem's foundational library. |
| [tensorflow/tensorflow](https://github.com/tensorflow/tensorflow) | C++ | 201,604 | The original open-source ML framework for everyone. Still the largest by stars in the ML topic. |
| [pytorch/pytorch](https://github.com/pytorch/pytorch) | Python | 105,497 | Tensors and dynamic neural networks with strong GPU acceleration. The de facto training backbone. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 108,416 | Implement a ChatGPT-like LLM in PyTorch step by step. The leading educational LLM repo. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,739 | Learn LLM inference systems on Apple Silicon by building a tiny vLLM + Qwen. A systems-engineering learning path for inference. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,594 | LLM evaluation platform covering OpenAI, Anthropic, Gemini, Qwen, GLM, DeepSeek across 100+ datasets. Evaluation infrastructure is increasingly critical. |
| [ultralytics/ultralytics](https://github.com/ultralytics/ultralytics) | Python | 63,413 | YOLO27/26/11/v8 for detection, segmentation, classification, pose, tracking. The dominant CV training/inference toolkit. |
| [roboflow/supervision](https://github.com/roboflow/supervision) | Python | 51,626 | Reusable computer vision tools. Complements the YOLO stack for CV pipelines. |

### 🔍 RAG / Knowledge (vector databases, retrieval-augmented generation, knowledge management)

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [open-webui/open-webui](https://github.com/open-webui/open-webui) | Svelte | 158,663 | User-friendly AI interface supporting Ollama, OpenAI API, and more. The most-starred RAG-topic project and the default self-hosted chat UI. |
| [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | Python | 149,519 | "The agent engineering platform." LangChain's repositioning from chains to agents mirrors the broader market shift. |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 147,785 | Turns any codebase, docs, SQL schemas, configs, and PDFs into a queryable knowledge graph; a /graphify skill for Claude Code, Cursor, Codex, Gemini CLI—local deterministic AST parsing, no vector store. A notable "vectorless" RAG challenger. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 117,124 | Persistent context across sessions for every agent—captures session activity, compresses it with AI, injects relevant context back. Works with Claude Code, Codex, Gemini, Copilot, and more. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 94,158 | RAGFlow, now positioned as an "agent-native database" and context infrastructure. RAG engines are rebranding as agent context layers. |
| [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai) | Python | 87,360 | Hosted web scraping/extraction/search API for AI agents, with a fully open-source Apache-2.0 crawler underneath. Web-data plumbing for agents. |
| [Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm) | JavaScript | 68,284 | Local-first agent experience with document chat. "Stop renting your intelligence" framing resonates with self-hosting demand. |
| [milvus-io/milvus](https://github.com/milvus-io/milvus) | Go | 46,665 | High-performance, cloud-native vector database for scalable ANN search. The infrastructure anchor of the vector-DB cohort. |

---

## 3. Trend Signal Analysis

The dominant signal today is **context and token economics**. Four separate projects—caveman (65% token cut), headroom (60–95% on JSON), claude-mem (persistent compressed memory), and Graphify (vectorless graph context)—are all attacking the same problem: agents are drowning in context. This is a mature-market signal. When the community stops asking "can the model do it?" and starts asking "how do we feed it cheaply and reliably?", the ecosystem has moved from capability to cost/latency engineering. The 303k-star ECC repo, framed explicitly as an "agent harness performance optimization system," confirms this: harness optimization is now a category of its own.

A second signal is **first-party vendor entry into agent tooling**. GoogleChrome ships both an MCP server for DevTools and a "keep your coding agent up to date" guidance repo; Alibaba ships open-code-review; Tencent ships LoopForge; Qwen ships qwen-code. Big vendors are no longer just publishing models—they are publishing the *plumbing* agents plug into. This raises the competitive bar for indie agent tools and suggests consolidation pressure.

New stacks appearing: **Zig** (TensorFold) and **Rust** (Codewhale, rig, qdrant) are showing up in inference and agent tooling, while Go dominates the orchestration/proxy layer (caveman, LoopForge, Milvus, RAGFlow, ollama). The "vectorless RAG" framing (Graphify, PageIndex) is a genuinely new direction worth watching—it directly challenges the assumption that vector databases are the default retrieval layer.

Finally, the vertical-agent cluster is conspicuous: four finance/trading projects (claude-trading-skills, daily_stock_analysis, Vibe-Trading, OpenBB) and two job-search agents (career-ops, Jobs_Applier) all appear in one day's topic search. Vertical agents are becoming the default commercialization path for open-source AI.

---

## 4. Community Hot Spots

- **[affaan-m/ECC](https://github.com/affaan-m/ECC)** — At 303k stars, this is the highest-signal repo in the dataset. Agent-harness optimization (skills, memory, security) is the new battleground; worth studying its architecture even if you don't adopt it.
- **[JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) + [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom)** — Token compression is the most practical cost lever for agent deployments today. Both are low-effort, high-ROI additions to a coding-agent stack.
- **[Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) + [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex)** — "Vectorless" / reasoning-based retrieval is a credible alternative to vector DBs for codebase and document context. Watch this space if you're building RAG.
- **[ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)** — First-party MCP tooling from Chrome DevTools; a strong signal that MCP is becoming the standard integration surface for agents and browsers.
- **[alibaba/open-code-review](https://github.com/alibaba/open-code-review)** — The top new-star earner on the trending list (+893). Hybrid deterministic + LLM code review is an enterprise-ready pattern; the multi-language ruleset (NPE, thread-safety, XSS, SQLi) is a useful reference design.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*