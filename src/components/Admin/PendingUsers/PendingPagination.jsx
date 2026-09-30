import { ChevronLeft, ChevronRight } from "lucide-react";

function PendingPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-cyan-500/20 bg-slate-900 px-6 py-4">
      <button
        onClick={() =>
          onPageChange(Math.max(currentPage - 1, 1))
        }
        disabled={currentPage === 1}
        className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={18} />
        Previous
      </button>

      <span className="font-medium text-gray-300">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() =>
          onPageChange(
            Math.min(currentPage + 1, totalPages)
          )
        }
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export default PendingPagination;