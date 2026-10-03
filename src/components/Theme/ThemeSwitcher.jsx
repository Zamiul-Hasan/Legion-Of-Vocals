import { useTheme } from "../../context/ThemeContext";
import { Zap, Moon, Sparkles, RefreshCw } from "lucide-react";

export default function ThemeSwitcher({ compact = false }) {
  const { theme, toggleTheme, isSasuke } = useTheme();

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        title={
          isSasuke
            ? "Switch to Classic Dark Neon Theme"
            : "Switch to Sasuke Matte Silver & Cobalt Blue Theme"
        }
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm ${
          isSasuke
            ? "bg-slate-900 hover:bg-slate-800 text-blue-400 border border-blue-500/40 shadow-blue-500/10"
            : "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40"
        }`}
      >
        {isSasuke ? (
          <>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <Zap size={14} className="text-blue-400" />
            <span className="hidden sm:inline">Theme: ⚡ Sasuke Uchiha</span>
            <span className="sm:hidden">⚡ Sasuke</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <Moon size={14} className="text-cyan-400" />
            <span className="hidden sm:inline">Theme: 🌌 Classic Neon</span>
            <span className="sm:hidden">🌌 Classic</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 p-1.5 rounded-full bg-slate-950/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl">
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
          isSasuke
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
            : "text-gray-400 hover:text-white"
        }`}
      >
        <Zap size={13} className="text-blue-300 animate-pulse" />
        ⚡ Sasuke Silver
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
          !isSasuke
            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/30"
            : "text-gray-400 hover:text-white"
        }`}
      >
        <Moon size={13} />
        🌌 Classic Neon
      </button>

      <div className="hidden lg:block pl-2 pr-3 text-[11px] text-gray-400 border-l border-slate-800">
        {isSasuke ? "New Sasuke theme active" : "Classic theme active"}
      </div>
    </div>
  );
}
