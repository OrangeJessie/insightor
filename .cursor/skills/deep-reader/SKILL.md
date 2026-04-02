---
name: deep-reader
description: >-
  Deep reading agent that analyzes articles, books, and papers in depth.
  Classifies text into one of four categories (narrative, argumentative,
  model-based, reference) and dispatches to a specialized sub-skill to
  generate structured, non-overlapping reports. Answers follow-up questions
  by cross-referencing stored reports, source text, and web search.
  TRIGGER when: user provides an article/book/text to read, mentions "深度阅读",
  "阅读分析", "read this", "analyze this", "帮我读", "生成报告", or asks
  questions about a previously analyzed text.
  DO NOT TRIGGER when: simple summarization, translation, or code review.
---

# Deep Reader — 深度阅读 Agent

由 4 个专精子技能组成的阅读分析引擎。每个子技能针对一类文本，生成独立、不交叉的多维报告。

## Workflow Overview

```
User provides text
       │
       ▼
┌─ Phase 1: Ingest ────────────────────────┐
│  Receive → Detect type → Store source    │
└──────────────┬───────────────────────────┘
               │
       ▼ Classify content type
       │
  ┌────┼────────┬────────────┐
  ▼    ▼        ▼            ▼
叙事类  论证类   模型类     信息/工具类
  │    │        │            │
  ▼    ▼        ▼            ▼
┌─ Phase 2: Generate Reports (sub-skill) ──┐
│  Read templates → Analyze → Write reports │
└──────────────┬───────────────────────────┘
               │
       ▼ Phase 3: Cross-reference
       │
       ▼ Phase 4: Answer follow-up questions
```

## Phase 1: Ingest (All Types)

1. Receive text from user (pasted, file path, or URL via `WebFetch`).
2. **Classify** into one of four types (see classification rules below).
3. Create slug directory under `reading-library/`.
4. Save full text as `source.md`. For texts > 80k chars, split into `source-01.md`, `source-02.md`, ...
5. Write `meta.json`:

```json
{
  "title": "...",
  "author": "...",
  "type": "narrative|argument|model|reference",
  "subtype": "novel|biography|...",
  "language": "zh|en|...",
  "tags": [],
  "created_at": "ISO-8601",
  "slug": "..."
}
```

### Storage Layout

```
reading-library/
└── {slug}/
    ├── meta.json
    ├── source.md (or source-01.md, source-02.md ...)
    └── reports/
        ├── 01-xxx.md
        ├── 02-xxx.md
        └── ...
```

### Classification Rules

| Type | Identifier | Subtypes | Examples |
|------|-----------|----------|---------|
| **narrative** (叙事类) | 有人物、情节、时间线推进 | novel, biography, non-fiction-narrative | 《红楼梦》、《乔布斯传》、《切尔诺贝利的悲鸣》 |
| **argument** (论证类) | 有论点、论据、说服意图 | academic-paper, critique, intellectual-book | arXiv 论文、书评、《正义论》 |
| **model** (模型类) | 提出框架/模型/矩阵/公式 | business, psychology, economics | 《好战略坏战略》、《思考快与慢》、博弈论教材 |
| **reference** (信息/工具类) | 以查阅为主、操作导向 | manual, tech-doc, handbook | API 文档、《芝加哥格式手册》、工具书 |

若文本跨类，选择**主要意图**对应的类型。用户可手动覆盖。

## Phase 2: Generate Reports (Dispatch)

根据分类结果，读取对应的子技能文件并遵循其指令生成报告：

| Type | Sub-skill File | Report Count |
|------|---------------|-------------|
| narrative | [narrative-reader.md](narrative-reader.md) | 7 reports |
| argument | [argument-reader.md](argument-reader.md) | 7 reports |
| model | [model-reader.md](model-reader.md) | 7 reports |
| reference | [reference-reader.md](reference-reader.md) | 6 reports |

**关键原则**：
- **一份报告只关注一个维度**，绝不交叉
- 每份报告**自包含**，可独立检索
- **引用来源位置**（章节/段落/页码）
- **语言跟随原文**：中文原文写中文报告

## Phase 3: Cross-Reference

报告全部生成后，在每份报告末尾添加 `## Cross-References` 段落，标注与其他报告的关联点。

## Phase 4: Answer Questions

用户就已分析文本提问时：

1. **搜索报告** → `Grep` / `Read` 在 `reading-library/{slug}/reports/` 中查找
2. **搜索原文** → 报告不够细时回溯 `source.md`
3. **Web 搜索** → `WebSearch` 获取外部背景（作者访谈、学术评论、历史考证）
4. **综合输出**：

```markdown
## [精炼问题]

### 发现
[核心回答 + 证据]

### 证据链
- **原文**: source.md 第X章/段 — "引文..."
- **报告**: {report-file} § {section} — 分析要点
- **外部**: [来源名](URL) — 补充信息

### 深层解读
[作者意图 / 更大意义]

### 延伸问题
[值得继续探索的方向]
```

## Report Header Standard

每份报告文件必须以此格式开头：

```markdown
# {Report Title}

> **Text**: {title} | **Type**: {type}/{subtype} | **Dimension**: {dimension}
> **Generated**: {ISO date} | **Source**: reading-library/{slug}/source.md

---
```
