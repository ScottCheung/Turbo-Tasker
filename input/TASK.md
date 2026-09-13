Design a production-grade backend system for a multi-region copy trading platform.

Users can follow one or more lead traders.

When a lead trader places, modifies, or cancels an order, the platform should copy that action to thousands of follower accounts.

Requirements:

- A lead trader may have up to 100,000 followers.
- The platform should support 10,000 lead-trader events per second globally.
- Followers may use different external brokers.
- Broker APIs can be slow, rate-limited, unavailable, or return ambiguous timeouts.
- The same trade must never be executed twice for the same follower.
- Events for the same lead trader must be processed in the correct order.
- Events for different lead traders may be processed in parallel.
- A follower may stop copying a trader while some events are still being processed.
- Users must be able to see the current copy status for each trade.
- The system must survive worker crashes, broker outages, message redelivery, and temporary database failures.
- The service is deployed in multiple regions.
- A regional outage should not cause accepted trading events to be lost.
- During failover, the system must avoid two regions executing the same follower trade.
- The design should support replay and reconciliation if internal state differs from the broker.
- Audit history must be retained for compliance.
- The system should provide useful operational metrics and alerts.

Explain:

1. Your assumptions and the guarantees you would provide.
2. Your high-level architecture.
3. How you would partition and order events.
4. How you would fan out one lead-trader event to many followers.
5. How you would prevent duplicate follower executions.
6. How you would handle broker timeouts and unknown execution results.
7. How you would handle a follower unsubscribing during processing.
8. How multi-region failover would work safely.
9. How you would replay or reconcile inconsistent state.
10. Your main scalability, reliability, and consistency trade-offs.

You have approximately 15 minutes to explain your solution.

Do not assume true distributed exactly-once execution is available.