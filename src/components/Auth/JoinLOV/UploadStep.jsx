import { Upload, Image, Mic, FileText } from "lucide-react";

function UploadStep({
  formData,
  setFormData,
}) {
  const handleFile = (e) => {
    const { name, files } = e.target;

    if (!files.length) return;

    if (name === "documents") {
      setFormData({
        ...formData,
        documents: [...files],
      });
    } else {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    }
  };

  const cardStyle =
    "rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800 p-8 transition hover:border-cyan-400";

  return (
    <div>

      <h2 className="text-3xl font-bold text-white">
        Upload Files
      </h2>

      <p className="mt-2 text-gray-400">
        Upload your profile picture, voice sample and supporting documents.
      </p>

      <div className="mt-10 grid gap-6">

        {/* Profile Picture */}

        <label className={cardStyle}>

          <div className="flex flex-col items-center gap-3">

            <Image
              size={40}
              className="text-cyan-400"
            />

            <h3 className="text-white font-semibold">
              Profile Picture
            </h3>

            <p className="text-sm text-gray-400">
              JPG / PNG
            </p>

            <Upload className="text-cyan-400" />

          </div>

          <input
            hidden
            type="file"
            accept="image/*"
            name="profilePicture"
            onChange={handleFile}
          />

        </label>

        {formData.profilePicture && (
          <p className="text-green-400">
            ✓ {formData.profilePicture.name}
          </p>
        )}

        {/* Voice Sample */}

        <label className={cardStyle}>

          <div className="flex flex-col items-center gap-3">

            <Mic
              size={40}
              className="text-cyan-400"
            />

            <h3 className="text-white font-semibold">
              Voice Sample
            </h3>

            <p className="text-sm text-gray-400">
              MP3 / WAV
            </p>

            <Upload className="text-cyan-400" />

          </div>

          <input
            hidden
            type="file"
            accept=".mp3,.wav"
            name="voiceSample"
            onChange={handleFile}
          />

        </label>

        {formData.voiceSample && (
          <p className="text-green-400">
            ✓ {formData.voiceSample.name}
          </p>
        )}

        {/* Documents */}

        <label className={cardStyle}>

          <div className="flex flex-col items-center gap-3">

            <FileText
              size={40}
              className="text-cyan-400"
            />

            <h3 className="text-white font-semibold">
              Supporting Documents
            </h3>

            <p className="text-sm text-gray-400">
              PDF / JPG / PNG
            </p>

            <Upload className="text-cyan-400" />

          </div>

          <input
            hidden
            multiple
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            name="documents"
            onChange={handleFile}
          />

        </label>

        {formData.documents.length > 0 && (
          <div className="rounded-xl bg-slate-800 p-4">

            <h4 className="mb-3 font-semibold text-white">
              Uploaded Documents
            </h4>

            <div className="space-y-2">

              {formData.documents.map((doc, index) => (
                <p
                  key={index}
                  className="text-green-400"
                >
                  ✓ {doc.name}
                </p>
              ))}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default UploadStep;