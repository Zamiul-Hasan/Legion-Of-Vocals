import { useState, useEffect } from "react";

import ProgressBar from "./ProgressBar";
import RegisterForm from "./RegisterForm";

const DRAFT_STORAGE_KEY = "lov_join_form_draft";

const defaultFormData = {
  // LOV Member ID is assigned ONLY after successful submission
  lovId: "",

  /* ========================= */
  /* Basic Information */
  /* ========================= */
  fullName: "",
  username: "",
  email: "",
  emailVerified: false,
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

function RegisterStepper() {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        return {
          ...defaultFormData,
          ...parsed,
          profilePicture: null,
          voiceSample: null,
          documents: [],
        };
      }
    } catch {
      // ignore
    }
    return defaultFormData;
  });

  // Preserve form data across tabs/refreshes while filling out
  useEffect(() => {
    try {
      const { profilePicture, voiceSample, documents, ...persistable } = formData;
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(persistable));
    } catch {
      // ignore
    }
  }, [formData]);

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