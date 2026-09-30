import { Search } from "lucide-react";

function PendingSearch({
  value,
  onChange,
}) {
  return (
    <div className="relative flex-1">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
      />

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder="Search by LOV ID, Name, Username or Email..."
        className="w-full rounded-2xl border border-slate-700 bg-slate-900 py-3 pl-12 pr-4 text-white outline-none transition focus:border-cyan-500"
      />
    </div>
  );
}

export default PendingSearch;