import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({
  label = "Back",
  to = null,
  fallback = "/",
  className = "",
  variant = "glass", // 'glass' | 'subtle' | 'solid'
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
      return;
    }
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  const variants = {
    glass:
      "px-4 py-2 rounded-full bg-slate-900/85 hover:bg-cyan-500 text-white hover:text-slate-950 border border-cyan-500/30 hover:border-cyan-400 backdrop-blur-md shadow-lg transition font-medium text-sm",
    subtle:
      "px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/40 transition font-medium text-sm",
    solid:
      "px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 hover:bg-cyan-500/10 transition font-semibold text-sm",
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 cursor-pointer ${
        variants[variant] || variants.glass
      } ${className}`}
    >
      <ArrowLeft className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
}
