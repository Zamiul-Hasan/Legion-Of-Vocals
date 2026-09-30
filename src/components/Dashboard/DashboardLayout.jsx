import { useLocation } from "react-router-dom";

import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import AdminSidebar from "../components/Admin/AdminSidebar";
import DashboardTopbar from "../components/Dashboard/DashboardTopbar";

function DashboardLayout({ children }) {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* Sidebar */}
      {isAdmin ? <AdminSidebar /> : <DashboardSidebar />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <DashboardTopbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;