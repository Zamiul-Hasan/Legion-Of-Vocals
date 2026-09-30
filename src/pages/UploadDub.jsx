import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  Film,
  CheckCircle2,
  Mic2,
  Link as LinkIcon,
  Clock,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/UI/Button";
import { useProjects } from "../hooks/useProjects";
import { loadDubVideos, saveDubVideos } from "../hooks/useDubVideos";

function UploadDub() {
  const { projects } = useProjects();
  const [form, setForm] = useState({
    projectId: 2,
    title: "",
    department: "Voice Acting",
    duration: "24:00",
    videoUrl: "",
    notes: "",
    fileName: "",
    publishStatus: "Published",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) return;

    const selectedProject =
      projects.find((p) => p.id === Number(form.projectId)) || projects[0];

    const newDub = {
      id: Date.now(),
      projectId: Number(form.projectId),
      title: form.title,
      thumbnail: selectedProject.image,
      duration: form.duration || "24:00",
      uploadDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      uploadedBy: "Zamiul Hasan",
      views: 1,
      likes: 1,
      shares: 0,
      status: form.publishStatus || "Published",
      videoUrl: form.videoUrl || "#",
    };

    const existingLegacy = JSON.parse(
      localStorage.getItem("uploadedDubs") || "[]"
    );
    localStorage.setItem(
      "uploadedDubs",
      JSON.stringify([newDub, ...existingLegacy])
    );

    const currentDubs = loadDubVideos();
    saveDubVideos([
      newDub,
      ...currentDubs.filter((v) => Number(v.id) !== Number(newDub.id)),
    ]);

    setSubmitted(true);
    setForm({
      projectId: 2,
      title: "",
      department: "Voice Acting",
      duration: "24:00",
      videoUrl: "",
      notes: "",
      fileName: "",
      publishStatus: "Published",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <Upload className="text-cyan-400" size={34} />
            Upload Dub Episode
          </h1>
          <p className="mt-2 text-gray-400">
            Submit your dubbed episode cut or vocal stem package for Quality Assurance and publication.
          </p>
        </div>

        {submitted && (
          <div className="p-5 rounded-2xl bg-green-500/15 border border-green-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-green-300">
              <CheckCircle2 size={24} className="shrink-0" />
              <div>
                <h4 className="font-bold text-white">
                  Episode Submitted for Review!
                </h4>
                <p className="text-sm">
                  Your submission has been added to your Dub Videos library.
                </p>
              </div>
            </div>
            <Link
              to="/my-dub-videos"
              className="px-4 py-2 rounded-xl bg-green-500 text-slate-950 font-bold text-sm shrink-0 text-center"
            >
              View My Dub Videos →
            </Link>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-3xl bg-slate-900 border border-cyan-500/20 space-y-6"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Project Select */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Anime Project
              </label>
              <div className="relative">
                <Film
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                />
                <select
                  value={form.projectId}
                  onChange={(e) =>
                    setForm({ ...form, projectId: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 py-3.5 pl-11 pr-4 text-white outline-none focus:border-cyan-400"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contribution Department
              </label>
              <div className="relative">
                <Mic2
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                />
                <select
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 py-3.5 pl-11 pr-4 text-white outline-none focus:border-cyan-400"
                >
                  <option>Voice Acting</option>
                  <option>Video Editing</option>
                  <option>Sound Engineering</option>
                  <option>Translation & Script</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {/* Episode Title */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Episode Title
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Episode 2 - Bangla Dub (Final Mix)"
                className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 px-4 py-3.5 text-white outline-none focus:border-cyan-400"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration
              </label>
              <div className="relative">
                <Clock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                />
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  placeholder="24:00"
                  className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 py-3.5 pl-11 pr-4 text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Video Link */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Google Drive / YouTube Unlisted Link
            </label>
            <div className="relative">
              <LinkIcon
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
              />
              <input
                type="url"
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="https://drive.google.com/..."
                className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 py-3.5 pl-11 pr-4 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* File Upload Dropzone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Or Upload Master Video / Audio Package (MP4, MKV, WAV)
            </label>
            <label className="cursor-pointer flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyan-500/30 bg-slate-950/60 p-8 hover:border-cyan-400 transition">
              <Upload size={36} className="text-cyan-400 mb-3" />
              <span className="text-white font-semibold">
                {form.fileName
                  ? `Selected: ${form.fileName}`
                  : "Click to select video or audio stem file"}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Supports 1080p MP4, MKV, or 48kHz WAV stems
              </span>
              <input
                type="file"
                hidden
                accept="video/*,audio/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setForm({ ...form, fileName: e.target.files[0].name });
                  }
                }}
              />
            </label>
          </div>

          {/* QA Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Production & QA Notes
            </label>
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="List cast credits, timestamp adjustments, or mixing notes for the review team..."
              className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 p-4 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <Button type="submit" size="lg" leftIcon={<Upload size={18} />}>
            Submit Episode for QA Review
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default UploadDub;