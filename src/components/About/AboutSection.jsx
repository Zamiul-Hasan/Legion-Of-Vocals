import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mic2, Sliders, Languages, Film, CheckCircle2 } from "lucide-react";
import Container from "../UI/Container";
import Button from "../UI/Button";
import { useTheme } from "../../context/ThemeContext";

const highlights = [
  { icon: Mic2, title: "Studio-Grade Voice Acting", desc: "Auditioned voice casts tailored to every character's emotion." },
  { icon: Languages, title: "Natural Bangla Localization", desc: "Authentic script adaptation that preserves anime nuances." },
  { icon: Sliders, title: "Pro Audio Mixing & SFX", desc: "Clean dialogue mastering balanced with original soundtracks." },
  { icon: Film, title: "HD Video Production", desc: "Frame-accurate lip-sync and localized visual typesetting." },
];

function AboutSection() {
  const { isSasuke } = useTheme();

  return (
    <section className={`py-24 relative overflow-hidden transition-colors duration-300 ${
      isSasuke ? "bg-[#0c0d12]" : "bg-slate-900"
    }`}>
      <div className={`absolute -right-24 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${
        isSasuke ? "bg-blue-600/15" : "bg-cyan-500/10"
      }`} />

      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className={`font-black uppercase tracking-widest text-xs px-3.5 py-1 rounded-full ${
              isSasuke ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "text-cyan-400"
            }`}>
              About LOV Studio
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-black text-white leading-tight">
              Giving Anime Characters a{" "}
              <span className={isSasuke ? "text-blue-500" : "text-cyan-400"}>
                Bengali Voice
              </span>
            </h2>

            <p className="mt-6 text-gray-300 leading-8">
              Legion of Vocals (LOV) is a passionate Bangla anime dubbing
              community dedicated to bringing your favorite anime stories to
              life through high-quality Bengali voice acting.
            </p>

            <p className="mt-4 text-gray-400 leading-8">
              Our team consists of talented voice actors, translators,
              editors, sound engineers, and designers who work together to
              create unforgettable experiences for anime fans across Bangladesh and beyond.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <span className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border ${
                isSasuke
                  ? "bg-slate-950/80 border-blue-500/30 text-gray-200"
                  : "bg-slate-800/90 border-cyan-500/20 text-gray-300"
              }`}>
                <CheckCircle2 size={16} className={isSasuke ? "text-blue-400" : "text-cyan-400"} />
                Multi-stage Quality Assurance
              </span>
              <span className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border ${
                isSasuke
                  ? "bg-slate-950/80 border-blue-500/30 text-gray-200"
                  : "bg-slate-800/90 border-cyan-500/20 text-gray-300"
              }`}>
                <CheckCircle2 size={16} className={isSasuke ? "text-blue-400" : "text-cyan-400"} />
                Open Community Auditions
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/about">
                <button className={`px-6 py-3.5 rounded-full font-bold text-sm shadow-md transition cursor-pointer ${
                  isSasuke
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30"
                    : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                }`}>
                  Learn More About Us
                </button>
              </Link>
              <Link to="/team">
                <button className="px-6 py-3.5 rounded-full font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition cursor-pointer">
                  Meet the Cast & Crew
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-5"
          >
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`p-6 rounded-3xl border transition duration-300 ${
                    isSasuke
                      ? "bg-gradient-to-b from-slate-900 to-slate-950 border-slate-700/80 hover:border-blue-500 shadow-lg hover:shadow-blue-500/10"
                      : "border-cyan-500/20 bg-slate-950/70 backdrop-blur-xl hover:border-cyan-400"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                    isSasuke
                      ? "bg-blue-600/20 border border-blue-500/40 text-blue-400"
                      : "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400"
                  }`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400 leading-6">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default AboutSection;