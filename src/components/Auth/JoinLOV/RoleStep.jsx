import { Briefcase, Award, Languages, FileText } from "lucide-react";
import roles from "../../../data/roles";

function RoleStep({
  formData,
  setFormData,
}) {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputStyle =
    "w-full rounded-2xl border border-slate-700 bg-slate-800 px-12 py-4 text-white outline-none transition focus:border-cyan-400";

  return (
    <div>

      <h2 className="text-3xl font-bold text-white">
        Role Information
      </h2>

      <p className="mt-2 text-gray-400">
        Tell us how you'd like to contribute to LOV.
      </p>

      <div className="mt-10 grid gap-6">

        {/* Preferred Role */}

        <div className="relative">

          <Briefcase
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="">
              Select Your Role
            </option>

            {roles.map((role) => (
              <option
                key={role}
                value={role}
              >
                {role}
              </option>
            ))}

          </select>

        </div>

        {/* Experience */}

        <div className="relative">

          <Award
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />

          <select
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="">
              Experience Level
            </option>

            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Professional</option>

          </select>

        </div>

        {/* Languages */}

        <div className="relative">

          <Languages
            size={20}
            className="absolute left-4 top-5 text-cyan-400"
          />

          <textarea
            rows={3}
            name="languages"
            value={formData.languages}
            onChange={handleChange}
            placeholder="Languages you know (e.g. Bangla, English, Japanese)"
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 py-4 pl-12 pr-4 text-white outline-none transition focus:border-cyan-400"
          />

        </div>

        {/* Bio */}

        <div className="relative">

          <FileText
            size={20}
            className="absolute left-4 top-5 text-cyan-400"
          />

          <textarea
            rows={5}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 py-4 pl-12 pr-4 text-white outline-none transition focus:border-cyan-400"
          />

        </div>

      </div>

    </div>
  );
}

export default RoleStep;