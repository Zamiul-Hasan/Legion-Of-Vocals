import {
  Users,
  FolderKanban,
  Mic2,
  Trophy,
} from "lucide-react";

import StatCard from "../../UI/StatCard";
import { useMembers } from "../../../hooks/useMembers";
import { useProjects } from "../../../hooks/useProjects";
import { useDubVideos } from "../../../hooks/useDubVideos";

function AdminStats() {
  const { members } = useMembers();
  const { projects } = useProjects();
  const { videos } = useDubVideos();

  const totalPoints = members.reduce(
    (acc, m) => acc + (Number(m.points) || 0),
    0
  );

  const stats = [
    {
      title: "Members",
      value: members.length,
      icon: Users,
    },
    {
      title: "Projects",
      value: projects.length,
      icon: FolderKanban,
    },
    {
      title: "Dub Videos",
      value: videos.length,
      icon: Mic2,
    },
    {
      title: "Total Points",
      value: totalPoints,
      icon: Trophy,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
        />
      ))}
    </div>
  );
}

export default AdminStats;