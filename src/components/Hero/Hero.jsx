import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../UI/Button";
import HeroStats from "./Herostats";
import StarBackground from "../Effects/StarBackground";
import heroVideo from "../../assets/videos/hero-bg.mp4";
import sasukeArt from "../../assets/images/themes/sasuke-character-art.jpg";
import { useTheme } from "../../context/ThemeContext";
import SharinganSeals from "../Theme/SharinganSeals";
import { Zap, Sparkles, Trophy, Video } from "lucide-react";

function Hero() {
  const { isSasuke } = useTheme();

  // If Classic Theme is selected, render the original dark cyan neon Hero
  if (!isSasuke) {
    return (
      <section className="relative min-h-screen pt-28 pb-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950/65 z-0"></div>

        {/* Star Background */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <StarBackground />
        </div>

        {/* Animated Glow Background */}
        <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-cyan-500/10 rounded-full blur-[120px]"></div>
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-20 text-center px-6 max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Official Bangla Anime Dubbing Studio & Community
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-wider text-white drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]">
            LEGION OF VOCALS
          </h1>

          <div className="mt-6 text-cyan-400 text-xl md:text-3xl font-bold min-h-[2.5rem]">
            <TypeAnimation
              sequence={[
                "Where Anime Meets Bengali Voices",
                2000,
                "Bangla Anime Dubbing Community",
                2000,
                "Bringing Characters To Life",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>

          <p className="mt-8 max-w-3xl mx-auto text-lg text-gray-300 leading-8">
            We are a passionate Bangla anime dubbing organization dedicated to
            bringing your favorite anime characters to life through
            professional-quality Bengali voice acting.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/projects">
              <Button size="lg">🎬 Watch Projects</Button>
            </Link>

            <Link to="/join">
              <Button variant="secondary" size="lg">
                🎤 Join Community
              </Button>
            </Link>

            <a
              href="https://www.facebook.com/share/g/19MxBAkZsX/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#1877F2]/20 hover:bg-[#1877F2] border border-[#1877F2]/50 text-white font-bold text-base shadow-[0_0_25px_rgba(24,119,242,0.3)] transition"
            >
              <span className="w-6 h-6 rounded-lg bg-[#1877F2] text-white flex items-center justify-center font-black text-sm">
                f
              </span>
              <span>Join Our Official Facebook Group: LOV CORPORATION</span>
            </a>
          </div>

          <HeroStats />

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-14 text-cyan-400 text-3xl select-none"
          >
            ↓
          </motion.div>
        </motion.div>
      </section>
    );
  }

  // =========================================================================
  // SASUKE UCHIHA - MATTE SILVER & ROYAL COBALT CHIDORI HERO (Reference Theme)
  // =========================================================================
  return (
    <section className="relative min-h-screen pt-24 pb-14 px-4 sm:px-6 lg:px-8 bg-[#0a0b0f] flex items-center justify-center overflow-hidden">
      {/* Background Electric Chidori Glow Bleeds */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-sky-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Centerpiece: Rounded Matte Silver Tablet Canvas */}
      <div className="relative z-10 w-full max-w-7xl mx-auto rounded-[32px] md:rounded-[44px] sasuke-silver-canvas border border-slate-300/80 p-6 md:p-10 lg:p-12 overflow-hidden">
        {/* Subtle Silk Wave Ambient Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.8) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(0,0,0,0.06) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN: Sasuke Character, Sharingan Seals & Signature */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* 3 Floating Sharingan Ninja Badges */}
            <div className="mb-4">
              <SharinganSeals />
            </div>

            {/* Sasuke Illustration with Chidori Aura */}
            <div className="relative my-2 w-full max-w-md mx-auto group">
              {/* Electric Blue Aura behind Sasuke */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/40 via-sky-400/30 to-blue-700/40 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-500 animate-chidori" />

              <div className="relative rounded-3xl overflow-hidden border-2 border-slate-400/60 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-2xl">
                <img
                  src={sasukeArt}
                  alt="Sasuke Uchiha - Voice of LOV"
                  className="w-full h-80 sm:h-96 md:h-[400px] object-cover object-left filter contrast-105 transition-transform duration-700 group-hover:scale-105"
                />

                {/* Chidori Electric Lightning Flare */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-blue-600/90 text-white text-[11px] font-black tracking-widest uppercase shadow-lg shadow-blue-500/50 flex items-center gap-1.5">
                  <Zap size={12} className="text-yellow-300 animate-pulse" />
                  Chidori Mode
                </div>

                {/* Cursive Signature: - Sasuke - */}
                <div className="absolute bottom-4 left-5 text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  <p className="text-xs font-black text-blue-400 tracking-widest uppercase">
                    Level 0
                  </p>
                  <p className="font-serif italic text-3xl sm:text-4xl text-white font-extrabold tracking-wide">
                    ~ Sasuke ~
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Copyright Capsule (Matching reference) */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 text-gray-300 border border-slate-700/60 text-xs font-medium shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>©2024 | Legion of Vocals • All rights reserved</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Bold Typography, Blue Bar, Sasuke Quote & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Top Studio Meta */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 text-white text-xs font-bold border border-slate-700">
                <Sparkles size={13} className="text-blue-400" />
                Bangla Anime Dubbing Corporation
              </div>

              <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                ruang_edit • LOV Studio
              </div>
            </div>

            {/* Giant Condensed Bold Typography (Matching "KEYAKINAN AKAN - Memberikanmu - KEKUATAN") */}
            <div className="space-y-1">
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-950 uppercase leading-none font-sans">
                KEYAKINAN AKAN
              </h2>

              <div className="my-2.5">
                <span className="inline-block bg-blue-600 text-white font-black text-sm sm:text-base md:text-lg tracking-widest uppercase px-5 py-1.5 shadow-md">
                  — LEGION OF VOCALS —
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-slate-950 uppercase leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                KEKUATAN
              </h1>
            </div>

            {/* Sasuke Famous Quote Block */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-300 shadow-sm space-y-2">
              <p className="text-slate-800 text-sm sm:text-base italic font-medium leading-relaxed">
                &ldquo;Tak peduli kegelapan apa yang ada di depan, aku akan tetap mengejar jalan itu. Tidak peduli apa yang akan terjadi, aku akan tetap memperoleh kekuatan!&rdquo;
              </p>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                <span className="font-black text-slate-950 uppercase tracking-wide">
                  Quote by — Uchiha Sasuke
                </span>
                <span className="font-bold text-blue-600">
                  Voice & Dubbing Legacy
                </span>
              </div>
            </div>

            {/* Animated Subtitle */}
            <div className="text-slate-800 text-base sm:text-xl font-bold min-h-[1.75rem] flex items-center gap-2">
              <span className="text-blue-600 font-black">▶</span>
              <TypeAnimation
                sequence={[
                  "Where Anime Meets Bengali Voices",
                  2200,
                  "Anime Character Voice Acting Studio",
                  2200,
                  "High-Quality Sound FX & Lip-Sync",
                  2200,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link to="/projects">
                <button className="px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2">
                  <Video size={17} />
                  Watch Projects
                </button>
              </Link>

              <Link to="/contests">
                <button className="px-6 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-black text-sm shadow-md transition transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2">
                  <Trophy size={17} className="text-amber-400" />
                  Contest Arena
                </button>
              </Link>

              <a
                href="https://www.facebook.com/share/g/19MxBAkZsX/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <span className="w-5 h-5 rounded-full bg-white text-[#1877F2] flex items-center justify-center font-black text-xs">
                  f
                </span>
                <span>LOV Facebook Group</span>
              </a>
            </div>

            {/* Stats Counter (Styled for Matte Silver theme) */}
            <div className="pt-3">
              <HeroStats isSasuke={true} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;