import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XCircle, X } from "lucide-react";

import Button from "../../UI/Button";

function RejectUserModal({
  open,
  onClose,
  onReject,
  user,
}) {
  const [reason, setReason] = useState(
    "Incomplete Information"
  );

  const [note, setNote] = useState("");

  const handleReject = () => {
    onReject({
      reason,
      note,
    });

    setReason("Incomplete Information");
    setNote("");
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
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-red-500/20 bg-slate-900 p-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                <XCircle className="text-red-400" />
                Reject User
              </h2>

              <button onClick={onClose}>
                <X className="text-white" />
              </button>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-800 p-5">
              <h3 className="text-xl font-bold text-white">
                {user.fullName}
              </h3>

              <p className="text-gray-400">
                @{user.username}
              </p>
            </div>

            <div className="mt-6">
              <label className="text-gray-300">
                Reject Reason
              </label>

              <select
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
              >
                <option>
                  Incomplete Information
                </option>

                <option>
                  Invalid Documents
                </option>

                <option>
                  Fake Account
                </option>

                <option>
                  Duplicate Registration
                </option>

                <option>Other</option>
              </select>
            </div>

            <div className="mt-5">
              <label className="text-gray-300">
                Admin Note
              </label>

              <textarea
                rows={4}
                value={note}
                onChange={(e) =>
                  setNote(e.target.value)
                }
                placeholder="Write additional reason..."
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
              />
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>

              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleReject}
              >
                Reject User
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default RejectUserModal;