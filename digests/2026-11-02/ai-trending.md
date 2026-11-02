# AI Open Source Trends 2026-11-02

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-02 00:34 UTC

---

# AI Open Source Trends Report — 2026-11-02

## 1. Today's Highlights

Today's trending board is dominated by **agent memory and context infrastructure**: `claude-mem` (+1,526 today) captures and compresses agent session history, while the topic search surfaces a whole tier of memory/context players (mem0, headroom, cognee, OpenViking). A second, equally loud signal is the **"agent harness" economy** — projects that wrap Claude Code, Codex, and Gemini CLI into specialized workforces, from game studios (Claude-Code-Game-Studios, +967) to security operations (AiSOC, +446). Meanwhile, `pingdotgg/t3code` (+3,094) tops the daily chart and `Kronos` (+630) marks a fresh push into finance-specific foundation models. The RAG layer keeps maturing away from naive vector search: graph-based (graphify), vectorless (PageIndex), and token-compression (headroom) approaches all rank high. Notably, local-first AI — offline speech-to-text (Handy, hex), on-device serving (FreeToken), and desktop RAG (LEANN) — is becoming a coherent category of its own.

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [pingdotgg/t3code](https://github.com/pingdotgg/t3code) | TypeScript | (+3,094) | The single largest daily gainer on the board at +3,094 stars. The repository has no public description yet, but its velocity alone makes it the most-watched new infrastructure entrant today. |
| [lightpanda-io/browser](https://github.com/lightpanda-io/browser) | Zig | (+825) | A headless browser purpose-built for AI and automation rather than human browsing. Its Zig implementation signals a new performance-first stack for agent web access, and +825 stars in a day shows strong demand. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | 185,598 | The de facto local model runner, now covering Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen and Gemma. With 185K+ stars it remains the default on-ramp for running open weights locally. |
| [FlashML-org/FreeToken](https://github.com/FlashML-org/FreeToken) | Python | (+242) | Brings datacenter-scale model serving to a desktop, letting users run massive models locally with efficiency optimizations. It sits at the intersection of the local-inference and serving-stack trends. |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | 38,453 | The frontend stack for agents and generative UI across React, Angular, mobile, and Slack, and the maker of the AG-UI Protocol. It is becoming the standard UI layer as agent backends proliferate. |
| [codewhale-hq/Codewhale](https://github.com/codewhale-hq/Codewhale) | Rust | 41,166 | An open-source terminal agent written in Rust that works with any provider or model. Rust-based agent tooling is a recurring theme today, and Codewhale leads that cohort. |
| [Mirrowel/LLM-API-Key-Proxy](https://github.com/Mirrowel/LLM-API-Key-Proxy) | Python | 559 | A universal LLM gateway exposing one OpenAI/Anthropic-compatible API across providers with load-balancing. Small but strategically placed as multi-model routing becomes table stakes. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | 109,256 (+1,526) | Captures everything an agent does in a session, compresses it with AI, and reinjects relevant context into future sessions. It works across Claude Code, Codex, Gemini, Copilot and more, and its +1,526 daily gain makes it today's defining agent-memory project. |
| [Donchitos/Claude-Code-Game-Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) | Shell | (+967) | Turns Claude Code into a full game dev studio with 49 AI agents, 72 workflow skills, and a studio-style coordination hierarchy. It exemplifies the "vertical agent org chart" pattern now spreading fast. |
| [milind-soni/OpenMausBot](https://github.com/milind-soni/OpenMausBot) | TypeScript | (+922) | An open-source Grok Bot alternative giving bots a full virtual machine to operate in. The +922-star day reflects surging interest in sandboxed, computer-using agents. |
| [togg53192-cmd/jailbreaks](https://github.com/togg53192-cmd/jailbreaks) | | (+726) | A personal collection of jailbreaks that hit +726 stars today. Its traction reflects the community's persistent focus on agent and model boundary testing. |
| [beenuar/AiSOC](https://github.com/beenuar/AiSOC) | Python | (+446) | An open-source AI Security Operations Center with alert fusion, LLM-agent triage, MITRE ATT&CK investigation, and a replayable decision ledger. It ships an MCP server for Claude, Cursor and Continue and runs with no API keys, making it a strong vertical agent showcase. |
| [CopilotKit/OpenBot](https://github.com/CopilotKit/OpenBot) | TypeScript | (+175) | Open-source AI coworkers that each get their own browser, files and tools, with every action decided before it happens and recorded after. It brings auditability to the computer-using agent pattern. |
| [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | JavaScript | 79,287 | An open-source job search agent that scans boards, scores jobs against your CV, and tailors resumes and cover letters while leaving submission to you. It runs locally in Codex and OpenCode, showing agents moving into high-stakes personal workflows. |
| [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) | Python | 44,288 | A framework for building resilient agents with durable execution and state. It remains a core dependency for teams moving agent prototypes toward production. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [cjpais/Handy](https://github.com/cjpais/Handy) | Rust | (+339) | A free, open-source, fully offline speech-to-text application. Its +339-star day puts it alongside the local-first voice wave led by hex, signaling offline dictation is now a mainstream ask. |
| [anomalyco/hex](https://github.com/anomalyco/hex) | Rust | (+1,179) | Local voice dictation for Mac, Windows and Linux that pulled +1,179 stars in a day. It is the highest-velocity desktop AI utility on the board and a clear Rust-based local-first winner. |
| [shiyu-coder/Kronos](https://github.com/shiyu-coder/Kronos) | Python | (+630) | A foundation model for the "language of financial markets," gaining +630 stars today. It marks the emergence of domain-specific foundation models for finance in the open. |
| [patchy631/ai-engineering-hub](https://github.com/patchy631/ai-engineering-hub) | Jupyter Notebook | 40,227 (+1,191) | In-depth tutorials on LLMs, RAG, and real-world AI agent applications. Its +1,191 daily gain alongside a 40K+ star base shows strong demand for practical engineering education even as tooling matures. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | 137,173 | Generates HD short videos from a topic or keyword via automated AI workflows. With 137K+ stars it is one of the most popular end-to-end generative media pipelines. |
| [open-webui/open-webui](https://github.com/open-webui/open-webui) | Python | 157,484 | A user-friendly AI interface supporting Ollama, OpenAI API, and more. At 157K+ stars it remains the dominant self-hosted front end for local and cloud models. |
| [rohitg00/ai-engineering-from-scratch](https://github.com/rohitg00/ai-engineering-from-scratch) | Python | 76,248 | A learn-by-building path into AI engineering. Its 76K stars highlight the massive onboarding wave into the AI engineering discipline. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | 168,420 | The model-definition framework for state-of-the-art text, vision, audio, and multimodal models. At 168K+ stars it stays the reference implementation layer for nearly all open model releases. |
| [jingyaogong/minimind](https://github.com/jingyaogong/minimind) | Python | 64,734 | Train a 64M-parameter LLM from scratch in about two hours. It keeps LLM training accessible and hands-on for individuals, which is why it sustains 64K stars. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | 5,507 | Teaches LLM inference systems on Apple Silicon by building a tiny vLLM plus Qwen. It reflects growing systems-engineer interest in inference internals rather than just prompting. |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Jupyter Notebook | 107,652 | Implements a ChatGPT-like LLM in PyTorch step by step. At 107K+ stars it remains the canonical teaching repository for LLM internals. |
| [Picovoice/picollm](https://github.com/Picovoice/picollm) | Python | 319 | On-device LLM inference powered by X-bit quantization. Though small, it is a signal of the push toward extreme-quantization edge inference. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | 7,560 | An LLM evaluation platform spanning OpenAI, Anthropic, Gemini, Qwen, GLM and DeepSeek across 100+ datasets. Evaluation breadth is becoming a differentiator as model count explodes. |
| [pytorch/pytorch](https://github.com/pytorch/pytorch) | Python | 105,070 | The tensors-and-autograd framework underpinning most modern training and inference. Its 105K+ stars underscore how much of today's AI stack still anchors on it. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Python | 140,530 | Turns any codebase, docs, SQL schemas, configs and PDFs into a queryable knowledge graph using local deterministic AST parsing with no vector store. Its 140K+ stars show graph RAG maturing into a serious alternative to embeddings. |
| [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Python | 78,569 | Compresses tool outputs, logs, files and RAG chunks before they reach the LLM, cutting tokens 60-95% for JSON with the same answers. Given that claude-mem and FreeToken both address context cost, this is a timely compression play. |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Python | 68,242 | The memory layer for AI agents, offering drop-in persistent context infrastructure built for production. It anchors the memory category alongside today's claude-mem surge. |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | Go | 93,302 | A leading open-source RAG engine fusing cutting-edge retrieval with agent capabilities. At 93K+ stars it is one of the most adopted context layers for LLMs. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | 39,941 | A document index for vectorless, reasoning-based RAG. It is a direct signal that the field is testing retrieval without embedding stores. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | 41,304 | A self-evolving context database unifying agent memory, knowledge RAG and skills. Its 41K stars plus corporate backing from Volcengine signal serious investment in context infrastructure. |
| [StarTrail-org/LEANN](https://github.com/StarTrail-org/LEANN) | Python | 13,745 | An MLSys 2026 best-paper implementation delivering 97% storage savings while running accurate, fully private RAG on personal devices. It pushes private on-device RAG toward practicality. |
| [alibaba/zvec](https://github.com/alibaba/zvec) | C++ | 16,171 | A lightweight, lightning-fast in-process vector database from Alibaba. It broadens the vector DB field toward embedded, low-latency deployments. |

---

## 3. Trend Signal Analysis

The clearest explosive signal today is **agent memory and context economics**. `claude-mem` (+1,526) and `hex` (+1,179) top the daily chart, while the topic search surfaces mem0, headroom, cognee, OpenViking, and LEANN all attacking the same problem — persisting, compressing, and retrieving context efficiently. This is not coincidental: with agents running long multi-step sessions, context cost and retention have become the binding constraint. Notably, several approaches (graphify, PageIndex) explicitly abandon vector search in favor of graph or reasoning-based retrieval, suggesting the embedding-first consensus is being challenged.

A second pattern is the **agent harness as a product**. Claude-Code-Game-Studios, AiSOC, career-ops, and ECC all wrap a coding agent (Claude Code, Codex, OpenCode, Cursor) into a vertical org chart — 49 agents for game dev, LLM triage for security, ATS-tuned job applications. This is a new distribution strategy: build on someone else's model and harness.

New tech stacks are appearing too: **Zig** (lightpanda) and **Rust** (hex, Codewhale) now litter the agent and local-AI space, and several projects ship MCP servers rather than SDKs (AiSOC, headroom). The local-first wave — offline STT (Handy), local dictation (hex), desktop serving (FreeToken), private RAG (LEANN) — is now a coherent category rather than scattered experiments, likely a response to API cost and privacy pressure from recent frontier model releases.

## 4. Community Hot Spots

- **Agent memory & context compression** — [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem), [mem0ai/mem0](https://github.com/mem0ai/mem0), [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom): the highest-velocity niche today; context cost and persistence are the current bottleneck for production agents.
- **Vectorless & graph-based RAG** — [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify), [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex): both rank high while explicitly rejecting embedding stores, worth watching as a potential paradigm shift.
- **Vertical agent harnesses** — [Donchitos/Claude-Code-Game-Studios](https://github.com/Donchitos/Claude-Code-Game-Studios), [beenuar/AiSOC](https://github.com/beenuar/AiSOC), [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops): orchestrating many specialized agents on top of a coding agent is the fastest-growing distribution pattern.
- **Rust/Zig local AI tooling** — [anomalyco/hex](https://github.com/anomalyco/hex), [cjpais/Handy](https://github.com/cjpais/Handy), [lightpanda-io/browser](https://github.com/lightpanda-io/browser): offline, high-performance AI utilities in systems languages are seeing rapid adoption.
- **Finance-specific foundation models & agents** — [shiyu-coder/Kronos](https://github.com/shiyu-coder/Kronos), [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents), [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading): domain foundation models plus multi-agent trading frameworks are forming a self-reinforcing vertical.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*