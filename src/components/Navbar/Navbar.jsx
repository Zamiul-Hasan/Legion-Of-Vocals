import { useState } from "react";
import logo from "../../assets/images/logos/logo.png";
import { Menu, X, Sparkles, Zap } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import UserMenu from "./UserMenu";
import { useTheme } from "../../context/ThemeContext";
import ThemeSwitcher from "../Theme/ThemeSwitcher";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Contests", path: "/contests" },
  { name: "Team", path: "/team" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSasuke } = useTheme();

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        isSasuke
          ? "bg-[#f1f4f9]/90 backdrop-blur-xl border-b border-slate-300/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
          : "bg-slate-950/75 backdrop-blur-xl border-b border-cyan-500/20"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
        {/* Logo & Studio Badge */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            {/* Custom Studio Emblem (matching reference "F" badge aesthetic) */}
            <div
              className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center font-black text-xl shadow-md transition group-hover:scale-105 ${
                isSasuke
                  ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-500/30"
                  : "bg-slate-900 border border-cyan-500/40 text-cyan-400"
              }`}
            >
              <img
                src={logo}
                alt="LOV Logo"
                className="w-8 h-8 object-contain"
              />
            </div>

            <div>
              <h1
                className={`font-black text-base md:text-lg tracking-wide transition ${
                  isSasuke
                    ? "text-slate-950 group-hover:text-blue-600"
                    : "text-white group-hover:text-cyan-400"
                }`}
              >
                LEGION OF VOCALS
              </h1>

              <p
                className={`text-xs font-semibold ${
                  isSasuke ? "text-blue-600" : "text-cyan-400"
                }`}
              >
                {isSasuke ? "Anime Bangla Dubbing Studio" : "Anime Bangla Dubbing"}
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Navigation */}
          <nav className="flex items-center gap-2 text-sm font-bold">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) => {
                  if (isSasuke) {
                    return isActive
                      ? "px-4 py-1.5 rounded-full border-2 border-blue-600 text-blue-600 bg-blue-50/90 font-extrabold shadow-sm transition"
                      : "px-3 py-1.5 text-slate-700 hover:text-blue-600 transition font-bold";
                  }
                  return isActive
                    ? "px-3 py-1.5 text-cyan-400 font-semibold"
                    : "px-3 py-1.5 text-gray-200 hover:text-cyan-400 transition";
                }}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Theme Quick Switcher */}
          <ThemeSwitcher compact={true} />

          {/* Join LOV CTA */}
          <Link
            to="/join"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition cursor-pointer ${
              isSasuke
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30"
                : "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950"
            }`}
          >
            <Sparkles size={15} />
            Join LOV
          </Link>

          {/* User Menu */}
          <UserMenu />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeSwitcher compact={true} />
          <UserMenu />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
            className={`p-2 rounded-xl transition ${
              isSasuke
                ? "bg-slate-200 border border-slate-300 text-slate-900 hover:bg-slate-300"
                : "bg-slate-900 border border-cyan-500/20 text-white hover:border-cyan-400"
            }`}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden border-b overflow-hidden ${
              isSasuke
                ? "bg-[#f1f4f9] border-slate-300"
                : "bg-slate-950/95 border-cyan-500/20"
            }`}
          >
            <div className="px-6 py-5 flex flex-col gap-2.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => {
                    if (isSasuke) {
                      return isActive
                        ? "px-4 py-2.5 rounded-full border-2 border-blue-600 text-blue-600 bg-blue-50 font-black"
                        : "px-4 py-2.5 text-slate-800 font-bold hover:text-blue-600";
                    }
                    return isActive
                      ? "px-4 py-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-medium"
                      : "px-4 py-3 rounded-xl text-gray-300 hover:bg-slate-900 hover:text-white font-medium";
                  }}
                >
                  {item.name}
                </NavLink>
              ))}

              <Link
                to="/join"
                onClick={() => setMobileOpen(false)}
                className={`mt-2 flex items-center justify-center gap-2 py-3 rounded-full font-bold ${
                  isSasuke
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "bg-cyan-500 text-slate-950"
                }`}
              >
                <Sparkles size={18} />
                Join LOV Community
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;