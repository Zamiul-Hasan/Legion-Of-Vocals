import { useState, useEffect } from "react";
import {
  User,
  AtSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  Loader2,
  Edit2,
  Shield,
} from "lucide-react";
import { emailService } from "../../../services/emailService";
import TurnstileWidget from "../../Common/TurnstileWidget";
import members from "../../../data/members";
import initialPendingUsers from "../../../data/pendingUsers";

function BasicInfoStep({ formData, setFormData }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Cloudflare Turnstile bot verification state
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [turnstileVerified, setTurnstileVerified] = useState(false);

  // Timer countdown for resend button
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmailError("");
      setStatusMessage("");
      setOtpSent(false);
      setEnteredOtp("");
      setFormData({
        ...formData,
        email: value,
        emailVerified: false,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * Strictly validates Gmail according to Google's official account specifications:
   * 1. Must end with @gmail.com
   * 2. Username part between 6 and 30 characters
   * 3. Only letters, numbers, and periods (no consecutive periods, cannot begin/end with period)
   */
  const validateGmail = (email) => {
    const clean = (email || "").trim().toLowerCase();
    if (!clean) {
      return { valid: false, message: "Please enter your Gmail address." };
    }

    if (!clean.endsWith("@gmail.com")) {
      return {
        valid: false,
        message: "Only official Google Gmail addresses (@gmail.com) are accepted.",
      };
    }

    const username = clean.slice(0, -10); // remove '@gmail.com'
    if (username.length < 6 || username.length > 30) {
      return {
        valid: false,
        message: "Gmail usernames must be between 6 and 30 characters in length.",
      };
    }

    // Google allows letters, numbers, and single dots
    if (!/^[a-z0-9]+(\.[a-z0-9]+)*$/i.test(username)) {
      return {
        valid: false,
        message:
          "Invalid Gmail format. Usernames can only contain letters, numbers, and single dots.",
      };
    }

    return { valid: true, cleanEmail: clean };
  };

  /**
   * Check if the email address is already in use by a member or pending applicant
   */
  const checkDuplicateEmail = (email) => {
    const savedPending = JSON.parse(
      localStorage.getItem("lov_pending_users_v2") ||
      localStorage.getItem("pendingUsers") ||
      "[]"
    );
    const allUsedEmails = [
      ...members.map((m) => m.email?.toLowerCase()),
      ...initialPendingUsers.map((p) => p.email?.toLowerCase()),
      ...savedPending.map((p) => p.email?.toLowerCase()),
    ].filter(Boolean);

    return allUsedEmails.includes(email.toLowerCase());
  };

  const handleSendOtp = async () => {
    setEmailError("");
    setStatusMessage("");

    const validation = validateGmail(formData.email);
    if (!validation.valid) {
      setEmailError(validation.message);
      return;
    }

    if (checkDuplicateEmail(validation.cleanEmail)) {
      setEmailError(
        "This Gmail address is already registered with an existing LOV account or pending application."
      );
      return;
    }

    // Require Cloudflare Turnstile human verification
    if (!turnstileVerified && !turnstileToken) {
      setEmailError("Please complete the Cloudflare security verification below.");
      return;
    }

    setSendingOtp(true);
    try {
      const res = await emailService.sendVerificationOtp(validation.cleanEmail);
      setSendingOtp(false);

      if (res.success) {
        setOtpSent(true);
        setResendTimer(60);
        setStatusMessage(
          res.message ||
            `6-digit verification code dispatched to ${validation.cleanEmail}. Check your Inbox and Spam folder.`
        );
      } else {
        setEmailError(
          res.reason ||
            "Unable to send verification code. Please check your email configuration."
        );
      }
    } catch (err) {
      setSendingOtp(false);
      setEmailError(
        err.message || "An unexpected error occurred while sending the code."
      );
    }
  };

  const handleVerifyOtp = async () => {
    setEmailError("");
    setStatusMessage("");

    const cleanCode = enteredOtp.trim();
    if (!cleanCode || cleanCode.length < 6) {
      setEmailError("Please enter the full 6-digit code received in your Gmail.");
      return;
    }

    setVerifyingOtp(true);
    try {
      const res = await emailService.verifyOtp(formData.email, cleanCode);
      setVerifyingOtp(false);

      if (res.success) {
        setFormData({
          ...formData,
          emailVerified: true,
          turnstileVerified: true,
        });
        setOtpSent(false);
        setEnteredOtp("");
        setStatusMessage("Gmail verified successfully! Ownership confirmed.");
      } else {
        setEmailError(
          res.reason || "Invalid verification code. Please check your Gmail and try again."
        );
      }
    } catch (err) {
      setVerifyingOtp(false);
      setEmailError(err.message || "Failed to verify code.");
    }
  };

  const handleEditEmail = () => {
    setFormData({
      ...formData,
      emailVerified: false,
    });
    setOtpSent(false);
    setEnteredOtp("");
    setEmailError("");
    setStatusMessage("");
  };

  const inputStyle =
    "w-full rounded-2xl border border-slate-700 bg-slate-800 px-12 py-4 text-white outline-none transition focus:border-cyan-400";

  return (
    <div>
      <div>
        <h2 className="text-3xl font-bold text-white">Basic Information</h2>
        <p className="mt-2 text-gray-400">
          Enter your personal details. A valid Google Gmail address with 6-digit OTP verification is required to prevent fake applications.
        </p>
      </div>

      <div className="mt-8 grid gap-6">
        {/* Full Name */}
        <div className="relative">
          <User
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name (e.g. Zamiul Hasan)"
            className={inputStyle}
          />
        </div>

        {/* Username */}
        <div className="relative">
          <AtSign
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username (e.g. zamiul)"
            className={inputStyle}
          />
        </div>

        {/* Email Address & Mandatory Verification */}
        <div className="space-y-3">
          <div className="relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={formData.emailVerified}
                placeholder="Google Gmail (e.g. yourname@gmail.com)"
                className={`${inputStyle} ${
                  formData.emailVerified
                    ? "border-green-500/50 bg-green-500/5 text-green-300"
                    : ""
                }`}
              />
              {formData.emailVerified && (
                <ShieldCheck
                  size={20}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400"
                />
              )}
            </div>

            {!formData.emailVerified ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp || !formData.email}
                className="px-6 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/20 shrink-0"
              >
                {sendingOtp ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Verify Gmail
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEditEmail}
                className="px-4 py-4 rounded-2xl border border-slate-700 hover:border-cyan-400/50 bg-slate-800 text-gray-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
                title="Change Email Address"
              >
                <Edit2 size={14} />
                Change Email
              </button>
            )}
          </div>

          {/* Cloudflare Turnstile Human Verification */}
          {!formData.emailVerified && (
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Shield size={16} className="text-cyan-400 shrink-0" />
                <span>
                  {turnstileVerified
                    ? "Human verified via Cloudflare Turnstile."
                    : "Security check: Please complete the challenge before sending OTP."}
                </span>
              </div>
              <TurnstileWidget
                theme="dark"
                onVerify={(token) => {
                  setTurnstileToken(token);
                  setTurnstileVerified(true);
                  setEmailError("");
                }}
                onError={() => {
                  setTurnstileVerified(false);
                  setTurnstileToken(null);
                }}
                onExpire={() => {
                  setTurnstileVerified(false);
                  setTurnstileToken(null);
                }}
              />
            </div>
          )}

          {/* Verification Badge */}
          {formData.emailVerified && (
            <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 size={16} className="text-green-400 shrink-0" />
              <span>Gmail verified successfully! Ownership confirmed. You can proceed to the next steps.</span>
            </div>
          )}

          {/* Status / Success Message */}
          {!formData.emailVerified && statusMessage && (
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {emailError && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{emailError}</span>
            </div>
          )}

          {/* OTP Input Card */}
          {otpSent && !formData.emailVerified && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-white flex items-center gap-2">
                    <KeyRound size={16} className="text-cyan-400" />
                    Enter 6-Digit Verification Code
                  </p>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    A 6-digit code has been sent to{" "}
                    <strong className="text-cyan-400 font-mono">{formData.email}</strong>.
                    Please check your Gmail <strong>Inbox</strong> and <strong>Spam / Junk</strong> folder.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <KeyRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                  />
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit code"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-11 pr-4 py-3 text-white font-mono text-lg tracking-widest outline-none focus:border-cyan-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp || enteredOtp.length < 6}
                  className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-400 disabled:opacity-40 text-slate-950 font-bold text-sm transition cursor-pointer shrink-0 flex items-center justify-center gap-2"
                >
                  {verifyingOtp ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Confirm Code"
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                <span>Didn't receive the email? Check Spam or</span>
                <button
                  type="button"
                  disabled={resendTimer > 0 || sendingOtp}
                  onClick={handleSendOtp}
                  className="text-cyan-400 hover:underline font-semibold disabled:opacity-40 disabled:no-underline cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw size={12} className={sendingOtp ? "animate-spin" : ""} />
                  {resendTimer > 0
                    ? `Resend in ${resendTimer}s`
                    : "Resend Code to Gmail"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <Lock
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password (minimum 6 characters)"
            className={inputStyle}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Lock
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={inputStyle}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BasicInfoStep;