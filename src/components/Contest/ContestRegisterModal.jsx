import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Trophy,
  UserCheck,
  Globe,
  Hash,
  Upload,
  CheckCircle2,
  Sparkles,
  ImagePlus,
  Trash2,
} from "lucide-react";
import { useMembers } from "../../hooks/useMembers";
import { extractHashtags } from "../../hooks/useContests";

const SUGGESTED_TAGS = [
  "#lov_contest_round1",
  "#lov_contest_round2",
  "#lov_contest_finale",
  "#lov_corporation",
  "#bangla_anime_dub",
  "#legion_of_vocals",
];

function ContestRegisterModal({
  isOpen,
  onClose,
  contest,
  activeRound,
  onSubmitEntry,
}) {
  const { members, currentUser } = useMembers();

  const [participantType, setParticipantType] = useState("Outsider"); // "LOV Member" | "Outsider"
  const [selectedMemberUsername, setSelectedMemberUsername] = useState(
    currentUser?.username || "zamiul"
  );
  const [roundId, setRoundId] = useState(activeRound?.id || "round-1");
  const [participantName, setParticipantName] = useState("");
  const [lovId, setLovId] = useState("");
  const [email, setEmail] = useState("");
  const [socialLink, setSocialLink] = useState(
    "https://www.facebook.com/share/g/19MxBAkZsX/"
  );
  const [roleCategory, setRoleCategory] = useState("Voice Actor (Challenger)");
  const [characterAndAnime, setCharacterAndAnime] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [caption, setCaption] = useState("");
  const [submittedEntry, setSubmittedEntry] = useState(null);

  const selectedRoundObj =
    contest?.rounds?.find((r) => r.id === roundId) ||
    activeRound ||
    contest?.rounds?.[0];

  const officialRoundTag =
    selectedRoundObj?.hashtag ||
    contest?.officialHashtag ||
    "#lov_contest_round1";

  useEffect(() => {
    if (!isOpen) return;
    setSubmittedEntry(null);
    setUploadedImages([]);
    setImageUrlInput("");
    const nextRoundId = activeRound?.id || contest?.rounds?.[0]?.id || "round-1";
    setRoundId(nextRoundId);
    const defaultTag =
      activeRound?.hashtag || contest?.officialHashtag || "#lov_contest_round1";
    setCaption(
      `Excited to compete in the ${
        contest?.title || "LOV Contest"
      }! Here is my Bangla dub performance 🔥🎙️ ${defaultTag} #lov_corporation #bangla_anime_dub`
    );
  }, [isOpen, activeRound, contest]);

  useEffect(() => {
    if (participantType === "LOV Member") {
      const m =
        members.find((item) => item.username === selectedMemberUsername) ||
        currentUser;
      if (m) {
        setParticipantName(m.fullName || m.displayName);
        setLovId(m.lovId || `LOV-2026-00${m.id}`);
        setEmail(m.email || "");
        setRoleCategory(m.role || "LOV Voice Actor");
      }
    } else {
      setParticipantName("");
      setLovId("");
      setEmail("");
      setRoleCategory("Challenger (Outsider)");
    }
  }, [participantType, selectedMemberUsername, members, currentUser]);

  if (!isOpen || !contest) return null;

  const handleInsertTag = (tag) => {
    if (caption.toLowerCase().includes(tag.toLowerCase())) return;
    setCaption((prev) => `${prev.trim()} ${tag}`);
  };

  const handleVideoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
  };

  const handleImagesFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setUploadedImages((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleAddImageUrl = () => {
    const clean = imageUrlInput.trim();
    if (!clean) return;
    setUploadedImages((prev) => [...prev, clean]);
    setImageUrlInput("");
  };

  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetMainCover = (indexToPromote) => {
    setUploadedImages((prev) => {
      const chosen = prev[indexToPromote];
      const rest = prev.filter((_, idx) => idx !== indexToPromote);
      return [chosen, ...rest];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!participantName.trim() || !characterAndAnime.trim()) return;

    const memberObj =
      participantType === "LOV Member"
        ? members.find((item) => item.username === selectedMemberUsername)
        : null;

    const created = onSubmitEntry(contest.id, {
      roundId,
      participantType,
      participantName: participantName.trim(),
      lovId: participantType === "LOV Member" ? lovId : null,
      email: email.trim(),
      socialLink: socialLink.trim(),
      roleCategory,
      avatar: memberObj?.avatar || "",
      characterAndAnime: characterAndAnime.trim(),
      videoUrl: videoUrl.trim(),
      images: uploadedImages,
      caption: caption.trim(),
    });

    setSubmittedEntry(created);
  };

  const liveTags = extractHashtags(caption, officialRoundTag);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 bg-slate-950 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Trophy size={22} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Contest Registration & Submission
                </h3>
                <p className="text-xs text-cyan-400">
                  Open to both LOV Studio Members & Outsider Challengers
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 text-gray-400 hover:text-white border border-slate-800 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {submittedEntry ? (
            <div className="p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={34} />
              </div>
              <h4 className="text-2xl font-black text-white">
                You&apos;re Officially Registered! 🎉
              </h4>
              <p className="text-gray-300 text-sm max-w-md mx-auto">
                Your entry for{" "}
                <span className="text-cyan-400 font-bold">
                  {selectedRoundObj?.title}
                </span>{" "}
                is now live on the contest feed with your Facebook-style tags.
              </p>

              <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 max-w-md mx-auto space-y-2 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Contestant Pass ID:</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {submittedEntry.contestantCode}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Competitor Type:</span>
                  <span className="font-bold text-white">
                    {submittedEntry.participantType}
                    {submittedEntry.lovId ? ` (${submittedEntry.lovId})` : ""}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Official Round Tag:</span>
                  <span className="font-bold text-[#4599FF]">
                    {officialRoundTag}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-3">
                <a
                  href="https://www.facebook.com/share/g/19MxBAkZsX/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white text-sm font-bold transition"
                >
                  <span className="w-5 h-5 rounded bg-white text-[#1877F2] flex items-center justify-center font-black text-xs">
                    f
                  </span>
                  Also Post in LOV CORPORATION FB Group
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition cursor-pointer"
                >
                  View My Entry in Contest Feed
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 max-h-[80vh] overflow-y-auto"
            >
              {/* Competitor Type Selector: LOV Member vs Outsider */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  1. Select Competitor Type
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setParticipantType("Outsider")}
                    className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                      participantType === "Outsider"
                        ? "bg-cyan-500/15 border-cyan-400 text-white"
                        : "bg-slate-950 border-slate-800 text-gray-400 hover:border-slate-700"
                    }`}
                  >
                    <Globe
                      size={20}
                      className={
                        participantType === "Outsider"
                          ? "text-cyan-400 shrink-0 mt-0.5"
                          : "text-gray-500 shrink-0 mt-0.5"
                      }
                    />
                    <div>
                      <p className="font-bold text-sm text-white">
                        Outsider / Public Challenger
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Not a member yet? Register freely and compete!
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setParticipantType("LOV Member")}
                    className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                      participantType === "LOV Member"
                        ? "bg-cyan-500/15 border-cyan-400 text-white"
                        : "bg-slate-950 border-slate-800 text-gray-400 hover:border-slate-700"
                    }`}
                  >
                    <UserCheck
                      size={20}
                      className={
                        participantType === "LOV Member"
                          ? "text-cyan-400 shrink-0 mt-0.5"
                          : "text-gray-500 shrink-0 mt-0.5"
                      }
                    />
                    <div>
                      <p className="font-bold text-sm text-white">
                        Official LOV Studio Member
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Compete with your verified LOV Member ID
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Round Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  2. Select Contest Round
                </label>
                <select
                  value={roundId}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    setRoundId(nextId);
                    const rObj = contest.rounds?.find((r) => r.id === nextId);
                    if (rObj?.hashtag) {
                      handleInsertTag(rObj.hashtag);
                    }
                  }}
                  className="w-full rounded-xl bg-slate-950 border border-cyan-500/30 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                >
                  {(contest.rounds || []).map((r) => (
                    <option key={r.id} value={r.id}>
                      Round {r.roundNumber}: {r.title} ({r.hashtag}) — [
                      {r.status}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Participant Details */}
              {participantType === "LOV Member" ? (
                <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">
                      Select Your LOV Member Profile
                    </label>
                    <select
                      value={selectedMemberUsername}
                      onChange={(e) => setSelectedMemberUsername(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                    >
                      {members.map((m) => (
                        <option key={m.id} value={m.username}>
                          {m.fullName} ({m.lovId || `LOV-2026-00${m.id}`})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">
                      Verified LOV Member ID
                    </label>
                    <input
                      type="text"
                      value={lovId}
                      onChange={(e) => setLovId(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm font-mono text-cyan-400 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
                  <div>
                    <label className="block text-xs text-gray-300 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={participantName}
                      onChange={(e) => setParticipantName(e.target.value)}
                      placeholder="e.g. Farhan Sakib"
                      className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@gmail.com"
                      className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1.5">
                      Category / Talent Role
                    </label>
                    <select
                      value={roleCategory}
                      onChange={(e) => setRoleCategory(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                    >
                      <option>Challenger (Outsider) — Voice Actor</option>
                      <option>Challenger (Outsider) — Vocalist / Singer</option>
                      <option>Challenger (Outsider) — Audio/SFX Mixing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1.5">
                      Facebook Profile / Post Link
                    </label>
                    <input
                      type="url"
                      value={socialLink}
                      onChange={(e) => setSocialLink(e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}

              {/* Performance Info & Video Upload */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Character & Anime Scene *
                  </label>
                  <input
                    type="text"
                    required
                    value={characterAndAnime}
                    onChange={(e) => setCharacterAndAnime(e.target.value)}
                    placeholder="e.g. Eren Yeager — Attack on Titan"
                    className="w-full rounded-xl bg-slate-950 border border-cyan-500/25 px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Video / Clip URL or Upload MP4
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Paste YouTube/FB video link or upload"
                      className="flex-1 rounded-xl bg-slate-950 border border-cyan-500/25 px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                    <label className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0">
                      <Upload size={14} />
                      File
                      <input
                        type="file"
                        accept="video/*,audio/*"
                        onChange={handleVideoFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Contestant Image Upload Section (Multiple Photos / Posters / Studio Shots) */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/25 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-white flex items-center gap-2">
                    <ImagePlus size={16} className="text-cyan-400" />
                    Upload Contest Images / Scene Posters / Studio Photos (Optional)
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {uploadedImages.length} image{uploadedImages.length === 1 ? "" : "s"} attached
                  </span>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/40 text-xs font-bold transition cursor-pointer shrink-0">
                    <ImagePlus size={15} />
                    + Upload Images from Device
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex flex-1 gap-2">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Or paste an image URL..."
                      className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 transition cursor-pointer shrink-0"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Uploaded Images Preview Grid */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {uploadedImages.map((imgSrc, idx) => (
                      <div
                        key={idx}
                        className={`relative group rounded-xl overflow-hidden border h-24 bg-slate-900 ${
                          idx === 0
                            ? "border-2 border-cyan-400"
                            : "border-slate-700"
                        }`}
                      >
                        <img
                          src={imgSrc}
                          alt={`Upload ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 ? (
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-cyan-500 text-slate-950 text-[10px] font-black">
                            Main Cover
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetMainCover(idx)}
                            className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-950/85 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-[10px] font-bold transition cursor-pointer"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-500/85 hover:bg-red-500 text-white transition cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Caption + Facebook-style Hashtag System */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Hash size={14} className="text-[#4599FF]" />
                    Submission Caption & Facebook Hashtags *
                  </label>
                  <span className="text-[11px] text-cyan-400">
                    Required Round Tag:{" "}
                    <strong className="font-mono">{officialRoundTag}</strong>
                  </span>
                </div>

                <textarea
                  rows={3}
                  required
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={`Write your caption and include ${officialRoundTag}...`}
                  className="w-full rounded-2xl bg-slate-950 border border-cyan-500/30 p-3.5 text-sm text-white outline-none focus:border-cyan-400"
                />

                {/* Quick Clickable Facebook Hashtag Chips */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-gray-400 mr-1">
                    Click to add tag:
                  </span>
                  {SUGGESTED_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleInsertTag(tag)}
                      className="px-2.5 py-1 rounded-lg bg-[#1877F2]/15 hover:bg-[#1877F2]/30 border border-[#1877F2]/40 text-[#65A9FF] text-xs font-mono font-semibold transition cursor-pointer"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>

                {/* Live Extracted Facebook Hashtag Preview */}
                <div className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-gray-400">
                    Active Facebook Tags on your post:
                  </span>
                  {liveTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-[#1877F2]/20 text-[#4599FF] text-xs font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-gray-300 text-sm font-semibold hover:bg-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 transition cursor-pointer"
                >
                  <Sparkles size={16} />
                  Register & Publish Entry
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ContestRegisterModal;
