import { Link } from "react-router-dom";

function PendingApprovals() {
  return (
    <div className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Pending Approvals
        </h2>
        <Link
          to="/admin/pending-users"
          className="text-sm text-cyan-400 hover:underline font-medium"
        >
          View All →
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center bg-slate-800 rounded-xl p-4">
          <div>
            <h3 className="text-white font-semibold">
              Tanvir Hasan — Voice Actor Application
            </h3>
            <p className="text-gray-400 text-sm">
              Applied 28 Jul 2026 • Voice Sample Attached
            </p>
          </div>

          <Link
            to="/admin/pending-users"
            className="bg-cyan-500 hover:bg-cyan-400 px-4 py-2 rounded-lg text-slate-950 font-semibold text-sm transition"
          >
            Review
          </Link>
        </div>

        <div className="flex justify-between items-center bg-slate-800 rounded-xl p-4">
          <div>
            <h3 className="text-white font-semibold">
              Solo Leveling Episode 2 Dub Cut
            </h3>
            <p className="text-gray-400 text-sm">
              Uploaded by Editor One
            </p>
          </div>

          <Link
            to="/my-dub-videos"
            className="bg-cyan-500 hover:bg-cyan-400 px-4 py-2 rounded-lg text-slate-950 font-semibold text-sm transition"
          >
            Review
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PendingApprovals;