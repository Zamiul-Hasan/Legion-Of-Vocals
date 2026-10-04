import { useState } from "react";
import { AlertCircle } from "lucide-react";

import Button from "../../UI/Button";

import BasicInfoStep from "./BasicInfoStep";
import ContactStep from "./ContactStep";
import SocialStep from "./SocialStep";
import RoleStep from "./RoleStep";
import UploadStep from "./UploadStep";
import ReviewStep from "./ReviewStep";
import SuccessModal from "./SuccessModal";
import members from "../../../data/members";
import { generateUniqueLovId } from "../../../utils/helpers";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";
import { authService } from "../../../services/authService";

function RegisterForm({
  currentStep,
  formData,
  setFormData,
  nextStep,
  previousStep,
}) {
  const [successOpen, setSuccessOpen] = useState(false);
  const [finalLovId, setFinalLovId] = useState("");
  const [stepError, setStepError] = useState("");

  const handleNextStep = () => {
    setStepError("");

    if (currentStep === 1) {
      if (!formData.fullName.trim() || !formData.username.trim()) {
        setStepError("Please enter your Full Name and Username.");
        return;
      }
      if (!formData.email || !formData.email.trim().endsWith("@gmail.com")) {
        setStepError("Please enter a valid Google Gmail address (e.g. name@gmail.com).");
        return;
      }
      if (!formData.emailVerified) {
        setStepError("Please verify your Gmail address with the 6-digit OTP code before proceeding.");
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        setStepError("Password must be at least 6 characters long.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setStepError("Passwords do not match.");
        return;
      }
    }

    nextStep();
  };

  const handleSubmit = () => {
    if (!formData.emailVerified) {
      setStepError("Registration cannot be submitted without a verified Gmail address.");
      return;
    }

    // Generate official unique LOV ID only upon successful submission
    let existing = [];
    try {
      const saved = localStorage.getItem("lov_pending_users_v2");
      existing = saved ? JSON.parse(saved) : [];
    } catch {
      existing = [];
    }
    const existingIds = [
      ...members.map((m) => m.lovId),
      ...existing.map((p) => p.lovId),
    ].filter(Boolean);
    const assignedLovId = generateUniqueLovId(existingIds);

    const newPendingUser = {
      id: Date.now(),
      lovId: assignedLovId,

      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      emailVerified: Boolean(formData.emailVerified),
      password: formData.password,

      phone: formData.phone,
      country: formData.country,
      city: formData.city,

      facebook: formData.facebook,
      discord: formData.discord,
      instagram: formData.instagram,
      youtube: formData.youtube,
      tiktok: formData.tiktok,
      portfolio: formData.portfolio,

      appliedRole: formData.role || "Voice Actor",
      role: formData.role || "Voice Actor",
      experience: formData.experience,
      languages: formData.languages,
      bio: formData.bio,

      avatar: "https://i.pravatar.cc/300?img=33",
      profilePicture: formData.profilePicture,
      voiceSample:
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      documents: formData.documents,

      joinedAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),

      status: "Pending",
    };

    localStorage.setItem(
      "lov_pending_users_v2",
      JSON.stringify([newPendingUser, ...existing])
    );
    localStorage.removeItem("lov_join_form_draft");

    // Sync real application to Supabase Cloud Database & Auth
    if (isSupabaseConfigured()) {
      try {
        authService
          .signUp({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            displayName: formData.fullName,
            role: "Pending",
            department: formData.role || "Voice Acting",
          })
          .catch((e) => console.warn("[LOV] Supabase signUp background notice:", e));

        supabase
          .from("profiles")
          .upsert(
            {
              lov_id: assignedLovId,
              email: formData.email,
              full_name: formData.fullName,
              display_name: formData.fullName,
              username: formData.username,
              role: "Pending",
              department: formData.role || "Voice Acting",
              bio: formData.bio || "",
              is_approved: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "lov_id" }
          )
          .then(() => {
            window.dispatchEvent(new Event("lov-pending-updated"));
          })
          .catch((e) => console.warn("[LOV] Supabase profiles pending upsert notice:", e));
      } catch (err) {
        console.warn("[LOV] Supabase applicant sync notice:", err);
      }
    }

    window.dispatchEvent(new Event("lov-pending-updated"));

    setFinalLovId(assignedLovId);
    setSuccessOpen(true);
  };

  return (
    <>
      <div className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-8">
        {stepError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <span>{stepError}</span>
          </div>
        )}

        {currentStep === 1 && (
          <BasicInfoStep
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {currentStep === 2 && (
          <ContactStep
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {currentStep === 3 && (
          <SocialStep
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {currentStep === 4 && (
          <RoleStep
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {currentStep === 5 && (
          <UploadStep
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {currentStep === 6 && (
          <ReviewStep
            formData={formData}
          />
        )}

        <div className="mt-10 flex justify-between">
          {currentStep > 1 ? (
            <Button
              variant="secondary"
              onClick={() => {
                setStepError("");
                previousStep();
              }}
            >
              Previous
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 6 ? (
            <Button onClick={handleNextStep}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Submit Application
            </Button>
          )}
        </div>
      </div>

      <SuccessModal
        open={successOpen}
        lovId={finalLovId}
        email={formData.email}
        onClose={() => setSuccessOpen(false)}
      />
    </>
  );
}

export default RegisterForm;