# Reading Library — 深度阅读文档库

## 三层混合架构

```
reading-library/{slug}/
├── meta.json                    ← 文档元数据
├── summary.md                   ← 一页纸摘要
├── index.md                     ← 🔍 分面倒排索引（检索入口）
├── L1-scenes.md                 ← 📋 穷举索引（覆盖率 100%）
├── reports/                     ← 📊 L2 维度深度报告
│   ├── 01-xxx.md
│   ├── 02-xxx.md
│   └── ...
├── insights/                    ← 💡 L3 原子洞察（持续生长）
│   ├── insight-{topic}.md
│   └── ...
├── qa/                          ← 💬 问答记录
│   └── {date}-{topic}.md
├── notes/                       ← 📝 用户笔记
└── source*.md                   ← 📄 原文（gitignored）
```

### 三层说明

| 层 | 文件 | 特点 | 解决什么问题 |
|----|------|------|-------------|
| **L1** | `L1-scenes.md` | 穷举·浅 | 覆盖率——任何细节都能搜到 |
| **L2** | `reports/*.md` | 选择·深 | 分析深度——维度切分的深度解读 |
| **L3** | `insights/*.md` | 原子·链接 | 非结构化发现——越问越丰富 |
| **INDEX** | `index.md` | 倒排索引 | 检索效率——Grep 一次命中 |

### 检索流程

```
用户提问
  │
  ▼
Grep index.md → 命中条目 → 指向 L1/L2/L3 位置
  │
  ▼
Read L3 (原子洞察) → Read L1 (场景上下文) → Grep L2 (维度分析) → Grep source (原文)
  │
  ▼
WebSearch (带书名限定) → 综合回答
```

## 文件说明

### meta.json

```json
{
  "title": "红楼梦",
  "author": "曹雪芹",
  "type": "narrative",
  "language": "zh",
  "tags": ["古典文学", "小说"],
  "slug": "hong-lou-meng",
  "created_at": "2026-04-02T10:00:00Z",
  "updated_at": "2026-04-02T12:00:00Z",
  "status": "analyzed",
  "source_chars": 580000,
  "source_parts": 15,
  "l1_entries": 520,
  "l2_reports": 6,
  "l3_insights": 12
}
```

字段说明：
- `type`: `narrative` | `argument` | `model` | `reference`
- `status`: `ingested` → `analyzing` → `analyzed`
- `l1_entries`: L1 场景/单元条目数
- `l2_reports`: L2 维度报告数
- `l3_insights`: L3 原子洞察数（会持续增长）

### index.json（全局索引）

```json
{
  "version": 2,
  "documents": [
    {
      "slug": "hong-lou-meng",
      "title": "红楼梦",
      "type": "narrative",
      "status": "analyzed",
      "created_at": "2026-04-02T10:00:00Z"
    }
  ]
}
```

### 按文本类型的 L2 报告

| 类型 | 报告数 | 维度 |
|------|--------|------|
| narrative | 6 | 实体、符号、结构、规则、主题、风格 |
| argument | 5 | 论点、论据、逻辑、脉络、方法 |
| model | 5 | 模型、变量、假设、应用、对比 |
| reference | 4 | 体系、概念、流程、规格 |

### INDEX 分面（按类型不同）

| 类型 | 分面 |
|------|------|
| narrative | 人物、关键场景、主题、意象/符号 |
| argument | 论点、术语、方法、学者/引文 |
| model | 模型/框架、变量/概念、案例、行业/场景 |
| reference | 概念/术语、操作/命令、配置/参数、错误/排障 |

## 使用方式

```
> 帮我深度阅读这篇文章 [粘贴文本 / 文件路径 / URL]
> 红楼梦里宝钗扑蝶是怎么回事？
> 列出我所有的阅读文档
```

## Git 说明

- `source*.md` 被 `.gitignore` 忽略（原文可能很大或有版权）
- `meta.json`、`summary.md`、`index.md`、`L1-scenes.md`、`reports/`、`insights/`、`qa/` 都会被 git 跟踪
