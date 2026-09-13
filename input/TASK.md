Design a production-grade backend system for a flash-sale e-commerce platform.

Users can browse products, add items to their cart, and place orders during a flash sale.

Requirements:

- A flash sale may attract up to 100,000 users at the same time.
- Product stock is limited and must never be oversold.
- Users should receive an order response quickly.
- Payment is handled by an external payment provider.
- The payment provider may be slow, unavailable, or return a timeout.
- The same order must not be charged twice.
- An order should expire if payment is not completed within 10 minutes.
- If payment succeeds but the order service crashes, the system must recover safely.
- If payment fails or expires, reserved stock should be released.
- Users should be able to check order and payment status.
- The system should support retries without creating duplicate orders or duplicate payments.
- The service should handle sudden traffic spikes during the flash sale.
- Order history must remain auditable.

Explain:

1. Your assumptions and main guarantees.
2. Your high-level architecture.
3. How you prevent overselling.
4. How you reserve and release stock.
5. How order creation and payment should work.
6. How you prevent duplicate orders and duplicate charges.
7. How you handle payment timeouts or unknown payment results.
8. How expired unpaid orders release inventory.
9. How the system handles traffic spikes and failures.
10. Your main scalability and consistency trade-offs.

You have approximately 15 minutes to explain your solution.