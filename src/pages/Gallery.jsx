import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Calendar, User, Maximize2, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Container from "../components/UI/Container";
import BackButton from "../components/UI/BackButton";
import gallery from "../data/gallery";
import { useProjects } from "../hooks/useProjects";

function Gallery() {
  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState("All");
  const [search, setSearch] = useState("");
  const [activeItem, setActiveItem] = useState(null);

  const projectFilters = [
    { label: "All", value: "All" },
    ...projects.map((p) => ({ label: p.title, value: p.id })),
  ];

  const getProjectName = (projectId) => {
    const found = projects.find((p) => p.id === projectId);
    return found ? found.title : "Studio";
  };

  const filteredGallery = gallery.filter((item) => {
    const matchesProject =
      selectedProject === "All" || item.projectId === Number(selectedProject);
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.uploadedBy.toLowerCase().includes(search.toLowerCase());
    return matchesProject && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute top-16 left-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
        <Container>
          <div className="mb-6">
            <BackButton label="Back" fallback="/" variant="subtle" />
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold">
              <Sparkles size={16} />
              Visual Archive
            </span>
            <h1 className="mt-5 text-5xl md:text-6xl font-black">
              Studio <span className="text-cyan-400">Gallery</span>
            </h1>
            <p className="mt-4 text-gray-400 text-lg">
              Explore official Bangla dub posters, recording booth sessions, and behind-the-scenes moments from Legion of Vocals.
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap justify-center gap-2">
              {projectFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedProject(filter.value)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    selectedProject === filter.value
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25"
                      : "bg-slate-900 text-gray-300 border border-cyan-500/20 hover:border-cyan-400"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posters or sessions..."
                className="w-full rounded-xl bg-slate-900 border border-cyan-500/20 py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 pb-24">
        <Container>
          {filteredGallery.length === 0 ? (
            <div className="py-20 text-center text-gray-400 bg-slate-900/40 rounded-3xl border border-cyan-500/10">
              <p className="text-xl font-semibold text-white">No gallery items match your filter</p>
              <p className="mt-2 text-sm">Try selecting another project or clearing your search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGallery.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  whileHover={{ y: -6 }}
                  onClick={() => setActiveItem(item)}
                  className="group cursor-pointer rounded-3xl overflow-hidden bg-slate-900 border border-cyan-500/20 hover:border-cyan-400 transition"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
                      {getProjectName(item.projectId)}
                    </span>
                    <button
                      aria-label="Preview Image"
                      className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/70 text-white opacity-0 group-hover:opacity-100 transition"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition">
                      {item.title}
                    </h3>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <User size={14} className="text-cyan-400" />
                        {item.uploadedBy}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-cyan-400" />
                        {item.uploadDate}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveItem(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden bg-slate-900 border border-cyan-500/30 shadow-2xl"
            >
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-950/80 text-white hover:text-cyan-400 transition"
              >
                <X size={20} />
              </button>

              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="w-full max-h-[70vh] object-cover"
              />

              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    {getProjectName(activeItem.projectId)}
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    {activeItem.title}
                  </h2>
                </div>
                <div className="text-sm text-gray-400">
                  Uploaded by <strong className="text-white">{activeItem.uploadedBy}</strong> •{" "}
                  {activeItem.uploadDate}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default Gallery;