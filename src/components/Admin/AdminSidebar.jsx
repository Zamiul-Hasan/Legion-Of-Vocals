import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FolderKanban,
  Mic2,
  Trophy,
  Gift,
  Settings,
  LogOut,
  Globe,
  User,
  Camera,
  MessageCircle,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logos/logo.png";
import { useMembers } from "../../hooks/useMembers";
import useAuth from "../../hooks/useAuth";
import ProfilePictureModal from "../Profile/ProfilePictureModal";

function AdminSidebar() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { currentUser, updateMemberAvatar } = useMembers();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  const displayUser = currentUser || {
    id: 1,
    fullName: "MD Zamiul Hasan",
    avatar: logo,
    role: "Founder",
  };

  const menus = [
    {
      title: "Overview",
      icon: LayoutDashboard,
      path: "/admin",
      exact: true,
    },
    {
      title: "Messages",
      icon: MessageCircle,
      path: "/messages",
    },
    {
      title: "Members",
      icon: Users,
      path: "/admin/members",
    },
    {
      title: "Pending Users",
      icon: UserPlus,
      path: "/admin/pending-users",
    },
    {
      title: "Projects",
      icon: FolderKanban,
      path: "/admin/projects",
    },
    {
      title: "Contests",
      icon: Trophy,
      path: "/admin/contests",
    },
    {
      title: "Dub Videos",
      icon: Mic2,
      path: "/my-dub-videos",
    },
    {
      title: "Leaderboard",
      icon: Trophy,
      path: "/leaderboard",
    },
    {
      title: "Rewards",
      icon: Gift,
      path: "/rewards",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

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
              LOV ADMIN
            </h1>
            <p className="text-cyan-400 text-xs">
              Founder Control Panel
            </p>
          </div>
        </Link>
      </div>

      {/* User with Facebook-style Profile Picture Updater */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={displayUser.avatar}
              alt={displayUser.fullName}
              onClick={() => setAvatarModalOpen(true)}
              className="w-12 h-12 rounded-full border-2 border-cyan-400 object-cover bg-slate-900 cursor-pointer"
              title="Click to update profile picture"
            />
            <button
              type="button"
              onClick={() => setAvatarModalOpen(true)}
              title="Update Profile Picture"
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-400 flex items-center justify-center shadow transition cursor-pointer"
            >
              <Camera size={12} />
            </button>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">
              {displayUser.fullName}
            </h3>
            <p className="text-cyan-400 text-xs">
              Founder & Studio Lead
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-xl transition ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/25"
                    : "text-gray-300 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              {item.title}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Links */}
      <div className="p-4 border-t border-slate-800 space-y-2">

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
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-red-400 hover:bg-red-500/15 border border-red-500/20 text-sm font-medium transition cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <ProfilePictureModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        member={displayUser}
        onSave={(newAvatar, options) =>
          updateMemberAvatar(displayUser.id, newAvatar, options)
        }
      />
    </aside>
  );
}

export default AdminSidebar;