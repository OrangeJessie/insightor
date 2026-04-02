# Model Reader — 模型类深度阅读子技能

适用：商业书（战略、管理）、心理学模型、经济学理论、决策框架等以**框架 / 模型 / 矩阵 / 公式**为核心的文本。

---

## 需要生成的 7 份报告

| File | Dimension | 聚焦点 |
|------|-----------|--------|
| `01-models.md` | 模型层 | 核心框架/模型的结构化提取 |
| `02-variables.md` | 变量层 | 关键变量、因果关系图 |
| `03-assumptions.md` | 假设层 | 前提假设、适用边界、失效条件 |
| `04-applications.md` | 应用层 | 场景映射、案例分析 |
| `05-comparisons.md` | 对比层 | 同类模型对比、优劣势分析 |
| `06-actionables.md` | 行动层 | 可操作建议、实践清单 |
| `07-limitations.md` | 局限层 | 批判性分析、边界条件 |

---

## 01 — 模型层 (Models)

聚焦**提出了什么框架**，精确提取模型结构，不做应用讨论。

```markdown
## Model Inventory

| ID | Model Name | Type | Core Idea (一句话) | Location |
|----|-----------|------|-------------------|----------|
| F01 | 五力模型 | Matrix/Framework | 行业竞争由五种力量决定 | Ch.2 |
| F02 | 价值链 | Process/Flow | 价值通过一系列活动创造 | Ch.3 |

### F01 — 五力模型 (Five Forces)

**Visual Representation:**
```
        [新进入者威胁]
              │
[供应商议价] ← [行业竞争] → [买方议价]
              │
        [替代品威胁]
```

**Components:**
| Component | Definition | Measurement Indicators |
|-----------|-----------|----------------------|
| 行业内竞争 | ... | 集中度、增长率、差异化 |
| 新进入者 | ... | 进入壁垒高低 |
| ... | ... | ... |

**Mathematical Form (if any):**
- Formal: ...
- Simplified: ...

**Key Relationships between Components:**
- A ↑ → B ↓ (逆向关系)
- C ∝ D (正比)
```

---

## 02 — 变量层 (Variables)

聚焦**什么影响什么**，因果关系和变量清单，不做假设分析。

```markdown
## Variable Registry

| ID | Variable | Type | Unit/Scale | Controllable? | In Model |
|----|----------|------|-----------|---------------|----------|
| V01 | 市场集中度 | Independent | HHI指数 | No | F01 |
| V02 | 进入壁垒 | Moderator | High/Med/Low | Partially | F01 |

## Causal Map

```
[V01 市场集中度] ──(+)──→ [V03 利润率]
       ↑                        ↑
  [V02 进入壁垒] ──(+)──→ [V04 定价权]
```

## Feedback Loops
| Loop ID | Variables | Direction | Type |
|---------|-----------|-----------|------|
| FL01 | V03→V05→V01 | Reinforcing | 正反馈 |
| FL02 | V04→V06→V02 | Balancing | 负反馈 |

## Key Metrics the Author Uses
| Metric | Definition | How Measured | Where Used |
|--------|-----------|-------------|-----------|
| ... | ... | ... | Ch.X |
```

---

## 03 — 假设层 (Assumptions)

聚焦**在什么前提下成立**，边界条件和隐含假设，不做对比。

```markdown
## Explicit Assumptions (作者明确声明的)

| ID | Assumption | Location | Type |
|----|-----------|----------|------|
| A01 | 参与者是理性的 | §1.2 | Behavioral |
| A02 | 市场信息对称 | §2.1 | Structural |

## Implicit Assumptions (未声明但逻辑依赖的)

| ID | Assumption | Inferred From | Risk if Violated |
|----|-----------|---------------|-----------------|
| A03 | 静态分析(不考虑动态博弈) | 模型无时间维度 | 模型失效 |

## Boundary Conditions (适用边界)

| Condition | Within Scope | Out of Scope |
|-----------|-------------|-------------|
| 行业类型 | 传统制造业 | 平台经济? |
| 地理 | 西方市场 | 新兴市场? |
| 时间尺度 | 中期(3-5年) | 短期波动 |

## Failure Modes (什么情况下模型崩溃)
1. 当 [A01] 被违反时 → 模型预测偏差方向: ...
2. 当 [A03] 被违反时 → ...
```

---

## 04 — 应用层 (Applications)

聚焦**怎么用**，场景映射和案例，不做理论批判。

