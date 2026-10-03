// ==============================================================================
// VERCEL SERVERLESS FUNCTION: /api/verify-turnstile
// Server-side Cloudflare Turnstile token validation
// ==============================================================================

const TURNSTILE_SECRET_KEY =
  process.env.TURNSTILE_SECRET_KEY ||
  "0x4AAAAAAFM2APbQTGjNdmpg8zQV_KXJIWQ";

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, remoteIp } = req.body || {};

  if (!token) {
    return res.status(400).json({
      success: false,
      error: "MISSING_TOKEN",
      message: "Turnstile challenge token is required.",
    });
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", TURNSTILE_SECRET_KEY);
    formData.append("response", token);
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    );

    const outcome = await response.json();

    if (outcome.success) {
      return res.status(200).json({
        success: true,
        challenge_ts: outcome.challenge_ts,
        hostname: outcome.hostname,
      });
    } else {
      console.warn("[Turnstile] Validation failed:", outcome["error-codes"]);
      return res.status(400).json({
        success: false,
        error: "TURNSTILE_FAILED",
        errorCodes: outcome["error-codes"] || [],
        message: "Cloudflare Turnstile human verification failed. Please try again.",
      });
    }
  } catch (err) {
    console.error("[Turnstile] Internal error:", err);
    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: "An internal server error occurred while verifying challenge.",
    });
  }
}
