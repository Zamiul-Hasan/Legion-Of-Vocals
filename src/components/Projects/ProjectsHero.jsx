import { useState } from "react";
import { motion } from "framer-motion";
import { FolderPlus } from "lucide-react";
import Button from "../UI/Button";
import Container from "../UI/Container";
import BackButton from "../UI/BackButton";
import { useAuth } from "../../hooks/useAuth";
import { useProjects } from "../../hooks/useProjects";
import CreateProjectModal from "../Admin/Projects/CreateProjectModal";

function ProjectsHero() {
  const { user } = useAuth();
  const { createProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canCreateProject =
    user?.role === "founder" ||
    user?.role === "admin" ||
    user?.role === "moderator";

  return (
    <section className="relative py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>

      <Container>
        <div className="relative z-10 mb-6">
          <BackButton label="Back" fallback="/" variant="subtle" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          <p className="uppercase tracking-[6px] text-cyan-400 font-semibold">
            Legion of Vocals
          </p>

          <h1 className="mt-4 text-5xl md:text-7xl font-black text-white">
            Our Projects
          </h1>

          <p className="mt-8 max-w-3xl mx-auto text-gray-300 leading-8 text-lg">
            Explore our completed, ongoing, and upcoming Bangla anime dubbing
            projects. Every project is created with passion, teamwork, and
            dedication by the Legion of Vocals community.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() =>
                window.scrollTo({ top: 500, behavior: "smooth" })
              }
            >
              Explore Projects
            </Button>

            {canCreateProject && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 font-semibold text-base shadow-lg shadow-cyan-500/10 transition cursor-pointer"
              >
                <FolderPlus className="w-5 h-5" />
                + Create New Project
              </button>
            )}
          </div>
        </motion.div>
      </Container>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(projectData) => createProject(projectData)}
      />
    </section>
  );
}

export default ProjectsHero;