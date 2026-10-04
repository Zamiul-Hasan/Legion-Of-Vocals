import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  Bell,
  ChevronDown,
  Shield,
  Settings,
  Trophy,
  LogOut,
  CheckCheck,
  Film,
  Megaphone,
  ShieldCheck,
  Trash2,
  LayoutDashboard,
  Camera,
  MessageCircle,
  Users,
  Clock,
} from "lucide-react";
import { useNotifications } from "../../data/notifications";
import { useMembers } from "../../hooks/useMembers";
import { useMessenger, openChatWithMember } from "../../hooks/useMessenger";
import ProfilePictureModal from "../Profile/ProfilePictureModal";
import useAuth from "../../hooks/useAuth";
import founderAvatar from "../../assets/images/characters/founder-avatar.png";

function UserMenu() {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const { user: authUser, isAdmin, isFounder, signOut } = useAuth();
  const { currentUser, updateMemberAvatar } = useMembers();
  const { totalUnread } = useMessenger();

  const {
    notifications,
    unreadCount,
    markAllRead,
    markRead,
    removeNotification,
  } = useNotifications(authUser?.username);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!authUser) return null;

  const user = {
    name: authUser.fullName || authUser.displayName || authUser.name || "Member",
    username: authUser.username || "member",
    lovId: authUser.lovId || "LOV-MEMBER",
    role: isFounder
      ? "Founder"
      : isAdmin
      ? "Admin"
      : authUser.roleLabel || "Member",
    avatar:
      (currentUser?.avatar && !currentUser.avatar.includes("logo.png") && !currentUser.avatar.includes("logo.jpg") ? currentUser.avatar : null) ||
      (authUser.avatar && !authUser.avatar.includes("logo.png") && !authUser.avatar.includes("logo.jpg") ? authUser.avatar : null) ||
      (isFounder ? founderAvatar : "https://i.pravatar.cc/150?img=33"),
  };

  const getCategoryIcon = (cat) => {
    if (cat === "Points") return <Trophy size={16} className="text-yellow-400" />;
    if (cat === "Projects") return <Film size={16} className="text-cyan-400" />;
    if (cat === "Announcements")
      return <Megaphone size={16} className="text-pink-400" />;
    return <ShieldCheck size={16} className="text-green-400" />;
  };

  return (
    <div ref={containerRef} className="relative flex items-center gap-3">
      {/* Messenger Button (Only for logged in users) */}
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setNotifOpen(false);
          openChatWithMember("ovi");
        }}
        aria-label="LOV Messenger"
        title="Open LOV Messenger"
        className="relative p-2.5 rounded-xl border bg-slate-900/80 border-cyan-500/20 text-white hover:border-cyan-400 hover:text-cyan-400 transition cursor-pointer"
      >
        <MessageCircle size={20} />

        {totalUnread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-cyan-500 text-slate-950 text-[11px] font-black flex items-center justify-center shadow-lg">
            {totalUnread}
          </span>
        )}
      </button>

      {/* Notification Button (Only for logged in users) */}
      <button
        type="button"
        onClick={() => {
          setNotifOpen((prev) => !prev);
          setOpen(false);
        }}
        aria-label="Notifications"
        title="Notifications"
        className="relative p-2.5 rounded-xl border bg-slate-900/80 border-cyan-500/20 text-white hover:border-cyan-400 hover:text-cyan-400 transition cursor-pointer"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center shadow-lg animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-14 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition cursor-pointer"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-xs">
                  No notifications yet
                </div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`p-3.5 flex gap-3 hover:bg-slate-800/50 transition cursor-pointer ${
                      n.unread ? "bg-cyan-500/5" : ""
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {getCategoryIcon(n.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-gray-500 mt-1 block">
                        {n.time}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(n.id);
                      }}
                      className="text-gray-500 hover:text-red-400 transition shrink-0 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-2.5 border-t border-slate-800 bg-slate-950/60 text-center">
              <Link
                to="/notifications"
                onClick={() => setNotifOpen(false)}
                className="text-xs font-semibold text-cyan-400 hover:underline"
              >
                View all notifications →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile Trigger Button */}
      <button
        onClick={() => {
          setOpen((prev) => !prev);
          setNotifOpen(false);
        }}
        className="flex items-center gap-2 p-1 pl-1.5 rounded-full border bg-slate-900/80 border-cyan-500/20 hover:border-cyan-400 transition cursor-pointer"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover border border-cyan-400"
        />
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform mr-1 ${
            open ? "rotate-180 text-cyan-400" : ""
          }`}
        />
      </button>

      {/* User Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-14 w-72 rounded-3xl bg-slate-900 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 z-50 overflow-hidden"
          >
            {/* User Info Header */}
            <div className="p-5 border-b border-slate-800 flex items-center gap-3">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  onClick={() => {
                    setOpen(false);
                    setAvatarModalOpen(true);
                  }}
                  className="w-12 h-12 rounded-full border-2 border-cyan-400 object-cover bg-slate-950 cursor-pointer"
                  title="Update Profile Picture"
                />
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setAvatarModalOpen(true);
                  }}
                  title="Update Profile Picture"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-400 flex items-center justify-center shadow transition cursor-pointer"
                >
                  <Camera size={12} />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm truncate">
                  {user.name}
                </h3>
                <p className="text-cyan-400 text-xs mt-0.5">{user.role}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 font-mono text-[10px] font-bold text-cyan-400">
                  {user.lovId}
                </span>
              </div>
            </div>

            {/* Menu Links */}
            <div className="py-2 text-sm font-medium">
              {/* Admin or Founder: Unified Admin Access */}
              {isAdmin || isFounder ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800 text-cyan-300 font-bold transition"
                  >
                    <Shield size={18} className="text-cyan-400" />
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/members"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-800 text-white transition"
                  >
                    <Users size={18} className="text-cyan-400" />
                    Manage Members
                  </Link>
                  <Link
                    to="/admin/pending-users"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-800 text-white transition"
                  >
                    <Clock size={18} className="text-cyan-400" />
                    Pending Applications
                  </Link>
                  <Link
                    to="/admin/contests"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-800 text-white transition"
                  >
                    <Trophy size={18} className="text-cyan-400" />
                    Contests Management
                  </Link>
                  <Link
                    to="/admin/projects"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-800 text-white transition"
                  >
                    <Film size={18} className="text-cyan-400" />
                    Projects Management
                  </Link>
                </>
              ) : (
                /* Regular Member Menu */
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800 text-white transition"
                  >
                    <LayoutDashboard size={18} className="text-cyan-400" />
                    Member Dashboard
                  </Link>
                  <Link
                    to={`/team/${user.username}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-800 text-white transition"
                  >
                    <User size={18} className="text-cyan-400" />
                    My Profile
                  </Link>
                  <Link
                    to="/my-projects"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-800 text-white transition"
                  >
                    <Film size={18} className="text-cyan-400" />
                    My Projects
                  </Link>
                  <Link
                    to="/rewards"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-800 text-white transition"
                  >
                    <Trophy size={18} className="text-cyan-400" />
                    Rewards & Points
                  </Link>
                </>
              )}

              {/* Settings (Common) */}
              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-800 text-white transition"
              >
                <Settings size={18} className="text-cyan-400" />
                Settings
              </Link>

              <div className="border-t border-slate-800 my-1" />

              {/* Logout */}
              <button
                type="button"
                onClick={async () => {
                  setOpen(false);
                  await signOut();
                  navigate("/");
                }}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {currentUser && (
        <ProfilePictureModal
          isOpen={avatarModalOpen}
          onClose={() => setAvatarModalOpen(false)}
          member={currentUser}
          onSave={(newAvatar, options) =>
            updateMemberAvatar(
              currentUser.id || authUser?.id || authUser?.username,
              newAvatar,
              options
            )
          }
        />
      )}
    </div>
  );
}

export default UserMenu;