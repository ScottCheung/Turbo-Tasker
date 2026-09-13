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

把技术 assessment 转换成一套适合约 15 分钟现场讲解的 **5-slide presentation**。

这不是“已经想完以后做汇报”。

整个回答应该模拟真实 technical assessment 中的：

**Think Out Loud**

候选人应该可以按照以下过程一步一步讲：

**理解题目 → 拆 requirements → 找难点 → 做假设 → 推导方案 → 展开核心设计 → 检查失败场景 → 总结**

最重要原则：

**技术方案要专业，但内容必须让我马上看懂。**

候选人的主要阅读语言是中文。

所以：

* Main Slide：中文为主，保留必要 English technical terms
* Speaking Notes：全部使用简短中文
* Technical terms：保留英文
* Diagram：使用英文技术名称

不要使用复杂英文来显得专业。

不要默认候选人已经完全理解题目。

不要一开始就直接给最终 architecture。

---

# 1. 判断题型

`taskType` 只能是：

* Coding
* Debugging
* System Design
* Backend Design
* Database
* Technical Analysis

选择最接近的一种。

不要创建新的类型。

---

# 2. 固定 5 个 Slides

必须严格使用以下 ID、顺序和标题。

禁止修改标题。

1. `understanding` — `Understanding`
2. `approach` — `Approach`
3. `core-solution` — `Core Solution`
4. `verification` — `Verification`
5. `wrap-up` — `Wrap-up`

不要增加 slide。

不要删除 slide。

不要自定义 title。

稳定性优先。

---

# 3. 整体 Think-Out-Loud 顺序

五页必须形成明显的推导过程。

## Slide 1 — Understanding

**我看到的题目是什么？**

完整拆题。

## Slide 2 — Approach

**基于这些 requirements，我准备怎么解决？**

开始形成方案。

## Slide 3 — Core Solution

**具体怎么实现？**

展开核心 architecture / algorithm / schema / fix。

## Slide 4 — Verification

**这个方案哪里可能出问题？**

主动检查 failure、scale、edge cases 和 trade-offs。

## Slide 5 — Wrap-up

**最后我推荐什么？**

清晰结束回答。

不要让五页看起来像五组互相独立的 bullet。

---

# 4. Understanding — 完整拆题阶段

这是非常重要的一页。

不要把 Understanding 做成 3 个摘要 bullet。

不要默认候选人已经深刻理解题目。

这一页应该帮助候选人：

**边看题目，边拆题，边 Think Out Loud。**

如果 UI 已经显示原始 `TASK.md`，这里仍然要把题目转换成结构化、容易理解的分析。

---

## Understanding 必须检查

根据题目实际内容，尽量完整覆盖：

### 背景

* 这是什么系统 / 问题
* 谁在使用
* 主要业务流程是什么

### 核心目标

* 最终要解决什么
* 什么结果才算成功

### Functional Requirements

完整提取题目明确要求的主要功能。

不要因为追求简洁而遗漏 requirement。

### Non-functional Requirements

根据题目识别：

* traffic
* scale
* latency
* durability
* availability
* consistency
* ordering
* security
* audit
* recovery

只包含题目相关的内容。

### 明确约束

例如：

* external Provider 可能 timeout
* API 有 rate limit
* stock 不能 oversell
* event 必须保持 ordering
* payment 不能重复 charge

### 关键难点

明确指出：

**这道题真正难在哪里。**

例如：

* 高并发 + 强一致库存
* external Provider timeout 的 unknown state
* ordering + parallel processing
* multi-region failover
* duplicate delivery

### Assumptions

题目没有说明，但方案必须依赖的信息，可以做合理假设。

假设必须：

* 少
* 重要
* 明确
* 能影响后续设计

不要随意制造大量假设。

### Success Criteria

最后明确：

**设计至少必须保证什么。**

---

## Understanding Points

推荐：

**6–10 个 points**

复杂题可以到 10 个。

不要为了控制数量遗漏重要 requirement。

每个 point 使用：

**短中文 + 必要 English technical terms**

例如：

