import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  Upload,
  Home,
  CheckCheck,
  Trophy,
  Film,
  Megaphone,
  ShieldCheck,
  Trash2,
  Camera,
  MessageCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useMembers } from "../../hooks/useMembers";
import { useNotifications } from "../../data/notifications";
import { useMessenger } from "../../hooks/useMessenger";
import BackButton from "../UI/BackButton";
import ProfilePictureModal from "../Profile/ProfilePictureModal";

function DashboardTopbar() {
  const { currentUser, updateMemberAvatar } = useMembers();
  const user = currentUser || {
    id: 1,
    displayName: "Member",
    username: "member",
    lovId: "LOV-MEMBER",
    level: 1,
    avatar: "https://i.pravatar.cc/150?img=33",
  };
  const { totalUnread } = useMessenger();
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAllRead,
    markRead,
    removeNotification,
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
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
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-cyan-500/20">
      <div className="flex items-center justify-between gap-4 px-6 md:px-8 py-4">
        {/* Left: Back Button + Search */}
        <div className="flex items-center gap-3 w-full max-w-xl">
          <BackButton variant="subtle" fallback="/" />

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search projects, dubs, or LOV ID..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-cyan-400 transition"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 md:gap-4">
          <Link
            to="/"
            className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-gray-300 hover:border-cyan-400"
            title="Public Home"
          >
            <Home size={20} />
          </Link>

          <Link
            to="/upload-dub"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition"
          >
            <Upload size={16} />
            Upload Dub
          </Link>

          {/* Messenger Button */}
          <Link
            to="/messages"
            aria-label="Messages"
            title="LOV Studio Messenger"
            className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-white hover:text-cyan-400 transition"
          >
            <MessageCircle size={20} />
            {totalUnread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-cyan-500 text-slate-950 text-xs font-black flex items-center justify-center">
                {totalUnread}
              </span>
            )}
          </Link>

          {/* Notification Dropdown Trigger */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen((prev) => !prev)}
              aria-label="Notifications"
              className={`relative p-2.5 rounded-xl border transition ${
                notifOpen
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-400"
                  : "bg-slate-900 border-slate-700 hover:border-cyan-400 text-white"
              }`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-14 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-2xl overflow-hidden z-50"
                >
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

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 text-sm">
                        No notifications right now.
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

                  <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setNotifOpen(false)}
                      className="block w-full py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-xs font-bold transition"
                    >
                      Open Notifications Page →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User with Facebook-style Camera Button */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Link to={`/team/${user.username}`}>
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover bg-slate-900"
                />
              </Link>
              <button
                type="button"
                onClick={() => setAvatarModalOpen(true)}
                title="Update Profile Picture"
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-400 flex items-center justify-center shadow cursor-pointer transition"
              >
                <Camera size={10} />
              </button>
            </div>

            <Link
              to={`/team/${user.username}`}
              className="hidden md:flex items-center gap-2 group"
            >
              <div className="text-left">
                <h4 className="text-white font-semibold text-sm group-hover:text-cyan-400 transition">
                  {user.displayName}
                </h4>
                <p className="text-xs text-cyan-400">
                  {user.lovId} • Lv.{user.level}
                </p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </Link>
          </div>
        </div>
      </div>

      <ProfilePictureModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        member={user}
        onSave={(newAvatar, options) =>
          updateMemberAvatar(user.id, newAvatar, options)
        }
      />
    </header>
  );
}

export default DashboardTopbar;