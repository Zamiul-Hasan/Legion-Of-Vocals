import { AnimatePresence, motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import Button from "../../UI/Button";

function DeleteMemberModal({
  open,
  member,
  onClose,
  onDelete,
}) {
  if (!open || !member) return null;

  return (
    <AnimatePresence>
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
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.25 }}
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-red-500/20 bg-slate-900 p-8 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
              <Trash2 className="text-red-500" />
              Delete Member
            </h2>

            <button
              onClick={onClose}
              className="rounded-xl p-2 hover:bg-slate-800"
            >
              <X className="text-white" />
            </button>
          </div>

          <div className="mt-6">
            <p className="text-gray-300">
              Are you sure you want to delete
            </p>

            <h3 className="mt-2 text-xl font-bold text-red-400">
              {member.fullName}
            </h3>

            <p className="mt-4 text-sm text-red-300">
              This action cannot be undone.
            </p>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              onClick={() => onDelete(member.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}

export default DeleteMemberModal;