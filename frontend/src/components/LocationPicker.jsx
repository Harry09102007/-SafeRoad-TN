import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_CENTER = [13.0827, 80.2707]; // Chennai

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng);
    },
  });
  return null;
}

// Recenters the map whenever `position` changes from outside (e.g. after
// the address is geocoded), without needing the user to click anything.
function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 16, { duration: 0.8 });
    }
  }, [position, map]);
  return null;
}

export default function LocationPicker({ position, onChange }) {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      <MapContainer center={position || DEFAULT_CENTER} zoom={13} style={{ height: "280px", width: "100%" }}>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onPick={(latlng) => onChange(latlng)} />
        <Recenter position={position} />
        {position && <Marker position={position} />}
      </MapContainer>
      <p className="text-xs text-gray-400 px-2 py-1.5 bg-gray-50">
        Pin auto-fills from your address above — click anywhere on the map to fine-tune it.
      </p>
    </div>
  );
}
