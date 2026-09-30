import { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Camera,
  Sparkles,
  Check,
  RefreshCw,
  Globe,
} from "lucide-react";
import defaultLogo from "../../assets/images/logos/logo.png";
import blueLockBanner from "../../assets/images/temp/blue-lock-banner.jpg";
import demonSlayerBanner from "../../assets/images/temp/Demon-Slayer-banner.jpg";
import soloLevelingBanner from "../../assets/images/temp/solo-leveling-banner.jpg";

const AVATAR_PRESETS = [
  { label: "LOV Emblem", url: defaultLogo },
  { label: "Solo Leveling", url: soloLevelingBanner },
  { label: "Demon Slayer", url: demonSlayerBanner },
  { label: "Blue Lock", url: blueLockBanner },
];

const FRAME_BADGES = [
  { id: "", label: "No Frame" },
  { id: "🎙 Recording", label: "🎙 Recording" },
  { id: "🎬 LOV Verified", label: "🎬 LOV Verified" },
  { id: "🔥 Open for Dubs", label: "🔥 Open for Dubs" },
  { id: "👑 Studio Lead", label: "👑 Studio Lead" },
];

export default function ProfilePictureModal({
  isOpen,
  onClose,
  member,
  onSave,
}) {
  const [sourceUrl, setSourceUrl] = useState(member?.avatar || defaultLogo);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [caption, setCaption] = useState(member?.avatarCaption || "");
  const [frameBadge, setFrameBadge] = useState(member?.avatarFrame || "");
  const [customUrl, setCustomUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (isOpen && member) {
      setSourceUrl(member.avatar || defaultLogo);
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setCaption(member.avatarCaption || "");
      setFrameBadge(member.avatarFrame || "");
      setCustomUrl("");
      setShowUrlInput(false);
    }
  }, [isOpen, member]);

  if (!isOpen || !member) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSourceUrl(reader.result);
        setZoom(1.1);
        setRotation(0);
        setOffset({ x: 0, y: 0 });
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setOffset({
      x: Math.max(-140, Math.min(140, clientX - dragStart.x)),
      y: Math.max(-140, Math.min(140, clientY - dragStart.y)),
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleResetCrop = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  const exportCroppedAvatar = () => {
    const img = imageRef.current;
    if (!img) return sourceUrl;

    try {
      const size = 360;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, size, size);

      ctx.save();
      ctx.translate(size / 2 + offset.x * (size / 220), size / 2 + offset.y * (size / 220));
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      const nw = img.naturalWidth || 360;
      const nh = img.naturalHeight || 360;
      const scaleCover = Math.max(size / nw, size / nh);
      const drawW = nw * scaleCover;
      const drawH = nh * scaleCover;

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      return canvas.toDataURL("image/jpeg", 0.92);
    } catch {
      // Fallback if CORS taint occurs on external URL
      return sourceUrl;
    }
  };

  const handleSave = () => {
    const finalAvatar = exportCroppedAvatar();
    onSave(finalAvatar, { frameBadge, caption: caption.trim() });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-cyan-950/50 text-white">
        {/* Top Header (Facebook style) */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Update Profile Picture
              </h2>
              <p className="text-xs text-slate-400">
                {member.fullName || member.displayName} •{" "}
                <span className="text-cyan-400 font-mono">
                  {member.lovId || "LOV Member"}
                </span>
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

        <div className="p-6 space-y-6">
          {/* Caption input like Facebook */}
          <div>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Say something about your profile picture..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Action Buttons Row: + Upload Photo / Paste Image URL */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold text-sm transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              + Upload Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => setShowUrlInput((prev) => !prev)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition cursor-pointer"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              Use Image URL
            </button>
          </div>

          {showUrlInput && (
            <div className="flex gap-2">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Paste direct image link (https://...)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => {
                  if (customUrl.trim()) {
                    setSourceUrl(customUrl.trim());
                    handleResetCrop();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}

          {/* Facebook-Style Circular Crop & Drag-to-Reposition Stage */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 py-7 flex flex-col items-center justify-center select-none overflow-hidden">
            <div
              onMouseDown={handlePointerDown}
              onTouchStart={handlePointerDown}
              className="relative w-[220px] h-[220px] rounded-full overflow-hidden ring-4 ring-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.35)] cursor-grab active:cursor-grabbing bg-slate-900"
            >
              <img
                ref={imageRef}
                src={sourceUrl}
                alt="Avatar Crop Preview"
                crossOrigin="anonymous"
                draggable={false}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
                  transition: isDragging ? "none" : "transform 0.12s ease-out",
                }}
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Drag Grid Overlay */}
              {isDragging && (
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  <div className="border border-white/20" />
                  <div className="border border-white/20" />
                  <div className="border border-white/20" />
                  <div className="border border-white/20" />
                  <div className="border border-white/20" />
                  <div className="border border-white/20" />
                  <div className="border border-white/20" />
                  <div className="border border-white/20" />
                  <div className="border border-white/20" />
                </div>
              )}

              {/* Frame Badge Preview */}
              {frameBadge && (
                <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-cyan-400/60 text-[10px] font-bold text-cyan-300 shadow">
                    {frameBadge}
                  </span>
                </div>
              )}
            </div>

            {/* Drag to Reposition Hint Pill */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
              <Move className="w-3.5 h-3.5 text-cyan-400" />
              Drag photo to reposition
            </div>

            {/* Zoom & Rotate Controls */}
            <div className="mt-5 w-full max-w-xs flex items-center gap-3 px-4">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, Number((z - 0.15).toFixed(2))))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <input
                type="range"
                min="1"
                max="2.8"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-cyan-400 cursor-pointer"
              />

              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.8, Number((z + 0.15).toFixed(2))))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 transition cursor-pointer"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleResetCrop}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                title="Reset Crop"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add Frame Badge (Facebook Frame feature) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Add Studio Frame Badge
            </label>
            <div className="flex flex-wrap gap-2">
              {FRAME_BADGES.map((badge) => (
                <button
                  key={badge.label}
                  type="button"
                  onClick={() => setFrameBadge(badge.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                    frameBadge === badge.id
                      ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:border-cyan-500/40"
                  }`}
                >
                  {badge.label}
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Studio Avatars */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Suggested Studio Avatars
            </label>
            <div className="grid grid-cols-4 gap-3">
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setSourceUrl(preset.url);
                    handleResetCrop();
                  }}
                  className={`group relative rounded-xl p-1.5 bg-slate-950 border transition flex flex-col items-center gap-1.5 cursor-pointer ${
                    sourceUrl === preset.url
                      ? "border-cyan-400 ring-2 ring-cyan-400/25"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-12 h-12 rounded-full object-cover border border-slate-700"
                  />
                  <span className="text-[10px] text-slate-300 truncate max-w-full">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Your profile picture is public on LOV Portal
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Save Profile Picture
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
