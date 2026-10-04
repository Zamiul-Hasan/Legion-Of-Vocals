import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

import ApproveUserModal from "./ApproveUserModal";
import RejectUserModal from "./RejectUserModal";
import PendingProfileModal from "./PendingProfileModal";
import { loadMembers, saveMembers } from "../../../hooks/useMembers";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";

function PendingActions({
  user,
  pendingUsers,
  setPendingUsers,
  members,
  setMembers,
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 170;
      const menuWidth = 224; // 14rem = 224px
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < menuHeight && rect.top > menuHeight;

      const top = openUp ? rect.top - menuHeight - 6 : rect.bottom + 6;
      const left = Math.max(
        12,
        Math.min(window.innerWidth - menuWidth - 12, rect.right - menuWidth)
      );

      setCoords({ top, left });
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    const handleDismiss = () => setOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleDismiss, true);
    window.addEventListener("resize", handleDismiss);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleDismiss, true);
      window.removeEventListener("resize", handleDismiss);
    };
  }, [open]);

  // Approve User
  const handleApprove = (data) => {
    const currentMembers = loadMembers();
    const newMember = {
      id: user.id || Date.now(),
      lovId: user.lovId,
      fullName: user.fullName,
      displayName: user.fullName,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified !== false,
      avatar: user.avatar || user.profilePicture || "",
      password: user.password,
      role: data.role || "Member",
      department: data.department || user.appliedRole || "Voice Actor",
      points: 0,
      status: "Active",
      joined: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      joinedAt: new Date().toISOString().split("T")[0],
    };

    const updatedMembers = [
      newMember,
      ...currentMembers.filter((m) => m.lovId !== user.lovId),
    ];
    saveMembers(updatedMembers);
    if (setMembers) setMembers(updatedMembers);

    setPendingUsers((prev) => {
      const updated = prev.filter(
        (u) => u.id !== user.id && u.lovId !== user.lovId
      );
      localStorage.setItem("lov_pending_users_v2", JSON.stringify(updated));
      window.dispatchEvent(new Event("lov-pending-updated"));
      return updated;
    });

    if (isSupabaseConfigured()) {
      const updates = {
        role: data.role || "Member",
        is_approved: true,
        department: data.department || user.appliedRole || "Voice Actor",
        updated_at: new Date().toISOString(),
      };
      if (user.id && typeof user.id === "string" && user.id.includes("-")) {
        supabase.from("profiles").update(updates).eq("id", user.id).then();
      } else if (user.email) {
        supabase.from("profiles").update(updates).eq("email", user.email).then();
      } else if (user.lovId) {
        supabase.from("profiles").update(updates).eq("lov_id", user.lovId).then();
      }
    }

    setApproveOpen(false);
  };

  // Reject User
  const handleReject = (data) => {
    setPendingUsers((prev) => {
      const updated = prev.filter(
        (u) => u.id !== user.id && u.lovId !== user.lovId
      );
      localStorage.setItem("lov_pending_users_v2", JSON.stringify(updated));
      window.dispatchEvent(new Event("lov-pending-updated"));
      return updated;
    });

    if (isSupabaseConfigured()) {
      const updates = {
        role: "Rejected",
        is_approved: false,
        updated_at: new Date().toISOString(),
      };
      if (user.id && typeof user.id === "string" && user.id.includes("-")) {
        supabase.from("profiles").update(updates).eq("id", user.id).then();
      } else if (user.email) {
        supabase.from("profiles").update(updates).eq("email", user.email).then();
      } else if (user.lovId) {
        supabase.from("profiles").update(updates).eq("lov_id", user.lovId).then();
      }
    }

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
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className="rounded-xl p-2 text-gray-300 hover:text-cyan-400 hover:bg-slate-800 transition cursor-pointer"
        aria-label="Pending User Actions"
      >
        <MoreVertical size={18} />
      </button>

      {open &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={menuRef}
              initial={{
                opacity: 0,
                scale: 0.95,
                y: -6,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: -6,
              }}
              transition={{
                duration: 0.15,
              }}
              style={{
                position: "fixed",
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                zIndex: 99999,
              }}
              className="w-56 overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-900/98 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl"
            >
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleAction(item.label)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-slate-800/90 text-sm transition cursor-pointer text-left"
                  >
                    <Icon
                      size={17}
                      className={item.color}
                    />

                    <span className="text-gray-100 font-medium">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>,
          document.body
        )}

      <ApproveUserModal
        open={approveOpen}
        user={user}
        onClose={() => setApproveOpen(false)}
        onApprove={handleApprove}
      />

      <RejectUserModal
        open={rejectOpen}
        user={user}
        onClose={() => setRejectOpen(false)}
        onReject={handleReject}
      />

      <PendingProfileModal
        open={profileOpen}
        user={user}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
}

export default PendingActions;