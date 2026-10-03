import { useTheme } from "../../context/ThemeContext";

function HeroStats({ isSasuke: isSasukeProp }) {
  const { isSasuke: isSasukeTheme } = useTheme();
  const isSasuke = isSasukeProp !== undefined ? isSasukeProp : isSasukeTheme;

  const stats = [
    { number: "15+", label: "Anime Projects" },
    { number: "60+", label: "Studio Members" },
    { number: "100K+", label: "Community Reach" },
  ];

  if (isSasuke) {
    return (
      <div className="grid grid-cols-3 gap-3 max-w-lg">
        {stats.map((item, index) => (
          <div
            key={index}
            className="p-3 rounded-2xl bg-white/80 border border-slate-300 text-center shadow-xs"
          >
            <h3 className="text-xl sm:text-2xl font-black text-blue-600">
              {item.number}
            </h3>
            <p className="text-slate-600 text-[11px] font-bold mt-0.5">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-14 flex flex-wrap justify-center gap-10">
      {stats.map((item, index) => (
        <div key={index} className="text-center">
          <h3 className="text-3xl font-bold text-cyan-400">
            {item.number}
          </h3>

          <p className="text-gray-400 text-sm mt-1">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default HeroStats;