# Guestara Booking Calendar Heatmap

A single-page React app that visualizes hotel occupancy as a month heatmap calendar. Built for the Guestara frontend assignment.

## Features
- Month view calendar with Monday start and a fixed 7x6 grid.
- Occupancy heatmap per day (cancelled bookings excluded).
- Drag-to-select date range (forward or backward, across month boundaries).
- Detail panel listing bookings overlapping the selected range.
- Filters by status, room type, and source.
- Search by guest name and room number.
- Stats strip for the current month (total bookings, average occupancy, longest stay, top room type).
- CSV export of the current panel results.
- Keyboard navigation (arrow keys move focus, Shift extends range, Enter selects).

## Local Setup
1. Install dependencies
	- `npm install`
2. Start dev server
	- `npm run dev`

## Data File
Place the dataset at `public/bookings.json`. The app loads it with `fetch` (async, with loading and error states).

Expected fields per booking:
- `id`
- `guestName`
- `roomNumber`
- `roomType`
- `checkIn` (YYYY-MM-DD)
- `checkOut` (YYYY-MM-DD)
- `status` (cancelled bookings are excluded from occupancy)
- `source`

Additional fields are allowed and ignored unless used in the UI.

## Notes
See NOTES.md for design decisions, trade-offs, and assignment justifications.
