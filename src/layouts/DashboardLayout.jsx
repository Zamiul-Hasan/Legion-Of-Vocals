import { useLocation } from "react-router-dom";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import AdminSidebar from "../components/Admin/AdminSidebar";
import DashboardTopbar from "../components/Dashboard/DashboardTopbar";

export default function DashboardLayout({ children, role = "member" }) {
  const location = useLocation();
  const isAdminRoute = role === "admin" || location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-slate-950 flex text-white">
      {isAdminRoute ? <AdminSidebar /> : <DashboardSidebar role={role} />}

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}