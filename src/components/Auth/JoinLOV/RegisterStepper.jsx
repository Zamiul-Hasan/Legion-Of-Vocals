import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import ProgressBar from "./ProgressBar";
import RegisterForm from "./RegisterForm";
import { authService } from "../../../services/authService";

function RegisterStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const [formData, setFormData] = useState({
    // LOV Member ID is assigned ONLY after successful submission
    lovId: "",

    /* ========================= */
    /* Basic Information */
    /* ========================= */
    fullName: "",
    username: "",
    email: "",
    emailVerified: false,
    emailMxHost: "",
    password: "",
    confirmPassword: "",

    /* ========================= */
    /* Contact */
    /* ========================= */
    phone: "",
    country: "",
    city: "",
    address: "",
    postalCode: "",

    /* ========================= */
    /* Social */
    /* ========================= */
    facebook: "",
    discord: "",
    instagram: "",
    youtube: "",
    tiktok: "",
    portfolio: "",

    /* ========================= */
    /* Role */
    /* ========================= */
    role: "",
    experience: "",
    languages: "",
    bio: "",

    /* ========================= */
    /* Upload */
    /* ========================= */
    profilePicture: null,
    voiceSample: null,
    documents: [],
  });

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setGoogleError("");
      const { error } = await authService.signInWithGoogle();
      if (error) {
        setGoogleError(error.message || "Failed to initialize Google login.");
      }
    } catch (err) {
      setGoogleError(
        err.message || "An unexpected error occurred during Google sign in."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1-Click Continue with Google Option */}
      {currentStep === 1 && (
        <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/90 p-6 md:p-8 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
                Fast Onboarding
              </div>
              <h3 className="text-xl font-bold text-white">
                Continue with Google
              </h3>
              <p className="text-sm text-gray-400 mt-1 max-w-lg">
                Sign in instantly using your Google account without manual verification.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 disabled:opacity-60 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 transition shadow-lg shadow-white/10 shrink-0 cursor-pointer"
            >
              {googleLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin text-slate-900" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {googleError && (
            <div className="mt-4 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{googleError}</span>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
              Or Register Step-by-Step with Email
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>
        </div>
      )}

      <ProgressBar currentStep={currentStep} />

      <RegisterForm
        currentStep={currentStep}
        formData={formData}
        setFormData={setFormData}
        nextStep={nextStep}
        previousStep={previousStep}
      />
    </div>
  );
}

export default RegisterStepper;