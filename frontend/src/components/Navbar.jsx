import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/report", label: "Report Issue" },
    { to: "/map", label: "Live Map" },
    { to: "/my-complaints", label: "My Complaints" },
  ];
  if (user?.role === "admin") links.push({ to: "/admin", label: "Admin" });

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-[1000]">
      <span className="font-bold text-brand-700 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />
        SafeRoad TN
      </span>

      <div className="flex gap-1 text-sm items-center">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`px-3 py-1.5 rounded-lg transition ${
              location.pathname === l.to
                ? "bg-brand-50 text-brand-700 font-medium"
                : "text-gray-500 hover:text-brand-600 hover:bg-gray-50"
            }`}
          >
            {l.label}
          </Link>
        ))}
        <button onClick={handleLogout} className="ml-2 text-sm text-red-500 hover:text-red-600 px-3 py-1.5">
          Log out
        </button>
      </div>
    </nav>
  );
}
