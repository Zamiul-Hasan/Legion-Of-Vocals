import { motion } from "framer-motion";

function StatCard({
  title,
  value,
  icon: Icon,
  color = "text-cyan-400",
  bg = "bg-cyan-500/10",
  border = "border-cyan-500/20",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 18,
      }}
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        ${border}
        ${bg}
        p-6
        backdrop-blur-xl
      `}
    >
      {/* Glow */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            {value}
          </h2>
        </div>

        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${bg}`}>
          {Icon && <Icon size={30} className={color} />}
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;