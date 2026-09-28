import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved"];

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [districtFilter, setDistrictFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");

  const fetchComplaints = async () => {
    setLoading(true);
    const params = {};
    if (districtFilter) params.district = districtFilter;
    if (severityFilter) params.severity = severityFilter;
    const res = await api.get("/complaints", { params });
    setComplaints(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtFilter, severityFilter]);

  const updateStatus = async (id, status) => {
    await api.patch(`/complaints/${id}/status`, { status });
    setComplaints((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
  };

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-card p-4 text-center border border-gray-100">
            <p className="text-3xl font-bold text-gray-800">{total}</p>
            <p className="text-sm text-gray-400 mt-1">Total complaints</p>
          </div>
          <div className="bg-white rounded-xl shadow-card p-4 text-center border border-gray-100">
            <p className="text-3xl font-bold text-yellow-500">{pending}</p>
            <p className="text-sm text-gray-400 mt-1">Pending</p>
          </div>
          <div className="bg-white rounded-xl shadow-card p-4 text-center border border-gray-100">
            <p className="text-3xl font-bold text-green-500">{resolved}</p>
            <p className="text-sm text-gray-400 mt-1">Resolved</p>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <input type="text" placeholder="Filter by district" value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">All severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-card overflow-hidden border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="p-3 font-medium">Image</th>
                  <th className="p-3 font-medium">Category</th>
                  <th className="p-3 font-medium">Severity</th>
                  <th className="p-3 font-medium">District</th>
                  <th className="p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id} className="border-t border-gray-100">
                    <td className="p-3">
                      <img src={c.imageUrl} alt={c.aiCategory} className="w-12 h-12 object-cover rounded-lg" />
                    </td>
                    <td className="p-3 text-gray-700">{c.aiCategory}</td>
                    <td className="p-3 text-gray-700">{c.aiSeverity}</td>
                    <td className="p-3 text-gray-700">{c.location?.district || "-"}</td>
                    <td className="p-3">
                      <select value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs">
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
