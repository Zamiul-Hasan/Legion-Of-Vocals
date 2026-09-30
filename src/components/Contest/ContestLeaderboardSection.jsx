import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Crown,
  Wand2,
  Sparkles,
  Sliders,
  ShieldCheck,
  Globe,
  Plus,
  Heart,
} from "lucide-react";
import { useContests, getEntryPointsSummary } from "../../hooks/useContests";
import { useLeaderboardTheme } from "../../hooks/useLeaderboardTheme";
import { useAuth } from "../../hooks/useAuth";
import AdminRoundScoringModal from "./AdminRoundScoringModal";
import AILeaderboardDesignerModal from "./AILeaderboardDesignerModal";

function ContestLeaderboardSection() {
  const {
    activeContest,
    awardRoundPoints,
    quickAdjustRoundPoints,
  } = useContests();
  const { theme, generateWithAI } = useLeaderboardTheme();
  const { canManageProjects } = useAuth();

  const [roundScope, setRoundScope] = useState("ALL"); // "ALL" or round.id
  const [scoringEntry, setScoringEntry] = useState(null);
  const [scoringRoundId, setScoringRoundId] = useState(null);
  const [aiDesignerOpen, setAiDesignerOpen] = useState(false);
  const [quickPrompt, setQuickPrompt] = useState("");

  const rounds = activeContest?.rounds || [];

  // Calculate rankings for each contestant
  const rankedContestants = useMemo(() => {
    const entries = activeContest?.entries || [];
    const enriched = entries.map((entry) => {
      const summary = getEntryPointsSummary(entry, rounds);
      const displayScore =
        roundScope === "ALL"
          ? summary.grandTotal
          : summary.perRound[roundScope]?.total || 0;
      return {
        ...entry,
        summary,
        displayScore,
      };
    });

    return enriched.sort((a, b) => b.displayScore - a.displayScore);
  }, [activeContest, rounds, roundScope]);

  const topThree = rankedContestants.slice(0, 3);

  const handleQuickPromptSubmit = (e) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    generateWithAI(quickPrompt.trim());
    setQuickPrompt("");
  };

  return (
    <div className="space-y-6">
      {/* Main AI-Designed Leaderboard Container */}
      <div
        className="relative rounded-3xl overflow-hidden border-2 p-6 sm:p-8 lg:p-10 transition-all duration-700 shadow-2xl"
        style={{
          background: theme.bgGradient,
          borderColor: theme.borderGlow,
          boxShadow: `0 0 65px -15px ${theme.borderGlow}`,
        }}
      >
        {/* Optional AI/Custom Background Image Layer */}
        {theme.bgImage && (
          <img
            src={theme.bgImage}
            alt={theme.name}
            className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-25 pointer-events-none"
          />
        )}

        {/* Atmospheric Particle / Grid Overlay based on AI Pattern Type */}
        {theme.patternType === "cyber-grid" && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, ${theme.accentHex}33 1px, transparent 1px), linear-gradient(to bottom, ${theme.accentHex}33 1px, transparent 1px)`,
              backgroundSize: "36px 36px",
            }}
          />
        )}
        {theme.patternType === "runes" && (
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: `radial-gradient(${theme.accentHex} 1.5px, transparent 1.5px), radial-gradient(${theme.secondaryHex} 1.5px, transparent 1.5px)`,
              backgroundSize: "48px 48px",
              backgroundPosition: "0 0, 24px 24px",
            }}
          />
        )}
        {theme.patternType === "embers" && (
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: `radial-gradient(#f97316 2px, transparent 2px), radial-gradient(#fde047 1.5px, transparent 1.5px)`,
              backgroundSize: "42px 42px",
              backgroundPosition: "0 0, 21px 21px",
            }}
          />
        )}
        {theme.patternType === "starlight" && (
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: `radial-gradient(#fef08a 1.5px, transparent 1.5px), radial-gradient(#ffffff 1px, transparent 1px)`,
              backgroundSize: "52px 52px",
              backgroundPosition: "0 0, 26px 26px",
            }}
          />
        )}

        {/* Content Layer */}
        <div className="relative z-10 space-y-8">
          {/* Top Header + AI Theme Studio Bar */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.55)",
                    color: theme.accentHex,
                    border: `1px solid ${theme.borderGlow}`,
                  }}
                >
                  <Trophy size={13} />
                  Official Round-by-Round Contest Leaderboard
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold backdrop-blur-md">
                  <Sparkles size={12} style={{ color: theme.goldHex }} />
                  {theme.name}
                </span>
              </div>

              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white tracking-tight">
                Championship{" "}
                <span style={{ color: theme.accentHex }}>
                  Points & Standings
                </span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-2xl">
                {theme.aiSummary}
              </p>
            </div>

            {/* Quick AI Theme Generator Bar + Open Studio Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-slate-950/80 p-2.5 rounded-2xl border border-white/15 backdrop-blur-xl">
              <form
                onSubmit={handleQuickPromptSubmit}
                className="flex items-center gap-2 flex-1"
              >
                <Wand2
                  size={16}
                  className="ml-2 shrink-0"
                  style={{ color: theme.accentHex }}
                />
                <input
                  type="text"
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder="AI Theme Prompt (e.g. Crimson Flame, Cyber Neon)..."
                  className="bg-transparent text-xs text-white placeholder-gray-400 outline-none w-full sm:w-56 px-1 py-1.5"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl text-xs font-black text-slate-950 transition shrink-0 cursor-pointer"
                  style={{ backgroundColor: theme.accentHex }}
                >
                  AI Redesign
                </button>
              </form>

              <button
                type="button"
                onClick={() => setAiDesignerOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition cursor-pointer shrink-0"
              >
                <Sparkles size={14} style={{ color: theme.goldHex }} />
                AI Design Studio
              </button>
            </div>
          </div>

          {/* Round Ranking Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setRoundScope("ALL")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  roundScope === "ALL"
                    ? "text-slate-950 shadow-lg"
                    : "bg-slate-950/70 text-gray-300 border border-white/15 hover:text-white"
                }`}
                style={
                  roundScope === "ALL"
                    ? { backgroundColor: theme.accentHex }
                    : undefined
                }
              >
                🏆 All Rounds Combined + Votes
              </button>

              {rounds.map((r) => {
                const isSelected = roundScope === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoundScope(r.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? "text-slate-950 font-black shadow-lg"
                        : "bg-slate-950/70 text-gray-300 border border-white/15 hover:text-white"
                    }`}
                    style={
                      isSelected
                        ? { backgroundColor: theme.accentHex }
                        : undefined
                    }
                  >
                    Round {r.roundNumber} Standings ({r.hashtag})
                  </button>
                );
              })}
            </div>

            {canManageProjects && rankedContestants.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setScoringEntry(rankedContestants[0]);
                  setScoringRoundId(
                    roundScope === "ALL"
                      ? activeContest.activeRoundId
                      : roundScope
                  );
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs shadow-lg transition cursor-pointer"
              >
                <Sliders size={14} />
                Admin: Open Round Judge Scorecard
              </button>
            )}
          </div>

          {/* TOP 3 PODIUM CARDS */}
          <div className="grid md:grid-cols-3 gap-6">
            {topThree.map((contestant, idx) => {
              const medals = [
                "🥇 #1 Grand Leader",
                "🥈 #2 Challenger",
                "🥉 #3 Finalist",
              ];
              return (
                <motion.div
                  key={contestant.id}
                  whileHover={{ y: -5 }}
                  className="relative rounded-3xl p-6 border backdrop-blur-xl text-center transition"
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor:
                      idx === 0 ? theme.goldHex : theme.borderGlow,
                    boxShadow:
                      idx === 0
                        ? `0 0 35px -8px ${theme.goldHex}66`
                        : undefined,
                  }}
                >
                  {idx === 0 && (
                    <Crown
                      size={30}
                      className="mx-auto mb-2 animate-bounce"
                      style={{ color: theme.goldHex }}
                    />
                  )}

                  <span
                    className="inline-block px-3.5 py-1 rounded-full text-xs font-black"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: idx === 0 ? theme.goldHex : theme.accentHex,
                      border: `1px solid ${
                        idx === 0 ? theme.goldHex : theme.borderGlow
                      }`,
                    }}
                  >
                    {medals[idx]}
                  </span>

                  <div className="relative w-20 h-20 mx-auto mt-4">
                    <img
                      src={contestant.avatar}
                      alt={contestant.participantName}
                      className="w-20 h-20 rounded-full object-cover border-2 bg-slate-950"
                      style={{
                        borderColor:
                          idx === 0 ? theme.goldHex : theme.accentHex,
                      }}
                    />
                  </div>

                  <h3 className="mt-3 text-xl font-black text-white">
                    {contestant.participantName}
                  </h3>
                  <p className="text-xs text-gray-300 mt-0.5">
                    {contestant.participantType} •{" "}
                    <span className="font-mono" style={{ color: theme.accentHex }}>
                      {contestant.contestantCode}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {contestant.characterAndAnime}
                  </p>

                  {/* Per-Round Mini Score Pills */}
                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {rounds.map((r) => {
                      const pts =
                        contestant.summary.perRound[r.id]?.total || 0;
                      return (
                        <span
                          key={r.id}
                          className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-white/10 text-[11px] font-bold text-gray-200"
                        >
                          R{r.roundNumber}:{" "}
                          <strong style={{ color: theme.accentHex }}>
                            {pts}
                          </strong>
                        </span>
                      );
                    })}
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-white/10 text-[11px] font-bold text-pink-300">
                      Votes: +{contestant.summary.votePoints}
                    </span>
                  </div>

                  {/* Total Score Banner */}
                  <div className="mt-4 py-3 px-4 rounded-2xl bg-slate-950/85 border border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-semibold">
                      {roundScope === "ALL"
                        ? "Total Championship Pts"
                        : "Round Score"}
                    </span>
                    <span
                      className="text-xl font-black"
                      style={{ color: theme.goldHex }}
                    >
                      {contestant.displayScore} PTS
                    </span>
                  </div>

                  {canManageProjects && (
                    <button
                      type="button"
                      onClick={() => {
                        setScoringEntry(contestant);
                        setScoringRoundId(
                          roundScope === "ALL"
                            ? activeContest.activeRoundId
                            : roundScope
                        );
                      }}
                      className="mt-3 w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition cursor-pointer"
                    >
                      🎯 Score / Edit Round Points
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* FULL ROUND-BY-ROUND STANDINGS TABLE */}
          <div
            className="rounded-3xl border overflow-hidden backdrop-blur-xl"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.borderGlow,
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase text-gray-300 bg-slate-950/60">
                    <th className="py-4 px-5">Rank</th>
                    <th className="py-4 px-5">Competitor</th>
                    <th className="py-4 px-5">Division</th>
                    {rounds.map((r) => (
                      <th key={r.id} className="py-4 px-4 text-center">
                        Round {r.roundNumber}
                        <span className="block text-[10px] font-mono text-[#65A9FF] normal-case">
                          {r.hashtag}
                        </span>
                      </th>
                    ))}
                    <th className="py-4 px-4 text-center">
                      Vote Bonus
                      <span className="block text-[10px] text-gray-400 normal-case">
                        (2 pts / vote)
                      </span>
                    </th>
                    <th className="py-4 px-5 text-right">Total Points</th>
                    {canManageProjects && (
                      <th className="py-4 px-5 text-right">
                        Admin Judge Scoring
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm">
                  {rankedContestants.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-white/5 transition"
                    >
                      <td className="py-4 px-5 font-black text-base">
                        <span
                          style={{
                            color:
                              index === 0
                                ? theme.goldHex
                                : theme.accentHex,
                          }}
                        >
                          #{index + 1}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.avatar}
                            alt={item.participantName}
                            className="w-10 h-10 rounded-full object-cover border"
                            style={{ borderColor: theme.accentHex }}
                          />
                          <div>
                            <p className="font-bold text-white">
                              {item.participantName}
                            </p>
                            <p className="text-xs text-gray-400">
                              <span
                                className="font-mono font-bold"
                                style={{ color: theme.accentHex }}
                              >
                                {item.contestantCode}
                              </span>{" "}
                              • {item.characterAndAnime}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        {item.participantType === "LOV Member" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                            <ShieldCheck size={12} />
                            LOV Member
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
                            <Globe size={12} />
                            Outsider
                          </span>
                        )}
                      </td>

                      {/* Per-Round Score Columns with Quick Admin +5 Button */}
                      {rounds.map((r) => {
                        const rScore =
                          item.summary.perRound[r.id]?.total || 0;
                        const rNote =
                          item.summary.perRound[r.id]?.note || "";
                        return (
                          <td
                            key={r.id}
                            className="py-4 px-4 text-center"
                            title={rNote || `Round ${r.roundNumber} Score`}
                          >
                            <div className="inline-flex flex-col items-center gap-1">
                              <span className="px-3 py-1 rounded-xl bg-slate-950/80 border border-white/10 font-black text-white">
                                {rScore} pts
                              </span>
                              {canManageProjects && (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      quickAdjustRoundPoints(
                                        activeContest.id,
                                        item.id,
                                        r.id,
                                        5
                                      )
                                    }
                                    className="px-1.5 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-[10px] font-bold transition cursor-pointer"
                                    title={`Add +5 pts to Round ${r.roundNumber}`}
                                  >
                                    +5
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setScoringEntry(item);
                                      setScoringRoundId(r.id);
                                    }}
                                    className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-gray-300 text-[10px] font-bold transition cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}

                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-pink-300">
                          <Heart
                            size={12}
                            className="fill-pink-400 text-pink-400"
                          />
                          +{item.summary.votePoints}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <span
                          className="text-lg font-black"
                          style={{ color: theme.goldHex }}
                        >
                          {item.displayScore} PTS
                        </span>
                      </td>

                      {canManageProjects && (
                        <td className="py-4 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setScoringEntry(item);
                              setScoringRoundId(
                                roundScope === "ALL"
                                  ? activeContest.activeRoundId
                                  : roundScope
                              );
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-slate-950 transition cursor-pointer"
                            style={{ backgroundColor: theme.accentHex }}
                          >
                            <Plus size={14} />
                            Give Round Points
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Round Judge Scorecard Modal */}
      <AdminRoundScoringModal
        isOpen={Boolean(scoringEntry)}
        onClose={() => setScoringEntry(null)}
        contest={activeContest}
        entry={scoringEntry}
        initialRoundId={scoringRoundId}
        onSaveRoundScore={awardRoundPoints}
      />

      {/* AI Leaderboard Background & Theme Studio Modal */}
      <AILeaderboardDesignerModal
        isOpen={aiDesignerOpen}
        onClose={() => setAiDesignerOpen(false)}
      />
    </div>
  );
}

export default ContestLeaderboardSection;
