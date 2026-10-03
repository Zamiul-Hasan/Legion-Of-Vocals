import { Link } from "react-router-dom";
import logo from "../../assets/images/logos/logo.png";
import Container from "../UI/Container";
import { useTheme } from "../../context/ThemeContext";

function Footer() {
  const { isSasuke } = useTheme();

  return (
    <footer className={`border-t py-14 transition-colors duration-300 ${
      isSasuke
        ? "bg-[#090a0f] border-slate-800"
        : "bg-slate-950 border-cyan-500/20"
    }`}>
      <Container>
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo & About */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center p-2 shadow-md ${
                isSasuke
                  ? "bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-500/20"
                  : "bg-slate-900 border border-cyan-500/40"
              }`}>
                <img
                  src={logo}
                  alt="LOV Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">
                  LEGION OF VOCALS
                </h2>
                <p className={`text-xs font-bold ${
                  isSasuke ? "text-blue-400" : "text-cyan-400"
                }`}>
                  Anime Bangla Dubbing Community
                </p>
              </div>
            </Link>

            <p className="mt-4 text-gray-400 leading-7 max-w-md text-sm">
              Bringing anime characters to life through professional-quality
              Bangla voice acting, translation, sound engineering, and community collaboration.
            </p>

            {/* Official Facebook Group CTA */}
            <div className="mt-5">
              <a
                href="https://www.facebook.com/share/g/19MxBAkZsX/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-full border text-white text-xs sm:text-sm font-bold transition shadow-md group ${
                  isSasuke
                    ? "bg-[#1877F2]/20 hover:bg-[#1877F2]/30 border-[#1877F2]/50 shadow-[#1877F2]/20"
                    : "bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border-[#1877F2]/40"
                }`}
              >
                <span className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-black text-sm shadow">
                  f
                </span>
                <span>
                  Join Our Official Facebook Group{" "}
                  <span className={isSasuke ? "text-blue-300 group-hover:underline" : "text-cyan-400 group-hover:underline"}>
                    LOV CORPORATION
                  </span>
                </span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-black text-base uppercase tracking-wider mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/" className={`transition ${isSasuke ? "hover:text-blue-400" : "hover:text-cyan-400"}`}>Home</Link></li>
              <li><Link to="/about" className={`transition ${isSasuke ? "hover:text-blue-400" : "hover:text-cyan-400"}`}>About LOV</Link></li>
              <li><Link to="/projects" className={`transition ${isSasuke ? "hover:text-blue-400" : "hover:text-cyan-400"}`}>Projects</Link></li>
              <li><Link to="/contests" className={`transition ${isSasuke ? "hover:text-blue-400" : "hover:text-cyan-400"}`}>Contests & Arena</Link></li>
              <li><Link to="/team" className={`transition ${isSasuke ? "hover:text-blue-400" : "hover:text-cyan-400"}`}>Our Team</Link></li>
              <li><Link to="/gallery" className={`transition ${isSasuke ? "hover:text-blue-400" : "hover:text-cyan-400"}`}>Gallery</Link></li>
              <li><Link to="/join" className={`transition ${isSasuke ? "hover:text-blue-400" : "hover:text-cyan-400"}`}>Join LOV</Link></li>
              <li><Link to="/contact" className={`transition ${isSasuke ? "hover:text-blue-400" : "hover:text-cyan-400"}`}>Contact</Link></li>
            </ul>
          </div>

          {/* Social & Portal */}
          <div>
            <h3 className="text-white font-black text-base uppercase tracking-wider mb-4">
              Community & Portal
            </h3>

            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a
                  href="https://www.facebook.com/share/g/19MxBAkZsX/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-bold transition flex items-center gap-1.5 ${
                    isSasuke ? "text-blue-400 hover:text-blue-300" : "text-cyan-400 hover:text-cyan-300"
                  }`}
                >
                  <span>Facebook (LOV CORPORATION)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/your-server"
                  target="_blank"
                  rel="noreferrer"
                  className={`transition ${isSasuke ? "hover:text-blue-400" : "hover:text-cyan-400"}`}
                >
                  Discord Server
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com/@legionofvocals"
                  target="_blank"
                  rel="noreferrer"
                  className={`transition ${isSasuke ? "hover:text-blue-400" : "hover:text-cyan-400"}`}
                >
                  YouTube Channel
                </a>
              </li>
              <li>
                <Link to="/dashboard" className={`transition ${isSasuke ? "hover:text-blue-400" : "hover:text-cyan-400"}`}>
                  Member Dashboard
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className={`transition ${isSasuke ? "hover:text-blue-400" : "hover:text-cyan-400"}`}>
                  Leaderboard & Arena
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={`mt-12 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 ${
          isSasuke ? "border-slate-800/80" : "border-cyan-500/20"
        }`}>
          <p>© {new Date().getFullYear()} Legion of Vocals • All Rights Reserved.</p>
          <p className="flex items-center gap-2">
            <span>Crafted with passion for the Bangla Anime Community 🇧🇩</span>
            {isSasuke && <span className="text-blue-500 font-bold">• Sasuke Edition</span>}
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;