import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Mail,
  User,
  Mic,
  BadgeCheck,
} from "lucide-react";

function PendingProfileModal({
  open,
  onClose,
  user,
}) {
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
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-cyan-500/20 bg-slate-900 p-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Pending User Profile
              </h2>

              <button onClick={onClose}>
                <X className="text-white" />
              </button>
            </div>

            <div className="mt-8 flex gap-6">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-cyan-500 bg-slate-800 flex items-center justify-center shrink-0 shadow-xl">
                {user.avatar || user.profilePicture ? (
                  <img
                    src={user.avatar || user.profilePicture}
                    alt={user.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white">
                  {user.fullName}
                </h2>

                <p className="text-gray-400">
                  @{user.username}
                </p>

                <div className="mt-4 space-y-2">

                  <p className="flex items-center gap-2 text-gray-300">
                    <Mail size={18}/>
                    {user.email}
                  </p>

                  <p className="flex items-center gap-2 text-gray-300">
                    <User size={18}/>
                    {user.appliedRole}
                  </p>

                  <p className="text-gray-300">
                    Discord : {user.discord}
                  </p>

                  <p className="text-gray-300">
                    Joined : {user.joinedAt}
                  </p>

                  {user.emailVerified && (
                    <div className="flex items-center gap-2 text-green-400">
                      <BadgeCheck size={18}/>
                      Email Verified
                    </div>
                  )}

                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-800 p-5">
              <h3 className="font-semibold text-white">
                Bio
              </h3>

              <p className="mt-2 text-gray-300">
                {user.bio}
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-800 p-5">

              <h3 className="flex items-center gap-2 text-white font-semibold">
                <Mic size={18}/>
                Voice Sample
              </h3>

              <audio
                controls
                className="mt-4 w-full"
              >
                <source
                  src={user.voiceSample}
                />
              </audio>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default PendingProfileModal;