import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreVertical,
  Eye,
  Pencil,
  PlusCircle,
  MinusCircle,
  ShieldBan,
  Trash2,
} from "lucide-react";

function MemberActions({
  member,
  onView,
  onEdit,
  onGivePoints,
  onRemovePoints,
  onSuspend,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 280;
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

  const menuItems = [
    {
      label: "View Profile",
      icon: Eye,
      color: "text-cyan-400",
    },
    {
      label: "Edit Member",
      icon: Pencil,
      color: "text-yellow-400",
    },
    {
      label: "Give Points",
      icon: PlusCircle,
      color: "text-green-400",
    },
    {
      label: "Remove Points",
      icon: MinusCircle,
      color: "text-orange-400",
    },
    {
      label:
        member.status === "Suspended"
          ? "Restore Member"
          : "Suspend Member",
      icon: ShieldBan,
      color:
        member.status === "Suspended"
          ? "text-green-400"
          : "text-red-400",
    },
    {
      label: "Delete Member",
      icon: Trash2,
      color: "text-red-500",
    },
  ];

  const handleAction = (label) => {
    switch (label) {
      case "View Profile":
        onView(member);
        break;

      case "Edit Member":
        onEdit(member);
        break;

      case "Give Points":
        onGivePoints(member);
        break;

      case "Remove Points":
        onRemovePoints(member);
        break;

      case "Suspend Member":
      case "Restore Member":
        onSuspend(member);
        break;

      case "Delete Member":
        onDelete(member);
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
        aria-label="Member Actions"
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
    </>
  );
}

export default MemberActions;