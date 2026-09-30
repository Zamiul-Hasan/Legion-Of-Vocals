import { motion } from "framer-motion";

function StatCard({
  icon: Icon,
  title,
  value,
  color = "text-cyan-400",
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-400">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-white mt-3">
            {value}
          </h2>

        </div>

        <div
          className={`w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center ${color}`}
        >
          <Icon size={28} />
        </div>

      </div>
    </motion.div>
  );
}

export default StatCard;