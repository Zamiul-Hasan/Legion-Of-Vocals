import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ShieldCheck,
  Award,
  Camera,
  ImagePlus,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import BackButton from "../UI/BackButton";
import ProfilePictureModal from "../Profile/ProfilePictureModal";
import { useMembers, isMemberOwner } from "../../hooks/useMembers";
import { openChatWithMember } from "../../hooks/useMessenger";

function ProfileBanner({ member }) {
  const { currentUser, updateMemberAvatar, updateMemberCover } = useMembers();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const coverInputRef = useRef(null);

  const isOwner = isMemberOwner(currentUser, member);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const handleSaveAvatar = (newAvatarDataUrl, options) => {
    updateMemberAvatar(member.id || member.username, newAvatarDataUrl, options);
    showToast("Profile picture updated!");
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateMemberCover(member.id || member.username, reader.result);
        showToast("Cover photo updated!");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="relative min-h-[540px] flex items-end overflow-hidden pt-28">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-900 border border-cyan-500/40 text-cyan-300 text-sm shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Cover Photo */}
      <img
        src={member.cover}
        alt={member.displayName}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

      {/* Top Bar: Back Button + Facebook-Style Edit Cover Photo (Only for Owner) */}
      <div className="absolute top-28 inset-x-0 z-20">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <BackButton label="Back to Team" fallback="/team" variant="glass" />

          {isOwner && (
            <div>
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/85 hover:bg-slate-800 text-white border border-slate-700 hover:border-cyan-400 backdrop-blur-md text-xs sm:text-sm font-semibold shadow-lg transition cursor-pointer"
              >
                <ImagePlus size={16} className="text-cyan-400" />
                <span>Edit Cover Photo</span>
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Header Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto w-full px-6 pb-14 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row items-center md:items-end gap-8"
          >
            {/* Interactive Avatar with Camera Button (Only editable by owner) */}
            <div className="relative group shrink-0">
              <div
                onClick={isOwner ? () => setIsAvatarModalOpen(true) : undefined}
                className={`relative w-44 h-44 rounded-full border-4 border-cyan-400 overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.35)] bg-slate-900 ${
                  isOwner ? "cursor-pointer" : ""
                }`}
                title={isOwner ? "Click to update profile picture" : member.displayName}
              >
                <img
                  src={member.avatar}
                  alt={member.displayName}
                  className={`w-full h-full object-cover ${
                    isOwner ? "group-hover:scale-105 transition duration-300" : ""
                  }`}
                />

                {/* Hover Overlay like Facebook (Only for owner) */}
                {isOwner && (
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white">
                    <Camera size={24} className="text-cyan-400 mb-1" />
                    <span className="text-xs font-bold">Update Photo</span>
                  </div>
                )}
              </div>

              {/* Studio Frame Badge if set */}
              {member.avatarFrame && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-0.5 rounded-full bg-slate-950 border border-cyan-400 text-[11px] font-bold text-cyan-300 shadow-lg">
                  {member.avatarFrame}
                </div>
              )}

              {/* Circular Camera Badge (Only for owner) */}
              {isOwner && (
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  aria-label="Update profile picture"
                  title="Update Profile Picture"
                  className="absolute bottom-2 right-2 w-11 h-11 rounded-full bg-slate-900 hover:bg-cyan-500 text-white hover:text-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-xl transition cursor-pointer"
                >
                  <Camera size={20} />
                </button>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-black text-white">
                {member.displayName}
              </h1>

              <p className="mt-2 text-cyan-400 text-xl font-medium">
                {member.role}
              </p>

              {member.avatarCaption && (
                <p className="mt-1.5 text-xs text-slate-300 italic">
                  "{member.avatarCaption}"
                </p>
              )}

              <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-3">
                {member.lovId && (
                  <span className="px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-400/50 text-cyan-400 font-mono font-bold text-sm">
                    ID: {member.lovId}
                  </span>
                )}

                <span className="px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm">
                  {member.department}
                </span>

                <span className="px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 flex items-center gap-2 text-sm">
                  <Award size={18} />
                  Level {member.level}
                </span>

                <span className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 flex items-center gap-2 text-sm">
                  <ShieldCheck size={18} />
                  {member.status}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-300 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-cyan-400" />
                  Joined {member.joined}
                </div>

                <div>⭐ {member.stats?.points || 0} Points</div>

                <div>🎙 {member.stats?.projects || 0} Projects</div>

                <button
                  type="button"
                  onClick={() => openChatWithMember(member.username)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition cursor-pointer"
                >
                  <MessageCircle size={17} />
                  Message {member.displayName}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Facebook-style Profile Picture Modal (Only for owner) */}
      {isOwner && (
        <ProfilePictureModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          member={member}
          onSave={handleSaveAvatar}
        />
      )}
    </section>
  );
}

export default ProfileBanner;