import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Wand2,
  Sparkles,
  Palette,
  ImagePlus,
  Check,
  Crown,
} from "lucide-react";
import { useLeaderboardTheme } from "../../hooks/useLeaderboardTheme";

const SAMPLE_AI_PROMPTS = [
  "Solo Leveling Shadow Monarch dark purple & cyan aura with glowing runes",
  "Demon Slayer Hinokami Kagura blazing crimson fire & gold embers",
  "Blue Lock Egoist electric cobalt stadium lights with hex grid",
  "Neo-Tokyo Cyberpunk magenta & laser cyan holographic synthwave",
  "Royal Golden Championship Gala with emerald prestige & starlight",
];

function AILeaderboardDesignerModal({ isOpen, onClose }) {
  const { theme, presets, applyTheme, generateWithAI, updateThemeField } =
    useLeaderboardTheme();

  const [promptInput, setPromptInput] = useState(theme.prompt || "");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleRunAIDesign = (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      generateWithAI(promptInput.trim());
      setIsGenerating(false);
    }, 550);
  };

  const handleUploadCustomBg = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateThemeField({
          bgImage: reader.result,
          name: `${theme.name.split(" (")[0]} (Custom Backdrop)`,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-cyan-500/35 shadow-[0_0_60px_rgba(6,182,212,0.28)] overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 bg-slate-950 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500/25 to-cyan-500/25 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <Wand2 size={22} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  AI Leaderboard Background & Theme Studio
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[10px] font-black uppercase">
                    AI Powered
                  </span>
                </h3>
                <p className="text-xs text-gray-400">
                  Describe any anime mood, color palette, or atmosphere and AI will design the Leaderboard background & theme live
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

          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Live Preview of Current AI Theme */}
            <div
              className="relative rounded-3xl overflow-hidden border-2 p-6 transition-all duration-500"
              style={{
                background: theme.bgGradient,
                borderColor: theme.borderGlow,
              }}
            >
              {theme.bgImage && (
                <img
                  src={theme.bgImage}
                  alt="AI Theme Backdrop"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-30 pointer-events-none"
                />
              )}

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.55)",
                      color: theme.accentHex,
                      border: `1px solid ${theme.borderGlow}`,
                    }}
                  >
                    <Sparkles size={13} />
                    Active Theme: {theme.name}
                  </span>
                  <p className="text-xs text-gray-200 mt-2 max-w-xl leading-relaxed">
                    {theme.aiSummary}
                  </p>
                </div>

                {/* Mini Podium Card Preview */}
                <div
                  className="px-4 py-3 rounded-2xl border backdrop-blur-md flex items-center gap-3 shrink-0"
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor: theme.borderGlow,
                  }}
                >
                  <Crown size={22} style={{ color: theme.goldHex }} />
                  <div>
                    <p className="text-xs font-black text-white">#1 Champion</p>
                    <p
                      className="text-xs font-bold"
                      style={{ color: theme.accentHex }}
                    >
                      314 PTS • {theme.patternType.toUpperCase()} FX
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Prompt Generator Form */}
            <form
              onSubmit={handleRunAIDesign}
              className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3"
            >
              <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Wand2 size={14} />
                Describe Your Leaderboard Theme to AI
              </label>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g. Solo Leveling dark purple & neon cyan aura with glowing runes..."
                  className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 transition cursor-pointer shrink-0"
                >
                  <Sparkles
                    size={16}
                    className={isGenerating ? "animate-spin" : ""}
                  />
                  {isGenerating ? "AI Designing..." : "✨ Generate with AI"}
                </button>
              </div>

              {/* Quick Sample AI Prompts */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SAMPLE_AI_PROMPTS.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setPromptInput(sample);
                      generateWithAI(sample);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-gray-300 transition cursor-pointer"
                  >
                    ✨ {sample.slice(0, 42)}...
                  </button>
                ))}
              </div>
            </form>

            {/* Curated AI Studio Theme Presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5 flex items-center gap-1.5">
                <Palette size={14} className="text-cyan-400" />
                1-Click AI Studio Theme Presets
              </label>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {presets.map((preset) => {
                  const isCurrent = theme.name === preset.name;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setPromptInput(preset.prompt);
                        applyTheme(preset);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition relative overflow-hidden cursor-pointer ${
                        isCurrent
                          ? "border-2 border-cyan-400 ring-2 ring-cyan-400/20"
                          : "border-slate-800 hover:border-slate-600"
                      }`}
                      style={{ background: preset.bgGradient }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-white/40 shrink-0"
                          style={{ backgroundColor: preset.accentHex }}
                        />
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black flex items-center gap-0.5">
                            <Check size={10} /> Active
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-white text-xs mt-2">
                        {preset.name}
                      </p>
                      <p className="text-[11px] text-gray-300 mt-0.5 capitalize">
                        FX: {preset.patternType}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fine-Tune Colors, Particle FX & Custom Background Image */}
            <div className="grid sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Primary Neon Accent
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={
                      theme.accentHex?.startsWith("#")
                        ? theme.accentHex
                        : "#22d3ee"
                    }
                    onChange={(e) =>
                      updateThemeField({
                        accentHex: e.target.value,
                        borderGlow: `${e.target.value}77`,
                      })
                    }
                    className="w-10 h-9 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-gray-300">
                    {theme.accentHex}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Atmospheric Particle FX
                </label>
                <select
                  value={theme.patternType || "runes"}
                  onChange={(e) =>
                    updateThemeField({ patternType: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="runes">Shadow Monarch Runes</option>
                  <option value="embers">Hinokami Fire Embers</option>
                  <option value="cyber-grid">Cyberpunk Hex Grid</option>
                  <option value="starlight">Golden Gala Starlight</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Custom Background Image
                </label>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/30 cursor-pointer">
                    <ImagePlus size={14} />
                    Upload BG
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadCustomBg}
                      className="hidden"
                    />
                  </label>
                  {theme.bgImage && (
                    <button
                      type="button"
                      onClick={() => updateThemeField({ bgImage: "" })}
                      className="px-2.5 py-2 rounded-xl bg-red-500/15 text-red-300 text-xs font-bold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20 transition cursor-pointer"
              >
                Apply AI Leaderboard Theme
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AILeaderboardDesignerModal;
