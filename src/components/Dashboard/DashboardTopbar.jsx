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
import { useTheme } from "../../context/ThemeContext";
import ThemeSwitcher from "../Theme/ThemeSwitcher";
import BackButton from "../UI/BackButton";
import ProfilePictureModal from "../Profile/ProfilePictureModal";

function DashboardTopbar() {
  const { currentUser, updateMemberAvatar } = useMembers();
  const { totalUnread } = useMessenger();
  const { isSasuke } = useTheme();
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
    if (cat === "Projects") return <Film size={16} className={isSasuke ? "text-blue-400" : "text-cyan-400"} />;
    if (cat === "Announcements")
      return <Megaphone size={16} className="text-pink-400" />;
    return <ShieldCheck size={16} className="text-green-400" />;
  };

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors duration-300 ${
      isSasuke
        ? "bg-[#0c0d12]/90 border-slate-800"
        : "bg-slate-950/85 border-cyan-500/20"
    }`}>
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
              className={`w-full border rounded-xl py-2.5 pl-11 pr-4 text-sm text-white outline-none transition ${
                isSasuke
                  ? "bg-slate-950 border-slate-800 focus:border-blue-500"
                  : "bg-slate-900 border-slate-700 focus:border-cyan-400"
              }`}
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 md:gap-4">
          <ThemeSwitcher compact={true} />

          <Link
            to="/"
            className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-gray-300 hover:text-white"
            title="Public Home"
          >
            <Home size={20} />
          </Link>

          <Link
            to="/upload-dub"
            className={`hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
              isSasuke
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
            }`}
          >
            <Upload size={16} />
            Upload Dub
          </Link>

          {/* Messenger Button */}
          <Link
            to="/messages"
            aria-label="Messages"
            title="LOV Studio Messenger"
            className={`relative p-2.5 rounded-xl border transition ${
              isSasuke
                ? "bg-slate-900 border-slate-800 hover:border-blue-500 text-white hover:text-blue-400"
                : "bg-slate-900 border-slate-700 hover:border-cyan-400 text-white hover:text-cyan-400"
            }`}
          >
            <MessageCircle size={20} />
            {totalUnread > 0 && (
              <span className={`absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full text-xs font-black flex items-center justify-center ${
                isSasuke ? "bg-blue-600 text-white" : "bg-cyan-500 text-slate-950"
              }`}>
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
              className={`relative p-2.5 rounded-xl border transition cursor-pointer ${
                notifOpen
                  ? isSasuke
                    ? "bg-blue-600/20 border-blue-500 text-blue-400"
                    : "bg-cyan-500/20 border-cyan-400 text-cyan-400"
                  : "bg-slate-900 border-slate-800 hover:border-blue-500 text-white"
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
                  className={`absolute right-0 top-14 w-80 sm:w-96 rounded-3xl border shadow-2xl overflow-hidden z-50 ${
                    isSasuke
                      ? "bg-slate-950 border-blue-500/40"
                      : "bg-slate-900 border-cyan-500/30"
                  }`}
                >
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold text-base">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          isSasuke ? "bg-blue-600 text-white" : "bg-cyan-500 text-slate-950"
                        }`}>
                          {unreadCount} New
                        </span>
                      )}
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className={`text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                          isSasuke ? "text-blue-400 hover:text-blue-300" : "text-cyan-400 hover:text-cyan-300"
                        }`}
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
                              ? isSasuke ? "bg-blue-600/10 hover:bg-slate-900" : "bg-cyan-500/5 hover:bg-slate-800/90"
                              : "hover:bg-slate-900/60 opacity-75"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                              {getCategoryIcon(item.category)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[11px] font-semibold ${isSasuke ? "text-blue-400" : "text-cyan-400"}`}>
                                  {item.category}
                                </span>
                                <span className="text-[11px] text-gray-500">
                                  • {item.time}
                                </span>
                                {item.unread && (
                                  <span className={`w-2 h-2 rounded-full ${isSasuke ? "bg-blue-400" : "bg-cyan-400"}`} />
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
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition shrink-0 cursor-pointer"
                            title="Dismiss"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setNotifOpen(false)}
                      className={`block w-full py-2 rounded-xl text-xs font-bold transition ${
                        isSasuke
                          ? "bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white"
                          : "bg-cyan-500/15 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300"
                      }`}
                    >
                      Open Notifications Page →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User with Camera Button */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Link to={`/team/${currentUser.username}`}>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className={`w-10 h-10 rounded-full border-2 object-cover bg-slate-900 ${
                    isSasuke ? "border-blue-500" : "border-cyan-400"
                  }`}
                />
              </Link>
              <button
                type="button"
                onClick={() => setAvatarModalOpen(true)}
                title="Update Profile Picture"
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border flex items-center justify-center shadow cursor-pointer transition ${
                  isSasuke
                    ? "bg-slate-900 hover:bg-blue-600 text-blue-400 hover:text-white border-blue-500"
                    : "bg-slate-900 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border-cyan-400"
                }`}
              >
                <Camera size={10} />
              </button>
            </div>

            <Link
              to={`/team/${currentUser.username}`}
              className="hidden md:flex items-center gap-2 group"
            >
              <div className="text-left">
                <h4 className={`text-white font-semibold text-sm transition ${
                  isSasuke ? "group-hover:text-blue-400" : "group-hover:text-cyan-400"
                }`}>
                  {currentUser.displayName}
                </h4>
                <p className={`text-xs font-semibold ${isSasuke ? "text-blue-400" : "text-cyan-400"}`}>
                  {currentUser.lovId} • Lv.{currentUser.level}
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
        member={currentUser}
        onSave={(newAvatar, options) =>
          updateMemberAvatar(currentUser.id, newAvatar, options)
        }
      />
    </header>
  );
}

export default DashboardTopbar;