import { useNotifications } from "../../../data/notifications";
import { Activity } from "lucide-react";

function RecentActivities() {
  const { notifications = [] } = useNotifications();
  const safeNotifs = Array.isArray(notifications) ? notifications : [];

  return (
    <div className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity size={22} className="text-cyan-400" />
          Recent Activities
        </h2>
      </div>

      {safeNotifs.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          <p className="font-semibold text-white">No Activities Yet</p>
          <p className="text-xs text-gray-500 mt-1">
            Studio events, point updates, and member actions will be recorded here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {safeNotifs.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/50 flex flex-col gap-1 hover:border-cyan-500/30 transition"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-white text-sm font-semibold truncate">
                  {item.title}
                </p>
                <span className="text-cyan-400 text-xs shrink-0 font-mono">
                  {item.time || "Just now"}
                </span>
              </div>
              <p className="text-gray-400 text-xs line-clamp-2">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentActivities;