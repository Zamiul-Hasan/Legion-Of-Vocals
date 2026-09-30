import { motion } from "framer-motion";
import BackButton from "../UI/BackButton";

function ProjectBanner({ project }) {
  const statusColors = {
    Ongoing: "bg-yellow-500",
    Completed: "bg-green-500",
    Upcoming: "bg-blue-500",
  };

  return (
    <section className="relative h-[75vh] min-h-[650px] overflow-hidden">
      {/* Background */}
      <img
        src={project.banner}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Bottom Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

      {/* Back Button */}
      <div className="absolute top-28 left-8 z-20">
        <BackButton label="Back to Projects" fallback="/projects" variant="glass" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {/* Status */}
            <span
              className={`inline-flex rounded-full px-5 py-2 text-sm font-semibold text-white ${
                statusColors[project.status] || "bg-gray-500"
              }`}
            >
              {project.status}
            </span>

            {/* Title */}
            <h1 className="mt-6 text-5xl font-black text-white drop-shadow-lg md:text-7xl">
              {project.title}
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              {project.description}
            </p>

            {/* Information */}
            <div className="mt-8 flex flex-wrap gap-6 text-gray-300">
              <div>
                <p className="text-sm text-cyan-400">Category</p>
                <p className="font-semibold">{project.category}</p>
              </div>

              <div>
                <p className="text-sm text-cyan-400">Release</p>
                <p className="font-semibold">{project.releaseDate}</p>
              </div>

              <div>
                <p className="text-sm text-cyan-400">Dub Videos</p>
                <p className="font-semibold">
                  {project.dubVideos?.length || 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-cyan-400">Contributors</p>
                <p className="font-semibold">
                  {project.contributors?.length || 0}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("dub-videos-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-xl bg-cyan-500 px-8 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 cursor-pointer"
              >
                🎬 Watch & Share Dub Videos
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ProjectBanner;