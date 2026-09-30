import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

import ApproveUserModal from "./ApproveUserModal";
import RejectUserModal from "./RejectUserModal";
import PendingProfileModal from "./PendingProfileModal";

function PendingActions({
  user,
  pendingUsers,
  setPendingUsers,
  members,
  setMembers,
}) {
  const [open, setOpen] = useState(false);

  const [approveOpen, setApproveOpen] =
    useState(false);

  const [rejectOpen, setRejectOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // Approve User
  const handleApprove = (data) => {
    setMembers((prev) => [
      {
        id: Date.now(),

        lovId: user.lovId,
        fullName: user.fullName,
        username: user.username,
        email: user.email,

        role: data.role,
        department: data.department,

        points: 0,
        status: "Active",
      },

      ...prev,
    ]);

    setPendingUsers((prev) =>
      prev.filter((u) => u.id !== user.id)
    );

    setApproveOpen(false);
  };

  // Reject User
  // Reject User
const handleReject = (data) => {
  console.log("Rejected User:", user.fullName);
  console.log("Reason:", data.reason);
  console.log("Admin Note:", data.note);

  // Later backend/API call এখানেই হবে

  setPendingUsers((prev) =>
    prev.filter((u) => u.id !== user.id)
  );

  setRejectOpen(false);
};
  const menuItems = [
    {
      label: "View Profile",
      icon: Eye,
      color: "text-cyan-400",
    },
    {
      label: "Approve User",
      icon: CheckCircle,
      color: "text-green-400",
    },
    {
      label: "Reject User",
      icon: XCircle,
      color: "text-red-400",
    },
  ];

  const handleAction = (label) => {
    switch (label) {
      case "View Profile":
        setProfileOpen(true);
        break;

      case "Approve User":
        setApproveOpen(true);
        break;

      case "Reject User":
        setRejectOpen(true);
        break;

      default:
        break;
    }

    setOpen(false);
  };

  return (
    <>
      <div
        ref={menuRef}
        className="relative inline-block"
      >
        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl p-2 hover:bg-slate-700 transition"
        >
          <MoreVertical className="text-white" />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              transition={{
                duration: 0.15,
              }}
              className="absolute right-0 top-full z-[9999] mt-2 w-56 overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-900 shadow-2xl"
            >
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    onClick={() =>
                      handleAction(item.label)
                    }
                    className="flex w-full items-center gap-3 px-4 py-3 hover:bg-slate-800 transition"
                  >
                    <Icon
                      size={18}
                      className={item.color}
                    />

                    <span className="text-white">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ApproveUserModal
        open={approveOpen}
        user={user}
        onClose={() =>
          setApproveOpen(false)
        }
        onApprove={handleApprove}
      />

      <RejectUserModal
        open={rejectOpen}
        user={user}
        onClose={() =>
          setRejectOpen(false)
        }
        onReject={handleReject}
      />

      <PendingProfileModal
        open={profileOpen}
        user={user}
        onClose={() =>
          setProfileOpen(false)
        }
      />
    </>
  );
}

export default PendingActions;