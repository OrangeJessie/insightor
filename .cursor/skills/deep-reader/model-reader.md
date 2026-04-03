# Model Reader — 模型类深度阅读子技能

适用：商业书（战略、管理）、心理学模型、经济学理论、决策框架等以**框架 / 模型 / 矩阵 / 公式**为核心的文本。

---

## L1: 章节/概念单元穷举索引 — `L1-scenes.md`

模型类文本的「场景」= **概念单元**：每个章节中引入一个模型、案例、或推导步骤的片段。

### 格式

```markdown
# L1 — 章节/概念单元索引

> 共 {N} 章, {M} 个概念单元

---

## Ch.{N} {章名}

### Unit {N}.1: {单元简名}
- **类型**: 模型定义 | 变量阐述 | 案例 | 推导 | 对比 | 总结 | 应用指南
- **核心内容**: {1-2 句概括}
- **涉及模型**: {模型 ID, 如 F01}
- **涉及变量**: {变量 ID, 如 V01, V03}
- **案例**: {如有，标注案例名}
- **标签**: #{关键词1} #{关键词2}
- **→ L2**: {关联报告}
- **→ L3**: {关联洞察}
```

### 示例（《好战略坏战略》）

```markdown
## Ch.1 好战略出人意料

### Unit 1.1: 坏战略的四大特征
- **类型**: 模型定义（反面）
- **核心内容**: 坏战略的标志：空话、不直面挑战、把目标当战略、错误的战略目标
- **涉及模型**: F00(坏战略诊断)
- **涉及变量**: —
- **案例**: 某企业"愿景战略"
- **标签**: #坏战略 #四大特征 #空话
- **→ L2**: reports/01-models.md§F00
- **→ L3**: insights/insight-bad-strategy-signs.md

### Unit 1.2: 好战略的内核（The Kernel）
- **类型**: 模型定义（核心）
- **核心内容**: 好战略由三要素构成：诊断 → 指导方针 → 协调行动
- **涉及模型**: F01(The Kernel)
- **涉及变量**: V01(诊断精确度), V02(方针聚焦度)
- **案例**: —
- **标签**: #好战略 #内核 #Kernel #诊断 #指导方针 #协调行动
- **→ L2**: reports/01-models.md§F01, reports/02-variables.md§V01
```

---

## L2: 维度深度报告 — `reports/`

### 5 份报告

| File | Dimension | 聚焦点 |
|------|-----------|--------|
| `01-models.md` | 模型层 | 核心框架的结构化提取和可视化 |
| `02-variables.md` | 变量层 | 关键变量、因果图、反馈回路 |
| `03-assumptions.md` | 假设层 | 前提假设、适用边界、失效条件 |
| `04-applications.md` | 应用层 | 场景映射、案例分析、决策流程 |
| `05-comparisons.md` | 对比层 | 同类模型对比、互补性、演化谱系 |

每份报告末尾必须有 `## Chapter Anchors`：

```markdown
## Chapter Anchors
- L1 Ch.1§1.2 The Kernel → 本报告§F01 的核心定义来源
- L1 Ch.4§4.3 西南航空 → 本报告§Application-A01
```

---

### 01 — 模型层 (Models)

聚焦**提出了什么框架**。精确提取结构，不做应用讨论。

```markdown
## Model Inventory

| ID | Name | Type | Core Idea | Location |
|----|------|------|-----------|----------|
| F01 | The Kernel | Process | 诊断→指导方针→协调行动 | Ch.1-3 |
| F02 | 价值链 | Flow | 价值通过活动链条创造 | Ch.5 |

### F01 — The Kernel

**Visual:**
[Diagnosis] → [Guiding Policy] → [Coherent Actions]

**Components:**
| Component | Definition | Measurement |
|-----------|-----------|-------------|

**Mathematical Form (if any):** ...
**Key Relationships:** A ↑ → B ↑ (正向)
```

---

### 02 — 变量层 (Variables)

聚焦**什么影响什么**。因果关系和反馈回路。

```markdown
## Variable Registry
| ID | Variable | Type | Scale | Controllable? | In Model |
|----|----------|------|-------|---------------|----------|

## Causal Map
[V01] ──(+)──→ [V03] ← ──(-)── [V02]

## Feedback Loops
| Loop | Variables | Direction | Type |
|------|-----------|-----------|------|
```

---

### 03 — 假设层 (Assumptions)

聚焦**在什么前提下成立**。

```markdown
## Explicit Assumptions
| ID | Assumption | Location | Type |
|----|-----------|----------|------|

## Implicit Assumptions
| ID | Assumption | Inferred From | Risk if Violated |
|----|-----------|---------------|-----------------|

## Boundary Conditions
| Condition | Within Scope | Out of Scope |
|-----------|-------------|-------------|

## Failure Modes
1. 当 [A01] 被违反 → ...
```

---

### 04 — 应用层 (Applications)

聚焦**怎么用**。场景映射和案例。

```markdown
## Application Scenarios
| Scenario | Model(s) | How to Apply | Expected Outcome |
|----------|----------|-------------|-----------------|

## Cases from the Book
| Case | Chapter | Model | Outcome | Insight |
|------|---------|-------|---------|---------|

## Decision Flowchart
Start → Q1 → Use F01 → Q2 → Use F02

## Adaptation Guide
| Context Change | Adjust | How |
|---------------|--------|-----|
```

---

### 05 — 对比层 (Comparisons)

聚焦**和其他模型比怎么样**。

```markdown
## Comparison Matrix
| Dimension | This Book | Alternative A | Alternative B |
|-----------|----------|---------------|---------------|

## Complementarity
- F01 + RBV → 外部+内部匹配

## Evolution Genealogy
[Predecessor] → [This Model] → [Successor]
```

---

## L3: 原子洞察 — `insights/`

### 什么值得成为 L3（模型类）

- 模型在**意外场景**中的适用性发现
- 假设被现实违反的**反例**
- 不同模型之间的**隐藏矛盾**或**意外互补**
- **可操作的组合策略**（A模型+B模型→新应用）
- 模型在新时代（如 AI 时代）的**失效或变形**

---

## INDEX: 分面倒排索引 — `index.md`

模型类使用 **4 个分面**：模型/框架、变量/概念、案例、行业/场景。

```markdown
# 分面索引

> **Text**: {title} | **Type**: model | **Updated**: {date}

---

## 按模型/框架

### F01: The Kernel (好战略内核)
- L1: Ch.1§1.2(定义), Ch.3§3.1(展开), Ch.8§8.2(案例)
- L2: 01-models.md§F01, 02-variables.md§V01-V03
- L3: insight-kernel-in-practice.md

## 按变量/概念

### 诊断精确度 (V01)
- L1: Ch.1§1.2, Ch.4§4.1
- L2: 02-variables.md§V01, 03-assumptions.md§A01

## 按案例

### 西南航空
- L1: Ch.4§4.3
- L2: 04-applications.md§Case-A01
- L3: insight-southwest-coherence.md

## 按行业/场景

### 科技行业
- L1: Ch.6§6.2, Ch.9§9.1
- L2: 04-applications.md§Scenario-S03
```

---

## Cross-Reference Execution

1. **模型 ↔ 变量**: 01 组件 → 02 变量完备性检查
2. **假设 ↔ 应用**: 03 边界 → 04 场景是否超出边界
3. **对比 ↔ 假设**: 05 替代模型 → 03 本模型盲点验证
4. **应用 ↔ 假设**: 04 行动清单 → 03 适用范围约束
