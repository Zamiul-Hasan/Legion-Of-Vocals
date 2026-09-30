import { motion } from "framer-motion";
import { User } from "lucide-react";

import PendingActions from "./PendingActions";

function PendingRow({
  user,
  index,
  pendingUsers,
  setPendingUsers,
  members,
  setMembers,
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-t border-slate-800 hover:bg-slate-800/60 transition"
    >
      {/* User */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500">
            <User
              size={20}
              className="text-white"
            />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {user.fullName}
            </h3>

            <p className="text-sm text-gray-400">
              @{user.username}
            </p>
          </div>

        </div>
      </td>

      {/* LOV ID */}
      <td className="px-6">
        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-300">
          {user.lovId}
        </span>
      </td>

      {/* Email */}
      <td className="px-6 text-gray-300">
        <div className="flex items-center gap-2">
          <span>{user.email}</span>
          {user.emailVerified ? (
            <span className="rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-semibold text-green-400">
              ✓ Verified
            </span>
          ) : (
            <span className="rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-xs font-semibold text-yellow-400">
              Unverified
            </span>
          )}
        </div>
      </td>

      {/* Joined */}
      <td className="px-6 text-gray-300">
        {user.joinedAt}
      </td>

      {/* Actions */}
      <td className="px-6 text-center">
        <PendingActions
          user={user}
          pendingUsers={pendingUsers}
          setPendingUsers={setPendingUsers}
          members={members}
          setMembers={setMembers}
        />
      </td>

    </motion.tr>
  );
}

export default PendingRow;