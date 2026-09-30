import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Medal,
  Trophy,
  Crown,
  Search,
  FolderKanban,
  Video,
  Sparkles,
  Palette,
  Layers,
  Award,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import defaultMembers from "../data/members";
import { useMembers } from "../hooks/useMembers";
import { useContests } from "../hooks/useContests";
import { useLeaderboardTheme } from "../hooks/useLeaderboardTheme";
import ContestLeaderboardSection from "../components/Contest/ContestLeaderboardSection";
import AdminRoundScoringModal from "../components/Contest/AdminRoundScoringModal";
import AILeaderboardDesignerModal from "../components/Contest/AILeaderboardDesignerModal";

const extraContributors = [
  {
    id: 4,
    username: "tanvir_va",
    fullName: "Tanvir Rahman",
    displayName: "Tanvir",
    avatar: defaultMembers[0].avatar,
    department: "Voice Acting",
    role: "Senior VA",
    level: 18,
    stats: { projects: 3, dubVideos: 7, points: 1240 },
  },
  {
    id: 5,
    username: "nafis_sfx",
    fullName: "Nafis Karin",
    displayName: "Nafis",
    avatar: defaultMembers[0].avatar,
    department: "Sound Engineering",
    role: "Audio Lead",
    level: 15,
    stats: { projects: 3, dubVideos: 6, points: 1120 },
  },
  {
    id: 6,
    username: "sadia_trans",
    fullName: "Sadia Islam",
    displayName: "Sadia",
    avatar: defaultMembers[0].avatar,
    department: "Translation",
    role: "Translator",
    level: 12,
    stats: { projects: 2, dubVideos: 5, points: 840 },
  },
];

