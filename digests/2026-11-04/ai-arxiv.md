# ArXiv AI Research Digest 2026-11-04

> Source: [ArXiv](https://arxiv.org/) (cs.AI, cs.CL, cs.LG) | 50 papers | Generated: 2026-11-04 01:13 UTC

---

# ArXiv AI Research Digest — November 4, 2026

## 1. Today's Highlights

Today's submissions reveal three converging pushes. First, **optimizer dynamics are being revisited at scale**: the Muon-vs-AdamW advantage is shown to *reverse* after fine-tuning depending on pretraining data scale, and multi-epoch pretraining scaling laws predict late-time overfitting mitigated by ensembling. Second, **agentic systems are moving from demos to rigorous measurement** — new benchmarks target GUI web environments, distributed-systems debugging, harmful side effects in coding agents, MCP tool poisoning, and even physiological control (diabetes). Third, **efficient adaptation remains fertile ground**, with multiple papers (BISECT, RASP, Sonar-MoE, LoL) attacking continual learning, MoE memory, and adaptive layer ordering. Notably, several papers apply LLM agents to real scientific and engineering workflows — Earth system model parameterizations, power grid studies, and formal demography — signaling a shift from capability benchmarks to deployment-grade evaluations.

---

## 2. Key Papers

### 🧠 Large Language Models (architecture, training, alignment, evaluation)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Pretraining Data Scale Reverses the Muon-AdamW Fine-Tuning Gap](http://arxiv.org/abs/2611.03633v1) | Catherine Li, Jingchu Gai, Andrej Risteski et al. | Studies whether Muon's pretraining speedup over AdamW persists after fine-tuning, and finds the gap reverses as pretraining data scale grows. This matters because optimizer choice is typically locked in during pretraining but justified by downstream performance. |
| [A Scaling Theory of Multi-Epoch Pretraining: Late-Time Overfitting and Ensembling](http://arxiv.org/abs/2611.03590v1) | Zhen Yang, Yidi Miao, Blake Bordelon | Develops scaling theory for the data-bound regime where models train for many epochs over limited data, predicting late-time overfitting and quantifying ensemble gains. Directly relevant as frontier pretraining shifts from compute-bound to data-bound. |
| [Library of Layers (LoL): Adaptively Ordering Transformer Layers at Runtime](http://arxiv.org/abs/2611.03526v1) | Abdellah Rahmani, Sean McLeish, Ang Li et al. | Introduces an architecture where transformer layers are dynamically ordered at inference rather than executed in fixed sequence. This challenges a foundational assumption of transformer design and opens a path to input-adaptive computation. |
| [Sonar-MoE: In-Backward Expert Updates for Memory-Efficient Mixture-of-Experts Training](http://arxiv.org/abs/2611.03577v1) | Avni Mittal, Avinash Anand, Ashutosh Kumar et al. | Updates each MoE expert during the backward pass, eliminating the need to retain all expert gradients in GPU memory until the optimizer step. This is a practical enabler for scaling MoE models whose memory footprint currently grows with expert count. |
| [Tracing the Scientific Discovery Capacity of LLMs to Their Training Data](http://arxiv.org/abs/2611.03617v1) | Arda Uzunoglu, Mahler Revsine, Michael Schatz et al. | Frames scientific discovery capability as a "missing probability mass" problem and traces it back to training data composition. Provides a theoretical handle on when and why LLMs can make reliable discoveries versus retrieval. |
| [VIAS: Value-Isolating Activation Steering for Multi-Value Alignment](http://arxiv.org/abs/2611.03518v1) | Avni Mittal, Avinash Anand, Dikshant Kukreja et al. | Tests whether activation steering can enforce organizational value compliance beyond prompting, isolating individual value directions in activation space. Addresses a key deployment need for enterprises with multiple, potentially conflicting value sets. |

### 🤖 Agents & Reasoning (planning, tool use, multi-agent, chain-of-thought)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Strategist: Evolving Reasoning with Agents](http://arxiv.org/abs/2611.03618v1) | Taiming Lu, Qi Xu, Zhigang Hua et al. | Proposes a meta-agent that learns and evolves inference strategies (the reasoning procedure around model calls) rather than hand-writing them per task. Treats strategy as a first-class, transferable artifact — a significant reframing of agent design. |
| [From Natural Language to Exact Cover: A Neuro-Symbolic Approach to Zebra Puzzles](http://arxiv.org/abs/2611.03641v1) | Paulius Skaisgiris, Thomas Pammer, Veronika Semmelrock et al. | Combines LLM parsing with an exact-cover symbolic solver to tackle elementary logic puzzles where pure CoT still fails. A clean demonstration that hybrid neuro-symbolic pipelines beat scaling alone on structured reasoning. |
| [Not All Reasoning Generalizes: A Case Study on Learning Generalizable Reasoning Strategies in RLVR](http://arxiv.org/abs/2611.03627v1) | Ziqi Pang, Yu-Xiong Wang | Uses a controllable equation-solving framework to probe which reasoning strategies learned via RLVR actually transfer. Provides an important negative result: generalization is strategy-dependent, not automatic. |
| [FADE: Factored Ability–Difficulty Filtering for Online RLVR Scheduling](http://arxiv.org/abs/2611.03625v1) | Tomas Duncun, Jonah Ellison, Mateo Ruiz et al. | Addresses the wasted compute from all-pass/all-fail RLVR groups by factorizing prompt selection into model-ability and task-difficulty components. A direct efficiency win for the increasingly expensive RLVR training pipeline. |
| [Four Bridges: Measuring Deception Propensity in a Multi-Agent Game](http://arxiv.org/abs/2611.03600v1) | Raphael Casey, Michael Simeone, Alberto Tosato et al. | Measures deception that *emerges* in multi-agent interaction without any explicit instruction to deceive. Expands safety evaluation beyond single-turn pressure benchmarks to settings that mirror real deployment. |
| [WebHarbor: Docking Real Websites for Evolving GUI Agent Environments](http://arxiv.org/abs/2611.03634v1) | Zhaoyang Wang, Qianhui Wu, Boyu Gou et al. | Docks real, live websites into stable, evolving GUI environments that support both training and reproducible evaluation. Solves the twin problems of live-site instability and synthetic-environment coverage gaps. |

### 🔧 Methods & Frameworks (new techniques, benchmarks, efficiency improvements)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [BISECT: Bilevel Spectral Decomposition for Low-Rank Continual Learning](http://arxiv.org/abs/2611.03574v1) | Tom Saliencro, Wen-Hsuan Liu, Rohan Desai et al. | Replaces strict subspace isolation in LoRA-based continual learning with a bilevel spectral decomposition. Preserves shared structure across tasks while still mitigating catastrophic forgetting. |
| [RASP: Read-All, Sparse-Plasticity Continual Learning in a Stationary-Size LoRA](http://arxiv.org/abs/2611.03513v1) | Wen-Hsuan Liu, Amara Okonkwo, Tom Saliencro et al. | Achieves continual learning without linearly growing adapter parameters or sparse MoE routing overhead. Important for deploying continuously updated ViT-based systems at fixed memory budget. |
| [Evaluating Uncertainty Calibration in Probabilistic Time Series Foundation Models](http://arxiv.org/abs/2611.03592v1) | Thomas Decker, Volker Tresp | Provides a systematic empirical study of whether probabilistic TSFM uncertainty estimates are actually calibrated. Foundational for any downstream decision-making that relies on forecast intervals. |
| [VeriHarm-Bench: Measuring Harmful Success in LLM Coding Agents Verifiably](http://arxiv.org/abs/2611.03575v1) | Wei-Lin Chen, Zhepei Wei, Xinyu Zhu et al. | Introduces verifiable evaluation of coding agents that accomplish user goals while causing unintended harm (file deletion, permission weakening). Critical safety gap given shell-access deployment. |
| [DistDebug-Bench: Can LLM Agents Diagnose Bugs in Distributed Systems?](http://arxiv.org/abs/2611.03523v1) | Yuxuan Jiang, Chenglin Liu, John Rose et al. | Extends agentic debugging evaluation from self-contained Python modules to distributed systems. A necessary correction to benchmark difficulty that better reflects production engineering. |
| [MCP Tool Poisoning in Agentic AI Frameworks: A Cross-Framework Measurement Study](http://arxiv.org/abs/2611.03555v1) | Farooq Shaikh, Biagio Montaruli | Measures how attacker-controlled tool descriptions, schemas, and response data propagate into model context across agentic frameworks. Timely security analysis of the MCP ecosystem. |
| [Benchmark Prediction with Sparse and Unpaired Cached Responses](http://arxiv.org/abs/2611.03614v1) | Hayden Helm, Avijit Ghosh, Ben Johnson et al. | Develops statistical methods to predict full benchmark performance from sparse, non-overlapping cached responses across models and tasks. Addresses a real bottleneck as evaluation costs balloon. |
| [Tilted Convexity and an Exact Offline-Online Separation](http://arxiv.org/abs/2611.03472v1) | Mohammad Pedramfar, Rajiv Khanna, Christopher John Quinn et al. | Generalizes convexity via a one-parameter distortion and derives an exact offline-online separation. A theoretically clean contribution to the foundations of online learning. |

### 📊 Applications (domain-specific, multimodal, code generation)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Pixel: A Co-Designed Full-Stack Robot System for Learning General-Purpose Mobile Manipulation](http://arxiv.org/abs/2611.03648v1) | Tony Tao, Jason Jingzhou Liu, Ruslan Salakhutdinov et al. | Co-designs hardware, demonstration collection, whole-body control, and policy learning for general-purpose mobile manipulation. Argues that independent component development is the core bottleneck — a systems-level thesis. |
| [Pixel-UMI: Learning Environment-Aware Whole-Body Manipulation from Sensorized Human Demonstrations](http://arxiv.org/abs/2611.03647v1) | Jason Jingzhou Liu, Tony Tao, Deepak Pathak et al. | Introduces Environment-Aware Retargeting to bridge embodiment gaps when learning from sensorized human demonstrations. Directly addresses the scalability promise of human data for robot learning. |
| [D&amp;A: Decoupling Description and Assessment Enables VLMs as Zero-Shot Robotic Reward Models](http://arxiv.org/abs/2611.03622v1) | Marius Memmel, Shawn Yin, Urvi Rutia et al. | Separates task description from progress assessment to avoid confirmation bias and hallucinated progress in VLM reward models. A targeted fix for a known failure mode in zero-shot robot learning. |
| [DiabAgent: Toward Agentic Physiological Control](http://arxiv.org/abs/2611.03601v1) | Chengxi Li, Shaoxuan Li, Deyao Hong et al. | Provides systematic quantitative evaluation of whether medical LLMs can perform sustained physiological control (insulin management in Type 1 diabetes). Moves beyond clinical QA to closed-loop intervention. |
| [PlantVLM-Edge: Quantized Vision-Language Models for On-Device Crop Health Diagnosis](http://arxiv.org/abs/2611.03557v1) | Gaurab Wagle, Bishal Adhikari, Jiajia Li et al. | Quantizes VLMs for on-device crop health diagnosis where expert knowledge is scarce. Practical deployment of multimodal models in low-connectivity agricultural settings. |
| [NitiBench+: A Temporal Thai Legal Question Answering Benchmark Across 17 Domains](http://arxiv.org/abs/2611.03576v1) | Pawitsapak Akarajaradwong, Sarana Nutanong, Chompakorn Chaksangchaichot | Shows up to 67% of Thai court decisions cite law that has since been amended or repealed, and builds a temporal legal QA benchmark. Exposes a systemic flaw in legal QA evaluation that grades against today's law. |
| [Can LLM Agents Improve Imperfect Earth System Model Parameterizations?](http://arxiv.org/abs/2611.03543v1) | Kara D. Lamb | Investigates whether agentic AI can speed the multi-year process of translating physical understanding into validated ESM parameterizations. A rare test of agents on a domain with hard stability and validation requirements. |
| [Can AI Do Formal Demography?](http://arxiv.org/abs/2611.03500v1) | Joshua R. Goldstein, Kenneth W. Wachter | Reports an experiment where Claude explained and simplified a formal demographic proof about optimal COVID vaccination targeting. A concrete case study of AI assistance on rigorous mathematical reasoning in the social sciences. |
| [Ask, Don't Equip: Question-Driven Coding Agents for Deep Kernel Optimization](http://arxiv.org/abs/2611.03517v1) | Gabriele Oliaro, Jaeseong Lee, Zhaoyuan Su et al. | Proposes question-driven instead of scripted or fully open-ended agents for GPU kernel optimization, navigating the structure-freedom tradeoff. A reusable pattern for any agentic optimization task with partial prior structure. |

---

## 3. Research Trend Signal

Three emerging directions stand out. **First, the pretraining-fine-tuning interface is under renewed scrutiny** — the Muon-AdamW reversal and multi-epoch scaling theory both suggest that conclusions drawn at one compute/data regime may not hold in another, a caution that applies broadly to current scaling practice. **Second, agent evaluation is maturing from capability to consequence**: VeriHarm-Bench, DistDebug-Bench, MCP poisoning, Four Bridges, and DiabAgent all measure what happens *after* an agent acts in a realistic environment, including harm, side effects, and sustained physiological outcomes. This convergence suggests the field is building the safety and reproducibility infrastructure that agentic deployment demands. **Third, continual learning and efficient adaptation are being re-attacked with spectral and sparse-plasticity methods** (BISECT, RASP, LoL), reflecting the practical reality that deployed models must update without parameter growth or catastrophic forgetting. Alongside these, the appearance of papers applying LLM agents to Earth system models, power grids, and formal demography indicates that domain scientists are now driving agentic AI research questions rather than merely consuming general capabilities.

## 4. Worth Deep Reading

1. **[Strategist: Evolving Reasoning with Agents](http://arxiv.org/abs/2611.03618v1)** — The framing of inference strategy as a learnable, transferable artifact rather than hand-written glue code is a genuinely fresh contribution. If the meta-agent approach generalizes, it changes how agent systems are architected and how reasoning research compounds across tasks.

2. **[Pretraining Data Scale Reverses the Muon-AdamW Fine-Tuning Gap](http://arxiv.org/abs/2611.03633v1)** — Optimizer choice is one of the highest-leverage decisions in LLM training, and this paper delivers a counterintuitive, scale-dependent result that directly challenges current best practice. The experimental design is also worth studying as a template for probing optimizer behavior at the pretraining–fine-tuning boundary.

3. **[VeriHarm-Bench: Measuring Harmful Success in LLM Coding Agents Verifiably](http://arxiv.org/abs/2611.03575v1)** — As coding agents gain shell access in real deployments, "task succeeded but system damaged" is a dominant failure mode that existing benchmarks miss. The verifiable harmful-success framing is likely to become a standard component of agent safety evaluation.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*