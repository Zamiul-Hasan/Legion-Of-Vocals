import { useState, useEffect, useCallback } from "react";
import soloLevelingBanner from "../assets/images/temp/solo-leveling-banner.jpg";
import demonSlayerBanner from "../assets/images/temp/Demon-Slayer-banner.jpg";
import blueLockBanner from "../assets/images/temp/blue-lock-banner.jpg";

const STORAGE_KEY = "lov_leaderboard_ai_theme_v1";
const SYNC_EVENT = "lov-leaderboard-theme-updated";

export const AI_LEADERBOARD_PRESETS = [
  {
    id: "shadow-monarch",
    name: "Shadow Monarch Aura (Solo Leveling)",
    prompt:
      "Solo Leveling Shadow Monarch abyssal purple & electric cyan aura with glowing monarch runes",
    bgGradient:
      "radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.32), transparent 45%), radial-gradient(circle at 80% 30%, rgba(6, 182, 212, 0.28), transparent 50%), linear-gradient(160deg, #050511 0%, #0f0a2c 50%, #040814 100%)",
    bgImage: soloLevelingBanner,
    bgOverlayOpacity: 0.84,
    accentHex: "#22d3ee",
    secondaryHex: "#a855f7",
    goldHex: "#facc15",
    cardBg: "rgba(15, 12, 38, 0.78)",
    borderGlow: "rgba(168, 85, 247, 0.45)",
    patternType: "runes",
    badgeStyle: "neon-pill",
    aiSummary:
      "AI synthesized an Abyssal Shadow Monarch theme featuring royal violet nebula lighting, cyan rank runes, and high-contrast glassmorphic podium cards.",
  },
  {
    id: "hinokami-crimson",
    name: "Hinokami Kagura Flame (Demon Slayer)",
    prompt:
      "Demon Slayer Hinokami Kagura blazing crimson & molten gold breathing embers in a dark night forest",
    bgGradient:
      "radial-gradient(circle at 25% 15%, rgba(239, 68, 68, 0.35), transparent 45%), radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.28), transparent 50%), linear-gradient(160deg, #140505 0%, #270909 50%, #090505 100%)",
    bgImage: demonSlayerBanner,
    bgOverlayOpacity: 0.84,
    accentHex: "#f97316",
    secondaryHex: "#ef4444",
    goldHex: "#fde047",
    cardBg: "rgba(32, 10, 10, 0.78)",
    borderGlow: "rgba(249, 115, 22, 0.45)",
    patternType: "embers",
    badgeStyle: "flame-pill",
    aiSummary:
      "AI crafted a Hinokami Flame Arena theme with warm ember gradients, molten gold rank highlights, and breathing-style crimson borders.",
  },
  {
    id: "egoist-stadium",
    name: "Egoist Cyber Stadium (Blue Lock)",
    prompt:
      "Blue Lock Egoist high-voltage cobalt blue stadium spotlights with geometric hexagonal energy grid",
    bgGradient:
      "radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.42), transparent 55%), radial-gradient(circle at 85% 80%, rgba(6, 182, 212, 0.3), transparent 50%), linear-gradient(180deg, #020817 0%, #07193d 55%, #020617 100%)",
    bgImage: blueLockBanner,
    bgOverlayOpacity: 0.82,
    accentHex: "#38bdf8",
    secondaryHex: "#2563eb",
    goldHex: "#facc15",
    cardBg: "rgba(7, 22, 54, 0.78)",
    borderGlow: "rgba(56, 189, 248, 0.5)",
    patternType: "cyber-grid",
    badgeStyle: " sharp-hex",
    aiSummary:
      "AI generated a Blue Lock Egoist Stadium atmosphere with tactical hexagonal grid overlays and high-intensity cobalt spotlights.",
  },
  {
    id: "cyberpunk-tokyo",
    name: "Neo-Tokyo Cyberpunk Holo",
    prompt:
      "Futuristic Neo-Tokyo anime dubbing studio with electric magenta, laser cyan, and synthwave grid",
    bgGradient:
      "radial-gradient(circle at 15% 25%, rgba(236, 72, 153, 0.35), transparent 45%), radial-gradient(circle at 85% 25%, rgba(6, 182, 212, 0.35), transparent 45%), linear-gradient(155deg, #090314 0%, #1d082b 50%, #040b1a 100%)",
    bgImage: "",
    bgOverlayOpacity: 0.88,
    accentHex: "#f472b6",
    secondaryHex: "#06b6d4",
    goldHex: "#fde047",
    cardBg: "rgba(24, 9, 38, 0.78)",
    borderGlow: "rgba(244, 114, 182, 0.5)",
    patternType: "cyber-grid",
    badgeStyle: "neon-pill",
    aiSummary:
      "AI designed a Neo-Tokyo holographic synthwave theme combining electric pink and laser cyan neon accents.",
  },
  {
    id: "royal-gala",
    name: "Royal Golden Championship Gala",
    prompt:
      "Grand Anime Awards Championship Gala with imperial gold, emerald prestige, and floating starlight",
    bgGradient:
      "radial-gradient(circle at 50% 10%, rgba(234, 179, 8, 0.32), transparent 50%), radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.22), transparent 50%), linear-gradient(170deg, #090a0f 0%, #17150a 50%, #050809 100%)",
    bgImage: "",
    bgOverlayOpacity: 0.86,
    accentHex: "#facc15",
    secondaryHex: "#10b981",
    goldHex: "#fef08a",
    cardBg: "rgba(23, 21, 12, 0.8)",
    borderGlow: "rgba(250, 204, 21, 0.48)",
    patternType: "starlight",
    badgeStyle: "royal-gold",
    aiSummary:
      "AI composed an Imperial Golden Gala theme with prestige emerald undertones and championship trophy illumination.",
  },
];

