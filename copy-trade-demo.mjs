/**
 * Runnable in-memory copy-trade demo.
 * Run: node copy-trade-demo.mjs
 */

/** @typedef {{ id: string, traderId: string, amount: number }} Trade */
/** @typedef {{ id: string, balance: number, remainingAllocation: number, copyingEnabled: boolean }} Follower */
/** @typedef {{ id: string, sourceTradeId: string, traderId: string, followerId: string, amount: number }} RecordedCopyTrade */
/** @typedef {{ status: "copied" | "duplicate" | "rejected", reason?: string, follower: Follower, copyTrade?: RecordedCopyTrade }} Result */

const clone = (value) => structuredClone(value);

class CopyTradeService {
  constructor() {
    /** @type {Map<string, Follower>} */
    this.followers = new Map();
    /** @type {Map<string, RecordedCopyTrade>} */
    this.recordedTrades = new Map();
    /** @type {Map<string, Promise<void>>} */
    this.followerLocks = new Map();
  }

  /** @param {Follower} follower */
  seedFollower(follower) {
    this.followers.set(follower.id, clone(follower));
  }

  /** @param {string} followerId @param {() => Promise<Result>} work */
  async withFollowerLock(followerId, work) {
    const previous = this.followerLocks.get(followerId) ?? Promise.resolve();
    /** @type {() => void} */
    let release;
    const current = new Promise((resolve) => {
      release = resolve;
    });
    const queueEntry = previous.then(() => current);
    this.followerLocks.set(followerId, queueEntry);

    await previous;
    try {
      return await work();
    } finally {
      release();
      if (this.followerLocks.get(followerId) === queueEntry) {
        this.followerLocks.delete(followerId);
      }
    }
  }

  /** @param {Trade} trade @param {Follower} follower @returns {Promise<Result>} */
  async processCopyTrade(trade, follower) {
    if (!this.followers.has(follower.id)) this.seedFollower(follower);

    return this.withFollowerLock(follower.id, async () => {
      const idempotencyKey = `${trade.id}:${follower.id}`;
      const existing = this.recordedTrades.get(idempotencyKey);
      const currentFollower = this.followers.get(follower.id);

      if (existing) {
        return { status: "duplicate", follower: clone(currentFollower), copyTrade: clone(existing) };
      }

      const validAmount = Number.isFinite(trade.amount) && trade.amount > 0;
      const eligible =
        validAmount &&
        currentFollower.copyingEnabled &&
        currentFollower.balance >= trade.amount &&
        currentFollower.remainingAllocation >= trade.amount;

      if (!eligible) {
        return {
          status: "rejected",
          reason: validAmount ? "follower is not eligible or has insufficient funds" : "trade amount must be positive",
          follower: clone(currentFollower)
        };
      }

      currentFollower.balance -= trade.amount;
      currentFollower.remainingAllocation -= trade.amount;
      const copyTrade = {
        id: `copy:${idempotencyKey}`,
        sourceTradeId: trade.id,
        traderId: trade.traderId,
        followerId: currentFollower.id,
        amount: trade.amount
      };
      this.recordedTrades.set(idempotencyKey, copyTrade);

      return { status: "copied", follower: clone(currentFollower), copyTrade: clone(copyTrade) };
    });
  }

  /** @param {string} followerId */
  stateFor(followerId) {
    return {
      follower: clone(this.followers.get(followerId)),
      recordedTrades: [...this.recordedTrades.values()]
        .filter((trade) => trade.followerId === followerId)
        .map(clone)
    };
  }
}

const normalFollower = { id: "follower-1", balance: 10_000, remainingAllocation: 2_000, copyingEnabled: true };
const trade = { id: "trade-100", traderId: "trader-9", amount: 700 };

async function demonstrate() {
  console.log("\n1. Normal");
  const normal = new CopyTradeService();
  normal.seedFollower(normalFollower);
  console.log(await normal.processCopyTrade(trade, normalFollower));
  console.log(normal.stateFor(normalFollower.id));

  console.log("\n2. Same trade twice");
  const duplicate = new CopyTradeService();
  duplicate.seedFollower(normalFollower);
  console.log(await duplicate.processCopyTrade(trade, normalFollower));
  console.log(await duplicate.processCopyTrade(trade, normalFollower));
  console.log(duplicate.stateFor(normalFollower.id));

  console.log("\n3. Concurrent different trades");
  const concurrent = new CopyTradeService();
  const constrainedFollower = { id: "follower-2", balance: 1_000, remainingAllocation: 1_000, copyingEnabled: true };
  concurrent.seedFollower(constrainedFollower);
  const results = await Promise.all([
    concurrent.processCopyTrade({ id: "trade-201", traderId: "trader-9", amount: 700 }, constrainedFollower),
    concurrent.processCopyTrade({ id: "trade-202", traderId: "trader-9", amount: 700 }, constrainedFollower)
  ]);
  console.log(results);
  console.log(concurrent.stateFor(constrainedFollower.id));

  const finalState = concurrent.stateFor(constrainedFollower.id);
  if (finalState.follower.balance !== 300 || finalState.recordedTrades.length !== 1) {
    throw new Error("Concurrent copy-trade invariant failed");
  }
  console.log("\nAll demonstration invariants passed.");
}

const defaultService = new CopyTradeService();
export { CopyTradeService };
export const processCopyTrade = (trade, follower) => defaultService.processCopyTrade(trade, follower);

if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrate().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
