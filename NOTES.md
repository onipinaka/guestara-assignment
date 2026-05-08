# Notes

## Open-scope choices and rationale
+- Filtering (status, room type, source): makes the heatmap and detail panel actionable for staff that need a quick operational slice.
+- Stats strip (month metrics): gives immediate context without opening the detail list.
+- Search by guest name: helps front desk staff locate bookings quickly; the right panel switches to search results.
+- Room search: narrows both the calendar and details to a specific room.
+- CSV export: enables quick handoff for reporting or audits.
+- Keyboard navigation: supports fast navigation and range selection without the mouse.
+
+## Justifications
+- Week starts on Monday: hotels and front desk teams often think in Monday-first business weeks; this reduces context switching.
+- Inclusive-exclusive nights: a booking occupies nights from check-in through the night before check-out (check-out day is free). This is used consistently in the occupancy logic and overlap checks.
+- Cancelled bookings excluded: occupancy represents actual rooms in use, not cancelled inventory.
+
+## Trade-offs and time choices
+- Used native Date utilities instead of a date library to keep dependencies minimal and to show manual date logic.
+- Room count is derived from the dataset, with a fallback to 10 if data is incomplete.
+- Search results are shown in the right panel rather than a modal to keep the workflow in one place.
+
+## What I would improve with more time
+- Add an occupancy tooltip per day with a breakdown by room type.
+- Add a small legend for search highlighting and selection states.
+- Add empty-state guidance for filters that yield no results.
+
+## How to run
+See README.md for install and dev server commands.
