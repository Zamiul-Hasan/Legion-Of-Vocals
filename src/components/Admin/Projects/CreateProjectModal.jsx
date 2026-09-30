import { useState, useEffect } from "react";
import {
  X,
  Film,
  Calendar,
  User,
  Layers,
  Image as ImageIcon,
  Upload,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { bannerPresets } from "../../../data/projects";
import { useAuth } from "../../../hooks/useAuth";

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSave,
  initialProject = null,
}) {
  const { user } = useAuth();
  const isEditing = Boolean(initialProject);

  const [formData, setFormData] = useState({
    title: "",
    category: "Anime",
    status: "Ongoing",
    progress: 15,
    releaseDate: "Dec 2026",
    episodes: 12,
    director: user?.name || "Arik (Founder)",
    description: "",
    banner: bannerPresets[0].url,
  });

  const [bannerMode, setBannerMode] = useState("preset"); // 'preset' | 'url' | 'upload'
  const [customUrl, setCustomUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialProject) {
      setFormData({
        title: initialProject.title || "",
        category: initialProject.category || "Anime",
        status: initialProject.status || "Ongoing",
        progress:
          initialProject.progress !== undefined ? initialProject.progress : 15,
        releaseDate: initialProject.releaseDate || "Dec 2026",
        episodes: initialProject.episodes || 12,
        director: initialProject.director || user?.name || "Arik (Founder)",
        description: initialProject.description || "",
        banner: initialProject.banner || bannerPresets[0].url,
      });
    } else {
      setFormData({
        title: "",
        category: "Anime",
        status: "Ongoing",
        progress: 15,
        releaseDate: "Dec 2026",
        episodes: 12,
        director: user?.name || "Arik (Founder)",
        description: "",
        banner: bannerPresets[0].url,
      });
      setCustomUrl("");
      setBannerMode("preset");
    }
    setError("");
  }, [initialProject, isOpen, user?.name]);

  if (!isOpen) return null;

  const handleStatusChange = (newStatus) => {
    let nextProgress = formData.progress;
    if (newStatus === "Completed") nextProgress = 100;
    else if (newStatus === "Upcoming" && formData.progress > 25) nextProgress = 10;
    setFormData({ ...formData, status: newStatus, progress: nextProgress });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({ ...prev, banner: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Please enter a project title.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please provide a short synopsis or dubbing direction.");
      return;
    }

    onSave({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      banner:
        bannerMode === "url" && customUrl.trim()
          ? customUrl.trim()
          : formData.banner,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-cyan-950/40 text-white">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? "Edit Dubbing Project" : "Create New Dubbing Project"}
              </h2>
              <p className="text-xs text-slate-400">
                Authorized for{" "}
                <span className="text-cyan-400 font-semibold uppercase">
                  {user?.role || "Admin / Founder"}
                </span>{" "}
                • Publishes directly to LOV Portal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Project Title *
              </label>
              <div className="relative">
                <Film className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Jujutsu Kaisen Season 2 (Bangla Dub)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Anime">Anime</option>
                <option value="Movie">Movie</option>
                <option value="Cartoon">Cartoon</option>
                <option value="Game Dub">Game Dub</option>
              </select>
            </div>
          </div>

          {/* Status, Progress, Release Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Production Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Upcoming">Upcoming (Casting)</option>
                <option value="Ongoing">Ongoing (Recording/Mixing)</option>
                <option value="Completed">Completed (Released)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Completion Progress ({formData.progress}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.progress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    progress: Number(e.target.value),
                  })
                }
                className="w-full accent-cyan-400 mt-2.5 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Release Window
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.releaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, releaseDate: e.target.value })
                  }
                  placeholder="e.g. Nov 2026"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Episodes & Lead Director */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Total Episodes / Parts
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={formData.episodes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      episodes: Number(e.target.value) || 1,
                    })
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Lead Dub Director
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.director}
                  onChange={(e) =>
                    setFormData({ ...formData, director: e.target.value })
                  }
                  placeholder="e.g. Arik (Founder)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Banner Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                Project Cover Banner
              </label>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                {[
                  { key: "preset", label: "Studio Presets" },
                  { key: "upload", label: "Upload Image" },
                  { key: "url", label: "Image URL" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setBannerMode(tab.key)}
                    className={`px-2.5 py-1 rounded-md transition ${
                      bannerMode === tab.key
                        ? "bg-cyan-500 text-slate-950 font-semibold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {bannerMode === "preset" && (
              <div className="grid grid-cols-3 gap-3">
                {bannerPresets.map((preset) => {
                  const active = formData.banner === preset.url;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, banner: preset.url })
                      }
                      className={`group relative h-20 rounded-xl overflow-hidden border text-left transition ${
                        active
                          ? "border-cyan-400 ring-2 ring-cyan-400/30"
                          : "border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-2">
                        <span className="text-[11px] font-medium text-white truncate">
                          {preset.label}
                        </span>
                      </div>
                      {active && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 absolute top-2 right-2 drop-shadow" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {bannerMode === "upload" && (
              <label className="flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-400 bg-slate-950/60 cursor-pointer transition">
                <Upload className="w-5 h-5 text-cyan-400 mb-1" />
                <span className="text-xs text-slate-300">
                  Click to upload custom project poster (JPG, PNG, WebP)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}

            {bannerMode === "url" && (
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com/anime-banner.jpg"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Project Synopsis & Voice Casting Notes *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the dubbing project, target emotional tone, open roles, and mixing milestones..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm shadow-lg shadow-cyan-500/20 transition"
            >
              {isEditing ? "Save Changes" : "Launch Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
