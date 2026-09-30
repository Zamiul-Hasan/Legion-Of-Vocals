import ProjectCard from "./ProjectCard";
import { useProjects } from "../../hooks/useProjects";

function ProjectGrid({ activeFilter, searchTerm }) {
  const { projects } = useProjects();
  const filteredProjects = projects.filter((project) => {
    const matchesFilter =
      activeFilter === "All" || project.status === activeFilter;

    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (filteredProjects.length === 0) {
    return (
      <div className="py-20 text-center text-gray-400">
        <h2 className="text-2xl font-semibold">
          No projects found.
        </h2>

        <p className="mt-2">
          Try changing the filter or search keyword.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectGrid;