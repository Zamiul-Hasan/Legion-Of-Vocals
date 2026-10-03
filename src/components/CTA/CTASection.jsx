import { motion } from "framer-motion";
import Button from "../UI/Button";
import Container from "../UI/Container";
import { useTheme } from "../../context/ThemeContext";
import { Zap, MessageSquare, Video } from "lucide-react";

function CTASection() {
  const { isSasuke } = useTheme();

  return (
    <section className={`relative py-24 overflow-hidden transition-all duration-300 ${
      isSasuke
        ? "bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 border-t border-b border-blue-500/30"
        : "bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700"
    }`}>
      {/* Glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl animate-pulse" />

      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative z-10 text-center"
        >
          {isSasuke && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-black uppercase tracking-widest mb-6">
              <Zap size={14} className="text-yellow-300 animate-pulse" />
              Awaken Your Inner Voice • Legion of Vocals
            </div>
          )}

          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Ready to Voice Anime with LOV?
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-white/90 text-lg leading-8 font-medium">
            Become a part of Bangladesh's premier anime dubbing community.
            Meet talented voice actors, collaborate on exciting projects,
            and help bring anime to life in Bangla.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="https://www.facebook.com/share/g/19MxBAkZsX/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-base shadow-[0_0_25px_rgba(24,119,242,0.45)] transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span className="w-6 h-6 rounded-lg bg-white text-[#1877F2] flex items-center justify-center font-black text-sm">
                f
              </span>
              Join Official Facebook Group: LOV CORPORATION
            </a>

            <button
              type="button"
              onClick={() => window.open("https://discord.gg/your-server", "_blank")}
              className={`px-6 py-3.5 rounded-full font-bold text-base shadow-lg transition cursor-pointer flex items-center gap-2 ${
                isSasuke
                  ? "bg-slate-900 hover:bg-slate-800 text-white border border-slate-700"
                  : "bg-slate-900/90 hover:bg-slate-900 text-white border border-cyan-400/40"
              }`}
            >
              <MessageSquare size={17} className="text-indigo-400" />
              Join Discord
            </button>

            <button
              type="button"
              onClick={() => window.open("https://youtube.com/@legionofvocals", "_blank")}
              className={`px-6 py-3.5 rounded-full font-bold text-base shadow-lg transition cursor-pointer flex items-center gap-2 ${
                isSasuke
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
              }`}
            >
              <Video size={17} className="text-red-400" />
              Visit YouTube
            </button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export default CTASection;