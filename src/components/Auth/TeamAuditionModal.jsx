import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mic,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function TeamAuditionModal({ isOpen, onClose }) {
  const { user } = useAuth();

  const [role, setRole] = useState("Voice Actor");
  const [sampleLink, setSampleLink] = useState("");
  const [experience, setExperience] = useState("1-2 years");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!sampleLink.trim()) {
      setError("Please provide a link to your voice sample or audition reel.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const saved = JSON.parse(
        localStorage.getItem("lov_auditions_v2") || "[]"
      );
      const newAudition = {
        id: Date.now(),
        userId: user?.id,
        lovId: user?.lovId,
        username: user?.username,
        name: user?.fullName || user?.name,
        email: user?.email,
        role,
        sampleLink: sampleLink.trim(),
        experience,
        notes: notes.trim(),
        submittedAt: new Date().toISOString(),
        status: "Pending Review",
      };

      localStorage.setItem(
        "lov_auditions_v2",
        JSON.stringify([newAudition, ...saved])
      );

      setSubmitting(false);
      setSuccess(true);
    }, 600);
  };

  const handleClose = () => {
    setSuccess(false);
    setError("");
    setSampleLink("");
    setNotes("");
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg my-auto rounded-3xl bg-slate-900 border border-cyan-500/30 p-7 sm:p-8 shadow-2xl shadow-cyan-500/10 text-white"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={20} />
          </button>

          {success ? (
            <div className="text-center py-6">
              <div className="inline-flex p-4 rounded-full bg-green-500/20 text-green-400 mb-4 border border-green-500/40">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Audition Submitted!
              </h3>
              <p className="text-gray-300 text-sm mt-3 leading-relaxed max-w-md mx-auto">
                Thank you, <strong className="text-cyan-400">{user?.fullName || user?.name}</strong>! Your voice sample has been submitted to the LOV Direction Team. Our casting directors will review it and message you via <strong>LOV Messenger</strong>.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-6 px-8 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mb-3">
                  <Mic size={26} />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  Audition for LOV Team
                </h2>
                <p className="text-gray-400 text-xs mt-1">
                  Apply to join official anime dubbing projects as a voice artist or staff member.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Desired Role */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Target Team Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white text-sm outline-none focus:border-cyan-400"
                  >
                    <option value="Voice Actor (Male)">Voice Actor (Male)</option>
                    <option value="Voice Actor (Female)">Voice Actor (Female)</option>
                    <option value="Sound Designer & Mixer">Sound Designer & Mixer</option>
                    <option value="Script Translator">Script Translator (Japanese/English to Bangla)</option>
                    <option value="Video Editor">Video Editor</option>
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Dubbing / Voice Acting Experience
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white text-sm outline-none focus:border-cyan-400"
                  >
                    <option value="Beginner (Passionate to learn)">Beginner (Passionate to learn)</option>
                    <option value="1-2 years">1-2 years experience</option>
                    <option value="3+ years">3+ years experience</option>
                    <option value="Professional Dubber">Professional Dubber</option>
                  </select>
                </div>

                {/* Voice Sample Link */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Audition Reel / Voice Sample Link (Google Drive, YouTube, etc.)
                  </label>
                  <div className="relative">
                    <LinkIcon
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                    />
                    <input
                      type="url"
                      value={sampleLink}
                      onChange={(e) => setSampleLink(e.target.value)}
                      placeholder="https://drive.google.com/... or YouTube link"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Short Bio or Voice Acting Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us about your favorite anime character voices or vocal range..."
                    className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white text-sm outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting Audition...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Submit Audition Application
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
