---
name: deep-reader
description: >-
  深度阅读 Agent：对文章、书籍、论文进行多维度结构化分析。
  自动分类文本为叙事类/论证类/模型类/信息工具类，生成独立、不交叉的报告。
  支持后续问答（搜索报告 + 原文 + Web）。
  Use when user provides text to analyze, mentions "深度阅读", "阅读分析",
  "帮我读", "read this", "analyze this", or asks questions about analyzed texts.
allowed-tools:
  - Write
  - Read
  - Grep
  - Glob
  - WebSearch
  - WebFetch
---

# Deep Reader — 深度阅读 Agent

由 4 个专精子技能组成的阅读分析引擎。每个子技能针对一类文本，生成独立、不交叉的多维报告。

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
Phase 2: Read sub-skill template → Generate reports
       │
       ▼
Phase 3: Cross-reference across reports
       │
       ▼
Phase 4: Answer follow-up questions
```

## Phase 1: Ingest

1. Receive text (pasted, file path, or URL via WebFetch).
2. Classify into one of four types:

| Type | Identifier | Examples |
|------|-----------|---------|
| **narrative** (叙事类) | 有人物、情节、时间线 | 《红楼梦》、传记、纪实文学 |
| **argument** (论证类) | 有论点、论据、说服意图 | 学术论文、评论、《正义论》 |
| **model** (模型类) | 提出框架/模型/矩阵 | 《好战略坏战略》、《思考快与慢》 |
| **reference** (信息/工具类) | 查阅为主、操作导向 | API 文档、手册、工具书 |

3. Create directory: `reading-library/{slug}/`
4. Use **Write** tool to save:
   - `reading-library/{slug}/source.md` — full text
   - `reading-library/{slug}/meta.json`:

```json
{
  "title": "...",
  "author": "...",
  "type": "narrative|argument|model|reference",
  "language": "zh|en",
  "tags": [],
  "created_at": "ISO-8601",
  "slug": "..."
}
```

For texts > 80k chars, split into `source-01.md`, `source-02.md`, etc.

## Phase 2: Generate Reports

Use **Read** tool to load the corresponding sub-skill template file from this skill's directory, then follow its instructions.

| Type | Template File | Reports |
|------|--------------|---------|
| narrative | `narrative-reader.md` | 7 reports |
| argument | `argument-reader.md` | 7 reports |
| model | `model-reader.md` | 7 reports |
| reference | `reference-reader.md` | 6 reports |

Use **Write** tool to save each report to `reading-library/{slug}/reports/{nn}-{name}.md`.

### Key Principles
- **一份报告只关注一个维度**，绝不交叉
- 每份报告**自包含**，可独立检索
- **引用来源位置**（章节/段落/页码）
- **语言跟随原文**：中文原文写中文报告

### Report Header

Every report starts with:

```markdown
# {Report Title}

> **Text**: {title} | **Type**: {type} | **Dimension**: {dimension}
> **Generated**: {date} | **Source**: reading-library/{slug}/source.md

---
```

## Phase 3: Cross-Reference

After all reports are generated, add `## Cross-References` at the end of each report, noting links to other reports.

## Phase 4: Answer Questions

When user asks about a previously analyzed text:

1. **Search reports** → Use **Grep** to find matching content in `reading-library/{slug}/reports/`
2. **Search source** → Use **Read** / **Grep** on `source.md` if reports lack detail
3. **Web search** → Use **WebSearch** for external context
4. **Synthesize** answer:

```markdown
## [精炼问题]

### 发现
[核心回答 + 证据]

### 证据链
- **原文**: source.md 第X章/段 — "引文..."
- **报告**: {report-file} § {section}
- **外部**: [来源名](URL)

### 深层解读
[作者意图 / 更大意义]

### 延伸问题
[值得继续探索的方向]
```

## Sub-skill Templates

Templates define the exact reports and formats for each content type. Read them on demand:

- [narrative-reader.md](narrative-reader.md) — 叙事类（小说、传记、纪实）
- [argument-reader.md](argument-reader.md) — 论证类（论文、评论、思想书）
- [model-reader.md](model-reader.md) — 模型类（商业、心理、经济理论）
- [reference-reader.md](reference-reader.md) — 信息/工具类（手册、技术文档）
