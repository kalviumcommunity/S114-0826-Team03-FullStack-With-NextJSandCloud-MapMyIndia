# Lane 1: Infinite Vehicle Roster System — Day 1 Architecture & Notes

## 1. Feature Overview
Lane 1 is responsible for the persistent left sidebar on the Fleet Management Dashboard. It provides a real-time, searchable, filterable, and sortable roster of up to 10,000 fleet vehicles.

---

## 2. The User Journey
1. **Initial Load:** 
   - User opens the dashboard.
   - The sidebar displays an initial batch of 20 vehicles with skeleton loading states.
2. **User Interaction (Scroll):**
   - User scrolls down the vehicle roster.
   - When the user reaches the 18th–20th item, an `IntersectionObserver` silently triggers a background fetch for the next 20 vehicles using the `nextCursor`.
3. **Continuous Experience:**
   - The new batch appends seamlessly without full-page reloads or layout jumps.
4. **Lane Hand-off (Cross-lane integration):**
   - Clicking any vehicle card selects the active vehicle, signaling Lane 2 (slide-out trip history) and Lane 3 (focus vehicle on MapmyIndia map).

---

## 3. Core Technical Concepts (Viva & Assessment Prep)

### A. What is Infinite Scroll?
Infinite scroll is a design pattern where content continuously loads as the user scrolls down the page, eliminating the need for traditional pagination buttons ("Next / Previous / Page numbers"). 

### B. Why NOT load all 10,000 vehicles at once?
1. **Network Payload Size:** 10,000 JSON vehicle records = ~5MB–10MB payload over the network. On mobile networks or slow connections, this creates multi-second delays (High Time-to-First-Byte / TTFB).
2. **DOM Explosion & Memory Crashes:** 10,000 cards = 150,000+ HTML DOM elements. This consumes excessive browser memory (>600MB RAM) and causes the browser frame rate to drop below 60fps, freezing the UI.
3. **Database Overhead:** Querying 10,000 documents at once strains database RAM and blocks I/O operations for other team members' requests.

### C. What is SSG (Static Site Generation) and how does it relate?
SSG pre-renders HTML at build time. For dynamic, real-time vehicle fleets where speeds, locations, and statuses change every second, **pure SSG is not suitable for live tracking**. However, SSG/ISR can be used for the initial shell or layout, while client-side fetching with SWR/TanStack Query handles the real-time vehicle stream.

---

## 4. End-to-End Data Flow Diagram

```text
[ User Scrolls Down Sidebar ]
              │
              ▼
[ Intersection Observer triggers on sentinel element ]
              │
              ▼
[ useInfiniteQuery fetches GET /api/vehicles?cursor=XYZ&limit=20 ]
              │
              ▼
[ Next.js API Route / Backend Controller ]
              │
              ▼
[ MongoDB query: Vehicle.find({ _id: { $gt: cursor } }).limit(20) ]
              │
              ▼
[ Backend returns: { vehicles: [...], nextCursor: "ABC" } ]
              │
              ▼
[ State appends new 20 vehicles to virtualized list ]
              │
              ▼
[ DOM recycled via Virtualization — Smooth 60 FPS Render ]