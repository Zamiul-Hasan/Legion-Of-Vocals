import { Sparkles } from "lucide-react";

function ProfileSkills({ member }) {
  const skills = Array.isArray(member?.skills) ? member.skills : [];

  return (
    <section className="bg-slate-950 py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-white mb-10">
          Skills
        </h2>

        {skills.length === 0 ? (
          <div className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-12 text-center">
            <p className="text-gray-400">
              No skills added yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-500/10 transition duration-300"
              >
                <Sparkles
                  size={18}
                  className="text-cyan-400"
                />

                <span className="text-white font-medium">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default ProfileSkills;