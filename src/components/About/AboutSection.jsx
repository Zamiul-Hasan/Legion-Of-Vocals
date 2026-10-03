import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mic2, Sliders, Languages, Film, CheckCircle2 } from "lucide-react";
import Container from "../UI/Container";
import Button from "../UI/Button";

const highlights = [
  { icon: Mic2, title: "Studio-Grade Voice Acting", desc: "Auditioned voice casts tailored to every character's emotion." },
  { icon: Languages, title: "Natural Bangla Localization", desc: "Authentic script adaptation that preserves anime nuances." },
  { icon: Sliders, title: "Pro Audio Mixing & SFX", desc: "Clean dialogue mastering balanced with original soundtracks." },
  { icon: Film, title: "HD Video Production", desc: "Frame-accurate lip-sync and localized visual typesetting." },
];

function AboutSection() {
  return (
    <section className="bg-slate-900 py-24 relative overflow-hidden">
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-cyan-400 font-semibold uppercase tracking-widest text-sm">
              About LOV
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white leading-tight">
              Giving Anime Characters a <span className="text-cyan-400">Bengali Voice</span>
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

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-300">
              <span className="inline-flex items-center gap-2 bg-slate-800/90 border border-cyan-500/20 px-3.5 py-2 rounded-xl">
                <CheckCircle2 size={16} className="text-cyan-400" />
                Multi-stage Quality Assurance
              </span>
              <span className="inline-flex items-center gap-2 bg-slate-800/90 border border-cyan-500/20 px-3.5 py-2 rounded-xl">
                <CheckCircle2 size={16} className="text-cyan-400" />
                Open Community Auditions
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/about">
                <Button>
                  Learn More About Us
                </Button>
              </Link>
              <Link to="/team">
                <Button variant="secondary">
                  Meet the Cast & Crew
                </Button>
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
                  className="p-6 rounded-3xl border border-cyan-500/20 bg-slate-950/70 backdrop-blur-xl hover:border-cyan-400 transition duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
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