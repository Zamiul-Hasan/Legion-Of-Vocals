// ==============================================================================
// LEGION OF VOCALS — EMAIL VERIFICATION SERVICE
// Dual dispatch: Supabase built-in Auth OTP & Vercel Resend fallback
// ==============================================================================

import { supabase, isSupabaseConfigured } from "../lib/supabase";

const OTP_STORAGE_PREFIX = "lov_email_otp_";
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

export const emailService = {
  /**
   * Dispatches a 6-digit OTP to the recipient's Gmail inbox.
   * Tries Supabase built-in transactional email first, falls back to Vercel /api/send-otp.
   */
  async sendVerificationOtp(email) {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, reason: "Please provide a valid email address." };
    }

    // 1. Try Supabase Auth built-in OTP email dispatch
    if (isSupabaseConfigured()) {
      try {
        const { error: sbError } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
        });

        if (!sbError) {
          sessionStorage.setItem(`lov_otp_provider_${cleanEmail}`, "supabase");
          return {
            success: true,
            provider: "supabase",
            message: `Verification code sent to ${cleanEmail} via Supabase Mail.`,
          };
        } else {
          console.warn("[LOV Auth] Supabase OTP dispatch issue:", sbError.message);
        }
      } catch (err) {
        console.warn("[LOV Auth] Supabase OTP error:", err);
      }
    }

    // 2. Generate local 6-digit code and dispatch via Vercel /api/send-otp (Resend)
    const code = String(Math.floor(100000 + Math.random() * 900000));
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          otp: code,
          appName: "Legion of Vocals",
        }),
      });

      const resData = await response.json().catch(() => ({}));
      if (response.ok && resData.success) {
        sessionStorage.setItem(`lov_otp_provider_${cleanEmail}`, "session");
        sessionStorage.setItem(
          `${OTP_STORAGE_PREFIX}${cleanEmail}`,
          JSON.stringify({
            code,
            email: cleanEmail,
            createdAt: Date.now(),
            expiresAt: Date.now() + OTP_EXPIRY_MS,
          })
        );
        return {
          success: true,
          provider: "resend",
          message: `Verification code sent to ${cleanEmail} via Resend.`,
        };
      }
    } catch {
      // API call failed
    }

    // 3. If neither email provider is operational:
    return {
      success: false,
      reason:
        "Email dispatch is not configured yet. To receive OTP in Gmail, run the SQL fix in your Supabase SQL Editor (to use Supabase's free built-in mailer) or add RESEND_API_KEY to Vercel.",
    };
  },

  /**
   * Verifies the OTP entered by the user.
   */
  async verifyOtp(email, enteredCode) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanCode = (enteredCode || "").trim();

    if (!cleanCode || cleanCode.length < 6) {
      return {
        success: false,
        reason: "Please enter the full 6-digit verification code from your Gmail.",
      };
    }

    const provider = sessionStorage.getItem(`lov_otp_provider_${cleanEmail}`);

    // If sent via Supabase OTP:
    if (provider === "supabase" && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanCode,
          type: "email",
        });

        if (!error && data?.user) {
          sessionStorage.removeItem(`lov_otp_provider_${cleanEmail}`);
          return { success: true };
        }
      } catch {
        // Fall back to local check if Supabase verify had an error
      }
    }

    // Check local session storage fallback
    try {
      const raw = sessionStorage.getItem(`${OTP_STORAGE_PREFIX}${cleanEmail}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Date.now() > parsed.expiresAt) {
          sessionStorage.removeItem(`${OTP_STORAGE_PREFIX}${cleanEmail}`);
          return {
            success: false,
            reason: "The verification code has expired. Please request a new code.",
          };
        }

        if (parsed.code === cleanCode) {
          sessionStorage.removeItem(`${OTP_STORAGE_PREFIX}${cleanEmail}`);
          sessionStorage.removeItem(`lov_otp_provider_${cleanEmail}`);
          return { success: true };
        }
      }
    } catch {
      // storage read error
    }

    return {
      success: false,
      reason: "Incorrect verification code. Please check your Gmail and enter the 6-digit code.",
    };
  },
};

export default emailService;
