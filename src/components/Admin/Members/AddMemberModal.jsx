import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  UserPlus,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import Button from "../../UI/Button";
import initialPendingUsers from "../../../data/pendingUsers";

function AddMemberModal({
  open,
  onClose,
  onApprove,
}) {
  const [lovId, setLovId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [role, setRole] = useState("Member");

  const handleSearch = () => {
    setNotFound(false);
    const saved = JSON.parse(localStorage.getItem("pendingUsers") || "[]");
    const allPending = [...saved, ...initialPendingUsers];
    const query = lovId.trim().toLowerCase();

    const user = allPending.find(
      (u) =>
        (u.lovId && u.lovId.toLowerCase() === query) ||
        (u.email && u.email.toLowerCase() === query) ||
        (u.username && u.username.toLowerCase() === query)
    );

    if (user) {
      setSelectedUser(user);
    } else {
      setSelectedUser(null);
      setNotFound(true);
    }
  };

  const handleApprove = () => {
    if (!selectedUser) return;

    onApprove({
      id: Date.now(),

      lovId: selectedUser.lovId,
      fullName: selectedUser.fullName,
      username: selectedUser.username,
      email: selectedUser.email,
      emailVerified: selectedUser.emailVerified !== false,
      avatar: selectedUser.avatar || selectedUser.profilePicture || "",

      role: role,
      department: selectedUser.appliedRole || "Voice Actor",

      points: 0,
      status: "Active",
    });

    setLovId("");
    setSelectedUser(null);
    setRole("Member");

    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
            }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-cyan-500/20 bg-slate-900 p-8"
          >
            <div className="mb-8 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                <UserPlus className="text-cyan-400" />
                Add Member by Unique LOV ID
              </h2>

              <button onClick={onClose}>
                <X className="text-white" />
              </button>
            </div>

            {/* Search */}
            <div className="flex gap-3">
              <input
                value={lovId}
                onChange={(e) => setLovId(e.target.value)}
                placeholder="Enter LOV ID (e.g. LOV-000001) or Email..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />

              <Button onClick={handleSearch}>
                <Search size={18} />
              </Button>
            </div>

            {notFound && (
              <p className="mt-4 text-sm text-red-400 flex items-center gap-2">
                <AlertCircle size={16} />
                No pending user found with that LOV ID or Email. Try LOV-000001.
              </p>
            )}

            {/* User */}
            {selectedUser && (
              <div className="mt-8 space-y-5 rounded-2xl border border-slate-700 bg-slate-800 p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">
                      {selectedUser.fullName}
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold">
                      {selectedUser.lovId}
                    </span>
                  </div>

                  <p className="text-gray-400">
                    @{selectedUser.username}
                  </p>

                  <p className="text-gray-300 mt-2 flex items-center gap-2 text-sm">
                    {selectedUser.email}
                    {selectedUser.emailVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/15 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 size={13} />
                        Verified Email
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/15 px-2.5 py-0.5 rounded-full">
                        Unverified Email
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-gray-400 text-sm">
                    Select Role
                  </label>

                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
                  >
                    <option>Member</option>
                    <option>Voice Actor</option>
                    <option>Translator</option>
                    <option>Editor</option>
                    <option>Admin</option>
                  </select>
                </div>

                <Button
                  className="w-full"
                  onClick={handleApprove}
                >
                  Approve Member
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AddMemberModal;