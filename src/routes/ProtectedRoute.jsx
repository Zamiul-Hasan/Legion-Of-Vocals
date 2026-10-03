import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { ShieldAlert, LogIn, Lock, ArrowLeft } from "lucide-react";
import useAuth from "../hooks/useAuth";
import LoginModal from "../components/Auth/LoginModal";

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectAdminToAdminDashboard = false,
}) {
  const { user, isAuthenticated, isAdmin, isFounder } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  // If user is Admin/Founder and navigating to member dashboard, redirect them to unified /admin
  if (redirectAdminToAdminDashboard && (isAdmin || isFounder)) {
    return <Navigate to="/admin" replace />;
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-cyan-500/30 p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center mb-5">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            {requireAdmin
              ? "You must be signed in with an authorized Founder or Admin account to access the Administration Panel."
              : "Please sign in to your Legion of Vocals account to view this section."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 py-3 px-4 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800 text-gray-300 font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Return Home
            </Link>
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <LogIn size={16} />
              Sign In
            </button>
          </div>
        </div>

        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      </div>
    );
  }

  // Logged in, but trying to access admin panel without admin privileges
  if (requireAdmin && !isAdmin && !isFounder) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-red-500/30 p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center mb-5">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            403 - Access Denied
          </h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Only verified Legion of Vocals Founders and Administrators are authorized to access this section. Your current account role is{" "}
            <strong className="text-cyan-400 capitalize">{user?.role || "Member"}</strong>.
          </p>

          <Link
            to="/dashboard"
            className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition inline-flex items-center justify-center gap-2"
          >
            Go to Member Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
