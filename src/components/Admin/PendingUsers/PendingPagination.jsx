import { ChevronLeft, ChevronRight } from "lucide-react";

function PendingPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-3 text-xs text-gray-400">
        <span>Showing all pending applicants</span>
        <span className="font-mono bg-slate-950 border border-cyan-500/20 px-3 py-1 rounded-xl text-cyan-400 font-semibold">
          Page 1 of 1
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-cyan-500/20 bg-slate-900 px-6 py-4">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
      >
        <ChevronLeft size={18} />
        Previous
      </button>

      <span className="font-medium text-gray-300 text-sm">
        Page <span className="text-cyan-400 font-bold">{currentPage}</span> of{" "}
        <span className="text-white font-bold">{totalPages}</span>
      </span>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
      >
        Next
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export default PendingPagination;