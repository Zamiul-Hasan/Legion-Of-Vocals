import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { isSupabaseConfigured } from "../lib/supabase";
import members from "../data/members";

const AUTH_STORAGE_KEY = "lov_current_user_v2";
const AUTH_EVENT = "lov-auth-updated";

export function loadCurrentUser() {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem("lov_current_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && (parsed.role || parsed.email || parsed.username)) {
        const isFounderUser =
          String(parsed.id) === "1" ||
          parsed.username === "zamiul" ||
          parsed.username === "ovi" ||
          parsed.email === "zamiul.hasan@gmail.com" ||
          parsed.email === "zamiulhasan6@gmail.com" ||
          parsed.lovId === "LOV-2026-0001";

        if (isFounderUser) {
          parsed.id = 1;
          parsed.fullName = "MD Zamiul Hasan";
          parsed.displayName = "MD Zamiul Hasan";
          parsed.username = "ovi";
          parsed.email = "zamiulhasan6@gmail.com";
          parsed.role = "founder";
          parsed.roleLabel = "Founder & Studio Lead";
          parsed.lovId = "LOV-2026-0001";
        }

        try {
          const overrides = JSON.parse(localStorage.getItem("lov_avatar_overrides") || "{}");
          const keys = isFounderUser
            ? ["1", "ovi", "zamiul", "lov-2026-0001", "zamiulhasan6@gmail.com", "zamiul.hasan@gmail.com"]
            : [
                parsed.id != null ? String(parsed.id).toLowerCase() : null,
                parsed.username ? parsed.username.toLowerCase() : null,
                parsed.lovId ? parsed.lovId.toLowerCase() : null,
                parsed.email ? parsed.email.toLowerCase() : null,
              ].filter(Boolean);

          for (const k of keys) {
            if (overrides[k] && !overrides[k].includes("logo.png") && !overrides[k].includes("logo.jpg")) {
              parsed.avatar = overrides[k];
              break;
            }
          }
        } catch {
          // ignore
        }

        if (isFounderUser && (!parsed.avatar || parsed.avatar.includes("logo.png") || parsed.avatar.includes("logo.jpg"))) {
          parsed.avatar = members[0].avatar;
        }

        parsed.achievements =
          Array.isArray(parsed.achievements) && parsed.achievements.length > 0
            ? parsed.achievements
            : isFounderUser
            ? ["Founder", "Studio Lead", "Verified Member"]
            : ["Verified Member", "Anime Voice Artist"];
        parsed.skills =
          Array.isArray(parsed.skills) && parsed.skills.length > 0
            ? parsed.skills
            : ["Voice Acting"];
        parsed.stats = parsed.stats || {
          projects: 0,
          dubVideos: 0,
          points: 100,
          followers: 0,
        };
        parsed.level = parsed.level || 1;

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
      if (overrides[k] && !overrides[k].includes("logo.png") && !overrides[k].includes("logo.jpg")) {
        return { ...u, avatar: overrides[k] };
      }
    }
  } catch {
    // ignore
  }

  const isFounderUser =
    String(u.id) === "1" ||
    u.username === "ovi" ||
    u.username === "zamiul" ||
    u.email === "zamiulhasan6@gmail.com" ||
    u.lovId === "LOV-2026-0001";

  if (isFounderUser && (!u.avatar || u.avatar.includes("logo.png") || u.avatar.includes("logo.jpg"))) {
    return { ...u, avatar: members[0].avatar };
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
    // Check if returning from Firebase Google redirect
    authService.getFirebaseRedirectResult?.().then((res) => {
      if (res?.user) {
        const email = (res.user.email || "").toLowerCase();
        const isFounderEmail =
          email === "zamiulhasan6@gmail.com" ||
          email === "zamiul.hasan@gmail.com";

        const loggedInUser = {
          id: isFounderEmail ? 1 : (res.user.id || Date.now()),
          lovId: isFounderEmail ? "LOV-2026-0001" : `LOV-${String(res.user.id || Date.now()).slice(0, 6).toUpperCase()}`,
          fullName: isFounderEmail ? "MD Zamiul Hasan" : (res.user.fullName || res.user.displayName || email.split("@")[0]),
          displayName: isFounderEmail ? "MD Zamiul Hasan" : (res.user.displayName || email.split("@")[0]),
          username: isFounderEmail ? "ovi" : (res.user.email ? res.user.email.split("@")[0] : "user"),
          email: res.user.email,
          avatar: isFounderEmail ? members[0].avatar : (res.user.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(res.user.email)}`),
          role: isFounderEmail ? "founder" : "member",
          roleLabel: isFounderEmail ? "Founder & Studio Lead" : "Studio Member",
          achievements: isFounderEmail ? ["Founder", "Studio Lead", "Verified Member"] : ["Verified Member", "Anime Voice Artist"],
          skills: isFounderEmail ? ["Voice Acting", "Direction", "Project Management"] : ["Voice Acting"],
          stats: { projects: 0, dubVideos: 0, points: 100, followers: 0 },
          level: 1,
        };

        setUser(loggedInUser);
        saveCurrentUser(loggedInUser);
        if (typeof window !== "undefined" && (window.location.pathname === "/" || window.location.pathname === "/join")) {
          window.location.replace(isFounderEmail ? "/admin" : "/dashboard");
        }
      }
    }).catch(() => {});

    // Listen for live Supabase auth session changes (e.g. Google Login redirect)
    if (isSupabaseConfigured()) {
      authService.getSession().then((session) => {
        if (session?.user) {
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
            achievements: isFounderEmail ? ["Founder", "Studio Lead", "Verified Member"] : ["Verified Member", "Anime Voice Artist"],
            skills: isFounderEmail ? ["Voice Acting", "Direction", "Project Management"] : ["Voice Acting"],
            stats: { projects: 0, dubVideos: 0, points: 100, followers: 0 },
            level: 1,
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
            achievements: isFounderEmail ? ["Founder", "Studio Lead", "Verified Member"] : ["Verified Member", "Anime Voice Artist"],
            skills: isFounderEmail ? ["Voice Acting", "Direction", "Project Management"] : ["Voice Acting"],
            stats: { projects: 0, dubVideos: 0, points: 100, followers: 0 },
            level: 1,
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
   * Log in using registered Email and Password
   */
  const login = async ({ identifier, password }) => {
    const cleanId = (identifier || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: "Please enter your Email address and Password." };
    }

    // STRICT: Only Email login is allowed. Username login is disabled.
    if (!cleanId.includes("@")) {
      return {
        success: false,
        message: "Sign in with Username is disabled. Please use your registered Email address.",
      };
    }

    // 1. Check if identifier matches Founder account (strictly by email)
    const isFounderMatch = cleanId === "zamiulhasan6@gmail.com";

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

    // 3. Check registered members in localStorage (lov_members_v2) - STRICTLY by Email
    const savedMembers = JSON.parse(localStorage.getItem("lov_members_v2") || "[]");
    const allMembers = [...members, ...savedMembers];
    const matchedMember = allMembers.find(
      (m) => m.email && m.email.toLowerCase() === cleanId
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

    // 4. Check recently registered pending users (lov_pending_users_v2) - STRICTLY by Email
    const savedPending = JSON.parse(
      localStorage.getItem("lov_pending_users_v2") || "[]"
    );
    const matchedPending = savedPending.find(
      (p) => p.email && p.email.toLowerCase() === cleanId
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
      message: "No registered account found matching this Email address. Please register first via Join LOV.",
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
    const res = await authService.signInWithGoogle();
    if (res?.user) {
      const email = (res.user.email || "").toLowerCase();
      const isFounderEmail =
        email === "zamiulhasan6@gmail.com" ||
        email === "zamiul.hasan@gmail.com";

      const userRole = isFounderEmail ? "founder" : "member";

      const loggedInUser = {
        id: isFounderEmail ? 1 : (res.user.id || Date.now()),
        lovId: isFounderEmail ? "LOV-2026-0001" : `LOV-${String(res.user.id || Date.now()).slice(0, 6).toUpperCase()}`,
        fullName: isFounderEmail ? "MD Zamiul Hasan" : (res.user.fullName || res.user.displayName || email.split("@")[0]),
        displayName: isFounderEmail ? "MD Zamiul Hasan" : (res.user.displayName || email.split("@")[0]),
        username: isFounderEmail ? "ovi" : (res.user.email ? res.user.email.split("@")[0] : "user"),
        email: res.user.email,
        avatar: isFounderEmail ? members[0].avatar : (res.user.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(res.user.email)}`),
        role: userRole,
        roleLabel: isFounderEmail ? "Founder & Studio Lead" : "Studio Member",
        achievements: isFounderEmail ? ["Founder", "Studio Lead", "Verified Member"] : ["Verified Member", "Anime Voice Artist"],
        skills: isFounderEmail ? ["Voice Acting", "Direction", "Project Management"] : ["Voice Acting"],
        stats: { projects: 0, dubVideos: 0, points: 100, followers: 0 },
        level: 1,
      };

      setUser(loggedInUser);
      saveCurrentUser(loggedInUser);
      return { success: true, user: loggedInUser };
    }
    return res;
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
  const isAdminUser = roleLower === "admin" || roleLower === "founder";

  return {
    user,
    isAuthenticated: Boolean(user),
    isFounder: roleLower === "founder",
    isAdmin: isAdminUser,
    canManageProjects: isAdminUser,
    isMember: Boolean(user) && !isAdminUser,
    login,
    updateRole,
    signInWithGoogle,
    signOut,
  };
}

export default useAuth;
