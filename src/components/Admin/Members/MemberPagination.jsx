import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

function MemberPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between mt-8"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 rounded-xl bg-slate-900 border border-cyan-500/20 px-4 py-2 text-white disabled:opacity-40"
      >
        <ChevronLeft size={18} />
        Previous
      </button>

      <div className="flex gap-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={`w-10 h-10 rounded-xl transition ${
              currentPage === index + 1
                ? "bg-cyan-500 text-black"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 rounded-xl bg-slate-900 border border-cyan-500/20 px-4 py-2 text-white disabled:opacity-40"
      >
        Next
        <ChevronRight size={18} />
      </button>
    </motion.div>
  );
}

export default MemberPagination;