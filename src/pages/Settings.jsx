import { useState, useRef, useEffect } from "react";
import {
  Settings as SettingsIcon,
  User,
  Mic2,
  Globe,
  Shield,
  Save,
  CheckCircle2,
  Camera,
  ImagePlus,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/UI/Button";
import { useMembers } from "../hooks/useMembers";
import ProfilePictureModal from "../components/Profile/ProfilePictureModal";

function Settings() {
  const { currentUser, updateMemberProfile, updateMemberAvatar, updateMemberCover } =
    useMembers();
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const coverInputRef = useRef(null);

  const [profile, setProfile] = useState({
    fullName: currentUser?.fullName || "",
    displayName: currentUser?.displayName || "",
    username: currentUser?.username || "",
    location: currentUser?.location || "",
    department: currentUser?.department || "",
    bio: currentUser?.bio || "",
    microphone: "Audio-Technica AT2020 USB+",
    daw: "Adobe Audition / Reaper",
    discord: "ovi_lov",
    facebook: "https://www.facebook.com/share/g/19MxBAkZsX/",
    youtube: "https://youtube.com/@legionofvocals",
    emailNotifications: true,
    discordAlerts: true,
  });

  useEffect(() => {
    if (currentUser) {
      setProfile((prev) => ({
        ...prev,
        fullName: currentUser.fullName || prev.fullName,
        displayName: currentUser.displayName || prev.displayName,
        username: currentUser.username || prev.username,
        location: currentUser.location || prev.location,
        department: currentUser.department || prev.department,
        bio: currentUser.bio || prev.bio,
      }));
    }
  }, [currentUser]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    updateMemberProfile(currentUser.id || currentUser.username, {
      fullName: profile.fullName,
      displayName: profile.displayName,
      username: profile.username,
      location: profile.location,
      department: profile.department,
      bio: profile.bio,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  const handleCoverFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateMemberCover(currentUser.id, reader.result);
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const tabs = [
    { id: "profile", label: "Profile & Bio", icon: User },
    { id: "studio", label: "Studio & Gear", icon: Mic2 },
    { id: "socials", label: "Social Links", icon: Globe },
    { id: "security", label: "Preferences", icon: Shield },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <SettingsIcon className="text-cyan-400" size={34} />
            Account Settings
          </h1>
          <p className="mt-2 text-gray-400">
            Update your profile picture, cover banner, creator bio, and recording gear specifications.
          </p>
        </div>

        {saved && (
          <div className="p-4 rounded-2xl bg-green-500/15 border border-green-500/30 text-green-300 flex items-center gap-3">
            <CheckCircle2 size={20} />
            <span>Your profile changes have been saved and synced across LOV Portal!</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  activeTab === t.id
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-900 text-gray-300 border border-cyan-500/20 hover:border-cyan-400"
                }`}
              >
                <Icon size={17} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSave}
          className="p-8 rounded-3xl bg-slate-900 border border-cyan-500/20 space-y-6"
        >
          {activeTab === "profile" && (
            <>
              {/* Facebook-Style Profile Picture & Cover Banner Editor */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 mb-6">
                <div className="relative h-36 bg-slate-900">
                  <img
                    src={currentUser.cover}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/85 hover:bg-slate-800 text-white border border-slate-700 hover:border-cyan-400 text-xs font-semibold transition cursor-pointer"
                  >
                    <ImagePlus size={14} className="text-cyan-400" />
                    Edit Cover Photo
                  </button>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFile}
                    className="hidden"
                  />
                </div>

                <div className="px-6 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 relative z-10">
                  <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                    <div className="relative group">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.displayName}
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="w-24 h-24 rounded-full border-4 border-cyan-400 object-cover bg-slate-900 shadow-xl cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => setIsAvatarModalOpen(true)}
                        title="Update Profile Picture"
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-900 hover:bg-cyan-500 text-white hover:text-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-lg transition cursor-pointer"
                      >
                        <Camera size={14} />
                      </button>
                    </div>

                    <div className="text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h3 className="text-lg font-bold text-white">
                          {currentUser.fullName}
                        </h3>
                        {currentUser.avatarFrame && (
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[11px] font-bold text-cyan-300">
                            {currentUser.avatarFrame}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-cyan-400 font-mono">
                        {currentUser.lovId} • @{currentUser.username}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 text-xs font-bold transition cursor-pointer"
                  >
                    <Camera size={15} />
                    Update Profile Picture
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                    className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stage / Display Name
                  </label>
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) =>
                      setProfile({ ...profile, displayName: e.target.value })
                    }
                    className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                    className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) =>
                      setProfile({ ...profile, location: e.target.value })
                    }
                    className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Creator Bio
                </label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 p-4 text-white outline-none focus:border-cyan-400"
                />
              </div>
            </>
          )}

          {activeTab === "studio" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Primary Department
                </label>
                <select
                  value={profile.department}
                  onChange={(e) =>
                    setProfile({ ...profile, department: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 px-4 py-3 text-white outline-none focus:border-cyan-400"
                >
                  <option>Management</option>
                  <option>Voice Acting</option>
                  <option>Video Editing</option>
                  <option>Sound Engineering</option>
                  <option>Translation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Microphone & Audio Interface
                </label>
                <input
                  type="text"
                  value={profile.microphone}
                  onChange={(e) =>
                    setProfile({ ...profile, microphone: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Editing / Recording Software (DAW / NLE)
                </label>
                <input
                  type="text"
                  value={profile.daw}
                  onChange={(e) =>
                    setProfile({ ...profile, daw: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {activeTab === "socials" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Discord Username
                </label>
                <input
                  type="text"
                  value={profile.discord}
                  onChange={(e) =>
                    setProfile({ ...profile, discord: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Facebook Profile URL
                </label>
                <input
                  type="url"
                  value={profile.facebook}
                  onChange={(e) =>
                    setProfile({ ...profile, facebook: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={profile.youtube}
                  onChange={(e) =>
                    setProfile({ ...profile, youtube: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-950 border border-cyan-500/20 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <p className="font-semibold text-white">
                    Email Notifications for Script Assignments
                  </p>
                  <p className="text-xs text-gray-400">
                    Receive an email when a director assigns you to an anime episode.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.emailNotifications}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      emailNotifications: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-cyan-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <p className="font-semibold text-white">
                    Discord Role & Point Sync
                  </p>
                  <p className="text-xs text-gray-400">
                    Automatically sync your portal level and badges with the LOV Discord server.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.discordAlerts}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      discordAlerts: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-cyan-500"
                />
              </label>
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" leftIcon={<Save size={18} />}>
              Save Changes
            </Button>
          </div>
        </form>

        {currentUser && (
          <ProfilePictureModal
            isOpen={isAvatarModalOpen}
            onClose={() => setIsAvatarModalOpen(false)}
            member={currentUser}
            onSave={(newAvatar, options) => {
              updateMemberAvatar(
                currentUser.id || currentUser.username,
                newAvatar,
                options
              );
              setSaved(true);
              setTimeout(() => setSaved(false), 3500);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default Settings;