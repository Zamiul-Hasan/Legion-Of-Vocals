import { supabase, isSupabaseConfigured, getProductionAuthRedirectUrl } from "../lib/supabase";
import { auth, googleProvider, isFirebaseConfigured } from "../lib/firebase";
import { signInWithPopup, signOut as fbSignOut } from "firebase/auth";

export const authService = {
  // Sign up with True Email Verification
  async signUp({ email, password, fullName, displayName, role = "Member", department = "Voice Acting" }) {
    if (!isSupabaseConfigured()) {
      return {
        user: { email, fullName, displayName, role, department, lovId: "LOV-2026-DEMO" },
        session: null,
        error: null,
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          display_name: displayName,
          role,
          department,
        },
        emailRedirectTo: getProductionAuthRedirectUrl("/dashboard"),
      },
    });

    return { user: data?.user, session: data?.session, error };
  },

  // Sign in with email and password
  async signIn({ email, password }) {
    if (!isSupabaseConfigured()) {
      return { user: { email }, session: null, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { user: data?.user, session: data?.session, error };
  },

  // Sign in with Google (Prioritizes Firebase Popup for instant, seamless login)
  async signInWithGoogle() {
    // 1. Try Firebase Google Popup (zero localhost redirect issues, instantaneous)
    if (isFirebaseConfigured()) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        return {
          user: {
            id: fbUser.uid,
            email: fbUser.email,
            fullName: fbUser.displayName || fbUser.email.split("@")[0],
            displayName: fbUser.displayName || fbUser.email.split("@")[0],
            avatar: fbUser.photoURL,
            emailVerified: fbUser.emailVerified,
          },
          session: { accessToken: await fbUser.getIdToken() },
          error: null,
        };
      } catch (err) {
        if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
          return { data: null, error: { message: "Google Sign-in popup was closed." } };
        }
        if (err.code === "auth/unauthorized-domain") {
          return {
            data: null,
            error: {
              message:
                "Firebase Notice: Domain 'legion-of-vocals.vercel.app' is not yet in Authorized domains. Please add it in Firebase Console > Authentication > Settings > Authorized domains.",
              code: "UNAUTHORIZED_DOMAIN",
            },
          };
        }
        return {
          data: null,
          error: {
            message: err.message || "Failed to sign in with Google via Firebase.",
          },
        };
      }
    }

    // 2. Fallback to Supabase OAuth
    if (!isSupabaseConfigured()) {
      return {
        data: null,
        error: { message: "Authentication provider is not configured." },
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getProductionAuthRedirectUrl("/dashboard"),
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        return { data: null, error };
      }

      if (data?.url) {
        const probe = await fetch(data.url);
        if (!probe.ok) {
          const body = await probe.json().catch(() => ({}));
          if (
            body.msg?.includes("not enabled") ||
            body.error_code === "validation_failed"
          ) {
            return {
              data: null,
              error: {
                message:
                  "Google Provider is disabled in Supabase. Please use Firebase login.",
                code: "PROVIDER_DISABLED",
              },
            };
          }
          return {
            data: null,
            error: {
              message:
                body.msg || `Google login failed with HTTP ${probe.status}`,
            },
          };
        }

        window.location.href = data.url;
        return { data, error: null };
      }

      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: { message: err.message || "Failed to initiate Google sign in." },
      };
    }
  },

  // Sign out (both Firebase and Supabase)
  async signOut() {
    try {
      if (isFirebaseConfigured()) {
        await fbSignOut(auth);
      }
    } catch (err) {
      console.warn("Firebase signout notice:", err);
    }
    if (!isSupabaseConfigured()) return { error: null };
    return await supabase.auth.signOut();
  },

  // Get active session
  async getSession() {
    if (!isSupabaseConfigured()) return null;
    const { data } = await supabase.auth.getSession();
    return data?.session;
  },

  // Get current user profile
  async getCurrentUserProfile() {
    if (!isSupabaseConfigured()) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return profile;
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    if (!isSupabaseConfigured()) return () => {};
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return () => subscription.unsubscribe();
  },
};