* 背景：Flash Sale，短时间出现大量并发请求
* 流量：最多 100,000 concurrent users
* 核心要求：库存绝对不能 oversell
* Payment Provider 可能 slow、timeout 或 unavailable
* 同一个订单不能重复 charge
* unpaid order 10 分钟后必须释放库存
* crash 后要恢复 order / payment state
* 用户需要查询 order 和 payment status
* 最大难点：库存一致性 + payment unknown state

目标：

**看完 Understanding 后，我应该真正理解题目。**

---

# 5. Understanding Speaking Notes

这一页的 Speaking Notes 要模拟真实读题过程。

推荐：

**8–14 条**

复杂题可以更多。

按照真实 Think Out Loud 顺序：

1. 先说明自己开始拆题
2. 说明背景
3. 说明核心目标
4. 拆 Functional Requirements
5. 拆 Non-functional Requirements
6. 指出重要 constraint
7. 指出最难的问题
8. 做必要假设
9. 说明下一步准备怎么分析

例如：

* 我先拆一下题目。
* 这是一个 Flash Sale 系统。
* 最大特点是瞬时高并发。
* 最重要的要求是不能 oversell。
* 所以库存一致性很重要。
* Payment Provider 是 external dependency。
* 它可能返回 timeout。
* timeout 不代表 payment 一定失败。
* 所以会出现 unknown payment state。
* 我先假设库存数量必须强一致。
* 订单状态可以异步更新。
* 接下来我先讲整体处理思路。

这一页不要急着报：

* Kafka
* Redis
* transactional outbox

先讲：

**问题是什么。**

后面再讲：

**怎么解决。**

---

# 6. Approach — 推导总体策略

Approach 不是 architecture 组件列表。

它要回答：

**基于前面的 requirements，我为什么选择这个方向？**

应该说明：

* 总体解决思路
* 核心 system boundary
* sync / async 怎么划分
* source of truth 放哪里
* 最关键的技术原则
* 为什么这样设计

推荐：

**4–6 个 points**

例如：

* 先保证请求被可靠接受，再异步处理慢任务
* PostgreSQL 保存核心业务状态，作为 source of truth
* external Provider 放到 async worker 后处理
* 所有 retry 都必须支持 idempotency
* failure recovery 依赖 durable state，而不是内存状态

不要只是：

* PostgreSQL
* Kafka
* Worker
* Redis

必须体现：

**为什么。**

---

# 7. Approach Speaking Notes

推荐：

**5–8 条**

Speaking Notes 应该帮助候选人从“问题”过渡到“方案”。

例如：

* 现在开始考虑整体方案。
* 我先区分同步和异步流程。
* API path 要尽可能短。
* 核心状态必须先保存。
* 然后再处理慢任务。
* external Provider 不应该阻塞 API。
* retry 必须保证不会重复执行。
* 接下来我展开完整 architecture。

---

# 8. Core Solution

这是技术内容最重要的一页。

必须展示真正解决题目的核心方案。

不要过度压缩。

推荐：

**5–7 个 points**

复杂题可以更多，但不要堆十几条 bullet。

---

## Backend / System Design

根据题目选择真正重要的内容：

* API Gateway / Load Balancer
* stateless API
* data flow
* PostgreSQL / database
* transaction boundary
* Redis
* Kafka / queue
* producer
* consumer / worker
* idempotency
* ordering
* consistency
* external Provider
* retry
* recovery
* reconciliation
* status query

不要全部加入。

只加入真正需要的内容。

但是 production-grade 题不能简化成：

`Client → API → DB → Worker`

---

## Coding

重点展示：

* algorithm
* data structure
* implementation flow
* important variables
* state changes
* key conditions

---

## Debugging

重点展示：

* evidence
* root cause
* fix
* why the fix works

---

## Database

重点展示：

* schema
* important fields
* relationships
* query
* indexes
* transactions
* locking / consistency

---

# 9. Core Solution Speaking Notes

这是最详细的 Speaking Notes。

推荐：

**8–14 条**

必须按照实际 data flow / execution flow 排列。

例如：

1. 先讲整体流程。
2. 请求先进入 API Gateway。
3. API 做 validation。
4. 然后写 PostgreSQL。
5. PostgreSQL 是 source of truth。
6. 同时写 transactional outbox。
7. 后台 publisher 把 event 发到 Kafka。
8. Worker 从 Kafka 取任务。
9. Worker 调用 external Provider。
10. Kafka 可能重复 delivery。
11. 所以 worker 要做 idempotency check。
12. Provider timeout 后不能直接 retry。
13. 先做 reconciliation。
14. 然后再决定下一步。

