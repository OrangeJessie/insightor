# Reading Library — 深度阅读文档库

## 目录结构

```
reading-library/
├── README.md                  ← 本文件
├── index.json                 ← 全局索引（自动维护）
├── .templates/                ← 报告模板（可自定义）
│   └── ...
│
├── {slug}/                    ← 每篇文档一个独立文件夹
│   ├── meta.json              ← 文档元数据
│   ├── source.md              ← 原文全文（gitignored）
│   ├── source-01.md           ← 超长文本分卷（gitignored）
│   ├── source-02.md
│   ├── summary.md             ← 一页纸摘要（始终生成）
│   ├── reports/               ← 多维分析报告
│   │   ├── 01-entities.md
│   │   ├── 02-symbols.md
│   │   └── ...
│   ├── qa/                    ← 问答记录
│   │   ├── 2026-04-02-主题.md
│   │   └── ...
│   └── notes/                 ← 用户笔记（手动添加）
│       └── ...
```

## 文件说明

### meta.json

每个文档的元数据，用于索引和检索。

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
  "source_parts": 8,
  "report_count": 7
}
```

字段说明：
- `type`: `narrative` | `argument` | `model` | `reference`
- `status`: `ingested`（已入库）→ `analyzing`（分析中）→ `analyzed`（已完成）
- `source_parts`: 原文被分成几个文件（1 表示单文件 source.md）

### index.json

全局索引，列出所有已入库的文档，方便快速查找。

```json
{
  "version": 1,
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

### summary.md

无论什么类型的文本，都会生成一份一页纸摘要，包含：
- 核心内容概述（200-500 字）
- 关键词 / 标签
- 与各份报告的导航链接

### reports/ 目录

按维度独立的分析报告，不交叉。命名规则：`{序号}-{英文名}.md`。
具体报告数量和维度取决于文本类型（参见 deep-reader skill 定义）。

### qa/ 目录

每次用户基于该文档的问答记录，命名规则：`{日期}-{主题slug}.md`。
方便回顾历史讨论。

### notes/ 目录

用户自己的笔记和批注，不会被自动修改。

## 使用方式

在 insightor 中：

```
> 帮我深度阅读这篇文章 [粘贴文本 / 给出文件路径 / 给出 URL]
> 红楼梦里黛玉的判词是什么意思？
> 列出我所有的阅读文档
```

## Git 说明

- `source*.md` 文件被 `.gitignore` 忽略（原文可能很大或有版权）
- `meta.json`、`summary.md`、`reports/`、`qa/` 都会被 git 跟踪
