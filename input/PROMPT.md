读取：

`input/TASK.md`

然后从零生成：

`data/result.json`

如果 `data/result.json` 已存在，直接完整覆盖。

不要读取、修改或参考：

`data/assessment.json`

不要修改任何其他文件。

---

# Goal

把技术 assessment 转成一套适合约 15 分钟讲解的 5-slide presentation。

核心原则：

**Technical depth can be advanced. English must stay simple.**

候选人英语有限，所以：

* `points`：只用英文
* `summary`：中英对照，帮助快速理解原题
* `speakingNotes`：中文解释 + 简单英文 SAY
* `visual`：英文技术名称
* 不要用复杂英语表现专业度

---

# 1. Task Type

`taskType` 只能是：

* Coding
* Debugging
* System Design
* Backend Design
* Database
* Technical Analysis

---

# 2. Fixed Slides

严格固定以下 5 个 slide。

禁止修改 ID、顺序和标题：

1. `understanding` — `Understanding`
2. `approach` — `Approach`
3. `core-solution` — `Core Solution`
4. `verification` — `Verification`
5. `wrap-up` — `Wrap-up`

不要增加或删除 slide。

---

# 3. Summary = 原题快速理解

`summary` 必须正好 3 条。

每条必须使用：

`EN: <simple English> | 中文: <清楚完整的中文解释>`

Summary 只总结题目本身，不提前给解决方案。

分别表达：

1. What needs to be built or solved
2. The hardest requirement or constraint
3. What success means

例如：

`EN: Prevent overselling during a flash sale. | 中文: 秒杀期间很多用户会同时购买同一个 SKU，系统必须保证库存绝对不能卖超。`

中文可以比英文详细。

---

# 4. Slide Responsibilities

## Understanding

说明：

* what the problem is
* important requirements
* important constraints
* assumptions

3–5 points。

---

## Approach

说明：

* overall strategy
* key technical direction
* sync vs async boundary
* important design choices

3–5 points。

---

## Core Solution

这是最重要的一页。

Backend / System Design：

* architecture
* request / event flow
* database
* transactions
* queue / Kafka
* workers
* idempotency
* consistency
* recovery path

Coding：

* algorithm
* data structure
* implementation flow

Debugging：

* root cause
* fix
* why it works

Database：

* schema
* queries
* indexes
* transactions

4–6 points。

如果图有帮助，优先在这里生成 Mermaid。

---

## Verification

说明实际环境中的风险：

* failures
* retries
* duplicate work
* concurrency
* edge cases
* scaling
* consistency
* testing
* trade-offs

4–6 points。

只选最重要的问题。

---

## Wrap-up

说明：

* final recommendation
* why it works
* biggest limitation or trade-off

2–3 points。

---

# 5. Main Slide Points

所有 `points` 必须是英文。

必须：

* simple English
* short and scannable
* technically accurate
* one main idea per point

通常每条 8–16 个英文单词。

可以保留技术词：

* PostgreSQL
* Kafka
* Redis
* idempotency
* transactional outbox
* DLQ
* partitioning
* eventual consistency

但句子本身必须简单。

不好：

`Use guarded state transitions to preserve correctness under concurrent execution.`

更好：

`Only allow valid state changes so two workers cannot update the order twice.`

不好：

`Reconciliation resolves ambiguous external payment outcomes.`

更好：

`If payment times out, check the provider before retrying.`

---

# 6. Speaking Notes

Speaking Notes 是最重要的救场内容。

每一条必须严格使用：

`中文理解：<完整中文解释> | SAY: <可以直接说的简单英文>`

不要只写关键词。

不要只写：

`中文理解：检查 duplicate request`

必须解释：

* 发生了什么
* 为什么重要
* 这个设计怎么处理

例如：

`中文理解：用户可能因为网络问题重复提交同一个订单，所以 API 要用 clientRequestId 判断是不是同一次请求，避免创建两个订单。 | SAY: I use a client request ID to prevent duplicate orders.`

---

# 7. Speaking Notes Detail

中文部分必须比主屏更详细。

目标：

**即使候选人完全忘了这一点是什么，只看中文也能重新理解。**

中文解释通常 1–3 句。

应该回答：

* 这个技术点是什么意思？
* 为什么要这样做？
* 如果不这样做会发生什么？

英文 SAY：

* 尽量 6–14 个词
* 简单口语
* 一句话一个意思
* 可以直接读
* 不需要临场重新翻译

如果一个技术点需要两句英文才能说清楚，可以拆成两个 speakingNotes。

---

# 8. Speaking Flow

Speaking Notes 要按照真实讲话顺序。

每页建议：

* Understanding：4–6 条
* Approach：4–6 条
* Core Solution：6–9 条
* Verification：5–8 条
* Wrap-up：3–4 条

第一条帮助开始这一页。

最后一条在适合时帮助过渡。

例如：

`中文理解：这一页先从整体架构开始，我会先说明同步和异步处理怎么拆开。 | SAY: I would first separate the synchronous and asynchronous parts.`

---

# 9. Unknown Terms

如果答案中出现候选人可能不熟悉的术语，例如：

* transactional outbox
* fencing token
* reconciliation
* backpressure
* optimistic locking
* quorum
* partitioning

第一次出现时，Speaking Notes 的中文必须解释它。

例如：

`中文理解：Transactional outbox 的意思是 order 和待发送的 event 在同一个 DB transaction 里保存，这样不会出现订单写成功但消息丢失。 | SAY: I save the order and event in the same transaction.`

不要假设候选人已经理解这些词。

---

# 10. Production-grade Backend / System Design

如果题型是 Backend Design 或 System Design：

不要只生成：

`Client → API → Database → Worker`

根据题目选择真正需要的内容，例如：

* API Gateway / Load Balancer
* stateless API
* PostgreSQL
* Redis
* transaction
* Kafka / queue
* worker
* idempotency
* retry / DLQ
* ordering
* external service
* reconciliation
* scaling
* high availability

不要全部机械加入。

重点必须清楚：

* main data flow
* failure path
* recovery path
* scaling strategy

---

# 11. Mermaid

如果架构图有帮助：

* 使用 `flowchart`
* 使用英文 label
* 可以使用 `subgraph`
* 通常 8–15 个关键节点
* 展示 main path
* 展示 async path
* 展示重要 recovery path

不要为了简单而删除关键组件。

如果不需要：

`"visual": ""`

---

# 12. Difficult Tasks

复杂题不要增加 slides。

应该增加：

* Core Solution 的技术深度
* Speaking Notes 的中文解释
* failure reasoning
* trade-offs
* Mermaid 完整度

原则：

**Complex engineering, simple English, clear Chinese explanation.**

---

# 13. Output

严格生成：

```json
{
  "title": "...",
  "taskType": "...",
  "summary": [
    "EN: ... | 中文: ...",
    "EN: ... | 中文: ...",
    "EN: ... | 中文: ..."
  ],
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

不要添加其他字段。

---

# 14. Final Check

生成前确认：

* 5 个 slide 完全固定
* `points` 全部是英文
* `summary` 是中英对照
* 每条 speakingNotes 都同时有中文解释和 SAY
* 中文解释足够让我重新理解技术点
* SAY 足够简单，可以直接说
* 没有难懂的高级英文句子
* 技术方案仍然达到 production-minded level
* Mermaid 不过度简化
* 没有明显重复

最后直接完整覆盖：

`data/result.json`

不要修改任何其他文件。

不要输出解释。

完成后结束。
