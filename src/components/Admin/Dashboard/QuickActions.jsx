import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FolderPlus } from "lucide-react";
import { useProjects } from "../../../hooks/useProjects";
import CreateProjectModal from "../Projects/CreateProjectModal";

function QuickActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createProject } = useProjects();
  const navigate = useNavigate();

  const actions = [
    { label: "👥 Manage Members", path: "/admin/members" },
    { label: "📝 Pending Applications", path: "/admin/pending-users" },
    { label: "📁 Manage Projects", path: "/admin/projects" },
    { label: "🏆 Manage Contests & Banner", path: "/admin/contests" },
  ];

  const handleSaveProject = (projectData) => {
    createProject(projectData);
    navigate("/admin/projects");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm shadow-lg shadow-cyan-500/20 transition cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
          + Create New Project
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        {actions.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400 hover:-translate-y-1 transition text-center text-white font-semibold"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
      />
    </div>
  );
}

export default QuickActions;