import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ImagePlus,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Hash,
  Layers,
  Rocket,
  Eye,
  Play,
  Square,
  AlertCircle,
} from "lucide-react";
import { CONTEST_BANNER_PRESETS } from "../../hooks/useContests";

function AdminContestModal({
  isOpen,
  onClose,
  activeContest,
  onUpdateBanner,
  onAddRound,
  onSetActiveRound,
  onDeleteRound,
  onLaunchNewContest,
  onStartRound,
  onStopRound,
  onSetRoundStatus,
}) {
  const [tab, setTab] = useState("banner"); // "banner" | "rounds" | "launch"

  // Banner & Caption State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [bannerCaption, setBannerCaption] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [status, setStatus] = useState("Live Now");
  const [showBanner, setShowBanner] = useState(true);
  const [savedNotice, setSavedNotice] = useState("");

  // Add New Round State
  const [roundTitle, setRoundTitle] = useState("");
  const [roundHashtag, setRoundHashtag] = useState("");
  const [roundDeadline, setRoundDeadline] = useState("");
  const [roundDescription, setRoundDescription] = useState("");
  const [makeRoundActive, setMakeRoundActive] = useState(false);

  // Launch Brand New Contest State
  const [newTitle, setNewTitle] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newPrize, setNewPrize] = useState("");
  const [newHashtag, setNewHashtag] = useState("#lov_contest_round1");
  const [newBanner, setNewBanner] = useState(
    CONTEST_BANNER_PRESETS[0]?.url || ""
  );

  useEffect(() => {
    if (!activeContest || !isOpen) return;
    setTitle(activeContest.title || "");
    setSubtitle(activeContest.subtitle || "");
    setBannerImage(activeContest.bannerImage || "");
    setBannerCaption(activeContest.bannerCaption || "");
    setPrizePool(activeContest.prizePool || "");
    setStatus(activeContest.status || "Live Now");
    setShowBanner(activeContest.showBanner !== false);

    const nextNum = (activeContest.rounds?.length || 0) + 1;
    setRoundTitle(`Round ${nextNum}: Knockout Stage`);
    setRoundHashtag(`#lov_contest_round${nextNum}`);
    setRoundDeadline("November 2026");
    setRoundDescription("");
    setSavedNotice("");
  }, [activeContest, isOpen]);

  if (!isOpen || !activeContest) return null;

  const handleImageUpload = (e, isForNewContest = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        if (isForNewContest) {
          setNewBanner(reader.result);
        } else {
          setBannerImage(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    onUpdateBanner(activeContest.id, {
      title: title.trim() || activeContest.title,
      subtitle: subtitle.trim() || activeContest.subtitle,
      bannerImage: bannerImage || activeContest.bannerImage,
      bannerCaption: bannerCaption.trim() || activeContest.bannerCaption,
      prizePool: prizePool.trim() || activeContest.prizePool,
      status,
      showBanner,
    });
    setSavedNotice("Contest Banner & Caption updated!");
    setTimeout(() => setSavedNotice(""), 3000);
  };

  const handleCreateRound = (e) => {
    e.preventDefault();
    if (!roundTitle.trim()) return;
    onAddRound(activeContest.id, {
      title: roundTitle.trim(),
      hashtag: roundHashtag.trim(),
      deadline: roundDeadline.trim() || "TBA",
      description: roundDescription.trim(),
      status: makeRoundActive ? "Active" : "Upcoming",
    });
    const nextNum = (activeContest.rounds?.length || 0) + 2;
    setRoundTitle(`Round ${nextNum}: Next Stage`);
    setRoundHashtag(`#lov_contest_round${nextNum}`);
    setRoundDescription("");
    setMakeRoundActive(false);
    setSavedNotice("New Round added to contest!");
    setTimeout(() => setSavedNotice(""), 3000);
  };

  const handleLaunchNew = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onLaunchNewContest({
      title: newTitle.trim(),
      bannerImage: newBanner,
      bannerCaption:
        newCaption.trim() ||
        `🔥 ${newTitle.trim()} is now LIVE! Register as an LOV Member or Outsider and tag your post with ${newHashtag}!`,
      prizePool: newPrize.trim() || "Official LOV Trophy & Studio Contract",
      officialHashtag: newHashtag.trim() || "#lov_contest_round1",
      showBanner: true,
    });
    setNewTitle("");
    setNewCaption("");
    setSavedNotice("Brand new contest launched and featured on Banner!");
    setTab("banner");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 bg-slate-950 border-b border-cyan-500/20">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Sparkles size={20} className="text-cyan-400" />
                Admin Contest Banner & Round Control Center
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Customize the contest banner, caption, multi-round system, and official Facebook hashtags
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 text-gray-400 hover:text-white border border-slate-800 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-3 gap-2">
            <button
              type="button"
              onClick={() => setTab("banner")}
              className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
                tab === "banner"
                  ? "border-cyan-400 text-cyan-400 bg-cyan-500/10"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <ImagePlus size={16} />
              Custom Banner & Caption
            </button>
            <button
              type="button"
              onClick={() => setTab("rounds")}
              className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
                tab === "rounds"
                  ? "border-cyan-400 text-cyan-400 bg-cyan-500/10"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Layers size={16} />
              Round System & Hashtags ({activeContest.rounds?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setTab("launch")}
              className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
                tab === "launch"
                  ? "border-cyan-400 text-cyan-400 bg-cyan-500/10"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Rocket size={16} />
              Launch New Contest
            </button>
          </div>

          {savedNotice && (
            <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-green-500/15 border border-green-500/30 text-green-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              {savedNotice}
            </div>
          )}

          {/* TAB 1: CUSTOM BANNER & CAPTION */}
          {tab === "banner" && (
            <form
              onSubmit={handleSaveBanner}
              className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
            >
              {/* Live Banner Preview */}
              <div className="relative h-40 rounded-2xl overflow-hidden border border-cyan-500/30">
                <img
                  src={bannerImage}
                  alt="Contest Banner Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-4 flex flex-col justify-end">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase">
                    Live Banner Preview
                  </span>
                  <h4 className="text-lg font-black text-white truncate">
                    {title}
                  </h4>
                  <p className="text-xs text-gray-300 line-clamp-1">
                    {bannerCaption}
                  </p>
                </div>
              </div>

              {/* Upload Custom Banner or Pick Preset */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">
                  Custom Banner Image (Upload File, Paste URL, or Choose Preset)
                </label>
                <div className="flex flex-wrap gap-2.5 mb-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer transition">
                    <ImagePlus size={16} />
                    Upload Custom Banner from PC
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                    />
                  </label>

                  {CONTEST_BANNER_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setBannerImage(preset.url)}
                      className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs text-gray-300 font-semibold transition cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  placeholder="Or paste custom banner image URL..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-gray-300 outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Contest Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-cyan-500/25 px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Prize Pool & Rewards
                  </label>
                  <input
                    type="text"
                    value={prizePool}
                    onChange={(e) => setPrizePool(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-cyan-500/25 px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Custom Banner Caption with Hashtags */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Custom Banner Caption (Supports Facebook-style #hashtags like{" "}
                  <span className="text-[#4599FF]">#lov_contest_round1</span>)
                </label>
                <textarea
                  rows={3}
                  value={bannerCaption}
                  onChange={(e) => setBannerCaption(e.target.value)}
                  className="w-full rounded-2xl bg-slate-950 border border-cyan-500/25 p-3.5 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <label className="flex items-center gap-2.5 text-sm text-white font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBanner}
                    onChange={(e) => setShowBanner(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400"
                  />
                  <Eye size={16} className="text-cyan-400" />
                  Display Contest Launch Banner on Home Page
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Status Badge:</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white font-bold outline-none"
                  >
                    <option>Live Now</option>
                    <option>Registration Open</option>
                    <option>Voting & Judging</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-gray-300 text-sm font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20 transition cursor-pointer"
                >
                  Save Custom Banner & Caption
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: MULTI-ROUND SYSTEM & HASHTAGS */}
          {tab === "rounds" && (
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-3">
                  Configured Contest Rounds (Click &ldquo;Set Active&rdquo; to advance the contest)
                </h4>
                <div className="space-y-3">
                  {(activeContest.rounds || []).map((round) => {
                    const isRunning = round.status === "Active";
                    const isEnded =
                      round.status === "Completed" ||
                      round.status === "Stopped" ||
                      round.status === "Ended";
                    const isUpcoming =
                      round.status === "Upcoming" || round.status === "Not Started";

                    return (
                      <div
                        key={round.id}
                        className={`p-4 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${
                          isRunning
                            ? "bg-gradient-to-r from-cyan-950/60 to-slate-900 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                            : isEnded
                            ? "bg-slate-950/80 border-red-500/30"
                            : "bg-slate-950 border-slate-800"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 text-xs font-bold">
                              Round {round.roundNumber}
                            </span>
                            <h5 className="font-bold text-white text-sm">
                              {round.title}
                            </h5>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#1877F2]/20 text-[#65A9FF] font-mono text-xs font-bold">
                              {round.hashtag}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                                isRunning
                                  ? "bg-green-500/20 text-green-300 border border-green-500/40"
                                  : isEnded
                                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              }`}
                            >
                              {isRunning
                                ? "● Active (Open)"
                                : isEnded
                                ? "✕ Stopped / Ended (Closed)"
                                : "⏳ Upcoming (Not Started)"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">
                            {round.description} • Deadline: {round.deadline}
                          </p>
                        </div>

                        {/* Admin Action Buttons: Start Round / Stop Round */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {isRunning ? (
                            <button
                              type="button"
                              onClick={() => {
                                if (onStopRound) onStopRound(activeContest.id, round.id);
                                else if (onSetRoundStatus) onSetRoundStatus(activeContest.id, round.id, "Completed");
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold transition cursor-pointer shadow-sm"
                            >
                              <Square size={13} />
                              Stop / End Round
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (onStartRound) onStartRound(activeContest.id, round.id);
                                else if (onSetRoundStatus) onSetRoundStatus(activeContest.id, round.id, "Active");
                                else if (onSetActiveRound) onSetActiveRound(activeContest.id, round.id);
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-green-500/20 hover:bg-green-500 text-green-300 hover:text-slate-950 border border-green-500/40 text-xs font-bold transition cursor-pointer shadow-sm"
                            >
                              <Play size={13} />
                              Start Round
                            </button>
                          )}

                          {/* Quick Status Select */}
                          <select
                            value={round.status || "Upcoming"}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (onSetRoundStatus) onSetRoundStatus(activeContest.id, round.id, val);
                              else if (val === "Active" && onStartRound) onStartRound(activeContest.id, round.id);
                              else if ((val === "Completed" || val === "Stopped") && onStopRound) onStopRound(activeContest.id, round.id);
                            }}
                            className="bg-slate-900 border border-slate-700 text-gray-300 text-xs font-semibold rounded-xl px-2.5 py-1.5 outline-none focus:border-cyan-400"
                          >
                            <option value="Active">Active</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Completed">Completed</option>
                          </select>

                          {(activeContest.rounds?.length || 0) > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                onDeleteRound(activeContest.id, round.id)
                              }
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/25 text-red-400 transition cursor-pointer"
                              title="Remove Round"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add a New Round Form */}
              <form
                onSubmit={handleCreateRound}
                className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/25 space-y-4"
              >
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus size={16} className="text-cyan-400" />
                  Add New Contest Round & Official Hashtag
                </h4>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Round Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={roundTitle}
                      onChange={(e) => setRoundTitle(e.target.value)}
                      placeholder="e.g. Round 4: Grand Finale"
                      className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <Hash size={12} className="text-[#4599FF]" />
                      Official Round Hashtag *
                    </label>
                    <input
                      type="text"
                      required
                      value={roundHashtag}
                      onChange={(e) => setRoundHashtag(e.target.value)}
                      placeholder="#lov_contest_round1"
                      className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono text-[#65A9FF] outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Round Deadline
                    </label>
                    <input
                      type="text"
                      value={roundDeadline}
                      onChange={(e) => setRoundDeadline(e.target.value)}
                      placeholder="e.g. Nov 15, 2026"
                      className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Round Challenge Rules / Prompt
                  </label>
                  <input
                    type="text"
                    value={roundDescription}
                    onChange={(e) => setRoundDescription(e.target.value)}
                    placeholder="Describe what members and outsiders must perform in this round..."
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={makeRoundActive}
                      onChange={(e) => setMakeRoundActive(e.target.checked)}
                      className="accent-cyan-400"
                    />
                    Immediately set this new round as ACTIVE
                  </label>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                  >
                    <Plus size={15} />
                    Add Round
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: LAUNCH BRAND NEW CONTEST */}
          {tab === "launch" && (
            <form
              onSubmit={handleLaunchNew}
              className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
            >
              <p className="text-xs text-gray-400">
                Launching a new contest will immediately feature its custom banner and caption on the Home page and Contests page.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    New Contest Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. LOV Winter Anime Dubbing Clash 2026"
                    className="w-full rounded-xl bg-slate-950 border border-cyan-500/30 px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Round 1 Official Hashtag *
                  </label>
                  <input
                    type="text"
                    required
                    value={newHashtag}
                    onChange={(e) => setNewHashtag(e.target.value)}
                    placeholder="#lov_contest_round1"
                    className="w-full rounded-xl bg-slate-950 border border-cyan-500/30 px-3.5 py-2.5 text-sm font-mono text-[#65A9FF] outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Prize Pool
                </label>
                <input
                  type="text"
                  value={newPrize}
                  onChange={(e) => setNewPrize(e.target.value)}
                  placeholder="e.g. ৳20,000 BDT + Studio Microphone + LOV Membership"
                  className="w-full rounded-xl bg-slate-950 border border-cyan-500/30 px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Custom Banner Caption
                </label>
                <textarea
                  rows={3}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Write an exciting launch announcement caption with #lov_contest_round1..."
                  className="w-full rounded-2xl bg-slate-950 border border-cyan-500/30 p-3.5 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">
                  Banner Image
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 text-xs font-bold cursor-pointer">
                    <ImagePlus size={15} />
                    Upload Banner Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                  {CONTEST_BANNER_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setNewBanner(p.url)}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-gray-300 hover:border-cyan-400 cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 cursor-pointer"
                >
                  <Rocket size={16} />
                  Launch Contest & Publish Banner
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AdminContestModal;