```markdown
## Application Scenarios

| Scenario | Applicable Model(s) | How to Apply | Expected Outcome |
|----------|---------------------|-------------|-----------------|
| 进入新市场 | F01(五力) | 分析五力 → 评估吸引力 | 市场选择决策 |
| 成本优化 | F02(价值链) | 识别低效活动 | 降本X% |

## Case Studies from the Book

| Case | Chapter | Model Applied | Outcome | Key Insight |
|------|---------|--------------|---------|-------------|
| 西南航空 | Ch.4 | F02 | 低成本领导者 | 活动系统的一致性 |

## Decision Flowchart (if applicable)

```
Start: 面临战略选择
  │
  ├─ Q1: 行业吸引力? → Use F01
  │   ├─ 高 → Q2
  │   └─ 低 → 考虑退出
  │
  └─ Q2: 竞争优势来源? → Use F02
      ├─ 成本 → 成本领先战略
      └─ 差异化 → 差异化战略
```

## Adaptation Guide
将书中模型适配到不同情境时需要修改的参数/假设：
| Context Change | What to Adjust | How |
|---------------|---------------|-----|
| 从制造到互联网 | V02(进入壁垒)定义 | 网络效应替代资本壁垒 |
```

---

## 05 — 对比层 (Comparisons)

聚焦**和其他模型比怎么样**，横向对比，不做应用建议。

```markdown
## Model Comparison Matrix

| Dimension | This Book's Model | Alternative A | Alternative B |
|-----------|------------------|---------------|---------------|
| 核心单位 | 行业 | 资源(RBV) | 生态系统 |
| 分析焦点 | 外部竞争力量 | 内部能力 | 共生关系 |
| 时间观 | 静态快照 | 动态积累 | 共演化 |
| 适用场景 | 成熟行业 | 资源型企业 | 平台经济 |
| 主要盲点 | 忽视内部能力 | 忽视外部环境 | 难以量化 |

## Complementarity Map (互补性)
哪些模型可以组合使用：
- F01 + RBV → 外部机会 + 内部能力匹配
- F02 + 蓝海战略 → 价值创新

## Evolution / Genealogy
```
[Bain's SCP范式 (1956)]
       │
       ▼
[Porter's 五力 (1979)] ──→ [Dynamic Capabilities (1997)]
       │
       ▼
[Value Chain (1985)]
```
```

---

## 06 — 行动层 (Actionables)

聚焦**读完之后做什么**，实践清单，不做理论分析。

```markdown
## Quick-Start Checklist
从本书提取的可立即执行的行动：

- [ ] **Action 1**: 用五力框架分析你所在行业 (Template: ...)
- [ ] **Action 2**: 绘制你的价值链，标注成本占比
- [ ] **Action 3**: 识别你的活动系统中的不一致点

## Implementation Templates

### Template: Five Forces Analysis
| Force | Current State | Trend | Your Response |
|-------|-------------|-------|---------------|
| 行业竞争 | | | |
| 新进入者 | | | |
| ... | | | |

## Pitfalls to Avoid
作者警告或暗示的常见错误：
1. ❌ ...
   ✅ Instead: ...

## Reading Path Recommendations
读完本书后建议的延伸阅读：
| Book/Paper | Why Read | Relationship |
|-----------|---------|-------------|
| ... | 补充内部能力视角 | 互补 |
```

---

## 07 — 局限层 (Limitations)

聚焦**哪里不够好**，批判性分析，不提供替代方案（那是对比层的事）。

```markdown
## Author's Acknowledged Limitations
1. ...

## Unacknowledged Limitations

| ID | Limitation | Type | Severity | Evidence |
|----|-----------|------|----------|----------|
| LM01 | 忽略动态竞争 | Scope | High | 模型无时间轴 |
| LM02 | 西方市场偏见 | Bias | Medium | 案例全部来自欧美 |

## Logical Gaps
论证中跳过的步骤或不充分推理：
1. §X.X: 从 [前提A] 直接跳到 [结论B]，缺少 ...

## Empirical Challenges
| Model Prediction | Real-world Counterexample | Source |
|-----------------|--------------------------|--------|
| 五力低→低利润 | 平台企业在高竞争中高利润 | [ref] |

## Temporal Validity
模型在不同时代的适用性变化：
| Era | Applicable? | Why |
|-----|-----------|-----|
| 工业时代 | ✅ | 模型为此设计 |
| 数字时代 | ⚠️ | 网络效应改变竞争逻辑 |
```

---

## Cross-Reference Execution (模型类专用)

1. **模型 ↔ 变量**: `01-models.md` 框架组件 → `02-variables.md` 变量是否完备
2. **假设 ↔ 局限**: `03-assumptions.md` 隐含假设 → `07-limitations.md` 失效分析
3. **应用 ↔ 假设**: `04-applications.md` 场景 → 检查 `03-assumptions.md` 边界是否被突破
4. **对比 ↔ 局限**: `05-comparisons.md` 盲点 → 验证 `07-limitations.md` 的批判
5. **行动 ↔ 假设**: `06-actionables.md` 清单 → 确保在 `03-assumptions.md` 适用范围内
