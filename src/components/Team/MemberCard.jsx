import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Trophy,
  FolderKanban,
  Fingerprint,
  Camera,
  MessageCircle,
} from "lucide-react";
import ProfilePictureModal from "../Profile/ProfilePictureModal";
import { useMembers, isMemberOwner } from "../../hooks/useMembers";
import { openChatWithMember } from "../../hooks/useMessenger";

function MemberCard({ member }) {
  const { currentUser, updateMemberAvatar } = useMembers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isOwner = isMemberOwner(currentUser, member);

  return (
    <>
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-3xl bg-slate-900 border border-cyan-500/20 hover:border-cyan-400 transition duration-300"
    >
      {/* Cover */}
      <div className="relative h-40">
        <img
          src={member.cover}
          alt={member.displayName}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        {/* Unique LOV ID Badge on Cover */}
        {member.lovId && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold">
            <Fingerprint size={13} />
            {member.lovId}
          </span>
        )}
      </div>

      {/* Avatar with Facebook-style Camera Button (Only for owner) */}
      <div className="relative flex justify-center">
        <div className="relative -mt-14 group">
          <img
            src={member.avatar}
            alt={member.displayName}
            onClick={isOwner ? () => setIsModalOpen(true) : undefined}
            className={`w-28 h-28 rounded-full border-4 border-cyan-400 object-cover bg-slate-900 ${
              isOwner ? "cursor-pointer" : ""
            }`}
            title={isOwner ? "Click to update profile picture" : member.displayName}
          />
          {isOwner && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              title="Update Profile Picture"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-900 hover:bg-cyan-500 text-white hover:text-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-lg transition cursor-pointer"
            >
              <Camera size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="px-6 pb-8 text-center">
        <div className="flex justify-center items-center gap-2 mt-4">
          <h2 className="text-2xl font-bold text-white">
            {member.displayName}
          </h2>

          {member.status === "Verified" && (
            <BadgeCheck
              size={22}
              className="text-cyan-400"
            />
          )}
        </div>

        <p className="text-gray-400 mt-1 text-sm">
          @{member.username}
          {member.lovId && (
            <span className="text-cyan-400 font-mono ml-2">
              • {member.lovId}
            </span>
          )}
        </p>

        <div className="mt-5 flex justify-center gap-3 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm border border-cyan-500/30">
            {member.role}
          </span>

          <span className="px-3 py-1 rounded-full bg-slate-800 text-gray-300 text-sm border border-slate-700">
            {member.department}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div>
            <FolderKanban
              size={20}
              className="mx-auto text-cyan-400"
            />

            <p className="text-white font-bold mt-2">
              {member.stats.projects}
            </p>

            <p className="text-xs text-gray-400">
              Projects
            </p>
          </div>

          <div>
            <Trophy
              size={20}
              className="mx-auto text-yellow-400"
            />

            <p className="text-white font-bold mt-2">
              {member.stats.points}
            </p>

            <p className="text-xs text-gray-400">
              Points
            </p>
          </div>

          <div>
            <span className="text-xl">⭐</span>

            <p className="text-white font-bold mt-2">
              Lv.{member.level}
            </p>

            <p className="text-xs text-gray-400">
              Level
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Link to={`/team/${member.username}`} className="block">
            <button
              type="button"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition font-semibold text-sm text-slate-950 cursor-pointer"
            >
              View Profile
            </button>
          </Link>

          <button
            type="button"
            onClick={() => openChatWithMember(member.username)}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 hover:border-cyan-400 transition font-semibold text-sm text-cyan-300 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle size={16} />
            Message
          </button>
        </div>
      </div>
    </motion.div>

    {isOwner && (
      <ProfilePictureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        member={member}
        onSave={(newAvatar, options) =>
          updateMemberAvatar(member.id || member.username, newAvatar, options)
        }
      />
    )}
    </>
  );
}

export default MemberCard;