目标：

**即使候选人脑子突然空白，也知道下一句应该讲什么。**

---

# 10. Verification — 主动攻击自己的方案

Verification 不只是“测试”。

它应该展示：

**我知道这个方案在真实 production 中会怎么坏。**

根据题目选择真正重要的问题：

* service crash
* retry
* duplicate delivery
* concurrency
* race condition
* ordering
* database failure
* external Provider failure
* timeout
* unknown state
* backpressure
* scalability
* consistency
* security
* observability
* recovery
* edge cases
* trade-offs

不要机械全部覆盖。

推荐：

**5–8 个 points**

这一页应该尽量使用：

**问题 → 应对方式**

例如：

* Worker crash：Kafka redelivery，靠 idempotency 防止重复执行
* Provider timeout：先 reconciliation，再决定 retry
* DB overload：限制并发，并监控 connection / query latency
* Duplicate request：用 idempotency key 返回已有结果
* Queue backlog：通过 autoscaling + backpressure 控制积压

---

# 11. Verification Speaking Notes

推荐：

**7–12 条**

按 failure scenario 一个一个讲。

例如：

* 现在我检查 failure cases。
* 先看 worker crash。
* Kafka 会重新发送消息。
* 所以 worker 必须支持 idempotency。
* 再看 Provider timeout。
* timeout 可能是 unknown state。
* 这时不能直接 retry。
* 先查询 Provider 状态。
* 再看高流量情况。
* Queue 可以吸收短时间 traffic spike。
* 如果 backlog 太高，就触发 backpressure。
* 最后看主要 trade-off。

---

# 12. Wrap-up

最后一页用于明确结束回答。

推荐：

**3–4 个 points**

包含：

* 推荐方案
* 为什么它满足核心 requirements
* 最大 trade-off
* 如果规模继续增长，下一步怎么扩展

不要引入全新的大型设计。

---

# 13. Wrap-up Speaking Notes

推荐：

**4–6 条**

例如：

* 最后我总结一下。
* 这个方案先保证数据可靠。
* 慢任务通过 async processing 解耦。
* idempotency 保证 retry 安全。
* 主要 trade-off 是系统复杂度更高。
* 如果规模继续增长，再增加水平扩展。

---

# 14. Main Slide 语言

所有 `points`：

**中文为主 + English technical terms**

候选人必须可以快速理解。

不要生成整句复杂英文。

不要假设候选人认识高级英文表达。

技术词第一次出现时，最好顺便说明作用。

例如：

好：

`用 transactional outbox，让 order 和 event 在同一个 transaction 中保存`

好：

`Kafka 按 traderId partition，保证同一个 trader 的 event ordering`

好：

`Provider timeout 后先做 reconciliation，再决定是否 retry`

不好：

`Use a fencing epoch to guarantee exclusive ownership during regional failover.`

Main Slide 的目标：

**告诉我现在应该讲什么。**

---

# 15. Speaking Notes 语言

Speaking Notes 全部使用中文。

不要生成：

* 英文翻译
* `SAY:`
* 完整英文句子

只保留必要 English technical terms。

目标：

**看到中文后，可以马上自己翻成简单英文。**

---

## Speaking Notes 必须非常短

一句只表达一个意思。

优先使用：

**8–20 个中文字**

必要时可以稍长。

如果一句话需要停下来理解：

**继续拆短。**

---

## 不允许复杂中文句式

不要写：

“由于外部 Provider 可能在已经完成执行的情况下返回 timeout，因此系统需要先通过 reconciliation 判断最终状态，再决定是否 retry。”

拆成：

* Provider 可能已经成功。
* 但它可能返回 timeout。
* 这时不能直接 retry。
* 先做 reconciliation。
* 先确认最终状态。
* 再决定是否 retry。

---

## Technical Terms 保留英文

例如：

* PostgreSQL
* Kafka
* Redis
* API Gateway
* idempotency key
* transactional outbox
* retry
* DLQ
* reconciliation
* partition
* backpressure
* optimistic locking
* eventual consistency
* rate limit

