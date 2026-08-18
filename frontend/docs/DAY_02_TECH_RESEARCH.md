# Lane 1: Infinite Vehicle Roster System — Day 2 Technical Research

## 1. Infinite Scroll Mechanics
- We use the **Intersection Observer API** instead of `window.onscroll`.
- `IntersectionObserver` runs asynchronously off the main browser thread, triggering only when a sentinel element enters view, preventing UI lag.

---

## 2. Cursor vs. Offset Pagination

| Metric | Offset Pagination (`skip / limit`) | Cursor Pagination (`cursor / limit`) |
| :--- | :--- | :--- |
| **Query** | `db.vehicles.find().skip(5000).limit(20)` | `db.vehicles.find({ _id: { $gt: cursor } }).limit(20)` |
| **MongoDB Complexity** | **$O(N)$** (Scans & discards 5000 docs) | **$O(1)$** (Direct B-Tree index jump) |
| **Speed at 10,000 docs** | Slow (>200ms) | Instant (<5ms) |
| **Data Drift on new inserts** | Duplicates appear on screen | 100% stable & consistent |

---

## 3. List Virtualization (Windowing)
- **Problem:** Rendering 10,000 DOM nodes eats >500MB of RAM and causes severe frame drops.
- **Solution:** Virtualization (e.g. `@tanstack/react-virtual` or `react-window`) only renders the **10–15 cards visible on screen** plus a 3-card buffer, recycling DOM nodes dynamically as the user scrolls.

---

## 4. End-to-End Flow
```text
Frontend (Initial 20) ──> User Scrolls ──> Intersection Observer fires
                                                    │
                                                    ▼
Next.js API (/api/vehicles?cursor=XYZ) ◄────────────┘
        │
        ▼
MongoDB Index Seek ({ _id: { $gt: cursor } })
        │
        ▼
Returns next 20 vehicles + nextCursor ──> Appended to Virtualized List