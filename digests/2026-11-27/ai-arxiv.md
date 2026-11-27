# ArXiv AI Research Digest 2026-11-27

> Source: [ArXiv](https://arxiv.org/) (cs.AI, cs.CL, cs.LG) | 50 papers | Generated: 2026-11-27 03:35 UTC

---

# ArXiv AI Research Digest — 2026-11-27

## 1. Today's Highlights

Today's submissions reveal a maturing field grappling with the limits and trustworthiness of deployed systems rather than chasing raw capability gains. A notable cluster of work interrogates **evaluation validity**: monitor classifiers can be misled by attack policy selection, LLM routing benchmarks may lack the prompt-specific variation that makes routing meaningful, and professional deep-research benchmarks need knowledge-centric scoring rather than surface report quality. On the architecture side, **looped and recurrent designs** (Mixture-of-Loops Transformer, LoopTitan) are being rigorously stress-tested for whether parameter revisit genuinely buys expressivity or merely efficiency tricks. A third thread concerns **repairing and monitoring degraded models** — distilled LLMs, tabular foundation models under shift, and world models that cannot express doubt. Finally, coding agents emerge as surprisingly strong visual reasoners, challenging the assumption that video generation models are the natural substrate for visual reasoning.

---

## 2. Key Papers

### 🧠 Large Language Models (architecture, training, alignment, evaluation)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Mixture-of-Loops Transformer](http://arxiv.org/abs/2611.34923v1) | Zhu, Wang, Wang et al. | Introduces a looped Transformer variant that rethinks what is passed between adjacent loops, targeting a better expressivity-efficiency frontier than standard looped Transformers. Matters because looped architectures are a leading path to deeper effective networks without proportional parameter growth. |
| [LoopTitan: What Does Parameter Revisit Buy a Mixture-of-Experts?](http://arxiv.org/abs/2611.34821v1) | Tian, Lu, Wu et al. | Re-examines reported gains of looped MoE architectures at matched parameter, FLOP, and KV-cache budgets, questioning whether improvements are real or accounting artifacts. Provides a needed methodological corrective for a fast-growing subfield. |
| [Tokenisation is not in APX](http://arxiv.org/abs/2611.34938v1) | Kastreva, Whittington, Komm et al. | Proves that unless P=NP, no polynomial-time algorithm can approximate optimal tokenisation within any constant factor, for direct and bottom-up schemes. A fundamental complexity result with direct implications for how we design and evaluate tokenisers. |
| [Repairing the Trustworthiness of Distilled Language Models](http://arxiv.org/abs/2611.34831v1) | Shubham, Vyas, Agarwal et al. | Shows knowledge distillation can silently regress trustworthiness even when downstream accuracy is preserved, and proposes a repair procedure. Important for anyone deploying compressed models where the original distillation corpus is unavailable. |
| [DFly2: Turbocharging Long-Context Speculative Decoding by Sharing the Target's Sparsity](http://arxiv.org/abs/2611.34776v1) | Liu, Cen, Shi et al. | Enables drafters in speculative decoding to inherit the target model's native attention sparsity instead of maintaining their own dense context cache. Directly addresses the memory bottleneck of speculative decoding on natively sparse long-context models. |
| [One Model, Many Modes: Evolving System Prompt Ensembles for Creative Generation](http://arxiv.org/abs/2611.34760v1) | Chen, He, Yao et al. | Combats mode collapse in preference-aligned LLMs by evolving an ensemble of system prompts to jointly optimize quality, novelty, and diversity. Offers a test-time approach that doesn't require retraining the base model. |

### 🤖 Agents & Reasoning (planning, tool use, multi-agent, chain-of-thought)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Attack Policy Selection can Mislead Monitor Evaluators](http://arxiv.org/abs/2611.34934v1) | Griffin, Makins, Stickland et al. | Demonstrates on an ex-production OpenAI monitor that measured false-negative rates depend heavily on which attack policy is used as a proxy for dangerous behavior. A critical caution for AI control evaluations that rely on synthetic attack transcripts. |
| [Diverse Alternative Reasoning Traces for Hard Math Problems](http://arxiv.org/abs/2611.34928v1) | Aichberger, Golinski, Blaas et al. | Proposes generating diverse alternative reasoning traces when accepted traces are rare under independent Monte Carlo sampling on hard math problems. Expands the supply of verifiable training signal for mathematical reasoning post-training. |
| [When Every Rollout Fails: Splicing Learner-Conditioned Options into Long-Horizon Agent RL](http://arxiv.org/abs/2611.34777v1) | Hou, Liu, Huang et al. | Addresses the all-fail group problem in group-based RL with verifiable rewards by splicing learner-conditioned options rather than injecting full solutions from a stronger model. Keeps the policy gradient informative without off-policy shortcuts. |
| [Solve Vision with Code: Coding Agents Are Stronger Visual Reasoners Than Video Models](http://arxiv.org/abs/2611.34813v1) | Luo, Yu, Zhang et al. | Finds that coding agents outperform video generation models on visual reasoning tasks when reasoning is expressed through code rather than native visual rollout. Challenges the assumption that visual reasoning should be native to the visual medium. |
| [TASK Memory: Beyond Text-Only Memory with Activation Steering and Knowledge Editing against Memory Hallucination](http://arxiv.org/abs/2611.34762v1) | Zhao, Wu | Targets "use-time" memory hallucinations where the correct memory is retrieved but the model contradicts or misapplies it, using activation steering and knowledge editing. Shifts focus from retrieval quality to the model's faithful use of retrieved content. |

### 🔧 Methods & Frameworks (new techniques, benchmarks, efficiency improvements)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Routeability Before Routing: Routeability Audit Protocol (RAP) and RouteabilityBench](http://arxiv.org/abs/2611.34825v1) | Lu, Kjorvezir, Gjorgjevikj et al. | Introduces a protocol and benchmark to verify that a benchmark actually contains enough prompt-specific variation for LLM routing to be meaningful. Exposes a silent validity problem in routing research on coarse-scored benchmarks. |
| [DRBench Pro: A Knowledge-Centric Benchmark for Professional Deep Research Agents](http://arxiv.org/abs/2611.34852v1) | Huang, Yan, Wu et al. | Provides knowledge-centric evaluation of which research directions a deep-research report covers and how deeply, beyond existing report-quality dimensions. Fills a gap in assessing genuine research coverage rather than prose polish. |
| [When to Trust a PFN: Detecting Harmful Shift in Tabular Foundation Models](http://arxiv.org/abs/2611.34767v1) | Nguyen, Bergström, Rabanser et al. | Proposes CALD, a lightweight unsupervised monitor that warns when tabular prior-fitted networks may fail under distribution shift. Addresses silent deployment failures in a class of models increasingly used in practice. |
| [$μ$-Bench: Benchmarking Multi-User Task Completion in Shared Interaction Voice Agents](http://arxiv.org/abs/2611.34920v1) | Lin, Chen, Zheng et al. | Introduces a benchmark for voice agents handling interdependent multi-user requests while respecting per-user authority and privacy. Extends agent evaluation to the under-explored shared-space, multi-party setting. |
| [Not all world models can doubt: how training objective and architecture shape epistemic uncertainty in JEPA and RSSM world models](http://arxiv.org/abs/2611.34830v1) | Baur, Samek, Ma | Compares JEPA and RSSM world models on whether they can express epistemic uncertainty, linking training objective and architecture to doubt calibration. Critical for action selection where unreliable predictions must be detected. |

### 📊 Applications (domain-specific, multimodal, code generation)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [How Much Do Coding Agents Over-Edit, and Why?](http://arxiv.org/abs/2611.34875v1) | Goel, Steenhoek, Hu | Introduces Delta Residue Attribution to trace which blocks of agent patches are actually needed versus over-edits, beyond simple patch-size comparisons. Provides actionable diagnosis for improving repository-level coding agents. |
| [A gene informed benchmark for BioScoring of pathology foundation models](http://arxiv.org/abs/2611.34930v1) | Vilars, Trinh, Vakalopoulou et al. | Proposes BioScore, a benchmark quantifying how well pathology foundation models represent underlying biology rather than just downstream task performance. Moves evaluation from usefulness toward biological fidelity. |
| [What a Drop Reveals: Sim-to-Real Material Estimation for Deformable Objects from Video](http://arxiv.org/abs/2611.34894v1) | Peng, Hu, Kim et al. | Estimates density-normalized stiffness and yield stress of deformable objects from a single real drop video using a predictor trained only in simulation. Demonstrates practical sim-to-real transfer for physical property inference. |
| [RePace: Reasoning about Demonstration Speedup for Faster Vision-Language-Action Policies](http://arxiv.org/abs/2611.34864v1) | Lee, Jeon, Shin et al. | Reasons about how to speed up human demonstrations before fine-tuning so VLA policies run faster without a deployment-time speed selector. Tackles the slow-pace inheritance problem in robot learning from demonstration. |
| [The Linguistic Knowledge Benchmark: Do Language Models Know the Foundations of Early-Grade Literacy?](http://arxiv.org/abs/2611.34823v1) | Lelièvre, Mackintosh, Andrews et al. | Tests whether LLMs hold foundational linguistic knowledge for low-resource languages of instruction in LMICs. Important for assessing whether models can support early-grade literacy where training data is scarce. |

---

## 3. Research Trend Signal

A clear signal today is **evaluation validity as a first-class research problem**. Multiple papers argue that our benchmarks and monitors may be measuring the wrong thing: routing benchmarks that lack routeable variation, monitors whose false-negative rates depend on which proxy attack policy was chosen, deep-research benchmarks that score prose rather than knowledge coverage, and agent patches measured by size rather than necessity. In parallel, **uncertainty and self-doubt** are being treated as architectural properties rather than post-hoc add-ons — world models are compared on whether they *can* doubt, tabular PFNs get shift monitors, and memory systems confront use-time hallucination after successful retrieval. Finally, **looped/recurrent architectures** are undergoing a skeptical second wave: the field is no longer satisfied with reported gains and is demanding matched-budget accounting. Together these point to a field shifting from "can we build it?" toward "can we trust what we measured?"

---

## 4. Worth Deep Reading

1. **[Tokenisation is not in APX](http://arxiv.org/abs/2611.34938v1)** — A rare complexity-theoretic hardness result for a component almost every NLP pipeline depends on. If inapproximability holds for tokenisation, it reframes tokeniser design from an optimization problem into a heuristic-engineering discipline, and it will likely be cited whenever someone claims an "optimal" tokeniser.

2. **[Attack Policy Selection can Mislead Monitor Evaluators](http://arxiv.org/abs/2611.34934v1)** — AI control and monitoring evaluations increasingly inform safety claims. This paper shows those evaluations can be gamed or accidentally distorted by the choice of proxy attack policy, with a concrete ex-production monitor case study. Essential reading for anyone doing or consuming AI safety evaluations.

3. **[Not all world models can doubt](http://arxiv.org/abs/2611.34830v1)** — Connects training objective and architecture to whether a world model can represent epistemic uncertainty, with implications for model-based RL and embodied agents. The JEPA vs. RSSM comparison gives a concrete, testable framing for a problem that is usually discussed only abstractly.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*