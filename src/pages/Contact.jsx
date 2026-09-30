import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  MapPin,
  Send,
  CheckCircle2,
  HelpCircle,
  Video,
} from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Container from "../components/UI/Container";
import Button from "../components/UI/Button";
import BackButton from "../components/UI/BackButton";

const faqs = [
  {
    q: "How can I audition as a Voice Actor for Legion of Vocals?",
    a: "Click 'Join LOV' in the navigation bar to complete our 6-step application and upload a short MP3/WAV voice sample. Our casting directors review all submissions weekly.",
  },
  {
    q: "Do I need a professional studio microphone to join?",
    a: "While a clean condenser or dynamic USB microphone helps, beginners with good acoustic treatment and clear mobile/headset recordings can also join as trainees or contribute to translation and editing.",
  },
  {
    q: "Can we collaborate or request a specific anime for Bangla dubbing?",
    a: "Yes! Use the contact form on this page and select 'Project Request / Collaboration' to pitch anime series, clip dubs, or community events.",
  },
];

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
    setForm({ name: "", email: "", topic: "General Inquiry", message: "" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute top-16 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />
        <Container>
          <div className="mb-6">
            <BackButton label="Back" fallback="/" variant="subtle" />
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold">
              <MessageSquare size={16} />
              Get In Touch
            </span>
            <h1 className="mt-5 text-5xl md:text-6xl font-black">
              Contact <span className="text-cyan-400">Legion of Vocals</span>
            </h1>
            <p className="mt-4 text-gray-400 text-lg">
              Have questions about auditions, anime dubbing collaborations, or community partnerships? Drop us a message below.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Cards + Form */}
      <section className="py-12 pb-24">
        <Container>
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Left Info Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/20">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-4">
                  <Mail size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Email Us</h3>
                <p className="text-gray-400 text-sm mt-1">
                  For official studio inquiries, casting & partnerships
                </p>
                <p className="text-cyan-400 font-semibold mt-3">
                  contact@legionofvocals.com
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/20">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-4">
                  <Video size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Community Channels</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Join our Official Facebook Group <strong className="text-cyan-400">LOV CORPORATION</strong>, active Discord server, and YouTube premieres
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="https://www.facebook.com/share/g/19MxBAkZsX/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white text-sm font-bold shadow-[0_0_20px_rgba(24,119,242,0.35)] transition"
                  >
                    <span className="w-5 h-5 rounded-md bg-white text-[#1877F2] flex items-center justify-center font-black text-xs">
                      f
                    </span>
                    Join Our Official Facebook Group: LOV CORPORATION
                  </a>
                  <a
                    href="https://discord.gg/your-server"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-sm font-semibold hover:bg-cyan-500 hover:text-slate-950 transition"
                  >
                    Discord Server
                  </a>
                  <a
                    href="https://youtube.com/@legionofvocals"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-gray-200 text-sm font-semibold hover:border-cyan-400 transition"
                  >
                    YouTube
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/20">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-4">
                  <MapPin size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Location</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Dhaka, Bangladesh (Remote Cloud Recording & Production Network)
                </p>
              </div>
            </div>

            {/* Right Form Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3 p-8 md:p-10 rounded-3xl bg-slate-900 border border-cyan-500/20"
            >
              <h2 className="text-3xl font-bold text-white">Send a Message</h2>
              <p className="text-gray-400 mt-2">
                Fill out the form below and our management team will respond within 24–48 hours.
              </p>

              {submitted && (
                <div className="mt-6 p-4 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-center gap-3 text-green-300">
                  <CheckCircle2 size={22} className="shrink-0" />
                  <span>
                    Thank you! Your message has been sent to the Legion of Vocals team.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 px-4 py-3.5 text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 px-4 py-3.5 text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject / Inquiry Type
                  </label>
                  <select
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 px-4 py-3.5 text-white outline-none focus:border-cyan-400"
                  >
                    <option>General Inquiry</option>
                    <option>Voice Acting Auditions</option>
                    <option>Project Request / Collaboration</option>
                    <option>Technical / Portal Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 p-4 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <Button type="submit" size="lg" leftIcon={<Send size={18} />}>
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-white text-center mb-10 flex items-center justify-center gap-3">
              <HelpCircle className="text-cyan-400" />
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {faqs.map((item) => (
                <div
                  key={item.q}
                  className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/20"
                >
                  <h3 className="text-lg font-bold text-cyan-400">{item.q}</h3>
                  <p className="mt-3 text-sm text-gray-300 leading-6">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;