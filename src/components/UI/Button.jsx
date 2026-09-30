import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",

  onClick,

  leftIcon,
  rightIcon,

  loading = false,
  disabled = false,

  fullWidth = false,
}) {
  const variants = {
    primary:
      "bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20",

    secondary:
      "bg-slate-800 hover:bg-slate-700 text-white border border-cyan-500/20",

    outline:
      "border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black",

    danger:
      "bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20",

    ghost:
      "bg-transparent hover:bg-slate-800 text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",

    md: "px-6 py-3 text-base",

    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{
        scale: disabled ? 1 : 1.05,
        y: disabled ? 0 : -2,
      }}
      whileTap={{
        scale: disabled ? 1 : 0.95,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2

        rounded-xl
        font-semibold

        transition-all
        duration-300

        disabled:opacity-60
        disabled:cursor-not-allowed

        ${variants[variant]}
        ${sizes[size]}

        ${fullWidth ? "w-full" : ""}

        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading...
        </>
      ) : (
        <>
          {leftIcon}

          {children}

          {rightIcon}
        </>
      )}
    </motion.button>
  );
}

export default Button;