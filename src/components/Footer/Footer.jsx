import { Link } from "react-router-dom";
import logo from "../../assets/images/logos/logo.png";
import Container from "../UI/Container";

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-cyan-500/20 py-14">
      <Container>
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo & About */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="LOV Logo"
                className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.7)]"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">
                  LEGION OF VOCALS
                </h2>
                <p className="text-xs text-cyan-400">
                  Anime Bangla Dubbing Community
                </p>
              </div>
            </Link>

            <p className="mt-4 text-gray-400 leading-7 max-w-md">
              Bringing anime characters to life through professional-quality
              Bangla voice acting, translation, sound engineering, and community collaboration.
            </p>

            {/* Official Facebook Group CTA */}
            <div className="mt-5">
              <a
                href="https://www.facebook.com/share/g/19MxBAkZsX/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/40 text-white text-xs sm:text-sm font-bold transition shadow-[0_0_20px_rgba(24,119,242,0.2)] group"
              >
                <span className="w-7 h-7 rounded-xl bg-[#1877F2] text-white flex items-center justify-center font-black text-sm shadow">
                  f
                </span>
                <span>
                  Join Our Official Facebook Group{" "}
                  <span className="text-cyan-400 group-hover:underline">
                    LOV CORPORATION
                  </span>
                </span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2.5 text-gray-400">
              <li><Link to="/" className="hover:text-cyan-400 transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition">About LOV</Link></li>
              <li><Link to="/projects" className="hover:text-cyan-400 transition">Projects</Link></li>
              <li><Link to="/team" className="hover:text-cyan-400 transition">Our Team</Link></li>
              <li><Link to="/gallery" className="hover:text-cyan-400 transition">Gallery</Link></li>
              <li><Link to="/join" className="hover:text-cyan-400 transition">Join LOV</Link></li>
              <li><Link to="/contact" className="hover:text-cyan-400 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Social & Portal */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Community & Portal
            </h3>

            <ul className="space-y-2.5 text-gray-400">
              <li>
                <a
                  href="https://www.facebook.com/share/g/19MxBAkZsX/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 font-semibold hover:text-cyan-300 transition flex items-center gap-1.5"
                >
                  <span>Facebook Group (LOV CORPORATION)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/your-server"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-400 transition"
                >
                  Discord Server
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com/@legionofvocals"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-400 transition"
                >
                  YouTube Channel
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-cyan-400 transition">
                  Member Dashboard
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-cyan-400 transition">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-cyan-500/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Legion of Vocals. All Rights Reserved.</p>
          <p>Crafted with passion for the Bangla Anime Community 🇧🇩</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;