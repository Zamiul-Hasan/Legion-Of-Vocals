import { useState } from "react";

export default function SharinganSeals() {
  const [activeSeal, setActiveSeal] = useState(null);

  const seals = [
    {
      id: "sharingan",
      name: "3-Tomoe Sharingan",
      role: "Voice Acting Division",
      desc: "Capturing every subtle emotion and dramatic inflection.",
      renderIcon: () => (
        <svg viewBox="0 0 100 100" className="w-9 h-9">
          <circle cx="50" cy="50" r="46" fill="#0f1117" stroke="#334155" strokeWidth="3" />
          <circle cx="50" cy="50" r="32" fill="#181a20" stroke="#475569" strokeWidth="2" />
          <circle cx="50" cy="50" r="7" fill="#cbd5e1" />
          {/* Tomoe 1 */}
          <path d="M50 25 C45 25 42 29 42 33 C42 37 46 40 50 37 C54 34 50 27 50 25 Z" fill="#cbd5e1" />
          {/* Tomoe 2 */}
          <path d="M68 62 C65 65 61 67 58 64 C55 61 56 56 60 55 C64 54 68 59 68 62 Z" fill="#cbd5e1" />
          {/* Tomoe 3 */}
          <path d="M32 62 C35 65 39 67 42 64 C45 61 44 56 40 55 C36 54 32 59 32 62 Z" fill="#cbd5e1" />
        </svg>
      ),
    },
    {
      id: "mangekyo",
      name: "Sasuke Mangekyo",
      role: "Sound FX & Audio Lead",
      desc: "Chidori lightning precision sound mixing & mastering.",
      renderIcon: () => (
        <svg viewBox="0 0 100 100" className="w-10 h-10">
          <circle cx="50" cy="50" r="46" fill="#0f1117" stroke="#334155" strokeWidth="3" />
          <circle cx="50" cy="50" r="10" fill="#cbd5e1" />
          {/* 6-point atomic petals of Sasuke's Mangekyo */}
          <g stroke="#cbd5e1" strokeWidth="3" fill="none">
            <ellipse cx="50" cy="50" rx="30" ry="11" />
            <ellipse cx="50" cy="50" rx="30" ry="11" transform="rotate(60 50 50)" />
            <ellipse cx="50" cy="50" rx="30" ry="11" transform="rotate(120 50 50)" />
          </g>
        </svg>
      ),
    },
    {
      id: "rinnegan",
      name: "Eternal Rinnegan",
      role: "Translation & Dubbing",
      desc: "Translating spirit, emotion, and story without boundaries.",
      renderIcon: () => (
        <svg viewBox="0 0 100 100" className="w-9 h-9">
          <circle cx="50" cy="50" r="46" fill="#0f1117" stroke="#334155" strokeWidth="3" />
          {/* Concentric ripples */}
          <circle cx="50" cy="50" r="36" fill="none" stroke="#64748b" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="26" fill="none" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="50" cy="50" r="16" fill="none" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="50" cy="50" r="6" fill="#f8fafc" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative flex items-center gap-4">
      {seals.map((seal) => (
        <div
          key={seal.id}
          className="relative group cursor-pointer"
          onMouseEnter={() => setActiveSeal(seal.id)}
          onMouseLeave={() => setActiveSeal(null)}
        >
          <div className="w-14 h-14 rounded-full bg-slate-950 border-2 border-slate-700/80 shadow-lg flex items-center justify-center p-1.5 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]">
            <div className="sharingan-spin transition-transform duration-700">
              {seal.renderIcon()}
            </div>
          </div>

          {/* Tooltip on hover */}
          {activeSeal === seal.id && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 rounded-2xl bg-slate-950/95 border border-blue-500/40 text-left shadow-2xl backdrop-blur-xl z-30 pointer-events-none animate-fadeIn">
              <p className="text-xs font-black text-blue-400">{seal.name}</p>
              <p className="text-[11px] font-bold text-white mt-0.5">{seal.role}</p>
              <p className="text-[10px] text-gray-400 mt-1 leading-tight">{seal.desc}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
