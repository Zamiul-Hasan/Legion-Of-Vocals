import { motion } from "framer-motion";

function Input({
  label,
  icon: Icon,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">

      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}

      <div className="relative">

        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400">
            <Icon size={18} />
          </div>
        )}

        <motion.input
          whileFocus={{
            scale: 1.01,
          }}
          transition={{
            duration: 0.2,
          }}
          className={`
            w-full
            rounded-xl
            border
            border-cyan-500/20
            bg-slate-900
            px-4
            py-3
            ${Icon ? "pl-12" : ""}
            text-white
            placeholder:text-gray-500
            outline-none
            transition-all
            focus:border-cyan-400
            focus:ring-2
            focus:ring-cyan-500/20
            ${className}
          `}
          {...props}
        />

      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}

    </div>
  );
}

export default Input;