import { useState } from "react";
import { User, AtSign, Mail, Lock, Eye, EyeOff } from "lucide-react";

function BasicInfoStep({ formData, setFormData }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const inputStyle =
    "w-full rounded-2xl border border-slate-700 bg-slate-800 px-12 py-4 text-white outline-none transition focus:border-cyan-400";

  return (
    <div>
      <div>
        <h2 className="text-3xl font-bold text-white">Basic Information</h2>
        <p className="mt-2 text-gray-400">
          Enter your personal details to begin your Legion of Vocals application.
        </p>
      </div>

      <div className="mt-8 grid gap-6">
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
            placeholder="Full Name (e.g. Zamiul Hasan)"
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
            placeholder="Username (e.g. zamiul)"
            className={inputStyle}
          />
        </div>

        {/* Email Address */}
        <div className="relative">
          <Mail
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address (e.g. yourname@gmail.com)"
            className={inputStyle}
          />
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
            placeholder="Password (minimum 6 characters)"
            className={inputStyle}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BasicInfoStep;