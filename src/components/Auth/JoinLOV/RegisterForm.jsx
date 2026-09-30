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
import initialPendingUsers from "../../../data/pendingUsers";

function RegisterForm({
  currentStep,
  formData,
  setFormData,
  nextStep,
  previousStep,
}) {
  const [successOpen, setSuccessOpen] = useState(false);
  const [stepError, setStepError] = useState("");

  const handleNextStep = () => {
    setStepError("");

    if (currentStep === 1) {
      if (!formData.fullName.trim() || !formData.username.trim()) {
        setStepError("Please enter your Full Name and Username.");
        return;
      }
      if (!formData.emailVerified) {
        setStepError(
          "Please verify your email address using the 'Verify Real Email' button before continuing."
        );
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
    const newPendingUser = {
      id: Date.now(),
      lovId: formData.lovId,

      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      emailVerified: Boolean(formData.emailVerified),

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

    const saved = localStorage.getItem("pendingUsers");
    const existing = saved ? JSON.parse(saved) : initialPendingUsers;

    localStorage.setItem(
      "pendingUsers",
      JSON.stringify([newPendingUser, ...existing])
    );

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
        lovId={formData.lovId}
        email={formData.email}
        onClose={() => setSuccessOpen(false)}
      />
    </>
  );
}

export default RegisterForm;