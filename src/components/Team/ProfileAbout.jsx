import {
  MapPin,
  Calendar,
  Briefcase,
  User,
  Fingerprint,
  Mail,
  CheckCircle2,
} from "lucide-react";

function ProfileAbout({ member }) {
  return (
    <section className="bg-slate-950 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* About */}
          <div className="lg:col-span-2 bg-slate-900 border border-cyan-500/20 rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">
              About
            </h2>

            <p className="text-gray-300 leading-8">
              {member.bio}
            </p>
          </div>

          {/* Member Info */}
          <div className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Member Info
            </h2>

            <div className="space-y-5">
              {member.lovId && (
                <div className="flex items-center gap-3">
                  <Fingerprint className="text-cyan-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Unique LOV ID</p>
                    <p className="text-cyan-400 font-mono font-bold">
                      {member.lovId}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <User className="text-cyan-400" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Username</p>
                  <p className="text-white">@{member.username}</p>
                </div>
              </div>

              {member.email && (
                <div className="flex items-center gap-3">
                  <Mail className="text-cyan-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Verified Email</p>
                    <p className="text-white flex items-center gap-1.5 text-sm">
                      {member.email}
                      {member.emailVerified && (
                        <CheckCircle2 size={15} className="text-green-400" />
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Briefcase className="text-cyan-400" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Role</p>
                  <p className="text-white">{member.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="text-cyan-400" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Department</p>
                  <p className="text-white">{member.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-cyan-400" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white">{member.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-cyan-400" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Joined</p>
                  <p className="text-white">{member.joined}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileAbout;