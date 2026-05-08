# Notes

## Purpose
This document captures the open-scope features chosen, the key decisions made, and the trade-offs for the Guestara booking heatmap assignment.

## Open-scope choices and rationale
- Filtering (status, room type, source): makes the heatmap and detail panel useful for daily ops without extra clicks.
- Stats strip (month metrics): gives a quick pulse on the month without opening the detail list.
- Search by guest name: supports front desk lookups; the right panel switches to results.
- Room search: narrows the calendar and details to a specific room.
- CSV export: supports quick reporting or handoff.
- Keyboard navigation: faster range selection for power users.

## Key decisions and justifications
- Week starts on Monday to match typical business-week workflows in hospitality.
- Inclusive-exclusive nights: occupied nights are check-in through the night before check-out. Check-out day is free.
- Cancelled bookings are excluded from occupancy to reflect real room usage.
- Async data loading via fetch with loading and error states as required by the brief.

## Trade-offs and time choices
- Used native Date utilities instead of a date library to keep dependencies minimal.
- Room count is derived from the dataset, with a fallback to 10 if data is incomplete.
- Search results are shown in the right panel (not a modal) to keep context visible.

## What I would improve with more time
- Add a per-day tooltip that breaks occupancy down by room type.
- Add a small legend for search highlighting and selection states.
- Add more empty-state guidance for filters and searches with no matches.

## How to run
See README.md for install and dev server commands.
