# Examples — 四类文本深度阅读示例（三层架构）

---

## 1. 叙事类 (Narrative) — 《红楼梦》第 27 回

### 触发
> 帮我深度阅读《红楼梦》

### 目录结构
```
reading-library/hong-lou-meng/
├── meta.json
├── summary.md
├── index.md          ← 分面索引（人物/场景/主题/意象）
├── L1-scenes.md      ← 120回穷举索引
├── reports/
│   ├── 01-entities.md
│   ├── 02-symbols.md
│   ├── 03-structure.md
│   ├── 04-rules.md
│   ├── 05-themes.md
│   └── 06-style.md
├── insights/
│   ├── insight-baochai-mask.md
│   ├── insight-daiyu-flower-burial.md
│   └── ...
├── qa/
└── source-01.md ... source-15.md
```

### L1 示例片段

```markdown
## Ch.27 滴翠亭杨妃戏彩蝶 埋香冢飞燕泣残红

### 场景 27.1: 宝钗扑蝶
- **地点**: 大观园花丛 → 滴翠亭外
- **人物**: 薛宝钗(C03)
- **事件**: 宝钗在花丛中追逐一对玉色蝴蝶
- **关键意象**: 蝴蝶、团扇
- **情绪基调**: 天真烂漫（表层）
- **名场面标签**: #宝钗扑蝶 #戏彩蝶 #蝴蝶
- **→ L2**: reports/02-symbols.md§蝴蝶
- **→ L3**: insights/insight-baochai-mask.md
```

### INDEX 示例片段

```markdown
## 按关键场景

### 宝钗扑蝶
- L1: Ch.27§27.1
- L2: 02-symbols.md§蝴蝶, 06-style.md§反讽
- L3: insight-baochai-mask.md
```

### L3 示例

```markdown
# 宝钗扑蝶：天真面具下的精明本能

> **Tags**: #宝钗 #扑蝶 #Ch27 #伪装 #滴翠亭
> **Related**: [[L1-scenes.md#Ch.27]], [[reports/02-symbols.md#蝴蝶]], [[insight-golden-lock.md]]
> **Source**: 红楼梦

宝钗追蝶的画面是全书最具视觉冲击力的"天真"场景，
但紧接着的滴翠亭偷听→嫁祸黛玉，暴露了她本能的自保算计。
两个行为在同一回中并置，构成曹雪芹对宝钗最精妙的双面刻画。

> 📖 "宝钗意欲扑了来玩耍……一双迎风翩跹的玉色蝴蝶……"
> — *source-03.md, 第27回*

> 📖 "宝钗在外面听见这话，心中吃惊……便使个金蝉脱壳的法子……"
> — *source-03.md, 第27回*

## 逻辑链条
- [实体] C03 宝钗 → [符号] 蝴蝶=天真表象 → [规则] 嫁祸=阶级自保 → [主题] 真与伪
```

### 问答示例

> Q: 红楼梦里扑蝶是怎么回事？

Agent 检索流程：
1. Grep `index.md` → 命中「宝钗扑蝶」→ L1:Ch.27§27.1, L3:insight-baochai-mask.md
2. Read `insights/insight-baochai-mask.md` → 现成分析
3. Read `L1-scenes.md` § Ch.27 → 场景上下文
4. Grep `source-03.md` → 原文精确引用
5. WebSearch `"红楼梦 宝钗扑蝶 滴翠亭"` → 外部解读

---

## 2. 论证类 (Argument) — "Attention Is All You Need"

### 目录结构
```
reading-library/attention-is-all-you-need/
├── meta.json
├── summary.md
├── index.md          ← 分面索引（论点/术语/方法/学者）
├── L1-scenes.md      ← 段落论证单元穷举
├── reports/
│   ├── 01-core-claims.md
│   ├── 02-evidence.md
│   ├── 03-logic-flow.md
│   ├── 04-context.md
│   └── 05-methodology.md
├── insights/
│   ├── insight-self-attention-novelty.md
│   └── insight-scaling-factor.md
└── source.md
```

### INDEX 示例

```markdown
## 按术语
### Self-Attention
- L1: §3.2§3.2.1(定义), §5.1(实验)
- L2: 01-core-claims.md§Claim-2, 05-methodology.md§Architecture
- L3: insight-self-attention-novelty.md
```

---

## 3. 模型类 (Model) — 《好战略坏战略》

### 目录结构
```
reading-library/good-strategy-bad-strategy/
├── meta.json
├── summary.md
├── index.md          ← 分面索引（模型/变量/案例/行业）
├── L1-scenes.md      ← 章节概念单元穷举
├── reports/
│   ├── 01-models.md
│   ├── 02-variables.md
│   ├── 03-assumptions.md
│   ├── 04-applications.md
│   └── 05-comparisons.md
├── insights/
│   ├── insight-kernel-in-practice.md
│   └── insight-bad-strategy-signs.md
└── source.md
```

### INDEX 示例

```markdown
## 按案例
### 西南航空
- L1: Ch.4§4.3
- L2: 04-applications.md§Case-A01
- L3: insight-southwest-coherence.md
```

---

## 4. 信息/工具类 (Reference) — Kubernetes Pod 文档

### 目录结构
```
reading-library/k8s-pods-doc/
├── meta.json
├── summary.md
├── index.md          ← 分面索引（概念/操作/配置/错误）
├── L1-scenes.md      ← 节/主题单元穷举
├── reports/
│   ├── 01-architecture.md
│   ├── 02-concepts.md
│   ├── 03-procedures.md
│   └── 04-specifications.md
├── insights/
│   ├── insight-sidecar-vs-init.md
│   └── insight-crashloop-diagnosis.md
└── source.md
```

### INDEX 示例

```markdown
## 按错误/排障
### CrashLoopBackOff
- L1: §6§6.2
- L3: insight-crashloop-diagnosis.md
```
