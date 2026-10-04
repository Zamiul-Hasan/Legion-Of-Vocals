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

/**
 * Strictly verifies whether currentUser is the legitimate owner of member.
 * Returns false if user is not logged in or doesn't match member.
 */
export function isMemberOwner(currentUser, member) {
  if (!currentUser || !member) return false;

  const currentId = currentUser.id != null ? String(currentUser.id).toLowerCase().trim() : null;
  const currentEmail = currentUser.email ? currentUser.email.toLowerCase().trim() : null;
  const currentLovId = currentUser.lovId ? currentUser.lovId.toLowerCase().trim() : null;
  const currentUsername = currentUser.username ? currentUser.username.toLowerCase().trim() : null;

  const memberId = member.id != null ? String(member.id).toLowerCase().trim() : null;
  const memberEmail = member.email ? member.email.toLowerCase().trim() : null;
  const memberLovId = member.lovId ? member.lovId.toLowerCase().trim() : null;
  const memberUsername = member.username ? member.username.toLowerCase().trim() : null;

  if (currentEmail && memberEmail && currentEmail === memberEmail) return true;
  if (currentLovId && memberLovId && currentLovId === memberLovId) return true;
  if (currentUsername && memberUsername && currentUsername === memberUsername) return true;
  if (currentId && memberId && currentId === memberId) return true;

  return false;
}

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

