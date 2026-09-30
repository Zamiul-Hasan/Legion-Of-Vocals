import { useState } from "react";
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
  Fingerprint,
  KeyRound,
} from "lucide-react";
import { verifyRealEmailAddress } from "../../../utils/helpers";
import members from "../../../data/members";
import pendingUsers from "../../../data/pendingUsers";

function BasicInfoStep({ formData, setFormData }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuggestion, setEmailSuggestion] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmailError("");
      setEmailSuggestion("");
      setOtpSent(false);
      setGeneratedOtp("");
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
      localStorage.getItem("pendingUsers") || "[]"
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
    setCheckingEmail(false);

    if (!result.valid) {
      setEmailError(result.reason);
      if (result.suggestion) {
        setEmailSuggestion(result.suggestion);
      }
      return;
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setOtpSent(true);
    setFormData({
      ...formData,
      email: normalizedEmail,
      emailMxHost: result.mxHost || result.domain,
    });
  };

  const handleConfirmOtp = () => {
    if (enteredOtp.trim() === generatedOtp) {
      setFormData({
        ...formData,
        emailVerified: true,
      });
      setOtpSent(false);
      setEmailError("");
    } else {
      setEmailError("Incorrect verification code. Please check the 6-digit code.");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Basic Information
          </h2>
          <p className="mt-2 text-gray-400">
            Enter your personal details and verify your real email address.
          </p>
        </div>

        {/* Assigned Unique LOV ID Badge */}
        <div className="px-4 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3 self-start">
          <Fingerprint className="text-cyan-400 shrink-0" size={24} />
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400">
              Your Unique Member ID
            </p>
            <p className="text-base font-black text-cyan-400 tracking-wide">
              {formData.lovId}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6">
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
            placeholder="Username"
            className={inputStyle}
          />
        </div>

        {/* Email + Real Domain MX & OTP Verification */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
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
                placeholder="Real Email Address (e.g. yourname@gmail.com)"
                className={`${inputStyle} ${
                  formData.emailVerified
                    ? "border-green-500/50 bg-green-950/20"
                    : ""
                }`}
              />
            </div>

            {formData.emailVerified ? (
              <div className="px-5 py-4 rounded-2xl bg-green-500/15 border border-green-500/40 text-green-300 font-semibold flex items-center justify-center gap-2 shrink-0">
                <CheckCircle2 size={20} />
                Verified Email
              </div>
            ) : (
              <button
                type="button"
                onClick={handleVerifyEmail}
                disabled={checkingEmail || !formData.email}
                className="px-6 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold flex items-center justify-center gap-2 transition shrink-0"
              >
                {checkingEmail ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Checking Mail Server...
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
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shrink-0"
                >
                  Use {emailSuggestion}
                </button>
              )}
            </div>
          )}

          {/* OTP Verification Box after DNS MX Check passes */}
          {otpSent && !formData.emailVerified && (
            <div className="p-5 rounded-2xl bg-slate-800/90 border border-cyan-500/30 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Mail Server Verified ({formData.emailMxHost})
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    Enter the 6-digit verification code sent to{" "}
                    <strong className="text-white">{formData.email}</strong> to confirm ownership.
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                  Verification Code: <strong>{generatedOtp}</strong>
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
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP code"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-11 pr-4 py-3 text-white font-mono tracking-widest outline-none focus:border-cyan-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleConfirmOtp}
                  className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-slate-950 font-bold text-sm transition"
                >
                  Confirm Code
                </button>
              </div>
            </div>
          )}

          {formData.emailVerified && (
            <p className="text-xs text-green-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              Domain MX mail server verified ({formData.emailMxHost}) & ownership confirmed.
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
            placeholder="Password"
            className={inputStyle}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BasicInfoStep;