---
name: deep-reader
description: >-
  深度阅读 Agent：对文章、书籍、论文进行多维度结构化分析。
  自动分类文本为叙事类/论证类/模型类/信息工具类，生成独立、不交叉的报告。
  支持后续问答（搜索报告 + 原文 + Web）。
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

## Phase 1: Ingest（用户只需提供文件路径 / URL / 粘贴文本）

### Step 1: 获取原文

根据用户输入的形式获取全文：

| 用户输入 | Agent 操作 |
|---------|-----------|
| **文件路径** (如 `/tmp/book.txt`) | 用 **Read** 读取文件内容 |
| **URL** (如 `https://...`) | 用 **WebFetch** 抓取网页内容 |
| **直接粘贴文本** | 直接使用对话中的文本 |

### Step 2: 生成 slug

从标题自动生成 slug（小写英文、连字符分隔），例如：
- 《红楼梦》→ `hong-lou-meng`
- "Erta Paper on LLM" → `erta-paper-on-llm`

### Step 3: 创建目录结构

用 **Bash** 工具执行：

```bash
mkdir -p reading-library/{slug}/reports reading-library/{slug}/qa reading-library/{slug}/notes
```

### Step 4: 存储原文（自动拆分）

用 **Bash** 工具计算原文字符数：`wc -m < /path/to/file` 或直接计算字符串长度。

- **≤ 60000 字符**：直接写入 `reading-library/{slug}/source.md`
- **> 60000 字符**：按自然分隔点（章节标题、空行段落）拆分为多卷：
  1. 用 **Read** 读取原文，找到章节标题（如 `# 第X章`、`## Chapter`、连续空行）
  2. 按章节边界切分，每卷不超过 50000 字符
  3. 用 **Write** 依次写入 `source-01.md`, `source-02.md`, ...
  4. 如果没有明显章节标记，按 50000 字符硬切（在最近的段落边界处断开）

### Step 5: 分类

读取原文前 3000 字符，判断文本类型：

| Type | Identifier | Examples |
|------|-----------|---------|
| **narrative** (叙事类) | 有人物、情节、时间线 | 《红楼梦》、传记、纪实文学 |
| **argument** (论证类) | 有论点、论据、说服意图 | 学术论文、评论、《正义论》 |
| **model** (模型类) | 提出框架/模型/矩阵 | 《好战略坏战略》、《思考快与慢》 |
| **reference** (信息/工具类) | 查阅为主、操作导向 | API 文档、手册、工具书 |

### Step 6: 写入元数据

用 **Write** 写入 `reading-library/{slug}/meta.json`：

```json
{
  "title": "...",
  "author": "...(从文本推断，未知则留空)",
  "type": "narrative|argument|model|reference",
  "language": "zh|en",
  "tags": ["从内容提取 3-5 个关键词"],
  "slug": "...",
  "created_at": "ISO-8601",
  "updated_at": "ISO-8601",
  "status": "ingested",
  "source_chars": 实际字符数,
  "source_parts": 卷数,
  "report_count": 0,
  "original_path": "用户提供的原始路径或URL"
}
```

### Step 7: 更新全局索引

用 **Read** 读取 `reading-library/index.json`，追加新条目，用 **Write** 写回。

### Step 8: 自动进入 Phase 2

Ingest 完成后，**不等待用户指令**，直接进入 Phase 2 开始生成报告。

## Phase 2: Generate Reports

**First**, generate `reading-library/{slug}/summary.md` — a one-page summary (200-500 words) covering core content, key takeaways, and navigation links to reports.

**Then**, use **Read** tool to load the corresponding sub-skill template file from this skill's directory, and follow its instructions.

| Type | Template File | Reports |
|------|--------------|---------|
| narrative | `narrative-reader.md` | 7 reports |
| argument | `argument-reader.md` | 7 reports |
| model | `model-reader.md` | 7 reports |
| reference | `reference-reader.md` | 6 reports |

Use **Write** tool to save each report to `reading-library/{slug}/reports/{nn}-{name}.md`.

After all reports are done, update `meta.json`: set `status` to `"analyzed"`, update `report_count` and `updated_at`.

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

0. **Find document** → Use **Read** on `reading-library/index.json` to locate the slug, then read `meta.json`
1. **Search reports** → Use **Grep** to find matching content in `reading-library/{slug}/reports/`
2. **Search source** → Use **Read** / **Grep** on `source.md` if reports lack detail
3. **Web search** → Use **WebSearch** for external context
4. **Save Q&A** → Use **Write** to save the exchange to `reading-library/{slug}/qa/{date}-{topic}.md`
5. **Synthesize** answer:

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
