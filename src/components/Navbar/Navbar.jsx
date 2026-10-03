import { useState } from "react";
import logo from "../../assets/images/logos/logo.png";
import { Menu, X, Sparkles, LogIn, Mic, Shield } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import UserMenu from "./UserMenu";
import useAuth from "../../hooks/useAuth";
import LoginModal from "../Auth/LoginModal";
import TeamAuditionModal from "../Auth/TeamAuditionModal";

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
  const [loginOpen, setLoginOpen] = useState(false);
  const [auditionOpen, setAuditionOpen] = useState(false);

  const { isAuthenticated, isAdmin, user, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/75 backdrop-blur-xl border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="LOV Logo"
            className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.8)] transition duration-300 group-hover:scale-110"
          />

          <div>
            <h1 className="text-white font-bold text-lg md:text-xl tracking-wide group-hover:text-cyan-400 transition">
              LEGION OF VOCALS
            </h1>

            <p className="text-cyan-400 text-xs">
              Anime Bangla Dubbing
            </p>
          </div>
        </Link>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Navigation */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `transition ${
                    isActive
                      ? "text-cyan-400 font-semibold"
                      : "text-gray-200 hover:text-cyan-400"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                {/* Guest: Join LOV */}
                <Link
                  to="/join"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 font-semibold text-sm transition"
                >
                  <Sparkles size={16} />
                  Join LOV
                </Link>

                {/* Guest: Login Button */}
                <button
                  type="button"
                  onClick={() => setLoginOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-white hover:text-cyan-400 font-semibold text-sm transition cursor-pointer"
                >
                  <LogIn size={16} className="text-cyan-400" />
                  Sign In
                </button>
              </>
            ) : (
              <>
                {/* Authenticated Admin / Founder */}
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 font-semibold text-sm transition"
                  >
                    <Shield size={16} />
                    Admin Panel
                  </Link>
                ) : (
                  /* Authenticated Member: Audition for Team */
                  <button
                    type="button"
                    onClick={() => setAuditionOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 font-semibold text-sm transition cursor-pointer"
                  >
                    <Mic size={16} />
                    Audition for Team
                  </button>
                )}

                {/* User Menu (Only visible when logged in) */}
                <UserMenu />
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          {isAuthenticated && <UserMenu />}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
            className="p-2 rounded-xl bg-slate-900 border border-cyan-500/20 text-white hover:border-cyan-400 transition"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
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
            className="lg:hidden bg-slate-950/95 border-b border-cyan-500/20 overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl font-medium transition ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        : "text-gray-300 hover:bg-slate-900 hover:text-white"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              {!isAuthenticated ? (
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    to="/join"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold"
                  >
                    <Sparkles size={18} />
                    Join LOV Community
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setLoginOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold"
                  >
                    <LogIn size={18} />
                    Sign In
                  </button>
                </div>
              ) : (
                <div className="pt-2 flex flex-col gap-2">
                  {isAdmin ? (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold"
                    >
                      <Shield size={18} />
                      Admin Panel
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        setAuditionOpen(true);
                      }}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold"
                    >
                      <Mic size={18} />
                      Audition for Team
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      signOut();
                    }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold"
                  >
                    Logout ({user?.username})
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <TeamAuditionModal
        isOpen={auditionOpen}
        onClose={() => setAuditionOpen(false)}
      />
    </header>
  );
}

export default Navbar;