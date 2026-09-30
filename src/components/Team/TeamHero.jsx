import { motion } from "framer-motion";
import Container from "../UI/Container";
import BackButton from "../UI/BackButton";

function TeamHero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-32 pb-24">

      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[140px]" />
      </div>

      <Container>
        <div className="relative z-10 mb-6">
          <BackButton label="Back" fallback="/" variant="subtle" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <span className="inline-flex px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold">
            Meet Our Team
          </span>

          <h1 className="mt-8 text-5xl md:text-7xl font-black text-white leading-tight">
            The People Behind
            <span className="block text-cyan-400">
              Legion of Vocals
            </span>
          </h1>

          <p className="mt-8 text-lg text-gray-400 leading-8 max-w-3xl mx-auto">
            Legion of Vocals is powered by passionate voice actors,
            translators, editors, audio engineers and anime lovers
            working together to deliver high-quality Bangla anime dubs.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}

export default TeamHero;