import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(name, email, password);
      navigate("/report");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-card w-full max-w-sm border border-gray-100">
        <div className="mb-6">
          <p className="text-brand-500 text-xs font-semibold tracking-wide uppercase mb-1">Get started</p>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        </div>

        {error && <p className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded-lg">{error}</p>}

        <label className="block text-sm mb-1 text-gray-600 font-medium">Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" />

        <label className="block text-sm mb-1 text-gray-600 font-medium">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" />

        <label className="block text-sm mb-1 text-gray-600 font-medium">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-6 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" />

        <button type="submit" className="w-full bg-brand-500 text-white font-medium py-2.5 rounded-lg hover:bg-brand-600 active:scale-[0.99] transition">
          Sign up
        </button>

        <p className="text-sm text-center mt-5 text-gray-500">
          Already have an account? <Link to="/login" className="text-brand-600 font-semibold hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
