import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

function MemberPagination({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between mt-6 px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-gray-400">
        <span>
          Showing {totalCount != null ? totalCount : 1} member{totalCount === 1 ? "" : "s"}
        </span>
        <span className="font-mono bg-slate-950 border border-cyan-500/20 px-3 py-1 rounded-xl text-cyan-400 font-semibold">
          Page 1 of 1
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2"
    >
      <div className="text-xs text-gray-400">
        Showing page <span className="text-cyan-400 font-bold">{currentPage}</span> of{" "}
        <span className="text-white font-bold">{totalPages}</span>
        {totalCount != null && (
          <span className="text-gray-500 ml-1">({totalCount} total)</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-cyan-500/20 px-3.5 py-2 text-sm text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-cyan-400 transition cursor-pointer"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="flex gap-1.5">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onPageChange(index + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition cursor-pointer ${
                currentPage === index + 1
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30"
                  : "bg-slate-900 text-white hover:bg-slate-800 border border-cyan-500/20"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-cyan-500/20 px-3.5 py-2 text-sm text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-cyan-400 transition cursor-pointer"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export default MemberPagination;