---
name: deep-reader
description: >-
  深度阅读 Agent：对文章、书籍、论文进行三层结构化分析（L1 穷举索引 + L2 维度报告 + L3 原子洞察）。
  自动分类文本为叙事类/论证类/模型类/信息工具类，生成分面索引支持多维检索。
  支持后续问答（索引定位 + 报告搜索 + 原文验证 + Web 补充）。
  Use when user provides text to analyze, mentions "深度阅读", "阅读分析",
  "帮我读", "read this", "analyze this", or asks questions about analyzed texts.
allowed-tools:
  - Bash
  - Write
  - Read
  - Grep
  - Glob
  - WebSearch
  - WebFetch
---

# Deep Reader — 深度阅读 Agent（三层混合架构）

## Architecture Overview

```
┌───────────────────────────────────────────────────────┐
│                   INDEX (分面索引)                      │
│  index.md — 按 人物/场景/主题/意象 四分面建倒排索引      │
│  每个条目指向 L1 / L2 / L3 的具体位置                   │
└──────────┬─────────────────────────┬──────────────────┘
           │                         │
┌──────────▼──────────┐  ┌──────────▼──────────┐  ┌──────────────────┐
│  L1: 章回/段落概览    │  │  L2: 维度深度报告    │  │  L3: 原子洞察     │
│  (Scene/Section Index)│  │  (Dimension Reports) │  │  (Insights)      │
│  穷举 · 浅            │  │  选择 · 深           │  │  原子 · 链接      │
│  每章/段 ~200字条目    │  │  按分析维度组织       │  │  每个发现一个文件   │
│  覆盖率 = 100%        │  │  覆盖率 = 选择性      │  │  涌现式持续生长    │
└───────────────────────┘  └───────────────────────┘  └──────────────────┘
```

- **L1** 解决覆盖率问题：任何细节都能被搜到
- **L2** 保留分析深度：维度切分的深度解读
- **L3** 捕捉非结构化发现：Zettelkasten 风格，越问越丰富
- **INDEX** 解决检索效率：Grep 一次命中，知道去哪个层找

## Directory Structure

```
reading-library/{slug}/
├── meta.json                    # 元数据
├── summary.md                   # 全书一页纸摘要
├── index.md                     # 分面倒排索引
├── L1-scenes.md                 # L1: 章回/段落穷举索引
├── reports/                     # L2: 维度深度报告
│   ├── 01-xxx.md
│   ├── 02-xxx.md
│   └── ...
├── insights/                    # L3: 原子洞察（持续生长）
│   ├── insight-{topic-slug}.md
│   └── ...
├── qa/                          # 问答记录
│   └── {date}-{topic}.md
├── notes/                       # 用户笔记
└── source*.md                   # 原文（gitignored）
```

## Workflow

```
User provides text
       │
       ▼
Phase 1: Ingest → 分类 → 存储
       │
       ▼ Classify (4 types)
  ┌────┼────────┬────────────┐
  ▼    ▼        ▼            ▼
叙事   论证     模型      信息/工具
  │    │        │            │
  ▼    ▼        ▼            ▼
Phase 2: L1 穷举索引 → L2 维度报告 → L3 初始洞察 → INDEX 索引
       │
       ▼
Phase 3: Answer follow-up questions (INDEX → L3 → L1 → L2 → Source → Web)
```

## Phase 1: Ingest

### Step 1: 获取原文

| 用户输入 | Agent 操作 |
|---------|-----------|
| **文件路径** (如 `/tmp/book.txt`) | 用 **Read** 读取 |
| **URL** (如 `https://...`) | 用 **WebFetch** 抓取 |
| **直接粘贴文本** | 直接使用对话文本 |

### Step 2: 生成 slug

从标题生成（小写英文、连字符）：《红楼梦》→ `hong-lou-meng`

### Step 3: 创建目录

```bash
mkdir -p reading-library/{slug}/{reports,insights,qa,notes}
```

### Step 4: 存储原文（自动拆分）

- **≤ 60000 字符**：写入 `source.md`
- **> 60000 字符**：按章节边界拆分，每卷 ≤ 50000 字符，写入 `source-01.md`, `source-02.md`, ...
  - 优先在章节标题处切分（如 `# 第X章`、`## Chapter`）
  - 无明显章节标记时在段落边界硬切

### Step 5: 分类

读取前 3000 字符判断：

| Type | Identifier | Examples |
|------|-----------|---------|
| **narrative** | 有人物、情节、时间线 | 小说、传记、纪实文学 |
| **argument** | 有论点、论据、说服意图 | 学术论文、评论、思想书 |
| **model** | 提出框架/模型/矩阵 | 商业书、心理学、经济理论 |
| **reference** | 查阅为主、操作导向 | API 文档、手册、工具书 |

### Step 6: 写入 meta.json

```json
{
  "title": "...",
  "author": "...",
  "type": "narrative|argument|model|reference",
  "language": "zh|en",
  "tags": ["3-5 keywords"],
  "slug": "...",
  "created_at": "ISO-8601",
  "updated_at": "ISO-8601",
  "status": "ingested",
  "source_chars": 0,
  "source_parts": 1,
  "l1_entries": 0,
  "l2_reports": 0,
  "l3_insights": 0,
  "original_path": "..."
}
```

### Step 7: 更新全局索引

Read `reading-library/index.json`，追加新条目，Write 写回。

### Step 8: 自动进入 Phase 2

