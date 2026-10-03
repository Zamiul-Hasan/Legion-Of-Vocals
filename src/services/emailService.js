// ==============================================================================
// LEGION OF VOCALS — EMAIL VERIFICATION SERVICE
// Dual dispatch: Vercel Resend /api/send-otp & Supabase Auth OTP
// ==============================================================================

import { supabase, isSupabaseConfigured, getProductionAuthRedirectUrl } from "../lib/supabase";

const OTP_STORAGE_PREFIX = "lov_email_otp_";
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

export const emailService = {
  /**
   * Dispatches a 6-digit OTP to the recipient's Gmail inbox.
   * Prioritizes Vercel /api/send-otp (Resend, 100% inbox delivery)
   * Falls back to Supabase built-in Auth OTP with production redirect URL.
   */
  async sendVerificationOtp(email, options = {}) {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, reason: "Please provide a valid Gmail address." };
    }

    const redirectPath =
      typeof options === "string"
        ? options
        : options?.redirectTo || "/join?verified=true";
    const targetRedirectUrl = getProductionAuthRedirectUrl(redirectPath);

    // 1. First try Vercel /api/send-otp (powered by Resend API if RESEND_API_KEY configured)
    const localOtp = String(Math.floor(100000 + Math.random() * 900000));
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          otp: localOtp,
          appName: "Legion of Vocals",
        }),
      });

      if (response.ok) {
        const resData = await response.json().catch(() => ({}));
        if (resData.success) {
          sessionStorage.setItem(`lov_otp_provider_${cleanEmail}`, "resend");
          sessionStorage.setItem(
            `${OTP_STORAGE_PREFIX}${cleanEmail}`,
            JSON.stringify({
              code: localOtp,
              email: cleanEmail,
              createdAt: Date.now(),
              expiresAt: Date.now() + OTP_EXPIRY_MS,
            })
          );
          return {
            success: true,
            provider: "resend",
            message: `Verification code sent to ${cleanEmail}. Check your inbox!`,
          };
        }
      }
    } catch {
      // API call failed or running in local environment without API endpoint
    }

    // 2. Fall back to Supabase built-in OTP
    if (isSupabaseConfigured()) {
      try {
        const { error: sbError } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: targetRedirectUrl,
          },
        });

        if (!sbError) {
          sessionStorage.setItem(`lov_otp_provider_${cleanEmail}`, "supabase");
          return {
            success: true,
            provider: "supabase",
            message: `Verification code dispatched to ${cleanEmail}. Enter the 6-digit code or click the confirmation link in your Gmail. (Check Inbox and Spam).`,
          };
        } else {
          console.warn("[LOV Auth] Supabase OTP error:", sbError.message);
          return {
            success: false,
            reason: `Supabase Mailer Error: ${sbError.message}. (Free Supabase projects have a 3 email/hr limit. Please check your Spam folder or configure RESEND_API_KEY on Vercel).`,
          };
        }
      } catch (err) {
        console.warn("[LOV Auth] Supabase OTP exception:", err);
      }
    }

    return {
      success: false,
      reason:
        "Unable to dispatch email. Please ensure your Supabase email settings or Vercel RESEND_API_KEY is configured.",
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
        let { data, error } = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanCode,
          type: "email",
        });

        // Fallback to "signup" or "magiclink" if "email" type didn't match the token type
        if (error) {
          const fallbackSignup = await supabase.auth.verifyOtp({
            email: cleanEmail,
            token: cleanCode,
            type: "signup",
          });
          if (!fallbackSignup.error && fallbackSignup.data?.user) {
            data = fallbackSignup.data;
            error = null;
          } else {
            const fallbackMagic = await supabase.auth.verifyOtp({
              email: cleanEmail,
              token: cleanCode,
              type: "magiclink",
            });
            if (!fallbackMagic.error && fallbackMagic.data?.user) {
              data = fallbackMagic.data;
              error = null;
            }
          }
        }

        if (!error && data?.user) {
          sessionStorage.removeItem(`lov_otp_provider_${cleanEmail}`);
          return { success: true };
        } else if (error) {
          // If Supabase returned invalid token, still try local check in case it was a session code
          console.warn("[LOV Auth] Supabase verifyOtp error:", error.message);
        }
      } catch (e) {
        console.warn("[LOV Auth] Supabase verifyOtp exception:", e);
      }
    }

    // Check local session storage (Resend / Session code)
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
      reason: "Incorrect verification code. Please check your Gmail and enter the 6-digit code, or click the confirmation link in the email.",
    };
  },
};

export default emailService;

