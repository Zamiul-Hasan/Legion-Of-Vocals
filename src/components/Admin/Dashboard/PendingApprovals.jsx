import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock } from "lucide-react";
import { useDubVideos } from "../../../hooks/useDubVideos";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";

const DUMMY_PENDING_EMAILS = ["tanvir@gmail.com", "arafat@gmail.com", "sakib@gmail.com"];
const DUMMY_PENDING_IDS = ["101", "102", "103", "lov-000001", "lov-000002", "lov-000003"];
const DUMMY_PENDING_NAMES = ["tanvir hasan", "arafat islam", "sakib ahmed"];

function isRealPendingUser(user) {
  if (!user) return false;
  const idMatch = user.id != null && DUMMY_PENDING_IDS.includes(String(user.id).toLowerCase());
  const lovMatch = user.lovId && DUMMY_PENDING_IDS.includes(String(user.lovId).toLowerCase());
  const emailMatch = user.email && DUMMY_PENDING_EMAILS.includes(String(user.email).toLowerCase());
  const nameMatch = user.fullName && DUMMY_PENDING_NAMES.includes(String(user.fullName).toLowerCase());
  return !(idMatch || lovMatch || emailMatch || nameMatch);
}

function loadCleanPendingUsers() {
  try {
    localStorage.removeItem("pendingUsers");
    const saved = localStorage.getItem("lov_pending_users_v2");
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    const clean = parsed.filter(isRealPendingUser);
    if (clean.length !== parsed.length) {
      localStorage.setItem("lov_pending_users_v2", JSON.stringify(clean));
    }
    return clean;
  } catch {
    return [];
  }
}

function PendingApprovals() {
  const [pendingUsers, setPendingUsers] = useState(() => loadCleanPendingUsers());

  const { videos } = useDubVideos();
  const pendingVideos = videos.filter((v) => v.status === "Pending Review");

  useEffect(() => {
    let isMounted = true;

    const fetchPendingFromCloud = async () => {
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .or("role.eq.Pending,role.eq.pending,is_approved.eq.false");

          if (!error && Array.isArray(data) && isMounted) {
            const mapped = data.map((p) => ({
              id: p.id,
              lovId: p.lov_id,
              fullName: p.full_name,
              username: p.username,
              email: p.email,
              appliedRole: p.department || p.role || "Member Application",
              status: "Pending",
              joinedAt: p.created_at ? new Date(p.created_at).toLocaleDateString("en-GB") : "Recent",
              avatar: p.avatar_url,
              bio: p.bio,
            }));

            const localClean = loadCleanPendingUsers();
            const merged = [...mapped];
            for (const loc of localClean) {
              if (
                !merged.some(
                  (m) =>
                    (m.email && loc.email && m.email.toLowerCase() === loc.email.toLowerCase()) ||
                    (m.lovId && loc.lovId && m.lovId === loc.lovId)
                )
              ) {
                merged.push(loc);
              }
            }
            setPendingUsers(merged.filter(isRealPendingUser));
          }
        } catch {
          // ignore
        }
      }
    };

    fetchPendingFromCloud();

    const handleSync = () => {
      setPendingUsers(loadCleanPendingUsers());
      fetchPendingFromCloud();
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("lov-pending-updated", handleSync);
    return () => {
      isMounted = false;
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("lov-pending-updated", handleSync);
    };
  }, []);

  const totalPending = pendingUsers.length + pendingVideos.length;

  return (
    <div className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-white">
              Pending Approvals
            </h2>
            {totalPending > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono">
                {totalPending}
              </span>
            )}
          </div>
          <Link
            to="/admin/pending-users"
            className="text-sm text-cyan-400 hover:underline font-medium"
          >
            View All →
          </Link>
        </div>

        {totalPending === 0 ? (
          <div className="py-10 text-center text-gray-400 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3 text-cyan-400">
              <CheckCircle2 size={24} />
            </div>
            <p className="font-semibold text-white">All Caught Up!</p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              No pending registration applications or dub submissions waiting for review.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingUsers.slice(0, 3).map((user) => (
              <div
                key={user.id || user.lovId}
                className="flex justify-between items-center bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 hover:border-cyan-500/30 transition"
              >
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    {user.fullName} — {user.appliedRole || "Member Application"}
                  </h3>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {user.lovId || user.email} • {user.status || "Pending"}
                  </p>
                </div>

                <Link
                  to="/admin/pending-users"
                  className="bg-cyan-500 hover:bg-cyan-400 px-3.5 py-1.5 rounded-lg text-slate-950 font-semibold text-xs transition"
                >
                  Review
                </Link>
              </div>
            ))}

            {pendingVideos.slice(0, 2).map((vid) => (
              <div
                key={vid.id}
                className="flex justify-between items-center bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 hover:border-cyan-500/30 transition"
              >
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    {vid.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Dub Video Submission • Pending Review
                  </p>
                </div>

                <Link
                  to="/my-dub-videos"
                  className="bg-cyan-500 hover:bg-cyan-400 px-3.5 py-1.5 rounded-lg text-slate-950 font-semibold text-xs transition"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingApprovals;