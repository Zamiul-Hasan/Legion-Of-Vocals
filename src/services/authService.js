import { supabase, isSupabaseConfigured, getProductionAuthRedirectUrl } from "../lib/supabase";

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

  // Sign in with Google OAuth
  async signInWithGoogle() {
    if (!isSupabaseConfigured()) {
      return {
        data: null,
        error: { message: "Supabase is not configured." },
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
        // Probe the OAuth URL to check if Google provider is enabled in Supabase
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
                  "Google Provider is currently disabled in your Supabase project. To enable it, visit Supabase Dashboard > Authentication > Providers > Google and switch it ON.",
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

        // Provider is enabled and validated, navigate smoothly
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

  // Sign out
  async signOut() {
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
