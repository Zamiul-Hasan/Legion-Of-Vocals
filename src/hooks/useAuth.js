import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { isSupabaseConfigured } from "../lib/supabase";
import members from "../data/members";

const AUTH_STORAGE_KEY = "lov_current_user_v2";
const AUTH_EVENT = "lov-auth-updated";

export function loadCurrentUser() {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && (parsed.role || parsed.email || parsed.username)) {
        try {
          const overrides = JSON.parse(localStorage.getItem("lov_avatar_overrides") || "{}");
          const keys = [
            parsed.id != null ? String(parsed.id).toLowerCase() : null,
            parsed.username ? parsed.username.toLowerCase() : null,
            parsed.lovId ? parsed.lovId.toLowerCase() : null,
            parsed.email ? parsed.email.toLowerCase() : null,
          ].filter(Boolean);

          for (const k of keys) {
            if (overrides[k]) {
              parsed.avatar = overrides[k];
              break;
            }
          }
        } catch {
          // ignore
        }
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }
  return null; // By default, unauthenticated guest
}

function attachAvatarOverride(u) {
  if (!u) return u;
  try {
    const overrides = JSON.parse(localStorage.getItem("lov_avatar_overrides") || "{}");
    const keys = [
      u.id != null ? String(u.id).toLowerCase() : null,
      u.username ? u.username.toLowerCase() : null,
      u.lovId ? u.lovId.toLowerCase() : null,
      u.email ? u.email.toLowerCase() : null,
    ].filter(Boolean);

    for (const k of keys) {
      if (overrides[k]) {
        return { ...u, avatar: overrides[k] };
      }
    }
  } catch {
    // ignore
  }
  return u;
}

