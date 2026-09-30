import blueLockBanner from "../assets/images/temp/blue-lock-banner.jpg";
import demonSlayerBanner from "../assets/images/temp/Demon-Slayer-banner.jpg";
import soloLevelingBanner from "../assets/images/temp/solo-leveling-banner.jpg";

export const bannerPresets = [
  { label: "Demon Slayer Visual", url: demonSlayerBanner },
  { label: "Solo Leveling Visual", url: soloLevelingBanner },
  { label: "Blue Lock Visual", url: blueLockBanner },
];

const projects = [
  {
    id: 1,
    title: "Demon Slayer",
    status: "Completed",
    description:
      "Full Bangla Dub by Legion of Vocals featuring studio-grade vocal mastering and localized dialogue.",
    image: demonSlayerBanner,
    banner: demonSlayerBanner,
    category: "Anime Dub",
    episodes: "12 Episodes",
    director: "Zamiul Hasan",
    progress: 100,
    releaseDate: "January 2026",
    dubVideos: [1, 2, 3],
    contributors: [1, 2, 3],
  },

  {
    id: 2,
    title: "Solo Leveling",
    status: "Ongoing",
    description:
      "New Bangla dub episodes of Solo Leveling are currently in active production by the LOV studio team.",
    image: soloLevelingBanner,
    banner: soloLevelingBanner,
    category: "Anime Dub",
    episodes: "12 Episodes",
    director: "Zamiul Hasan",
    progress: 45,
    releaseDate: "July 2026",
    dubVideos: [4],
    contributors: [1, 2],
  },

  {
    id: 3,
    title: "Blue Lock",
    status: "Upcoming",
    description:
      "The Blue Lock Bangla Dub is currently in pre-production and casting. Stay tuned for updates from Legion of Vocals.",
    image: blueLockBanner,
    banner: blueLockBanner,
    category: "Anime Dub",
    episodes: "24 Episodes",
    director: "Zamiul Hasan",
    progress: 10,
    releaseDate: "Coming Soon",
    dubVideos: [],
    contributors: [1],
  },
];

export default projects;