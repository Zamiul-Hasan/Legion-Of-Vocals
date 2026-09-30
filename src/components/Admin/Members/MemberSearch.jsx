import { Search } from "lucide-react";
import { motion } from "framer-motion";

function MemberSearch({ value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex-1"
    >
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by LOV ID (e.g. LOV-100001), name, username, email..."
        className="
          w-full
          rounded-2xl
          border border-cyan-500/20
          bg-slate-900
          py-3
          pl-12
          pr-5
          text-white
          outline-none
          transition-all
          duration-300
          focus:border-cyan-400
          focus:shadow-lg
          focus:shadow-cyan-500/20
        "
      />
    </motion.div>
  );
}

export default MemberSearch;