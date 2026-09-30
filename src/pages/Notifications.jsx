import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Trophy,
  Film,
  Megaphone,
  ShieldCheck,
  Trash2,
  RotateCcw,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/UI/Button";
import { useNotifications } from "../data/notifications";

function Notifications() {
  const {
    notifications: items,
    unreadCount,
    markAllRead,
    toggleRead,
    removeNotification,
    resetNotifications,
  } = useNotifications();

  const [filter, setFilter] = useState("All");

  const getIcon = (cat) => {
    if (cat === "Points") return <Trophy size={20} className="text-yellow-400" />;
    if (cat === "Projects") return <Film size={20} className="text-cyan-400" />;
    if (cat === "Announcements")
      return <Megaphone size={20} className="text-pink-400" />;
    return <ShieldCheck size={20} className="text-green-400" />;
  };

  const filtered = items.filter((item) => {
    if (filter === "All") return true;
    if (filter === "Unread") return item.unread;
    return item.category === filter;
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              <Bell className="text-cyan-400" size={34} />
              Notifications
              {unreadCount > 0 && (
                <span className="px-3 py-1 rounded-full text-xs bg-cyan-500 text-slate-950 font-black">
                  {unreadCount} New
                </span>
              )}
            </h1>
            <p className="mt-2 text-gray-400">
              Stay updated on casting calls, episode approvals, and point rewards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<CheckCheck size={16} />}
                onClick={markAllRead}
              >
                Mark All as Read
              </Button>
            )}
            {items.length === 0 && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<RotateCcw size={16} />}
                onClick={resetNotifications}
              >
                Restore Sample Notifications
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {["All", "Unread", "Projects", "Points", "Announcements"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  filter === tab
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-900 text-gray-300 border border-cyan-500/20 hover:border-cyan-400"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900 border border-cyan-500/20 text-center text-gray-400">
              No notifications in this view.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleRead(item.id)}
                className={`cursor-pointer p-6 rounded-3xl border transition flex items-start justify-between gap-4 ${
                  item.unread
                    ? "bg-slate-900 border-cyan-500/40 shadow-lg shadow-cyan-500/5"
                    : "bg-slate-900/50 border-slate-800 opacity-80"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {getIcon(item.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-cyan-400">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">• {item.time}</span>
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1 leading-6">
                      {item.message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(item.id);
                  }}
                  className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition shrink-0"
                  title="Dismiss"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;