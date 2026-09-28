// Free geocoding via OpenStreetMap's Nominatim service - no API key needed.
// Usage note: Nominatim asks that you don't hammer it with rapid requests
// (max ~1/sec), which is fine here since we only call it when the user
// clicks "Find on map", not on every keystroke.
export async function geocodeAddress(address, district) {
  const query = [address, district, "Tamil Nadu", "India"]
    .filter(Boolean)
    .join(", ");

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
    query
  )}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.length) {
    throw new Error("Couldn't find that location. Try adding more detail, or pin it manually.");
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}
