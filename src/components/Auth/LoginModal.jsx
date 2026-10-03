import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader2,
  Shield,
  Sparkles,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { login, signInWithGoogle } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Please enter your Email/Username and Password.");
      return;
    }

    setLoading(true);
    try {
      const res = await login({ identifier, password });
      setLoading(false);

      if (res.success) {
        onClose();
        if (res.user?.role === "founder" || res.user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(res.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || "An error occurred during sign in.");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const res = await signInWithGoogle();
      setGoogleLoading(false);
      if (res?.error) {
        setError(res.error.message);
      }
    } catch (err) {
      setGoogleLoading(false);
      setError(err.message || "Google sign in failed.");
    }
  };

  const handleQuickFounder = () => {
    setIdentifier("zamiul");
    setPassword("founder2026");
    setError("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-cyan-500/30 p-8 shadow-2xl shadow-cyan-500/10"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mb-3">
              <LogIn size={26} />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Sign In to LOV
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Enter your credentials to access your Legion of Vocals portal.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username */}
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
              />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email or Username"
                className="w-full rounded-2xl border border-slate-700 bg-slate-850 pl-11 pr-4 py-3.5 text-white text-sm outline-none transition focus:border-cyan-400 focus:bg-slate-800"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-2xl border border-slate-700 bg-slate-850 pl-11 pr-11 py-3.5 text-white text-sm outline-none transition focus:border-cyan-400 focus:bg-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/25"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Quick Founder shortcut for easy admin access */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-gray-400">
            <span>Admin or Founder?</span>
            <button
              type="button"
              onClick={handleQuickFounder}
              className="text-cyan-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Shield size={13} />
              Fill Founder Login
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-900 px-3 text-gray-500 uppercase tracking-wider font-semibold">
                Or
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3 rounded-2xl border border-slate-700 hover:border-cyan-400/50 bg-slate-850 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-2.5 transition cursor-pointer"
          >
            {googleLoading ? (
              <Loader2 size={16} className="animate-spin text-cyan-400" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Register Link */}
          <div className="mt-5 text-center text-xs text-gray-400">
            <span>Don't have an account? </span>
            <Link
              to="/join"
              onClick={onClose}
              className="text-cyan-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              <Sparkles size={13} />
              Join LOV
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
