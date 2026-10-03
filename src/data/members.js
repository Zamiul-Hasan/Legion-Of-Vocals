import avatar from "../assets/images/logos/logo.png";
import blueLockBanner from "../assets/images/temp/blue-lock-banner.jpg";

// Fresh start: Only the verified Founder profile is initialized.
// All other members will be dynamically added as real people register via Supabase Auth!
const members = [
  {
    id: 1,
    lovId: "LOV-2026-0001",
    username: "ovi",
    fullName: "MD Zamiul Hasan",
    displayName: "MD Zamiul Hasan",
    email: "zamiulhasan6@gmail.com",
    emailVerified: true,
    avatar,
    cover: blueLockBanner,
    password: "LOV@Zamiul",
    bio: "Founder & Director of Legion of Vocals. Passionate about anime dubbing and building the biggest Bangla anime dubbing community in Bangladesh.",
    department: "Management",
    role: "Founder",
    level: 1,
    status: "Verified",
    joined: "June 2026",
    joinedAt: "2026-06-01",
    location: "Bangladesh",
    social: {
      facebook: "https://www.facebook.com/share/g/19MxBAkZsX/",
      discord: "",
      youtube: "",
      github: "",
    },
    skills: [
      "Voice Acting",
      "Direction",
      "Project Management",
      "Community Building",
    ],
    stats: {
      projects: 0,
      dubVideos: 0,
      points: 100,
      followers: 0,
    },
    achievements: ["Founder", "Verified Member"],
    permissions: {
      canUploadProject: true,
      canUploadDub: true,
      canManageMembers: true,
    },
  },
];

export default members;