function Leaderboard() {
  const { members } = useMembers();
  const {
    activeContest,
    awardRoundPoints,
    quickAdjustRoundPoints,
  } = useContests();
  const {
    theme,
    presets,
    applyTheme,
    generateWithAI,
    updateThemeField,
    resetTheme,
  } = useLeaderboardTheme();

  const [boardTab, setBoardTab] = useState("contest"); // "contest" | "members"
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [scoringEntry, setScoringEntry] = useState(null);
  const [scoringInitialRound, setScoringInitialRound] = useState(null);
  const [showAIDesigner, setShowAIDesigner] = useState(false);

  const allRanked = [...members, ...extraContributors].sort(
    (a, b) => b.stats.points - a.stats.points
  );

  const topThree = allRanked.slice(0, 3);

  const filtered = allRanked.filter((m) => {
    const matchDept = dept === "All" || m.department === dept;
    const matchSearch =
      m.displayName.toLowerCase().includes(search.toLowerCase()) ||
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.username.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header + AI Theme Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-2">
              <Sparkles size={13} />
              AI Theme Active: {theme.name}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
              <Medal style={{ color: theme.accentHex }} size={34} />
              LOV Arena & Community Leaderboard
            </h1>
            <p className="mt-1.5 text-gray-400 text-sm">
              Track live Contest Round Points awarded by Admin Judges or explore all-time LOV Studio Member rankings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Switch between Contest Round Leaderboard and Studio Member Leaderboard */}
            <div className="inline-flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setBoardTab("contest")}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                  boardTab === "contest"
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Trophy size={14} />
                Contest Round Leaderboard
              </button>
              <button
                type="button"
                onClick={() => setBoardTab("members")}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                  boardTab === "members"
                    ? "bg-cyan-500 text-slate-950 shadow"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Crown size={14} />
                All-Time Studio Members
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAIDesigner(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 hover:brightness-110 transition shadow-lg cursor-pointer"
            >
              <Palette size={15} />
              AI Design Leaderboard Theme
            </button>
          </div>
        </div>

        {/* TAB 1: Contest Round-by-Round Leaderboard with AI Theme & Admin Scoring */}
        {boardTab === "contest" && activeContest && (
          <ContestLeaderboardSection
            contest={activeContest}
            theme={theme}
            isAdmin={true}
            onOpenAIDesigner={() => setShowAIDesigner(true)}
            onQuickGenerateAI={(prompt) => generateWithAI(prompt)}
            onScoreContestant={(entry, roundId) => {
              setScoringEntry(entry);
              setScoringInitialRound(roundId || activeContest.activeRoundId);
            }}
            onQuickAdjustPoints={(entryId, roundId, delta) =>
              quickAdjustRoundPoints(activeContest.id, entryId, roundId, delta)
            }
          />
        )}

        {/* TAB 2: All-Time Studio Members Leaderboard (Also styled with AI Theme!) */}
        {boardTab === "members" && (
          <div
            className="relative rounded-3xl overflow-hidden border p-6 md:p-8 transition-all duration-500 space-y-8"
            style={{
              background: theme.bgImage
                ? `linear-gradient(to bottom, rgba(2,6,23,0.84), rgba(2,6,23,0.94)), url(${theme.bgImage}) center/cover no-repeat`
                : theme.bgGradient,
              borderColor: theme.borderGlow,
              boxShadow: `0 25px 80px -15px ${theme.secondaryHex}33`,
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-35"
              style={{
                backgroundImage: theme.meshOverlay,
                backgroundSize:
                  theme.particleStyle === "cyber-grid" ? "28px 28px" : "auto",
              }}
            />

            {/* Top 3 Podium */}
            <div className="relative z-10 grid md:grid-cols-3 gap-6">
              {topThree.map((member, idx) => {
                const badgeLabels = [
                  "🥇 #1 Champion",
                  "🥈 #2 Runner-Up",
                  "🥉 #3 Top Creator",
                ];

                return (
                  <div
                    key={member.id}
                    className="p-6 rounded-3xl border text-center relative backdrop-blur-md transition hover:-translate-y-1"
                    style={{
                      background:
                        idx === 0
                          ? `linear-gradient(180deg, ${theme.podiumGold}24 0%, ${theme.cardSurface} 100%)`
                          : theme.cardSurface,
                      borderColor:
                        idx === 0 ? `${theme.podiumGold}77` : theme.borderGlow,
                    }}
                  >
                    {idx === 0 && (
                      <Crown
                        size={28}
                        style={{ color: theme.podiumGold }}
                        className="mx-auto mb-2 animate-bounce"
                      />
                    )}
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 text-white border border-white/10">
                      {badgeLabels[idx]}
                    </span>

                    <img
                      src={member.avatar}
                      alt={member.displayName}
                      className="w-20 h-20 rounded-full mx-auto mt-4 border-2 object-cover bg-slate-950"
                      style={{ borderColor: theme.accentHex }}
                    />

                    <h3 className="mt-3 text-xl font-bold text-white">
                      {member.fullName}
                    </h3>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: theme.accentHex }}
                    >
                      @{member.username} • {member.department}
                    </p>

                    <div className="mt-5 py-3 px-4 rounded-2xl bg-slate-950/80 flex items-center justify-around text-sm border border-white/5">
                      <div>
                        <p className="text-xs text-gray-400">Points</p>
                        <p
                          className="font-black"
                          style={{ color: theme.podiumGold }}
                        >
                          {member.stats.points}
                        </p>
                      </div>
                      <div className="h-8 w-px bg-slate-800" />
                      <div>
                        <p className="text-xs text-gray-400">Level</p>
                        <p
                          className="font-bold"
                          style={{ color: theme.accentHex }}
                        >
                          Lv.{member.level}
                        </p>
                      </div>
                      <div className="h-8 w-px bg-slate-800" />
                      <div>
                        <p className="text-xs text-gray-400">Dubs</p>
                        <p className="font-bold text-white">
                          {member.stats.dubVideos}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filters */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {[
                  "All",
                  "Management",
                  "Voice Acting",
                  "Video Editing",
                  "Sound Engineering",
                  "Translation",
                ].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDept(d)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      dept === d
                        ? "text-slate-950 font-black"
                        : "bg-slate-950/70 text-gray-300 border border-white/10 hover:border-white/30"
                    }`}
                    style={
                      dept === d ? { backgroundColor: theme.accentHex } : undefined
                    }
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search
                  size={16}
                  style={{ color: theme.accentHex }}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search member..."
                  className="w-full rounded-xl bg-slate-950/80 border border-white/15 py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Leaderboard Table */}
            <div
              className="relative z-10 rounded-3xl overflow-hidden border backdrop-blur-md"
              style={{
                backgroundColor: theme.cardSurface,
                borderColor: theme.borderGlow,
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase text-gray-400 bg-slate-950/60">
                      <th className="py-4 px-6">Rank</th>
                      <th className="py-4 px-6">Member</th>
                      <th className="py-4 px-6">Department</th>
                      <th className="py-4 px-6">Projects</th>
                      <th className="py-4 px-6">Dubs</th>
                      <th className="py-4 px-6">Level</th>
                      <th className="py-4 px-6 text-right">Total Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-sm">
                    {filtered.map((member, index) => (
                      <tr
                        key={member.id}
                        className="hover:bg-white/5 transition"
                      >
                        <td
                          className="py-4 px-6 font-black"
                          style={{ color: theme.accentHex }}
                        >
                          #{index + 1}
                        </td>
                        <td className="py-4 px-6">
                          <Link
                            to={`/team/${member.username}`}
                            className="flex items-center gap-3 group"
                          >
                            <img
                              src={member.avatar}
                              alt={member.displayName}
                              className="w-10 h-10 rounded-full border object-cover"
                              style={{ borderColor: theme.accentHex }}
                            />
                            <div>
                              <p className="font-bold text-white group-hover:text-cyan-400 transition">
                                {member.fullName}
                              </p>
                              <p className="text-xs text-gray-400">
                                @{member.username}
                              </p>
                            </div>
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-gray-300">
                          {member.department}
                        </td>
                        <td className="py-4 px-6 text-gray-300">
                          <span className="inline-flex items-center gap-1.5">
                            <FolderKanban
                              size={15}
                              style={{ color: theme.accentHex }}
                            />
                            {member.stats.projects}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-300">
                          <span className="inline-flex items-center gap-1.5">
                            <Video size={15} className="text-green-400" />
                            {member.stats.dubVideos}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-semibold border"
                            style={{
                              backgroundColor: `${theme.accentHex}22`,
                              color: theme.accentHex,
                              borderColor: `${theme.accentHex}55`,
                            }}
                          >
                            Lv.{member.level}
                          </span>
                        </td>
                        <td
                          className="py-4 px-6 text-right font-black"
                          style={{ color: theme.podiumGold }}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Trophy size={15} />
                            {member.stats.points.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Round Point Scoring Modal */}
      {scoringEntry && activeContest && (
        <AdminRoundScoringModal
          contest={activeContest}
          entry={
            activeContest.entries.find((e) => e.id === scoringEntry.id) ||
            scoringEntry
          }
          initialRoundId={scoringInitialRound}
          onClose={() => setScoringEntry(null)}
          onSaveRoundScore={(roundId, scoreData) =>
            awardRoundPoints(activeContest.id, scoringEntry.id, roundId, scoreData)
          }
        />
      )}

      {/* AI Leaderboard Background & Theme Studio Modal */}
      {showAIDesigner && (
        <AILeaderboardDesignerModal
          theme={theme}
          presets={presets}
          onApplyPreset={applyTheme}
          onGenerateAI={generateWithAI}
          onUpdateField={updateThemeField}
          onReset={resetTheme}
          onClose={() => setShowAIDesigner(false)}
        />
      )}
    </DashboardLayout>
  );
}

export default Leaderboard;