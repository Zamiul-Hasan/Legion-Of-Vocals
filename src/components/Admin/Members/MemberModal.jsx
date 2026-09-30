import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Shield,
  Star,
  Building2,
  Fingerprint,
  Mail,
  CheckCircle2,
} from "lucide-react";

function MemberModal({ open, onClose, member }) {
  return (
    <AnimatePresence>
      {open && member && (
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
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.25 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-cyan-500/20 bg-slate-900 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 p-6">
              <h2 className="text-2xl font-bold text-white">
                Member Profile
              </h2>

              <button
                onClick={onClose}
                className="rounded-xl p-2 hover:bg-slate-800"
              >
                <X className="text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-cyan-500 flex items-center justify-center text-3xl font-bold text-white shrink-0">
                  {member.fullName?.charAt(0)}
                </div>

                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-3xl font-bold text-white">
                      {member.fullName}
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 font-mono text-xs font-bold text-cyan-400">
                      {member.lovId || `LOV-10000${member.id}`}
                    </span>
                  </div>

                  <p className="text-cyan-400 mt-1">
                    @{member.username}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-2xl bg-slate-800 p-4">
                  <div className="flex items-center gap-2 text-cyan-400 text-sm">
                    <Fingerprint size={18} />
                    Unique LOV ID
                  </div>

                  <p className="mt-2 font-mono font-bold text-white">
                    {member.lovId || `LOV-10000${member.id}`}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-800 p-4">
                  <div className="flex items-center gap-2 text-cyan-400 text-sm">
                    <Mail size={18} />
                    Verified Email
                  </div>

                  <p className="mt-2 text-white text-sm flex items-center gap-1.5">
                    {member.email || `${member.username}@gmail.com`}
                    {member.emailVerified !== false && (
                      <CheckCircle2 size={15} className="text-green-400" />
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-800 p-4">
                  <div className="flex items-center gap-2 text-cyan-400 text-sm">
                    <Shield size={18} />
                    Role
                  </div>

                  <p className="mt-2 text-white">
                    {member.role}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-800 p-4">
                  <div className="flex items-center gap-2 text-cyan-400 text-sm">
                    <Building2 size={18} />
                    Department
                  </div>

                  <p className="mt-2 text-white">
                    {member.department}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-800 p-4">
                  <div className="flex items-center gap-2 text-yellow-400 text-sm">
                    <Star size={18} />
                    Points
                  </div>

                  <p className="mt-2 text-2xl font-bold text-yellow-400">
                    {member.points}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-800 p-4">
                  <div className="text-cyan-400 text-sm">
                    Status
                  </div>

                  <p className="mt-2 text-white">
                    {member.status}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MemberModal;