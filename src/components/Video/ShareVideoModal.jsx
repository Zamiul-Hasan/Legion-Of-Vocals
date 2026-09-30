import { useState, useMemo } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  Code2,
  Clock,
  Send,
  Globe,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Video,
} from "lucide-react";

function convertTimeToSeconds(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(":").map((n) => parseInt(n, 10) || 0);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return parts[0] || 0;
}

export default function ShareVideoModal({
  isOpen,
  onClose,
  video,
  projectTitle = "Legion of Vocals",
  onShareSuccess,
}) {
  const [caption, setCaption] = useState("");
  const [startAtEnabled, setStartAtEnabled] = useState(false);
  const [startAtTime, setStartAtTime] = useState("0:30");
  const [showEmbed, setShowEmbed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [shareFeedback, setShareFeedback] = useState("");

  const shareUrl = useMemo(() => {
    if (!video) return window.location.origin;
    const base =
      video.videoUrl && video.videoUrl !== "#"
        ? video.videoUrl
        : `${window.location.origin}/projects/${video.projectId || 1}?video=${
            video.id
          }`;
    if (!startAtEnabled) return base;
    const secs = convertTimeToSeconds(startAtTime);
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}t=${secs}s`;
  }, [video, startAtEnabled, startAtTime]);

  if (!isOpen || !video) return null;

  const fullShareText = caption.trim()
    ? `${caption.trim()} — Watch "${video.title}" (${projectTitle} Bangla Dub) by Legion of Vocals!`
    : `🎬 Watch "${video.title}" (${projectTitle} Bangla Dub) by Legion of Vocals!`;

  const embedCode = `<iframe width="560" height="315" src="${shareUrl}" title="${video.title} - ${projectTitle}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;

  const triggerFeedback = (msg, platform) => {
    setShareFeedback(msg);
    if (onShareSuccess) onShareSuccess(video.id, platform);
    setTimeout(() => setShareFeedback(""), 3500);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // fallback
    }
    setCopiedLink(true);
    triggerFeedback("Video link copied to clipboard!", "Copy Link");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
    } catch {
      // fallback
    }
    setCopiedEmbed(true);
    triggerFeedback("Embed iframe code copied!", "Embed Code");
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  const handlePlatformShare = async (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(fullShareText);

    if (platform === "Facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
        "_blank",
        "width=640,height=520,noopener,noreferrer"
      );
      triggerFeedback("Opened Facebook Share dialog!", "Facebook");
    } else if (platform === "YouTube") {
      try {
        await navigator.clipboard.writeText(`${fullShareText}\n${shareUrl}`);
      } catch {
        // ignore
      }
      window.open(
        "https://www.youtube.com/@legionofvocals/community",
        "_blank",
        "noopener,noreferrer"
      );
      triggerFeedback(
        "Copied post text & link for YouTube Community!",
        "YouTube"
      );
    } else if (platform === "WhatsApp") {
      window.open(
        `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
        "_blank",
        "noopener,noreferrer"
      );
      triggerFeedback("Opened WhatsApp Share!", "WhatsApp");
    } else if (platform === "Telegram") {
      window.open(
        `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
        "_blank",
        "noopener,noreferrer"
      );
      triggerFeedback("Opened Telegram Share!", "Telegram");
    } else if (platform === "X") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
        "_blank",
        "width=640,height=480,noopener,noreferrer"
      );
      triggerFeedback("Opened X (Twitter) Share!", "X");
    } else if (platform === "Discord") {
      try {
        await navigator.clipboard.writeText(
          `**${video.title}** • *${projectTitle}*\n${fullShareText}\n${shareUrl}`
        );
      } catch {
        // ignore
      }
      triggerFeedback(
        "Copied formatted Discord / Messenger video card!",
        "Discord"
      );
    } else if (platform === "Native" && navigator.share) {
      try {
        await navigator.share({
          title: `${video.title} - ${projectTitle}`,
          text: fullShareText,
          url: shareUrl,
        });
        triggerFeedback("Shared via device share sheet!", "Device Share");
      } catch {
        // user cancelled
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-cyan-950/50 text-white">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Share Published Dub Video
              </h2>
              <p className="text-xs text-slate-400">
                Share to Facebook, YouTube, WhatsApp, or embed anywhere
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Feedback Banner */}
          {shareFeedback && (
            <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{shareFeedback}</span>
            </div>
          )}

          {/* Video Preview Card (Facebook / YouTube style) */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="relative w-28 h-18 rounded-xl overflow-hidden shrink-0 bg-slate-900">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-950/90 text-[10px] font-bold text-white">
                {video.duration}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <span className="inline-block px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-semibold text-cyan-400">
                {projectTitle}
              </span>
              <h3 className="text-sm font-bold text-white truncate mt-1">
                {video.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                By {video.uploadedBy} • {video.views || 0} views •{" "}
                <span className="text-cyan-400 font-semibold">
                  {video.shares || 0} shares
                </span>
              </p>
            </div>
          </div>

          {/* Facebook-Style Caption Box */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Write a post caption (Facebook / YouTube style)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Say something about this Bangla dub episode..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Social Share Icons Row (Like YouTube & Facebook Share) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Share Directly To
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {/* Facebook */}
              <button
                type="button"
                onClick={() => handlePlatformShare("Facebook")}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/30 text-white transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-105 transition">
                  f
                </div>
                <span className="text-[11px] font-semibold text-slate-200">
                  Facebook
                </span>
              </button>

              {/* YouTube */}
              <button
                type="button"
                onClick={() => handlePlatformShare("YouTube")}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#FF0000]/15 hover:bg-[#FF0000]/25 border border-[#FF0000]/30 text-white transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition">
                  <Video className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-200">
                  YouTube
                </span>
              </button>

              {/* WhatsApp */}
              <button
                type="button"
                onClick={() => handlePlatformShare("WhatsApp")}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-white transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-slate-950 font-bold shadow-lg group-hover:scale-105 transition">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-200">
                  WhatsApp
                </span>
              </button>

              {/* Discord / Messenger */}
              <button
                type="button"
                onClick={() => handlePlatformShare("Discord")}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#5865F2]/15 hover:bg-[#5865F2]/25 border border-[#5865F2]/30 text-white transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-200">
                  Discord
                </span>
              </button>

              {/* Telegram */}
              <button
                type="button"
                onClick={() => handlePlatformShare("Telegram")}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#0088cc]/15 hover:bg-[#0088cc]/25 border border-[#0088cc]/30 text-white transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition">
                  <Send className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-200">
                  Telegram
                </span>
              </button>

              {/* X / Twitter */}
              <button
                type="button"
                onClick={() => handlePlatformShare("X")}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-white font-black text-base shadow-lg group-hover:scale-105 transition">
                  𝕏
                </div>
                <span className="text-[11px] font-semibold text-slate-200">
                  Post on X
                </span>
              </button>
            </div>
          </div>

          {/* YouTube-Style "Start at [0:30]" Timestamp Option + Embed Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <label className="inline-flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={startAtEnabled}
                onChange={(e) => setStartAtEnabled(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Start at</span>
              <input
                type="text"
                value={startAtTime}
                disabled={!startAtEnabled}
                onChange={(e) => setStartAtTime(e.target.value)}
                className="w-16 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400 text-center disabled:opacity-40 focus:outline-none focus:border-cyan-400"
              />
            </label>

            <div className="flex items-center gap-2">
              {typeof navigator !== "undefined" && navigator.share && (
                <button
                  type="button"
                  onClick={() => handlePlatformShare("Native")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  More Apps
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowEmbed((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  showEmbed
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:border-cyan-500/40"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Embed Video
              </button>
            </div>
          </div>

          {/* Copyable Direct Video Link (YouTube style) */}
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950 border border-slate-800">
            <Globe className="w-4 h-4 text-cyan-400 ml-2 shrink-0" />
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-xs text-slate-300 font-mono outline-none truncate"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer shrink-0"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Link
                </>
              )}
            </button>
          </div>

          {/* Optional Embed Iframe Box */}
          {showEmbed && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-400">
                  HTML Embed Code (YouTube-style iframe)
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmbed}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-semibold transition cursor-pointer"
                >
                  {copiedEmbed ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copied Embed
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
              <textarea
                readOnly
                rows={3}
                value={embedCode}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
