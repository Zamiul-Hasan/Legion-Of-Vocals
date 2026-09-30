import DubVideoCard from "./DubVideoCard";

function ProjectDubVideos({ videos }) {
  if (videos.length === 0) {
    return (
      <section className="bg-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-10">
            Dub Videos
          </h2>

          <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-12 text-center">
            <h3 className="text-2xl font-semibold text-white">
              No Dub Videos Yet
            </h3>

            <p className="mt-4 text-gray-400">
              Dub videos will appear here once they are published.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="dub-videos-section" className="bg-slate-950 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-white mb-12">
          Dub Videos
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {videos.map((video) => (
            <DubVideoCard
              key={video.id}
              video={video}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectDubVideos;