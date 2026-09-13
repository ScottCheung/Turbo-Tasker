读取 `input/TASK.md`，然后只修改：

`data/assessment.json`

禁止修改任何其他文件。

你的任务是把技术 assessment 题目转换成一套适合约 15 分钟现场讲解的 **5-slide technical presentation**。

请同时扮演：

* Senior Software Engineer
* System / Backend Design Interviewer
* Technical Presentation Editor

目标不是把题目平均拆成五组 bullet。

目标是设计一条清晰的 presentation story，让候选人可以按照页面顺序，从：

**problem → strategy → core solution → production validation → final recommendation**

自然讲完整个答案。

---

# Core Principle

**Keep the engineering senior. Keep the English simple.**

候选人英语不是母语。

技术深度必须足够，但英文表达必须简单、直接、容易理解和说出口。

技术深度应来自：

* correct technical decisions
* reasoning
* reliability
* failure handling
* consistency
* scalability
* trade-offs

不要通过复杂英文、长句或高级词汇表现专业度。

---

# 1. Classify the Task

先将题目分类为以下其中一种：

* Coding
* Debugging
* System Design
* Backend Design
* Database
* Technical Analysis

写入：

`taskType`

必须选择最接近的一种。

不要创建新的类型。

---

# 2. Plan the Presentation Before Writing JSON

在生成 JSON 前，先在内部完成以下分析：

1. What is the real problem?
2. What does the interviewer expect the candidate to demonstrate?
3. What are the 3–5 most important technical decisions?
4. Which part deserves the most presentation time?
5. Which slide should contain the visual?
6. Which details belong on the main slide?
7. Which details belong only in speakingNotes?
8. What are the most important production risks?
9. What trade-offs actually affect the design?

不要输出这段内部分析。

完成 planning 后再生成最终 JSON。

---

# 3. Fixed Slide IDs, Dynamic Titles

固定使用以下 5 个 section ID：

1. `understanding`
2. `approach`
3. `core-solution`
4. `verification`
5. `wrap-up`

禁止：

* 增加 section
* 删除 section
* 修改 ID
* 修改顺序

但是：

**每个 slide 的 `title` 必须根据具体题目动态生成。**

不要机械使用：

* Understanding
* Approach
* Core Solution
* Verification
* Wrap-up

除非确实没有更准确的标题。

例如 Backend / System Design 可以生成：

* Requirements & Constraints
* Processing Strategy
* Production Architecture
* Reliability & Trade-offs
* Recommended Design

具体题目可以进一步具体化：

* Order Guarantees
* Reliable Processing Strategy
* Trade Execution Architecture
* Failure Recovery & Scaling
* Recommended Design

Coding 可以使用：

* Problem & Constraints
* Algorithm Choice
* Implementation
* Tests & Complexity
* Final Solution

Debugging 可以使用：

* Observed Failure
* Investigation Strategy
* Root Cause & Fix
* Validation
* Prevention

Database 可以使用：

* Data Requirements
* Schema Strategy
* Schema & Queries
* Performance & Consistency
* Recommendation

Technical Analysis 可以使用：

* Question & Context
* Evaluation Framework
* Key Findings
* Evidence & Trade-offs
* Recommendation

标题应明确告诉候选人：

**这一页到底要讲什么。**

---

# 4. Slide 1 — Frame the Problem

第一张 Slide 用来建立问题。

应该帮助候选人快速说明：

* what needs to be solved
* important requirements
* constraints
* assumptions
* success conditions

不要过早进入大量实现细节。

通常：

**3–4 points**

System / Backend Design 可以包括：

* traffic
* latency
* durability
* consistency
* availability
* external dependencies

Coding 可以包括：

* input
* output
* constraints
* examples

Debugging 可以包括：

* observed behaviour
* expected behaviour
* evidence

Database 可以包括：

* entities
* access patterns
* scale
* consistency

Technical Analysis 可以包括：

* question
* evidence
* constraints
* assumptions

---

# 5. Slide 2 — Explain the Strategy

第二张 Slide 说明总体解决方向。

回答：

* What is the main strategy?
* Why is this direction appropriate?
* What should happen synchronously?
* What can happen asynchronously?
* What are the important system boundaries?
* What key technical choices guide the solution?

通常：

**3–4 points**

不要重复 Slide 1。

这一页应该帮助候选人从：

**problem**

自然过渡到：

**solution**

---

# 6. Slide 3 — Core Solution

这是整个 presentation 最重要的一页。

必须展示真正解决问题的核心技术方案。

通常：

**3–5 points**

允许拥有最高技术密度。

## System Design / Backend Design

根据题目选择重要内容：

* API boundary
* services
* request flow
* event flow
* source of truth
* storage
* transactions
* asynchronous processing
* queues / Kafka
* workers
* idempotency
* ordering
* consistency
* external dependencies
* recovery path

不要机械加入所有内容。

只加入真正影响这道题的部分。

## Coding

重点：

* algorithm
* data structure
* implementation flow
* important state
* important conditions

## Debugging

重点：

* root cause
* evidence
* fix
* why the fix works

## Database

重点：

* schema
* important fields
* relationships
* indexes
* queries
* transactions

## Technical Analysis

重点：

* findings
* evidence
* reasoning
* recommendation

---

# 7. Slide 4 — Production Reality

这一页展示真正的工程思考。

核心问题：

**What can go wrong, and why is the solution still safe?**

根据题目选择最重要的 3–5 个问题。

可能包括：

* failure scenarios
* retries
* duplicate messages
* concurrency
* consistency
* ordering
* backpressure
* database bottlenecks
* external provider failure
* partial failure
* scaling
* security
* observability
* recovery
* technical trade-offs

不要为了显得高级全部列出来。

只选真正重要的问题。

## Coding

重点：

* correctness
* edge cases
* tests
* time complexity
* space complexity

## Debugging

重点：

* confirming the fix
* regression tests
* monitoring
* prevention

## Database

重点：

* concurrency
* correctness
* query performance
* consistency
* lock contention
* failure behaviour

---

# 8. Slide 5 — Finish With a Decision

最后一页帮助候选人明确收尾。

应该包含：

* recommended solution
* why it fits the problem
* important limitation
* logical next improvement if scale increases

通常：

**2–3 points**

不要引入新的大型架构设计。

候选人应该可以在这一页自然结束回答。

---

# 9. Main Slide Content Rules

主页面的作用是：

**Tell me what I should explain.**

Main slide points 必须：

* technically accurate
* easy to scan
* easy to understand
* concrete
* concise

通常：

* Slide 1：3–4 points
* Slide 2：3–4 points
* Slide 3：3–5 points
* Slide 4：3–5 points
* Slide 5：2–3 points

每个 point 通常：

**8–16 English words**

复杂题允许稍长，但不要写长段落。

---

# 10. Simple English Rules

候选人的英语水平一般。

主屏和 speakingNotes 都必须尽量使用常见英语。

优先使用简单动词：

* save
* store
* send
* receive
* check
* retry
* fail
* process
* return
* update
* publish
* scale
* protect
* read
* write

避免：

* long academic sentences
* abstract noun chains
* unnecessary formal vocabulary
* complex grammar
* multiple ideas in one sentence

例如，不要写：

"Provide durable acceptance with asynchronous downstream execution."

写：

"Save the order before returning success, then process it asynchronously."

---

# 11. Technical Terms

必要技术术语必须保留。

例如：

* PostgreSQL
* Kafka
* Redis
* idempotency
* transactional outbox
* DLQ
* partitioning
* eventual consistency
* optimistic locking

但第一次出现较难概念时，要解释它的作用。

不要只写：

"Use a transactional outbox."

写：

"Use a transactional outbox to save the order and event together."

不要只写：

"Consumers must be idempotent."

写：

"Make consumers idempotent so duplicate messages cannot repeat the work."

技术词可以高级。

解释技术词的英语必须简单。

---

# 12. Production-grade Architecture

对于：

* System Design
* Backend Design

不得只输出概念级：

Client → API → Database → Worker

必须根据题目认真考虑 production concerns。

可能包括：

* load balancer / API gateway
* multiple stateless API instances
* durable database
* database transaction boundary
* queue / Kafka
* producers
* consumers / workers
* idempotency
* retry
* DLQ
* ordering
* concurrency
* backpressure
* external provider failure
* reconciliation
* cache
* high availability
* observability
* authentication
* authorisation

但是：

**只选择与题目真正相关的部分。**

Production-grade 不代表组件越多越好。

真正重要的是：

* failure boundaries are clear
* reliability guarantees are clear
* recovery path is clear
* scaling strategy is clear
* important trade-offs are clear

---

# 13. Visual / Mermaid

`visual` 只有在图能明显提高理解时才使用。

否则：

```json
"visual": ""
```

## System / Backend Design

复杂设计题的 Slide 3 应优先考虑 Mermaid architecture diagram。

可以使用：

* 8–15 major nodes
* `subgraph`
* sync request path
* async processing path
* read/status path
* recovery path
* important failure boundary

图必须帮助候选人讲故事。

不要只罗列组件。

例如，如果题目涉及：

* durable acceptance
* Kafka
* retries
* external provider
* reconciliation

这些重要路径应该体现在图中。

## Mermaid Rules

* use `flowchart`
* keep labels short
* keep syntax valid
* keep direction clear
* avoid unnecessary crossing lines
* one visual should explain one main story

如果图过于复杂，可以减少次要 infrastructure。

不要删除题目的关键 reliability path。

---

# 14. Trade-offs

真正存在设计选择时，应明确展示 trade-off。

例如：

* Kafka vs SQS
* SQL vs NoSQL
* synchronous vs asynchronous
* strong consistency vs availability
* simple design vs highly scalable design
* immediate execution vs durable acceptance

