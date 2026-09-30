import { Search } from "lucide-react";

function MemberSearch({ value, onChange }) {
  return (
    <section className="bg-slate-950 pb-16">
      <div className="max-w-4xl mx-auto px-6">

        <div className="relative">

          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
            size={22}
          />

          <input
            type="text"
            placeholder="Search by Unique LOV ID (e.g. LOV-100001), name, username, or role..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-14 pr-5 py-4 rounded-2xl bg-slate-900 border border-cyan-500/20 text-white outline-none focus:border-cyan-400"
          />

        </div>

      </div>
    </section>
  );
}

export default MemberSearch;