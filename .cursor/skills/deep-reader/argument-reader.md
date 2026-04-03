# Argument Reader — 论证类深度阅读子技能

适用：学术论文、评论文章、思想类书籍（哲学、政治学、社会学）等以**论点 + 论据 + 说服**驱动的文本。

---

## L1: 段落/论证单元穷举索引 — `L1-scenes.md`

论证类文本的「场景」= **论证单元**：每个段落/小节中作者提出一个独立论点或提供一组论据的片段。

### 格式

```markdown
# L1 — 段落/论证单元索引

> 共 {N} 节/章, {M} 个论证单元

---

## §{N} {章节标题}

### Unit {N}.1: {论证单元简名}
- **类型**: 定义 | 主张 | 论据 | 反驳 | 总结 | 方法 | 案例
- **核心内容**: {1-2 句概括}
- **支撑 Claim**: {关联的论点 ID, 如 Claim-1a}
- **证据类型**: 实证 | 案例 | 权威引用 | 类比 | 逻辑推演 | 无
- **关键术语**: {本段首次出现或重新定义的术语}
- **标签**: #{关键词1} #{关键词2}
- **→ L2**: {关联报告}
- **→ L3**: {关联洞察}
```

### 示例（"Attention Is All You Need"）

```markdown
## §1 Introduction

### Unit 1.1: RNN 的计算瓶颈
- **类型**: 问题陈述
- **核心内容**: 循环模型的顺序特性阻碍了并行化训练，在长序列上尤为突出
- **支撑 Claim**: Claim-1（Attention alone suffices）的动机
- **证据类型**: 权威引用（Bahdanau et al., 2014）
- **关键术语**: recurrence, sequential computation, parallelization
- **标签**: #RNN瓶颈 #并行化 #sequential
- **→ L2**: reports/01-core-claims.md§Claim-1

### Unit 1.2: Attention 已证明有效
- **类型**: 已知成果
- **核心内容**: 注意力机制已在 encoder-decoder 架构中证明了对依赖关系建模的有效性
- **支撑 Claim**: Claim-1 的前提
- **证据类型**: 权威引用（Bahdanau, Luong）
- **关键术语**: attention mechanism, encoder-decoder
- **标签**: #attention #encoder-decoder
- **→ L2**: reports/04-context.md§学术谱系
```

---

## L2: 维度深度报告 — `reports/`

### 5 份报告

| File | Dimension | 聚焦点 |
|------|-----------|--------|
| `01-core-claims.md` | 论点层 | 核心论点、子论点层级、隐含前提 |
| `02-evidence.md` | 论据层 | 数据、案例、引文的系统编目 |
| `03-logic-flow.md` | 逻辑层 | 论证结构、推理链条、潜在谬误 |
| `04-context.md` | 脉络层 | 学术谱系、对话关系、时代背景 |
| `05-methodology.md` | 方法层 | 研究设计、分析框架、可复现性 |

每份报告末尾必须有 `## Section Anchors`：

```markdown
## Section Anchors
- L1 §3.2§3.2.1 Multi-Head Attention → 本报告§Claim-2 的核心论据来源
- L1 §5.1§5.1.3 BLEU results → 本报告§Evidence-E01
```

---

### 01 — 论点层 (Core Claims)

聚焦**作者主张什么**。提取论点树，不做评判。

```markdown
## Central Thesis
> [一句话核心主张]

## Claim Hierarchy

### Claim-1: [子论点]
- **Original**: "[原文引用]" (§X.X / p.XX)
- **Sub-claims**: 1a: ... / 1b: ...
- **Scope**: [适用边界]
- **Supporting Units**: L1 §X.X§X.X.X, L1 §Y.Y§Y.Y.Y

### Claim-2: ...

## Implicit Claims (隐含前提)
1. ...
```

---

### 02 — 论据层 (Evidence)

聚焦**拿什么证明的**。编目支撑材料，不做逻辑评价。

