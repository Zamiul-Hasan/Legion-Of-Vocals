import { Trophy } from "lucide-react";

function ProfileAchievements({ member }) {
  const achievements = Array.isArray(member?.achievements) ? member.achievements : [];

  return (
    <section className="bg-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-white mb-10">
          Achievements
        </h2>

        {achievements.length === 0 ? (
          <div className="bg-slate-800 border border-cyan-500/20 rounded-3xl p-12 text-center">
            <p className="text-gray-400">
              No achievements yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-cyan-500/20 rounded-3xl p-8 hover:border-yellow-400 transition duration-300"
              >
                <Trophy
                  className="text-yellow-400"
                  size={34}
                />

                <h3 className="mt-5 text-xl font-bold text-white">
                  {achievement}
                </h3>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default ProfileAchievements;