# ArXiv AI Research Digest 2026-11-18

> Source: [ArXiv](https://arxiv.org/) (cs.AI, cs.CL, cs.LG) | 50 papers | Generated: 2026-11-18 02:50 UTC

---

# ArXiv AI Research Digest — 2026-11-18

## 1. Today's Highlights

Today's submissions show a strong pivot toward **making agentic and long-context systems actually work in production**, rather than chasing raw capability. Multiple papers converge on the idea that memory, tool outputs, and generated content are not automatically trustworthy — evidence governance, reversibility classes, and regime-aware memory routing appear as first-class design concerns. On the efficiency side, MoE systems receive attention from complementary angles: activation compression for expert parallelism, causal interventions on routing paths, and adaptive temperature calibration for quantized models. Quantization itself is reframed as a safety-relevant perturbation rather than a mere compression trick. Finally, a notable undercurrent questions whether heavyweight primitives (RAG pipelines, Transformers, full-precision sampling) are actually necessary, with minimal-baseline studies challenging assumed defaults.

---

## 2. Key Papers

### 🧠 Large Language Models (architecture, training, alignment, evaluation)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Learning Optimal Transport Plans Via Autoregressive Token Regression](http://arxiv.org/abs/2611.22218v1) | Jaen Marquez, Chytas, Singh et al. | Trains autoregressive models to amortize optimal transport plan computation, treating OT as a testbed for learned solvers. Matters because OT is a bottleneck in generative modeling and matching tasks. |
| [Sample-efficient Personalization of LLM Alignment with Multidimensional User Preference Data](http://arxiv.org/abs/2611.22210v1) | Zhang, Huang, Niu et al. | Proposes a sample-efficient approach to personalized preference alignment using multidimensional user data. Relevant as one-size-fits-all alignment gives way to per-user adaptation. |
| [Is 4-Bit Quantization More Than Noise to a Chat Model's Safety Behaviour?](http://arxiv.org/abs/2611.22186v1) | Ege Kaya | Attributes quantization-induced safety shifts using matched perturbations of equal magnitude. Important for auditing deployed 4-bit models where refusal behavior may silently change. |
| [Long-Context Generation Is a Sampling Problem (When You Turn Up the Heat)](http://arxiv.org/abs/2611.22148v1) | Roush, Nguyen, Shwartz-Ziv et al. | Shows that sampler choice, not training, governs long-context degradation at high temperature. Reframes a widely observed failure mode as an inference-time fixable issue. |
| [TempQuant: Learning Adaptive Temperatures for Quantized Language Models](http://arxiv.org/abs/2611.22128v1) | Athmaram, Ma, Rao | Learns per-model adaptive decoding temperatures to compensate for quantization-induced probability distortion. Bridges the quantization and sampling literatures. |
| [What MoE Routing Controls: Causal Interventions on Expert Trajectories](http://arxiv.org/abs/2611.22120v1) | Athmaram, Rao, Ma | Forces tokens onto chosen expert paths via fixed biases to causally probe MoE behavior. Provides rare interpretability evidence for what routing actually controls. |
| [TeleChat to Xing4: Advancing Frontier Agentic Models on Domestic Chips and Frameworks](http://arxiv.org/abs/2611.22115v1) | Xingchen AGI Lab et al. | Describes the Xing 4 model series trained end-to-end on Ascend hardware and domestic frameworks. Signals a maturing non-NVIDIA training stack for frontier-scale models. |
| [Weight-Space Programming Doesn't Need Transformers](http://arxiv.org/abs/2611.22055v1) | Ok, Lee | Argues that Transformer inductive biases are unnecessary when LLMs hand-write weights without gradient descent. Challenges architecture orthodoxy in the emerging weight-programming paradigm. |

### 🤖 Agents & Reasoning (planning, tool use, multi-agent, chain-of-thought)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [RAG in a Trenchcoat: When Minimal Memory Is Enough for Agentic Systems, and When It Isn't](http://arxiv.org/abs/2611.22179v1) | Liu, Li, Xu et al. | Shows via the BRIDGE benchmark that most sophisticated memory primitives fail to justify their cost. A sobering empirical check on agentic memory research. |
| [Not All Evidence Is Admissible: Evidence Governance for Tool-Augmented Medical Agents](http://arxiv.org/abs/2611.22169v1) | Zhang, Catalano, Wang et al. | Demonstrates that silent tool failures flip correct answers to wrong and proposes evidence governance. Directly addresses a major safety gap in tool-augmented agents. |
| [RegimeCouncil: Paired-Evidence Routing For Memory Conflict Governance In LLM Agents](http://arxiv.org/abs/2611.22113v1) | Kang, Liu, Kai et al. | Routes conflicting memory records using paired evidence before memory updates. Targets the under-explored problem of stale facts in long-term agent memory. |
| [EvoDisco: Strategy Discovery for Evolving Agent Memory](http://arxiv.org/abs/2611.22102v1) | Liu, Kang, Kai et al. | Learns both memory-transforming operators and the rules that select them, rather than fixing them by design. Advances memory as an evolving rather than static store. |
| [Can You Undo It? Reversibility Classes for AI Agent Actions](http://arxiv.org/abs/2611.22075v1) | Waghmare, Sufi | Introduces a five-level vocabulary with argument-sensitive rules for action reversibility. Provides a concrete safety primitive for tool-using agents. |
| [ATLAS-Finance: Benchmarking AI Agents in Realistic Banking Environments](http://arxiv.org/abs/2611.22085v1) | Lau, Pangas, Finot et al. | Benchmarks frontier agents on under-specified, conflicting-information banking workflows. Extends agent evaluation from toy tasks to economically valuable professional work. |
| [From Sorry to QED: Refining LLM Math Proofs via Angelic Execution](http://arxiv.org/abs/2611.22103v1) | Chen, Liu, Qian et al. | Uses angelic execution to salvage and refine Lean proofs that fail on minor side conditions. Reduces wasted generation when a single lemma application aborts a proof. |
| [From Imperfective Paradox to Moorean Absurdity: Single-Chain Reasoning Lock-In](http://arxiv.org/abs/2611.22188v1) | An-Sheng Jhang | Tests the hypothesis that single-chain reasoning prematurely locks in one interpretation across aspectual and pragmatic ambiguities. Connects linguistic theory to CoT failure modes. |

### 🔧 Methods & Frameworks (new techniques, benchmarks, efficiency improvements)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Communicate the Change: Efficient Expert Parallelism via Activation Compression](http://arxiv.org/abs/2611.22215v1) | Liu, Gala, Reddy et al. | Compresses activations communicated across devices in expert-parallel MoE training and inference. Directly attacks the communication bottleneck limiting MoE scale-out. |
| [RISA: Recoverable Sparse Attention for Block-Diffusion Language Models](http://arxiv.org/abs/2611.22191v1) | Zhong, Ye, Wang | Introduces recoverable sparse attention to address memory-bound KV reads in block-diffusion LMs. Makes long-context parallel decoding tractable. |
| [Readie: Low-Latency Code Sandboxes for AI Agents](http://arxiv.org/abs/2611.22171v1) | Sivaraman, Li, Shi et al. | Builds low-latency code sandboxes decoupling agent harnesses from execution. Addresses a practical startup-latency bottleneck in iterative code-executing agents. |
| [An Optimization Framework for Denoising Generation](http://arxiv.org/abs/2611.22202v1) | Zhou, Zhang, Wright | Reframes noise-unconditioned denoising as gradient ascent on a fixed log-density, analyzing trajectory quality and diversity. Gives theoretical grounding to a widely used heuristic. |
| [Centroid Spectral Coupling: Implicit Alignment and Representation Diversity in SSL](http://arxiv.org/abs/2611.22158v1) | Sepanj, Ghojogh, Moradi et al. | Proposes a single-term SSL objective replacing multiple weighted loss terms. Simplifies the alignment/diversity trade-off central to non-contrastive SSL. |
| [BernBRS: Certified Backward Reachability for Deep Bernstein Neural Networks](http://arxiv.org/abs/2611.22083v1) | Albool, Shoukry | Scales certified backward reachability using Bernstein polynomial networks. Improves formal verification tractability for safety-critical neural controllers. |
| [Bandit Online Submodular Minimisation Using Zeroth-Order Oracles](http://arxiv.org/abs/2611.22130v1) | Farzin, Braun, Shames | Extends bandit submodular minimization to dynamic environments with only zeroth-order feedback. Provides regret guarantees beyond static comparators. |
| [HyCoInfer: Cloud-Edge Collaborative Inference on Heterogeneous GPU-FPGA Architectures](http://arxiv.org/abs/2611.22086v1) | Huang, Zhuge, Hu et al. | Offloads memory-bound decoding to edge FPGAs while cloud GPUs handle prefill. Exploits architectural complementarity to improve serving efficiency. |

### 📊 Applications (domain-specific, multimodal, code generation)

| Paper | Authors | Summary |
| :--- | :--- | :--- |
| [Fine-Grained Japanese Clinical NER: BERT vs. Open-Weight LLMs](http://arxiv.org/abs/2611.22219v1) | Han, Yagahara, Hirata et al. | Controlled comparison of BERT-CRF against open-weight LLMs on fine-grained Japanese clinical extraction. Provides much-needed evidence on LLM sensitivity to generation settings in clinical NLP. |
| [EGS: A Complementary Safety Framework for Educational LLMs](http://arxiv.org/abs/2611.22203v1) | Fei, Guo, Luo et al. | Argues educational safety must go beyond binary refusal for ambiguous student queries. Addresses adolescent-facing deployment risks that generic guardrails miss. |
| [CueClash: Frontier VLMs Judge 3-D Relations Close to the Picture Plane](http://arxiv.org/abs/2611.22180v1) | Soham Dan | Separates 2-D pictorial cues from ground-layout cues to measure shortcut reliance in VLM 3-D reasoning. Exposes a systematic bias masked by photographic benchmarks. |
| [EgoHandWAM: Probing the Role of Hand Motion in Egocentric World Action Modeling](http://arxiv.org/abs/2611.22151v1) | Wang, Jie, Yan et al. | Forecasts wrist/fingertip trajectories and future visual features from egocentric video. Quantifies how much hand motion predicts what a first-person camera will see. |
| [RoboTeam: Benchmarking Vision-Based Multi-Agent Control of Many Robot Arms](http://arxiv.org/abs/2611.22138v1) | Fan, Xie, Zhang et al. | Tests many-arm control in real time without pausing the world or giving ground-truth positions. Closes three gaps in existing multimodal robotics benchmarks. |
| [CorrectCast: Selective Multimodal Context for Precipitation Nowcasting](http://arxiv.org/abs/2611.22178v1) | Wang, Xiong, Zhang et al. | Adds a decoupled residual correction layer to existing nowcasters without retraining backbones. Offers a practical, architecture-agnostic path to better forecasts. |
| [MedGuardBench: A Patient-Oriented Benchmark for Personalized Guardrails](http://arxiv.org/abs/2611.22069v1) | Khosravi, Wen, Sarrafzadeh et al. | Introduces patient-conditioned medication guarding with verdicts and 17 risk categories. Moves safety evaluation from content-level to person-level judgments. |
| [Every Measurement, Every Direction, All at Once: Multimodal Flow Matching for Molecules and Spectra](http://arxiv.org/abs/2611.22098v1) | Prein, Pan, Gómez-Bombarelli et al. | Uses all coupled measurement directions in flow matching rather than a single direction. Extracts more supervision from expensive scientific experiments. |
| [Segmentation-Guided Direct Capacity Estimation of Rooftop Photovoltaics](http://arxiv.org/abs/2611.22076v1) | Chen, Fan, Lin | Estimates rooftop PV capacity directly from aerial imagery, bypassing the segment-then-multiply pipeline. Reduces error accumulation for distribution planning inventories. |

---

## 3. Research Trend Signal

Three converging signals stand out. First, **trustworthy agency is becoming an engineering discipline**: evidence governance, memory conflict routing, reversibility classes, and patient-conditioned guardrails all treat the agent's inputs and actions as adversarial or unreliable by default, rather than assuming clean tool outputs. Second, **efficiency research is shifting from "how to compress" to "what compression breaks"** — the quantization-safety audit and TempQuant both show that low-precision deployment interacts non-trivially with decoding and refusal behavior, suggesting quantization-aware evaluation will become standard. Third, a **minimalist counter-movement** is emerging: BRIDGE questions elaborate memory primitives, the long-context sampling paper questions retraining, and the weight-space programming paper questions Transformer necessity. Together these suggest the field is entering a consolidation phase, where the burden of proof shifts from novelty to demonstrated marginal value over simple baselines.

---

## 4. Worth Deep Reading

1. **[RAG in a Trenchcoat: When Minimal Memory Is Enough for Agentic Systems, and When It Isn't](http://arxiv.org/abs/2611.22179v1)** — This paper's negative result is potentially field-shaping. If most extraction, supersession, reflection, and graph-synthesis primitives do not earn their cost on standard memory benchmarks, the agentic memory community needs to either identify where they *do* pay off or simplify its pipelines. The BRIDGE design also provides a reusable minimal baseline that future memory papers will need to beat.

2. **[Not All Evidence Is Admissible: Evidence Governance for Tool-Augmented Medical Agents](http://arxiv.org/abs/2611.22169v1)** — The finding that silent tool failures flip *correct* answers to *wrong* — because a frozen reasoner cannot ignore injected context — is a fundamental architectural critique, not just a medical-domain issue. It implies that tool-augmented agents need admission control at the context boundary, with implications for every RAG- and tool-based system in production.

3. **[Is 4-Bit Quantization More Than Noise to a Chat Model's Safety Behaviour?](http://arxiv.org/abs/2611.22186v1)** — The matched-perturbation methodology is the key contribution: it isolates quantization-specific effects from generic weight noise, resolving contradictory audit results in the literature. Given that most on-device chat models are 4-bit copies of evaluated checkpoints, this reframes quantization as a safety-relevant transformation rather than a neutral compression step.

---
*This digest is auto-generated by [ai-radar](https://github.com/HuggerHustle/ai-radar).*