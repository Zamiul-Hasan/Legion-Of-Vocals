import { useEffect, useRef, useState } from "react";
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
            className="absolute right-0 top-full mt-2 z-[9999] w-56 overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-900 shadow-2xl"
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
  );
}

export default MemberActions;