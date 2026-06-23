# Stage 1

## Notification System Design - Priority Inbox

### Objective
The product manager requested a Priority Inbox that displays the top 'n' most important unread notifications based on a combination of weight and recency. This document outlines the logic and approach used to calculate and maintain the priority of these notifications efficiently without relying on a backend DB query.

### Priority Calculation Logic

The priority of a notification is determined by two factors:
1. **Weight (Type):** `Placement > Result > Event`
2. **Recency (Timestamp):** Newer notifications should rank higher within the same weight class.

**Weights Assigned:**
- `Placement` = 3
- `Result` = 2
- `Event` = 1

**Sorting Algorithm:**
When comparing two notifications `A` and `B`:
1. First, compare their assigned weight. If `Weight(A) > Weight(B)`, `A` is higher priority.
2. If their weights are equal (`Weight(A) === Weight(B)`), compare their timestamps. The notification with the more recent (larger) timestamp is higher priority.

### Maintaining Top 10 Efficiently
Because new notifications can keep coming in (e.g., via websockets or polling), recalculating the entire list every time is inefficient. 

To maintain the Top 10 efficiently on the frontend:
- **Min-Heap (Priority Queue):** We can maintain a Min-Heap of size `k` (where `k = 10`). As a new notification arrives, we compare it against the root of the Min-Heap (which represents the lowest priority notification currently in the Top 10). If the new notification has a higher priority than the root, we extract the root and insert the new notification. This takes `O(log k)` time per new notification, making it extremely efficient even under a high volume of incoming notifications.
- **For the purposes of this React application**, given typical client-side constraints where datasets are fetched in paginated blocks, we fetch the incoming batch, merge them into a local state, and perform an `Array.prototype.sort()` sorting them by the criteria above, then simply `Array.prototype.slice(0, n)`. While sorting the full array is `O(N log N)`, it is perfectly adequate for standard frontend sizes. If notifications scale to the tens of thousands on the client side, the Min-Heap implementation described above would be strictly implemented.

### Custom Logging Middleware
All core flows, such as data fetching, error handling, and priority sorting, are wrapped in the custom `logging-middleware`. This ensures standard output formatting and satisfies the Stage 2 constraints of strictly avoiding native console logging.
