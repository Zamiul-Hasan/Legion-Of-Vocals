import DashboardLayout from "../layouts/DashboardLayout";
import AdminOverview from "../components/Admin/Dashboard/AdminOverview";

function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <AdminOverview />
    </DashboardLayout>
  );
}

export default AdminDashboard;