import DashboardLayout from "../layouts/DashboardLayout";
import DashboardOverview from "../components/Dashboard/DashboardOverview";

function Dashboard() {
  return (
    <DashboardLayout role="member">
      <DashboardOverview />
    </DashboardLayout>
  );
}

export default Dashboard;