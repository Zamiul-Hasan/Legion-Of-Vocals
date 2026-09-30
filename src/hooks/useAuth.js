import { useState, useEffect } from "react";

const AUTH_STORAGE_KEY = "lov_current_user";
const AUTH_EVENT = "lov-auth-updated";

const defaultUser = {
  id: 1,
  lovId: "LOV-100001",
  name: "Zamiul Hasan",
  username: "zamiul",
  email: "zamiul@legionofvocals.com",
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

export function useAuth() {
  const [user, setUser] = useState(() => loadCurrentUser());

  useEffect(() => {
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
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
    window.dispatchEvent(new Event(AUTH_EVENT));
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
  };
}

export default useAuth;