export function saveCurrentUser(userData) {
  try {
    if (userData) {
      const withAvatar = attachAvatarOverride(userData);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(withAvatar));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
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
          const isFounderEmail =
            su.email?.toLowerCase() === "zamiul.hasan@gmail.com" ||
            su.email?.toLowerCase() === "zamiulhasan2@gmail.com";

          const googleUser = {
            id: su.id,
            lovId:
              su.user_metadata?.lov_id ||
              (isFounderEmail ? "LOV-2026-0001" : `LOV-${su.id.slice(0, 6).toUpperCase()}`),
            fullName: su.user_metadata?.full_name || su.email.split("@")[0],
            displayName: su.user_metadata?.full_name || su.email.split("@")[0],
            username: su.user_metadata?.user_name || su.email.split("@")[0],
            email: su.email,
            avatar: su.user_metadata?.avatar_url,
            role: isFounderEmail ? "founder" : (su.user_metadata?.role || "member"),
            roleLabel: isFounderEmail ? "Founder & Studio Lead" : "Studio Member",
          };
          setUser(googleUser);
          saveCurrentUser(googleUser);
        }
      });

      const unsubscribe = authService.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const su = session.user;
          const isFounderEmail =
            su.email?.toLowerCase() === "zamiulhasan6@gmail.com";

          const googleUser = {
            id: su.id,
            lovId:
              su.user_metadata?.lov_id ||
              (isFounderEmail ? "LOV-2026-0001" : `LOV-${su.id.slice(0, 6).toUpperCase()}`),
            fullName: su.user_metadata?.full_name || (isFounderEmail ? "MD Zamiul Hasan" : su.email.split("@")[0]),
            displayName: su.user_metadata?.full_name || (isFounderEmail ? "MD Zamiul Hasan" : su.email.split("@")[0]),
            username: su.user_metadata?.user_name || (isFounderEmail ? "ovi" : su.email.split("@")[0]),
            email: su.email,
            avatar: su.user_metadata?.avatar_url,
            role: isFounderEmail ? "founder" : (su.user_metadata?.role || "member"),
            roleLabel: isFounderEmail ? "Founder & Studio Lead" : "Studio Member",
          };
          setUser(googleUser);
          saveCurrentUser(googleUser);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          saveCurrentUser(null);
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

  /**
   * Log in using Email/Username and Password
   */
  const login = async ({ identifier, password }) => {
    const cleanId = (identifier || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: "Please enter your Email/Username and Password." };
    }

    // 1. Check if identifier matches Founder account
    const isFounderMatch =
      cleanId === "ovi" ||
      cleanId === "zamiul" ||
      cleanId === "zamiulhasan6@gmail.com" ||
      cleanId === "lov-2026-0001";

    if (isFounderMatch) {
      const founderPass =
        localStorage.getItem("lov_founder_password") || "LOV@Zamiul";
      if (cleanPass !== founderPass) {
        return {
          success: false,
          message: "Incorrect password for Founder account. Please try again.",
        };
      }

      const founder = members[0] || {
        id: 1,
        lovId: "LOV-2026-0001",
        username: "ovi",
        fullName: "MD Zamiul Hasan",
        displayName: "MD Zamiul Hasan",
        email: "zamiulhasan6@gmail.com",
        role: "Founder",
      };

      const loggedInUser = {
        ...founder,
        role: "founder",
        roleLabel: "Founder & Studio Lead",
      };
      setUser(loggedInUser);
      saveCurrentUser(loggedInUser);
      return { success: true, user: loggedInUser };
    }

    // 2. Check live Supabase Auth if configured (only for regular accounts)
    if (isSupabaseConfigured() && cleanId.includes("@")) {
      try {
        const { user: sbUser, error: sbError } = await authService.signIn({
          email: cleanId,
          password: cleanPass,
        });

        if (!sbError && sbUser) {
          const isFounderEmail =
            sbUser.email?.toLowerCase() === "zamiulhasan6@gmail.com";

          const userRole = isFounderEmail
            ? "founder"
            : (sbUser.user_metadata?.role || "member").toLowerCase();

          const loggedInUser = {
            id: sbUser.id,
            lovId:
              sbUser.user_metadata?.lov_id ||
              (isFounderEmail ? "LOV-2026-0001" : `LOV-${sbUser.id.slice(0, 6).toUpperCase()}`),
            fullName: sbUser.user_metadata?.full_name || sbUser.email.split("@")[0],
            displayName: sbUser.user_metadata?.display_name || sbUser.email.split("@")[0],
            username: sbUser.user_metadata?.user_name || sbUser.email.split("@")[0],
            email: sbUser.email,
            avatar: sbUser.user_metadata?.avatar_url,
            role: userRole,
            roleLabel:
              userRole === "founder"
                ? "Founder & Studio Lead"
                : userRole === "admin"
                ? "Studio Admin"
                : "Studio Member",
          };
          setUser(loggedInUser);
          saveCurrentUser(loggedInUser);
          return { success: true, user: loggedInUser };
        }
      } catch {
        // proceed to local checks
      }
    }

    // 3. Check registered members in localStorage (lov_members_v2)
    const savedMembers = JSON.parse(localStorage.getItem("lov_members_v2") || "[]");
    const allMembers = [...members, ...savedMembers];
    const matchedMember = allMembers.find(
      (m) =>
        (m.username && m.username.toLowerCase() === cleanId) ||
        (m.email && m.email.toLowerCase() === cleanId) ||
        (m.lovId && m.lovId.toLowerCase() === cleanId)
    );

    if (matchedMember) {
      const roleStr = (matchedMember.role || "member").toLowerCase();

      // STRICT password verification
      if (matchedMember.id === 1 || roleStr === "founder") {
        const founderPass =
          localStorage.getItem("lov_founder_password") || "LOV@Zamiul";
        if (cleanPass !== founderPass) {
          return {
            success: false,
            message: "Incorrect password for Founder account. Please try again.",
          };
        }
      } else {
        const memberPass = matchedMember.password || matchedMember.pass;
        if (memberPass) {
          if (cleanPass !== memberPass) {
            return {
              success: false,
              message: "Incorrect password for this member account. Please try again.",
            };
          }
        } else {
          matchedMember.password = cleanPass;
          const updated = savedMembers.map((m) =>
            m.id === matchedMember.id ? { ...m, password: cleanPass } : m
          );
          localStorage.setItem("lov_members_v2", JSON.stringify(updated));
        }
      }

      const isAdminOrFounder = roleStr === "admin" || roleStr === "founder";

      const loggedInUser = {
        ...matchedMember,
        role: isAdminOrFounder ? roleStr : "member",
        roleLabel:
          roleStr === "founder"
            ? "Founder & Studio Lead"
            : roleStr === "admin"
            ? "Studio Admin"
            : matchedMember.appliedRole || "Voice Actor",
      };
      setUser(loggedInUser);
      saveCurrentUser(loggedInUser);
      return { success: true, user: loggedInUser };
    }

    // 4. Check recently registered pending users (lov_pending_users_v2)
    const savedPending = JSON.parse(
      localStorage.getItem("lov_pending_users_v2") ||
      localStorage.getItem("pendingUsers") ||
      "[]"
    );
    const matchedPending = savedPending.find(
      (p) =>
        (p.username && p.username.toLowerCase() === cleanId) ||
        (p.email && p.email.toLowerCase() === cleanId) ||
        (p.lovId && p.lovId.toLowerCase() === cleanId)
    );

    if (matchedPending) {
      // STRICT password verification for pending users
      if (matchedPending.password) {
        if (cleanPass !== matchedPending.password) {
          return {
            success: false,
            message: "Incorrect password. Please enter the password you chose during registration.",
          };
        }
      } else {
        // If password was missing from legacy registration, save it on first valid login
        matchedPending.password = cleanPass;
        const updated = savedPending.map((p) =>
          p.id === matchedPending.id ? { ...p, password: cleanPass } : p
        );
        localStorage.setItem("lov_pending_users_v2", JSON.stringify(updated));
      }

      // Pending users are strictly "member", NEVER "admin" or "founder"
      const loggedInUser = {
        id: matchedPending.id,
        lovId: matchedPending.lovId,
        fullName: matchedPending.fullName,
        displayName: matchedPending.fullName,
        username: matchedPending.username,
        email: matchedPending.email,
        role: "member",
        roleLabel: `${matchedPending.appliedRole || "Voice Actor"} (Applicant)`,
        avatar: matchedPending.avatar || matchedPending.profilePicture,
        status: matchedPending.status || "Pending",
      };
      setUser(loggedInUser);
      saveCurrentUser(loggedInUser);
      return { success: true, user: loggedInUser };
    }

    return {
      success: false,
      message: "No account found matching this Email, Username, or LOV ID. Please register first via Join LOV.",
    };
  };

  const updateRole = (newRole) => {
    if (!user) return;
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
    try {
      await authService.signOut();
    } catch {
      // ignore signOut error
    }
    setUser(null);
    saveCurrentUser(null);
  };

  const roleLower = (user?.role || "").toLowerCase();

  return {
    user,
    isAuthenticated: Boolean(user),
    isFounder: roleLower === "founder",
    isAdmin: roleLower === "admin" || roleLower === "founder",
    isMember: Boolean(user) && roleLower !== "admin" && roleLower !== "founder",
    login,
    updateRole,
    signInWithGoogle,
    signOut,
  };
}

export default useAuth;
