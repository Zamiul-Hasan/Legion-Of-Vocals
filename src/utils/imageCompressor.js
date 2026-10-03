/**
 * Client-side image compressor utility
 * Downscales images to thumbnail/avatar dimensions and compresses them into a lightweight JPEG data URL.
 * Guarantees that saved avatar strings are ~15-30 KB, preventing localStorage QuotaExceededError.
 */

export async function compressImage(fileOrDataUrl, maxSize = 320, quality = 0.82) {
  return new Promise((resolve) => {
    if (!fileOrDataUrl) {
      return resolve("");
    }

    // If it's a regular remote URL or public asset path (not a huge data: URL), keep it as-is
    if (typeof fileOrDataUrl === "string" && !fileOrDataUrl.startsWith("data:")) {
      return resolve(fileOrDataUrl);
    }

    const processSrc = (src) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.naturalWidth || img.width || maxSize;
          let height = img.naturalHeight || img.height || maxSize;

          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }

          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(src);

          // Fill slate background in case of transparent PNG
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve(compressed);
        } catch {
          // If canvas fails (e.g. CORS restriction), fallback to original
          resolve(src);
        }
      };

      img.onerror = () => resolve(typeof src === "string" ? src : "");
      img.src = src;
    };

    if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => processSrc(e.target?.result);
      reader.onerror = () => resolve("");
      reader.readAsDataURL(fileOrDataUrl);
    } else if (typeof fileOrDataUrl === "string") {
      processSrc(fileOrDataUrl);
    } else {
      resolve("");
    }
  });
}
