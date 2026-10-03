import { useState } from "react";

import ProgressBar from "./ProgressBar";
import RegisterForm from "./RegisterForm";

function RegisterStepper() {
  const [currentStep, setCurrentStep] = useState(1);

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