import {
  User,
  Phone,
  Globe,
  Briefcase,
  FileText,
  CheckCircle,
} from "lucide-react";

function ReviewStep({ formData }) {
  return (
    <div>

      <h2 className="text-3xl font-bold text-white">
        Review Your Application
      </h2>

      <p className="mt-2 text-gray-400">
        Please review everything before submitting.
      </p>

      <div className="mt-10 space-y-6">

        {/* Basic */}

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-800 p-6">

          <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-cyan-400">
            <User size={20} />
            Basic Information
          </h3>

          <div className="space-y-2 text-gray-300">
            <p>
              <strong>Official Member ID:</strong>{" "}
              <span className="text-cyan-400 font-semibold italic">Assigned automatically upon successful submission</span>
            </p>
            <p><strong>Name:</strong> {formData.fullName}</p>
            <p><strong>Username:</strong> @{formData.username}</p>
            <p><strong>Email:</strong> {formData.email}</p>
          </div>

        </div>

        {/* Contact */}

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-800 p-6">

          <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-cyan-400">
            <Phone size={20} />
            Contact Information
          </h3>

          <div className="space-y-2 text-gray-300">
            <p><strong>Phone:</strong> {formData.phone}</p>
            <p><strong>Country:</strong> {formData.country}</p>
            <p><strong>City:</strong> {formData.city}</p>
            <p><strong>Address:</strong> {formData.address}</p>
            <p><strong>Postal Code:</strong> {formData.postalCode}</p>
          </div>

        </div>

        {/* Social */}

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-800 p-6">

          <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-cyan-400">
            <Globe size={20} />
            Social Profiles
          </h3>

          <div className="space-y-2 text-gray-300">
            <p><strong>Facebook:</strong> {formData.facebook}</p>
            <p><strong>Discord:</strong> {formData.discord}</p>
            <p><strong>Instagram:</strong> {formData.instagram}</p>
            <p><strong>YouTube:</strong> {formData.youtube}</p>
            <p><strong>TikTok:</strong> {formData.tiktok}</p>
            <p><strong>Portfolio:</strong> {formData.portfolio}</p>
          </div>

        </div>

        {/* Role */}

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-800 p-6">

          <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-cyan-400">
            <Briefcase size={20} />
            Role Details
          </h3>

          <div className="space-y-2 text-gray-300">
            <p><strong>Role:</strong> {formData.role}</p>
            <p><strong>Experience:</strong> {formData.experience}</p>
            <p><strong>Languages:</strong> {formData.languages}</p>
            <p><strong>Bio:</strong> {formData.bio}</p>
          </div>

        </div>

        {/* Files */}

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-800 p-6">

          <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-cyan-400">
            <FileText size={20} />
            Uploaded Files
          </h3>

          <div className="space-y-2 text-gray-300">

            <p>
              <strong>Profile Picture:</strong>{" "}
              {formData.profilePicture
                ? formData.profilePicture.name
                : "Not Uploaded"}
            </p>

            <p>
              <strong>Voice Sample:</strong>{" "}
              {formData.voiceSample
                ? formData.voiceSample.name
                : "Not Uploaded"}
            </p>

            <div>
              <strong>Documents:</strong>

              {formData.documents.length > 0 ? (
                <ul className="mt-2 ml-5 list-disc">
                  {formData.documents.map((doc, index) => (
                    <li key={index}>
                      {doc.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <span> Not Uploaded</span>
              )}
            </div>

          </div>

        </div>

        {/* Agreement */}

        <label className="flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-slate-800 p-5">

          <input
            type="checkbox"
            className="h-5 w-5 accent-cyan-500"
          />

          <span className="text-gray-300">
            I confirm that all information is correct and I agree to the
            Legion of Vocals Terms & Conditions.
          </span>

        </label>

        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-5">

          <div className="flex items-center gap-3">

            <CheckCircle className="text-green-400" />

            <div>

              <h4 className="font-semibold text-green-400">
                Ready to Submit
              </h4>

              <p className="text-sm text-gray-300">
                After submitting, your application will be reviewed by the LOV
                Administration.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ReviewStep;