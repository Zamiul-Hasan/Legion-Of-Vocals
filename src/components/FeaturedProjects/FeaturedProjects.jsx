import { Link } from "react-router-dom";
import Card from "../UI/Card";
import Button from "../UI/Button";
import SectionTitle from "../UI/SectionTitle";
import Container from "../UI/Container";
import { useProjects } from "../../hooks/useProjects";

function FeaturedProjects() {
  const { projects } = useProjects();
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      case "Ongoing":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
      case "Upcoming":
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <section className="bg-slate-950 py-20">
      <Container>
        <SectionTitle
          title="Featured Projects"
          subtitle="Explore our latest Bangla anime dubbing projects."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden flex flex-col"
            >
              <div className="relative overflow-hidden h-56">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition duration-500 hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-cyan-400 border border-cyan-500/30 font-medium">
                  {project.releaseDate}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    Progress: <strong className="text-cyan-400">{project.progress}%</strong>
                  </span>
                </div>

                <h3 className="text-white text-2xl font-bold mt-4">
                  {project.title}
                </h3>

                <p className="text-gray-400 mt-3 flex-1">
                  {project.description}
                </p>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <Link to={`/projects/${project.id}`} className="mt-6 block">
                  <Button className="w-full">
                    View Project
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/projects">
            <Button variant="secondary" size="lg">
              Explore All Projects →
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default FeaturedProjects;