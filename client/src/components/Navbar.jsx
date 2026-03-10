import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiX, FiLogOut, FiGrid } from "react-icons/fi";
import { FaCar } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const isAdminSection = location.pathname.startsWith("/admin");

  const linkClass = (active) =>
    `!px-5 !py-2 rounded-full text-sm font-medium transition-all duration-200 ${active
      ? "bg-amber-500 text-slate-900 font-semibold"
      : "text-slate-400 bg-slate-800 hover:text-white hover:bg-slate-700 border border-white/10"
    }`;
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center">
              <FaCar className="text-white text-sm" />
            </div>
            <span className="text-base font-bold text-white">Pelmadulla</span>
            <span className="text-base font-bold gradient-text">Taxi</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {/* Links Pill Container */}
            <div className="flex items-center gap-2">
              <Link to="/" className={linkClass(isActive("/"))}>
                Home
              </Link>
              <Link to="/fleet" className={linkClass(isActive("/fleet"))}>
                Fleet
              </Link>

              {user && (
                user.role === "admin" ? (
                  <Link to="/admin" className={linkClass(isAdminSection)}>
                    <span className="flex items-center gap-1.5">
                      <FiGrid size={14} /> Dashboard
                    </span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className={linkClass(isActive("/dashboard"))}
                  >
                    My Bookings
                  </Link>
                )
              )}
            </div>

            {/* Profile / Auth section */}
            {user ? (
              <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-slate-800">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-200 max-w-[100px] truncate">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-1 p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors rounded-full"
                  title="Logout"
                >
                  <FiLogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 pl-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary !rounded-full !py-2 !px-6 !text-sm shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              className="block px-6 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/fleet"
              className="block px-6 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Fleet
            </Link>
            {user ? (
              <>
                {user.role === "admin" ? (
                  <Link
                    to="/admin"
                    className="block px-4 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                )}
                <div className="border-t border-white/10 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-red-400 hover:bg-white/10 text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-white/10 mt-2 pt-2 flex gap-2 px-4">
                <Link
                  to="/login"
                  className="btn-secondary !py-2 !px-6 !text-sm flex-1 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary !py-2 !px-6 !text-sm flex-1 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
