import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  ImagePlus,
  Layers,
  Users,
  Plus,
  Rocket,
  ExternalLink,
  ShieldCheck,
  Globe,
  Wand2,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useContests, getEntryPointsSummary } from "../hooks/useContests";
import AdminContestModal from "../components/Contest/AdminContestModal";
import ContestRegisterModal from "../components/Contest/ContestRegisterModal";
import ContestLeaderboardSection from "../components/Contest/ContestLeaderboardSection";
import AdminRoundScoringModal from "../components/Contest/AdminRoundScoringModal";
import AILeaderboardDesignerModal from "../components/Contest/AILeaderboardDesignerModal";

function AdminContests() {
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
    updateEntryStatus,
    awardRoundPoints,
  } = useContests();

  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [scoringEntry, setScoringEntry] = useState(null);
  const [aiDesignerOpen, setAiDesignerOpen] = useState(false);

  const entries = activeContest?.entries || [];
  const memberEntries = entries.filter(
    (e) => e.participantType === "LOV Member"
  );
  const outsiderEntries = entries.filter(
    (e) => e.participantType === "Outsider"
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/25 rounded-3xl p-7">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <Trophy size={14} />
              Admin Contest Control Center
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white mt-2">
              Manage Contests, Round Points & AI Leaderboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Customize the contest banner, award points to contestants in every round, and design the Leaderboard background & theme with AI.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setAiDesignerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-400/40 font-bold text-sm transition cursor-pointer"
            >
              <Wand2 size={17} />
              ✨ AI Leaderboard Designer
            </button>

            <button
              type="button"
              onClick={() => setAdminModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              <ImagePlus size={18} />
              Customize Banner, Caption & Rounds
            </button>

            <Link
              to="/contests"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-cyan-500/30 font-bold text-sm transition"
            >
              <ExternalLink size={16} />
              View Public Contest Page
            </Link>
          </div>
        </div>

        {/* Contest Stats */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/20">
            <p className="text-xs text-gray-400 font-semibold uppercase">
              Active Round & Tag
            </p>
            <h3 className="text-xl font-black text-white mt-2">
              Round {activeRound?.roundNumber || 1}
            </h3>
            <p className="text-xs font-mono font-bold text-[#4599FF] mt-1">
              {activeRound?.hashtag || "#lov_contest_round1"}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/20">
            <p className="text-xs text-gray-400 font-semibold uppercase">
              Total Competitors
            </p>
            <h3 className="text-3xl font-black text-cyan-400 mt-2">
              {entries.length}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Registered across all rounds
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/20">
            <p className="text-xs text-gray-400 font-semibold uppercase">
              LOV Members Competing
            </p>
            <h3 className="text-3xl font-black text-green-400 mt-2">
              {memberEntries.length}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Verified Studio Members
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/20">
            <p className="text-xs text-gray-400 font-semibold uppercase">
              Outsider Challengers
            </p>
            <h3 className="text-3xl font-black text-purple-400 mt-2">
              {outsiderEntries.length}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Public guest registrations
            </p>
          </div>
        </div>

        {/* AI-Designed Contest Leaderboard & Round Scoring Table */}
        <ContestLeaderboardSection />

        {/* Live Banner Preview Card */}
        <div className="rounded-3xl bg-slate-900 border border-cyan-500/25 overflow-hidden">
          <div className="px-6 py-4 bg-slate-950 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Rocket size={18} className="text-cyan-400" />
              <h2 className="text-lg font-bold text-white">
                Current Active Contest Banner & Caption
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeContest?.showBanner
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-slate-800 text-gray-400"
                }`}
              >
                {activeContest?.showBanner
                  ? "Banner Visible on Home & Contest Page"
                  : "Banner Hidden on Home Page"}
              </span>
              <button
                type="button"
                onClick={() => setAdminModalOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 text-xs font-bold transition cursor-pointer"
              >
                Edit Banner & Caption
              </button>
            </div>
          </div>

          <div className="relative h-64 overflow-hidden">
            <img
              src={activeContest?.bannerImage}
              alt={activeContest?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/50 p-6 sm:p-8 flex flex-col justify-end">
              <span className="text-xs font-bold text-cyan-400 uppercase">
                {activeContest?.status} • Prize: {activeContest?.prizePool}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {activeContest?.title}
              </h3>
              <p className="text-sm text-gray-200 mt-2 max-w-3xl">
                {activeContest?.bannerCaption}
              </p>
            </div>
          </div>
        </div>

        {/* Multi-Round System Control */}
        <div className="rounded-3xl bg-slate-900 border border-cyan-500/20 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers size={20} className="text-cyan-400" />
                Contest Round System & Official Hashtags
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Click &ldquo;Activate Round&rdquo; to switch the active round and update the banner hashtag
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAdminModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              <Plus size={15} />
              + Add New Round
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {(activeContest?.rounds || []).map((round) => {
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
                  className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    isRunning
                      ? "bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.15)]"
                      : isEnded
                      ? "bg-slate-950/80 border-red-500/30"
                      : "bg-slate-950 border-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-cyan-400 uppercase">
                        Round {round.roundNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1877F2]/20 text-[#65A9FF] font-mono text-xs font-bold">
                        {round.hashtag}
                      </span>
                    </div>

                    <h4 className="font-bold text-white mt-2">{round.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {round.description}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
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
                          ? "● Active (Accepting Entries)"
                          : isEnded
                          ? "✕ Stopped / Ended (Closed)"
                          : "⏳ Upcoming (Not Started)"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-400">
                      Due: {round.deadline}
                    </span>

                    <div className="flex items-center gap-2">
                      {isRunning ? (
                        <button
                          type="button"
                          onClick={() => stopRound(activeContest.id, round.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold transition cursor-pointer"
                        >
                          ⏹ Stop Round
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startRound(activeContest.id, round.id)}
                          className="px-3 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500 text-green-300 hover:text-slate-950 border border-green-500/40 text-xs font-bold transition cursor-pointer"
                        >
                          ▶ Start Round
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Registered Competitors Table (Members & Outsiders) */}
        <div className="rounded-3xl bg-slate-900 border border-cyan-500/20 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users size={20} className="text-cyan-400" />
                Registered Competitors & Hashtag Submissions ({entries.length})
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Award points in every round, qualify contestants, or crown winners
              </p>
            </div>

            <button
              type="button"
              onClick={() => setRegisterModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition cursor-pointer"
            >
              + Add Test Competitor Entry
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase text-gray-400">
                  <th className="py-3 px-4">Competitor</th>
                  <th className="py-3 px-4">Division</th>
                  <th className="py-3 px-4">Character</th>
                  <th className="py-3 px-4">Round Points</th>
                  <th className="py-3 px-4">Grand Total</th>
                  <th className="py-3 px-4">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-sm">
                {entries.map((entry) => {
                  const pts = getEntryPointsSummary(
                    entry,
                    activeContest?.rounds || []
                  );
                  return (
                    <tr key={entry.id} className="hover:bg-slate-950/50">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={entry.avatar}
                            alt={entry.participantName}
                            className="w-9 h-9 rounded-full object-cover border border-cyan-400"
                          />
                          <div>
                            <p className="font-bold text-white">
                              {entry.participantName}
                            </p>
                            <p className="text-xs font-mono text-cyan-400">
                              {entry.contestantCode}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {entry.participantType === "LOV Member" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-bold">
                            <ShieldCheck size={12} />
                            LOV Member ({entry.lovId})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 text-xs font-bold">
                            <Globe size={12} />
                            Outsider
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-white">
                          {entry.characterAndAnime}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(activeContest?.rounds || []).map((r) => (
                            <span
                              key={r.id}
                              className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-xs text-gray-300"
                            >
                              R{r.roundNumber}:{" "}
                              <strong className="text-cyan-400">
                                {pts.perRound[r.id]?.total || 0}
                              </strong>
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-black text-yellow-400">
                        {pts.grandTotal} PTS
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setScoringEntry(entry)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black cursor-pointer"
                          >
                            🎯 Give Round Points
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
                            className="px-2.5 py-1 rounded-lg bg-green-500/15 hover:bg-green-500/30 text-green-300 text-xs font-bold cursor-pointer"
                          >
                            Qualify
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
                            className="px-2.5 py-1 rounded-lg bg-yellow-500/15 hover:bg-yellow-500/30 text-yellow-300 text-xs font-bold cursor-pointer"
                          >
                            Winner 🏆
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AdminContestModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        activeContest={activeContest}
        onUpdateBanner={updateContestBanner}
        onAddRound={addRound}
        onSetActiveRound={setActiveRound}
        onStartRound={startRound}
        onStopRound={stopRound}
        onSetRoundStatus={setRoundStatus}
        onDeleteRound={deleteRound}
        onLaunchNewContest={launchNewContest}
      />

      <ContestRegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        contest={activeContest}
        activeRound={activeRound}
        onSubmitEntry={registerAndSubmitEntry}
      />

      <AdminRoundScoringModal
        isOpen={Boolean(scoringEntry)}
        onClose={() => setScoringEntry(null)}
        contest={activeContest}
        entry={scoringEntry}
        initialRoundId={activeRound?.id}
        onSaveRoundScore={awardRoundPoints}
      />

      <AILeaderboardDesignerModal
        isOpen={aiDesignerOpen}
        onClose={() => setAiDesignerOpen(false)}
      />
    </DashboardLayout>
  );
}

export default AdminContests;
