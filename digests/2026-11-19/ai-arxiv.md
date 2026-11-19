# ArXiv AI Research Digest 2026-11-19

> Source: [ArXiv](https://arxiv.org/) (cs.AI, cs.CL, cs.LG) | 50 papers | Generated: 2026-11-19 02:29 UTC

---

# ArXiv AI Research Digest — 2026-11-18/19

## 1. Today's Highlights

Today's submissions show a marked shift from static, single-shot AI systems toward **closed-loop, self-correcting architectures**: agents that replan, edit their own keys/weights, or learn from real-world feedback rather than frozen checkpoints. A second strong current is **cost-aware dual-system design** — offloading routine decisions from large "System-2" models to lightweight "System-1" components, whether for agent workflows or medical QA. Evaluation research is maturing in parallel, with new benchmarks probing failure modes that headline scores obscure: governed ML experimentation, research overstatement by LLMs, and out-of-distribution generalization in scientific surrogates. Embodiment also returns in force, from robot co-design with physical video feedback to motion skills for VR sparring. Finally, several papers interrogate **the internals of models** — sink tokens, uncertainty propagation, and attribution stability — signaling a continued push toward interpretability and trust.

## 2. Key Papers

### 🧠 Large Language Models (architecture, training, alignment, evaluation)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Beyond Replacement: Levenshtein Editing for Diffusion Language Models](http://arxiv.org/abs/2611.23750v1) | Shuaidi Wang, Zhuocheng Gong, Xuejie Liu et al. | Introduces Levenshtein-style editing operations (beyond simple substitution) for revising decoded tokens in diffusion language models. This expands the decoding flexibility of DLMs, potentially improving any-order infilling quality over replace-only revision schemes. |
| [Reliability is a user-specific property of large language models](http://arxiv.org/abs/2611.23732v1) | Xingyu Zhao | Argues that LLM reliability should be assessed relative to specified users and usage conditions, drawing on traditional software reliability engineering. It reframes benchmark rankings as inadequate proxies for the reliability individual users actually experience. |
| [Language Models Make New Research Sound Old](http://arxiv.org/abs/2611.23546v1) | Guy Zyskind | Shows LLMs systematically overstate the extent to which open research questions are already studied, making novel work seem derivative. This has direct implications for the growing practice of using LLMs to validate research novelty. |
| [Learning through Discernment: when a small language model learns from user feedback on the job, and when it decays](http://arxiv.org/abs/2611.23716v1) | Sirisilp Kongsilp | Studies on-device small models that improve overnight from their own daily work, examining when self-judgment and user feedback lead to gains versus model decay. It provides a realistic account of continual on-the-job learning without true outcome signals. |
| [BOS Summary: The First Token Matters](http://arxiv.org/abs/2611.23508v1) | Hui Zhu, Saleh Zare Zade, Rafi Ibn Sultan et al. | Investigates attention sinks by clarifying that under causal masking the BOS query attends only to itself, challenging common interpretations of sink behavior. This sharpens the mechanistic understanding of attention patterns in both LLMs and LVLMs. |

### 🤖 Agents & Reasoning (planning, tool use, multi-agent, chain-of-thought)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [RePlan-VLA: Progress-Aware Replanning for Long-Horizon Vision-Language-Action Models](http://arxiv.org/abs/2611.23843v1) | Apoorva Vashisth, Manav Kulshrestha, Damon Conover et al. | Offloads long-horizon reasoning from VLA policies into a progress-aware replanning module rather than burdening the policy with memory and planning. This targets the well-known degradation of VLA models on multi-step interdependent manipulation tasks. |
| [Evidence-Based Credit Assignment for Search-Augmented Language Models](http://arxiv.org/abs/2611.23824v1) | Wen Wang, Jindong Wang, Jiahua Bao et al. | Addresses the flaw that outcome-reward RL assigns identical credit to every retrieval in a trajectory, regardless of usefulness. Evidence-based credit assignment could substantially improve how search-augmented models learn to retrieve. |
| [Thinking Fast, Anywhere: One System-1 for the Decision Points of Any Agent Workflow](http://arxiv.org/abs/2611.23751v1) | Rui Li, Liyang He, Zheng Zhang et al. | Proposes a single lightweight System-1 model that handles low-stakes decision points across arbitrary agent workflows, removing the need for workflow-specific dual-system setups. This directly attacks the cost and latency of invoking large models at every step. |
| [ARISE: Practical Self-Evolving Memory for Accurate and Cost-Efficient Enterprise Agents](http://arxiv.org/abs/2611.23588v1) | Jiangyun Zhang, Zhou Tang, Kristen Surrao et al. | Presents a memory architecture in which enterprise agents refine themselves through iterative self-evaluation as models and workflows change. It targets the practical requirement that deployed agents stay accurate and cost-efficient over time. |
| [LProp: Propagating Latent Uncertainty through Evidence-Conditioned Belief Revision in LLM Agents](http://arxiv.org/abs/2611.23564v1) | Kaiwen Shi, Zheyuan Zhang, Weixiang Sun et al. | Proposes propagating latent (non-scalar) uncertainty so downstream agent decisions can revise inherited beliefs as new evidence arrives. It tackles the failure mode where tentative intermediate judgments get treated as facts. |
| [GRAFT: Execution-Guided Genetic Recombination for Agent Design](http://arxiv.org/abs/2611.23509v1) | Sevda Ebrahimi, Mohammed Saidul Islam, Xiaodan Zhu et al. | Guides evolutionary recombination of agent architectures with execution feedback rather than language-model crossover alone. This improves the reliability of automated searches for better task decomposition, coordination, and verification mechanisms. |
| [RefinementGuard: Counterexample-Directed Semantic Qualification for Hidden Agent-Tool Execution](http://arxiv.org/abs/2611.23611v1) | Adhyayan Veer Singh, Fanjiang Ye, Yuke Wang | Introduces translation validation for hidden, effectful agent-tool lowerings, coupled with fail-closed runtime admission. It guards against semantic mistranslation when runtimes parallelize agent-selected operations. |

### 🔧 Methods & Frameworks (new techniques, benchmarks, efficiency improvements)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [RoboBuilder: Agentic Robot Co-Design with Real-world Video Feedback in the Loop](http://arxiv.org/abs/2611.23855v1) | Ghadi Nehme, Dahyun Nam, Akshay Govind Srinivasan et al. | Presents a benchmark where coding agents co-design robot hardware and programs, with every simulation-passing design physically built and tested. It uniquely closes the sim-to-real loop with real-world video feedback. |
| [Metrics-in-the-Loop: Complexity Feedback Reshapes Agent-Written Code](http://arxiv.org/abs/2611.23817v1) | Nicolas Chapados, Jean-François Gagné, Nouha Dziri | Adds inference-time complexity and coverage metrics as feedback to coding agents that otherwise optimize only for passing tests. This addresses the accumulation of hidden complexity as agents extend their own code. |
| [Continual Tool-Space Extension Learning for Multimodal Agents](http://arxiv.org/abs/2611.23810v1) | Jinbae Seo, Jungin Park, Hyunsung Jang et al. | Studies how to add specialist vision models as new tools to already-trained multimodal agents without catastrophic forgetting. It tackles efficient per-tool learning while retaining prior tool competence. |
| [Evaluating Governed LLM-Driven ML Experimentation: Lifecycle, Provenance, and Failure Metrics](http://arxiv.org/abs/2611.23678v1) | Dowling Wong | Argues that autonomous ML experiment agents should be judged on process — file boundaries, retained failures, decision provenance — not just best score. It supplies lifecycle and failure metrics for governed evaluation. |
| [FutureBench: A Renewable Framework for Evaluating Knowledge-Context Conflict in LLMs](http://arxiv.org/abs/2611.23601v1) | Yi-Cheng Lai, Hen-Hsen Huang | Offers a renewable benchmark using timestamped questions, controlled passage triplets, and no-context probes to test when models trust retrieved text over parametric knowledge. Across 3,629 questions and six models, it reveals systematic verification behaviors. |
| [Entropy-Regularized Integrated Gradients for Stable Feature Attribution](http://arxiv.org/abs/2611.23600v1) | Rukmangadh Sai Myana, Sumit Kumar Jha, Yanzhao Wu | Introduces ERIG to stabilize Integrated Gradients against imperceptible input perturbations that drastically alter attribution maps. This improves the trustworthiness of path-based explanations without changing predictions. |

### 📊 Applications (domain-specific, multimodal, code generation)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [A System 1 Decision Model for Medical Multiple-Choice Questions Built on Frozen Language Models](http://arxiv.org/abs/2611.23832v1) | Pavan Kumar Mantha | Builds a single-pass medical MCQ classifier from a frozen language model plus two small trained heads that place questions and options in a shared space. It shows strong agent-decision designs transfer to the medical domain at low cost. |
| [Diagnostic Accuracy and Navigation Behavior of Vision-Language Model Agents Reading Emergency CT and MRI Examinations](http://arxiv.org/abs/2611.23480v1) | Jonathan Lichtle, Aymen Meddeb, Antonin Birot et al. | Evaluates six VLMs reading 100 emergency CT/MRI exams under varying exploration strategies. It links diagnostic accuracy to image navigation behavior, informing how agentic radiology tools should be designed and assessed. |
| [Auditable Clinical Support with Decision Agents](http://arxiv.org/abs/2611.23700v1) | Tiancheng Bao, Riga Wu, Jan Wienhold et al. | Presents decision agents whose written reasoning is made to reflect the factors actually driving assessments, addressing the gap between free-text rationales and true decision basis. This matters for clinician trust in diagnostic work-ups. |
| [SpecLook: Speculating Where to Look for Fast and Reliable Agentic MLLMs](http://arxiv.org/abs/2611.23483v1) | Xi Ding, Jiawei Zhang | Speculates zoom-in locations to avoid the slow sequential think-with-images loop, while attaching a reliability score to answers. It targets both latency and the lack of confidence signals in agentic multimodal reasoning. |
| [Toaster: Nonlinear Memory from Cascaded Linear Memories and Target Propagation](http://arxiv.org/abs/2611.23648v1) | Zeman Li, Ali Behrouz, Yuan Deng et al. | Combines exact, fast-to-train linear memories (DeltaNet, KDA) into nonlinear recurrent memory via cascading and target propagation. It offers a path to richer long-sequence memory without sacrificing training efficiency. |

## 3. Research Trend Signal

Three converging trends stand out. First, **self-improving and self-correcting loops** are becoming standard: ARISE, Metrics-in-the-Loop, GRAFT, and the on-device discernment study all treat models as systems that refine themselves during deployment, not fixed artifacts. Second, **evaluation is turning process-aware**: Governed ML Experimentation, MANGO Arena, FutureBench, and RoboBuilder judge *how* results are produced — provenance, failure retention, physical validity, trust calibration — rather than terminal accuracy alone. Third, **cost stratification** is maturing: System-1/System-2 splits for agents and medical QA, latent uncertainty propagation, and speculation in MLLMs all seek to spend compute where it matters. Underneath, interpretability work (sink tokens, ERIG, Levenshtein editing) keeps probing model internals to make these fast paths trustworthy.

## 4. Worth Deep Reading

1. **[RoboBuilder: Agentic Robot Co-Design with Real-world Video Feedback in the Loop](http://arxiv.org/abs/2611.23855v1)** — Rare among today's papers, it closes the loop from simulation to *physically built and tested* robots, making it a valuable benchmark for evaluating whether agentic design generalizes beyond digital substrates.

2. **[Evidence-Based Credit Assignment for Search-Augmented Language Models](http://arxiv.org/abs/2611.23824v1)** — A focused, high-leverage fix to a fundamental flaw in outcome-reward RL for retrieval agents; the implications for search-augmented training are broad and immediately actionable.

3. **[Thinking Fast, Anywhere: One System-1 for the Decision Points of Any Agent Workflow](http://arxiv.org/abs/2611.23751v1)** — If the claim of a single workflow-agnostic System-1 model holds, it could collapse the cost and engineering overhead of dual-system agent deployments, a practical direction with wide applicability.

*Digest compiled from 50 ArXiv submissions (cs.AI, cs.CL, cs.LG and cross-lists), 2026-11-17 to 2026-11-18.*

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*