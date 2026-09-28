import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const statusColor = {
  Pending: "bg-yellow-50 text-yellow-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Resolved: "bg-green-50 text-green-700",
};

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/complaints/mine").then((res) => setComplaints(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Complaints</h1>
        <p className="text-gray-500 text-sm mb-6">Track the status of everything you've reported.</p>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : complaints.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
            You haven't reported anything yet.
          </div>
        ) : (
          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c._id} className="bg-white rounded-xl shadow-card p-4 flex gap-4 border border-gray-100">
                <img src={c.imageUrl} alt={c.aiCategory} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h2 className="font-semibold text-gray-800">{c.aiCategory}</h2>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[c.status]}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{c.aiDescription}</p>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Severity: {c.aiSeverity} &middot; {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
