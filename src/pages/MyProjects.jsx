import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  FolderPlus,
  Upload,
  ExternalLink,
  CheckCircle2,
  Clock,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/UI/Button";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../hooks/useAuth";
import CreateProjectModal from "../components/Admin/Projects/CreateProjectModal";
import tasks from "../data/tasks";

function MyProjects() {
  const { projects, createProject } = useProjects();
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canCreateProject =
    user?.role === "founder" ||
    user?.role === "admin" ||
    user?.role === "moderator";

  const filters = ["All", "Ongoing", "Completed", "Upcoming"];

  const filteredProjects = projects.filter(
    (p) => filter === "All" || p.status === filter
  );

  const statusColor = (status) => {
    if (status === "Completed")
      return "bg-green-500/20 text-green-300 border-green-500/30";
    if (status === "Ongoing")
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    return "bg-blue-500/20 text-blue-300 border-blue-500/30";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              <FolderKanban className="text-cyan-400" size={34} />
              My Projects
            </h1>
            <p className="mt-2 text-gray-400">
              Anime dubbing productions you are currently assigned to and contributing toward.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {canCreateProject && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 font-semibold text-sm transition cursor-pointer"
              >
                <FolderPlus size={18} />
                + Create New Project
              </button>
            )}
            <Link to="/upload-dub">
              <Button leftIcon={<Upload size={18} />}>
                Submit Episode Dub
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                filter === item
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25"
                  : "bg-slate-900 text-gray-300 border border-cyan-500/20 hover:border-cyan-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Project Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const projectTasks = tasks.filter(
              (t) => t.projectId === project.id
            );

            return (
              <div
                key={project.id}
                className="rounded-3xl bg-slate-900 border border-cyan-500/20 overflow-hidden flex flex-col hover:border-cyan-400 transition"
              >
                <div className="relative h-48">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                  <span
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Release: {project.releaseDate}</span>
                    <span className="text-cyan-400 font-bold">
                      {project.progress}% Complete
                    </span>
                  </div>

                  <h2 className="mt-2 text-2xl font-bold text-white">
                    {project.title}
                  </h2>

                  <p className="mt-2 text-sm text-gray-400">
                    {project.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-4">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  {/* Assigned Tasks for this Project */}
                  <div className="mt-6 pt-5 border-t border-slate-800 flex-1">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                      Your Tasks ({projectTasks.length})
                    </h4>

                    <div className="space-y-2.5">
                      {projectTasks.map((t) => (
                        <div
                          key={t.id}
                          className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex items-start justify-between gap-2"
                        >
                          <div className="flex items-start gap-2">
                            {t.status === "Completed" ? (
                              <CheckCircle2
                                size={15}
                                className="text-green-400 shrink-0 mt-0.5"
                              />
                            ) : (
                              <Clock
                                size={15}
                                className="text-cyan-400 shrink-0 mt-0.5"
                              />
                            )}
                            <div>
                              <p className="text-white font-medium">{t.title}</p>
                              <p className="text-gray-500 mt-0.5">{t.episode}</p>
                            </div>
                          </div>
                          <span className="text-yellow-400 font-semibold shrink-0">
                            +{t.points}p
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link
                      to={`/projects/${project.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition"
                    >
                      <ExternalLink size={16} />
                      Details
                    </Link>
                    <Link
                      to="/upload-dub"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold transition"
                    >
                      <Upload size={16} />
                      Upload Dub
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <CreateProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(projectData) => createProject(projectData)}
        />
      </div>
    </DashboardLayout>
  );
}

export default MyProjects;