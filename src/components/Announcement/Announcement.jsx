import { Link } from "react-router-dom";
import announcements from "../../data/announcements";
import { useTheme } from "../../context/ThemeContext";

function Announcement() {
  const { isSasuke } = useTheme();

  return (
    <section className={`py-14 transition-colors duration-300 ${
      isSasuke ? "bg-[#0a0b0f]" : "bg-slate-900"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
          <span>📢 Latest Announcements</span>
          {isSasuke && (
            <span className="text-xs px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 uppercase tracking-widest font-black">
              LOV Updates
            </span>
          )}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {announcements.map((item) => (
            <div
              key={item.id}
              className={`rounded-3xl border p-6 transition flex flex-col justify-between ${
                isSasuke
                  ? "bg-slate-950/80 border-slate-800 hover:border-blue-500 shadow-md hover:shadow-blue-500/10"
                  : "border-cyan-500/20 bg-slate-800 hover:border-cyan-400"
              }`}
            >
              <div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  isSasuke
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-cyan-400 bg-cyan-500/10"
                }`}>
                  {item.date}
                </span>

                <h3 className="text-white font-bold text-base mt-4 leading-snug">
                  {item.title}
                </h3>
              </div>

              {item.link && (
                <div className={`mt-5 pt-3 border-t ${
                  isSasuke ? "border-slate-800" : "border-slate-700/70"
                }`}>
                  {item.link.startsWith("http") ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 text-xs font-bold transition ${
                        isSasuke
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-cyan-400 hover:text-cyan-300"
                      }`}
                    >
                      {item.linkLabel || "Learn More →"}
                    </a>
                  ) : (
                    <Link
                      to={item.link}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold transition ${
                        isSasuke
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-cyan-400 hover:text-cyan-300"
                      }`}
                    >
                      {item.linkLabel || "Learn More →"}
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Announcement;