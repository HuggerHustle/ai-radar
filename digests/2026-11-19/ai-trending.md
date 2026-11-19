# AI Open Source Trends 2026-11-19

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-19 02:29 UTC

---

# AI Open Source Trends Report — 2026-11-19

## 1. Today's Highlights

Today's GitHub AI landscape is overwhelmingly dominated by the **agent skills and harness ecosystem**: four of the top five trending AI repos (`last30days-skill`, `superpowers`, `stitch-skills`, `ECC`) are skills frameworks or agent-harness optimizers, signaling that the community has moved past "building agents" into "equipping and governing them." Google Research's `paper-orchestra` (+1,524 today) exploded to the top of the daily chart, showing intense appetite for multi-agent automation of research itself, while NVIDIA's `SkillEvaluator` introduced quality gates and semantic overlap detection — the first serious attempt at a *quality assurance layer* for the exploding skills market. Meanwhile, context engineering emerged as a defining theme: `headroom` (token compression), `claude-mem` and `mem0` (persistent memory), and the "vectorless RAG" line (`PageIndex`, `graphify`) all went viral, indicating a backlash against naive vector-store stuffing. The long tail of classic ML tooling (PyTorch, TensorFlow, scikit-learn) remains stable but generated no meaningful daily momentum.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [NVIDIA/SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator) | Python | ⭐0 (+312) | NVIDIA's multi-tier framework evaluates AI agent skills and plugins with quality gates, semantic overlap detection, and live behavioral evaluation. It is the first major vendor-backed attempt to bring rigor to the unregulated agent-skills market, arriving exactly as skills repos flood the trending list. |
| [openvinotoolkit/openvino](https://github.com/openvinotoolkit/openvino) | C++ | ⭐0 (+24) | Intel's open-source toolkit for optimizing and deploying AI inference across edge and heterogeneous hardware. A steady presence rather than a momentum story today, but a reliable anchor for production inference deployments. |
| [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) | Python | ⭐0 (+389) | Aims to make all software "agent-native" by exposing any application through a unified CLI-Hub interface. Strong daily momentum (+389) reflects the broader push to turn existing software into agent-callable tools without rewrites. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | ⭐80,111 | Compresses tool outputs, logs, files, and RAG chunks before they reach the LLM — claimed 20% token savings for coding agents and 60–95% for JSON. It lands squarely in the context-engineering wave, offering a drop-in library, proxy, and MCP server. |
| [langchain4j/langchain4j](https://github.com/langchain4j/langchain4j) | Java | ⭐13,421 | An idiomatic Java library for LLM apps on the JVM, with unified APIs for providers, vector stores, tool calling (including MCP), and RAG. Its Quarkus/Spring Boot integration makes it the default enterprise on-ramp for Java shops. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | ⭐9,179 | A modular Rust framework for building scalable LLM applications. Its presence highlights the steady migration of agent/inference workloads into Rust for performance and safety. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [obra/superpowers](https://github.com/obra/superpowers) | Shell | ⭐0 (+822) | An agentic skills framework and software development methodology that "just works." The +822 daily spike shows skills frameworks are now the community's preferred abstraction over raw agent scaffolding. |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | ⭐306,578 (+1,108) | The "agent harness performance optimization system" covering skills, instincts, memory, security, and research-first development for Claude Code, Codex, OpenCode, and Cursor. Its +1,108 daily gain and enormous total make it one of the defining harness projects of the current cycle. |
| [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) | TypeScript | ⭐0 (+365) | A library of Agent Skills built to the open Agent Skills standard for use with the Stitch MCP server. Google Labs' backing plus cross-compatibility with Antigravity, Gemini CLI, Claude Code, and Cursor signals the emergence of a cross-vendor skills standard. |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | Python | ⭐0 (+1,059) | An agent skill that researches any topic across Reddit, X, YouTube, HN, Polymarket, and the web, then synthesizes a grounded summary. Its +1,059 debut is the single strongest daily signal that "research skills" are a killer agent use case. |
| [google-research/paper-orchestra](https://github.com/google-research/paper-orchestra) | Python | ⭐0 (+1,524) | A multi-agent framework for automated AI research paper writing, from Google Research. Topping today's list with +1,524 stars, it embodies the "agents that do science" direction now moving from demos to institutional research projects. |
| [copilotkit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | ⭐38,810 | The frontend stack for agents and generative UI across React, Angular, Mobile, and Slack, and the maker of the AG-UI Protocol. It remains the leading answer to "how do agents show up in a product UI?" |
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | Python | ⭐121,454 | The open-source Python library for AI browser agents, plus a hosted cloud with stealth browsers and an agent API. Browser automation remains one of the most commercially validated agent categories. |
| [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) | Python | ⭐123,086 | A multi-agent LLM framework for financial trading. Its high star count confirms vertical multi-agent finance as a persistent, well-funded niche. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [cherryhq/cherry-studio](https://github.com/CherryHQ/cherry-studio) | TypeScript | ⭐53,637 | A cross-platform AI workspace for models, agents, and productivity. It is one of the more polished consumer-facing desktop clients aggregating multiple providers. |
| [open-webui/open-webui](https://github.com/open-webui/open-webui) | Svelte | ⭐159,053 | A user-friendly AI interface supporting Ollama and OpenAI-compatible APIs. It remains the de facto self-hosted front end for local and remote models alike. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | ⭐144,512 | Generates HD short videos from a topic or keyword using AI models and automated workflows. Its huge star count shows short-form video generation is still a dominant consumer AI use case. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | ⭐83,574 | An open-source AI job-search agent that scans boards, scores jobs against your CV, tailors ATS-friendly resumes, and tracks applications. A textbook example of a vertical agent replacing a tedious human workflow. |
| [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) | Python | ⭐78,319 | Turns documents or topics into native PowerPoint decks with real shapes, transitions, charts, and audio narration. Document-to-deck generation is a proven high-value AI application niche. |
| [n8n-io/n8n](https://github.com/n8n-io/n8n) | TypeScript | ⭐0 (+325) | A fair-code workflow automation platform with native AI capabilities and 400+ integrations. Its +325 daily gain highlights how automation platforms are absorbing agent capabilities directly. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [jingyaogong/minimind](https://github.com/jingyaogong/minimind) | Python | ⭐66,503 | A tutorial project to train your own 64M-parameter LLM from scratch in two hours. It remains one of the most popular entry points for understanding LLM training end-to-end. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | ⭐5,777 | Teaches systems engineers to build a tiny vLLM-style inference system for Qwen on Apple Silicon. It fills a real gap: systems-level, hardware-aware LLM inference education. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | ⭐7,602 | An LLM evaluation platform covering OpenAI, Anthropic, Gemini, Qwen, GLM, DeepSeek and others across 100+ datasets. Evaluation infrastructure matters more as model releases accelerate. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | ⭐187,560 | Gets you running Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, Gemma and other models locally. The go-to local model runner, now explicitly curated around the newest open-weight releases. |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | ⭐169,192 | The model-definition framework for state-of-the-art text, vision, audio, and multimodal models, for both inference and training. Still the universal substrate for open-weight model work. |
| [Eigenwise/atomic-agents](https://github.com/Eigenwise/atomic-agents) | Python | ⭐6,341 | A framework for building AI agents "atomically" from composable units. Represents the growing interest in smaller, well-bounded agent primitives rather than monolithic orchestrators. |
| [FonaTech/Project_Chronos](https://github.com/FonaTech/Project_Chronos) | Python | ⭐207 | Aims for zero-stall MoE inference via lookahead prediction and async DMA prefetching optimized for SSD I/O with hybrid MLA + sliding-window attention. A niche but technically deep signal on MoE inference systems. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | ⭐150,202 | Turns any codebase, docs, SQL schemas, configs, and PDFs into a queryable knowledge graph with deterministic AST parsing and no vector store. Its 150k+ star count makes the "no vector store" claim one of the loudest anti-vector-DB signals in the ecosystem. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | ⭐40,477 | A document index for "vectorless, reasoning-based RAG." It is the most explicit articulation of the emerging reasoning-over-retrieval paradigm in knowledge systems. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | ⭐69,208 | The drop-in memory layer for AI agents, providing persistent context built for production. Memory is increasingly treated as core infrastructure rather than an agent feature. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | ⭐118,267 | Captures everything an agent does across sessions, compresses it with AI, and injects relevant context back into future sessions, working across Claude Code, Codex, Gemini, Copilot, and more. Persistent cross-session memory is now a first-class developer concern. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | ⭐94,399 | A RAG engine that has grown into "context infrastructure" and an agent-native database. Its evolution mirrors the broader shift from RAG-as-pipeline to context-as-platform. |
| [milvus-io/milvus](https://github.com/milvus-io/milvus) | Go | ⭐46,688 | A high-performance, cloud-native vector database for scalable ANN search. Despite the anti-vector-store noise, Milvus remains the production anchor for large-scale vector workloads. |
| [StarTrail-org/LEANN](https://github.com/StarTrail-org/LEANN) | Python | ⭐13,806 | An MLSys 2026 Best Paper project achieving 97% storage savings for private, accurate RAG on personal devices. It directly addresses the cost and privacy barriers to local RAG. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | ⭐42,430 | A self-evolving context database unifying agent memory, knowledge RAG, and skills for AI agents. ByteDance's Volcengine entry signals big-cloud competition in the agent-context layer. |

---

## 3. Trend Signal Analysis

**Agent skills and harnesses are today's explosive category.** Four of the top five trending AI repos are skills frameworks or harness optimizers: `last30days-skill` (+1,059), `superpowers` (+822), `ECC` (+1,108), and `stitch-skills` (+365), with NVIDIA's `SkillEvaluator` (+312) arriving to evaluate them. This is a clear second wave: the community has shipped enough agents and now needs to equip, standardize, evaluate, and govern them. The emergence of an "Agent Skills open standard" backed by Google Labs, plus NVIDIA quality gates, suggests the ecosystem is consolidating around portable skill definitions rather than proprietary agent internals.

**New directions appearing for the first time** cluster around *context engineering and vectorless retrieval*. `headroom` (token compression), `claude-mem` and `mem0` (persistent memory), `PageIndex` and `graphify` (reasoning-based, no-vector-store RAG) all trended or rank extremely high. The "vectorless RAG" framing — particularly `graphify` at 150k+ stars and `PageIndex` at 40k+ — is the most notable new meme-stack to emerge, positioning knowledge graphs and AST parsing against naive embedding similarity. Notably, `ELLEANN` (97% storage savings) shows the same concern from the efficiency angle.

**Connection to industry events.** The strong support in `ollama` for Kimi, GLM, MiniMax, DeepSeek, Qwen, and gpt-oss reflects the recent wave of Chinese and open-weight model releases now being curated in local runners. Google Research's `paper-orchestra` and `stitch-skills` show Google pushing multi-agent research automation and cross-vendor skill standards. Meanwhile, the dominance of `ECC`/`Claude Code`/`Codex` integrations confirms coding agents remain the primary commercial battlefield.

---

## 4. Community Hot Spots

- **[affaan-m/ECC](https://github.com/affaan-m/ECC)** — 306k+ stars and still gaining +1,108 today. It is becoming the de facto performance/optimization layer across every major coding agent (Claude Code, Codex, OpenCode, Cursor). Developers should understand its skills/instincts/memory model before building their own harness.
- **[mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill)** and **[google-research/paper-orchestra](https://github.com/google-research/paper-orchestra)** — the two biggest daily gainers. Both are "research agents" (personal research synthesis and automated paper writing), confirming autonomous research as a breakout agent application.
- **[NVIDIA/SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator)** — the first credible QA layer for the exploding skills market. As thousands of skills appear, evaluation, overlap detection, and behavioral testing become essential; early adopters gain a quality moat.
- **Vectorless / graph-based RAG: [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) and [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex)** — both make explicit "no vector store / reasoning-based" claims at very high star counts. Watch this as a potential architectural shift away from embedding-first retrieval.
- **Persistent agent memory: [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) and [mem0ai/mem0](https://github.com/mem0ai/mem0)** — cross-session memory is moving from nice-to-have to expected infrastructure, with cross-agent compatibility (Claude Code, Codex, Gemini, Copilot) as the key differentiator.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*