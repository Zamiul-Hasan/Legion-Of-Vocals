import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return (
    typeof supabaseUrl === "string" &&
    supabaseUrl.length > 0 &&
    !supabaseUrl.includes("your-project") &&
    typeof supabaseAnonKey === "string" &&
    supabaseAnonKey.length > 0 &&
    !supabaseAnonKey.includes("your-anon-key")
  );
};

// If configured, create real Supabase client; otherwise create dummy client that avoids crashing
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : createClient(
      "https://placeholder-project.supabase.co",
      "placeholder-anon-key-0123456789"
    );

/**
 * Returns the appropriate production or deployment redirect URL.
 * Ensures email links never redirect to inaccessible localhost on mobile or external devices.
 */
export const getProductionAuthRedirectUrl = (path = "/dashboard") => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined" && window.location?.origin) {
    const origin = window.location.origin;
    // If not running on local loopback, use the current active origin (e.g. Vercel deployment)
    if (!origin.includes("localhost") && !origin.includes("127.0.0.1")) {
      return `${origin}${cleanPath}`;
    }
  }
  // Production fallback to ensure emails never redirect to inaccessible localhost
  return `https://legion-of-vocals.vercel.app${cleanPath}`;
};

