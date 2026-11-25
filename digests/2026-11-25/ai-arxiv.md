# ArXiv AI Research Digest 2026-11-25

> Source: [ArXiv](https://arxiv.org/) (cs.AI, cs.CL, cs.LG) | 50 papers | Generated: 2026-11-25 04:05 UTC

---

# ArXiv AI Research Digest — 2026-11-24

## 1. Today's Highlights

Today's submissions reveal a strong push toward **making model internals more efficient and interpretable** rather than simply scaling further. Hidden-state refinement in masked diffusion language models, gradient-aligned experience evolution for self-improvement, and principled token-selection analyses in long-context attention all question the default recipe of "more parameters, more data." A second cluster targets **reliable evaluation of agents and multimodal systems**—from within-task hazard curves for AI agents to audits showing that multi-image MLLM benchmarks are often solvable from a single image. Domain applications continue to mature, with clinical reasoning grounded in formal guideline constraints, hardware code generation benchmarks, and protein/EM analysis pipelines. Notably, **analog in-memory computing** (paper 50) and **constant-storage fractal weight synthesis** (paper 9) both hint at a rising interest in hardware-aware generation and storage efficiency.

---

## 2. Key Papers

### 🧠 Large Language Models

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [On the Importance of Hidden-State Refinement in Masked Diffusion Language Models](http://arxiv.org/abs/2611.32416v1) | Linhao Zhong, Bozhen Fang, Xuehao Wang et al. | Analyzes how iteratively denoising hidden-state trajectories affects MDLM generation quality, showing that refining hidden states—not just tokens—improves bidirectional conditioning. This reframes how parallel-token diffusion LLMs should be trained and sampled. |
| [Evolve to Learn: Gradient-aligned experience evolution for model self-improvement](http://arxiv.org/abs/2611.32390v1) | Haoyuan Li, Gangyi Zhang, Dong Wang et al. | Proposes aligning test-time experience with gradient direction so that on-policy self-distillation internalizes useful reflections into the model. It bridges prompt-level self-improvement with weight-level updates. |
| [When Exact Token Importance Is Not Enough: Limits of Top-K Selection in LLM Attention](http://arxiv.org/abs/2611.32324v1) | Irmaan Mirzanejad | Demonstrates that individually top-ranked tokens need not form a good set once attention is renormalized over the selection. This exposes a fundamental flaw in common Top-K sparse attention heuristics. |
| [Beyond Autoregression: Diffusion Language Model is All Analog In-Memory Computing Need](http://arxiv.org/abs/2611.32223v1) | Yuanuo Feng, Yubing Ye, Yizhe Chen et al. | Shows diffusion LMs are more robust than autoregressive models to hardware non-idealities in analog in-memory computing, since tokens are revisable rather than committed. A promising hardware-algorithm co-design direction. |
| [Seldon TFM family: Seldon-Mini, Seldon and Seldon+](http://arxiv.org/abs/2611.32257v1) | Stanislas Angebault, Nicolas Atienza, Nicola Cancedda et al. | Introduces a family of tabular foundation models that ranks first on TabBench and BeyondArena IID classification among 15 baselines. Signals foundation-model-style pretraining is now competitive on tabular data. |
| [DAiSy: Online Data Selection by Adaptive Utility Estimation for LLM Pretraining](http://arxiv.org/abs/2611.32294v1) | Simin Fan, Martin Jaggi | Replaces full forward-backward utility scoring with an adaptive estimator, enabling scalable online data selection during pretraining. Lowers the compute barrier to model-aware data curation. |

### 🤖 Agents & Reasoning

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Within-task hazards of AI agents: unidentified by time-horizon curves, identified by repeated runs](http://arxiv.org/abs/2611.32415v1) | Ruiqi Zhao | Argues that survival-model time-horizon curves mask within-task hazard dynamics, which only repeated runs can expose. A methodological wake-up call for agent reliability evaluation. |
| [The Control-Flow Tax: Specialized Decision Routing for LLM Agent Workflows](http://arxiv.org/abs/2611.32365v1) | Zhikai Cheng, Shuanghu Wang, Li Jiang | Identifies a "control-flow tax" where 42.5% of cost goes to routing decisions, and proposes specialized decision routers. Directly targets a hidden cost center in production agent workflows. |
| [Alpha-Beta Pruning via Monadic Continuations](http://arxiv.org/abs/2611.32320v1) | Martín Escardó, Paulo Oliva | Gives a monadic (continuation + reader) formulation of alpha-beta pruning. Connects classic game-tree search to modern functional-programming abstractions with potential for verified implementations. |
| [Verify then Steer: Progress Hallucination-Aware Recovery for Continuous Vision-and-Language Navigation](http://arxiv.org/abs/2611.32400v1) | Jiewen Hou, Guanxiang Qi, Meina Kan et al. | Adds instruction-progress verification and steering to let VLN agents recover from route deviations at test time. Improves robustness in unseen 3D environments. |
| [Boundary-Aware Policy Learning for Agent-Orchestrated Robot Manipulation](http://arxiv.org/abs/2611.32238v1) | Kaipeng Fang, Yuhao Wang, Ji Zhang et al. | Addresses the moment-of-handoff failure between high-level agent reasoning and low-level visuomotor policies via boundary-aware policy learning. Tackles a key weak link in agent-orchestrated robotics. |

### 🔧 Methods & Frameworks

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [A Framework for Graph Node Symmetric Quantification under Dataset Shift](http://arxiv.org/abs/2611.32403v1) | Alessio Micheli, Alejandro Moreo, Marco Podda et al. | Extends quantification (class-prevalence estimation) to graph nodes under dataset shift. Fills a gap between tabular quantification theory and graph learning. |
| [Optimal Transport Meets t-SNE: Integrated Visualization without Batch Effects in OT-tSNE](http://arxiv.org/abs/2611.32402v1) | Azhar Akhmetova, Edward Eichhorn, Boris Landa et al. | Combines optimal transport with t-SNE to jointly embed datasets while suppressing batch effects. Practical for single-cell and multi-cohort exploratory analysis. |
| [Fractal Neural Synthesis: Constant-Storage Procedural Weight Derivation via Complex Quadratic Boundary Dynamics](http://arxiv.org/abs/2611.32393v1) | Volkan Dagli, Zerrin Dagli, Daghan Dagli | Derives network weights procedurally from fractal boundary dynamics, achieving O(1) persistent storage instead of O(W). A radical direction for edge deployment under tight memory budgets. |
| [SPRUNN: Structural Proximity for Pruning in Deep Neural Networks](http://arxiv.org/abs/2611.32317v1) | Babak Rokha, Ali Azarpeyvanda, Alireza Khanteymoori et al. | Uses structural proximity to decide which weights to prune, aiming to preserve accuracy better than magnitude-only criteria. Useful for compressing large DNNs efficiently. |
| [CoMNO: Commutator Memory Neural Operators for Long-Horizon PDE Prediction](http://arxiv.org/abs/2611.32274v1) | Han Xiao, Xin Zhang, Yuhan Zou et al. | Introduces commutator-based memory in neural operators to curb error accumulation over long PDE rollouts. Addresses a core failure mode of neural surrogates in scientific computing. |

### 📊 Applications

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [ASTERISM: Do Multimodal LLMs Actually Look at All the Images?](http://arxiv.org/abs/2611.32316v1) | Chanseul Cho, Dongwoo Kim, Noori Bae et al. | Audits ~33k items across 19 multi-image benchmarks and finds many are answerable from a single image. Calls for stricter benchmark design to test true cross-image reasoning. |
| [CPU-Eval: Evaluating Large Language Models for CPU Hardware Code Generation](http://arxiv.org/abs/2611.32405v1) | Yuisei Iwata, Yutaka Masuda, Tohru Ishihara | Builds a harder benchmark for HDL generation because VerilogEval pass rates now exceed 90%. Provides headroom to measure real progress in LLM-based hardware design. |
| [Refining and Aligning Clinical Reasoning with Health Guidelines via Formal Constraints](http://arxiv.org/abs/2611.32247v1) | Xiaoyang Fan, Yufan Cai, Zhe Hou et al. | Presents VerClin, which extracts guideline conditions, exclusions, and priorities into formal constraints to make clinical reasoning both explainable and safety-aware. Important step toward auditable medical AI. |
| [DiCT: Teaching X-ray Vision-Language Models to Reason via Imagining CT](http://arxiv.org/abs/2611.32344v1) | Zhenghao Lu, Xiaotian Zhang, Songtao Jiang et al. | Trains X-ray VLMs to reason about 3D structure by generating imagined CT representations. Improves spatial reasoning where 2D projections lose depth. |
| [Sparse Poison, Strong Hijack: Efficient Trajectory-Level Backdoors in Vision-Language-Action Models with Only 1% Poisoning](http://arxiv.org/abs/2611.32304v1) | Simin Huang, Jiawei Chen, Shaolong Zhu et al. | Demonstrates targeted trajectory-level backdoors in VLA models with only 1% poisoned data. Highlights a serious and cheap safety attack on robotic foundation models. |
| [A recursive self-improvement framework for electron microscopy analysis](http://arxiv.org/abs/2611.32325v1) | Yaotian Yang, Sijia Tao, Yuping Zhang et al. | Presents PhyEvo-Mic-RSI, combining physics guidance and expert feedback to recursively improve EM analysis of defects and interfaces. Reduces reliance on subjective researcher judgment. |
| [The Activity Geometry of Discrete Generative Sampling](http://arxiv.org/abs/2611.32380v1) | Xinlong Guo, Jie Zhang, Lingyou Zhou | Frames iterative-refinement discrete diffusion as a geometric process on token activity, offering a unifying view of revision-based samplers. Theoretical grounding for the fast-growing discrete diffusion area. |

---

## 3. Research Trend Signal

Three converging trends stand out. First, **evaluation is being rebuilt from the ground up**: within-task agent hazards, single-image leakage in multi-image MLLM benchmarks, and HDL benchmarks past saturation all point to a community increasingly skeptical of headline numbers. Second, **efficiency is being pursued at unexpected layers**—hidden-state refinement in diffusion LMs, monadic formulations of classic search, fractal weight synthesis, and analog in-memory robustness all attack cost at the architecture or hardware level rather than via more data. Third, **self-improvement is maturing** from prompt engineering toward gradient-aligned, physics-guided, and recursive loops (papers 11, 12, 26). Together, these signals suggest a shift from scaling theater toward principled, hardware- and evaluation-aware progress.

---

## 4. Worth Deep Reading

1. **[Within-task hazards of AI agents: unidentified by time-horizon curves, identified by repeated runs](http://arxiv.org/abs/2611.32415v1)** — Methodologically the most consequential paper today. Time-horizon curves underpin many recent claims about agent reliability; showing they obscure within-task hazards could invalidate downstream conclusions and reshape how agent evaluations are designed.

2. **[When Exact Token Importance Is Not Enough: Limits of Top-K Selection in LLM Attention](http://arxiv.org/abs/2611.32324v1)** — A short but fundamental result. Top-K sparse attention is used throughout long-context systems, and a theoretical argument that individually top-ranked tokens can be collectively suboptimal deserves careful reading by anyone optimizing attention efficiency.

3. **[Beyond Autoregression: Diffusion Language Model is All Analog In-Memory Computing Need](http://arxiv.org/abs/2611.32223v1)** — The most forward-looking paper: it argues diffusion LMs are intrinsically more robust to analog hardware noise than AR models. If validated, this could meaningfully influence both energy-efficient inference hardware and diffusion LM adoption.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*