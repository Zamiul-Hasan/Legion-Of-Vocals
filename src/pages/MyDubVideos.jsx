import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Video,
  Upload,
  Eye,
  Heart,
  Clock,
  Trash2,
  Search,
  Play,
  Share2,
  CheckCircle2,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/UI/Button";
import { useDubVideos } from "../hooks/useDubVideos";
import { useProjects } from "../hooks/useProjects";
import ShareVideoModal from "../components/Video/ShareVideoModal";
import VideoPlayerModal from "../components/Video/VideoPlayerModal";
import ReactionButton from "../components/Video/ReactionButton";

function MyDubVideos() {
  const { videos, reactToVideo, incrementShare, publishVideo, deleteVideo } =
    useDubVideos();
  const { projects } = useProjects();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sharingVideo, setSharingVideo] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const getProjectTitle = (projectId) => {
    const p = projects.find((proj) => Number(proj.id) === Number(projectId));
    return p ? p.title : "Anime Dub";
  };

  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      getProjectTitle(v.projectId).toLowerCase().includes(search.toLowerCase());
    const vStatus = v.status || "Published";
    const matchesStatus = statusFilter === "All" || vStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              <Video className="text-cyan-400" size={34} />
              My Dub Videos
            </h1>
            <p className="mt-2 text-gray-400">
              Manage your Bangla dub episodes, publish approved cuts, and share published videos to Facebook & YouTube.
            </p>
          </div>

          <Link to="/upload-dub">
            <Button leftIcon={<Upload size={18} />}>
              Upload New Dub
            </Button>
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by episode or anime title..."
              className="w-full rounded-xl bg-slate-900 border border-cyan-500/20 py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "Published", "Pending Review"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  statusFilter === st
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "bg-slate-900 text-gray-300 border border-cyan-500/20 hover:border-cyan-400"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900 border border-cyan-500/20 text-center">
            <Video size={40} className="mx-auto mb-3 text-cyan-400 opacity-60" />
            <p className="text-gray-300 font-medium">No dub videos uploaded yet.</p>
            <p className="text-gray-500 text-xs mt-1">Upload your first episode dub cut to start building your studio portfolio!</p>
            <Link to="/upload-dub" className="mt-4 inline-block">
              <Button size="sm" leftIcon={<Upload size={14} />}>
                Upload Dub
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const isPublished =
              (video.status || "Published") === "Published" &&
              video.title !== "Coming Soon";
            const isPending = video.status === "Pending Review";

            return (
              <div
                key={video.id}
                className="rounded-3xl bg-slate-900 border border-cyan-500/20 overflow-hidden flex flex-col hover:border-cyan-400 transition group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div
                    onClick={() => setPlayingVideo(video)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>

                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/85 text-cyan-400 border border-cyan-500/30">
                    {getProjectTitle(video.projectId)}
                  </span>

                  {/* Quick Share Pill on Thumbnail for Published Videos */}
                  {isPublished && (
                    <button
                      type="button"
                      onClick={() => setSharingVideo(video)}
                      className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 hover:bg-cyan-500 text-white hover:text-slate-950 border border-cyan-500/40 text-xs font-bold shadow transition cursor-pointer"
                      title="Share to Facebook, YouTube & More"
                    >
                      <Share2 size={12} />
                      Share
                    </button>
                  )}

                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950/90 text-white flex items-center gap-1">
                    <Clock size={12} className="text-cyan-400" />
                    {video.duration}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{video.uploadDate}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-semibold ${
                        isPending
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : "bg-green-500/20 text-green-300 border border-green-500/30"
                      }`}
                    >
                      {video.status || "Published"}
                    </span>
                  </div>

                  <h3 className="mt-2 text-xl font-bold text-white line-clamp-1">
                    {video.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Uploaded by {video.uploadedBy}
                  </p>

                  {/* Stats Row */}
                  <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-sm text-gray-300">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Eye size={15} className="text-cyan-400" />
                        {video.views || 0}
                      </span>

                      <ReactionButton
                        video={video}
                        onReact={reactToVideo}
                        size="sm"
                      />

                      <span className="flex items-center gap-1.5 text-xs text-cyan-400">
                        <Share2 size={14} />
                        {video.shares || 0}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteVideo(video.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                      title="Remove Dub Video"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Action Buttons: Watch + Share (or Publish if Pending) */}
                  <div className="mt-4 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPlayingVideo(video)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer"
                    >
                      <Play size={14} className="text-cyan-400" />
                      Watch
                    </button>

                    {isPending ? (
                      <button
                        type="button"
                        onClick={() => publishVideo(video.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer"
                      >
                        <CheckCircle2 size={14} />
                        Publish Video
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSharingVideo(video)}
                        disabled={!isPublished}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition cursor-pointer"
                      >
                        <Share2 size={14} />
                        Share Video
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Video Player Modal */}
        <VideoPlayerModal
          isOpen={Boolean(playingVideo)}
          onClose={() => setPlayingVideo(null)}
          video={playingVideo}
          projectTitle={
            playingVideo ? getProjectTitle(playingVideo.projectId) : "Anime Dub"
          }
          onOpenShare={(vid) => {
            setPlayingVideo(null);
            setSharingVideo(vid);
          }}
        />

        {/* Facebook & YouTube Style Share Video Modal */}
        <ShareVideoModal
          isOpen={Boolean(sharingVideo)}
          onClose={() => setSharingVideo(null)}
          video={sharingVideo}
          projectTitle={
            sharingVideo ? getProjectTitle(sharingVideo.projectId) : "Anime Dub"
          }
          onShareSuccess={(vidId, platform) => incrementShare(vidId, platform)}
        />
      </div>
    </DashboardLayout>
  );
}

export default MyDubVideos;