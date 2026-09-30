import {
  Users,
  FolderKanban,
  Mic2,
  Trophy,
} from "lucide-react";

import StatCard from "../../UI/StatCard";

const stats = [
  {
    title: "Members",
    value: 24,
    icon: Users,
  },
  {
    title: "Projects",
    value: 8,
    icon: FolderKanban,
  },
  {
    title: "Dub Videos",
    value: 31,
    icon: Mic2,
  },
  {
    title: "Points",
    value: 12850,
    icon: Trophy,
  },
];

function AdminStats() {
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