import { motion } from "framer-motion";
import PendingRow from "./PendingRow";

function PendingTable({
  pendingUsers,
  setPendingUsers,
  members,
  setMembers,
  search,
  sort,
  currentPage,
}) {
  let filteredUsers = [...pendingUsers];

  // Search
  if (search.trim() !== "") {
    const keyword = search.toLowerCase();

    filteredUsers = filteredUsers.filter(
      (user) =>
        user.fullName.toLowerCase().includes(keyword) ||
        user.username.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.lovId.toLowerCase().includes(keyword)
    );
  }

  // Sorting
  switch (sort) {
    case "Newest":
      filteredUsers.sort((a, b) => b.id - a.id);
      break;

    case "Oldest":
      filteredUsers.sort((a, b) => a.id - b.id);
      break;

    case "Name (A-Z)":
      filteredUsers.sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
      );
      break;

    case "Name (Z-A)":
      filteredUsers.sort((a, b) =>
        b.fullName.localeCompare(a.fullName)
      );
      break;

    default:
      break;
  }

  // Pagination
  const usersPerPage = 10;

  const startIndex =
    (currentPage - 1) * usersPerPage;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
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

              <th className="px-6 py-4">
                User
              </th>

              <th className="px-6 py-4">
                LOV ID
              </th>

              <th className="px-6 py-4">
                Email
              </th>

              <th className="px-6 py-4">
                Joined
              </th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user, index) => (
                <PendingRow
                  key={user.id}
                  user={user}
                  index={index}
                  pendingUsers={pendingUsers}
                  setPendingUsers={setPendingUsers}
                  members={members}
                  setMembers={setMembers}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-gray-400"
                >
                  No Pending Users Found.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>
    </motion.div>
  );
}

export default PendingTable;