import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  Sparkles,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import emailService from "../../services/emailService";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { login, signInWithGoogle } = useAuth();

  // Mode: "login" | "forgot"
  const [mode, setMode] = useState("login");

  // Login form state
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot password flow state: "request" | "verify" | "success"
  const [forgotStep, setForgotStep] = useState("request");
  const [resetIdentifier, setResetIdentifier] = useState("");
  const [resetTarget, setResetTarget] = useState(null);
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetInfo, setResetInfo] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Initialize rememberMe and saved identifier
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("lov_remember_login");
      if (savedUser) {
        setIdentifier(savedUser);
        setRememberMe(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Cooldown timer for resending OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  // Handle keyboard caps lock detection
  const handleKeyDetection = (e) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState("CapsLock"));
    }
  };

  // Sign In submit handler
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
        if (rememberMe) {
          localStorage.setItem("lov_remember_login", identifier.trim());
        } else {
          localStorage.removeItem("lov_remember_login");
        }

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

  // Google Sign In handler
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

  // Mask email for privacy (e.g. za***n@gmail.com)
  const maskEmail = (email) => {
    if (!email || !email.includes("@")) return email;
    const [name, domain] = email.split("@");
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name.slice(0, 2)}***${name.slice(-1)}@${domain}`;
  };

  // Find account strictly across real registered collections
  const findAccountByQuery = async (query) => {
    const clean = (query || "").trim().toLowerCase();
    if (!clean) return null;

    // 1. Check founder account
    const isFounder =
      clean === "ovi" ||
      clean === "zamiul" ||
      clean === "zamiulhasan6@gmail.com" ||
      clean === "lov-2026-0001";
    if (isFounder) {
      return {
        type: "founder",
        email: "zamiulhasan6@gmail.com",
        name: "MD Zamiul Hasan",
        username: "ovi",
      };
    }

    // 2. Check registered members in lov_members_v2
    const savedMembers = JSON.parse(
      localStorage.getItem("lov_members_v2") || "[]"
    );
    const m = savedMembers.find(
      (u) =>
        (u.email && u.email.toLowerCase() === clean) ||
        (u.username && u.username.toLowerCase() === clean) ||
        (u.lovId && u.lovId.toLowerCase() === clean)
    );
    if (m) {
      return {
        type: "member",
        id: m.id,
        email: m.email,
        name: m.fullName || m.displayName || m.username,
        username: m.username,
      };
    }

    // 3. Check pending applicants in lov_pending_users_v2
    const savedPending = JSON.parse(
      localStorage.getItem("lov_pending_users_v2") ||
        localStorage.getItem("pendingUsers") ||
        "[]"
    );
    const p = savedPending.find(
      (u) =>
        (u.email && u.email.toLowerCase() === clean) ||
        (u.username && u.username.toLowerCase() === clean) ||
        (u.lovId && u.lovId.toLowerCase() === clean)
    );
    if (p) {
      return {
        type: "pending",
        id: p.id,
        email: p.email,
        name: p.fullName || p.username,
        username: p.username,
      };
    }

    // 4. If Supabase is active, check profiles table
    if (isSupabaseConfigured()) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, email, username, full_name, lov_id")
          .or(`email.ilike.${clean},username.ilike.${clean}`)
          .maybeSingle();

        if (profile && profile.email) {
          return {
            type: "supabase",
            id: profile.id,
            email: profile.email,
            name: profile.full_name || profile.username,
            username: profile.username,
          };
        }
      } catch (e) {
        console.warn("[LOV] Supabase profile check error:", e);
      }
    }

    // STRICT: Absolutely NO fallback. If not registered, return null!
    return null;
  };

  // Step 1: Send verification OTP for password reset
  const handleSendResetOtp = async (e) => {
    e?.preventDefault();
    setResetError("");
    setResetInfo("");

    const cleanInput = resetIdentifier.trim();
    if (!cleanInput) {
      setResetError("Please enter your registered Email, Username, or LOV ID.");
      return;
    }

    setResetLoading(true);

    try {
      const target = await findAccountByQuery(cleanInput);
      if (!target || !target.email) {
        setResetLoading(false);
        setResetError(
          "No registered account found matching this Email, Username, or LOV ID. Please register first via Join LOV."
        );
        return;
      }

      setResetTarget(target);

      const res = await emailService.sendVerificationOtp(target.email);
      setResetLoading(false);
      if (res.success) {
        setForgotStep("verify");
        setResendCooldown(60);
        setResetInfo(
          `A 6-digit verification code has been sent to ${maskEmail(target.email)}. Please check your inbox.`
        );
      } else {
        setResetError(
          res.reason || "Failed to dispatch verification code. Please try again."
        );
      }
    } catch (err) {
      setResetLoading(false);
      setResetError(err.message || "Failed to dispatch verification code.");
    }
  };

  // Step 2: Verify OTP and save new password
  const handleConfirmReset = async (e) => {
    e?.preventDefault();
    setResetError("");

    if (!resetOtp.trim() || resetOtp.trim().length < 6) {
      setResetError("Please enter the 6-digit verification code from your email.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setResetError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match. Please re-enter.");
      return;
    }

    setResetLoading(true);
    try {
      const verifyRes = await emailService.verifyOtp(
        resetTarget.email,
        resetOtp.trim()
      );

      if (!verifyRes.success) {
        setResetLoading(false);
        setResetError(verifyRes.reason || "Invalid or expired verification code.");
        return;
      }

      // Update password across targeted storage
      if (resetTarget.type === "founder") {
        localStorage.setItem("lov_founder_password", newPassword);
      } else if (resetTarget.type === "member") {
        const savedMembers = JSON.parse(
          localStorage.getItem("lov_members_v2") || "[]"
        );
        const updated = savedMembers.map((m) =>
          m.id === resetTarget.id ||
          m.email?.toLowerCase() === resetTarget.email?.toLowerCase()
            ? { ...m, password: newPassword }
            : m
        );
        localStorage.setItem("lov_members_v2", JSON.stringify(updated));
      } else if (resetTarget.type === "pending") {
        const savedPending = JSON.parse(
          localStorage.getItem("lov_pending_users_v2") ||
            localStorage.getItem("pendingUsers") ||
            "[]"
        );
        const updated = savedPending.map((p) =>
          p.id === resetTarget.id ||
          p.email?.toLowerCase() === resetTarget.email?.toLowerCase()
            ? { ...p, password: newPassword }
            : p
        );
        localStorage.setItem("lov_pending_users_v2", JSON.stringify(updated));
      }

      // If Supabase is active
      if (isSupabaseConfigured() && resetTarget.email) {
        try {
          await supabase.auth.updateUser({ password: newPassword });
        } catch {
          // ignore
        }
      }

      setResetLoading(false);
      setForgotStep("success");
    } catch (err) {
      setResetLoading(false);
      setResetError(err.message || "Failed to update password. Please try again.");
    }
  };

  const handleReturnToLogin = () => {
    setMode("login");
    setForgotStep("request");
    setResetError("");
    setResetInfo("");
    setResetOtp("");
    setNewPassword("");
    setConfirmPassword("");
    if (resetTarget) {
      setIdentifier(resetTarget.username || resetTarget.email);
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md my-auto rounded-3xl bg-slate-900 border border-cyan-500/30 p-7 sm:p-8 shadow-2xl shadow-cyan-500/10 text-white"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>

          {/* ========================================================== */}
          {/* VIEW: FORGOT PASSWORD FLOW                                 */}
          {/* ========================================================== */}
          {mode === "forgot" ? (
            <div>
              {/* Header */}
              <div className="text-center mb-6 pt-1">
                <div className="inline-flex p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mb-3 shadow-inner">
                  <KeyRound size={26} />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  {forgotStep === "success"
                    ? "Password Reset Complete"
                    : "Reset Password"}
                </h2>
                <p className="text-gray-400 text-xs mt-1 max-w-xs mx-auto">
                  {forgotStep === "request" &&
                    "Enter your registered Email, Username, or LOV ID to receive a verification code."}
                  {forgotStep === "verify" &&
                    "Enter the 6-digit code sent to your email and set your new password."}
                  {forgotStep === "success" &&
                    "Your password has been updated. You can now sign in with your new credentials."}
                </p>
              </div>

              {/* Status Notices */}
              {resetError && (
                <div className="mb-4 p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
                  <AlertCircle size={16} className="shrink-0 text-red-400" />
                  <span>{resetError}</span>
                </div>
              )}
              {resetInfo && forgotStep !== "success" && (
                <div className="mb-4 p-3.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="shrink-0 text-cyan-400" />
                  <span>{resetInfo}</span>
                </div>
              )}

              {/* Step 1: Request OTP */}
              {forgotStep === "request" && (
                <form onSubmit={handleSendResetOtp} className="space-y-4">
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                    />
                    <input
                      type="text"
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      placeholder="Email, Username, or LOV ID"
                      autoFocus
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800/90 pl-11 pr-4 py-3.5 text-white text-sm outline-none transition focus:border-cyan-400 focus:bg-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/25"
                  >
                    {resetLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        <Mail size={18} />
                        Send Verification Code
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: Verify OTP & Enter New Password */}
              {forgotStep === "verify" && (
                <form onSubmit={handleConfirmReset} className="space-y-4">
                  {/* OTP Code Input */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      6-Digit Verification Code
                    </label>
                    <div className="relative">
                      <KeyRound
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                      />
                      <input
                        type="text"
                        maxLength={6}
                        value={resetOtp}
                        onChange={(e) =>
                          setResetOtp(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="123456"
                        autoFocus
                        className="w-full rounded-2xl border border-slate-700 bg-slate-800/90 pl-11 pr-4 py-3 text-white text-center text-lg tracking-widest font-mono outline-none transition focus:border-cyan-400 focus:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                      />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full rounded-2xl border border-slate-700 bg-slate-800/90 pl-11 pr-11 py-3 text-white text-sm outline-none transition focus:border-cyan-400 focus:bg-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                      />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type new password"
                        className="w-full rounded-2xl border border-slate-700 bg-slate-800/90 pl-11 pr-4 py-3 text-white text-sm outline-none transition focus:border-cyan-400 focus:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/25 mt-2"
                  >
                    {resetLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Reset Password
                      </>
                    )}
                  </button>

                  {/* Resend Code */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || resetLoading}
                      onClick={handleSendResetOtp}
                      className="text-xs text-gray-400 hover:text-cyan-400 disabled:opacity-40 transition inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw size={13} className={resetLoading ? "animate-spin" : ""} />
                      {resendCooldown > 0
                        ? `Resend code in ${resendCooldown}s`
                        : "Didn't receive code? Resend"}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Success Screen */}
              {forgotStep === "success" && (
                <div className="text-center py-4 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Password Successfully Updated!
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                      You can now use your new password to access your Legion of Vocals portal account.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReturnToLogin}
                    className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/25"
                  >
                    <LogIn size={18} />
                    Sign In Now
                  </button>
                </div>
              )}

              {/* Back to Sign In Link */}
              <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={handleReturnToLogin}
                  className="text-xs text-gray-400 hover:text-white transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  Back to Sign In
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================== */
            /* VIEW: STANDARD SIGN IN                                     */
            /* ========================================================== */
            <div>
              {/* Header */}
              <div className="text-center mb-6 pt-1">
                <div className="inline-flex p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mb-3 shadow-inner">
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
                    className="w-full rounded-2xl border border-slate-700 bg-slate-800/90 pl-11 pr-4 py-3.5 text-white text-sm outline-none transition focus:border-cyan-400 focus:bg-slate-800"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDetection}
                      onKeyUp={handleKeyDetection}
                      placeholder="Password"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800/90 pl-11 pr-11 py-3.5 text-white text-sm outline-none transition focus:border-cyan-400 focus:bg-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Caps Lock warning */}
                  {capsLockOn && (
                    <div className="text-[11px] text-amber-400 flex items-center gap-1.5 px-2 pt-1 font-medium">
                      <span>⚠️</span>
                      <span>Caps Lock is ON</span>
                    </div>
                  )}
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-200 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 cursor-pointer accent-cyan-500"
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setResetError("");
                      setResetInfo("");
                      setResetIdentifier(identifier || "");
                      setForgotStep("request");
                      setMode("forgot");
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline cursor-pointer"
                  >
                    Forgot password?
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

              {/* Divider */}
              <div className="relative my-4">
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
                className="w-full py-3 rounded-2xl border border-slate-700 hover:border-cyan-400/50 bg-slate-800/90 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-2.5 transition cursor-pointer"
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
              <div className="mt-4 text-center text-xs text-gray-400">
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
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
