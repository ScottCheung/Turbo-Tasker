读取 `input/TASK.md`，然后只修改：

`data/assessment.json`

禁止修改任何其他文件。

你的任务是分析一个技术 assessment 题目，并生成适合候选人在约 15 分钟内讲解的辅助内容。

最终内容用于技术面试现场展示，因此必须：

* 简洁
* 清晰
* 易扫读
* 技术上有深度
* 容易口头表达
* 不堆砌无关细节
* 不为了显得复杂而过度设计

---

## 1. 判断题型

首先将题目分类为以下其中一个：

* Coding
* Debugging
* System Design
* Backend Design
* Database
* Technical Analysis

将结果写入：

`taskType`

必须选择最接近的一种，不要创建新的类型。

---

## 2. 固定使用 5 个 Section

Section 数量、顺序、ID 和标题全部固定。

禁止增加、删除、重命名或调整顺序。

必须严格使用：

1. `understanding` — `Understanding`
2. `approach` — `Approach`
3. `core-solution` — `Core Solution`
4. `verification` — `Verification`
5. `wrap-up` — `Wrap-up`

不同题型只改变内容，不改变页面结构。

---

## 3. 不同题型如何使用 5 个 Section

### System Design / Backend Design

**Understanding**

* functional requirements
* non-functional requirements
* constraints
* important assumptions

**Approach**

* high-level direction
* system boundaries
* main architectural strategy

**Core Solution**

* architecture
* data flow
* storage
* asynchronous processing
* consistency
* important design decisions

**Verification**

* failure handling
* scalability
* reliability
* trade-offs
* important edge cases

**Wrap-up**

* key design summary
* limitations
* future improvements

---

### Coding

**Understanding**

* input
* output
* constraints
* important examples

**Approach**

* algorithm
* data structure
* reasoning behind the choice

**Core Solution**

* main implementation logic
* important steps
* important state or variables

**Verification**

* test cases
* edge cases
* correctness
* time complexity
* space complexity

**Wrap-up**

* final result
* possible optimisation
* important limitation

---

### Debugging

**Understanding**

* observed symptom
* expected behaviour
* available evidence

**Approach**

* likely hypotheses
* investigation order
* how to isolate the problem

**Core Solution**

* root cause
* fix
* why the fix works

**Verification**

* how to reproduce before the fix
* how to confirm after the fix
* regression tests

**Wrap-up**

* prevention
* monitoring
* future safeguards

---

### Database

**Understanding**

* entities
* access patterns
* data constraints
* consistency requirements

**Approach**

* schema strategy
* query strategy
* indexing
* transaction strategy

**Core Solution**

* tables or schema
* key queries
* indexes
* transaction behaviour

**Verification**

* correctness
* query performance
* concurrency
* consistency
* failure cases

**Wrap-up**

* trade-offs
* operational considerations
* future scaling

---

### Technical Analysis

**Understanding**

* main question
* available evidence
* constraints
* assumptions

**Approach**

* analytical method
* comparison criteria
* reasoning framework

**Core Solution**

* main findings
* evidence
* recommendation

**Verification**

* uncertainty
* assumptions
* counterarguments
* missing information

**Wrap-up**

* final recommendation
* limitation
* next step

---

## 4. JSON 结构

必须严格保持以下结构：

```json
{
  "title": "",
  "taskType": "",
  "summary": ["", "", ""],
  "sections": [
    {
      "id": "understanding",
      "title": "Understanding",
      "points": [],
      "speakingNotes": [],
      "visual": ""
    },
    {
      "id": "approach",
      "title": "Approach",
      "points": [],
      "speakingNotes": [],
      "visual": ""
    },
    {
      "id": "core-solution",
      "title": "Core Solution",
      "points": [],
      "speakingNotes": [],
      "visual": ""
    },
    {
      "id": "verification",
      "title": "Verification",
      "points": [],
      "speakingNotes": [],
      "visual": ""
    },
    {
      "id": "wrap-up",
      "title": "Wrap-up",
      "points": [],
      "speakingNotes": [],
      "visual": ""
    }
  ]
}
```

禁止：

* 添加未知字段
* 修改字段名
* 添加 `timePercent`
* 添加 `diagram`
* 添加 `architectureDiagram`
* 添加 pagination metadata
* 添加额外 section

---

## 5. Title

`title` 应准确描述题目。

要求：

* 最多约 8 个英文单词
* 简洁
* 不要写成长句
* 不要重复 taskType

---

## 6. Summary

`summary` 必须正好 3 条。

每条最多约 12 个英文单词。

分别表达：

1. What needs to be solved
2. Main constraint or difficulty
3. Main success condition

Summary 只用于快速理解题目。

不要在这里展开实现细节。

---

## 7. Points

默认数量：

* Understanding：3 条
* Approach：3 条
* Core Solution：3–4 条
* Verification：3 条
* Wrap-up：2–3 条

每条建议控制在：

**8–14 个英文单词**

每个 point 必须：

