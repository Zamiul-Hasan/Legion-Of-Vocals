import AdminStats from "./AdminStats";
import PendingApprovals from "./PendingApprovals";
import RecentActivities from "./RecentActivities";
import QuickActions from "./QuickActions";

function AdminOverview() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Admin Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Welcome back, Founder 👑
        </p>
      </div>

      <AdminStats />

      <div className="grid xl:grid-cols-2 gap-8">
        <PendingApprovals />
        <RecentActivities />
      </div>

      <QuickActions />

    </div>
  );
}

export default AdminOverview;