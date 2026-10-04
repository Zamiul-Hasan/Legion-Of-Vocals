import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Hash,
  UserPlus,
  Heart,
  Search,
  Sparkles,
  CheckCircle2,
  Globe,
  ShieldCheck,
  Settings2,
  Plus,
  Award,
  ExternalLink,
  Play,
  X,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Lock,
  Square,
  LogIn,
} from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Container from "../components/UI/Container";
import BackButton from "../components/UI/BackButton";
import ContestLaunchBanner, {
  renderTextWithHashtags,
} from "../components/Contest/ContestLaunchBanner";
import ContestRegisterModal from "../components/Contest/ContestRegisterModal";
import AdminContestModal from "../components/Contest/AdminContestModal";
import ContestLeaderboardSection from "../components/Contest/ContestLeaderboardSection";
import AdminRoundScoringModal from "../components/Contest/AdminRoundScoringModal";
import LoginModal from "../components/Auth/LoginModal";
import { useContests, getEntryPointsSummary } from "../hooks/useContests";
import { useAuth } from "../hooks/useAuth";

function Contests() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    activeContest,
    activeRound,
    updateContestBanner,
    addRound,
    setActiveRound,
    startRound,
    stopRound,
    setRoundStatus,
    deleteRound,
    launchNewContest,
    registerAndSubmitEntry,
    voteEntry,
    updateEntryStatus,
    awardRoundPoints,
  } = useContests();
  const { isAuthenticated, canManageProjects } = useAuth();

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [loginModalOpen, setLoginOpen] = useState(false);
  const [selectedRoundForCompete, setSelectedRoundForCompete] = useState(null);

  const handleOpenCompete = (targetRoundId = null) => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    if (targetRoundId) {
      const r = activeContest?.rounds?.find((item) => item.id === targetRoundId);
      if (r && r.status !== "Active") {
        return;
      }
      setSelectedRoundForCompete(targetRoundId);
    } else {
      setSelectedRoundForCompete(null);
    }
    setRegisterModalOpen(true);
  };
  const [selectedHashtag, setSelectedHashtag] = useState(
    searchParams.get("tag") || "ALL"
  );
  const [selectedRoundFilter, setSelectedRoundFilter] = useState("ALL");
  const [participantFilter, setParticipantFilter] = useState("ALL"); // "ALL" | "LOV Member" | "Outsider"
  const [searchQuery, setSearchQuery] = useState("");
  const [playingVideoEntry, setPlayingVideoEntry] = useState(null);
  const [lightboxData, setLightboxData] = useState(null); // { entry, images, index }
  const [scoringEntry, setScoringEntry] = useState(null);

  useEffect(() => {
    const tagFromUrl = searchParams.get("tag");
    if (tagFromUrl) {
      setSelectedHashtag(tagFromUrl.toLowerCase());
    }
  }, [searchParams]);

  const handleSelectHashtag = (tag) => {
    const normalized = tag.toLowerCase();
    setSelectedHashtag(normalized);
    setSearchParams({ tag: normalized });
    const feedEl = document.getElementById("contest-hashtag-feed");
    if (feedEl) {
      feedEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Compute all unique Facebook-style hashtags and their counts across entries & rounds
  const hashtagCounts = useMemo(() => {
    const map = new Map();
    (activeContest?.rounds || []).forEach((r) => {
      if (r.hashtag) {
        map.set(r.hashtag.toLowerCase(), 0);
      }
    });
    (activeContest?.entries || []).forEach((entry) => {
      (entry.hashtags || []).forEach((tag) => {
        const clean = tag.toLowerCase();
        map.set(clean, (map.get(clean) || 0) + 1);
      });
    });
    return Array.from(map.entries()).map(([tag, count]) => ({ tag, count }));
  }, [activeContest]);

  // Filter contest submissions by Round, Hashtag, Competitor Type, and Search
  const filteredEntries = useMemo(() => {
    const list = activeContest?.entries || [];
    return list.filter((entry) => {
      if (
        selectedRoundFilter !== "ALL" &&
        entry.roundId !== selectedRoundFilter
      ) {
        return false;
      }
      if (
        participantFilter !== "ALL" &&
        entry.participantType !== participantFilter
      ) {
        return false;
      }
      if (selectedHashtag !== "ALL") {
        const hasTag = (entry.hashtags || []).some(
          (t) => t.toLowerCase() === selectedHashtag.toLowerCase()
        );
        const inCaption = (entry.caption || "")
          .toLowerCase()
          .includes(selectedHashtag.toLowerCase());
        if (!hasTag && !inCaption) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = entry.participantName?.toLowerCase().includes(q);
        const matchChar = entry.characterAndAnime?.toLowerCase().includes(q);
        const matchCode = entry.contestantCode?.toLowerCase().includes(q);
        const matchCap = entry.caption?.toLowerCase().includes(q);
        if (!matchName && !matchChar && !matchCode && !matchCap) return false;
      }
      return true;
    });
  }, [
    activeContest,
    selectedRoundFilter,
    participantFilter,
    selectedHashtag,
    searchQuery,
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="pt-28 pb-24">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <BackButton label="Back" fallback="/" variant="subtle" />

            <div className="flex flex-wrap items-center gap-3">
              {canManageProjects && (
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-bold transition cursor-pointer"
                >
                  <Settings2 size={16} />
                  Admin: Edit Banner, Caption & Rounds
                </button>
              )}

              <button
                type="button"
                onClick={() => handleOpenCompete()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition cursor-pointer"
              >
                <UserPlus size={16} />
                + Register for Contest (Members & Outsiders)
              </button>
            </div>
          </div>
        </Container>

        {/* Active Contest Custom Banner & Caption */}
        <ContestLaunchBanner
          isCompactHome={false}
          onOpenRegister={() => handleOpenCompete()}
          onSelectHashtag={handleSelectHashtag}
          onOpenAdminEditor={() => setAdminModalOpen(true)}
        />

        {/* MULTI-ROUND SYSTEM SECTION */}
        <section className="py-10">
          <Container>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Trophy size={14} />
                  Tournament Progression
                </span>
                <h2 className="mt-3 text-3xl md:text-4xl font-black text-white">
                  Official Contest <span className="text-cyan-400">Rounds & Hashtags</span>
                </h2>
                <p className="mt-1 text-gray-400 text-sm">
                  Each round has its own official Facebook-style tag (e.g.{" "}
                  <span className="text-[#4599FF] font-mono font-bold">
                    #lov_contest_round1
                  </span>
                  ). Click any round to view its submissions or register.
                </p>
              </div>

              {canManageProjects && (
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 text-xs font-bold transition self-start md:self-auto cursor-pointer"
                >
                  <Plus size={15} />
                  Add / Manage Rounds
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {(activeContest?.rounds || []).map((round) => {
                const isRunning = round.status === "Active";
                const isEnded =
                  round.status === "Completed" ||
                  round.status === "Stopped" ||
                  round.status === "Ended";
                const isUpcoming =
                  round.status === "Upcoming" || round.status === "Not Started";

                const roundEntriesCount = (
                  activeContest?.entries || []
                ).filter((e) => e.roundId === round.id).length;

                return (
                  <div
                    key={round.id}
                    className={`rounded-3xl p-6 border transition flex flex-col justify-between ${
                      isRunning
                        ? "bg-gradient-to-b from-cyan-950/50 to-slate-900 border-2 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.18)]"
                        : isEnded
                        ? "bg-slate-900/80 border-red-500/25"
                        : "bg-slate-900 border-cyan-500/20 hover:border-cyan-500/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                            isRunning
                              ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20"
                              : isEnded
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : "bg-slate-800 text-gray-300 border border-slate-700"
                          }`}
                        >
                          Round {round.roundNumber} •{" "}
                          {isRunning
                            ? "Active Now"
                            : isEnded
                            ? "Ended (Closed)"
                            : "Not Started (Closed)"}
                        </span>

                        <span className="text-xs text-gray-400">
                          Due: {round.deadline}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white">
                        {round.title}
                      </h3>

                      <p className="mt-2.5 text-sm text-gray-400 leading-relaxed">
                        {round.description}
                      </p>

                      {/* Official Round Facebook Hashtag Box */}
                      <div className="mt-4 p-3 rounded-2xl bg-slate-950/90 border border-[#1877F2]/30 flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          Official Round Tag:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSelectHashtag(round.hashtag)}
                          className="font-mono text-xs sm:text-sm font-black text-[#4599FF] hover:underline cursor-pointer"
                        >
                          {round.hashtag}
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs text-gray-400 font-semibold">
                        {roundEntriesCount} Submissions
                      </span>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRoundFilter(
                              selectedRoundFilter === round.id
                                ? "ALL"
                                : round.id
                            );
                            handleSelectHashtag(round.hashtag);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 transition cursor-pointer"
                        >
                          Filter Tag
                        </button>

                        {/* Admin Start / Stop round control */}
                        {canManageProjects && (
                          isRunning ? (
                            <button
                              type="button"
                              onClick={() => stopRound(activeContest.id, round.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold transition cursor-pointer"
                              title="Stop / End this round"
                            >
                              <Square size={12} className="inline mr-1" />
                              Stop Round
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => startRound(activeContest.id, round.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-green-500/20 hover:bg-green-500 text-green-300 hover:text-slate-950 border border-green-500/40 text-xs font-bold transition cursor-pointer"
                              title="Start this round"
                            >
                              ▶ Start Round
                            </button>
                          )
                        )}

                        {/* Compete Button: ONLY active when round is Active */}
                        {isRunning ? (
                          <button
                            type="button"
                            onClick={() => handleOpenCompete(round.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-md shadow-cyan-500/25"
                          >
                            Compete
                          </button>
                        ) : isEnded ? (
                          <button
                            type="button"
                            disabled
                            className="px-3 py-1.5 rounded-xl bg-slate-800 text-gray-500 border border-slate-700/60 text-xs font-bold flex items-center gap-1 cursor-not-allowed"
                            title="Round has ended. Submissions are closed."
                          >
                            <Lock size={12} />
                            Ended
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="px-3 py-1.5 rounded-xl bg-slate-800 text-gray-500 border border-slate-700/60 text-xs font-bold flex items-center gap-1 cursor-not-allowed"
                            title="Round has not started yet."
                          >
                            <Lock size={12} />
                            Not Started
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* AI-DESIGNED ROUND-BY-ROUND CONTEST LEADERBOARD SECTION */}
        <section className="py-6">
          <Container>
            <ContestLeaderboardSection />
          </Container>
        </section>

        {/* FACEBOOK-STYLE HASHTAG FEED & COMPETITOR SUBMISSIONS */}
        <section id="contest-hashtag-feed" className="py-12">
          <Container>
            <div className="rounded-3xl bg-slate-900 border border-cyan-500/25 p-6 sm:p-8 mb-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-[#4599FF] text-xs font-black uppercase tracking-wider">
                    <Hash size={15} />
                    Facebook-Style Contest Hashtag System
                  </div>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-black text-white">
                    {selectedHashtag === "ALL" ? (
                      <>All Contest Submissions & Hashtag Feed</>
                    ) : (
                      <>
                        Exploring Tag:{" "}
                        <span className="text-[#4599FF] font-mono">
                          {selectedHashtag}
                        </span>
                      </>
                    )}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Click any hashtag below (like{" "}
                    <span className="text-[#4599FF] font-mono">
                      #lov_contest_round1
                    </span>
                    ) to filter submissions just like Facebook. Both LOV Members and Outsiders compete together!
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative w-full lg:w-80">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search #hashtag, name, anime, ID..."
                    className="w-full rounded-2xl bg-slate-950 border border-cyan-500/30 pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Clickable Hashtag Pills Bar */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHashtag("ALL");
                    setSelectedRoundFilter("ALL");
                    setSearchParams({});
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    selectedHashtag === "ALL"
                      ? "bg-cyan-500 text-slate-950 shadow"
                      : "bg-slate-950 text-gray-300 border border-slate-800 hover:border-cyan-500/40"
                  }`}
                >
                  All Hashtags ({activeContest?.entries?.length || 0})
                </button>

                {hashtagCounts.map(({ tag, count }) => {
                  const isSelected =
                    selectedHashtag.toLowerCase() === tag.toLowerCase();
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSelectHashtag(tag)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-[#1877F2] text-white shadow-lg shadow-[#1877F2]/30"
                          : "bg-[#1877F2]/15 text-[#65A9FF] border border-[#1877F2]/30 hover:bg-[#1877F2]/25"
                      }`}
                    >
                      <span>{tag}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-slate-950 text-gray-400"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Competitor Type Filter (All vs LOV Members vs Outsiders) */}
              <div className="mt-5 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-400 font-semibold mr-1">
                    Competitor Division:
                  </span>
                  {["ALL", "LOV Member", "Outsider"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setParticipantFilter(type)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        participantFilter === type
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400"
                          : "bg-slate-950 text-gray-400 border border-slate-800 hover:text-white"
                      }`}
                    >
                      {type === "ALL"
                        ? "All Competitors"
                        : type === "LOV Member"
                        ? "👑 LOV Studio Members"
                        : "🌍 Outsider Challengers"}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-gray-400">
                  Showing{" "}
                  <strong className="text-white">{filteredEntries.length}</strong>{" "}
                  contest entries
                </span>
              </div>
            </div>

            {/* Entries Grid */}
            {filteredEntries.length === 0 ? (
              <div className="rounded-3xl bg-slate-900 border border-cyan-500/20 p-12 text-center">
                <Trophy size={42} className="text-cyan-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white">
                  No submissions found for this filter yet
                </h3>
                <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
                  Be the first to register and submit your performance with{" "}
                  <span className="text-[#4599FF] font-mono font-bold">
                    {selectedHashtag === "ALL"
                      ? activeRound?.hashtag || "#lov_contest_round1"
                      : selectedHashtag}
                  </span>
                  !
                </p>
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition cursor-pointer"
                >
                  <UserPlus size={18} />
                  Register & Submit Entry
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-7">
                {filteredEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-slate-900 border border-cyan-500/20 hover:border-cyan-400/50 overflow-hidden flex flex-col justify-between transition shadow-lg"
                  >
                    <div>
                      {/* Entry Top Header (Facebook Post Style) */}
                      <div className="p-5 flex items-start justify-between gap-3 border-b border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <img
                            src={entry.avatar}
                            alt={entry.participantName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400 bg-slate-950"
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-white text-base">
                                {entry.participantName}
                              </h3>
                              {entry.participantType === "LOV Member" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold">
                                  <ShieldCheck size={12} />
                                  LOV Member{" "}
                                  {entry.lovId ? `• ${entry.lovId}` : ""}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/40 text-purple-300 text-[11px] font-bold">
                                  <Globe size={12} />
                                  Outsider Challenger
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-gray-400 mt-0.5">
                              Pass ID:{" "}
                              <span className="font-mono text-cyan-400">
                                {entry.contestantCode}
                              </span>{" "}
                              • Round {entry.roundNumber} • {entry.submittedAt}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                            entry.status?.includes("Winner")
                              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                              : entry.status === "Qualified"
                              ? "bg-green-500/20 text-green-300 border border-green-500/40"
                              : "bg-slate-800 text-gray-300"
                          }`}
                        >
                          {entry.status || "Registered"}
                        </span>
                      </div>

                      {/* Character & Scene Banner / Uploaded Images Preview */}
                      {(() => {
                        const entryImages =
                          Array.isArray(entry.images) && entry.images.length > 0
                            ? entry.images
                            : [entry.bannerThumb || activeContest.bannerImage];

                        return (
                          <div>
                            <div
                              onClick={() =>
                                setLightboxData({
                                  entry,
                                  images: entryImages,
                                  index: 0,
                                })
                              }
                              className="relative h-52 bg-slate-950 overflow-hidden group cursor-pointer"
                            >
                              <img
                                src={entryImages[0]}
                                alt={entry.characterAndAnime}
                                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />

                              {/* Photo Counter Badge */}
                              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-md">
                                <ImageIcon size={12} />
                                {entryImages.length}{" "}
                                {entryImages.length === 1 ? "Image" : "Images"}
                              </div>

                              {entry.videoUrl && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPlayingVideoEntry(entry);
                                  }}
                                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                >
                                  <span className="w-14 h-14 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.8)] group-hover:scale-110 transition">
                                    <Play
                                      size={24}
                                      className="fill-slate-950 ml-0.5"
                                    />
                                  </span>
                                </button>
                              )}

                              <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between gap-2">
                                <div>
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                                    Performance Scene
                                  </span>
                                  <h4 className="text-lg font-black text-white">
                                    {entry.characterAndAnime}
                                  </h4>
                                </div>
                              </div>
                            </div>

                            {/* Multi-Image Thumbnail Strip (Facebook Post Gallery Style) */}
                            {entryImages.length > 1 && (
                              <div className="grid grid-cols-4 gap-1.5 px-5 pt-3">
                                {entryImages.slice(0, 4).map((imgSrc, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() =>
                                      setLightboxData({
                                        entry,
                                        images: entryImages,
                                        index: idx,
                                      })
                                    }
                                    className="relative h-16 rounded-xl overflow-hidden border border-cyan-500/30 hover:border-cyan-400 group cursor-pointer"
                                  >
                                    <img
                                      src={imgSrc}
                                      alt={`${entry.participantName} upload ${
                                        idx + 1
                                      }`}
                                      className="w-full h-full object-cover group-hover:scale-110 transition"
                                    />
                                    {idx === 3 && entryImages.length > 4 && (
                                      <div className="absolute inset-0 bg-slate-950/75 flex items-center justify-center text-white font-black text-xs">
                                        +{entryImages.length - 4}
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Facebook-style Caption with Clickable Hashtags */}
                      <div className="p-5">
                        <p className="text-sm text-gray-200 leading-relaxed">
                          {renderTextWithHashtags(
                            entry.caption,
                            handleSelectHashtag
                          )}
                        </p>

                        {/* Hashtag Chips */}
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {(entry.hashtags || []).map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleSelectHashtag(tag)}
                              className="px-2.5 py-1 rounded-lg bg-[#1877F2]/15 hover:bg-[#1877F2]/30 border border-[#1877F2]/30 text-[#65A9FF] text-xs font-mono font-bold transition cursor-pointer"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>

                        {/* Contestant Round Points Strip */}
                        {(() => {
                          const pts = getEntryPointsSummary(
                            entry,
                            activeContest?.rounds || []
                          );
                          return (
                            <div className="mt-4 p-3 rounded-2xl bg-slate-950/85 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex flex-wrap items-center gap-2">
                                {(activeContest?.rounds || []).map((r) => (
                                  <span
                                    key={r.id}
                                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-gray-300 font-semibold"
                                  >
                                    R{r.roundNumber}:{" "}
                                    <strong className="text-cyan-400">
                                      {pts.perRound[r.id]?.total || 0} pts
                                    </strong>
                                  </span>
                                ))}
                              </div>
                              <span className="px-3 py-1 rounded-lg bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 font-black">
                                Total: {pts.grandTotal} PTS
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Footer: Vote Button + Share to FB Group + Admin Qualification & Round Scoring Controls */}
                    <div className="px-5 py-4 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => voteEntry(activeContest.id, entry.id)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            entry.likedByMe
                              ? "bg-pink-500/20 border-pink-500/50 text-pink-300"
                              : "bg-slate-900 border-slate-700 text-gray-300 hover:border-pink-400/50 hover:text-pink-300"
                          }`}
                        >
                          <Heart
                            size={15}
                            className={
                              entry.likedByMe ? "fill-pink-400 text-pink-400" : ""
                            }
                          />
                          {entry.likedByMe ? "Voted" : "Vote Entry"} •{" "}
                          <span>{entry.votes || 0}</span>
                        </button>

                        <a
                          href={
                            entry.socialLink ||
                            "https://www.facebook.com/share/g/19MxBAkZsX/"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2]/30 text-[#65A9FF] text-xs font-bold transition"
                        >
                          <ExternalLink size={13} />
                          FB Group Post
                        </a>
                      </div>

                      {/* Admin Judge Controls */}
                      {canManageProjects && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setScoringEntry(entry)}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-[11px] font-black transition cursor-pointer"
                            title="Give or edit round points"
                          >
                            🎯 Give Points
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateEntryStatus(
                                activeContest.id,
                                entry.id,
                                "Qualified"
                              )
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-green-500/15 hover:bg-green-500/30 text-green-300 text-[11px] font-bold transition cursor-pointer"
                            title="Qualify for next round"
                          >
                            ✓ Qualify
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateEntryStatus(
                                activeContest.id,
                                entry.id,
                                "Winner 🏆"
                              )
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-yellow-500/15 hover:bg-yellow-500/30 text-yellow-300 text-[11px] font-bold transition cursor-pointer"
                            title="Crown Winner"
                          >
                            🏆 Winner
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Container>
        </section>
      </main>

      {/* Full-Screen Contestant Image Lightbox Modal */}
      {lightboxData && (
        <div
          onClick={() => setLightboxData(null)}
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-cyan-500/30 overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={lightboxData.entry.avatar}
                  alt={lightboxData.entry.participantName}
                  className="w-10 h-10 rounded-full object-cover border border-cyan-400"
                />
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    {lightboxData.entry.participantName} —{" "}
                    <span className="text-cyan-400">
                      {lightboxData.entry.characterAndAnime}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-400">
                    Image {lightboxData.index + 1} of{" "}
                    {lightboxData.images.length} •{" "}
                    {lightboxData.entry.contestantCode}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLightboxData(null)}
                className="p-2 rounded-xl bg-slate-800 text-gray-300 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative bg-black flex items-center justify-center min-h-[340px] max-h-[65vh]">
              <img
                src={lightboxData.images[lightboxData.index]}
                alt={lightboxData.entry.characterAndAnime}
                className="max-h-[65vh] w-auto object-contain"
              />

              {lightboxData.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxData((prev) => ({
                        ...prev,
                        index:
                          (prev.index - 1 + prev.images.length) %
                          prev.images.length,
                      }))
                    }
                    className="absolute left-4 p-3 rounded-full bg-slate-900/80 hover:bg-cyan-500 text-white hover:text-slate-950 border border-cyan-500/30 transition cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxData((prev) => ({
                        ...prev,
                        index: (prev.index + 1) % prev.images.length,
                      }))
                    }
                    className="absolute right-4 p-3 rounded-full bg-slate-900/80 hover:bg-cyan-500 text-white hover:text-slate-950 border border-cyan-500/30 transition cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            <div className="p-4 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {(lightboxData.entry.hashtags || []).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setLightboxData(null);
                      handleSelectHashtag(tag);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#1877F2]/20 text-[#65A9FF] font-mono text-xs font-bold cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  voteEntry(activeContest.id, lightboxData.entry.id)
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold cursor-pointer"
              >
                <Heart size={14} className="fill-pink-400 text-pink-400" />
                Vote Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Playback Modal if entry has videoUrl */}
      {playingVideoEntry && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-cyan-500/30 overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-white">
                  {playingVideoEntry.characterAndAnime}
                </h4>
                <p className="text-xs text-cyan-400">
                  Performed by {playingVideoEntry.participantName} (
                  {playingVideoEntry.participantType})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPlayingVideoEntry(null)}
                className="p-2 rounded-xl bg-slate-800 text-gray-300 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <video
              src={playingVideoEntry.videoUrl}
              controls
              autoPlay
              className="w-full rounded-2xl max-h-[65vh] bg-black"
            />
          </div>
        </div>
      )}

      {/* Competitor Registration Modal (Members & Outsiders) */}
      <ContestRegisterModal
        isOpen={registerModalOpen}
        onClose={() => {
          setRegisterModalOpen(false);
          setSelectedRoundForCompete(null);
        }}
        contest={activeContest}
        activeRound={activeRound}
        initialRoundId={selectedRoundForCompete}
        onSubmitEntry={registerAndSubmitEntry}
      />

      {/* Admin Contest Banner, Caption & Rounds Control Modal */}
      <AdminContestModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        activeContest={activeContest}
        onUpdateBanner={updateContestBanner}
        onAddRound={addRound}
        onSetActiveRound={setActiveRound}
        onDeleteRound={deleteRound}
        onLaunchNewContest={launchNewContest}
        onStartRound={startRound}
        onStopRound={stopRound}
        onSetRoundStatus={setRoundStatus}
      />

      {/* Admin Round Judge Scorecard Modal */}
      <AdminRoundScoringModal
        isOpen={Boolean(scoringEntry)}
        onClose={() => setScoringEntry(null)}
        contest={activeContest}
        entry={scoringEntry}
        initialRoundId={activeRound?.id}
        onSaveRoundScore={awardRoundPoints}
      />

      {/* Login Modal for Guest attempting to Compete */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginOpen(false)}
      />

      <Footer />
    </div>
  );
}

export default Contests;
