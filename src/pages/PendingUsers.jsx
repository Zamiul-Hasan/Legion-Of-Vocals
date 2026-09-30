import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import PendingHeader from "../components/Admin/PendingUsers/PendingHeader";
import PendingSearch from "../components/Admin/PendingUsers/PendingSearch";
import PendingFilters from "../components/Admin/PendingUsers/PendingFilters";
import PendingTable from "../components/Admin/PendingUsers/PendingTable";
import PendingPagination from "../components/Admin/PendingUsers/PendingPagination";

import memberList from "../data/memberList";
import initialPendingUsers from "../data/pendingUsers";

function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState(() => {
    const saved = localStorage.getItem("pendingUsers");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed : initialPendingUsers;
    }
    return initialPendingUsers;
  });
  const [members, setMembers] = useState(memberList);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Newest");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem(
      "pendingUsers",
      JSON.stringify(pendingUsers)
    );
  }, [pendingUsers]);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <PendingHeader />

        <div className="flex flex-col gap-5 lg:flex-row">
          <PendingSearch
            value={search}
            onChange={setSearch}
          />

          <PendingFilters
            sort={sort}
            onSortChange={setSort}
          />
        </div>

        <PendingTable
          pendingUsers={pendingUsers}
          setPendingUsers={setPendingUsers}
          members={members}
          setMembers={setMembers}
          search={search}
          sort={sort}
          currentPage={currentPage}
        />

        <PendingPagination
          currentPage={currentPage}
          totalPages={Math.max(
            1,
            Math.ceil(pendingUsers.length / 10)
          )}
          onPageChange={setCurrentPage}
        />
      </div>
    </DashboardLayout>
  );
}

export default PendingUsers;