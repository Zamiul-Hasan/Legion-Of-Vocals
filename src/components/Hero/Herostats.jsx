function HeroStats() {
  const stats = [
    { number: "10+", label: "Projects" },
    { number: "50+", label: "Members" },
    { number: "100K+", label: "Community Reach" },
  ];

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