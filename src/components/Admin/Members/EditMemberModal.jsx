import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Save } from "lucide-react";
import Button from "../../UI/Button";

function EditMemberModal({
  open,
  member,
  onClose,
  onSave,
}) {
  if (!member) return null;

  const [formData, setFormData] = useState(() => ({
    fullName: member.fullName,
    username: member.username,
    role: member.role,
    department: member.department,
    status: member.status,
    points: member.points,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "points" ? Number(value) : value,
    }));
  };

  const handleSave = () => {
  const updatedMember = {
    ...member,
    ...formData,
    points: Number(formData.points),
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
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
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 30,
            }}
            transition={{
              duration: 0.25,
            }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-cyan-500/20 bg-slate-900 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 p-6">
              <h2 className="text-2xl font-bold text-white">
                Edit Member
              </h2>

              <button
                onClick={onClose}
                className="rounded-xl p-2 hover:bg-slate-800"
              >
                <X className="text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="grid grid-cols-2 gap-5 p-8">
              <div>
                <label className="text-gray-400">
                  Full Name
                </label>

                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400">
                  Username
                </label>

                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400">
                  Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                >
                  <option>Founder</option>
                  <option>Admin</option>
                  <option>Voice Actor</option>
                  <option>Editor</option>
                  <option>Translator</option>
                  <option>Member</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400">
                  Department
                </label>

                <input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Suspended</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400">
                  Points
                </label>

                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 border-t border-slate-800 p-6">
              <Button
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default EditMemberModal;