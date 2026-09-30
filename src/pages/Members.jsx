import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import MemberHeader from "../components/Admin/Members/MemberHeader";
import MemberSearch from "../components/Admin/Members/MemberSearch";
import MemberFilters from "../components/Admin/Members/MemberFilters";
import MemberTable from "../components/Admin/Members/MemberTable";
import MemberPagination from "../components/Admin/Members/MemberPagination";
import AddMemberModal from "../components/Admin/Members/AddMemberModal";

import memberList from "../data/memberList";

function Members() {
  const [members, setMembers] = useState(memberList);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All Roles");
  const [status, setStatus] = useState("All Status");
  const [sort, setSort] = useState("Sort By");

  const [currentPage, setCurrentPage] = useState(1);

  const [addMemberOpen, setAddMemberOpen] =
    useState(false);

  // Approve Member
  const handleApproveMember = (newMember) => {
    setMembers((prev) => [
      newMember,
      ...prev,
    ]);

    setAddMemberOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <MemberHeader
          onAddMember={() =>
            setAddMemberOpen(true)
          }
        />

        <div className="flex flex-col gap-5 lg:flex-row">

          <MemberSearch
            value={search}
            onChange={setSearch}
          />

          <MemberFilters
            role={role}
            status={status}
            sort={sort}
            onRoleChange={setRole}
            onStatusChange={setStatus}
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
          currentPage={currentPage}
        />

        <MemberPagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />

      </div>

      <AddMemberModal
        open={addMemberOpen}
        onClose={() =>
          setAddMemberOpen(false)
        }
        onApprove={handleApproveMember}
      />

    </DashboardLayout>
  );
}

export default Members;