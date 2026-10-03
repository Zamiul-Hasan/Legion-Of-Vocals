import { useState, useEffect } from "react";
import defaultMembers from "../data/members";
import { loadNotifications, saveNotifications } from "../data/notifications";
import { memberService } from "../services/memberService";
import { isSupabaseConfigured } from "../lib/supabase";
import { loadCurrentUser, saveCurrentUser } from "./useAuth";
import { compressImage } from "../utils/imageCompressor";

const MEMBERS_STORAGE_KEY = "lov_members_v2";
const AVATAR_OVERRIDES_KEY = "lov_avatar_overrides";
const COVER_OVERRIDES_KEY = "lov_cover_overrides";
const MEMBERS_EVENT = "lov-members-updated";

export function getAvatarOverrides() {
  try {
    return JSON.parse(localStorage.getItem(AVATAR_OVERRIDES_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveAvatarOverride(key, avatarUrl) {
  try {
    if (!key || !avatarUrl) return;
    const current = getAvatarOverrides();
    const cleanKey = String(key).toLowerCase().trim();
    current[cleanKey] = avatarUrl;
    localStorage.setItem(AVATAR_OVERRIDES_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
}

export function getCoverOverrides() {
  try {
    return JSON.parse(localStorage.getItem(COVER_OVERRIDES_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveCoverOverride(key, coverUrl) {
  try {
    if (!key || !coverUrl) return;
    const current = getCoverOverrides();
    const cleanKey = String(key).toLowerCase().trim();
    current[cleanKey] = coverUrl;
    localStorage.setItem(COVER_OVERRIDES_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
}

function applyOverrides(memberList) {
  const avatarOverrides = getAvatarOverrides();
  const coverOverrides = getCoverOverrides();

  return memberList.map((m) => {
    const keys = [
      m.id != null ? String(m.id).toLowerCase() : null,
      m.username ? m.username.toLowerCase() : null,
      m.lovId ? m.lovId.toLowerCase() : null,
      m.email ? m.email.toLowerCase() : null,
    ].filter(Boolean);

    let avatar = m.avatar;
    for (const k of keys) {
      if (avatarOverrides[k]) {
        avatar = avatarOverrides[k];
        break;
      }
    }

    let cover = m.cover;
    for (const k of keys) {
      if (coverOverrides[k]) {
        cover = coverOverrides[k];
        break;
      }
    }

    return {
      ...m,
      avatar,
      cover,
    };
  });
}

export function loadMembers() {
  try {
    const raw = localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (Array.isArray(saved) && saved.length > 0) {
        // Merge saved overrides with defaultMembers so any new fields exist
        const merged = defaultMembers.map((def) => {
          const found = saved.find(
            (s) =>
              String(s.id) === String(def.id) ||
              (s.username && def.username &&
                s.username.toLowerCase() === def.username.toLowerCase()) ||
              (s.lovId && def.lovId &&
                s.lovId.toLowerCase() === def.lovId.toLowerCase())
          );
          return found ? { ...def, ...found } : def;
        });
        // Include any newly added members not in defaultMembers
        const extra = saved.filter(
          (s) =>
            !defaultMembers.some(
              (def) =>
                String(def.id) === String(s.id) ||
                (def.username &&
                  s.username &&
                  def.username.toLowerCase() === s.username.toLowerCase()) ||
                (def.lovId &&
                  s.lovId &&
                  def.lovId.toLowerCase() === s.lovId.toLowerCase())
            )
        );
        return applyOverrides([...merged, ...extra]);
      }
    }
  } catch {
    // ignore localStorage read errors
  }
  return applyOverrides(defaultMembers);
}

export function saveMembers(list) {
  try {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore localStorage quota errors
  }
  window.dispatchEvent(new Event(MEMBERS_EVENT));
}

export function useMembers() {
  const [members, setMembers] = useState(() => loadMembers());

  useEffect(() => {
    // If Supabase is configured, fetch live profiles from PostgreSQL
    if (isSupabaseConfigured()) {
      memberService.getMembers().then((dbMembers) => {
        if (dbMembers && dbMembers.length > 0) {
          const currentLocal = loadMembers();
          const avatarOverrides = getAvatarOverrides();

          const mergedWithDb = dbMembers.map((dbM) => {
            const localMatch = currentLocal.find(
              (loc) =>
                String(loc.id) === String(dbM.id) ||
                (loc.username && dbM.username && loc.username.toLowerCase() === dbM.username.toLowerCase()) ||
                (loc.lovId && dbM.lovId && loc.lovId.toLowerCase() === dbM.lovId.toLowerCase())
            );

            // Determine best avatar: local override > valid DB avatar > local avatar > fallback
            let avatar = dbM.avatar;
            const keys = [
              dbM.id != null ? String(dbM.id).toLowerCase() : null,
              dbM.username ? dbM.username.toLowerCase() : null,
              dbM.lovId ? dbM.lovId.toLowerCase() : null,
            ].filter(Boolean);

            for (const k of keys) {
              if (avatarOverrides[k]) {
                avatar = avatarOverrides[k];
                break;
              }
            }

            if (!avatar || avatar.includes("logo.png")) {
              if (localMatch?.avatar && !localMatch.avatar.includes("logo.png")) {
                avatar = localMatch.avatar;
              }
            }

            if (!localMatch) return { ...dbM, avatar: avatar || dbM.avatar };

            return {
              ...dbM,
              ...localMatch,
              avatar: avatar || localMatch.avatar || dbM.avatar,
              cover: localMatch.cover || dbM.cover,
              points: dbM.points != null ? dbM.points : localMatch.points,
            };
          });

          // Also keep any local members not present in DB
          const localOnly = currentLocal.filter(
            (loc) =>
              !dbMembers.some(
                (dbM) =>
                  String(dbM.id) === String(loc.id) ||
                  (loc.username && dbM.username && loc.username.toLowerCase() === dbM.username.toLowerCase())
              )
          );

          const finalMerged = applyOverrides([...mergedWithDb, ...localOnly]);
          setMembers(finalMerged);
          saveMembers(finalMerged);
        }
      });
    }

    const handleSync = () => {
      setMembers(loadMembers());
    };
    window.addEventListener(MEMBERS_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(MEMBERS_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const updateMemberProfile = (idOrUsername, patch) => {
    const current = loadMembers();
    const query = String(idOrUsername).toLowerCase().trim();

    const updated = current.map((m) => {
      const isMatch =
        String(m.id).toLowerCase() === query ||
        (m.username && m.username.toLowerCase() === query) ||
        (m.lovId && m.lovId.toLowerCase() === query) ||
        (m.email && m.email.toLowerCase() === query);

      if (!isMatch) return m;
      return {
        ...m,
        ...patch,
      };
    });

    setMembers(updated);
    saveMembers(updated);

    // If matches auth user, sync useAuth as well
    const authUser = loadCurrentUser();
    if (
      authUser &&
      (String(authUser.id).toLowerCase() === query ||
        (authUser.username && authUser.username.toLowerCase() === query) ||
        (authUser.lovId && authUser.lovId.toLowerCase() === query) ||
        (authUser.email && authUser.email.toLowerCase() === query))
    ) {
      saveCurrentUser({
        ...authUser,
        ...patch,
      });
    }
  };

  const updateMemberAvatar = async (
    idOrUsername,
    avatarDataUrl,
    options = { frameBadge: "", caption: "" }
  ) => {
    if (!avatarDataUrl) return null;

    // Compress avatar to ~25KB to prevent storage overflows
    const compressedAvatar = await compressImage(avatarDataUrl, 320, 0.85);

    const current = loadMembers();
    const query = String(idOrUsername).toLowerCase().trim();
    let updatedMember = null;

    // 1. Save in avatar overrides map
    saveAvatarOverride(query, compressedAvatar);

    // 2. Update in members list
    let memberFound = false;
    const updated = current.map((m) => {
      const isMatch =
        String(m.id).toLowerCase() === query ||
        (m.username && m.username.toLowerCase() === query) ||
        (m.lovId && m.lovId.toLowerCase() === query) ||
        (m.email && m.email.toLowerCase() === query);

      if (!isMatch) return m;

      memberFound = true;
      updatedMember = {
        ...m,
        avatar: compressedAvatar,
        avatarFrame: options.frameBadge ?? m.avatarFrame ?? "",
        avatarCaption: options.caption ?? m.avatarCaption ?? "",
        avatarUpdatedAt: new Date().toISOString(),
      };

      // Also index by other identifiers
      if (m.username) saveAvatarOverride(m.username, compressedAvatar);
      if (m.lovId) saveAvatarOverride(m.lovId, compressedAvatar);
      if (m.email) saveAvatarOverride(m.email, compressedAvatar);

      return updatedMember;
    });

    // If member not found in list but matches auth user, create/add them
    const authUser = loadCurrentUser();
    const isAuthUserMatch =
      authUser &&
      (String(authUser.id).toLowerCase() === query ||
        (authUser.username && authUser.username.toLowerCase() === query) ||
        (authUser.lovId && authUser.lovId.toLowerCase() === query) ||
        (authUser.email && authUser.email.toLowerCase() === query));

    if (!memberFound && isAuthUserMatch) {
      updatedMember = {
        ...authUser,
        avatar: compressedAvatar,
        avatarFrame: options.frameBadge ?? "",
        avatarCaption: options.caption ?? "",
        avatarUpdatedAt: new Date().toISOString(),
      };
      updated.unshift(updatedMember);
    }

    setMembers(updated);
    saveMembers(updated);

    // 3. Sync useAuth if it's the current user
    if (isAuthUserMatch || (updatedMember && authUser && (authUser.id === updatedMember.id || authUser.username === updatedMember.username))) {
      saveCurrentUser({
        ...authUser,
        avatar: compressedAvatar,
        avatarFrame: options.frameBadge ?? authUser.avatarFrame ?? "",
        avatarCaption: options.caption ?? authUser.avatarCaption ?? "",
      });
      if (authUser.username) saveAvatarOverride(authUser.username, compressedAvatar);
      if (authUser.lovId) saveAvatarOverride(authUser.lovId, compressedAvatar);
      if (authUser.email) saveAvatarOverride(authUser.email, compressedAvatar);
    }

    // 4. Sync with Supabase if configured
    if (isSupabaseConfigured() && updatedMember?.id) {
      memberService.updateAvatar(updatedMember.id, compressedAvatar);
    }

    if (updatedMember) {
      const notifs = loadNotifications();
      saveNotifications([
        {
          id: Date.now(),
          category: "Account",
          title: `📸 ${updatedMember.displayName || updatedMember.fullName} updated their profile picture`,
          message: options.caption
            ? `"${options.caption}"`
            : `New profile photo saved for ${updatedMember.fullName} (${updatedMember.lovId}).`,
          time: "Just now",
          unread: true,
          link: `/team/${updatedMember.username}`,
        },
        ...notifs,
      ]);
    }

    return updatedMember;
  };

  const updateMemberCover = async (idOrUsername, coverDataUrl) => {
    if (!coverDataUrl) return;
    const compressedCover = await compressImage(coverDataUrl, 960, 0.82);
    const query = String(idOrUsername).toLowerCase().trim();
    saveCoverOverride(query, compressedCover);

    updateMemberProfile(idOrUsername, { cover: compressedCover });
  };

  const addMember = (newMember) => {
    const current = loadMembers();
    const exists = current.some(
      (m) =>
        String(m.id) === String(newMember.id) ||
        (m.lovId && newMember.lovId && m.lovId.toLowerCase() === newMember.lovId.toLowerCase()) ||
        (m.username && newMember.username && m.username.toLowerCase() === newMember.username.toLowerCase())
    );
    const updated = exists
      ? current.map((m) => (String(m.id) === String(newMember.id) ? { ...m, ...newMember } : m))
      : [newMember, ...current];
    setMembers(updated);
    saveMembers(updated);
  };

  const deleteMember = (id) => {
    const current = loadMembers();
    const updated = current.filter((m) => String(m.id) !== String(id));
    setMembers(updated);
    saveMembers(updated);
  };

  const authUser = loadCurrentUser();
  const currentUser = authUser
    ? members.find(
        (m) =>
          (m.username && authUser.username && m.username.toLowerCase() === authUser.username.toLowerCase()) ||
          (m.email && authUser.email && m.email.toLowerCase() === authUser.email.toLowerCase()) ||
          (m.lovId && authUser.lovId && m.lovId.toLowerCase() === authUser.lovId.toLowerCase()) ||
          String(m.id) === String(authUser.id)
      ) || authUser
    : null;

  return {
    members,
    currentUser,
    setMembers,
    addMember,
    deleteMember,
    updateMemberProfile,
    updateMemberAvatar,
    updateMemberCover,
  };
}

export default useMembers;
