import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { isSupabaseConfigured } from "../lib/supabase";

const AUTH_STORAGE_KEY = "lov_current_user_v2";
const AUTH_EVENT = "lov-auth-updated";

const defaultUser = {
  id: 1,
  lovId: "LOV-2026-0001",
  name: "Zamiul Hasan",
  username: "zamiul",
  email: "zamiul.hasan@gmail.com",
  role: "founder",
  roleLabel: "Founder & Studio Lead",
};

export function loadCurrentUser() {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.role) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return defaultUser;
}

export function saveCurrentUser(userData) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function useAuth() {
  const [user, setUser] = useState(() => loadCurrentUser());

  useEffect(() => {
    // Listen for live Supabase auth session changes (e.g. Google Login redirect)
    if (isSupabaseConfigured()) {
      authService.getSession().then((session) => {
        if (session?.user) {
          const su = session.user;
          const googleUser = {
            id: su.id,
            lovId: su.user_metadata?.lov_id || `LOV-${su.id.slice(0, 6).toUpperCase()}`,
            name: su.user_metadata?.full_name || su.email.split("@")[0],
            username: su.user_metadata?.user_name || su.email.split("@")[0],
            email: su.email,
            avatar: su.user_metadata?.avatar_url,
            role: su.user_metadata?.role || "member",
            roleLabel: "Studio Member",
          };
          setUser(googleUser);
          saveCurrentUser(googleUser);
        }
      });

      const unsubscribe = authService.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const su = session.user;
          const googleUser = {
            id: su.id,
            lovId: su.user_metadata?.lov_id || `LOV-${su.id.slice(0, 6).toUpperCase()}`,
            name: su.user_metadata?.full_name || su.email.split("@")[0],
            username: su.user_metadata?.user_name || su.email.split("@")[0],
            email: su.email,
            avatar: su.user_metadata?.avatar_url,
            role: su.user_metadata?.role || "member",
            roleLabel: "Studio Member",
          };
          setUser(googleUser);
          saveCurrentUser(googleUser);
        } else if (event === "SIGNED_OUT") {
          setUser(defaultUser);
          saveCurrentUser(defaultUser);
        }
      });

      return () => unsubscribe();
    }

    const handleSync = () => setUser(loadCurrentUser());
    window.addEventListener(AUTH_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(AUTH_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const updateRole = (newRole) => {
    const updated = {
      ...user,
      role: newRole.toLowerCase(),
      roleLabel:
        newRole.toLowerCase() === "founder"
          ? "Founder & Studio Lead"
          : newRole.toLowerCase() === "admin"
          ? "Studio Admin"
          : "Voice Artist",
    };
    setUser(updated);
    saveCurrentUser(updated);
  };

  const signInWithGoogle = async () => {
    return await authService.signInWithGoogle();
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(defaultUser);
    saveCurrentUser(defaultUser);
  };

  const roleLower = (user?.role || "founder").toLowerCase();

  return {
    user: {
      ...user,
      role: roleLower,
    },
    isFounder: roleLower === "founder",
    isAdmin: roleLower === "admin" || roleLower === "founder",
    updateRole,
    signInWithGoogle,
    signOut,
  };
}

export default useAuth;
