import { motion } from "framer-motion";
import { UserPlus, ShieldCheck, Sparkles } from "lucide-react";

function JoinHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-900 px-8 py-16">

      {/* Glow */}
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-cyan-300"
        >
          <Sparkles size={18} />
          Join Bangladesh's Anime Dubbing Community
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-5xl font-extrabold leading-tight text-white"
        >
          Join <span className="text-cyan-400">Legion Of Vocals</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5 max-w-3xl text-lg leading-8 text-gray-400"
        >
          Become a verified member of Legion Of Vocals and work with
          talented Voice Actors, Translators, Editors and Creators to
          build the largest Bangla Anime Dubbing community.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <a
            href="https://www.facebook.com/share/g/19MxBAkZsX/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#1877F2]/20 hover:bg-[#1877F2] border border-[#1877F2]/50 text-white font-bold text-sm shadow-[0_0_20px_rgba(24,119,242,0.3)] transition"
          >
            <span className="w-6 h-6 rounded-lg bg-[#1877F2] text-white flex items-center justify-center font-black text-xs">
              f
            </span>
            <span>Join Our Official Facebook Group: LOV CORPORATION</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 grid gap-5 md:grid-cols-3"
        >
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
            <UserPlus className="mb-4 text-cyan-400" />

            <h3 className="text-lg font-semibold text-white">
              Easy Registration
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Complete your profile in just a few simple steps.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
            <ShieldCheck className="mb-4 text-green-400" />

            <h3 className="text-lg font-semibold text-white">
              Admin Verification
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Every application is reviewed before approval.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
            <Sparkles className="mb-4 text-yellow-400" />

            <h3 className="text-lg font-semibold text-white">
              Unlock Member Features
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Upload Dubs, earn points, join events and climb the leaderboard.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default JoinHero;