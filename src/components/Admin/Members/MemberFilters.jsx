import { motion } from "framer-motion";
import { Filter } from "lucide-react";

function MemberFilters() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap gap-4"
    >
      {/* Role Filter */}
      <div className="relative">
        <Filter
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <select
          className="
            rounded-2xl
            border border-cyan-500/20
            bg-slate-900
            py-3
            pl-10
            pr-5
            text-white
            outline-none
            transition-all
            duration-300
            focus:border-cyan-400
            focus:shadow-lg
            focus:shadow-cyan-500/20
          "
        >
          <option>All Roles</option>
          <option>Founder</option>
          <option>Admin</option>
          <option>Voice Actor</option>
          <option>Editor</option>
          <option>Translator</option>
          <option>Member</option>
        </select>
      </div>

      {/* Status Filter */}
      <select
        className="
          rounded-2xl
          border border-cyan-500/20
          bg-slate-900
          px-5
          py-3
          text-white
          outline-none
          transition-all
          duration-300
          focus:border-cyan-400
          focus:shadow-lg
          focus:shadow-cyan-500/20
        "
      >
        <option>All Status</option>
        <option>Active</option>
        <option>Inactive</option>
        <option>Suspended</option>
        <option>Pending</option>
      </select>

      {/* Sort */}
      <select
        className="
          rounded-2xl
          border border-cyan-500/20
          bg-slate-900
          px-5
          py-3
          text-white
          outline-none
          transition-all
          duration-300
          focus:border-cyan-400
          focus:shadow-lg
          focus:shadow-cyan-500/20
        "
      >
        <option>Sort By</option>
        <option>Newest</option>
        <option>Oldest</option>
        <option>Most Points</option>
        <option>Least Points</option>
        <option>Name (A-Z)</option>
        <option>Name (Z-A)</option>
      </select>
    </motion.div>
  );
}

export default MemberFilters;