import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  "Basic",
  "Contact",
  "Social",
  "Role",
  "Upload",
  "Review",
];

function ProgressBar({ currentStep }) {
  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-8">

      <div className="flex items-center justify-between">

        {steps.map((step, index) => {
          const stepNumber = index + 1;

          const completed =
            currentStep > stepNumber;

          const active =
            currentStep === stepNumber;

          return (
            <div
              key={step}
              className="relative flex flex-1 flex-col items-center"
            >
              {/* Line */}

              {index !== steps.length - 1 && (
                <div className="absolute left-1/2 top-5 h-1 w-full">

                  <div className="h-full bg-slate-700 rounded-full" />

                  <motion.div
                    initial={false}
                    animate={{
                      width:
                        currentStep > stepNumber
                          ? "100%"
                          : "0%",
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                    className="absolute left-0 top-0 h-full rounded-full bg-cyan-400"
                  />

                </div>
              )}

              {/* Circle */}

              <motion.div
                animate={{
                  scale: active ? 1.12 : 1,
                }}
                transition={{
                  duration: 0.2,
                }}
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition

                ${
                  completed
                    ? "border-cyan-400 bg-cyan-400 text-slate-900"
                    : active
                    ? "border-cyan-400 bg-slate-900 text-cyan-400 shadow-lg shadow-cyan-500/30"
                    : "border-slate-600 bg-slate-800 text-gray-400"
                }`}
              >
                {completed ? (
                  <Check size={18} />
                ) : (
                  stepNumber
                )}
              </motion.div>

              {/* Text */}

              <span
                className={`mt-3 text-sm font-medium

                ${
                  active
                    ? "text-cyan-400"
                    : completed
                    ? "text-white"
                    : "text-gray-500"
                }`}
              >
                {step}
              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default ProgressBar;