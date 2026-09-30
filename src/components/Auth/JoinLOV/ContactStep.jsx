import {
  Phone,
  Globe,
  MapPin,
  Home,
  Mailbox,
} from "lucide-react";

import countries from "../../../data/countries";

function ContactStep({
  formData,
  setFormData,
}) {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputStyle =
    "w-full rounded-2xl border border-slate-700 bg-slate-800 px-12 py-4 text-white outline-none transition focus:border-cyan-400";

  return (
    <div>

      <h2 className="text-3xl font-bold text-white">
        Contact Information
      </h2>

      <p className="mt-2 text-gray-400">
        Tell us where we can contact you.
      </p>

      <div className="mt-10 grid gap-6">

        {/* Phone */}

        <div className="relative">

          <Phone
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className={inputStyle}
          />

        </div>

        {/* Country */}

        <div className="relative">

          <Globe
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />

          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="">
              Select Country
            </option>

            {countries.map((country) => (
              <option
                key={country}
                value={country}
              >
                {country}
              </option>
            ))}

          </select>

        </div>

        {/* City */}

        <div className="relative">

          <MapPin
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className={inputStyle}
          />

        </div>

        {/* Address */}

        <div className="relative">

          <Home
            size={20}
            className="absolute left-4 top-5 text-cyan-400"
          />

          <textarea
            rows={4}
            name="address"
            placeholder="Full Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 py-4 pl-12 pr-4 text-white outline-none transition focus:border-cyan-400"
          />

        </div>

        {/* Postal Code */}

        <div className="relative">

          <Mailbox
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />

          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
            className={inputStyle}
          />

        </div>

      </div>

    </div>
  );
}

export default ContactStep;