// Intelligent AI Prompt-to-Theme Synthesizer
export function synthesizeThemeFromPrompt(rawPrompt = "") {
  const p = rawPrompt.toLowerCase();

  if (
    p.includes("fire") ||
    p.includes("flame") ||
    p.includes("red") ||
    p.includes("crimson") ||
    p.includes("demon") ||
    p.includes("rengoku") ||
    p.includes("ember")
  ) {
    return {
      ...AI_LEADERBOARD_PRESETS[1],
      id: `ai-${Date.now()}`,
      name: "AI Custom: Crimson Flame Arena",
      prompt: rawPrompt,
      aiSummary: `AI analyzed "${rawPrompt}" and engineered a blazing crimson & molten gold leaderboard atmosphere with rising ember particles.`,
    };
  }

  if (
    p.includes("pink") ||
    p.includes("cyber") ||
    p.includes("neon") ||
    p.includes("tokyo") ||
    p.includes("synth") ||
    p.includes("magenta")
  ) {
    return {
      ...AI_LEADERBOARD_PRESETS[3],
      id: `ai-${Date.now()}`,
      name: "AI Custom: Cyber Neon Matrix",
      prompt: rawPrompt,
      aiSummary: `AI analyzed "${rawPrompt}" and generated a futuristic neon magenta & cyan holographic grid leaderboard.`,
    };
  }

  if (
    p.includes("gold") ||
    p.includes("royal") ||
    p.includes("crown") ||
    p.includes("emerald") ||
    p.includes("green") ||
    p.includes("luxury") ||
    p.includes("gala")
  ) {
    return {
      ...AI_LEADERBOARD_PRESETS[4],
      id: `ai-${Date.now()}`,
      name: "AI Custom: Imperial Gold & Emerald",
      prompt: rawPrompt,
      aiSummary: `AI analyzed "${rawPrompt}" and crafted a championship gold & emerald starlight leaderboard theme.`,
    };
  }

  if (
    p.includes("blue") ||
    p.includes("stadium") ||
    p.includes("ocean") ||
    p.includes("ice") ||
    p.includes("ego") ||
    p.includes("electric")
  ) {
    return {
      ...AI_LEADERBOARD_PRESETS[2],
      id: `ai-${Date.now()}`,
      name: "AI Custom: Electric Cobalt Arena",
      prompt: rawPrompt,
      aiSummary: `AI analyzed "${rawPrompt}" and built a high-voltage cobalt & sky-cyan tactical arena leaderboard.`,
    };
  }

  if (
    p.includes("shadow") ||
    p.includes("purple") ||
    p.includes("solo") ||
    p.includes("dark") ||
    p.includes("violet") ||
    p.includes("monarch")
  ) {
    return {
      ...AI_LEADERBOARD_PRESETS[0],
      id: `ai-${Date.now()}`,
      name: "AI Custom: Shadow Monarch Sovereign",
      prompt: rawPrompt,
      aiSummary: `AI analyzed "${rawPrompt}" and synthesized a dark violet & neon cyan Shadow Monarch sovereign theme.`,
    };
  }

  // Dynamic deterministic hash from any custom user prompt
  let hash = 0;
  for (let i = 0; i < rawPrompt.length; i++) {
    hash = rawPrompt.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 65) % 360;
  const patterns = ["runes", "embers", "cyber-grid", "starlight"];
  const chosenPattern = patterns[Math.abs(hash) % patterns.length];

  return {
    id: `ai-${Date.now()}`,
    name: `AI Generated: ${rawPrompt.slice(0, 28)}${
      rawPrompt.length > 28 ? "..." : ""
    }`,
    prompt: rawPrompt,
    bgGradient: `radial-gradient(circle at 20% 20%, hsla(${hue1}, 85%, 55%, 0.32), transparent 48%), radial-gradient(circle at 80% 75%, hsla(${hue2}, 85%, 55%, 0.28), transparent 50%), linear-gradient(160deg, hsl(${hue1}, 45%, 6%) 0%, hsl(${hue2}, 40%, 10%) 55%, #030712 100%)`,
    bgImage: "",
    bgOverlayOpacity: 0.85,
    accentHex: `hsl(${hue1}, 90%, 60%)`,
    secondaryHex: `hsl(${hue2}, 85%, 58%)`,
    goldHex: "#facc15",
    cardBg: `hsla(${hue1}, 35%, 10%, 0.78)`,
    borderGlow: `hsla(${hue1}, 90%, 60%, 0.45)`,
    patternType: chosenPattern,
    badgeStyle: "neon-pill",
    aiSummary: `AI custom-generated a bespoke multi-stop atmospheric palette and ${chosenPattern} particle field tailored to "${rawPrompt}".`,
  };
}

