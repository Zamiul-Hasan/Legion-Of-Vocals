import { FolderKanban, Video, Star, Users } from "lucide-react";

function ProfileStats({ member }) {
  const stats = [
    {
      title: "Projects",
      value: member?.stats?.projects ?? 0,
      icon: FolderKanban,
    },
    {
      title: "Dub Videos",
      value: member?.stats?.dubVideos ?? 0,
      icon: Video,
    },
    {
      title: "Points",
      value: member?.stats?.points ?? member?.points ?? 100,
      icon: Star,
    },
    {
      title: "Followers",
      value: member?.stats?.followers ?? 0,
      icon: Users,
    },
  ];

  return (
    <section className="bg-slate-950 py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-white mb-10">
          Statistics
        </h2>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-8 hover:border-cyan-400 transition duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                  <Icon
                    size={30}
                    className="text-cyan-400"
                  />
                </div>

                <h3 className="mt-6 text-4xl font-black text-white">
                  {item.value}
                </h3>

                <p className="mt-2 text-gray-400">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default ProfileStats;