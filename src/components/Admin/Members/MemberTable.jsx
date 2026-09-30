import { motion } from "framer-motion";
import MemberRow from "./MemberRow";

function MemberTable({
  members,
  setMembers,
  search,
  role,
  status,
  sort,
  currentPage,
}) {
  let filteredMembers = [...members];

  // Search by Name, Username, Role, LOV ID, or Email
  if (search.trim() !== "") {
    const keyword = search.toLowerCase().trim();

    filteredMembers = filteredMembers.filter(
      (member) =>
        member.fullName.toLowerCase().includes(keyword) ||
        member.username.toLowerCase().includes(keyword) ||
        member.role.toLowerCase().includes(keyword) ||
        (member.lovId && member.lovId.toLowerCase().includes(keyword)) ||
        (member.email && member.email.toLowerCase().includes(keyword))
    );
  }

  // Role Filter
  if (role !== "All Roles") {
    filteredMembers = filteredMembers.filter(
      (member) => member.role === role
    );
  }

  // Status Filter
  if (status !== "All Status") {
    filteredMembers = filteredMembers.filter(
      (member) => member.status === status
    );
  }

  // Sorting
  switch (sort) {
    case "Most Points":
      filteredMembers.sort((a, b) => b.points - a.points);
      break;

    case "Least Points":
      filteredMembers.sort((a, b) => a.points - b.points);
      break;

    case "Name (A-Z)":
      filteredMembers.sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
      );
      break;

    case "Name (Z-A)":
      filteredMembers.sort((a, b) =>
        b.fullName.localeCompare(a.fullName)
      );
      break;

    case "Newest":
      filteredMembers.sort((a, b) => b.id - a.id);
      break;

    case "Oldest":
      filteredMembers.sort((a, b) => a.id - b.id);
      break;

    default:
      break;
  }

  // Pagination
  const membersPerPage = 10;
  const startIndex = (currentPage - 1) * membersPerPage;
  const paginatedMembers = filteredMembers.slice(
    startIndex,
    startIndex + membersPerPage
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-cyan-500/20 bg-slate-900"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr className="text-left text-gray-300">
              <th className="px-6 py-4">Member</th>
              <th className="px-6 py-4">LOV ID</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Points</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedMembers.length > 0 ? (
              paginatedMembers.map((member, index) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  index={index}
                  members={members}
                  setMembers={setMembers}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-10 text-center text-gray-400"
                >
                  No members found matching your LOV ID or search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default MemberTable;