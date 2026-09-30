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
} from "lucide-react";
import { useNotifications } from "../../data/notifications";
import { useMembers } from "../../hooks/useMembers";
import { useMessenger, openChatWithMember } from "../../hooks/useMessenger";
import ProfilePictureModal from "../Profile/ProfilePictureModal";

function UserMenu() {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const { currentUser, updateMemberAvatar } = useMembers();
  const { totalUnread } = useMessenger();

  const {
    notifications,
    unreadCount,
    markAllRead,
    markRead,
    removeNotification,
  } = useNotifications();

  const user = {
    name: currentUser.fullName || "Zamiul Hasan",
    username: currentUser.username || "zamiul",
    lovId: currentUser.lovId || "LOV-100001",
    role: currentUser.role || "Founder",
    avatar: currentUser.avatar,
  };

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

  const getCategoryIcon = (cat) => {
    if (cat === "Points") return <Trophy size={16} className="text-yellow-400" />;
    if (cat === "Projects") return <Film size={16} className="text-cyan-400" />;
    if (cat === "Announcements")
      return <Megaphone size={16} className="text-pink-400" />;
    return <ShieldCheck size={16} className="text-green-400" />;
  };

  return (
    <div ref={containerRef} className="relative flex items-center gap-3">
      {/* Messenger Button */}
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setNotifOpen(false);
          openChatWithMember("voiceactor01");
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

      {/* Notification Button */}
      <button
        type="button"
        onClick={() => {
          setNotifOpen((prev) => !prev);
          setOpen(false);
        }}
        aria-label="Notifications"
        className={`relative p-2.5 rounded-xl border transition ${
          notifOpen
            ? "bg-cyan-500/20 border-cyan-400 text-cyan-400"
            : "bg-slate-900/80 border-cyan-500/20 text-white hover:border-cyan-400 hover:text-cyan-400"
        }`}
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Popover */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-14 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-base">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500 text-slate-950">
                    {unreadCount} New
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification Items */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  You have no notifications right now.
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      markRead(item.id);
                      setNotifOpen(false);
                      if (item.link) navigate(item.link);
                    }}
                    className={`p-4 cursor-pointer transition flex items-start justify-between gap-3 ${
                      item.unread
                        ? "bg-cyan-500/5 hover:bg-slate-800/90"
                        : "hover:bg-slate-800/50 opacity-75"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-cyan-400">
                            {item.category}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            • {item.time}
                          </span>
                          {item.unread && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-white mt-0.5 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {item.message}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(item.id);
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition shrink-0"
                      title="Dismiss"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-center">
              <Link
                to="/notifications"
                onClick={() => setNotifOpen(false)}
                className="block w-full py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-xs font-bold transition"
              >
                View All Notifications →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Button */}
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          setNotifOpen(false);
        }}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover bg-slate-900"
        />

        <ChevronDown
          size={18}
          className={`text-white transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* User Menu Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-14 w-72 rounded-2xl bg-slate-900 border border-cyan-500/20 shadow-2xl overflow-hidden z-50"
          >
            {/* User Info with Facebook-style Profile Picture Camera Button */}
            <div className="p-5 border-b border-slate-700 flex items-center gap-3.5">
              <div className="relative shrink-0">
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
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-white font-bold text-sm truncate">
                    {user.name}
                  </h3>
                </div>
                <p className="text-cyan-400 text-xs mt-0.5">{user.role}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 font-mono text-[10px] font-bold text-cyan-400">
                  {user.lovId}
                </span>
              </div>
            </div>

            {/* Update Profile Picture Menu Item */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setAvatarModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-800 text-cyan-300 text-sm font-medium transition cursor-pointer"
            >
              <Camera size={18} className="text-cyan-400" />
              Update Profile Picture
            </button>

            {/* Founder/Admin */}
            {(user.role === "Founder" || user.role === "Admin") && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800 text-white transition"
              >
                <Shield size={18} className="text-cyan-400" />
                Admin Panel
              </Link>
            )}

            {/* Profile */}
            <Link
              to={`/team/${user.username}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800 text-white transition"
            >
              <User size={18} className="text-cyan-400" />
              My Profile
            </Link>

            {/* Member Dashboard */}
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800 text-white transition"
            >
              <LayoutDashboard size={18} className="text-cyan-400" />
              Member Dashboard
            </Link>

            {/* Notifications */}
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-5 py-3 hover:bg-slate-800 text-white transition"
            >
              <span className="flex items-center gap-3">
                <Bell size={18} className="text-cyan-400" />
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Rewards */}
            <Link
              to="/rewards"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800 text-white transition"
            >
              <Trophy size={18} className="text-cyan-400" />
              Rewards
            </Link>

            {/* Settings */}
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800 text-white transition"
            >
              <Settings size={18} className="text-cyan-400" />
              Settings
            </Link>

            <div className="border-t border-slate-700" />

            {/* Logout */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/");
              }}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-500/20 text-red-400 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ProfilePictureModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        member={currentUser}
        onSave={(newAvatar, options) =>
          updateMemberAvatar(currentUser.id, newAvatar, options)
        }
      />
    </div>
  );
}

export default UserMenu;