import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, User, CheckCircle2 } from "lucide-react";
import { saveMembers } from "../../../hooks/useMembers";

import MemberActions from "./MemberActions";
import MemberModal from "./MemberModal";
import EditMemberModal from "./EditMemberModal";
import GivePointsModal from "./GivePointsModal";
import RemovePointsModal from "./RemovePointsModal";
import SuspendMemberModal from "./SuspendMemberModal";
import DeleteMemberModal from "./DeleteMemberModal";

function MemberRow({
  member,
  index,
  setMembers,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [givePointsOpen, setGivePointsOpen] = useState(false);
  const [removePointsOpen, setRemovePointsOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Update Member
  const handleUpdateMember = (updatedMember) => {
    setMembers((prev) => {
      const updated = prev.map((m) =>
        m.id === updatedMember.id
          ? updatedMember
          : m
      );
      saveMembers(updated);
      return updated;
    });
  };

  // Delete Member
  const handleDeleteMember = (id) => {
    setMembers((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      saveMembers(updated);
      return updated;
    });
  };

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="border-t border-slate-800 hover:bg-slate-800/60 transition"
      >
        {/* Member */}
        <td className="px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-500/40 overflow-hidden shrink-0 shadow-md">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-cyan-500 text-white font-bold text-lg">
                  {member.fullName ? member.fullName.charAt(0).toUpperCase() : <User size={20} />}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-white">
                {member.fullName}
              </h3>

              <p className="text-sm text-gray-400">
                @{member.username}
              </p>
            </div>
          </div>
        </td>

        {/* LOV ID */}
        <td className="px-6">
          <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 font-mono text-xs font-bold text-cyan-300">
            {member.lovId || `LOV-10000${member.id}`}
          </span>
        </td>

        {/* Verified Email */}
        <td className="px-6 text-sm text-gray-300">
          <div className="flex items-center gap-1.5">
            <span>{member.email || `${member.username}@gmail.com`}</span>
            {member.emailVerified !== false && (
              <CheckCircle2
                size={15}
                className="text-green-400 shrink-0"
                title="Verified Real Email"
              />
            )}
          </div>
        </td>

        {/* Role */}
        <td className="px-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-300">
            <Shield size={16} />
            {member.role}
          </span>
        </td>

        {/* Department */}
        <td className="px-6 text-gray-300">
          {member.department}
        </td>

        {/* Points */}
        <td className="px-6">
          <span className="font-bold text-yellow-400">
            {member.points}
          </span>
        </td>

        {/* Status */}
        <td className="px-6">
          <span
            className={`rounded-full px-3 py-1 text-sm ${
              member.status === "Active"
                ? "bg-green-500/20 text-green-400"
                : member.status === "Suspended"
                ? "bg-red-500/20 text-red-400"
                : "bg-gray-500/20 text-gray-400"
            }`}
          >
            {member.status}
          </span>
        </td>

        {/* Actions */}
        <td className="px-6 text-center">
          <MemberActions
            member={member}
            onView={() => setProfileOpen(true)}
            onEdit={() => setEditOpen(true)}
            onGivePoints={() => setGivePointsOpen(true)}
            onRemovePoints={() => setRemovePointsOpen(true)}
            onSuspend={() => setSuspendOpen(true)}
            onDelete={() => setDeleteOpen(true)}
          />
        </td>
      </motion.tr>

      {/* Profile */}
      <MemberModal
        open={profileOpen}
        member={member}
        onClose={() => setProfileOpen(false)}
      />

      {/* Edit */}
      <EditMemberModal
        open={editOpen}
        member={member}
        onClose={() => setEditOpen(false)}
        onSave={handleUpdateMember}
      />

      {/* Give Points */}
      <GivePointsModal
        open={givePointsOpen}
        member={member}
        onClose={() => setGivePointsOpen(false)}
        onSave={handleUpdateMember}
      />

      {/* Remove Points */}
      <RemovePointsModal
        open={removePointsOpen}
        member={member}
        onClose={() => setRemovePointsOpen(false)}
        onSave={handleUpdateMember}
      />

      {/* Suspend / Restore */}
      <SuspendMemberModal
        open={suspendOpen}
        member={member}
        onClose={() => setSuspendOpen(false)}
        onSave={handleUpdateMember}
      />

      {/* Delete */}
      <DeleteMemberModal
        open={deleteOpen}
        member={member}
        onClose={() => setDeleteOpen(false)}
        onDelete={handleDeleteMember}
      />
    </>
  );
}

export default MemberRow;