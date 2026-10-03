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
  Loader2,
  CheckCircle2,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { verifyRealEmailAddress } from "../../../utils/helpers";
import { emailService } from "../../../services/emailService";
import members from "../../../data/members";
import pendingUsers from "../../../data/pendingUsers";

function BasicInfoStep({ formData, setFormData }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuggestion, setEmailSuggestion] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmailError("");
      setEmailSuggestion("");
      setOtpSent(false);
      setEnteredOtp("");
      setFormData({
        ...formData,
        email: value,
        emailVerified: false,
        emailMxHost: "",
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleVerifyEmail = async () => {
    setEmailError("");
    setEmailSuggestion("");

    const normalizedEmail = (formData.email || "").trim().toLowerCase();
    const savedPending = JSON.parse(
      localStorage.getItem("lov_pending_users_v2") ||
      localStorage.getItem("pendingUsers") ||
      "[]"
    );
    const allUsedEmails = [
      ...members.map((m) => m.email?.toLowerCase()),
      ...pendingUsers.map((p) => p.email?.toLowerCase()),
      ...savedPending.map((p) => p.email?.toLowerCase()),
    ].filter(Boolean);

    if (allUsedEmails.includes(normalizedEmail)) {
      setEmailError(
        "This email address is already registered with another LOV member or application."
      );
      return;
    }

    setCheckingEmail(true);
    const result = await verifyRealEmailAddress(normalizedEmail);

    if (!result.valid) {
      setCheckingEmail(false);
      setEmailError(result.reason);
      if (result.suggestion) {
        setEmailSuggestion(result.suggestion);
      }
      return;
    }

    // Dispatch real OTP to Gmail
    const sendResult = await emailService.sendVerificationOtp(normalizedEmail);
    setCheckingEmail(false);

    if (!sendResult.success) {
      setEmailError(
        sendResult.reason || "Failed to dispatch verification code to Gmail."
      );
      return;
    }

    setOtpSent(true);
    setResendCountdown(30);

    setFormData({
      ...formData,
      email: normalizedEmail,
      emailMxHost: result.mxHost || result.domain,
    });
  };

  const handleConfirmOtp = async () => {
    setEmailError("");
    const verifyResult = await emailService.verifyOtp(formData.email, enteredOtp);

    if (verifyResult.success) {
      setFormData({
        ...formData,
        emailVerified: true,
      });
      setOtpSent(false);
      setEmailError("");
    } else {
      setEmailError(
        verifyResult.reason ||
          "Incorrect verification code. Please check the 6-digit code received in your Gmail."
      );
    }
  };

  const applySuggestion = () => {
    setFormData({
      ...formData,
      email: emailSuggestion,
      emailVerified: false,
    });
    setEmailError("");
    setEmailSuggestion("");
  };

  const inputStyle =
    "w-full rounded-2xl border border-slate-700 bg-slate-800 px-12 py-4 text-white outline-none transition focus:border-cyan-400";

  return (
    <div>
      <div>
        <h2 className="text-3xl font-bold text-white">
          Basic Information
        </h2>
        <p className="mt-2 text-gray-400">
          Enter your personal details and verify your Gmail address. Official LOV ID will be assigned upon successful registration.
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
            placeholder="Full Name"
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
            placeholder="Username (e.g. yourname)"
            className={inputStyle}
          />
        </div>

        {/* Email Verification Box */}
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
                placeholder="Personal Email Address (e.g. yourname@gmail.com)"
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

            {!formData.emailVerified && (
              <button
                type="button"
                onClick={handleVerifyEmail}
                disabled={checkingEmail || !formData.email}
                className="px-6 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/20 shrink-0"
              >
                {checkingEmail ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Verify Real Email
                  </>
                )}
              </button>
            )}
          </div>

          {/* Error / Typo Suggestion */}
          {emailError && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="shrink-0" />
                <span>{emailError}</span>
              </div>
              {emailSuggestion && (
                <button
                  type="button"
                  onClick={applySuggestion}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shrink-0 cursor-pointer"
                >
                  Use {emailSuggestion}
                </button>
              )}
            </div>
          )}

          {/* Real Gmail OTP Verification Box (Never displays code on screen) */}
          {otpSent && !formData.emailVerified && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Mail Server Verified ({formData.emailMxHost})
                  </p>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    A 6-digit verification code has been dispatched to{" "}
                    <strong className="text-white font-mono">{formData.email}</strong>.
                    Please check your Gmail Inbox or Spam folder and enter the code below:
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 shrink-0 self-start">
                  <Mail size={14} className="text-cyan-400" />
                  Code Sent to Gmail
                </span>
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
                    placeholder="Enter 6-digit OTP code"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-11 pr-4 py-3 text-white font-mono text-lg tracking-widest outline-none focus:border-cyan-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleConfirmOtp}
                  disabled={enteredOtp.length < 6}
                  className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-400 disabled:opacity-40 text-slate-950 font-bold text-sm transition cursor-pointer shrink-0"
                >
                  Confirm Code
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                <span>Didn't receive the email? Check Spam or</span>
                <button
                  type="button"
                  disabled={resendCountdown > 0 || checkingEmail}
                  onClick={handleVerifyEmail}
                  className="text-cyan-400 hover:underline font-semibold disabled:opacity-40 disabled:no-underline cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw size={12} className={checkingEmail ? "animate-spin" : ""} />
                  {resendCountdown > 0
                    ? `Resend in ${resendCountdown}s`
                    : "Resend Code to Gmail"}
                </button>
              </div>
            </div>
          )}

          {formData.emailVerified && (
            <p className="text-xs text-green-400 flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={15} />
              Gmail verified successfully ({formData.emailMxHost}) & ownership confirmed.
            </p>
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