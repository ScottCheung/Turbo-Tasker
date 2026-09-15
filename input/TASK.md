Task - OPEN UP VS CODE/CURSOR/CLUADE IDE while you run this test. Constnatly TALK While you work throughout this assessment
You are building part of the backend for a social trading platform.

When a trader opens a trade, the platform attempts to create a corresponding trade for each eligible follower.

Build a runnable implementation of:

async function processCopyTrade(
  trade: Trade,
  follower: Follower
): Promise<Result>

A trade contains:

type Trade = {
  id: string;
  traderId: string;
  amount: number;
};

A follower contains:

type Follower = {
  id: string;
  balance: number;
  remainingAllocation: number;
  copyingEnabled: boolean;
};

A successful copy trade should:

only occur when the follower is eligible;
deduct the amount from their balance;
deduct the amount from their remaining allocation;
record that the follower trade occurred.
The production system may call your function more than once for the same trade and may call it concurrently.

Your implementation should produce a safe and consistent result.

You may create any additional types, functions, or in-memory storage you need.

Demonstrate
Before the 15 minutes finishes, run your implementation and show what happens in these three cases.

1. Normal
Balance:              10,000
Remaining allocation: 2,000
Trade amount:            700

2. Same trade twice
The same trade is sent to the same follower twice.

Show the final balance, allocation, and recorded trades.

3. Concurrent trades
The follower has:

Balance:              1,000
Remaining allocation: 1,000

Two different trades for 700 each are processed at approximately the same time.

Show the final state.

Finish
In the final couple of minutes, walk us through:

what you built;
why you believe it behaves correctly;
what your demonstration proves;
and what you would change if this were backed by PostgreSQL and multiple production workers.
You do not need production-ready code.

AI can write some or all of your solution. We are assessing what you are able to build, verify, understand and explain within the 15 minutes.

