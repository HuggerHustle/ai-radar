# AI Open Source Trends 2026-11-22

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-22 01:08 UTC

---

# AI Open Source Trends Report — 2026-11-22

---

## 1. Today's Highlights

The dominant theme today is the **"Agent Skills" ecosystem explosion**: four of the top trending repos (Claude-BugHunter, superpowers, stitch-skills, last30days-skill, app-store-compliance) are skill bundles or harnesses for coding agents like Claude Code, Cursor, and Codex. **Token efficiency and context compression** are emerging as a first-class concern, with headroom and caveman both attacking the "too many tokens" problem. **Local-first and lightweight LLMs** continue to trend strongly (minimind, home-llm, LEANN), while RAG is bifurcating into "vectorless / reasoning-based" approaches (PageIndex, graphify) versus traditional vector DBs. Notably, vertical AI applications for **finance, video creation, and job hunting** are pulling in massive community interest alongside core infrastructure.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) | TypeScript | 206,215 (+1,006) | Knowledge infrastructure letting agents search, scrape, and access 550+ data providers through one API. Today's star gain confirms web-data plumbing remains a critical bottleneck for agent builders. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 187,792 | The de-facto local model runner, now supporting Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, and Gemma. Anchors the entire local-first inference ecosystem. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 80,261 | Compresses tool outputs, logs, files, and RAG chunks before they reach the LLM—20% fewer tokens for coding agents, 60–95% fewer for JSON. Token economics are becoming a first-class infra layer. |
| [openvinotoolkit/openvino](https://github.com/openvinotoolkit/openvino) | C++ | (+200 today) | Intel's open-source toolkit for optimizing and deploying AI inference. Steady daily momentum reflects ongoing enterprise edge-inference demand. |
| [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) | Python | (+769 today) | "Making ALL Software Agent-Native" via a CLI hub. A fresh take on exposing arbitrary tooling to agents, and one of today's fastest-rising infrastructure repos. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,802 | Teaches systems engineers to build a tiny vLLM + Qwen inference stack on Apple Silicon. A rare low-level inference-learning resource gaining traction. |
| [Eigenwise/atomic-agents](https://github.com/Eigenwise/atomic-agents) | Python | 6,344 | Composable, atomic building blocks for AI agents. Reflects the modularization trend in agent construction. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | 308,381 | An "agent harness performance optimization system" bundling skills, instincts, memory, and security for Claude Code, Codex, Cursor, and more. Topping the LLM topic charts signals massive appetite for agent harness tuning. |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | 265,208 | "The agent that grows with you" from a respected open-model lab. A heavyweight entrant into the personal-agent space. |
| [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | Python | 149,952 | The long-standing agent engineering platform, now repositioned squarely around agents. Its continued dominance shows incumbents still capturing mindshare. |
| [langgenius/dify](https://github.com/langgenius/dify) | Python | 161,629 | Builds agentic workflows and RAG pipelines on one collaborative workspace with cloud/VPC/self-host options. A production-grade counterpart to lighter agent frameworks. |
| [obra/superpowers](https://github.com/obra/superpowers) | Shell | (+883 today) | An agentic skills framework and software development methodology "that works." One of today's biggest gainers—methodology is becoming a product. |
| [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) | TypeScript | (+326 today) | Agent Skills library for the Stitch MCP server, following the open Agent Skills standard for cross-agent compatibility. Signals Google formalizing the skills format. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 84,064 | Open-source AI job-search agent that scans boards, scores jobs against your CV, and tailors resumes. A striking vertical-agent success story. |
| [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | Python | 123,393 | Multi-agent LLM financial-trading framework. Finance remains the most aggressive vertical adopting multi-agent orchestration. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter) | Python | (+1,803 today) | A Claude Code skill bundle for bug-hunting and red-team work: 82 skills, 15 slash commands, 681 disclosed-report patterns. Today's #1 gainer—security is the newest killer app for agent skills. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 144,992 | Generates HD short videos from a topic or keyword using LLM + automated workflows. Continued explosive interest in generative video pipelines. |
| [zhouxiaoka/autoclip](https://github.com/zhouxiaoka/autoclip) | Python | (+683 today) | Open-source AI video clipping desktop tool turning long podcasts/courses into shorts with subtitles and covers. A fast-rising, concrete creator-economy tool. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | 79,079 | Turns documents/topics into native PowerPoint decks with real shapes, animations, and charts. A rare high-fidelity output agent beyond text. |
| [mjmirza/app-store-compliance](https://github.com/mjmirza/app-store-compliance) | Shell | (+720 today) | Playbook and pre-submission guard with 124 rejection patterns and tracked regulatory deadlines (EU AI Act, DSA, COPPA). Compliance-as-agent-skill is a genuinely new niche. |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | Python | (+560 today) | Agent skill that researches any topic across Reddit, X, YouTube, HN, and Polymarket, then synthesizes a grounded summary. Grounded cross-source research is a high-demand skill. |
| [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) | HTML | (+583 today) | Editorial diagram design for Claude Code, Codex, and Copilot with 45 diagram types—"no Mermaid slop." Signals demand for high-quality visual agent output. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 169,312 | The model-definition framework for state-of-the-art text, vision, audio, and multimodal models. Remains the canonical reference implementing stack. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter | 108,778 | Step-by-step PyTorch implementation of a ChatGPT-like LLM. Perennial favorite reflecting sustained demand for from-scratch LLM education. |
| [jingyaogong/minimind](https://github.com/jingyaogong/minimind) | Python | 68,154 (+488) | Train your own 64M LLM from scratch in 2 hours. Today's most-visible "small model, fast training" project, riding the lightweight-LLM wave. |
| [pytorch/pytorch](https://github.com/pytorch/pytorch) | Python | 105,730 | Tensors and dynamic neural networks with strong GPU acceleration. Unchanged foundation of the entire training ecosystem. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,610 | LLM evaluation platform spanning OpenAI, Anthropic, Gemini, Qwen, GLM, and DeepSeek across 100+ datasets. Evaluation is increasingly a first-class training concern. |
| [acon96/home-llm](https://github.com/acon96/home-llm) | Python | 1,497 | Home Assistant integration + model controlling smart homes via a local LLM. A textbook local-LLM vertical deployment. |
| [thinkwee/AgentsMeetRL](https://github.com/thinkwee/AgentsMeetRL) | HTML | 1,889 | Curated list for Agentic RL. The intersection of RL and agents is gaining structured community attention. |
| [FonaTech/Project_Chronos](https://github.com/FonaTech/Project_Chronos) | Python | 207 | Zero-stall MoE inference via lookahead prediction and async DMA prefetching optimized for SSD I/O. An early-stage but technically notable inference-optimization entry. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [open-webui/open-webui](https://github.com/open-webui/open-webui) | Svelte | 159,228 | User-friendly AI interface supporting Ollama and OpenAI APIs. The most-starred RAG-topic project, anchoring the self-hosted UI layer. |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 151,623 | Turns any codebase, docs, SQL schemas, configs, and PDFs into a queryable knowledge graph with deterministic AST parsing and no vector store. A leading "vectorless RAG" signal. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 118,851 | Persistent cross-session context for every agent—captures, compresses, and reinjects relevant context. Memory persistence is now a top-tier RAG concern. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 94,512 | Agent-native database evolved from a RAG engine into context infrastructure. Its own pitch mirrors the industry shift from "RAG" to "context." |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 69,314 | Drop-in memory infrastructure for AI agents with persistent context. A production-grade memory layer increasingly treated as core, not optional. |
| [milvus-io/milvus](https://github.com/milvus-io/milvus) | Go | 46,714 | Cloud-native vector database for scalable ANN search. Still the reference-scale vector store. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 40,690 | Document index for "vectorless, reasoning-based RAG." Directly challenges vector-DB orthodoxy and is gaining serious traction. |
| [StarTrail-org/LEANN](https://github.com/StarTrail-org/LEANN) | Python | 13,808 | MLSys 2026 Best Paper—RAG on everything with 97% storage savings while running fully private on-device. Strong academic-to-practice bridge. |

---

## 3. Trend Signal Analysis

The single most explosive category today is **agent skills and harnesses**—externally packaged capabilities (skills, slash commands, methodology) that extend coding agents. Claude-BugHunter's +1,803 stars and superpowers' +883 make clear that the community no longer just wants agent *models*; it wants curated *competence packs*. This is a shift from "build an agent" to "equip an agent," and Google's formal entry via stitch-skills suggests the Agent Skills standard is consolidating across vendors (Claude Code, Cursor, Codex, Gemini CLI, Antigravity).

A second signal is **token and context economics**. Headroom (60–95% token reduction on JSON) and Caveman ("why use many token when few token do trick") both treat context compression as a product, not an afterthought—strongly implying that real-world agent deployments are hitting cost/latency walls. Paired with claude-mem and mem0, memory management has matured from a hack into dedicated infrastructure.

Third, **RAG is bifurcating**. Vector databases remain dominant by stars, but "vectorless, reasoning-based" retrieval (PageIndex, graphify, LEANN) is emerging as a credible counter-movement emphasizing determinism, explainability, and storage savings—likely a reaction to vector-DB costs and opacity. Finally, **local-first and small models** (minimind, home-llm, LEANN) plus another vLLM-related learning project (tiny-llm) suggest continued interest in owning the full inference stack, consistent with recent releases of capable small models (Qwen, Gemma, gpt-oss) that make self-hosting genuinely viable.

---

## 4. Community Hot Spots

- **Agent Skills Standards** — [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills), [obra/superpowers](https://github.com/obra/superpowers), [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter): a de facto spec war is forming; building cross-agent-compatible skills early could pay off.
- **Token/Context Compression** — [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) and [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman): directly attacks the #1 cost driver in production agent deployments.
- **Vectorless / Reasoning-Based RAG** — [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) and [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify): worth watching as a possible paradigm challenger to vector DBs.
- **Vertical Agent Applications** — [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops), [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents), [zhouxiaoka/autoclip](https://github.com/zhouxiaoka/autoclip): proves the fastest path to adoption is a narrow, high-value workflow.
- **Small-Model Self-Hosting** — [jingyaogong/minimind](https://github.com/jingyaogong/minimind), [StarTrail-org/LEANN](https://github.com/StarTrail-org/LEANN), [acon96/home-llm](https://github.com/acon96/home-llm): the local-first stack (train → retrieve → deploy) is increasingly viable end-to-end on consumer hardware.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*