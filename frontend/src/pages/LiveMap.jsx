import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const DEFAULT_CENTER = [13.0827, 80.2707];

const severityColor = { Low: "#3b82f6", Medium: "#f59e0b", High: "#f97316", Critical: "#dc2626" };

const makeIcon = (color) =>
  L.divIcon({
    html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 0 3px rgba(0,0,0,0.4)"></div>`,
    className: "",
    iconSize: [16, 16],
  });

export default function LiveMap() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/complaints").then((res) => setComplaints(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Live Map</h1>
        <p className="text-gray-500 text-sm mb-4">All reported issues, color-coded by severity.</p>

        <div className="flex gap-4 text-xs mb-3 bg-white rounded-lg px-4 py-2.5 border border-gray-100 w-fit">
          {Object.entries(severityColor).map(([label, color]) => (
            <span key={label} className="flex items-center gap-1.5 text-gray-600">
              <span style={{ background: color }} className="w-2.5 h-2.5 rounded-full inline-block" />
              {label}
            </span>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-400">Loading complaints...</p>
        ) : (
          <MapContainer center={DEFAULT_CENTER} zoom={12} style={{ height: "500px", width: "100%" }} className="rounded-xl overflow-hidden border border-gray-200 shadow-card">
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {complaints.map((c) => (
              <Marker key={c._id} position={[c.location.lat, c.location.lng]} icon={makeIcon(severityColor[c.aiSeverity] || "#6b7280")}>
                <Popup>
                  <strong>{c.aiCategory}</strong> — {c.aiSeverity}
                  <br />
                  {c.aiDescription}
                  <br />
                  <img src={c.imageUrl} alt={c.aiCategory} style={{ width: "150px", marginTop: "6px", borderRadius: "4px" }} />
                  <br />
                  Status: {c.status}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
