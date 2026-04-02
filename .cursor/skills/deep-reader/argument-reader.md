# Argument Reader — 论证类深度阅读子技能

适用：学术论文、评论文章、思想类书籍（哲学、政治学、社会学）等以**论点 + 论据 + 说服**驱动的文本。

---

## 需要生成的 7 份报告

| File | Dimension | 聚焦点 |
|------|-----------|--------|
| `01-core-claims.md` | 论点层 | 核心论点、子论点层级结构 |
| `02-evidence.md` | 论据层 | 数据、案例、实验、引文的系统编目 |
| `03-logic-flow.md` | 逻辑层 | 论证结构、推理方式、逻辑链条 |
| `04-context.md` | 脉络层 | 学术谱系、对话对象、知识背景 |
| `05-methodology.md` | 方法层 | 研究设计、方法论、分析框架 |
| `06-evaluation.md` | 评估层 | 结果评判、局限性、可反驳点 |
| `07-implications.md` | 影响层 | 推论、应用、未来方向 |

---

## 01 — 论点层 (Core Claims)

聚焦**作者主张什么**，纯粹提取论点树，不做评判。

```markdown
## Central Thesis (核心论点)
> [一句话提炼作者的最高层主张]

## Claim Hierarchy (论点层级)

### Claim 1: [子论点]
- **Original statement**: "[原文引用]" (§X.X / p.XX)
- **Supporting sub-claims**:
  - 1a: ...
  - 1b: ...
- **Scope**: [这个论点适用的边界条件]

### Claim 2: ...

## Implicit Claims (隐含论点)
作者未明说但逻辑上依赖的前提：
1. ...
2. ...
```

---

## 02 — 论据层 (Evidence)

聚焦**拿什么证明的**，编目所有支撑材料，不做逻辑评价。

```markdown
## Evidence Inventory

| ID | Type | Description | Supports Claim | Source/Citation | Strength |
|----|------|------------|---------------|-----------------|----------|
| E01 | Empirical data | 实验结果 Table 3 | Claim 1 | [Author, Year] | Strong |
| E02 | Case study | 某企业案例 | Claim 2 | §4.2 | Moderate |
| E03 | Authority appeal | 引用 Kahneman | Claim 3 | p.87 | Depends |
| E04 | Analogy | 生物演化类比 | Claim 1b | §2.1 | Weak |

## Data Sources
| Dataset/Source | Size | Collection Method | Potential Bias |
|---------------|------|-------------------|---------------|
| ... | ... | ... | ... |

## Key Figures & Tables
| Fig/Table | Location | What It Shows | Supporting Which Claim |
|-----------|----------|--------------|----------------------|
| Table 3 | §5.1 | Main results | Claim 1 |
```

---

## 03 — 逻辑层 (Logic Flow)

聚焦**论证是怎么连起来的**，分析推理结构，不复述论点。

```markdown
## Argument Structure Type
- [ ] Deductive (演绎: 前提→必然结论)
- [ ] Inductive (归纳: 样本→一般化)
- [ ] Abductive (溯因: 现象→最佳解释)
- [ ] Mixed

## Logic Chain Diagram

```
[前提 P1] + [前提 P2]
       │
       ▼ (演绎)
[中间结论 IC1] + [Evidence E01]
       │
       ▼ (归纳)
[Core Thesis]
```

## Logical Moves (逻辑动作)

| Step | Move Type | From | To | Validity |
|------|-----------|------|----|----------|
| 1 | Definition | — | 概念界定 | Sound |
| 2 | Empirical support | E01 | Claim 1 | Strong |
| 3 | Generalization | Cases → | Claim 2 | Questionable |

## Potential Fallacies (潜在谬误)
| Location | Fallacy Type | Description |
|----------|-------------|-------------|
| §3.2 | Hasty generalization | 3个案例推出普遍结论 |
```

---

## 04 — 脉络层 (Context)

聚焦**在什么背景下说的**，学术定位和对话关系，不做方法论分析。

