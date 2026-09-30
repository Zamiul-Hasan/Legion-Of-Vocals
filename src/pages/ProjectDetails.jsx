import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import { useProjects } from "../hooks/useProjects";
import { useDubVideos } from "../hooks/useDubVideos";
import contributors from "../data/contributors";
import gallery from "../data/gallery";

import ProjectBanner from "../components/Projects/ProjectBanner";
import ProjectInfo from "../components/Projects/ProjectInfo";
import ProjectStatus from "../components/Projects/ProjectStatus";
import ProjectContributors from "../components/Projects/ProjectContributors";
import ProjectGallery from "../components/Projects/ProjectGallery";
import ProjectDubVideos from "../components/Projects/ProjectDubVideos";
import RelatedProjects from "../components/Projects/RelatedProjects";

function ProjectDetails() {
  const { id } = useParams();
  const { projects } = useProjects();
  const { videos } = useDubVideos();

  const project = projects.find((p) => p.id === Number(id));

  if (!project) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <h1 className="text-4xl font-bold text-white">
            Project Not Found
          </h1>
        </div>

        <Footer />
      </>
    );
  }

  const projectContributors = contributors.filter(
    (contributor) => contributor.projectId === project.id
  );

  const projectGallery = gallery.filter(
    (image) => image.projectId === project.id
  );

  const projectDubVideos = videos.filter(
    (video) => Number(video.projectId) === Number(project.id)
  );

  return (
    <>
      <Navbar />

      <ProjectBanner project={project} />

      <ProjectInfo project={project} />

      <ProjectStatus project={project} />

      <ProjectContributors contributors={projectContributors} />

      <ProjectGallery gallery={projectGallery} />

      <ProjectDubVideos videos={projectDubVideos} />

      <RelatedProjects currentProjectId={project.id} />

      <Footer />
    </>
  );
}

export default ProjectDetails;