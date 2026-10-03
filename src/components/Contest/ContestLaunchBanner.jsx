import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Flame,
  Hash,
  Copy,
  Check,
  Calendar,
  Users,
  UserPlus,
  Settings2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useContests } from "../../hooks/useContests";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import Container from "../UI/Container";

export function renderTextWithHashtags(text = "", onHashtagClick) {
  if (!text) return null;
  const parts = String(text).split(/(#[a-zA-Z0-9_\u0980-\u09FF]+)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("#")) {
      return (
        <button
          key={idx}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onHashtagClick) onHashtagClick(part.toLowerCase());
          }}
          className="inline-flex items-center font-bold text-[#4599FF] hover:text-blue-300 hover:underline transition mx-0.5 cursor-pointer"
        >
          {part}
        </button>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function ContestLaunchBanner({
  isCompactHome = false,
  onOpenRegister,
  onSelectHashtag,
  onOpenAdminEditor,
}) {
  const { activeContest, activeRound, setActiveRound } = useContests();
  const { canManageProjects } = useAuth();
  const { isSasuke } = useTheme();
  const [copiedTag, setCopiedTag] = useState(false);

  if (!activeContest || (!activeContest.showBanner && isCompactHome)) {
    return null;
  }

  const currentHashtag =
    activeRound?.hashtag || activeContest.officialHashtag || "#lov_contest_round1";

  const handleCopyTag = () => {
    navigator.clipboard.writeText(currentHashtag);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
  };

  return (
    <section className={isCompactHome ? (isSasuke ? "py-12 bg-[#0c0d12]" : "py-12 bg-slate-950") : "pt-6 pb-10"}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`relative rounded-3xl overflow-hidden border-2 shadow-2xl transition-all duration-300 ${
            isSasuke
              ? "border-blue-500/40 bg-slate-950 shadow-[0_15px_50px_rgba(37,99,235,0.2)]"
              : "border-cyan-500/40 bg-slate-900 shadow-[0_0_60px_rgba(6,182,212,0.18)]"
          }`}
        >
          {/* Custom Admin Banner Background Image */}
          <div className="relative min-h-[420px] md:min-h-[460px] flex flex-col justify-between p-6 sm:p-10 lg:p-12">
            <img
              src={activeContest.bannerImage}
              alt={activeContest.title}
              className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/65" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Top Row: Live Contest Status + Official Hashtag Pill + Admin Edit Button */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30">
                  <Flame size={15} className="fill-slate-950" />
                  {activeContest.status || "Contest Live"}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border ${
                    isSasuke
                      ? "bg-blue-600/25 border-blue-400/40 text-blue-300"
                      : "bg-cyan-500/20 border-cyan-400/40 text-cyan-300"
                  }`}
                >
                  <Trophy size={14} className="text-yellow-400" />
                  {activeRound?.title || "Round 1 Active"}
                </span>

                {/* Facebook-style Clickable & Copyable Hashtag Badge */}
                <div className="inline-flex items-center rounded-full bg-[#1877F2]/25 border border-[#1877F2]/50 backdrop-blur-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectHashtag && onSelectHashtag(currentHashtag)
                    }
                    className="px-3.5 py-1.5 text-xs font-black text-[#65A9FF] hover:text-white transition flex items-center gap-1 cursor-pointer"
                    title="Filter submissions by this hashtag"
                  >
                    <Hash size={13} />
                    {currentHashtag.replace(/^#/, "")}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyTag}
                    className="px-2.5 py-1.5 bg-[#1877F2]/40 hover:bg-[#1877F2] text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                    title="Copy official contest hashtag"
                  >
                    {copiedTag ? <Check size={12} /> : <Copy size={12} />}
                    {copiedTag ? "Copied" : "Copy Tag"}
                  </button>
                </div>
              </div>

              {/* Admin / Founder Customize Banner Button */}
              {canManageProjects && (
                <div className="flex items-center gap-2">
                  {onOpenAdminEditor ? (
                    <button
                      type="button"
                      onClick={onOpenAdminEditor}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg cursor-pointer ${
                        isSasuke
                          ? "bg-slate-900/90 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40"
                          : "bg-slate-900/90 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/40"
                      }`}
                    >
                      <Settings2 size={15} />
                      Customize Contest Banner & Rounds
                    </button>
                  ) : (
                    <Link
                      to="/admin/contests"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
                        isSasuke
                          ? "bg-slate-900/90 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40"
                          : "bg-slate-900/90 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/40"
                      }`}
                    >
                      <Settings2 size={15} />
                      Manage Contest Banner & Rounds
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Middle Content */}
            <div className="relative z-10 my-6 max-w-4xl">
              <p
                className={`text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${
                  isSasuke ? "text-blue-400" : "text-cyan-400"
                }`}
              >
                <Sparkles size={15} />
                {activeContest.subtitle ||
                  "Open to All LOV Members & Outsider Challengers"}
              </p>

              <h2 className="mt-2 text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
                {activeContest.title}
              </h2>

              {/* Custom Banner Caption */}
              <div
                className={`mt-4 p-4 sm:p-5 rounded-2xl border backdrop-blur-md text-gray-200 text-sm sm:text-base leading-relaxed ${
                  isSasuke
                    ? "bg-slate-950/80 border-blue-500/30"
                    : "bg-slate-950/75 border-cyan-500/25"
                }`}
              >
                {renderTextWithHashtags(
                  activeContest.bannerCaption,
                  onSelectHashtag
                )}
              </div>

              {/* Prize Pool & Stats Strip */}
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs sm:text-sm">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 font-bold">
                  <Trophy size={16} className="text-yellow-400" />
                  Prize Pool: {activeContest.prizePool}
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/85 border border-slate-700 text-gray-300 font-semibold">
                  <Calendar size={15} className={isSasuke ? "text-blue-400" : "text-cyan-400"} />
                  Round Deadline: {activeRound?.deadline || "Open"}
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/85 border border-slate-700 text-gray-300 font-semibold">
                  <Users size={15} className="text-green-400" />
                  {activeContest.entries?.length || 0} Competitors Registered (Members & Outsiders)
                </div>
              </div>
            </div>

            {/* Bottom Row: Multi-Round System Bar + CTA Buttons */}
            <div
              className={`relative z-10 pt-5 border-t flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                isSasuke ? "border-blue-500/30" : "border-cyan-500/20"
              }`}
            >
              {/* Multi-Round Pills */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1">
                  Contest Rounds:
                </span>
                {(activeContest.rounds || []).map((round) => {
                  const isCurrent = round.id === activeRound?.id;
                  return (
                    <button
                      key={round.id}
                      type="button"
                      onClick={() => {
                        if (canManageProjects && !isCompactHome) {
                          setActiveRound(activeContest.id, round.id);
                        }
                        if (onSelectHashtag) {
                          onSelectHashtag(round.hashtag);
                        }
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 cursor-pointer ${
                        isCurrent
                          ? isSasuke
                            ? "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30"
                            : "bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/25"
                          : round.status === "Completed"
                          ? "bg-slate-900/90 text-green-400 border-green-500/30 hover:border-green-400"
                          : "bg-slate-900/80 text-gray-300 border-slate-700 hover:border-blue-500/40"
                      }`}
                      title={`${round.title} (${round.hashtag})`}
                    >
                      <span>R{round.roundNumber}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="font-mono text-[11px] opacity-90">
                        {round.hashtag}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          isCurrent
                            ? "bg-slate-950 text-blue-300"
                            : "bg-slate-800 text-gray-400"
                        }`}
                      >
                        {isCurrent ? "ACTIVE" : round.status}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {isCompactHome ? (
                  <>
                    <Link
                      to="/contests"
                      className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-black text-sm shadow-lg transition ${
                        isSasuke
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30"
                          : "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-cyan-500/25"
                      }`}
                    >
                      <UserPlus size={18} />
                      Register & Compete Now
                    </Link>
                    <Link
                      to={`/contests?tag=${encodeURIComponent(currentHashtag)}`}
                      className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-full border font-bold text-sm transition ${
                        isSasuke
                          ? "bg-slate-900/90 hover:bg-slate-800 text-blue-300 border-blue-500/40"
                          : "bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border-cyan-500/40"
                      }`}
                    >
                      View {currentHashtag} Feed
                      <ArrowRight size={16} />
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={onOpenRegister}
                      className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-black text-sm shadow-lg transition cursor-pointer ${
                        isSasuke
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30"
                          : "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-cyan-500/30"
                      }`}
                    >
                      <UserPlus size={18} />
                      Register to Compete (Member / Outsider)
                    </button>
                    <a
                      href="https://www.facebook.com/share/g/19MxBAkZsX/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-sm shadow-lg shadow-[#1877F2]/30 transition"
                    >
                      <span className="w-5 h-5 rounded-md bg-white text-[#1877F2] flex items-center justify-center font-black text-xs">
                        f
                      </span>
                      Post with {currentHashtag} in LOV CORPORATION
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export default ContestLaunchBanner;
