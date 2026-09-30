function RecentActivities() {
  return (
    <div className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        Recent Activities
      </h2>

      <div className="space-y-5">

        <div>
          <p className="text-white">
            Rahim gave 100 points to Karim
          </p>

          <span className="text-gray-400 text-sm">
            5 minutes ago
          </span>
        </div>

        <div>
          <p className="text-white">
            Founder promoted Nafis to Admin
          </p>

          <span className="text-gray-400 text-sm">
            30 minutes ago
          </span>
        </div>

        <div>
          <p className="text-white">
            Solo Leveling Episode 3 approved
          </p>

          <span className="text-gray-400 text-sm">
            Today
          </span>
        </div>

      </div>

    </div>
  );
}

export default RecentActivities;