Design a backend service for processing trade orders.

Users can submit buy or sell orders through an API.

Requirements:

- The API should accept an order and return quickly.
- Orders must not be lost, even if a service crashes.
- The same order must never be executed twice.
- Order processing can happen asynchronously.
- The system should support up to 5,000 order requests per second.
- Users should be able to check the current status of an order.
- External execution providers may occasionally fail or time out.
- The system should recover safely from retries and partial failures.

Explain:

1. Your high-level approach.
2. The main components and data flow.
3. How you would store and update order state.
4. How you would handle duplicate requests and retries.
5. Important failure scenarios and trade-offs.

You have approximately 15 minutes to explain your solution.