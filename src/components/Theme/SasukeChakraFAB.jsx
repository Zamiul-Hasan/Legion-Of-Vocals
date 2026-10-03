import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { Zap, Trophy, Video, Users, Sparkles, X } from "lucide-react";

export default function SasukeChakraFAB() {
  const { isSasuke, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  if (!isSasuke) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expanded Quick Menu */}
      {open && (
        <div className="absolute bottom-18 right-0 w-64 p-4 rounded-3xl bg-slate-950/95 border border-blue-500/40 shadow-2xl backdrop-blur-xl space-y-3 mb-2 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
              <span className="text-xs font-black text-white">Chidori Quick Portal</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg"
            >
              <X size={15} />
            </button>
          </div>

          <div className="space-y-1.5 text-xs font-bold">
            <Link
              to="/projects"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 p-2 rounded-xl text-gray-200 hover:bg-blue-600 hover:text-white transition"
            >
              <Video size={16} className="text-blue-400" />
              Watch Anime Dubs
            </Link>

            <Link
              to="/contests"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 p-2 rounded-xl text-gray-200 hover:bg-blue-600 hover:text-white transition"
            >
              <Trophy size={16} className="text-amber-400" />
              Contest Arena & Leaderboard
            </Link>

            <a
              href="https://www.facebook.com/share/g/19MxBAkZsX/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-xl text-gray-200 hover:bg-[#1877F2] hover:text-white transition"
            >
              <Users size={16} className="text-[#1877F2]" />
              LOV Facebook Community
            </a>

            <button
              type="button"
              onClick={() => {
                toggleTheme();
                setOpen(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-xl text-amber-300 hover:bg-slate-900 border border-amber-500/20 transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Zap size={14} />
                Switch to Classic Theme
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20">Revert</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button (Matching the "Ai." circle button in reference image) */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title="LOV Chidori Quick Menu & Theme Controls"
        className="relative group p-1.5 rounded-full bg-slate-950 border-2 border-slate-700/80 shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition hover:scale-105 hover:border-blue-500 cursor-pointer"
      >
        <div className="w-13 h-13 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center text-white font-black shadow-inner shadow-blue-400/50">
          <span className="text-sm tracking-tighter leading-none font-black">Ai.</span>
          <span className="text-[8px] font-bold text-blue-200 uppercase tracking-widest">LOV</span>
        </div>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-400 border-2 border-slate-950 animate-ping" />
      </button>
    </div>
  );
}
