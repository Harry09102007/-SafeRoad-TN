import { useState } from "react";
import Navbar from "../components/Navbar";
import LocationPicker from "../components/LocationPicker";
import api from "../api/axios";
import { geocodeAddress } from "../api/geocode";

export default function Report() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFindOnMap = async () => {
    setLocateError("");
    if (!address && !district) {
      setLocateError("Type an address or district first.");
      return;
    }
    setLocating(true);
    try {
      const coords = await geocodeAddress(address, district);
      setPosition(coords);
    } catch (err) {
      setLocateError(err.message || "Couldn't locate that address.");
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!image) return setError("Please attach a photo of the issue.");
    if (!position) return setError("Please set a location - type an address and click \"Find on map\", or click the map directly.");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("description", description);
    formData.append("lat", position.lat);
    formData.append("lng", position.lng);
    formData.append("address", address);
    formData.append("district", district);
    formData.append("isAnonymous", isAnonymous);

    setLoading(true);
    try {
      const res = await api.post("/complaints", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      setImage(null);
      setPreview(null);
      setDescription("");
      setAddress("");
      setDistrict("");
      setPosition(null);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Report a Road Issue</h1>
        <p className="text-gray-500 text-sm mb-6">Upload a photo and we'll classify it automatically with AI.</p>

        {error && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-100 p-3 rounded-lg">{error}</p>}

        {result && (
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6">
            <p className="font-semibold text-brand-700 mb-2">✓ Report submitted — here's what our AI found</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white rounded-lg px-3 py-2">
                <p className="text-xs text-gray-400">Category</p>
                <p className="font-medium text-gray-800">{result.aiCategory}</p>
              </div>
              <div className="bg-white rounded-lg px-3 py-2">
                <p className="text-xs text-gray-400">Severity</p>
                <p className="font-medium text-gray-800">{result.aiSeverity}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{result.aiDescription}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-6 space-y-5 border border-gray-100">
          <div>
            <label className="block text-sm mb-2 text-gray-700 font-medium">Photo</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-6 cursor-pointer hover:border-brand-300 hover:bg-brand-50/30 transition">
              <input type="file" accept="image/*" onChange={handleImageChange} required className="hidden" />
              {preview ? (
                <img src={preview} alt="Preview" className="rounded-lg max-h-40 object-cover" />
              ) : (
                <span className="text-gray-400 text-sm">Click to upload a photo</span>
              )}
            </label>
          </div>

          <div>
            <label className="block text-sm mb-1.5 text-gray-700 font-medium">
              Description <span className="text-gray-400 font-normal">(optional — AI fills gaps)</span>
            </label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              placeholder="e.g. Large pothole causing traffic near the bus stop" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1.5 text-gray-700 font-medium">District</label>
              <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                placeholder="e.g. Chennai" />
            </div>
            <div>
              <label className="block text-sm mb-1.5 text-gray-700 font-medium">Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                placeholder="e.g. Anna Nagar 2nd Ave" />
            </div>
          </div>

          <button type="button" onClick={handleFindOnMap} disabled={locating}
            className="w-full bg-brand-50 text-brand-700 font-medium py-2 rounded-lg hover:bg-brand-100 transition disabled:opacity-50 text-sm">
            {locating ? "Locating..." : "📍 Find on map"}
          </button>
          {locateError && <p className="text-red-600 text-xs -mt-3">{locateError}</p>}

          <div>
            <label className="block text-sm mb-1.5 text-gray-700 font-medium">Location</label>
            <LocationPicker position={position} onChange={setPosition} />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="rounded" />
            Report anonymously
          </label>

          <button type="submit" disabled={loading}
            className="w-full bg-brand-500 text-white font-medium py-2.5 rounded-lg hover:bg-brand-600 active:scale-[0.99] transition disabled:opacity-50">
            {loading ? "Analyzing with AI..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
