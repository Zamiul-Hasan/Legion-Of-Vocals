import { supabase, isSupabaseConfigured } from "../lib/supabase";

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
        emailRedirectTo: `${window.location.origin}/dashboard`,
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