export function cleanupStaleStorage() {
  try {
    // 1. Clean up lov_avatar_overrides: migrate any avatar from 'zamiul' to 'ovi', '1', 'lov-2026-0001'
    const overridesRaw = localStorage.getItem(AVATAR_OVERRIDES_KEY);
    if (overridesRaw) {
      const overrides = JSON.parse(overridesRaw);
      const rawFounderAvatar =
        overrides["zamiul"] ||
        overrides["ovi"] ||
        overrides["lov-2026-0001"] ||
        overrides["1"] ||
        overrides["zamiulhasan6@gmail.com"];

      const founderAvatar =
        rawFounderAvatar && !rawFounderAvatar.includes("logo.png") && !rawFounderAvatar.includes("logo.jpg")
          ? rawFounderAvatar
          : null;

      if (founderAvatar) {
        overrides["ovi"] = founderAvatar;
        overrides["1"] = founderAvatar;
        overrides["lov-2026-0001"] = founderAvatar;
        overrides["zamiulhasan6@gmail.com"] = founderAvatar;
      } else {
        delete overrides["ovi"];
        delete overrides["1"];
        delete overrides["lov-2026-0001"];
        delete overrides["zamiulhasan6@gmail.com"];
      }
      delete overrides["zamiul"];
      delete overrides["zamiul.hasan@gmail.com"];
      localStorage.setItem(AVATAR_OVERRIDES_KEY, JSON.stringify(overrides));
    }

    // 2. Clean up lov_cover_overrides
    const coverRaw = localStorage.getItem(COVER_OVERRIDES_KEY);
    if (coverRaw) {
      const covers = JSON.parse(coverRaw);
      const rawFounderCover =
        covers["zamiul"] ||
        covers["ovi"] ||
        covers["lov-2026-0001"] ||
        covers["1"] ||
        covers["zamiulhasan6@gmail.com"];

      const founderCover =
        rawFounderCover && !rawFounderCover.includes("blue-lock-banner.jpg")
          ? rawFounderCover
          : null;

      if (founderCover) {
        covers["ovi"] = founderCover;
        covers["1"] = founderCover;
        covers["lov-2026-0001"] = founderCover;
        covers["zamiulhasan6@gmail.com"] = founderCover;
      } else {
        delete covers["ovi"];
        delete covers["1"];
        delete covers["lov-2026-0001"];
        delete covers["zamiulhasan6@gmail.com"];
      }
      delete covers["zamiul"];
      delete covers["zamiul.hasan@gmail.com"];
      localStorage.setItem(COVER_OVERRIDES_KEY, JSON.stringify(covers));
    }

    // 3. Clean up lov_current_user_v2 & legacy lov_current_user
    ["lov_current_user_v2", "lov_current_user"].forEach((k) => {
      const curRaw = localStorage.getItem(k);
      if (curRaw) {
        const cur = JSON.parse(curRaw);
        if (
          cur &&
          (String(cur.id) === "1" ||
            cur.username === "zamiul" ||
            cur.username === "ovi" ||
            cur.email === "zamiul.hasan@gmail.com" ||
            cur.email === "zamiulhasan6@gmail.com" ||
            cur.lovId === "LOV-2026-0001")
        ) {
          const healed = {
            ...cur,
            id: 1,
            fullName: "MD Zamiul Hasan",
            displayName: "MD Zamiul Hasan",
            username: "ovi",
            email: "zamiulhasan6@gmail.com",
            role: "founder",
            roleLabel: "Founder & Studio Lead",
            lovId: "LOV-2026-0001",
          };
          localStorage.setItem(k, JSON.stringify(healed));
        }
      }
    });

    // 4. Clean up lov_members_v2
    const memRaw = localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (memRaw) {
      const mems = JSON.parse(memRaw);
      if (Array.isArray(mems)) {
        const cleaned = mems
          .filter(
            (m) =>
              !(
                (m.username === "zamiul" || m.email === "zamiul.hasan@gmail.com") &&
                m.email !== "zamiulhasan6@gmail.com" &&
                m.username !== "ovi" &&
                String(m.id) !== "1"
              )
          )
          .map((m) => {
            if (
              String(m.id) === "1" ||
              m.lovId === "LOV-2026-0001" ||
              m.email === "zamiulhasan6@gmail.com" ||
              m.email === "zamiul.hasan@gmail.com" ||
              m.username === "ovi" ||
              m.username === "zamiul"
            ) {
              return {
                ...m,
                id: 1,
                fullName: "MD Zamiul Hasan",
                displayName: "MD Zamiul Hasan",
                username: "ovi",
                email: "zamiulhasan6@gmail.com",
                role: "Founder",
                lovId: "LOV-2026-0001",
              };
            }
            return m;
          });
        localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(cleaned));
      }
    }

    // 5. Purge legacy dummy pending users (Tanvir Hasan, Arafat Islam, Sakib Ahmed, LOV-000001..3, 101..103)
    localStorage.removeItem("pendingUsers");
    const pendingRaw = localStorage.getItem("lov_pending_users_v2");
    if (pendingRaw) {
      try {
        const list = JSON.parse(pendingRaw);
        if (Array.isArray(list)) {
          const dummyIds = ["101", "102", "103", "lov-000001", "lov-000002", "lov-000003"];
          const dummyEmails = ["tanvir@gmail.com", "arafat@gmail.com", "sakib@gmail.com"];
          const dummyNames = ["tanvir hasan", "arafat islam", "sakib ahmed"];

          const filtered = list.filter((p) => {
            if (!p) return false;
            const idMatch = p.id != null && dummyIds.includes(String(p.id).toLowerCase());
            const lovMatch = p.lovId && dummyIds.includes(p.lovId.toLowerCase());
            const emailMatch = p.email && dummyEmails.includes(p.email.toLowerCase());
            const nameMatch = p.fullName && dummyNames.includes(p.fullName.toLowerCase());
            return !(idMatch || lovMatch || emailMatch || nameMatch);
          });

          if (filtered.length !== list.length) {
            localStorage.setItem("lov_pending_users_v2", JSON.stringify(filtered));
            window.dispatchEvent(new Event("lov-pending-updated"));
          }
        }
      } catch {
        localStorage.setItem("lov_pending_users_v2", "[]");
      }
    }
  } catch {
    // ignore errors
  }
}

