import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Trophy,
  Sliders,
  Sparkles,
  CheckCircle2,
  Mic2,
  Film,
  Flame,
  Star,
} from "lucide-react";
import { getEntryPointsSummary } from "../../hooks/useContests";

function AdminRoundScoringModal({
  isOpen,
  onClose,
  contest,
  entry,
  initialRoundId,
  onSaveRoundScore,
}) {
  const rounds = contest?.rounds || [];
  const [selectedRoundId, setSelectedRoundId] = useState(
    initialRoundId || contest?.activeRoundId || rounds[0]?.id || "round-1"
  );
  const [vocal, setVocal] = useState(35);
  const [sync, setSync] = useState(25);
  const [emotion, setEmotion] = useState(25);
  const [bonus, setBonus] = useState(10);
  const [note, setNote] = useState("");
  const [savedToast, setSavedToast] = useState("");

  useEffect(() => {
    if (!isOpen || !entry) return;
    const targetR =
      initialRoundId || contest?.activeRoundId || rounds[0]?.id || "round-1";
    setSelectedRoundId(targetR);
  }, [isOpen, entry, initialRoundId, contest]);

  useEffect(() => {
    if (!entry || !selectedRoundId) return;
    const existing = entry.roundScores?.[selectedRoundId];
    if (existing && typeof existing === "object") {
      setVocal(Number(existing.vocal) || 0);
      setSync(Number(existing.sync) || 0);
      setEmotion(Number(existing.emotion) || 0);
      setBonus(Number(existing.bonus) || 0);
      setNote(existing.note || "");
    } else if (typeof existing === "number") {
      setVocal(Math.min(40, existing));
      setSync(0);
      setEmotion(0);
      setBonus(Math.max(0, existing - 40));
      setNote("");
    } else {
      setVocal(35);
      setSync(26);
      setEmotion(26);
      setBonus(5);
      setNote("");
    }
    setSavedToast("");
  }, [entry, selectedRoundId]);

  if (!isOpen || !contest || !entry) return null;

  const roundTotal =
    Number(vocal) + Number(sync) + Number(emotion) + Number(bonus);
  const summary = getEntryPointsSummary(entry, rounds);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveRoundScore(contest.id, entry.id, selectedRoundId, {
      vocal: Number(vocal),
      sync: Number(sync),
      emotion: Number(emotion),
      bonus: Number(bonus),
      total: roundTotal,
      note: note.trim(),
    });
    const roundObj = rounds.find((r) => r.id === selectedRoundId);
    setSavedToast(
      `Awarded ${roundTotal} pts to ${entry.participantName} for ${
        roundObj?.title || selectedRoundId
      }!`
    );
    setTimeout(() => setSavedToast(""), 2800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-cyan-500/35 shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 bg-slate-950 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <img
                src={entry.avatar}
                alt={entry.participantName}
                className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400"
              />
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  Judge Round Scorecard: {entry.participantName}
                </h3>
                <p className="text-xs text-cyan-400">
                  {entry.contestantCode} • {entry.participantType} •{" "}
                  {entry.characterAndAnime}
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

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {savedToast && (
              <div className="p-3.5 rounded-2xl bg-green-500/15 border border-green-500/30 text-green-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} />
                {savedToast}
              </div>
            )}

            {/* Round Selector Pills */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Select Round to Score
              </label>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {rounds.map((r) => {
                  const isSelected = r.id === selectedRoundId;
                  const existingPts = summary.perRound[r.id]?.total || 0;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRoundId(r.id)}
                      className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-cyan-500/15 border-2 border-cyan-400 text-white"
                          : "bg-slate-950 border-slate-800 text-gray-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-cyan-400">
                          Round {r.roundNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300 text-xs font-black">
                          {existingPts} pts
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-white mt-1 truncate">
                        {r.title}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scoring Sliders */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/20 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sliders size={14} />
                  Round Performance Breakdown
                </span>
                <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-sm">
                  Round Total: {roundTotal} pts
                </span>
              </div>

              {/* Vocal Acting (0-40) */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-200 flex items-center gap-1.5">
                    <Mic2 size={14} className="text-cyan-400" />
                    Vocal Delivery & Voice Acting (Max 40)
                  </span>
                  <span className="text-cyan-400">{vocal} / 40 pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={vocal}
                  onChange={(e) => setVocal(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Lip-Sync & Timing (0-30) */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-200 flex items-center gap-1.5">
                    <Film size={14} className="text-purple-400" />
                    Lip-Sync Accuracy & Bangla Timing (Max 30)
                  </span>
                  <span className="text-purple-400">{sync} / 30 pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={sync}
                  onChange={(e) => setSync(Number(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
              </div>

              {/* Emotion & Impact (0-30) */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-200 flex items-center gap-1.5">
                    <Flame size={14} className="text-orange-400" />
                    Character Emotion & Intensity (Max 30)
                  </span>
                  <span className="text-orange-400">{emotion} / 30 pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={emotion}
                  onChange={(e) => setEmotion(Number(e.target.value))}
                  className="w-full accent-orange-400 cursor-pointer"
                />
              </div>

              {/* Judge Bonus Points (0-50) */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-200 flex items-center gap-1.5">
                    <Star size={14} className="text-yellow-400" />
                    Judge Special Bonus / SFX Creativity (0–50)
                  </span>
                  <span className="text-yellow-400">+{bonus} pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={bonus}
                  onChange={(e) => setBonus(Number(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
              </div>

              {/* Judge Feedback Note */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Judge Feedback Note for this Round
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Goosebump-inducing scream and crisp Bangla pronunciation!"
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Cumulative Summary Strip */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-gray-400">All Rounds Judge Score: </span>
                <strong className="text-cyan-400">
                  {summary.judgeTotal} pts
                </strong>
              </div>
              <div>
                <span className="text-gray-400">Total Leaderboard Score: </span>
                <strong className="text-yellow-400 text-sm">
                  {summary.grandTotal} pts
                </strong>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-gray-300 text-sm font-semibold cursor-pointer"
              >
                Done
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 transition cursor-pointer"
              >
                <Trophy size={16} />
                Save Round {
                  rounds.find((r) => r.id === selectedRoundId)?.roundNumber
                }{" "}
                Points ({roundTotal} pts)
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AdminRoundScoringModal;
