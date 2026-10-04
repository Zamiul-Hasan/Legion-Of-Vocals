import { NavLink, Link, useNavigate } from "react-router-dom";
import { LogOut, Globe, Shield } from "lucide-react";
import logo from "../../assets/images/logos/logo.png";
import { sidebarMenus } from "../../config/sidebarConfig";
import useAuth from "../../hooks/useAuth";

function DashboardSidebar({ role = "member" }) {
  const menuItems = sidebarMenus[role] || [];
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  return (
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-cyan-500/20 hidden lg:flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-cyan-500/20">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="LOV Logo"
            className="w-11 h-11 object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.7)]"
          />
          <div>
            <h1 className="text-xl font-bold text-white group-hover:text-cyan-400 transition">
              LOV PORTAL
            </h1>
            <p className="text-xs text-cyan-400">
              Member Workspace
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const targetPath =
            item.name === "Profile"
              ? `/team/${user?.username || "ovi"}`
              : item.path;

          return (
            <NavLink
              key={item.name}
              to={targetPath}
              className={({ isActive }) =>
                `
                flex items-center gap-4
                px-4 py-3.5
                rounded-xl
                transition-all
                duration-200
                ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/25"
                    : "text-gray-400 hover:bg-slate-900 hover:text-white"
                }
              `
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Switch & Logout */}
      <div className="p-4 border-t border-cyan-500/20 space-y-2">
        {isAdmin && (
          <Link
            to="/admin"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 text-sm font-medium transition"
          >
            <Shield size={18} />
            Switch to Admin Panel
          </Link>
        )}

        <Link
          to="/"
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-gray-300 text-sm font-medium transition"
        >
          <Globe size={18} />
          Back to Public Site
        </Link>

        <button
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 font-medium text-sm transition cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;