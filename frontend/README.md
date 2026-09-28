# SafeRoad TN - Frontend (with auto-pin location)

## What's new in this update
- Type a district/address, click "Find on map" -> the map automatically
  pins the location (using OpenStreetMap's free Nominatim geocoding service,
  no API key needed)
- You can still click anywhere on the map to fine-tune the pin manually
- General visual polish across all pages: cards, spacing, active nav state,
  rounder corners, subtle shadows

## Setup
1. npm install
2. npm run dev
3. Make sure the backend is running on port 5000 at the same time

## If "Find on map" doesn't find your address
Try adding more detail (e.g. "T Nagar" instead of just a house number), or
just click directly on the map - it still works as a manual fallback.
