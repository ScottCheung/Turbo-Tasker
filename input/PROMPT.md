读取：

`input/TASK.md`

然后从零生成：

`data/result.json`

如果 `data/result.json` 已存在，直接完整覆盖。

不要读取、修改或参考：

`data/assessment.json`

不要修改任何其他文件。

---

# 目标

把技术 assessment 转换成一套适合约 15 分钟讲解的 5-slide presentation。

最重要的原则：

**技术方案要专业，但内容必须让我马上看懂。**

候选人英语水平有限。

所以：

* Main Slide：中文为主，保留重要 English technical terms
* Speaking Notes：先用中文告诉我意思，再给一句非常简单、可以直接读出的英文
* Diagram：使用英文技术名称

不要使用复杂英语来显得专业。

---

# 1. 判断题型

`taskType` 只能是：

* Coding
* Debugging
* System Design
* Backend Design
* Database
* Technical Analysis

---

# 2. 固定 5 个 Slides

必须严格使用以下 ID、顺序和标题。

禁止修改标题。

1. `understanding` — `Understanding`
2. `approach` — `Approach`
3. `core-solution` — `Core Solution`
4. `verification` — `Verification`
5. `wrap-up` — `Wrap-up`

不要增加或删除 slide。

---

# 3. 每页职责

## Understanding

告诉我：

* 题目要解决什么
* 最重要 requirements
* constraints / assumptions

3–4 个 points。

---

## Approach

告诉我：

* 总体解决思路
* 为什么这样设计
* 最关键的技术方向

3–4 个 points。

---

## Core Solution

这是最重要的一页。

根据题型展示真正的核心方案。

Backend / System Design：

* architecture
* data flow
* database
* queue / Kafka
* workers
* idempotency
* consistency
* important recovery path

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
* query
* indexes
* transactions

通常 4–5 个 points。

如果图有帮助，在这一页生成 Mermaid。

---

## Verification

告诉我真实环境中可能出什么问题。

根据题目选择重要内容：

* failure
* retries
* duplicate handling
* concurrency
* scalability
* consistency
* edge cases
* testing
* trade-offs

3–5 个 points。

不要机械把所有内容都写出来。

---

## Wrap-up

帮助我结束回答：

* 推荐方案
* 为什么适合
* 最大限制或 trade-off

2–3 个 points。

---

# 4. Main Slide 语言

`points` 必须让我一眼就能理解。

使用：

**中文解释 + English technical terms**

例如：

好：

`用 transactional outbox 保证 order 和 event 一起写入`

`Kafka 按 traderId partition，保证同一个 trader 的事件顺序`

`Broker timeout 后先查 execution status，再决定是否 retry`

不好：

`Use a fencing epoch to guarantee exclusive ownership during regional failover.`

如果必须使用困难技术词，要直接解释它的作用。

不要假设我认识高级英文术语。

---

# 5. Speaking Notes

Speaking Notes 是给我直接看的提词器。

每条必须使用这个格式：

`中文：<告诉我这句话是什么意思> SAY: <非常简单的英文>`

例如：

`中文：API 先保存订单，再返回成功。 SAY: I save the order before I return success.`

`中文：Kafka 可能重复发送消息，所以 worker 要防止重复执行。 SAY: Kafka may send the same message twice, so I check duplicates.`

要求：

* 英文必须简单
* 每句英文尽量 6–12 个单词
* 一句话只讲一个意思
* 使用自然口语
* 我应该可以直接读出来
* 不要使用复杂从句
* 不要使用正式书面英语

每页大约：

* Understanding：3–4 条
* Approach：3–4 条
* Core Solution：5–6 条
* Verification：4–5 条
* Wrap-up：2–3 条

如果一句英文我可能需要先翻译才能理解，就继续简化。

---

# 6. Production-grade Backend / System Design

如果是 Backend Design 或 System Design：

不要只生成：

`Client → API → DB → Worker`

根据题目选择真正需要的 production concerns，例如：

* API Gateway / Load Balancer
* stateless API
* PostgreSQL
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

不要全部加入。

只选择与题目最重要的内容。

核心要求：

**架构要解释关键 data flow、failure path 和 recovery path。**

---

# 7. Mermaid

只有真的有帮助时才生成 `visual`。

Backend / System Design 的 Core Solution 通常应该有 architecture diagram。

可以使用：

* `flowchart`
* `subgraph`
* 8–15 个关键节点

图要体现：

* main request path
* async path
* important storage
* external dependency
* important recovery path

保持标签简单。

如果不需要：

`"visual": ""`

---

# 8. 难题

题目很难时：

不要增加 slides。

不要生成十几条 bullet。

应该：

* 提高 Core Solution 的技术深度
* 增加关键 reasoning
* 生成更完整的 architecture diagram
* 在 Verification 解释关键 failure 和 trade-off
* 在 Speaking Notes 用简单语言把复杂概念解释清楚

原则：

**复杂技术，简单表达。**

---

# 9. 输出结构

严格生成：

```json
{
  "title": "...",
  "taskType": "...",
  "summary": ["...", "...", "..."],
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

不要添加未知字段。

`summary` 使用中文为主，可保留必要 English technical terms。

---

# 10. 最终检查

生成前确认：

* 只有 5 个固定 slide
* title 完全固定
* Main Slide 我可以快速看懂
* Speaking Notes 我可以直接读
* 没有高级、难懂的英文句子
* 技术方案仍然足够专业
* Backend/System Design 架构不是过度简化
* 没有明显重复

最后直接创建或完整覆盖：

`data/result.json`

不要修改其他文件。

不要解释。

完成后结束。
