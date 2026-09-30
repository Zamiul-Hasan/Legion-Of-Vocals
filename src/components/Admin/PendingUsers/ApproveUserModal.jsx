import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  X,
  Shield,
  Building2,
} from "lucide-react";

import Button from "../../UI/Button";

function ApproveUserModal({
  open,
  onClose,
  onApprove,
  user,
}) {
  const [role, setRole] = useState("Member");
  const [department, setDepartment] =
    useState("General");

  const handleApprove = () => {
    onApprove({
      role,
      department,
    });

    setRole("Member");
    setDepartment("General");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}

          <motion.div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}

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
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-cyan-500/20 bg-slate-900 p-8 shadow-2xl"
          >
            {/* Header */}

            <div className="flex items-center justify-between">

              <h2 className="flex items-center gap-2 text-2xl font-bold text-white">

                <CheckCircle className="text-green-400" />

                Approve User

              </h2>

              <button
                onClick={onClose}
                className="rounded-xl p-2 hover:bg-slate-800"
              >
                <X className="text-white" />
              </button>

            </div>

            {/* User */}

            <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-800 p-5">

              <h3 className="text-xl font-bold text-white">
                {user.fullName}
              </h3>

              <p className="text-gray-400">
                @{user.username}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {user.email}
              </p>

            </div>

            {/* Role */}

            <div className="mt-6">

              <label className="mb-2 flex items-center gap-2 text-gray-300">

                <Shield size={18} />

                Role

              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
              >
                <option>Member</option>
                <option>Voice Actor</option>
                <option>Translator</option>
                <option>Editor</option>
                <option>Moderator</option>
                <option>Admin</option>
              </select>

            </div>

            {/* Department */}

            <div className="mt-5">

              <label className="mb-2 flex items-center gap-2 text-gray-300">

                <Building2 size={18} />

                Department

              </label>

              <select
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
              >
                <option>General</option>
                <option>Voice Team</option>
                <option>Translation Team</option>
                <option>Editing Team</option>
                <option>Quality Control</option>
                <option>Management</option>
              </select>

            </div>

            {/* Buttons */}

            <div className="mt-8 flex gap-4">

              <Button
                variant="secondary"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>

              <Button
                className="flex-1"
                onClick={handleApprove}
              >
                Approve User
              </Button>

            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ApproveUserModal;