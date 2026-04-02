# Examples — 四类文本深度阅读示例

---

## 1. 叙事类 (Narrative) — 《红楼梦》

### 触发
> 帮我深度阅读《红楼梦》第一回

### Agent 行为
1. 分类 → `narrative` / `novel`
2. 存储 → `reading-library/hong-lou-meng-ch01/`
3. 读取 `narrative-reader.md` → 生成 7 份报告

### 报告示例片段

**01-entities.md**:
```
| C01 | 甄士隐 | — | 乡绅 | 通灵玉(间接) | — | 第1回 |
| C02 | 贾雨村 | — | 落魄书生→官员 | — | — | 第1回 |
```

**02-symbols.md**:
```
| 甄士隐 | 真事隐 | 真事被隐去 | 开篇叙事声明 |
| 贾雨村 | 假语存 | 假语村言 | 与甄对偶 |
```

**03-structure.md**:
```
Mirror Group M01: 甄家(缩影) ↔ 贾家(全景) — 命运预演
```

### 问答示例
> Q: 甄士隐和贾雨村的名字有什么关联？

```markdown
## 甄士隐与贾雨村的名字关联

### 发现
二人构成叙事框架的对偶声明：「真事隐」去，「假语存」焉。

### 证据链
- **原文**: source.md 第1回 — "因曾历过一番梦幻之后，故将真事隐去"
- **报告**: 02-symbols.md § Homophonic — 谐音对照表
- **报告**: 01-entities.md § C01, C02 — 二人身份对比

### 深层解读
这不仅是文字游戏，而是全书的叙事契约。作者开宗明义告诉读者：
你读到的故事表面是"假语"，真相被有意遮蔽。

### 延伸问题
- 甄士隐在后文的消失是否象征"真相"被彻底压抑？
```

---

## 2. 论证类 (Argument) — "Attention Is All You Need"

### 触发
> Read and analyze this paper: Attention Is All You Need

### Agent 行为
1. 分类 → `argument` / `academic-paper`
2. 存储 → `reading-library/attention-is-all-you-need/`
3. 读取 `argument-reader.md` → 生成 7 份报告

### 报告示例片段

**01-core-claims.md**:
```
## Central Thesis
注意力机制alone（无需 RNN/CNN）即可在序列转换任务上达到 SOTA。

### Claim 1: Self-attention 可替代 recurrence
- Original: "dispensing with recurrence and convolutions entirely"
- Scope: 序列到序列任务（MT, 摘要等）
```

**03-logic-flow.md**:
```
[Limitation of RNN: sequential computation]
    + [Attention已在encoder-decoder中证明有效]
        │
        ▼ (归纳推理)
    [Hypothesis: Attention alone suffices]
        + [Experimental evidence: BLEU scores]
        │
        ▼
    [Thesis confirmed on WMT benchmarks]
```

---

## 3. 模型类 (Model) — 《好战略坏战略》

### 触发
> 帮我深度阅读《好战略坏战略》

### Agent 行为
1. 分类 → `model` / `business`
2. 存储 → `reading-library/good-strategy-bad-strategy/`
3. 读取 `model-reader.md` → 生成 7 份报告

### 报告示例片段

**01-models.md**:
```
### F01 — 好战略的内核 (The Kernel)
三要素：诊断(Diagnosis) → 指导方针(Guiding Policy) → 协调行动(Coherent Actions)

[Diagnosis: 识别关键挑战]
       │
       ▼
[Guiding Policy: 应对挑战的总体方法]
       │
       ▼
[Coherent Actions: 协调一致的执行步骤]
```

**03-assumptions.md**:
```
| A01 | 战略的核心是应对挑战而非设定目标 | §1 | Definitional |
| A02 | 领导者能准确识别关键挑战 | Implicit | 若违反，整个内核失效 |
```

---

## 4. 信息/工具类 (Reference) — Kubernetes 官方文档

### 触发
> 帮我深度阅读 Kubernetes 官方文档的 Pod 章节

### Agent 行为
1. 分类 → `reference` / `tech-doc`
2. 存储 → `reading-library/k8s-pods-doc/`
3. 读取 `reference-reader.md` → 生成 6 份报告

### 报告示例片段

**02-concepts.md**:
```
| Pod | K8s中最小可部署单元，包含一个或多个容器 | Core | Container, Node | §Pods Overview |
| Sidecar | 与主容器共享网络/存储的辅助容器 | Pattern | Pod, Container | §Pod Templates |
```

**06-quick-reference.md**:
```
| 查看Pod | kubectl get pods -n {ns} | |
| 查看详情 | kubectl describe pod {name} | |
| 进入容器 | kubectl exec -it {name} -- /bin/sh | |
| 查看日志 | kubectl logs {name} -f | -f 持续输出 |
```
