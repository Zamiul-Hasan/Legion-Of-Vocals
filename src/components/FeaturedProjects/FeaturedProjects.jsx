import { Link } from "react-router-dom";
import Card from "../UI/Card";
import Button from "../UI/Button";
import SectionTitle from "../UI/SectionTitle";
import Container from "../UI/Container";
import { useProjects } from "../../hooks/useProjects";
import { useTheme } from "../../context/ThemeContext";

function FeaturedProjects() {
  const { projects } = useProjects();
  const { isSasuke } = useTheme();

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      case "Ongoing":
        return isSasuke
          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
          : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
      case "Upcoming":
        return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <section className={`py-20 transition-colors duration-300 ${
      isSasuke ? "bg-[#0c0d12]" : "bg-slate-950"
    }`}>
      <Container>
        <SectionTitle
          title="Featured Anime Projects"
          subtitle="Explore our latest Bangla anime dubbing productions and episodes."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card
              key={project.id}
              className={`overflow-hidden flex flex-col rounded-3xl transition duration-300 ${
                isSasuke
                  ? "bg-slate-950/80 border-slate-800 hover:border-blue-500 shadow-xl hover:shadow-blue-500/10"
                  : ""
              }`}
            >
              <div className="relative overflow-hidden h-56">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition duration-500 hover:scale-105"
                />
                <div className={`absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold ${
                  isSasuke
                    ? "bg-slate-950/85 text-blue-400 border border-blue-500/40"
                    : "bg-slate-950/80 text-cyan-400 border border-cyan-500/30"
                }`}>
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
                    Progress: <strong className={isSasuke ? "text-blue-400" : "text-cyan-400"}>{project.progress}%</strong>
                  </span>
                </div>

                <h3 className="text-white text-2xl font-bold mt-4">
                  {project.title}
                </h3>

                <p className="text-gray-400 mt-3 flex-1 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-5">
                  <div
                    className={`h-full rounded-full ${
                      isSasuke
                        ? "bg-gradient-to-r from-blue-600 to-indigo-500"
                        : "bg-gradient-to-r from-cyan-500 to-blue-500"
                    }`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <Link to={`/projects/${project.id}`} className="mt-6 block">
                  <button className={`w-full py-3 rounded-full font-bold text-sm transition cursor-pointer ${
                    isSasuke
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25"
                      : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                  }`}>
                    View Project
                  </button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/projects">
            <button className={`px-8 py-3.5 rounded-full font-bold text-sm transition cursor-pointer ${
              isSasuke
                ? "bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-blue-500"
                : "bg-slate-900 border border-cyan-500/30 text-white hover:border-cyan-400"
            }`}>
              Explore All Projects →
            </button>
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default FeaturedProjects;