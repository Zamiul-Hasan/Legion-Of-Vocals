import { motion } from "framer-motion";
import Button from "../UI/Button";
import Container from "../UI/Container";

function CTASection() {
  return (
    <section className="relative py-24 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 overflow-hidden">
      {/* Glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative z-10 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Join LOV?
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-white/90 text-lg leading-8">
            Become a part of Bangladesh's growing anime dubbing community.
            Meet talented voice actors, collaborate on exciting projects,
            and help bring anime to life in Bangla.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="https://www.facebook.com/share/g/19MxBAkZsX/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-base shadow-[0_0_25px_rgba(24,119,242,0.45)] transition transform hover:-translate-y-0.5"
            >
              <span className="w-6 h-6 rounded-lg bg-white text-[#1877F2] flex items-center justify-center font-black text-sm">
                f
              </span>
              Join Our Official Facebook Group — LOV CORPORATION
            </a>

            <Button
              onClick={() =>
                window.open("https://discord.gg/your-server", "_blank")
              }
            >
              🎤 Join Discord
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                window.open("https://youtube.com/@legionofvocals", "_blank")
              }
            >
              📺 Visit YouTube
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export default CTASection;