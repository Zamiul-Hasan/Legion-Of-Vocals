import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../../UI/Button";

function SuccessModal({
  open,
  lovId,
  email,
  onClose,
}) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!lovId) return;
    navigator.clipboard.writeText(lovId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    onClose();
    navigate("/");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-cyan-500/20 bg-slate-900 p-10 text-center"
          >
            <CheckCircle
              size={70}
              className="mx-auto text-green-400"
            />

            <h2 className="mt-6 text-3xl font-bold text-white">
              Application Submitted
            </h2>

            <p className="mt-3 text-gray-400">
              Thank you for joining{" "}
              <span className="text-cyan-400 font-semibold">
                Legion of Vocals
              </span>
              . Your verified email ({email}) has been recorded.
            </p>

            {/* Unique LOV ID Card */}
            {lovId && (
              <div className="mt-6 p-5 rounded-2xl bg-slate-950 border border-cyan-500/30">
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Save Your Unique LOV Member ID
                </p>
                <div className="mt-2 flex items-center justify-center gap-3">
                  <span className="text-2xl font-black text-cyan-400 tracking-wider">
                    {lovId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 transition"
                    title="Copy LOV ID"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Admins can look up and approve your profile instantly using this ID.
                </p>
              </div>
            )}

            <Button
              className="mt-8 w-full"
              onClick={handleClose}
            >
              Back To Home
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SuccessModal;