不要只写：

"Use Kafka."

更好的表达：

"Kafka handles high throughput well, but it adds more operational work."

只讨论影响当前方案的重要 trade-off。

不要为了显得有深度强行比较。

---

# 15. Speaking Notes = Presenter View

Speaking Notes 的作用是：

**Tell me what I can actually say.**

候选人即使紧张或短暂失去思路，也应该能只看 speakingNotes 继续讲。

Speaking Notes 必须：

* 按真实演讲顺序排列
* 覆盖这一页的主要 reasoning
* 帮助候选人开始
* 帮助候选人解释关键技术
* 帮助候选人自然过渡

数量建议：

* Slide 1：4–5
* Slide 2：4–6
* Slide 3：6–9
* Slide 4：5–7
* Slide 5：3–4

---

# 16. Speaking Notes English Level

Speaking Notes 使用：

**B1–B2 spoken English**

每句话通常：

**6–14 English words**

技术术语可以复杂。

句子结构必须简单。

优先使用：

Subject + Verb + Object

例如：

"I store the order in PostgreSQL first."

"The API then returns the order ID."

"A worker reads the event from Kafka."

"If the worker fails, Kafka can send the message again."

"The idempotency key stops the same trade running twice."

---

# 17. Speaking Flow

每页 speakingNotes 应该可以自然连续说下去。

优先使用：

* "I would start with..."
* "First, I..."
* "Then I..."
* "After that..."
* "The reason is..."
* "The main problem here is..."
* "If this fails..."
* "To handle this..."
* "The trade-off is..."
* "Finally..."
* "Next, I would..."

不要生成几个彼此独立、没有连接的提示句。

---

# 18. Explain Difficult Concepts Simply

如果概念很难，用两句简单英文解释。

例如，不要写：

"The transactional outbox guarantees atomic persistence between domain state and event publication."

写：

"I save the order and outbox event in one transaction."

"This prevents me from saving the order but losing its event."

不要写：

"At-least-once semantics require idempotent consumers."

写：

"Kafka may send the same message more than once."

"So my worker must safely ignore duplicate work."

不要写：

"Reconciliation resolves ambiguous external execution outcomes."

写：

"If the provider times out, I do not retry immediately."

"I first check whether the trade already happened."

---

# 19. Difficult Question Handling

如果题目困难：

不要增加更多 Slide。

不要生成大量 bullet。

应该增加：

* stronger technical decisions
* better reasoning
* richer speakingNotes
* more complete Mermaid
* deeper failure handling
* deeper consistency reasoning
* deeper concurrency reasoning
* meaningful trade-offs

核心原则：

**Simple slides, deep engineering.**

技术深度来自：

**decision → reason → consequence → trade-off**

---

# 20. Output JSON

严格保持以下结构：

```json
{
  "title": "...",
  "taskType": "...",
  "summary": ["...", "...", "..."],
  "sections": [
    {
      "id": "understanding",
      "title": "...",
      "points": [],
      "speakingNotes": [],
      "visual": ""
    },
    {
      "id": "approach",
      "title": "...",
      "points": [],
      "speakingNotes": [],
      "visual": ""
    },
    {
      "id": "core-solution",
      "title": "...",
      "points": [],
      "speakingNotes": [],
      "visual": ""
    },
    {
      "id": "verification",
      "title": "...",
      "points": [],
      "speakingNotes": [],
      "visual": ""
    },
    {
      "id": "wrap-up",
      "title": "...",
      "points": [],
      "speakingNotes": [],
      "visual": ""
    }
  ]
}
```

固定：

* 5 sections
* section order
* section IDs
* JSON fields

动态：

* section titles
* points
* speakingNotes
* visual
* technical depth

禁止添加未知字段。

---

# 21. Final Presentation Review

写入 JSON 前，在内部检查整个 presentation。

## Story

五张 Slide 连起来必须完整回答题目。

## Slide titles

标题必须具体，不能只是通用分类名称。

## No repetition

不要在多张 Slide 重复同一个观点。

## Main slide readability

候选人应该可以在几秒内扫完主屏。

## Technical depth

复杂题必须体现真正的 engineering judgement。

## Production thinking

Backend / System Design 不得只停留在：

API → Database → Queue → Worker

必须体现题目关键的：

* reliability
* failure handling
* recovery
* scaling
* consistency
* trade-offs

## Speaking usability

候选人应该可以直接读 speakingNotes。

不应该需要：

* mental translation
* rewriting
* simplifying the sentence before speaking

如果一句话太难说：

**simplify it before writing the JSON.**

## Visual quality

Mermaid 应该帮助解释系统流程和关键 failure path。

不能只是组件列表。

---

最后：

只修改：

`data/assessment.json`

不要修改其他文件。

不要创建额外文件。

不要输出 Markdown。

不要输出解释。

完成后结束。
