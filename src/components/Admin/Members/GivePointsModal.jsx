import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Star } from "lucide-react";
import Button from "../../UI/Button";

function GivePointsModal({
  open,
  onClose,
  member,
  onSave,
}) {
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("");

  if (!member) return null;

  const handleSubmit = () => {
    const updatedMember = {
      ...member,
      points:
        Number(member.points) +
        Number(points),
    };

    onSave(updatedMember);

    setPoints("");
    setReason("");

    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-cyan-500/20 bg-slate-900 p-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                <Star className="text-yellow-400" />
                Give Points
              </h2>

              <button onClick={onClose}>
                <X className="text-white" />
              </button>
            </div>

            <div className="mt-8 space-y-5">
              <div>
                <label className="text-gray-400">
                  Member
                </label>

                <p className="text-lg text-white">
                  {member.fullName}
                </p>
              </div>

              <div>
                <label className="text-gray-400">
                  Points
                </label>

                <input
                  type="number"
                  value={points}
                  onChange={(e) =>
                    setPoints(e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400">
                  Reason
                </label>

                <textarea
                  rows="4"
                  value={reason}
                  onChange={(e) =>
                    setReason(e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                />
              </div>

              <Button
                className="w-full"
                onClick={handleSubmit}
              >
                Give Points
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default GivePointsModal;