* 只表达一个核心意思
* 能够快速扫读
* 有明确技术信息
* 按自然讲解顺序排列

不要：

* 写长段落
* 重复同一个观点
* 把完整演讲稿放进 points
* 为了显得高级堆大量技术名词
* 列出所有可能 edge cases

---

## 8. 难题处理原则

如果题目简单：

保持方案简单。

如果题目复杂：

不要通过增加大量 section 或大量 bullet 来体现复杂度。

应该提高现有 point 的技术深度。

重点深入：

* hardest technical decision
* correctness
* consistency
* failure handling
* concurrency
* scalability
* important trade-offs

优先选择最值得讨论的 2–4 个技术问题。

原则：

**信息量保持克制，技术深度根据题目动态提高。**

如果一个复杂题目需要更深入解释，可以让一个 point 表达更高级的设计决策，例如：

* Transactional outbox prevents lost events after database commits.
* Idempotent consumers make at-least-once delivery safe.
* Partitioning by account preserves event ordering.

不要通过生成 8–10 个 bullet 来增加深度。

---

## 9. Speaking Notes

`speakingNotes` 必须使用英文。

不要使用中文。

这些内容会直接作为英文面试时的口头提示。

每个 Section：

* 2–3 条
* 每条约 8–14 个英文单词
* 一句话只表达一个意思
* 使用简单、自然、容易说出口的英语
* 优先使用常见词汇
* 避免复杂从句
* 避免书面报告风格
* 避免过长句子

Speaking Notes 不需要覆盖所有 points。

只帮助候选人：

* 开始这一段
* 解释最关键的观点
* 自然过渡到下一步

好的例子：

* "I would first clarify the main constraints."
* "The database should remain the source of truth."
* "The main trade-off is extra operational complexity."
* "Then I would verify the important failure cases."

不好的例子：

* "Taking into consideration the aforementioned architectural constraints and scalability requirements..."
* "As previously discussed in the preceding section..."

---

## 10. Visual

`visual` 只在图能够明显提升理解时使用。

否则：

```json
"visual": ""
```

适合 Mermaid 的情况包括：

* architecture
* request flow
* event flow
* asynchronous processing
* database relationships
* algorithm flow
* debugging flow
* important state transitions

如果生成 Mermaid：

* 使用简单 `flowchart`
* 默认控制在 5–8 个主要节点
* 只展示关键组件和关键流程
* 保持标签简短
* 保证 Mermaid 语法合法

例如：

```text
flowchart LR
Client --> API
API --> DB[(PostgreSQL)]
API --> Queue
Queue --> Worker
Worker --> DB
```

不要为了显得完整而加入：

* logging
* monitoring
* CI/CD
* deployment
* dashboards
* secondary infrastructure

除非题目明确要求这些内容。

如果题目非常复杂，可以适当增加节点，但仍然优先保证可读性。

---

## 11. Trade-off 处理

如果存在明显技术选型或 trade-off，应该明确指出。

例如：

* SQL vs NoSQL
* synchronous vs asynchronous
* consistency vs availability
* Kafka vs managed queue
* cache vs direct database access
* simplicity vs scalability

Trade-off 应优先放在：

`Verification`

或必要时放在：

`Core Solution`

使用简短、直接的句式。

例如：

* "Kafka gives more flexibility but adds operational complexity."
* "Strong consistency simplifies correctness but may reduce availability."

不要为了制造 trade-off 强行比较无关方案。

---

## 12. Assumptions

如果题目缺少必要信息，可以做合理假设。

不要停下来询问用户。

只选择会影响方案的重要假设。

例如：

* expected traffic
* latency requirement
* consistency requirement
* failure tolerance
* data size

假设应自然融入 `Understanding`。

不要生成大量假设。

---

## 13. 优先级

生成内容时按以下优先级：

1. 正确理解题目
2. 给出可解释的核心方案
3. 保证技术正确性
4. 展示关键技术深度
5. 覆盖重要 failure / edge cases
6. 保持内容容易讲
7. 最后才考虑额外复杂度

如果时间或内容空间有限：

优先删除次要内容。

不要删除核心技术决策。

---

## 14. 最终检查

写入 `data/assessment.json` 前必须检查：

* taskType 属于允许的 6 种类型
* 只有固定 5 个 sections
* section 顺序正确
* section ID 完全正确
* section title 完全正确
* summary 正好 3 条
* Understanding 通常 3 条
* Approach 通常 3 条
* Core Solution 不超过 4 条
* Verification 通常 3 条
* Wrap-up 2–3 条
* speakingNotes 每段 2–3 条
* speakingNotes 使用简单英文
* 没有明显重复
* 没有长段落
* 没有无意义技术堆砌
* visual 只在真正需要时生成
* Mermaid 语法合法
* JSON 语法合法

最后直接修改：

`data/assessment.json`

不要修改任何其他文件。

不要创建额外文件。

不要输出解释。

不要输出 Markdown。

完成修改后结束。