```markdown
## Evidence Inventory

| ID | Type | Description | Supports | Source | Strength | L1 Unit |
|----|------|------------|----------|--------|----------|---------|
| E01 | Empirical | BLEU score Table 2 | Claim-1 | §6.1 | Strong | §6.1§6.1.2 |
| E02 | Case study | WMT 2014 EN-DE | Claim-1 | §6.2 | Strong | §6.2§6.2.1 |

## Data Sources
| Dataset | Size | Collection | Potential Bias |
|---------|------|------------|---------------|

## Key Figures & Tables
| Fig/Table | Location | Shows | Supports |
|-----------|----------|-------|----------|
```

---

### 03 — 逻辑层 (Logic Flow)

聚焦**论证怎么连起来的**。推理结构和谬误检测。

```markdown
## Argument Structure Type
- [ ] Deductive  - [ ] Inductive  - [ ] Abductive  - [ ] Mixed

## Logic Chain
[前提 P1] + [前提 P2] → (演绎) → [中间结论] + [E01] → (归纳) → [Thesis]

## Logical Moves
| Step | Move | From | To | Validity | L1 Unit |
|------|------|------|----|----------|---------|

## Potential Fallacies
| Location | Type | Description |
|----------|------|-------------|

## Counter-arguments & Rebuttals
| Claim | Counter | Author's Rebuttal | Effectiveness |
|-------|---------|-------------------|---------------|
```

---

### 04 — 脉络层 (Context)

聚焦**在什么背景下说的**。学术定位和对话关系。

```markdown
## Intellectual Lineage
- **领域**: ... → **流派**: ... → **直接继承**: [Author (Year)]
- **主要对话者**: [反对], [扩展], [并行]

## Position Map
| Scholar/Work | Position | Relation |
|-------------|----------|----------|

## Historical Context
- **时代背景**: ...
- **触发事件**: ...

## Key Term Genealogy
| Term | Author's Def | Standard Usage | Opponents' Usage |
|------|-------------|---------------|-----------------|
```

---

### 05 — 方法层 (Methodology)

聚焦**怎么研究的**。研究设计和分析工具。

```markdown
## Research Design
- **Approach**: Quantitative / Qualitative / Mixed / Theoretical
- **Unit of analysis**: ...

## Method Details

### Data Collection
- **Method**: ... | **Sample**: N=... | **Instruments**: ...

### Analysis Framework
- **Method**: ... | **Variables**: IV/DV/Controls

### For Theoretical Works
- **Reasoning framework**: Dialectical / Phenomenological / Analytical
- **Thought experiments**: ...

## Reproducibility
| Aspect | Provided? | Detail Level |
|--------|-----------|-------------|
```

---

## L3: 原子洞察 — `insights/`

### 什么值得成为 L3（论证类）

- 论点与论据之间的**隐藏断裂**
- 作者未意识到的**隐含假设**
- 跨学科的**意外关联**
- 方法论的**创新性贡献**或**致命缺陷**
- 与当前学术前沿的**对话空间**

文件格式同 SKILL.md 定义。

---

## INDEX: 分面倒排索引 — `index.md`

论证类使用 **4 个分面**：论点、术语、方法、学者/引文。

```markdown
# 分面索引

> **Text**: {title} | **Type**: argument | **Updated**: {date}

---

## 按论点

### Claim-1: {论点简述}
- L1: §X.X§X.X.1, §X.X§X.X.3
- L2: 01-core-claims.md§Claim-1, 02-evidence.md§E01-E03
- L3: insight-xxx.md

## 按术语

### Self-Attention
- L1: §3.2§3.2.1(定义), §5.1(实验)
- L2: 01-core-claims.md§Claim-2, 05-methodology.md§Analysis
- L3: insight-self-attention-novelty.md

## 按方法

### Scaled Dot-Product Attention
- L1: §3.2.1
- L2: 05-methodology.md§Architecture
- L3: insight-scaling-factor.md

## 按学者/引文

### Bahdanau et al. (2014)
- L1: §1§1.2, §2§2.1
- L2: 04-context.md§Lineage, 02-evidence.md§E05
```

---

## Cross-Reference Execution

1. **论点 ↔ 论据**: 01 每条 Claim → 02 支撑是否充分
2. **逻辑 ↔ 论点**: 03 推理步骤 → 01 Claim 是否被有效连接
3. **脉络 ↔ 论点**: 04 立场图谱 → 01 新颖度评估
4. **方法 ↔ 论据**: 05 方法局限 → 02 证据可信度
