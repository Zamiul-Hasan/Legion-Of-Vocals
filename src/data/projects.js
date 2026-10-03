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
      "Official Bangla Dub project by Legion of Vocals featuring localized dialogue and character voice acting.",
    image: demonSlayerBanner,
    banner: demonSlayerBanner,
    category: "Anime Dub",
    episodes: "12 Episodes",
    director: "Zamiul Hasan",
    progress: 100,
    releaseDate: "January 2026",
    dubVideos: [],
    contributors: [1],
  },

  {
    id: 2,
    title: "Solo Leveling",
    status: "Ongoing",
    description:
      "Bangla dub production of Solo Leveling in active development by the Legion of Vocals studio team.",
    image: soloLevelingBanner,
    banner: soloLevelingBanner,
    category: "Anime Dub",
    episodes: "12 Episodes",
    director: "Zamiul Hasan",
    progress: 35,
    releaseDate: "July 2026",
    dubVideos: [],
    contributors: [1],
  },

  {
    id: 3,
    title: "Blue Lock",
    status: "Upcoming",
    description:
      "The Blue Lock Bangla Dub is currently in pre-production and open casting calls. Stay tuned for auditions!",
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