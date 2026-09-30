function PendingFilters({
  sort,
  onSortChange,
}) {
  return (
    <div className="flex gap-4">

      <select
        value={sort}
        onChange={(e) =>
          onSortChange(e.target.value)
        }
        className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
      >
        <option>Sort By</option>
        <option>Newest</option>
        <option>Oldest</option>
        <option>Name (A-Z)</option>
        <option>Name (Z-A)</option>
      </select>

    </div>
  );
}

export default PendingFilters;