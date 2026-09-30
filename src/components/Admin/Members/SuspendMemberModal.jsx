import { AnimatePresence, motion } from "framer-motion";
import { ShieldBan, X } from "lucide-react";
import Button from "../../UI/Button";

function SuspendMemberModal({
  open,
  member,
  onClose,
  onSave,
}) {
  if (!member) return null;

  const isSuspended =
    member.status === "Suspended";

  const handleSubmit = () => {
    const updatedMember = {
      ...member,
      status: isSuspended
        ? "Active"
        : "Suspended",
    };

    onSave(updatedMember);
    onClose();
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
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-cyan-500/20 bg-slate-900 p-8"
          >
            <div className="flex items-center justify-between">

              <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                <ShieldBan className="text-red-400" />
                {isSuspended
                  ? "Restore Member"
                  : "Suspend Member"}
              </h2>

              <button onClick={onClose}>
                <X className="text-white" />
              </button>

            </div>

            <div className="mt-8">

              <p className="text-gray-300">
                {isSuspended ? (
                  <>
                    Restore{" "}
                    <span className="font-bold text-white">
                      {member.fullName}
                    </span>
                    ?
                  </>
                ) : (
                  <>
                    Suspend{" "}
                    <span className="font-bold text-white">
                      {member.fullName}
                    </span>
                    ?
                  </>
                )}
              </p>

              <p className="mt-3 text-sm text-gray-500">
                {isSuspended
                  ? "This member will regain access."
                  : "The member will lose access until restored."}
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
                onClick={handleSubmit}
                className={
                  isSuspended
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }
              >
                {isSuspended
                  ? "Restore"
                  : "Suspend"}
              </Button>

            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SuspendMemberModal;