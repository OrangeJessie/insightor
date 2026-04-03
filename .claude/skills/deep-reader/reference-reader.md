# Reference Reader — 信息/工具类深度阅读子技能

适用：手册、技术文档、API 文档、工具书、百科、操作指南等以**查阅 + 操作**为主要用途的文本。

---

## L1: 节/主题单元穷举索引 — `L1-scenes.md`

信息/工具类文本的「场景」= **主题单元**：每个小节中介绍一个概念、一个操作、或一组配置的片段。

### 格式

```markdown
# L1 — 节/主题单元索引

> 共 {N} 章/节, {M} 个主题单元

---

## §{N} {章节标题}

### Unit {N}.1: {单元简名}
- **类型**: 概念定义 | 操作步骤 | 配置参数 | 接口定义 | 示例 | 排障 | 最佳实践
- **核心内容**: {1-2 句概括}
- **前置依赖**: {需要先看哪个 Unit}
- **关键术语**: {本节定义或使用的术语}
- **关联命令/API**: {涉及的命令或接口}
- **标签**: #{关键词1} #{关键词2}
- **→ L2**: {关联报告}
- **→ L3**: {关联洞察}
```

### 示例（Kubernetes Pod 文档）

```markdown
## §1 Pod Overview

### Unit 1.1: Pod 定义
- **类型**: 概念定义
- **核心内容**: Pod 是 K8s 中最小可部署单元，包含一个或多个共享网络和存储的容器
- **前置依赖**: —
- **关键术语**: Pod, Container, shared namespace
- **关联命令/API**: kubectl get pods
- **标签**: #Pod #定义 #最小部署单元
- **→ L2**: reports/01-architecture.md§Pod, reports/02-concepts.md§Pod

### Unit 1.2: Multi-container Patterns
- **类型**: 最佳实践
- **核心内容**: Sidecar / Ambassador / Adapter 三种多容器模式
- **前置依赖**: Unit 1.1
- **关键术语**: Sidecar, Ambassador, Adapter, Init Container
- **关联命令/API**: —
- **标签**: #Sidecar #多容器 #设计模式 #Ambassador #Adapter
- **→ L2**: reports/01-architecture.md§Patterns
- **→ L3**: insights/insight-sidecar-vs-init.md
```

---

## L2: 维度深度报告 — `reports/`

### 4 份报告

| File | Dimension | 聚焦点 |
|------|-----------|--------|
| `01-architecture.md` | 体系层 | 知识结构、模块依赖、阅读路径 |
| `02-concepts.md` | 概念层 | 核心定义、术语辨析、概念关系图 |
| `03-procedures.md` | 流程层 | 操作步骤、决策树、工作流 |
| `04-specifications.md` | 规格层 | 参数、接口、配置项、兼容矩阵 |

每份报告末尾必须有 `## Section Anchors`：

```markdown
## Section Anchors
- L1 §1§1.1 Pod 定义 → 本报告§Pod 核心概念来源
- L1 §3§3.2 资源配额 → 本报告§Limits
```

---

### 01 — 体系层 (Architecture)

聚焦**整体怎么组织的**。知识地图和依赖关系。

```markdown
## Knowledge Map
[Top-level]
├── [Area A]
│   ├── [Sub A1]
│   └── [Sub A2]
└── [Area B]

## Module Dependencies
[A] ──requires──→ [B]
[C] ──extends──→ [A]

## Reading Paths
| Goal | Path | Skip |
|------|------|------|
| 快速入门 | §1→§3→§7 | §4-6 |
| 深度掌握 | 全部顺序 | — |

## Coverage
| Topic | Covered? | Depth | Location |
|-------|----------|-------|----------|
```

---

### 02 — 概念层 (Concepts)

聚焦**关键词是什么意思**。

```markdown
## Core Glossary
| Term | Definition | Category | Related | Location |
|------|-----------|----------|---------|----------|

## Concept Relationships
[A] ──is-a──→ [B]
[C] ──has-a──→ [D]

## Disambiguation
| Term A | Term B | Key Difference |
|--------|--------|---------------|

## Acronyms
| Abbr | Full | Meaning |
|------|------|---------|
```

---

### 03 — 流程层 (Procedures)

聚焦**怎么做**。操作步骤和决策树。

```markdown
## Procedure Index
| ID | Procedure | Purpose | Prerequisite | Location |
|----|-----------|---------|-------------|----------|

### P01 — {操作名}
**Prerequisites**: ...
**Steps**: 1. ... 2. ... 3. ...
**Verification**: 如何确认成功
**Rollback**: 如何回退

## Decision Trees
Q → A路径 / B路径

## Common Sequences
| Scenario | Steps | Time |
|----------|-------|------|
```

---

### 04 — 规格层 (Specifications)

聚焦**具体参数是什么**。

```markdown
## Configuration Reference
| Parameter | Type | Default | Range | Description | Location |
|-----------|------|---------|-------|-------------|----------|

## API / Interface Reference
| Endpoint | Input | Output | Side Effects | Location |
|----------|-------|--------|-------------|----------|

## Version Compatibility
| Version | Feature A | Feature B | Breaking Changes |
|---------|-----------|-----------|-----------------|

## Limits & Quotas
| Resource | Limit | Soft/Hard | Workaround |
|----------|-------|-----------|-----------|
```

---

## L3: 原子洞察 — `insights/`

### 什么值得成为 L3（信息/工具类）

- 文档中**未明说的陷阱**（踩坑经验）
- 不同功能之间的**隐藏交互**
- **最佳实践组合**（A+B+C 一起用的效果）
- 版本间的**行为变化**
- 与竞品/替代方案的**关键差异**

---

## INDEX: 分面倒排索引 — `index.md`

信息/工具类使用 **4 个分面**：概念/术语、操作/命令、配置/参数、错误/排障。

```markdown
# 分面索引

> **Text**: {title} | **Type**: reference | **Updated**: {date}

---

## 按概念/术语

### Pod
- L1: §1§1.1(定义), §2§2.1(生命周期), §5§5.3(调度)
- L2: 01-architecture.md§Pod, 02-concepts.md§Pod
- L3: insight-pod-lifecycle-gotchas.md

### Sidecar
- L1: §1§1.2(模式), §4§4.2(示例)
- L2: 02-concepts.md§Sidecar
- L3: insights/insight-sidecar-vs-init.md

## 按操作/命令

### kubectl get pods
- L1: §3§3.1
- L2: 03-procedures.md§P01

### kubectl exec
- L1: §3§3.5
- L2: 03-procedures.md§P04

## 按配置/参数

### resources.limits.cpu
- L1: §2§2.3
- L2: 04-specifications.md§Resources

### restartPolicy
- L1: §2§2.1
- L2: 04-specifications.md§Lifecycle

## 按错误/排障

### CrashLoopBackOff
- L1: §6§6.2
- L2: (排障内容内联在 L1 和 L3 中)
- L3: insight-crashloop-diagnosis.md

### OOMKilled
- L1: §6§6.4
- L3: insight-oom-memory-limits.md
```

---

## Cross-Reference Execution

1. **体系 ↔ 概念**: 01 知识模块 → 02 术语覆盖完整性
2. **流程 ↔ 规格**: 03 步骤中的参数 → 04 有定义
3. **概念 ↔ 流程**: 02 术语 → 03 相关操作是否覆盖
4. **L3 ↔ 规格**: 洞察中的陷阱 → 04 参数建议
