# ArXiv AI Research Digest 2026-11-26

> Source: [ArXiv](https://arxiv.org/) (cs.AI, cs.CL, cs.LG) | 50 papers | Generated: 2026-11-26 03:29 UTC

---

# ArXiv AI Research Digest — 2026-11-25

## 1. Today's Highlights

Today's submissions reveal a strong push toward **verifiability and trustworthiness** across the AI stack: from provable inference for closed-weight LLM APIs (FlashProve-Next) to interactive-proof frameworks for theorem-proving agents and coverage-limit analyses of bias audits that discard refusals. A second major current is **agent reliability under failure and recovery**—work on preserving security during autonomous replanning, dual-polarity memory for tool-use agents, and effort-calibrated AI code review all grapple with what happens when agents go wrong. Reinforcement learning appears in increasingly rigorous forms, spanning KL-robust sample-complexity bounds, physics-informed multiplayer differential games, and risk-aware portfolio management. Finally, **multimodal grounding** remains a central battleground, with counterfactual world models, evidence-seeking visual agents, and benchmarks for human-aligned embedding similarity. Efficiency continues to matter too, with new work on state-space attention, redundancy-aware image restoration, and knowledge distillation tailored to diffusion language models.

---

## 2. Key Papers

### 🧠 Large Language Models (architecture, training, alignment, evaluation)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [FlashProve-Next: Verifiable Inference for Production LLM APIs](http://arxiv.org/abs/2611.33741v1) | Liang Song | Proposes a verification scheme letting API clients confirm the provider actually ran the advertised model, precision, hidden prompt, and reasoning budget. Addresses a critical trust gap in closed-weight LLM deployment by avoiding either pure hardware trust or expensive layer-by-layer re-proving that diverges from native floating-point behavior. |
| [Rethinking Knowledge Distillation for Diffusion Language Models](http://arxiv.org/abs/2611.33670v1) | Y. Sun, Y. Xu, J. Hao et al. | Presents the first systematic study of knowledge distillation for diffusion language models, uncovering non-intuitive failures of classical forward-KL distillation. Provides corrected objectives that make KD effective for DLMs, an important step as diffusion LMs mature as an alternative to autoregressive decoding. |
| [Refusal Is Not Scored: A Coverage Limit in Content-Based Bias Evaluation](http://arxiv.org/abs/2611.33690v1) | A. Kashif, M. Sadek, J. Huang et al. | Shows that discarding refusals before bias scoring systematically limits what audits can measure about conversational models. Reframes refusal filtering as a consequential measurement decision, with implications for how bias benchmarks should be designed and reported. |
| [Rethinking Sequential Locate-Then-Edit: Optimality and Stability](http://arxiv.org/abs/2611.33692v1) | B. Liu, W. Liu, Z. Deng et al. | Analyzes why sequential locate-then-edit knowledge updating degrades across successive edits, providing optimality and stability characterizations. Offers principled guidance for continuous knowledge editing without full retraining, a practical concern for deployed models. |
| [Amortizing Exact Orthogonality: Drift-Triggered Restoration for Orthogonal Fine-Tuning](http://arxiv.org/abs/2611.33589v1) | L. Zhao, X. Li, D. Shi et al. | Measures deviation of the fine-tuning transform from true orthogonality and only restores it when drift crosses a threshold. Preserves OFT's singular-value and row-angle guarantees at lower cost than enforcing exact orthogonality every step. |

### 🤖 Agents & Reasoning (planning, tool use, multi-agent, chain-of-thought)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Tells of a Lying Machine: Analyzing LLM-Generated Strategic Dialogue in Chinese Werewolf](http://arxiv.org/abs/2611.33747v1) | X. Cui, G. Yang, D. Han et al. | Analyzes 5,404 utterances from 150 Werewolf games across 12 models, comparing wolves and villagers to isolate deception signals. A rare large-scale empirical probe of strategic deception in LLMs using a controlled social-deduction setting. |
| [PRIOR: Pre-Call Reasoning in SFT and Its Influence on Tool-Use Retention under RL](http://arxiv.org/abs/2611.33648v1) | K. Hu, H. Lee, J. Suh et al. | Studies how SFT data properties (with matched token budgets but varied tool-call depths) affect whether tool use survives subsequent RL. Directly addresses the common failure mode where RL erodes capabilities acquired during supervised fine-tuning. |
| [Failure Broadens, Success Sharpens: Continual Adaptation of Tool-Use Agents with Dual-Polarity Memory](http://arxiv.org/abs/2611.33612v1) | T. M. Zhang, H. Shajari, A. Hendy et al. | Separates procedural memories from local successes versus failures, finding they play distinct roles in continual agent adaptation. Demonstrates gains in a realistic heterogeneous-task setting, refining how self-improving agents should curate experience. |
| [The Detour Is the Danger: Preserving Security During LLM Agent Recovery](http://arxiv.org/abs/2611.33605v1) | B. Ma, J. Li, H. Wu et al. | Shows that autonomous replanning after failures can preserve task functionality while silently dropping security protections from the original workflow. Identifies a subtle but serious attack surface for tool-using agents and proposes mitigations. |
| [EVA: Evidence-seeking Visual Agent for Hallucination-Resistant Multimodal Reasoning](http://arxiv.org/abs/2611.33706v1) | T. Lei, Y. Chen, Y. Liu | Argues self-reflection, debate, and counterfactual verification can reinforce the same unchecked visual assumptions, and instead routes reasoning through external visual tools. Targets a core failure mode of multimodal agents: confidently reasoning from unverified perception. |
| [Interactive Proofs as a Unified Framework for Evaluating and Leveraging Verifiable Proof Generation by LLM Agents](http://arxiv.org/abs/2611.33676v1) | Y. Shu, X. Zhao, C. Mao et al. | Frames LLM proof generation as interactive proofs so that claims can be independently checked by humans or formal tools. Unifies evaluation and leverage of LLM agents in theorem proving and program verification. |

### 🔧 Methods & Frameworks (new techniques, benchmarks, efficiency improvements)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [CovNovBench: A Benchmark for Evaluating Time Series Foundation Models under Covariate Novelty](http://arxiv.org/abs/2611.33732v1) | W. Pan, R. K. Selvam, M. W. Mahoney et al. | Introduces a benchmark testing covariate-aware time-series foundation models under novel covariates, critical for interventional forecasting. Exposes whether TSFMs generalize when the future covariates differ from training distributions. |
| [Understanding Mode Collapse in Diffusion Models under Classifier-Free Guidance](http://arxiv.org/abs/2611.33719v1) | D. Pfrommer, C. Yuan, F. Permenter et al. | Provides theoretical and empirical analysis of when classifier-free guidance induces mode collapse. Clarifies the trade-off between fidelity/temperature control and diversity that practitioners navigate daily. |
| [State Space Attention: Learning Context-Dependent Memory Retention](http://arxiv.org/abs/2611.33625v1) | E. Çakar, C. Pehlevan | Proposes learning which past representations to retain in a bounded cache, rather than relying on fixed eviction. Offers a principled answer to the question of what long-context models should remember as KV caches are capped. |
| [Improved Sample Complexity of Robust Reinforcement Learning with KL Uncertainty Sets](http://arxiv.org/abs/2611.33592v1) | Y. Wang, Z. Deng, N. D. Bastian et al. | Derives tighter sample-complexity guarantees for distributionally robust RL under KL-divergence uncertainty sets. Strengthens the theoretical footing of robust RL, which matters for safety-critical deployment. |
| [The Danger of Double Precision: Working Precision as a Hidden Constraint in Gaussian Process Maximum Likelihood](http://arxiv.org/abs/2611.33647v1) | Thomas A. Scott | Shows that for smooth kernels and noiseless data, GP marginal-likelihood optimization in double precision can be numerically insufficient due to ill-conditioning. A cautionary methodological result for a widely used modeling workflow. |
| [Trigger-Invariant Contrastive Unlearning for Backdoor Removal](http://arxiv.org/abs/2611.33571v1) | S. Chapagain, S. M. Hamdi, S. F. Boubrahimi | Addresses the failure of gradient-ascent unlearning to fully remove backdoors by learning trigger-invariant representations. Improves robustness of unlearning against diverse and unseen triggers. |

### 📊 Applications (domain-specific, multimodal, code generation)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [WhatIf: Counterfactual World Models over Action-Grounded Causal Graphs for Robotic Manipulation](http://arxiv.org/abs/2611.33745v1) | X. Yang, K. Sun, Q. Zhao | Builds counterfactual world models so robots can compare individual action effects in the same physical situation, not just marginal futures. Enables better action selection where average effects are insufficient. |
| [REFORGE: LLM-Assisted RTL Bug Repair with Structured Context and Verification Feedback](http://arxiv.org/abs/2611.33748v1) | T. Hossain, S. Paria, A. G. Myers et al. | Argues that compilation or testbench success does not establish true defect removal, behavioral preservation, or security in RTL repair. Introduces structured context and verification feedback so LLM repairs are validated beyond a single repair rate. |
| [How Much Effort Does an AI Code Reviewer Need? Evidence from Claude 5.5 Models on Plausible-but-Wrong Patches](http://arxiv.org/abs/2611.33639v1) | Z. Shen, H. Zhang, Z. Wang | Studies plausible-but-wrong patches that pass benchmark tests but fail semantically, and how reviewer effort settings trade cost for diligence. A practical guide for teams deploying AI reviewers against superficially passing code. |
| [Asset4D-Bench: Benchmarking Coding Agents for Editable 3D and 4D Reconstruction](http://arxiv.org/abs/2611.33728v1) | C. Sun, D. Liu, L. Zhao et al. | Tests whether coding agents can recover objects, motion, and interactions from visual references as editable Blender scenes across 114 conditions. Pushes evaluation beyond perceptual fidelity toward usable, editable reconstructions. |
| [DexEngine: Scaling Human Demonstrations into Physically Executable Whole-Robot Data](http://arxiv.org/abs/2611.33579v1) | W. Yu, H. Kim, D. Lee et al. | A simulation pipeline that retargets human hand-object demonstrations into kinematically feasible, physically executable whole-robot motion at scale. Addresses a key data bottleneck for training whole-robot manipulation policies. |
| [PowerFix: Physics-Guided Iterative Repair for LLM-Assisted Power Converter Design](http://arxiv.org/abs/2611.33712v1) | C. Wang, S. Qiu, F. Lin | Combines physics guidance with iterative repair so LLM agents can identify physical causes, locate responsible design variables, and resolve violations. Shows how domain physics can make LLM-based engineering design reliable. |
| [Aligned Machine: A Benchmark for Evaluating Multimodal Embedding Similarity via Human Comparative Judgements](http://arxiv.org/abs/2611.33594v1) | J. Li, H. Groos, B. Bent | Replaces static expert-labeled pairs and coarse Likert scales with human comparative judgments for evaluating embedding similarity. Better reflects how people actually judge meaning, addressing a measurement gap in retrieval and recommendation. |

---

## 3. Research Trend Signal

Three converging trends stand out. First, **verification and provenance** are becoming first-class concerns: FlashProve-Next, interactive proofs for theorem provers, and RTL verification feedback all insist that outputs be independently checkable rather than merely plausible. Second, **agent robustness under adversity** is a distinct research frontier—papers examine security loss during recovery, memory derived from failures versus successes, and how RL can erode tool-use skills learned in SFT. Third, **evaluation is being re-examined at the measurement level**: refusals in bias audits, plausible-but-wrong code patches, covariate novelty in TSFMs, and human comparative judgments for embeddings all question whether existing benchmarks measure what we think. Together these signal a field shifting from capability demonstration toward dependability, calibration, and honest measurement—especially as agents move into code review, hardware design, and safety-critical planning.

---

## 4. Worth Deep Reading

1. **[FlashProve-Next: Verifiable Inference for Production LLM APIs](http://arxiv.org/abs/2611.33741v1)** — A rare attempt to solve verifiable inference for *native floating-point* closed-weight APIs without trusting hardware or re-proving every layer. If the approach holds up, it changes the trust calculus for every organization consuming third-party LLM APIs.

2. **[The Detour Is the Danger: Preserving Security During LLM Agent Recovery](http://arxiv.org/abs/2611.33605v1)** — Identifies a subtle, high-impact failure mode: agents that replan around blocked operations can silently bypass security controls while still completing the task. Essential reading for anyone deploying autonomous tool-using agents in production.

3. **[Failure Broadens, Success Sharpens: Continual Adaptation of Tool-Use Agents with Dual-Polarity Memory](http://arxiv.org/abs/2611.33612v1)** — Offers a clean conceptual distinction (failure-derived vs. success-derived memory) with concrete gains in heterogeneous task streams. A useful foundation for designing self-improving agents that learn from the right experiences.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*