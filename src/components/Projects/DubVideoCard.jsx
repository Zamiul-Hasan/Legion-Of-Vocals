import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Clock, Eye, Share2 } from "lucide-react";
import { useDubVideos } from "../../hooks/useDubVideos";
import { useProjects } from "../../hooks/useProjects";
import ShareVideoModal from "../Video/ShareVideoModal";
import VideoPlayerModal from "../Video/VideoPlayerModal";
import ReactionButton from "../Video/ReactionButton";

function DubVideoCard({ video }) {
  const { videos, reactToVideo, incrementShare } = useDubVideos();
  const { projects } = useProjects();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const liveVideo =
    videos.find((v) => Number(v.id) === Number(video.id)) || video;

  const projectObj = projects.find(
    (p) => Number(p.id) === Number(liveVideo.projectId)
  );
  const projectTitle = projectObj ? projectObj.title : "Anime Dub";
  const isComingSoon =
    liveVideo.title === "Coming Soon" || liveVideo.status === "Coming Soon";

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        className="bg-slate-900 border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-400 transition flex flex-col justify-between group"
      >
        <div>
          {/* Thumbnail */}
          <div className="relative overflow-hidden">
            <img
              src={liveVideo.thumbnail}
              alt={liveVideo.title}
              className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
            />

            {/* Top-Right Quick Share Button on Thumbnail */}
            {!isComingSoon && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareOpen(true);
                }}
                title="Share Video to Facebook, YouTube & More"
                className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 hover:bg-cyan-500 text-white hover:text-slate-950 border border-cyan-500/40 backdrop-blur-md text-xs font-bold shadow-lg transition cursor-pointer"
              >
                <Share2 size={13} />
                Share
              </button>
            )}

            {/* Status Badge */}
            <span
              className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border ${
                isComingSoon
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              }`}
            >
              {isComingSoon ? "Coming Soon" : "Published"}
            </span>

            {/* Play Overlay */}
            <div
              onClick={() => !isComingSoon && setIsPlayerOpen(true)}
              className={`absolute inset-0 bg-black/40 flex items-center justify-center ${
                !isComingSoon ? "cursor-pointer" : ""
              }`}
            >
              <button
                type="button"
                disabled={isComingSoon}
                onClick={() => !isComingSoon && setIsPlayerOpen(true)}
                className="w-16 h-16 rounded-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 transition flex items-center justify-center shadow-lg shadow-cyan-500/30 cursor-pointer"
              >
                <Play className="text-slate-950 ml-1" size={28} fill="currentColor" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-xl font-bold text-white line-clamp-1">
              {liveVideo.title}
            </h3>

            <p className="text-sm text-gray-400 mt-1.5">
              Uploaded by{" "}
              <span className="text-cyan-400 font-medium">
                {liveVideo.uploadedBy}
              </span>
            </p>

            {/* Duration + Date */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-cyan-400" />
                {liveVideo.duration}
              </span>

              <span>{liveVideo.uploadDate}</span>
            </div>

            {/* Interactive Stats: Views, Facebook Reaction Button, Shares */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs">
                  <Eye size={15} className="text-cyan-400" />
                  {liveVideo.views || 0}
                </span>

                <ReactionButton
                  video={liveVideo}
                  onReact={reactToVideo}
                  disabled={isComingSoon}
                  size="sm"
                />
              </div>

              {!isComingSoon && (
                <button
                  type="button"
                  onClick={() => setIsShareOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition cursor-pointer"
                >
                  <Share2 size={14} />
                  {liveVideo.shares || 0}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: Watch Dub + Share */}
        <div className="px-5 pb-5 flex items-center gap-2.5">
          <button
            type="button"
            disabled={isComingSoon}
            onClick={() => !isComingSoon && setIsPlayerOpen(true)}
            className="flex-1 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 transition py-2.5 rounded-xl font-bold text-sm text-slate-950 cursor-pointer"
          >
            {isComingSoon ? "Coming Soon" : "▶ Watch Dub"}
          </button>

          {!isComingSoon && (
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-sm font-semibold transition cursor-pointer"
              title="Share to Facebook, YouTube & More"
            >
              <Share2 size={16} />
              Share
            </button>
          )}
        </div>
      </motion.div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        video={liveVideo}
        projectTitle={projectTitle}
        onOpenShare={() => {
          setIsPlayerOpen(false);
          setIsShareOpen(true);
        }}
      />

      {/* Facebook & YouTube Style Share Modal */}
      <ShareVideoModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        video={liveVideo}
        projectTitle={projectTitle}
        onShareSuccess={(vidId, platform) => incrementShare(vidId, platform)}
      />
    </>
  );
}

export default DubVideoCard;