不要强行翻译。

中文负责解释逻辑。

English technical terms 负责保持技术准确性。

---

# 16. Speaking Flow

Speaking Notes 不是知识点列表。

它是一条：

**讲解路线。**

每一页都要让我知道：

**下一句说什么。**

常用中文路线：

* 先讲……
* 然后……
* 接下来……
* 这里有一个问题……
* 如果失败……
* 所以需要……
* 再看另一个情况……
* 最后……
* 接下来讲下一部分……

不要追求文采。

不要使用书面语言。

---

# 17. Production-grade Backend / System Design

如果题型是：

* Backend Design
* System Design

必须有 production thinking。

根据题目选择真正需要的内容：

* API Gateway / Load Balancer
* stateless API
* PostgreSQL
* transaction
* Redis
* Kafka / queue
* worker
* idempotency
* retry
* DLQ
* ordering
* concurrency
* external service
* reconciliation
* backpressure
* scaling
* high availability
* observability
* authentication / authorization

不要全部机械加入。

Production-grade 的判断标准不是：

**组件很多。**

判断标准是：

* main data flow 清楚
* failure boundary 清楚
* recovery path 清楚
* consistency strategy 清楚
* scaling strategy 清楚
* important trade-off 清楚

---

# 18. Mermaid

只有图真的有帮助时才生成 `visual`。

Backend / System Design 的 Core Solution 通常应该有 architecture diagram。

可以使用：

* `flowchart`
* `subgraph`
* 8–15 个关键节点

复杂题可以适当增加。

图应该根据题目体现：

* request path
* async path
* important storage
* external dependency
* status/read path
* failure path
* recovery path

不要为了减少节点而删除最关键的 reliability 组件。

保持 label 简短。

Diagram 使用英文技术名称。

如果不需要：

`"visual": ""`

---

# 19. Trade-offs

如果存在真正的技术选择，要明确解释 trade-off。

不要只写：

`Use Kafka`

应该告诉我：

* 为什么用 Kafka
* 它解决什么问题
* 它带来什么成本

Main Slide 可以写：

`Kafka 支持高吞吐和 ordering，但增加 operational complexity`

Speaking Notes 可以拆成：

* Kafka 适合高吞吐。
* 也支持 partition ordering。
* 但系统会更复杂。
* 这是主要 trade-off。

不要强行制造无关 trade-off。

---

# 20. 难题处理

题目很难时：

不要增加 slide。

不要把所有内容压成几个极短 bullet。

应该：

* Understanding 更完整
* Core Solution 更深入
* Speaking Notes 更丰富
* Mermaid 更完整
* Verification 更深入
* 解释关键 reasoning
* 解释 failure
* 解释 consistency
* 解释 concurrency
* 解释 trade-off

原则：

**复杂技术，简单表达。**

不要把：

**简单表达**

误解成：

**信息很少。**

---

# 21. 输出结构

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

`summary` 使用中文为主。

保留必要 English technical terms。

---

# 22. 最终检查

生成前确认：

## Structure

* 只有 5 个固定 slide
* ID 完全固定
* title 完全固定
* 没有额外字段

## Understanding

* 没有默认候选人已经理解题目
* requirements 提取足够完整
* constraints 没有明显遗漏
* assumptions 清晰
* 难点被明确指出

## Think Out Loud

整个回答能够体现：

**理解 → 推导 → 设计 → 验证 → 总结**

而不是：

**直接展示最终答案。**

## Main Slide

* 中文为主
* 信息足够
* 可以快速扫读
* 没有为了“简洁”删掉重要 reasoning

## Speaking Notes

* 全部中文
* 每句很短
* 一句只讲一个意思
* 顺序自然
* 可以快速翻成英文
* 能告诉我下一句说什么

## Technical Depth

* 方案足够专业
* 难题没有被过度简化
* Backend/System Design 有 production thinking

## Visual

* 图帮助解释 architecture
* 图包含重要 data flow
* 必要时包含 failure / recovery path

---

最后直接创建或完整覆盖：

`data/result.json`

不要修改其他文件。

不要解释。

完成后结束。
