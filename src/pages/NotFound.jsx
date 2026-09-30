import { Link } from "react-router-dom";
import { Compass, Home, FolderKanban } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Button from "../components/UI/Button";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6 pt-28 pb-20 relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-xl">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-6">
            <Compass size={40} />
          </div>

          <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            404
          </h1>

          <h2 className="mt-4 text-3xl font-bold text-white">
            Episode or Page Not Found
          </h2>

          <p className="mt-3 text-gray-400 leading-7">
            Looks like this scene was cut from the final edit! Let&apos;s get you back to the Legion of Vocals studio.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button leftIcon={<Home size={18} />}>
                Back to Home
              </Button>
            </Link>
            <Link to="/projects">
              <Button variant="secondary" leftIcon={<FolderKanban size={18} />}>
                Browse Projects
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default NotFound;