不等待用户指令。

---

## Phase 2: Generate（按顺序：L1 → L2 → L3 → INDEX）

Use **Read** tool to load the sub-skill template for the detected type, then follow its instructions.

| Type | Template File | L2 Reports |
|------|--------------|------------|
| narrative | `narrative-reader.md` | 6 reports |
| argument | `argument-reader.md` | 5 reports |
| model | `model-reader.md` | 5 reports |
| reference | `reference-reader.md` | 4 reports |

### Step 2a: Generate summary.md

One-page summary (200-500 words): core content, key takeaways, navigation links to L1/L2/L3.

### Step 2b: Generate L1 — 穷举索引

Write `L1-scenes.md` following the sub-skill template. **Every chapter/section/scene gets an entry, no exceptions.**

### Step 2c: Generate L2 — 维度报告

Write reports to `reports/{nn}-{name}.md` following the sub-skill template.

### Step 2d: Generate L3 — 初始原子洞察

从 L2 报告中提取 **5-10 个最值得单独展开的发现**，每个写一个 `insights/insight-{slug}.md`。

### Step 2e: Generate INDEX — 分面索引

Write `index.md`，按该文本类型对应的分面建倒排索引（详见子技能模板）。
每个索引条目格式：

```markdown
### {条目名}
- L1: {章节位置}
- L2: {报告文件}§{段落}
- L3: {洞察文件}
```

### Step 2f: Update meta.json

Set `status` = `"analyzed"`, update `l1_entries`, `l2_reports`, `l3_insights`, `updated_at`.

### Key Principles

- **L1 穷举无遗漏**：每个章节/段落/场景都有条目
- **L2 一份报告只关注一个维度**，绝不交叉
- **L3 每个文件只包含一个发现**，自包含 + 链接
- **INDEX 是检索入口**，不是分析本身
- **语言跟随原文**：中文原文写中文

### 引用规则（强制，适用于 L2 和 L3）

**任何分析观点必须附带原文引用，无引用的分析无效。**

```markdown
> 📖 "原文摘录内容……"
> — *source.md, 第X章/段 / source-02.md, 第Y段*
```

1. 每个分析观点后紧跟 1-3 条原文引用
2. 引用必须是**原文精确摘录**（非改写），用引号标注
3. 标注**出处**：文件名 + 章节/段落/行号
4. 分卷存储时标注卷号（如 `source-02.md`）

### L2 Report Header

```markdown
# {Report Title}

> **Text**: {title} | **Type**: {type} | **Dimension**: {dimension}
> **Generated**: {date} | **Source**: reading-library/{slug}/

---
```

### L3 Insight File Format

```markdown
# {洞察标题}

> **Tags**: #tag1 #tag2 #tag3
> **Related**: [[L1-scenes.md#Ch.XX]], [[reports/02-xxx.md#Section]], [[insight-other.md]]
> **Source**: {title}

{1-3 段分析，含原文引用}

> 📖 "原文……"
> — *source-XX.md, 位置*
```

---

## Phase 3: Answer Questions

When user asks about a previously analyzed text:

### Step 0: Anchor Context

Read `meta.json` to get **title** — all subsequent searches MUST be scoped to this text.

### Step 1: Search INDEX (First Jump)

Use **Grep** on `index.md` with the user's keywords → get pointers to L1/L2/L3 locations.

### Step 2: Read L3 Insights

If INDEX points to L3 files, **Read** them first — they contain ready-made atomic analysis.

### Step 3: Read L1 Scene Entry

**Read** the matching chapter/section entry in `L1-scenes.md` for factual context.

### Step 4: Search L2 Reports

Use **Grep** on `reports/` for deeper dimensional analysis if L3 doesn't fully answer.

### Step 5: Search Source

Use **Grep** on `source*.md` for precise original text quotes.

### Step 6: Web Search (带上下文！)

**CRITICAL**: WebSearch query MUST include the text title.
- ✅ `"红楼梦 宝钗扑蝶 滴翠亭"`
- ❌ `"扑蝶"` (bare keyword loses context)

### Step 7: Generate New L3 (if applicable)

If the Q&A produced a novel insight not in existing L3, **Write** a new insight file to `insights/`.

### Step 8: Save Q&A

Write exchange to `qa/{date}-{topic}.md`.

### Step 9: Synthesize Answer

```markdown
## [精炼问题]

### 发现
[核心回答]

> 📖 "原文精确引用……"
> — *source.md, 位置*

[基于引用的分析]

### 证据链
- **L1**: L1-scenes.md § Ch.XX — 场景概要
- **L3**: insight-xxx.md — 相关洞察
- **L2**: reports/XX.md § Section — 维度分析
- **原文**: source-XX.md 第X章 — "精确引文..."
- **外部**: [来源名](URL) — 佐证

### 深层解读
[作者意图 / 更大意义，附原文引用]

### 延伸问题
[值得继续探索的方向]
```

**问答同样遵守引用规则：每个回答观点必须附带原文出处。**

---

## Sub-skill Templates

Read on demand during Phase 2:

- [narrative-reader.md](narrative-reader.md) — 叙事类（小说、传记、纪实）
- [argument-reader.md](argument-reader.md) — 论证类（论文、评论、思想书）
- [model-reader.md](model-reader.md) — 模型类（商业、心理、经济理论）
- [reference-reader.md](reference-reader.md) — 信息/工具类（手册、技术文档）
