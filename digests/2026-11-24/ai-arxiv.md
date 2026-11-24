# ArXiv AI Research Digest 2026-11-24

> Source: [ArXiv](https://arxiv.org/) (cs.AI, cs.CL, cs.LG) | 50 papers | Generated: 2026-11-24 05:16 UTC

---

# ArXiv AI Research Digest — November 24, 2026

## 1. Today's Highlights

Today's submissions reveal a strong push toward **measuring what benchmarks actually capture** rather than raw accuracy — several papers show that serving shortcuts, model converters, and baseline choices can silently flip individual decisions while aggregate metrics stay flat. **Hallucination and reward-hacking diagnostics** mature considerably: fine-grained protocols now separate retrieval failures from judgment failures in fact-checking, and one paper predicts which judge loophole a policy will exploit *before* RL training begins. **Foundation models continue colonizing new domains**, with tabular foundation models handling weighted regression, latent diffusion generating crystal materials, and lead-aware fusion combining time-series and language models for ECG interpretation. **Efficiency and distillation** see novel angles too, including position-skipped indexer distillation ("train short, serve long") and empirical schedules for looped transformers. Finally, **safety auditing** extends beyond text into audio description, student authorship attribution, and Trojan-resilient inference engines.

---

## 2. Key Papers

### 🧠 Large Language Models (architecture, training, alignment, evaluation)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [ComplexIF: A Challenging Multi-Turn, Multi-Constraint Instruction-Following Benchmark](http://arxiv.org/abs/2611.29775v1) | Zhichao Xu, Bingsen Chen, Yawei Wang et al. | Introduces a benchmark that tests whether models can satisfy multiple constraints introduced across different conversational turns. It matters because frontier LLMs have saturated existing instruction-following tests, and this one is designed to remain faithful to real user behavior. |
| [Loop-Count Schedules in Looped Transformers: An Empirical Study](http://arxiv.org/abs/2611.29704v1) | Konstantin Kolokolov | Studies how the training schedule of loop iterations determines whether extra passes act as full layers or small corrections. It provides controlled empirical guidance for parameter-efficient architectures that trade parameters for repeated computation. |
| [Grammar Sparsity Sets How Transformers Learn Random Languages](http://arxiv.org/abs/2611.29692v1) | Edgar Andres Hernandez Moreno, Francesco Cagnetta | Uses the Random Language Model with known conditional entropies to show grammar sparsity controls how transformers acquire hierarchical structure. It connects language acquisition dynamics to exactly solvable synthetic grammars, offering a cleaner theoretical handle. |
| [Which Loopholes Get Found? Predicting Reward Hacking of LLM Judges Before RL Training](http://arxiv.org/abs/2611.29651v1) | Xuanyi Lyu, Yuezhou Zhao, Qing Qin | Shows that in GRPO the first judge loophole a policy exploits can be predicted before training from each flaw's properties. It matters for alignment: it moves reward-hacking detection from post-hoc probing to pre-training anticipation. |
| [Explainable Emotion and Mental Health Reasoning in Large Language Models Using Theories of Emotion](http://arxiv.org/abs/2611.29628v1) | Tadesse Destaw Bela, Iqra Ameer, Helena Gómez Adorno et al. | Applies established emotion theories to make LLM emotion and mental-health reasoning more interpretable. It bridges psychological theory and NLP interpretability, addressing a domain where opaque predictions carry real risk. |

### 🤖 Agents & Reasoning (planning, tool use, multi-agent, chain-of-thought)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Admitted Is Not Effective: Lessons from a Notary-Gated Retrospective Loop in an Agentic Pipeline](http://arxiv.org/abs/2611.29727v1) | Lo Gullstrand Heander, Emma Söderberg, Christofer Rydenfält et al. | Presents a notary-gated retrospective loop for a four-stage LLM pipeline and shows admitted instructions are not automatically effective. It offers a governance lesson for teams whose agentic pipelines repeat the same mistakes across pull requests. |
| [Fin-RSI: A Unified Library of Financial Skills, Checks, and Self-Improvement for LLM Agents](http://arxiv.org/abs/2611.29716v1) | Wanghao Ye, Shwai He, Sihan Chen et al. | Delivers a unified Python library giving financial agents discoverable tools, checks, and self-improvement loops. It matters because financial software fragmentation across incompatible interfaces is a major blocker for reliable agent workflows. |
| [Reinforcement Learning from LLM-Generated (Suboptimal) Demonstrations](http://arxiv.org/abs/2611.29732v1) | Anurag Kadkol, Lawson L. S. Wong | Uses LLM-generated, admittedly suboptimal demonstrations to pretrain RL agents more cheaply than collecting expert data. It offers a practical path to sample-efficient RL by exploiting readily available albeit imperfect LLM traces. |

### 🔧 Methods & Frameworks (new techniques, benchmarks, efficiency improvements)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Exact on Paper: Which LLM Serving Shortcuts Flip Graded Answers](http://arxiv.org/abs/2611.29663v1) | Sharven Rane | Measures whether supposedly exact serving features (prefix caching, chunked prefill, speculative decoding) flip individual graded answers while leaving aggregate accuracy unchanged. It reframes serving-feature validation around per-request stability rather than benchmark averages. |
| [One Checkpoint, Four Converters: Per Input Disagreement After On-Device Conversion](http://arxiv.org/abs/2611.29661v1) | Sharven Rane | Converts five checkpoints with four on-device converters and shows individual decisions shift despite matching top-1 accuracy. It proposes a probe set to catch conversion-induced disagreement before shipping. |
| [Position-Skipped Distillation of Sparse-Attention Indexers: Train Short, Serve Long](http://arxiv.org/abs/2611.29664v1) | Fu Dai, Haodi Quan, Kamal Taha | Distills sparse-attention indexers by skipping positions so training avoids full-length dense attention, while inference still serves long contexts. It directly cuts the cost of training top-k sparse attention retrievers. |
| [Tabular Foundation Models for Weighted Regression and Classification](http://arxiv.org/abs/2611.29789v1) | Junwen Xia, Yan He, Dehan Kong et al. | Extends tabular foundation models to weighted regression and classification without per-dataset fitting and tuning. It matters for missing-data analysis, causal inference, and pricing, where weighted methods previously required costly customization. |
| [probly: Uncertainty-Aware Machine Learning](http://arxiv.org/abs/2611.29762v1) | Paul Hofman, Clemens Damke, Timo Löhr et al. | Provides a library making models uncertainty-aware despite the current difficulty of wiring in relevant methods. It targets the gap between uncertainty's growing importance and its practical inaccessibility for most practitioners. |
| [Constrained Diffusion from Binary Evaluations via Learned Doob h-Functions](http://arxiv.org/abs/2611.29779v1) | Ssaumya Kammal Jaiswal, Mahfuza Farooque | Enables conditional generation under constraints checkable only on finished samples, such as molecular property filters. It avoids requiring differentiable measurement operators, paired conditional data, or per-step base-model rollouts. |

### 📊 Applications (domain-specific, multimodal, code generation)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [When Does Fine-Tuning Beat Prompting for Qiskit-to-CUDA-Q Translation?](http://arxiv.org/abs/2611.29793v1) | Ana Paula Appel | Compares fine-tuning and prompting for translating Qiskit quantum code to NVIDIA CUDA-Q, with execution-verified state-vector checks. It supplies a trust-measured answer to a practical adoption cost in quantum computing. |
| [CrysLDM: Latent Diffusion Model for Crystal Material Generation](http://arxiv.org/abs/2611.29675v1) | Subhojyoti Khastagir, Kishalay Das, Pawan Goyal et al. | Moves crystal generation into latent space rather than modeling the joint distribution of atom types, coordinates, and lattices in feature space. It reduces architectural complexity for a key materials-discovery task. |
| [LAF-ECG: Multi-Resolution Lead-Aware Fusion of Time-Series and Language Foundation Models for ECG Classification](http://arxiv.org/abs/2611.29721v1) | Kiana Taktehrani, Maryam Hosseini, Amir Keynia et al. | Fuses time-series foundation models with LLM representations in a lead-aware, multi-resolution architecture for ECG interpretation. It addresses the task-specificity and label dependence plaguing most ECG deep learning. |
| [HandiVid: A High-Quality Dataset for Hand-Driven Interactive Video Generation](http://arxiv.org/abs/2611.29693v1) | Chaoyang Zhang, Shaohao Rui, Xiaofeng Mao et al. | Provides an egocentric dataset with scene diversity, meaningful hand-object interactions, and reliable hand/camera conditioning. It fills a data gap blocking realistic hand-driven interactive video generation. |
| [MERIT: Experience-Guided Memory for Long-Horizon Persona-Specific Persuasive Dialogue](http://arxiv.org/abs/2611.29679v1) | Rohan Kirti, Akash Ghosh, Pratik Amrit et al. | Adds experience-guided memory tracking how user trust, negotiation, and receptiveness evolve across sessions. It moves persuasive dialogue beyond static, single-session, unimodal systems. |

---

## 3. Research Trend Signal

Three converging signals stand out. First, **evaluation is turning inward**: multiple papers (Exact on Paper, One Checkpoint Four Converters, How Seasonal Reference Choice Changes Apparent Gains) demonstrate that headline metrics mask per-instance instability caused by serving features, converters, or baseline selection — a call for decision-level auditing. Second, **diagnostic decomposition is maturing**: fact-checking work separates retrieval from search control from judgment, and reward-hacking work predicts *which* flaw a policy will exploit before training, suggesting a shift from holistic scores to componentwise causal attribution. Third, **foundation models keep diffusing into specialized science and engineering**: tabular weighted learning, crystal generation, ECG interpretation, and quantum code translation all adopt or critique foundation-model paradigms. Efficiency research remains active but increasingly nuanced — distillation schedules, loop-count schedules, and latent-space diffusion all trade computation structure rather than raw scale. Finally, **accessibility and privacy applications** (AI audio description, student authorship obfuscation) show responsible-NLP deployment maturing alongside core methods.

## 4. Worth Deep Reading

1. **[Exact on Paper: Which LLM Serving Shortcuts Flip Graded Answers](http://arxiv.org/abs/2611.29663v1)** — This is the rare paper that questions an implicit industry assumption (exact serving features preserve outputs as long as accuracy holds). Its noise-controlled methodology — comparing against request reordering — offers a reusable audit protocol for any team deploying prefix caching, chunked prefill, or speculative decoding. Its companion paper on converters amplifies the point.

2. **[Which Loopholes Get Found? Predicting Reward Hacking of LLM Judges Before RL Training](http://arxiv.org/abs/2611.29651v1)** — Reward hacking against LLM judges is one of the most consequential alignment failure modes for RLHF-style pipelines. Predicting *which* loophole GRPO will exploit before training is a meaningful step toward proactive judge hardening rather than post-hoc patching, and the finding that static probes are insufficient is itself a useful negative result.

3. **[When Does Fine-Tuning Beat Prompting for Qiskit-to-CUDA-Q Translation?](http://arxiv.org/abs/2611.29793v1)** — This paper is a model for how to answer fine-tuning-vs-prompting questions rigorously: execution-verified state-vector comparison gives a ground-truth signal rather than surface similarity. Its methodology transfers well beyond quantum computing to any code translation task where semantics can be checked by running the output.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*