function applyOverrides(memberList) {
  const avatarOverrides = getAvatarOverrides();
  const coverOverrides = getCoverOverrides();

  return memberList.map((m) => {
    const isFounder =
      String(m.id) === "1" ||
      (m.lovId && m.lovId.toLowerCase() === "lov-2026-0001") ||
      (m.email && m.email.toLowerCase() === "zamiulhasan6@gmail.com") ||
      (m.username && (m.username.toLowerCase() === "ovi" || m.username.toLowerCase() === "zamiul"));

    const keys = isFounder
      ? ["1", "ovi", "zamiul", "lov-2026-0001", "zamiulhasan6@gmail.com", "zamiul.hasan@gmail.com"]
      : [
          m.id != null ? String(m.id).toLowerCase() : null,
          m.username ? m.username.toLowerCase() : null,
          m.lovId ? m.lovId.toLowerCase() : null,
          m.email ? m.email.toLowerCase() : null,
        ].filter(Boolean);

    let avatar = m.avatar;
    for (const k of keys) {
      if (avatarOverrides[k] && !avatarOverrides[k].includes("logo.png") && !avatarOverrides[k].includes("logo.jpg")) {
        avatar = avatarOverrides[k];
        break;
      }
    }

    let cover = m.cover;
    for (const k of keys) {
      if (coverOverrides[k] && !coverOverrides[k].includes("blue-lock-banner.jpg")) {
        cover = coverOverrides[k];
        break;
      }
    }

    if (isFounder) {
      const founderDef = defaultMembers[0];
      const validAvatar = avatar && !avatar.includes("logo.png") && !avatar.includes("logo.jpg") ? avatar : founderDef.avatar;
      const validCover = cover && !cover.includes("blue-lock-banner.jpg") ? cover : founderDef.cover;
      return {
        ...m,
        id: 1,
        fullName: "MD Zamiul Hasan",
        displayName: "MD Zamiul Hasan",
        username: "ovi",
        email: "zamiulhasan6@gmail.com",
        role: "Founder",
        lovId: "LOV-2026-0001",
        avatar: validAvatar,
        cover: validCover,
      };
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
    cleanupStaleStorage();

    const raw = localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (Array.isArray(saved) && saved.length > 0) {
        // Merge saved overrides with defaultMembers so any new fields exist
        const merged = defaultMembers.map((def) => {
          const isFounder = def.id === 1 || def.lovId === "LOV-2026-0001";
          const found = saved.find(
            (s) =>
              String(s.id) === String(def.id) ||
              (s.username && def.username &&
                s.username.toLowerCase() === def.username.toLowerCase()) ||
              (s.lovId && def.lovId &&
                s.lovId.toLowerCase() === def.lovId.toLowerCase()) ||
              (isFounder &&
                (s.username === "zamiul" ||
                  s.email === "zamiul.hasan@gmail.com" ||
                  s.email === "zamiulhasan6@gmail.com"))
          );

          if (!found) return def;

          // If Founder, preserve legit info strictly:
          if (isFounder) {
            const validAvatar =
              typeof found.avatar === "string" &&
              !found.avatar.includes("logo.png") &&
              !found.avatar.includes("logo.jpg")
                ? found.avatar
                : def.avatar;
            const validCover =
              typeof found.cover === "string" &&
              !found.cover.includes("blue-lock-banner.jpg")
                ? found.cover
                : def.cover;
            return {
              ...def,
              avatar: validAvatar,
              cover: validCover,
              avatarFrame: found.avatarFrame || def.avatarFrame,
              avatarCaption: found.avatarCaption || def.avatarCaption,
              stats: found.stats || def.stats,
              fullName: "MD Zamiul Hasan",
              displayName: "MD Zamiul Hasan",
              username: "ovi",
              email: "zamiulhasan6@gmail.com",
              role: "Founder",
              lovId: "LOV-2026-0001",
            };
          }

          return { ...def, ...found };
        });

        // Filter out any duplicate or stale founder entries
        const extra = saved.filter(
          (s) =>
            !defaultMembers.some(
              (def) =>
                String(def.id) === String(s.id) ||
                (def.lovId && s.lovId && def.lovId.toLowerCase() === s.lovId.toLowerCase()) ||
                (def.username &&
                  s.username &&
                  def.username.toLowerCase() === s.username.toLowerCase()) ||
                (def.email &&
                  s.email &&
                  def.email.toLowerCase() === s.email.toLowerCase())
            ) &&
            s.email?.toLowerCase() !== "zamiul.hasan@gmail.com" &&
            s.email?.toLowerCase() !== "zamiulhasan6@gmail.com" &&
            s.username?.toLowerCase() !== "zamiul" &&
            s.username?.toLowerCase() !== "ovi" &&
            s.lovId?.toLowerCase() !== "lov-2026-0001"
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
              if (avatarOverrides[k] && !avatarOverrides[k].includes("logo.png") && !avatarOverrides[k].includes("logo.jpg")) {
                avatar = avatarOverrides[k];
                break;
              }
            }

            if (
              !avatar ||
              (typeof avatar === "string" && (avatar.includes("logo.png") || avatar.includes("logo.jpg")))
            ) {
              if (
                typeof localMatch?.avatar === "string" &&
                !localMatch.avatar.includes("logo.png") &&
                !localMatch.avatar.includes("logo.jpg")
              ) {
                avatar = localMatch.avatar;
              } else if (String(dbM.id) === "1" || dbM.lovId === "LOV-2026-0001" || dbM.username === "ovi") {
                avatar = defaultMembers[0].avatar;
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
    const authUser = loadCurrentUser();
    if (!authUser) {
      console.warn("Unauthorized: Must be logged in to update profile");
      return;
    }

    const current = loadMembers();
    const query = String(idOrUsername).toLowerCase().trim();

    const isAuthUserMatch =
      (authUser.id != null && String(authUser.id).toLowerCase() === query) ||
      (authUser.username && authUser.username.toLowerCase() === query) ||
      (authUser.lovId && authUser.lovId.toLowerCase() === query) ||
      (authUser.email && authUser.email.toLowerCase() === query);

    const targetMember = current.find((m) =>
      (m.id != null && String(m.id).toLowerCase() === query) ||
      (m.username && m.username.toLowerCase() === query) ||
      (m.lovId && m.lovId.toLowerCase() === query) ||
      (m.email && m.email.toLowerCase() === query)
    );

    const isAuthorized = isAuthUserMatch || (targetMember && isMemberOwner(authUser, targetMember));
    if (!isAuthorized) {
      console.warn("Forbidden: Cannot update another user's profile");
      return;
    }

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
    if (isAuthUserMatch || (targetMember && isMemberOwner(authUser, targetMember))) {
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

    const authUser = loadCurrentUser();
    if (!authUser) {
      console.warn("Unauthorized: Must be logged in to update avatar");
      return null;
    }

    const current = loadMembers();
    const query = String(idOrUsername).toLowerCase().trim();

    const isAuthUserMatch =
      (authUser.id != null && String(authUser.id).toLowerCase() === query) ||
      (authUser.username && authUser.username.toLowerCase() === query) ||
      (authUser.lovId && authUser.lovId.toLowerCase() === query) ||
      (authUser.email && authUser.email.toLowerCase() === query);

    const targetMember = current.find((m) =>
      (m.id != null && String(m.id).toLowerCase() === query) ||
      (m.username && m.username.toLowerCase() === query) ||
      (m.lovId && m.lovId.toLowerCase() === query) ||
      (m.email && m.email.toLowerCase() === query)
    );

    const isAuthorized = isAuthUserMatch || (targetMember && isMemberOwner(authUser, targetMember));
    if (!isAuthorized) {
      console.warn("Forbidden: Cannot update another user's avatar");
      return null;
    }

    // Compress avatar to ~25KB to prevent storage overflows
    const compressedAvatar = await compressImage(avatarDataUrl, 320, 0.85);

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

    // 3. Sync useAuth
    saveCurrentUser({
      ...authUser,
      avatar: compressedAvatar,
      avatarFrame: options.frameBadge ?? authUser.avatarFrame ?? "",
      avatarCaption: options.caption ?? authUser.avatarCaption ?? "",
    });
    if (authUser.username) saveAvatarOverride(authUser.username, compressedAvatar);
    if (authUser.lovId) saveAvatarOverride(authUser.lovId, compressedAvatar);
    if (authUser.email) saveAvatarOverride(authUser.email, compressedAvatar);

    // 4. Sync with Supabase if configured
    if (isSupabaseConfigured() && updatedMember) {
      memberService.updateAvatar(updatedMember, compressedAvatar);
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

    const authUser = loadCurrentUser();
    if (!authUser) {
      console.warn("Unauthorized: Must be logged in to update cover");
      return;
    }

    const query = String(idOrUsername).toLowerCase().trim();
    const isAuthUserMatch =
      (authUser.id != null && String(authUser.id).toLowerCase() === query) ||
      (authUser.username && authUser.username.toLowerCase() === query) ||
      (authUser.lovId && authUser.lovId.toLowerCase() === query) ||
      (authUser.email && authUser.email.toLowerCase() === query);

    const current = loadMembers();
    const targetMember = current.find((m) =>
      (m.id != null && String(m.id).toLowerCase() === query) ||
      (m.username && m.username.toLowerCase() === query) ||
      (m.lovId && m.lovId.toLowerCase() === query) ||
      (m.email && m.email.toLowerCase() === query)
    );

    const isAuthorized = isAuthUserMatch || (targetMember && isMemberOwner(authUser, targetMember));
    if (!isAuthorized) {
      console.warn("Forbidden: Cannot update another user's cover");
      return;
    }

    const compressedCover = await compressImage(coverDataUrl, 960, 0.82);
    saveCoverOverride(query, compressedCover);

    updateMemberProfile(idOrUsername, { cover: compressedCover });

    // Sync cover photo with Supabase Cloud
    if (isSupabaseConfigured() && (targetMember || authUser)) {
      memberService.updateCover(targetMember || authUser, compressedCover);
    }
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
