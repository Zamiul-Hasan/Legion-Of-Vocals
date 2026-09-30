import { motion } from "framer-motion";

function ProjectStatus({ project, dubCount = 0, contributorCount = 0 }) {
  const videosTotal =
    dubCount || (Array.isArray(project.dubVideos) ? project.dubVideos.length : 0);
  const contributorsTotal =
    contributorCount ||
    (Array.isArray(project.contributors) ? project.contributors.length : 1);

  return (
    <section className="bg-slate-950 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white">
            Project Status
          </h2>

          <p className="mt-3 text-gray-400">
            Current production progress of this Bangla dubbing project.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-6"
        >
          {/* Status */}
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
            <h3 className="text-gray-400 text-sm uppercase">
              Status
            </h3>

            <p className="mt-3 text-2xl font-bold text-cyan-400">
              {project.status}
            </p>
          </div>

          {/* Progress */}
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
            <h3 className="text-gray-400 text-sm uppercase">
              Progress
            </h3>

            <p className="mt-3 text-2xl font-bold text-white">
              {project.progress}%
            </p>
          </div>

          {/* Dub Videos */}
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
            <h3 className="text-gray-400 text-sm uppercase">
              Dub Videos
            </h3>

            <p className="mt-3 text-2xl font-bold text-white">
              {videosTotal}
            </p>
          </div>

          {/* Contributors */}
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
            <h3 className="text-gray-400 text-sm uppercase">
              Contributors
            </h3>

            <p className="mt-3 text-2xl font-bold text-white">
              {contributorsTotal}
            </p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mt-12">
          <div className="flex justify-between text-gray-400 mb-3">
            <span>Production Progress</span>
            <span>{project.progress}%</span>
          </div>

          <div className="h-4 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${project.progress}%` }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectStatus;