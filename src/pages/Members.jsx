import { useState, useMemo } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import MemberHeader from "../components/Admin/Members/MemberHeader";
import MemberSearch from "../components/Admin/Members/MemberSearch";
import MemberFilters from "../components/Admin/Members/MemberFilters";
import MemberTable from "../components/Admin/Members/MemberTable";
import MemberPagination from "../components/Admin/Members/MemberPagination";
import AddMemberModal from "../components/Admin/Members/AddMemberModal";

import { useMembers } from "../hooks/useMembers";

function Members() {
  const { members, setMembers, addMember } = useMembers();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All Roles");
  const [status, setStatus] = useState("All Status");
  const [sort, setSort] = useState("Sort By");

  const [currentPage, setCurrentPage] = useState(1);

  const [addMemberOpen, setAddMemberOpen] = useState(false);

  // Compute filtered count to drive accurate pagination
  const filteredMembers = useMemo(() => {
    let result = [...members];

    if (search.trim() !== "") {
      const keyword = search.toLowerCase().trim();
      result = result.filter(
        (m) =>
          (m.fullName && m.fullName.toLowerCase().includes(keyword)) ||
          (m.username && m.username.toLowerCase().includes(keyword)) ||
          (m.role && m.role.toLowerCase().includes(keyword)) ||
          (m.lovId && m.lovId.toLowerCase().includes(keyword)) ||
          (m.email && m.email.toLowerCase().includes(keyword))
      );
    }

    if (role !== "All Roles") {
      result = result.filter((m) => m.role === role);
    }

    if (status !== "All Status") {
      result = result.filter((m) => m.status === status);
    }

    return result;
  }, [members, search, role, status]);

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / itemsPerPage));

  // Reset to page 1 if current page becomes out of bounds
  const validCurrentPage = Math.min(currentPage, totalPages);

  // Approve / Add Member
  const handleApproveMember = (newMember) => {
    addMember(newMember);
    setAddMemberOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <MemberHeader onAddMember={() => setAddMemberOpen(true)} />

        <div className="flex flex-col gap-5 lg:flex-row">
          <MemberSearch
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
          />

          <MemberFilters
            role={role}
            status={status}
            sort={sort}
            onRoleChange={(val) => {
              setRole(val);
              setCurrentPage(1);
            }}
            onStatusChange={(val) => {
              setStatus(val);
              setCurrentPage(1);
            }}
            onSortChange={setSort}
          />
        </div>

        <MemberTable
          members={members}
          setMembers={setMembers}
          search={search}
          role={role}
          status={status}
          sort={sort}
          currentPage={validCurrentPage}
        />

        <MemberPagination
          currentPage={validCurrentPage}
          totalPages={totalPages}
          totalCount={filteredMembers.length}
          onPageChange={setCurrentPage}
        />
      </div>

      <AddMemberModal
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        onApprove={handleApproveMember}
      />
    </DashboardLayout>
  );
}

export default Members;