```markdown
## Intellectual Lineage (学术谱系)
- **所属领域**: ...
- **所属流派/范式**: ...
- **直接继承**: [Author A (Year)] → 本文
- **主要对话者**: [Author B] (反对), [Author C] (扩展)

## Position Map (立场图谱)

| Scholar/Work | Position | Relation to This Text |
|-------------|----------|----------------------|
| [Author A] | 主张 X | 本文继承并扩展 |
| [Author B] | 主张 Y | 本文反驳 |
| [Author C] | 主张 Z | 本文吸收部分 |

## Historical/Social Context
- **写作时代背景**: ...
- **触发事件**: ...
- **target audience**: ...

## Key Terminology Genealogy
| Term | Author's Definition | vs. Standard Usage | vs. Opponents' Usage |
|------|--------------------|--------------------|---------------------|
| ... | ... | ... | ... |
```

---

## 05 — 方法层 (Methodology)

聚焦**怎么研究的**，研究设计和分析工具，不做结果评判。

```markdown
## Research Design Overview
- **Approach**: Quantitative / Qualitative / Mixed / Theoretical
- **Unit of analysis**: ...
- **Time frame**: ...

## Method Details

### Data Collection
- **Method**: Survey / Interview / Experiment / Archival / ...
- **Sample**: N=..., selection criteria: ...
- **Instruments**: ...

### Analysis Framework
- **Analytical method**: Regression / Grounded theory / Formal proof / ...
- **Key variables**:
  - Independent: ...
  - Dependent: ...
  - Controls: ...

### For Theoretical Works (思想类书籍)
- **Reasoning framework**: Dialectical / Phenomenological / Analytical / ...
- **Thought experiments used**: ...
- **Axioms/Postulates**: ...

## Reproducibility Assessment
| Aspect | Provided? | Detail Level |
|--------|-----------|-------------|
| Data availability | Y/N | ... |
| Code/Scripts | Y/N | ... |
| Step-by-step procedure | Y/N | ... |
```

---

## 06 — 评估层 (Evaluation)

聚焦**站得住吗**，批判性评价，不复述方法。

```markdown
## Results Summary (if empirical)

| Hypothesis | Result | Effect Size | Significance |
|-----------|--------|-------------|-------------|
| H1 | Supported | d=0.8 | p<0.01 |
| H2 | Partially | d=0.3 | p=0.06 |

## Strength Assessment
| Aspect | Rating | Justification |
|--------|--------|---------------|
| Internal validity | High/Med/Low | ... |
| External validity | High/Med/Low | ... |
| Novelty | High/Med/Low | ... |
| Rigor | High/Med/Low | ... |

## Limitations (作者自述)
1. ...

## Unacknowledged Weaknesses (作者未提)
1. ...

## Counter-arguments (可反驳点)

| Claim | Counter | Source/Reasoning | Severity |
|-------|---------|-----------------|----------|
| Claim 1 | ... | ... | High/Med/Low |

## Alternative Explanations
对同一现象的其他合理解释：
1. ...
```

---

## 07 — 影响层 (Implications)

聚焦**所以呢**，前瞻性推论，不回顾论证过程。

```markdown
## Theoretical Implications
- 对该领域的理论贡献: ...
- 改变了哪些认知: ...

## Practical Implications
- 对实践者的建议: ...
- 政策含义: ...

## Future Research Directions
| Direction | Why Important | Feasibility |
|-----------|--------------|-------------|
| ... | ... | High/Med/Low |

## Cross-domain Connections
本文观点可迁移到的其他领域：
1. ...

## Open Questions
从本文逻辑延伸出但未解答的问题：
1. ...
```

---

## Cross-Reference Execution (论证类专用)

1. **论点 ↔ 论据**: `01-core-claims.md` 每条 Claim → 检查 `02-evidence.md` 中支撑是否充分
2. **逻辑 ↔ 评估**: `03-logic-flow.md` 中的推理步骤 → 对照 `06-evaluation.md` 的谬误检测
3. **脉络 ↔ 论点**: `04-context.md` 的立场图谱 → 验证 `01-core-claims.md` 的新颖度
4. **方法 ↔ 影响**: `05-methodology.md` 的局限 → 约束 `07-implications.md` 的推论范围
