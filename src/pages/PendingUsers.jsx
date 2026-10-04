import { useEffect, useState, useMemo } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import PendingHeader from "../components/Admin/PendingUsers/PendingHeader";
import PendingSearch from "../components/Admin/PendingUsers/PendingSearch";
import PendingFilters from "../components/Admin/PendingUsers/PendingFilters";
import PendingTable from "../components/Admin/PendingUsers/PendingTable";
import PendingPagination from "../components/Admin/PendingUsers/PendingPagination";

import { useMembers } from "../hooks/useMembers";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const DUMMY_PENDING_EMAILS = ["tanvir@gmail.com", "arafat@gmail.com", "sakib@gmail.com"];
const DUMMY_PENDING_IDS = ["101", "102", "103", "lov-000001", "lov-000002", "lov-000003"];
const DUMMY_PENDING_NAMES = ["tanvir hasan", "arafat islam", "sakib ahmed"];

function isRealPendingUser(user) {
  if (!user) return false;
  const idMatch = user.id != null && DUMMY_PENDING_IDS.includes(String(user.id).toLowerCase());
  const lovMatch = user.lovId && DUMMY_PENDING_IDS.includes(user.lovId.toLowerCase());
  const emailMatch = user.email && DUMMY_PENDING_EMAILS.includes(user.email.toLowerCase());
  const nameMatch = user.fullName && DUMMY_PENDING_NAMES.includes(user.fullName.toLowerCase());
  return !(idMatch || lovMatch || emailMatch || nameMatch);
}

function loadCleanPending() {
  try {
    localStorage.removeItem("pendingUsers");
    const saved = localStorage.getItem("lov_pending_users_v2");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed.filter(isRealPendingUser);
    }
  } catch {
    // ignore
  }
  return [];
}

function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState(() => loadCleanPending());

  const { members, setMembers } = useMembers();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCloudApplicants = async (isMountedRef = { current: true }) => {
    if (!isSupabaseConfigured()) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .or("role.eq.Pending,role.eq.pending,is_approved.eq.false");

      if (!error && Array.isArray(data) && isMountedRef.current) {
        const mapped = data.map((p) => ({
          id: p.id,
          lovId: p.lov_id || `LOV-PENDING-${String(p.id).slice(0, 4)}`,
          fullName: p.full_name || p.username || "Applicant",
          username: p.username || "applicant",
          email: p.email || "",
          emailVerified: p.email_verified ?? true,
          appliedRole: p.department || (p.role !== "Pending" && p.role !== "pending" ? p.role : "Voice Actor"),
          role: p.role || "Pending",
          status: "Pending",
          joinedAt: p.created_at ? new Date(p.created_at).toLocaleDateString("en-GB") : "Recent",
          avatar: p.avatar_url || "",
          bio: p.bio || "",
        }));

        setPendingUsers((prev) => {
          const merged = [...mapped];
          for (const loc of prev) {
            if (
              !merged.some(
                (m) =>
                  (m.email && loc.email && m.email.toLowerCase() === loc.email.toLowerCase()) ||
                  (m.lovId && loc.lovId && m.lovId === loc.lovId) ||
                  (m.id && loc.id && String(m.id) === String(loc.id))
              )
            ) {
              merged.push(loc);
            }
          }
          const cleanResult = merged.filter(isRealPendingUser);
          try {
            localStorage.setItem("lov_pending_users_v2", JSON.stringify(cleanResult));
          } catch {}
          return cleanResult;
        });
      }
    } catch {
      // ignore
    }
  };

  const handleRefresh = () => {
    const clean = loadCleanPending();
    setPendingUsers(clean);
    fetchCloudApplicants({ current: true });
  };

  useEffect(() => {
    const isMountedRef = { current: true };
    fetchCloudApplicants(isMountedRef);

    const handleSync = () => {
      const clean = loadCleanPending();
      setPendingUsers(clean);
      fetchCloudApplicants(isMountedRef);
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("lov-pending-updated", handleSync);
    return () => {
      isMountedRef.current = false;
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("lov-pending-updated", handleSync);
    };
  }, []);

  const filteredUsers = useMemo(() => {
    let result = [...pendingUsers];

    if (search.trim() !== "") {
      const keyword = search.toLowerCase();
      result = result.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(keyword) ||
          user.username?.toLowerCase().includes(keyword) ||
          user.email?.toLowerCase().includes(keyword) ||
          (user.lovId && user.lovId.toLowerCase().includes(keyword))
      );
    }

    return result;
  }, [pendingUsers, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / 10));
  const validCurrentPage = Math.min(currentPage, totalPages);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <PendingHeader onRefresh={handleRefresh} />

        <div className="flex flex-col gap-5 lg:flex-row">
          <PendingSearch
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
          />

          <PendingFilters
            sort={sort}
            onSortChange={(val) => {
              setSort(val);
              setCurrentPage(1);
            }}
          />
        </div>

        <PendingTable
          pendingUsers={pendingUsers}
          setPendingUsers={setPendingUsers}
          members={members}
          setMembers={setMembers}
          search={search}
          sort={sort}
          currentPage={validCurrentPage}
        />

        <PendingPagination
          currentPage={validCurrentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </DashboardLayout>
  );
}

export default PendingUsers;