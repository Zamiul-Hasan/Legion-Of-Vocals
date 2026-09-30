import {
  FolderKanban,
  Video,
  Trophy,
  Star,
  Clock,
  CheckCircle2,
  Upload,
  Megaphone,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import StatCard from "./StatCard";
import members from "../../data/members";
import tasks from "../../data/tasks";
import announcements from "../../data/announcements";

function DashboardOverview() {
  const user = members[0];

  const statusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "In Progress":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      case "Pending Review":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/20 rounded-3xl p-7">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Welcome back, {user.displayName} 👋
          </h1>
          <p className="text-gray-400 mt-2">
            Here&apos;s your studio activity, assigned dubbing lines, and community progress.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.facebook.com/share/g/19MxBAkZsX/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-sm shadow-[0_0_20px_rgba(24,119,242,0.35)] transition"
          >
            <span className="w-5 h-5 rounded-md bg-white text-[#1877F2] flex items-center justify-center font-black text-xs">
              f
            </span>
            Join FB Group: LOV CORPORATION
          </a>
          <Link
            to="/upload-dub"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition"
          >
            <Upload size={18} />
            Upload Dub
          </Link>
          <Link
            to={`/team/${user.username}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-cyan-500/20 font-semibold text-sm transition"
          >
            View Public Profile
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Projects"
          value={user.stats.projects}
          icon={FolderKanban}
        />

        <StatCard
          title="Dub Videos"
          value={user.stats.dubVideos}
          icon={Video}
          color="text-green-400"
        />

        <StatCard
          title="Points"
          value={user.stats.points}
          icon={Trophy}
          color="text-yellow-400"
        />

        <StatCard
          title="Level"
          value={user.level}
          icon={Star}
          color="text-pink-400"
        />
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid xl:grid-cols-3 gap-8">
        {/* Assigned Production Tasks */}
        <div className="xl:col-span-2 bg-slate-900 border border-cyan-500/20 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Clock size={22} className="text-cyan-400" />
              Assigned Production Tasks
            </h2>
            <Link
              to="/my-projects"
              className="text-sm text-cyan-400 hover:underline flex items-center gap-1"
            >
              All Projects <ArrowRight size={15} />
            </Link>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                    <span>{task.projectTitle}</span>
                    <span>•</span>
                    <span>{task.episode}</span>
                    <span>•</span>
                    <span className="text-gray-400">{task.department}</span>
                  </div>
                  <h3 className="text-white font-semibold mt-1">
                    {task.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Deadline: {task.deadline}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                  <span className="text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full">
                    +{task.points} pts
                  </span>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusBadge(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Announcements & Achievements */}
        <div className="space-y-6">
          {/* Studio Announcements */}
          <div className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-5">
              <Megaphone size={20} className="text-cyan-400" />
              Studio Bulletin
            </h2>

            <div className="space-y-3">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800"
                >
                  <span className="text-xs text-cyan-400 font-medium">
                    {item.date}
                  </span>
                  <p className="text-sm font-semibold text-white mt-1">
                    {item.title}
                  </p>
                  {item.link && (
                    <div className="mt-2">
                      {item.link.startsWith("http") ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-cyan-400 hover:underline"
                        >
                          {item.linkLabel || "Open Link →"}
                        </a>
                      ) : (
                        <Link
                          to={item.link}
                          className="text-xs font-bold text-cyan-400 hover:underline"
                        >
                          {item.linkLabel || "Open Link →"}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Badges / Achievements */}
          <div className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <CheckCircle2 size={20} className="text-cyan-400" />
              Earned Badges
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.achievements.map((badge) => (
                <span
                  key={badge}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold"
                >
                  🏆 {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;