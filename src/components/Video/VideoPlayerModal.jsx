import {
  X,
  Share2,
  Eye,
  Clock,
  Calendar,
  ExternalLink,
  Film,
} from "lucide-react";
import heroVideo from "../../assets/videos/hero-bg.mp4";
import { useDubVideos } from "../../hooks/useDubVideos";
import ReactionButton from "./ReactionButton";

export default function VideoPlayerModal({
  isOpen,
  onClose,
  video,
  projectTitle = "Anime Dub",
  onOpenShare,
}) {
  const { videos, reactToVideo } = useDubVideos();

  if (!isOpen || !video) return null;

  // Always read the live reactive video object so reaction counts update immediately
  const liveVideo =
    videos.find((v) => Number(v.id) === Number(video.id)) || video;

  const isExternalEmbed =
    liveVideo.videoUrl &&
    liveVideo.videoUrl !== "#" &&
    (liveVideo.videoUrl.includes("youtube.com") ||
      liveVideo.videoUrl.includes("youtu.be") ||
      liveVideo.videoUrl.includes("drive.google.com"));

  const videoSource =
    liveVideo.videoUrl && liveVideo.videoUrl !== "#" && !isExternalEmbed
      ? liveVideo.videoUrl
      : heroVideo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl overflow-hidden text-white">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs font-semibold text-cyan-400 shrink-0">
              <Film className="w-3.5 h-3.5" />
              {projectTitle}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white truncate">
              {liveVideo.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Stage */}
        <div className="relative bg-black aspect-video w-full">
          <video
            src={videoSource}
            poster={liveVideo.thumbnail}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        </div>

        {/* YouTube / Facebook Watch Action Bar Below Player */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900">
          <div>
            <h3 className="text-xl font-bold text-white">{liveVideo.title}</h3>
            <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-slate-400">
              <span>
                Uploaded by{" "}
                <strong className="text-cyan-400">
                  {liveVideo.uploadedBy}
                </strong>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {liveVideo.uploadDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {liveVideo.duration}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                {liveVideo.views || 0} views
              </span>
            </div>
          </div>

          {/* Facebook Multi-Reaction Button + Share + External Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <ReactionButton
              video={liveVideo}
              onReact={reactToVideo}
              size="md"
            />

            <button
              type="button"
              onClick={() => onOpenShare && onOpenShare(liveVideo)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share ({liveVideo.shares || 0})</span>
            </button>

            {liveVideo.videoUrl && liveVideo.videoUrl !== "#" && (
              <a
                href={liveVideo.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                Source
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