function loadTheme() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return AI_LEADERBOARD_PRESETS[0];
    const parsed = JSON.parse(raw);
    return parsed && parsed.name ? parsed : AI_LEADERBOARD_PRESETS[0];
  } catch {
    return AI_LEADERBOARD_PRESETS[0];
  }
}

function saveTheme(themeObj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(themeObj));
    window.dispatchEvent(new Event(SYNC_EVENT));
  } catch {
    // ignore quota errors
  }
}

export function useLeaderboardTheme() {
  const [theme, setThemeState] = useState(() => loadTheme());

  useEffect(() => {
    const sync = () => setThemeState(loadTheme());
    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const applyTheme = useCallback((nextTheme) => {
    saveTheme(nextTheme);
    setThemeState(nextTheme);
  }, []);

  const generateWithAI = useCallback((promptText) => {
    const generated = synthesizeThemeFromPrompt(promptText);
    saveTheme(generated);
    setThemeState(generated);
    return generated;
  }, []);

  const updateThemeField = useCallback((updates) => {
    const current = loadTheme();
    const next = { ...current, ...updates };
    saveTheme(next);
    setThemeState(next);
  }, []);

  return {
    theme,
    presets: AI_LEADERBOARD_PRESETS,
    applyTheme,
    generateWithAI,
    updateThemeField,
  };
}
