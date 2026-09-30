import { useState } from "react";
import {
  Trophy,
  Gift,
  Sparkles,
  CheckCircle2,
  Crown,
  Mic,
  Headphones,
  Star,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/UI/Button";
import rewards from "../constants/rewards";
import members from "../data/members";

function Rewards() {
  const [points, setPoints] = useState(members[0].stats.points);
  const [category, setCategory] = useState("All");
  const [redeemedIds, setRedeemedIds] = useState([]);
  const [message, setMessage] = useState("");

  const categories = [
    "All",
    "Digital Perks",
    "Subscriptions",
    "Merchandise",
    "Recording Gear",
    "Community",
  ];

  const handleRedeem = (item) => {
    if (redeemedIds.includes(item.id)) return;
    if (points < item.pointsCost) {
      setMessage(`Not enough points to redeem "${item.title}". Keep contributing to earn more!`);
      return;
    }
    setPoints((prev) => prev - item.pointsCost);
    setRedeemedIds((prev) => [...prev, item.id]);
    setMessage(`Successfully redeemed "${item.title}"! Our team will deliver your reward shortly.`);
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case "Crown":
        return <Crown size={26} className="text-yellow-400" />;
      case "Mic":
        return <Mic size={26} className="text-cyan-400" />;
      case "Headphones":
        return <Headphones size={26} className="text-pink-400" />;
      case "Star":
        return <Star size={26} className="text-amber-400" />;
      default:
        return <Sparkles size={26} className="text-cyan-400" />;
    }
  };

  const filteredRewards = rewards.filter(
    (r) => category === "All" || r.category === category
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Top Banner with Balance */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/50 border border-cyan-500/25">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              <Gift className="text-cyan-400" size={34} />
              Creator Rewards Store
            </h1>
            <p className="mt-2 text-gray-400 max-w-xl">
              Redeem your hard-earned dubbing, translation, and editing contribution points for studio gear, merch, and community perks.
            </p>
          </div>

          <div className="px-6 py-4 rounded-2xl bg-slate-950 border border-yellow-500/30 flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/15 text-yellow-400 flex items-center justify-center">
              <Trophy size={26} />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Available Balance
              </p>
              <p className="text-3xl font-black text-yellow-400">
                {points.toLocaleString()} <span className="text-sm font-semibold">PTS</span>
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center gap-3">
            <CheckCircle2 size={20} className="shrink-0" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                category === cat
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-900 text-gray-300 border border-cyan-500/20 hover:border-cyan-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRewards.map((item) => {
            const isRedeemed = redeemedIds.includes(item.id);
            const canAfford = points >= item.pointsCost;

            return (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/20 hover:border-cyan-400 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {getIcon(item.icon)}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-gray-300 border border-slate-700">
                      {item.stock}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-cyan-400">
                    {item.category}
                  </span>

                  <h3 className="text-xl font-bold text-white mt-1">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-400 mt-2 leading-6">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-gray-400 block">Cost</span>
                    <span className="text-xl font-black text-yellow-400">
                      {item.pointsCost} PTS
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant={isRedeemed ? "secondary" : canAfford ? "primary" : "secondary"}
                    disabled={isRedeemed || !canAfford}
                    onClick={() => handleRedeem(item)}
                  >
                    {isRedeemed
                      ? "✓ Redeemed"
                      : canAfford
                      ? "Redeem Reward"
                      : "Need More Points"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Rewards;