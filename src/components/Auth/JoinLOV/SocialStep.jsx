import {
  Share2,
  MessageCircle,
  Camera,
  Video,
  Globe,
} from "lucide-react";

function SocialStep({
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
        Social Profiles
      </h2>

      <p className="mt-2 text-gray-400">
        Share your social media and portfolio links.
      </p>

      <div className="mt-10 grid gap-6">
        {/* Facebook */}
        <div className="relative">
          <Share2
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />

          <input
            type="url"
            name="facebook"
            placeholder="Facebook Profile"
            value={formData.facebook}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* Discord */}
        <div className="relative">
          <MessageCircle
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />

          <input
            type="text"
            name="discord"
            placeholder="Discord Username"
            value={formData.discord}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* Instagram */}
        <div className="relative">
          <Camera
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />

          <input
            type="url"
            name="instagram"
            placeholder="Instagram Profile"
            value={formData.instagram}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* YouTube */}
        <div className="relative">
          <Video
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />

          <input
            type="url"
            name="youtube"
            placeholder="YouTube Channel"
            value={formData.youtube}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* TikTok */}
        <div className="relative">
          <MessageCircle
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />

          <input
            type="url"
            name="tiktok"
            placeholder="TikTok Profile"
            value={formData.tiktok}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* Portfolio */}
        <div className="relative">
          <Globe
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
          />

          <input
            type="url"
            name="portfolio"
            placeholder="Portfolio / Website"
            value={formData.portfolio}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>
      </div>
    </div>
  );
}

export default SocialStep;