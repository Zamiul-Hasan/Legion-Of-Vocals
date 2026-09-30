import { useState, useRef, useEffect } from "react";
import { Heart } from "lucide-react";
import { REACTION_TYPES } from "../../hooks/useDubVideos";

export default function ReactionButton({
  video,
  onReact,
  disabled = false,
  size = "sm", // 'sm' | 'md'
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [justReacted, setJustReacted] = useState(false);
  const hoverTimeout = useRef(null);
  const containerRef = useRef(null);

  const myReactionObj = REACTION_TYPES.find((r) => r.id === video?.myReaction);
  const totalReactions = Number(video?.likes) || 0;

  // Compute top 3 active emojis from video.reactions
  const activeEmojis = REACTION_TYPES.filter(
    (r) => (video?.reactions?.[r.id] || 0) > 0
  )
    .sort((a, b) => (video?.reactions?.[b.id] || 0) - (video?.reactions?.[a.id] || 0))
    .slice(0, 3);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (disabled) return;
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setPickerOpen(true);
    }, 180);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setPickerOpen(false);
    }, 280);
  };

  const handleSelectReaction = (e, reactionId) => {
    e.stopPropagation();
    if (disabled) return;
    setJustReacted(true);
    setPickerOpen(false);
    if (onReact) onReact(video.id, reactionId);
    setTimeout(() => setJustReacted(false), 350);
  };

  const handleMainButtonClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    setJustReacted(true);
    const targetReaction = video?.myReaction || "love";
    if (onReact) onReact(video.id, targetReaction);
    setTimeout(() => setJustReacted(false), 350);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-flex items-center"
    >
      {/* Floating Facebook-Style Reaction Bar */}
      {pickerOpen && !disabled && (
        <div className="absolute bottom-full left-0 mb-2 z-40 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-900/95 border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          {REACTION_TYPES.map((r) => {
            const isSelected = video?.myReaction === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={(e) => handleSelectReaction(e, r.id)}
                title={r.label}
                className={`group/emoji relative w-8 h-8 rounded-full flex items-center justify-center text-lg hover:scale-125 hover:-translate-y-1 transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500/25 ring-1 ring-cyan-400 scale-110"
                    : "hover:bg-slate-800"
                }`}
              >
                <span>{r.emoji}</span>
                <span className="pointer-events-none absolute -top-6 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[9px] font-bold text-white opacity-0 group-hover/emoji:opacity-100 transition whitespace-nowrap">
                  {r.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Reaction Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleMainButtonClick}
        className={`inline-flex items-center gap-1.5 rounded-xl border transition select-none cursor-pointer ${
          size === "md" ? "px-4 py-2 text-sm" : "px-2.5 py-1 text-xs"
        } ${
          justReacted ? "scale-110" : "scale-100"
        } ${
          myReactionObj
            ? "bg-cyan-500/15 border-cyan-400/50 text-white font-bold shadow-sm shadow-cyan-500/20"
            : "bg-slate-950/80 border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white"
        }`}
      >
        {myReactionObj ? (
          <span className="text-sm leading-none">{myReactionObj.emoji}</span>
        ) : activeEmojis.length > 0 ? (
          <span className="flex -space-x-1">
            {activeEmojis.slice(0, 2).map((e) => (
              <span key={e.id} className="text-xs leading-none">
                {e.emoji}
              </span>
            ))}
          </span>
        ) : (
          <Heart className="w-3.5 h-3.5 text-pink-400" />
        )}

        <span className={myReactionObj ? myReactionObj.color : ""}>
          {myReactionObj ? myReactionObj.label : "React"}
        </span>

        <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-[11px] font-bold text-slate-200">
          {totalReactions}
        </span>
      </button>
    </div>
  );
}
