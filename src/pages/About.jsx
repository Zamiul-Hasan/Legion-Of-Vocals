import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mic2,
  Languages,
  Sliders,
  Film,
  Sparkles,
  Users,
  ShieldCheck,
  HeartHandshake,
  Rocket,
  Award,
} from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Container from "../components/UI/Container";
import SectionTitle from "../components/UI/SectionTitle";
import Button from "../components/UI/Button";
import BackButton from "../components/UI/BackButton";
import stats from "../data/stats";

const pipelineSteps = [
  {
    step: "01",
    title: "Script Translation & Localization",
    description:
      "Our translators adapt Japanese and English scripts into natural, emotionally resonant Bangla while keeping lip-flap timing in mind.",
    icon: Languages,
  },
  {
    step: "02",
    title: "Character Auditions & Casting",
    description:
      "Voice actors audition for roles, and our directors cast the voice that best captures each character's personality and vocal range.",
    icon: Users,
  },
  {
    step: "03",
    title: "Directed Voice Recording",
    description:
      "Cast members record high-clarity vocal stems with line-by-line emotional direction for peak dramatic and comedic delivery.",
    icon: Mic2,
  },
  {
    step: "04",
    title: "Audio Engineering & SFX Mixing",
    description:
      "Sound engineers clean vocal tracks, apply acoustic spatialization, and blend dialogue seamlessly with original OSTs and sound effects.",
    icon: Sliders,
  },
  {
    step: "05",
    title: "Video Sync & Visual Typesetting",
    description:
      "Video editors synchronize every syllable to character mouth movements and localize on-screen titles and signs in Bangla.",
    icon: Film,
  },
  {
    step: "06",
    title: "Quality Assurance & Premiere",
    description:
      "After multi-round review by senior directors, the final episode premieres for our community across YouTube, Facebook, and the LOV Portal.",
    icon: Rocket,
  },
];

const values = [
  {
    icon: Award,
    title: "Uncompromising Quality",
    text: "We treat fan dubbing with studio-level discipline so Bangla anime viewers experience authentic, goosebump-inducing performances.",
  },
  {
    icon: HeartHandshake,
    title: "Mentorship & Growth",
    text: "Newcomers learn voice acting, mixing, and editing from experienced creators through workshops, feedback, and collaborative projects.",
  },
  {
    icon: ShieldCheck,
    title: "Structured Recognition",
    text: "Every contributor earns points, badges, and portfolio credits for every episode they help bring to life.",
  },
];

function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[130px] pointer-events-none" />

        <Container>
          <div className="mb-6">
            <BackButton label="Back" fallback="/" variant="subtle" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold">
              <Sparkles size={16} />
              Our Story & Production Studio
            </span>

            <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight leading-tight">
              Pioneering <span className="text-cyan-400">Bangla Anime</span> Voice Acting
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-300 leading-8">
              Legion of Vocals (LOV) is a collective of Bangladeshi voice actors,
              scriptwriters, audio engineers, and visual editors united by one goal:
              delivering cinema-grade Bengali dubs for the world&apos;s most iconic anime series.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/join">
                <Button size="lg">Join Our Crew</Button>
              </Link>
              <Link to="/projects">
                <Button variant="secondary" size="lg">
                  Explore Releases
                </Button>
              </Link>
              <a
                href="https://www.facebook.com/share/g/19MxBAkZsX/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-base shadow-[0_0_25px_rgba(24,119,242,0.4)] transition"
              >
                <span className="w-6 h-6 rounded-lg bg-white text-[#1877F2] flex items-center justify-center font-black text-sm">
                  f
                </span>
                Join Our Official Facebook Group: LOV CORPORATION
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Stats Grid */}
      <section className="py-16 border-y border-cyan-500/20 bg-slate-900/50">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/20 text-center hover:border-cyan-400 transition"
              >
                <h3 className="text-4xl md:text-5xl font-black text-cyan-400">
                  {item.value}
                </h3>
                <p className="mt-2 text-lg font-bold text-white">{item.label}</p>
                <p className="mt-1 text-sm text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <Container>
          <SectionTitle
            title="Core Values"
            subtitle="Why creators and anime fans across Bangladesh choose Legion of Vocals."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="p-8 rounded-3xl bg-slate-900 border border-cyan-500/20 hover:border-cyan-400 transition"
                >
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{val.title}</h3>
                  <p className="mt-4 text-gray-400 leading-7">{val.text}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Production Pipeline */}
      <section className="py-24 bg-slate-900/60 border-t border-cyan-500/15">
        <Container>
          <SectionTitle
            title="Our 6-Stage Dubbing Pipeline"
            subtitle="How every episode goes from raw Japanese dialogue to a polished Bangla release."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pipelineSteps.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  whileHover={{ y: -6 }}
                  className="p-7 rounded-3xl bg-slate-950 border border-cyan-500/20 hover:border-cyan-400 transition relative overflow-hidden"
                >
                  <span className="absolute top-5 right-6 text-4xl font-black text-cyan-500/15 select-none">
                    {item.step}
                  </span>

                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-5">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-gray-400 text-sm leading-6">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}

export default About;