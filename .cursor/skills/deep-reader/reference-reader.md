# Reference Reader — 信息/工具类深度阅读子技能

适用：手册、技术文档、API 文档、工具书、百科、操作指南等以**查阅 + 操作**为主要用途的文本。

---

## 需要生成的 6 份报告

| File | Dimension | 聚焦点 |
|------|-----------|--------|
| `01-architecture.md` | 体系层 | 知识体系结构、层级关系、全局地图 |
| `02-concepts.md` | 概念层 | 核心概念定义、术语表 |
| `03-procedures.md` | 流程层 | 操作步骤、工作流、决策树 |
| `04-specifications.md` | 规格层 | 技术参数、配置项、接口定义 |
| `05-troubleshooting.md` | 排障层 | 常见问题、错误代码、排错指南 |
| `06-quick-reference.md` | 速查层 | 备忘录、速查表、常用命令 |

---

## 01 — 体系层 (Architecture)

聚焦**整体怎么组织的**，知识地图和层级结构，不进入具体定义。

```markdown
## Knowledge Map (知识地图)

```
[Top-level Domain]
├── [Area A]
│   ├── [Sub-area A1]
│   └── [Sub-area A2]
├── [Area B]
│   ├── [Sub-area B1]
│   └── [Sub-area B2]
└── [Area C]
```

## Module Dependency Graph
哪些知识模块依赖其他模块：

```
[A] ──requires──→ [B]
[C] ──extends──→ [A]
[D] ──independent──
```

## Reading Paths (阅读路径)
根据不同目标推荐的阅读顺序：

| Goal | Recommended Path | Skip |
|------|-----------------|------|
| 快速入门 | Ch.1 → Ch.3 → Ch.7 | Ch.4-6 (高级) |
| 深度掌握 | Ch.1-10 顺序 | — |
| 查阅特定问题 | 索引 → 对应章节 | 其余 |

## Scope & Coverage
| Topic | Covered? | Depth | Location |
|-------|----------|-------|----------|
| ... | ✅/❌/Partial | Deep/Overview/Mention | §X |
```

---

## 02 — 概念层 (Concepts)

聚焦**关键词是什么意思**，精确定义和辨析，不做操作指导。

```markdown
## Core Glossary

| Term | Definition | Category | Related Terms | Location |
|------|-----------|----------|--------------|----------|
| ... | ... | ... | ... | §X.X |

## Concept Relationships

```
[Concept A] ──is-a──→ [Concept B]
[Concept C] ──has-a──→ [Concept D]
[Concept E] ──vs──→ [Concept F]
```

## Disambiguation (易混淆概念)

| Term A | Term B | Key Difference | Common Confusion |
|--------|--------|---------------|-----------------|
| ... | ... | ... | ... |

## Acronyms & Abbreviations
| Abbr | Full Form | Meaning |
|------|-----------|---------|
| ... | ... | ... |
```

---

## 03 — 流程层 (Procedures)

聚焦**怎么做**，操作步骤和工作流，不做概念解释。

```markdown
## Procedure Index

| ID | Procedure | Purpose | Prerequisite | Location |
|----|-----------|---------|-------------|----------|
| P01 | 初始安装 | 环境搭建 | — | §2.1 |
| P02 | 配置认证 | 安全接入 | P01 complete | §2.3 |

### P01 — 初始安装

**Prerequisites**: ...

**Steps**:
1. ...
2. ...
3. ...

**Verification**: 如何确认成功
**Rollback**: 如何回退

## Decision Trees (决策树)

```
Q: 需要什么类型的部署？
├── 单机 → P03
├── 集群 → P04
└── 云端 → P05
```

## Workflow Diagrams

```
[Input] → [Step A] → [Decision Point]
                         ├── Yes → [Step B] → [Output 1]
                         └── No  → [Step C] → [Output 2]
```

## Common Sequences (常用操作序列)
| Scenario | Steps | Estimated Time |
|----------|-------|---------------|
| 日常维护 | P01→P03→P07 | 15min |
| 故障恢复 | P02→P05→P08 | 30min |
```

---

## 04 — 规格层 (Specifications)

聚焦**具体参数是什么**，精确数值和配置，不做操作指导。

