import { useState } from "react";

import ProgressBar from "./ProgressBar";
import RegisterForm from "./RegisterForm";
import { generateUniqueLovId } from "../../../utils/helpers";
import members from "../../../data/members";
import pendingUsers from "../../../data/pendingUsers";

function RegisterStepper() {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState(() => {
    const savedPending = JSON.parse(
      localStorage.getItem("pendingUsers") || "[]"
    );
    const existingIds = [
      ...members.map((m) => m.lovId),
      ...pendingUsers.map((p) => p.lovId),
      ...savedPending.map((p) => p.lovId),
    ].filter(Boolean);

    return {
      lovId: generateUniqueLovId(existingIds),

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
    };
  });

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