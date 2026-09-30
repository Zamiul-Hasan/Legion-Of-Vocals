import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderPlus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Film,
  Sparkles,
  CheckCircle2,
  Clock,
  Calendar,
  Users,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "../layouts/DashboardLayout";
import CreateProjectModal from "../components/Admin/Projects/CreateProjectModal";

export default function AdminProjects() {
  const { projects, createProject, updateProject, deleteProject } =
    useProjects();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [toast, setToast] = useState("");

  const isAuthorized =
    user?.role === "founder" ||
    user?.role === "admin" ||
    user?.role === "moderator";

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = (formData) => {
    if (editingProject) {
      updateProject(editingProject.id, formData);
      showToast(`Updated "${formData.title}" successfully.`);
    } else {
      createProject(formData);
      showToast(`Launched new project "${formData.title}"!`);
    }
  };

  const handleDelete = (project) => {
    if (
      window.confirm(
        `Are you sure you want to remove "${project.title}" from LOV Portal?`
      )
    ) {
      deleteProject(project.id);
      showToast(`Removed "${project.title}".`);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesStatus =
      statusFilter === "All" || p.status === statusFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.director || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = [
    {
      label: "Total Studio Projects",
      value: projects.length,
      icon: Film,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "Ongoing Production",
      value: projects.filter((p) => p.status === "Ongoing").length,
      icon: Clock,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Upcoming / Casting",
      value: projects.filter((p) => p.status === "Upcoming").length,
      icon: Sparkles,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Completed Releases",
      value: projects.filter((p) => p.status === "Completed").length,
      icon: CheckCircle2,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-900 border border-cyan-500/40 text-cyan-300 text-sm shadow-xl shadow-cyan-950/50">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-cyan-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Founder & Admin Studio Console
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">
            Project Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create new dubbing projects, assign directors, and track studio
            production milestones.
          </p>
        </div>

        {isAuthorized && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm shadow-lg shadow-cyan-500/25 transition cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            Create New Project
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-11 h-11 rounded-xl border flex items-center justify-center ${stat.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, category, or director..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", "Ongoing", "Upcoming", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                statusFilter === status
                  ? "bg-cyan-500 text-slate-950 font-semibold"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition group"
          >
            <div>
              {/* Banner */}
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img
                  src={project.banner}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-950/80 backdrop-blur-md text-cyan-400 border border-cyan-500/30">
                    {project.category || "Anime"}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md ${
                      project.status === "Completed"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : project.status === "Ongoing"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[2rem]">
                  {project.description}
                </p>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{project.releaseDate || "TBA"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="truncate">
                      {project.director || "LOV Studio"}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Production Progress</span>
                    <span className="text-cyan-400 font-semibold">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-3.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <Link
                to={`/projects/${project.id}`}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-400 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Public View
              </Link>

              {isAuthorized && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        initialProject={editingProject}
      />
      </div>
    </DashboardLayout>
  );
}