```markdown
## Configuration Reference

| Parameter | Type | Default | Range | Description | Location |
|-----------|------|---------|-------|-------------|----------|
| timeout | int | 30 | 1-3600 | 超时秒数 | §4.1 |
| max_retries | int | 3 | 0-10 | 最大重试 | §4.1 |

## API / Interface Reference

| Endpoint/Function | Input | Output | Side Effects | Location |
|-------------------|-------|--------|-------------|----------|
| GET /api/v1/users | query params | User[] | none | §5.2 |

## Data Formats

| Format | Schema | Example | Constraints |
|--------|--------|---------|------------|
| Request body | `{name: string, age: int}` | `{"name":"A","age":1}` | age > 0 |

## Version Compatibility Matrix

| Version | Feature A | Feature B | Feature C | Breaking Changes |
|---------|-----------|-----------|-----------|-----------------|
| 1.0 | ✅ | ❌ | ❌ | — |
| 2.0 | ✅ | ✅ | ❌ | API v1 deprecated |

## Limits & Quotas
| Resource | Limit | Soft/Hard | Workaround |
|----------|-------|-----------|-----------|
| ... | ... | ... | ... |
```

---

## 05 — 排障层 (Troubleshooting)

聚焦**出了问题怎么办**，错误诊断和修复，不做正常流程描述。

```markdown
## Error Code Reference

| Code | Message | Cause | Fix | Location |
|------|---------|-------|-----|----------|
| E001 | Connection refused | 服务未启动 | 执行 P01 | §8.1 |
| E002 | Auth failed | Token 过期 | 执行 P02 | §8.2 |

## Symptom → Diagnosis Map

| Symptom | Possible Causes | Diagnostic Steps | Resolution |
|---------|----------------|-----------------|-----------|
| 响应慢 | 1. 网络 2. 负载 3. 配置 | 1. ping 2. top 3. check config | ... |

## FAQ (常见问题)

### Q: [常见问题1]?
**A**: ...
**Related**: E001, P03

### Q: [常见问题2]?
**A**: ...

## Known Issues & Workarounds
| Issue | Affected Versions | Status | Workaround |
|-------|------------------|--------|-----------|
| ... | 2.0-2.3 | Open | ... |

## Diagnostic Commands Cheatsheet
| Purpose | Command | Expected Output |
|---------|---------|----------------|
| 检查状态 | `xxx status` | `Running` |
| 查看日志 | `xxx logs --tail 100` | 最近100行 |
```

---

## 06 — 速查层 (Quick Reference)

聚焦**一页纸备忘**，极致压缩的查阅卡片，不做解释。

```markdown
## Command Cheatsheet

| Action | Command | Notes |
|--------|---------|-------|
| 启动 | `xxx start` | |
| 停止 | `xxx stop --graceful` | 生产环境用 graceful |
| 状态 | `xxx status -v` | -v 显示详情 |

## Key Parameters (常用参数速查)

| Param | Default | Recommended | When to Change |
|-------|---------|-------------|---------------|
| timeout | 30s | 60s for slow network | 网络延迟 >200ms |

## Conversion Tables / Formulas
| From | To | Formula |
|------|----|---------|
| ... | ... | ... |

## Decision Quick-Guide
```
Need X? → Use A
Need Y? → Use B
Not sure? → Start with A, switch if [condition]
```

## File / Directory Map
| Path | Purpose |
|------|---------|
| /etc/xxx/config.yaml | 主配置 |
| /var/log/xxx/ | 日志目录 |

## Keyboard Shortcuts / Hotkeys (if applicable)
| Key | Action |
|-----|--------|
| Ctrl+C | 中断 |
```

---

## Cross-Reference Execution (信息/工具类专用)

1. **体系 ↔ 概念**: `01-architecture.md` 知识模块 → `02-concepts.md` 覆盖是否完整
2. **流程 ↔ 规格**: `03-procedures.md` 步骤中引用的参数 → `04-specifications.md` 中有定义
3. **排障 ↔ 流程**: `05-troubleshooting.md` 修复步骤 → 引用 `03-procedures.md` 的具体操作
4. **速查 ↔ 全部**: `06-quick-reference.md` 每条 → 标注来自哪份详细报告
