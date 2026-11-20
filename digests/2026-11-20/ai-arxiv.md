# ArXiv AI Research Digest 2026-11-20

> Source: [ArXiv](https://arxiv.org/) (cs.AI, cs.CL, cs.LG) | 50 papers | Generated: 2026-11-20 02:14 UTC

---

# ArXiv AI Research Digest — 2026-11-18

## 1. Today's Highlights

Today's submissions reveal a strong push toward **making AI systems more auditable, controllable, and grounded in real-world constraints**. A cluster of papers tackles safety and reliability from complementary angles: contrastive jailbreak detection, security-aware multi-agent replanning, and budget-paired counterfactual audits for visual agents. In parallel, several works question the *value of human oversight*, showing that metacognitive calibration determines whether a reviewer adds anything to a model's decision—and reframing the Turing Test as a harder "Personal Imitation Game." On the methods side, novel theoretical contributions stand out: **monoculture-robust PAC learning**, equivariant polynomial modeling via minimal homogeneous generators, and a data-driven search for topological anyon structures. Finally, agentic engineering is maturing, with papers on harness evolution, LLM-guided attack-path identification in smart grids, and agent-native financial trading—signaling a shift from capability demos to deployable, verifiable systems.

---

## 2. Key Papers

### 🧠 Large Language Models (architecture, training, alignment, evaluation)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Jailbreak Detection on Large Language Models via Contrastive Prototype Structures](http://arxiv.org/abs/2611.24936v1) | Yan Qiu, Yuanyuan Li | Proposes safety detection via contrastively learned representations and prototype inference, avoiding a separate downstream classifier. Matters because it offers a lightweight, training-efficient defense against harmful prompts. |
| [General progress substitutes for specific training data in language models](http://arxiv.org/abs/2611.24844v1) | Mark Marosi, Peter Antal | Shows that general capability progress can substitute for withheld task-specific training data, quantifying how long data withholding delays a capability. Directly informs safety policy on data curation and capability gating. |
| [On-Policy Morphing into Hybrid Attention Models](http://arxiv.org/abs/2611.24809v1) | Disen Lan, Xuanda Wang, Jianbin Zheng et al. | Identifies off-policy mismatches in converting pretrained Transformers into hybrid full/linear attention models and proposes an on-policy morphing approach. Relevant for efficient long-context deployment at lower cost. |
| [A Foundation Model to Measure and Predict Human Behaviour](http://arxiv.org/abs/2611.24830v1) | Haoran Ye, Tianrui Huo, Hangzhen Li et al. | Introduces Chiron, a foundation model that better preserves individual- and population-level behavioral fidelity than generic LLMs. Important for social simulation and computational social science applications. |
| [Knowing What You Know: A Trait Theory of Reviewer Value in Human-AI Cognitive Systems](http://arxiv.org/abs/2611.24932v1) | Priyanka Sinha, Sugam Pandey | Argues that metacognitive calibration—alignment between confidence and correctness—is the key trait determining when human reviewers add value. Reframes human-in-the-loop design around a measurable cognitive property. |

### 🤖 Agents & Reasoning (planning, tool use, multi-agent, chain-of-thought)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Agentic Harness Engineering Beta: Requirement-Centered Evolution of Agent Harnesses](http://arxiv.org/abs/2611.24924v1) | Jiahang Lin, Jiahao Chen, Yiding Wang et al. | Proposes requirement-centered evolution of agent harnesses that accounts for implicit user requirements, moving beyond single-agent benchmark modification. Advances the engineering discipline behind reliable agent deployments. |
| [Kaer: Security-Aware Replanning for Multi-Agent Systems](http://arxiv.org/abs/2611.24839v1) | Tushin Mallick, Evan Rose, Matthew Laws et al. | Addresses a critical vulnerability of orchestrator-based multi-agent replanning by adding security-aware planning. Timely given enterprise adoption of orchestrator architectures. |
| [Can Programs Replace LLM Judges? Executable Program Judges for Scalable and Efficient Relevance Labeling](http://arxiv.org/abs/2611.24849v1) | Eugene Agichtein, Charles L. A. Clarke, Kaustubh Dhole et al. | Investigates replacing LLM judges with executable program judges for relevance labeling, improving reproducibility and cost. Offers a path out of the scalability/interpretability bottleneck of frontier-model judging. |
| [Atomic MathReasoner: Instance-Level Composition of Atomic Reasoning Skills for Mathematical LLMs](http://arxiv.org/abs/2611.24846v1) | Jiashu Li, Tianyu Gao, Qinglong Liu et al. | Decomposes mathematical reasoning into atomic skills and composes them per-instance instead of treating math ability monolithically. Improves both accuracy and interpretability of math LLMs. |
| [Ground, Iterate, Trace: Decomposing AI Research Ideation](http://arxiv.org/abs/2611.24887v1) | Samson Yu, Qiran Zou, Jing Yu Lim et al. | Introduces the Creative AI Researcher (CAR) framework that grounds ideation in literature, iterates, and traces novel proposals. Explains *how* generated research ideas emerge from prior work—key for scientific-agent trust. |
| [Who are you? The Personal Imitation Game](http://arxiv.org/abs/2611.24888v1) | Muhammad Rizky Wellyanto, Hajara-Yasmin Isa, Kexin Xue et al. | Proposes a harder Turing-style challenge: replicating a *specific individual* rather than a generic human. Resets the benchmark for personalization and identity-level evaluation. |

### 🔧 Methods & Frameworks (new techniques, benchmarks, efficiency improvements)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Monoculture Robust Learning](http://arxiv.org/abs/2611.24881v1) | Lee Cohen, Jon Kleinberg, Omer Reingold | Formalizes monoculture robustness in PAC learning to combat failure correlation across models sharing components. A foundational theoretical contribution to algorithmic diversity. |
| [Equivariant Modeling with Polynomial Features via Minimal Homogeneous Generators](http://arxiv.org/abs/2611.24896v1) | Michael Liaofan Liu, Joe Kileel | Provides a general framework for learning equivariant functions via minimal homogeneous generators of polynomial features. Unifies constructions across applications in a mathematically principled way. |
| [Cap-and-Track: Optimizing LLM Inference Request Dispatch Across Shifting Capacity](http://arxiv.org/abs/2611.24891v1) | Benjamin Novotny, Doug Szeto, Chang Wang et al. | Designs asynchronous inference dispatch that adapts to dynamically shrinking and growing provider capacity. Critical for cost and reliability in production LLM serving. |
| [Learning the Anyon Atlas](http://arxiv.org/abs/2611.24752v1) | Jonah Berean-Dutcher, Clay Cordova, Julio Parra-Martinez et al. | Extends ML-driven search for 2+1D topological quantum field theory modular data from 22 to 42 anyons, discovering 150,679 new structures. Demonstrates ML as a discovery engine in theoretical physics. |
| [Variance-Optimal Counterfactual Policy Design for Sample-Efficient Online A/B Testing](http://arxiv.org/abs/2611.24757v1) | Shashank Gupta, Subhadeep Maji | Proposes variance-optimal counterfactual policy design to reduce variance in difference-in-means A/B estimators. Practical throughput gain for large-scale experimentation. |
| [Elysium: Simulation-Free Unbalanced Schrödinger Bridges](http://arxiv.org/abs/2611.24763v1) | Zihan Wang, Jianzhe Li, Zhenyi Zhang et al. | Introduces a simulation-free approach to unbalanced Schrödinger bridges for modeling cellular dynamics with proliferation and apoptosis. Advances single-cell trajectory inference without destructive tracking. |

### 📊 Applications (domain-specific, multimodal, code generation)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Auditing black-box clinical prediction models with a large language model through queries alone: a blinded test with planted flaws](http://arxiv.org/abs/2611.24877v1) | Zhiyu Liu, Xinyu Yang | Tests whether LLMs can audit clinical prediction models through black-box queries, with planted flaws as ground truth. Provides rigorous evidence on a high-stakes promise often taken for granted. |
| [LLM-Guided Cyber-Physical Attack Path Identification in Smart Grids](http://arxiv.org/abs/2611.24765v1) | Amr Elshazly, Jesse Roberts, Rachad Atat et al. | Combines topology analysis and simulation with LLM guidance to identify adversarial attack paths in power grids. Bridges structural and adversarial analysis for critical infrastructure resilience. |
| [Vibe-Trading: Towards Agent-Native Trading](http://arxiv.org/abs/2611.24845v1) | Haozhe Wu, Zhonghang Li, Chao Huang | Builds agents that maintain reliable state under shifting financial market conditions rather than static workflows. Pushes agent architectures into high-stakes, stateful domains. |
| [Mapping the AI Supply Chain: Dependencies, Vulnerabilities, and Market Concentration in the AI Ecosystem](http://arxiv.org/abs/2611.24927v1) | Sarah H. Cen, Lindsey A. Gailmard, Joohan Kim et al. | Documents actor/component relationships across the AI stack, revealing concentration and vulnerability. Essential context for AI governance and industrial policy. |
| [Measuring and Improving Transfer of Neural Surrogates for Vehicle Aerodynamics](http://arxiv.org/abs/2611.24843v1) | Favour Nerrise, Julian Busch, Gurpreet Singh Hora et al. | Studies cross-vehicle-class transfer for neural aerodynamic surrogates, a key limitation of CFD replacements. Practical for reducing per-vehicle training campaigns in automotive engineering. |
| [Does the Action Matter? Probing Action-Conditioned Semantic Forecasting as a World Model for Autonomous Driving](http://arxiv.org/abs/2611.24840v1) | Binay Kumar Singh, Niels Da Vitoria Lobo | Questions whether action-conditioned world models for driving actually use the action signal. Challenges evaluation assumptions behind model-based planning in autonomy. |

---

## 3. Research Trend Signal

Three converging signals emerge from today's batch. First, **auditability is becoming a first-class research objective**: papers on black-box clinical auditing, counterfactual observation budgets, program judges, and personal imitation all ask *how do we verify that an AI system is doing what we think it is doing?* Second, **the human-in-the-loop is being re-examined rather than assumed**: the metacognitive calibration paper and the personal imitation game both challenge the premise that adding humans (or generic humans) improves outcomes. Third, **agentic infrastructure is consolidating**: harness evolution, security-aware replanning, cap-and-track dispatch, and agent-native trading all treat agents as systems to be engineered, not just prompted. Together these point toward a maturation phase in which the field's center of gravity shifts from raw capability to *verifiable, controllable, and economically deployable intelligence*—with theoretical work on monoculture robustness and equivariance providing the mathematical scaffolding.

---

## 4. Worth Deep Reading

1. **[Monoculture Robust Learning](http://arxiv.org/abs/2611.24881v1)** — Cohen, Kleinberg & Reingold formalize a concept with enormous practical weight: correlated failures across models sharing training data. The PAC-style framing makes it directly actionable for both theory and system design, and the authors are leaders in the field. Anyone building ensembles or multi-model pipelines should read this in full.

2. **[Auditing black-box clinical prediction models with a large language model through queries alone](http://arxiv.org/abs/2611.24877v1)** — A rare *blinded, planted-flaw* test of a widely repeated claim (LLMs can audit opaque models). The methodology is rigorous, the domain is high-stakes, and the results—whatever their direction—will shape how much trust we place in LLM-based model auditing.

3. **[Knowing What You Know: A Trait Theory of Reviewer Value in Human-AI Cognitive Systems](http://arxiv.org/abs/2611.24932v1)** — Reframes human-AI collaboration around a single measurable trait (metacognitive calibration) rather than vague notions of "human judgment." If the empirical claims hold, this could reshape how organizations staff review pipelines and evaluate oversight value.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*