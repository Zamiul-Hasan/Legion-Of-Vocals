import { Link } from "react-router-dom";
import Container from "../UI/Container";
import { useProjects } from "../../hooks/useProjects";

function RelatedProjects({ currentProjectId }) {
  const { projects } = useProjects();
  const relatedProjects = projects
    .filter((project) => project.id !== currentProjectId)
    .slice(0, 3);

  return (
    <section className="bg-slate-900 py-20">
      <Container>
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold text-white">
            Related Projects
          </h2>

          <Link
            to="/projects"
            className="text-cyan-400 hover:text-cyan-300 transition"
          >
            View All →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group overflow-hidden rounded-2xl bg-slate-800 border border-cyan-500/20 hover:border-cyan-400 transition duration-300 hover:-translate-y-2"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-56 object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="p-6">
                <span className="text-cyan-400 text-sm">
                  {project.category}
                </span>

                <h3 className="mt-2 text-2xl font-bold text-white">
                  {project.title}
                </h3>

                <p className="mt-3 text-gray-400 line-clamp-2">
                  {project.description}
                </p>

                <div className="mt-5 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {project.releaseDate}
                  </span>

                  <span className="text-cyan-400 font-semibold">
                    Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default RelatedProjects;