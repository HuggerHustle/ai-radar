# AI Open Source Trends 2026-11-16

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-11-16 00:56 UTC

---

# AI Open Source Trends Report — 2026-11-16

## 1. Today's Highlights

Today's GitHub trending is dominated by the **agent tooling layer** rather than model training or raw infrastructure. The explosive momentum sits with projects that make coding agents safer, more controllable, and more context-aware: `plannotator` (+866), `chrome-devtools-mcp` (+717), `open-code-review` (+691), and `LoopForge` (+423) all point to a maturing "agent harness" ecosystem. A second strong signal is the **Agent Skills standardization wave** — Google's `stitch-skills`, NVIDIA's `SkillEvaluator`, and multiple Claude Code skill bundles (`Claude-BugHunter`, `claude-trading-skills`) suggest skills are becoming a portable, evaluable unit of agent capability. Meanwhile, established infrastructure (ggml, tensorflow, pytorch, transformers) continues to attract steady attention as the stable base layer. The overall theme: **the community is racing to build the governance, evaluation, and interaction protocols around agents, not just the agents themselves.**

---

## 2. Top Projects by Category

### 🔧 AI Infrastructure (frameworks, SDKs, inference engines, dev tools, CLI)

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [ggml-org/ggml](https://github.com/ggml-org/ggml) | C++ | ⭐0 (+43 today) | A low-level tensor library powering efficient on-device ML inference across the llama.cpp ecosystem. Its continued trending presence signals sustained demand for portable, dependency-light model execution. |
| [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) | TypeScript | ⭐0 (+247 today) | A library of Agent Skills built on the open Agent Skills standard, compatible with Antigravity, Gemini CLI, Claude Code, and Cursor. Google's entry into portable skills signals standardization momentum. |
| [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | TypeScript | ⭐0 (+717 today) | Exposes Chrome DevTools capabilities to coding agents via MCP. A high-signal example of first-party browser tooling being retrofitted for agent consumption. |
| [NVIDIA/SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator) | Python | ⭐0 (+122 today) | A multi-tier framework for evaluating AI agent skills with quality gates and semantic overlap detection. Fills a critical gap as skills proliferate without standardized quality measurement. |
| [alibaba/open-code-review](https://github.com/alibaba/open-code-review) | Go | ⭐0 (+691 today) | A battle-tested hybrid code review tool combining deterministic pipelines with LLM agents, featuring precise line-level comments and multi-language security rules. Its Alibaba-scale provenance and OpenAI/Anthropic compatibility make it immediately practical. |
| [Tencent/LoopForge](https://github.com/Tencent/LoopForge) | Go | ⭐0 (+423 today) | Self-hosted orchestration for coding-agent delivery with human approval gates, supporting CodeBuddy, Codex, and Claude Code. Reflects enterprise demand for governed agent pipelines rather than ad-hoc CLI usage. |

### 🤖 AI Agents / Workflows

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui) | TypeScript | ⭐0 (+355 today) | The Agent-User Interaction Protocol for bringing agents into frontend applications. Aims to become the standard interface layer between agent backends and UI surfaces. |
| [backnotprop/plannotator](https://github.com/backnotprop/plannotator) | TypeScript | ⭐0 (+866 today) | A workspace for shaping, reviewing, and annotating agent output, with one-click feedback delivery back to agents. Today's top gainer reflects strong appetite for human-in-the-loop agent control. |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | JavaScript | ⭐303,857 | An agent harness performance optimization system covering skills, memory, security, and research-first development across Claude Code, Codex, and Cursor. Its enormous star count reflects its role as a de-facto meta-layer for coding agents. |
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Python | ⭐263,640 | A personal agent designed to grow with the user over time. NousResearch's reputation for open models lends credibility to its agent stack. |
| [Significant-Gravitas/AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) | Python | ⭐188,045 | The original accessible autonomous agent project, still a benchmark for the category. Its continued listing shows the long tail of agent experimentation remains active. |
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | Python | ⭐121,114 | Open-source Python library for AI browser agents plus a hosted cloud offering. Browser automation remains one of the most practical agent use cases. |
| [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) | TypeScript | ⭐39,118 | A coding agent with the IDE wired in, built by Stencil Labs. Represents the "IDE-native agent" direction competing with terminal-first tools. |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | TypeScript | ⭐38,716 | The frontend stack for agents and generative UI across React, Angular, and mobile. Makers of the AG-UI Protocol, tying the interaction layer to a concrete UI framework. |

### 📦 AI Applications

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [dream-num/univer](https://github.com/dream-num/univer) [Topic: AI office] | TypeScript | ⭐0 (+988 today) | An AI office SDK bringing editing, calculation, collaboration, and file processing to products for both humans and agents. Today's single biggest gainer, reflecting demand for agent-native productivity surfaces. |
| [GoogleChrome/modern-web-guidance-src](https://github.com/GoogleChrome/modern-web-guidance-src) | TypeScript | ⭐0 (+1,219 today) | Keeps coding agents current with the latest web best practices. Today's highest raw gainer, indicating strong demand for grounding agents in evolving standards. |
| [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter) | Python | ⭐0 (+98 today) | A Claude Code skill bundle with 82 skills and 681 disclosed-report patterns for red-team work. A striking example of vertical, domain-expert skills packaged for agents. |
| [tradermonty/claude-trading-skills](https://github.com/tradermonty/claude-trading-skills) | Python | ⭐0 (+706 today) | Claude Code skills for equity investors covering market analysis, charting, and strategy development. Shows finance is an early adopter of packaged agent skills. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Python | ⭐143,818 | Generates HD short videos from a topic or keyword via automated AI workflow. A persistent favorite in the generative-media application space. |
| [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | Python | ⭐38,326 | A personal trading agent from HKUDS. Illustrates the convergence of agent frameworks with vertical financial applications. |
| [siyuan-note/siyuan](https://github.com/siyuan-note/siyuan) | TypeScript | ⭐47,245 | A privacy-first, self-hosted knowledge workspace where humans and AI agents collaborate. Represents the "agent-in-the-workspace" application pattern. |

### 🧠 LLMs / Training

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Python | ⭐169,023 | The model-definition framework for state-of-the-art text, vision, audio, and multimodal models. Remains the canonical entry point for applied model work. |
| [pytorch/pytorch](https://github.com/pytorch/pytorch) | Python | ⭐105,542 | Tensors and dynamic neural networks with strong GPU acceleration. The enduring training substrate underlying most of the ecosystem. |
| [tensorflow/tensorflow](https://github.com/tensorflow/tensorflow) | C++ | ⭐201,642 | The long-standing open-source ML framework. Still the most-starred ML project overall, with production ubiquity. |
| [ollama/ollama](https://github.com/ollama/ollama) | Go | ⭐187,104 | Local model runner supporting Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, and Gemma. Its broad model roster reflects the rapid proliferation of open-weight releases. |
| [skyzh/tiny-llm](https://github.com/skyzh/tiny-llm) | Python | ⭐5,743 | Teaches LLM inference internals on Apple Silicon by building a tiny vLLM + Qwen. A standout educational project for systems engineers. |
| [open-compass/opencompass](https://github.com/open-compass/opencompass) | Python | ⭐7,595 | An LLM evaluation platform spanning OpenAI, Anthropic, Gemini, Qwen, GLM, and DeepSeek across 100+ datasets. Evaluation remains a critical, under-served need. |
| [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig) | Rust | ⭐9,154 | A Rust toolkit for building modular, scalable LLM applications. Represents the growing Rust-native LLM tooling niche. |

### 🔍 RAG / Knowledge

| Project | Lang | Stars (total / today) | Summary |
| :--- | :--- | ---: | :--- |
| [milvus-io/milvus](https://github.com/milvus-io/milvus) | Go | ⭐46,668 | A high-performance, cloud-native vector database for scalable ANN search. A foundational layer for production RAG systems. |
| [qdrant/qdrant](https://github.com/qdrant/qdrant) | Rust | ⭐35,573 | A high-performance vector database and search engine available self-hosted or cloud. Rust performance plus managed convenience keeps it competitive. |
| [run-llama/llama_index](https://github.com/run-llama/llama_index) | Python | ⭐52,913 | The document processing platform for AI. A long-standing RAG backbone now repositioned around document-centric workflows. |
| [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) | Python | ⭐40,446 | A document index enabling "vectorless," reasoning-based RAG. Notable as a contrarian bet against vector-store-centric architectures. |
| [topoteretes/cognee](https://github.com/topoteretes/cognee) | Python | ⭐33,336 | An open-source AI memory platform giving agents persistent long-term memory with small models. Memory is emerging as a distinct infrastructure category. |
| [volcengine/OpenViking](https://github.com/volcengine/OpenViking) | Python | ⭐42,276 | A self-evolving context database unifying agent memory, knowledge RAG, and skills. Reflects the trend toward consolidating memory and retrieval into one substrate. |
| [zilliztech/claude-context](https://github.com/zilliztech/claude-context) | TypeScript | ⭐12,694 | Code search MCP for Claude Code, making an entire codebase the context for any coding agent. A direct bridge between RAG and the coding-agent workflow. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | TypeScript | ⭐117,379 | Persistent cross-session context for agents, compressing session activity and reinjecting relevant context. Widely starred, showing memory is a top-of-mind pain point. |

---

## 3. Trend Signal Analysis

The clearest signal today is the **rise of the agent operations layer**. The top trending repos are overwhelmingly about controlling, reviewing, and grounding agents rather than building smarter models: `plannotator` (+866), `chrome-devtools-mcp` (+717), `modern-web-guidance-src` (+1,219), `open-code-review` (+691), and `LoopForge` (+423) all sit in the "make agents reliable in real workflows" space. This is consistent with a market that has moved past capability demos into **production hardening**.

A second emerging direction is the **portable Agent Skills standard**. Google's `stitch-skills`, NVIDIA's `SkillEvaluator`, and a cluster of Claude Code skill bundles (`Claude-BugHunter`, `claude-trading-skills`) show skills becoming a distributable, evaluable unit — and a new axis of competition. The appearance of evaluation tooling (`SkillEvaluator`) alongside skill libraries is an early sign of market maturation.

Third, the **MCP ecosystem is deepening**. `chrome-devtools-mcp` and `claude-context` represent first-party and infrastructure players extending MCP into new surfaces (browser, codebase). This suggests MCP is consolidating as the default agent-tool interface.

Finally, the **memory/context category is heating up**: `cognee`, `OpenViking`, `claude-mem`, and PageIndex's "vectorless RAG" all point to a rethinking of retrieval beyond naive vector search, likely driven by long-context models and the practical limits of chunk-based RAG. Established infra (ggml, transformers, pytorch) remains stable but is no longer where the community's energy concentrates.

---

## 4. Community Hot Spots

- **Agent control & review tooling** — [plannotator](https://github.com/backnotprop/plannotator), [open-code-review](https://github.com/alibaba/open-code-review), [LoopForge](https://github.com/Tencent/LoopForge): Human-in-the-loop and governance tooling is where the fastest-rising repos sit, reflecting enterprise adoption pressures.
- **Agent Skills standardization & evaluation** — [stitch-skills](https://github.com/google-labs-code/stitch-skills), [SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator), [Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter): Skills are becoming a portable asset class; expect quality/evaluation tooling to grow quickly.
- **MCP as the agent-tool interface** — [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp), [claude-context](https://github.com/zilliztech/claude-context): First-party and infra vendors are converging on MCP, making it a high-leverage integration point.
- **Agent memory & post-vector RAG** — [cognee](https://github.com/topoteretes/cognee), [OpenViking](https://github.com/volcengine/OpenViking), [PageIndex](https://github.com/VectifyAI/PageIndex): Persistent memory and reasoning-based retrieval are redefining the RAG stack.
- **Agent-native productivity surfaces** — [univer](https://github.com/dream-num/univer), [siyuan](https://github.com/siyuan-note/siyuan): Office and knowledge tools rebuilt for human+agent collaboration are drawing major early interest.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*