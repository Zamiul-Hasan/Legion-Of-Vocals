import { useState, useEffect } from "react";
import defaultMembers from "../data/members";
import { loadNotifications, saveNotifications } from "../data/notifications";

const MEMBERS_STORAGE_KEY = "lov_members_data";
const MEMBERS_EVENT = "lov-members-updated";

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
              Number(s.id) === Number(def.id) ||
              (s.username &&
                s.username.toLowerCase() === def.username.toLowerCase())
          );
          return found ? { ...def, ...found } : def;
        });
        // Include any newly added members not in defaultMembers
        const extra = saved.filter(
          (s) =>
            !defaultMembers.some(
              (def) =>
                Number(def.id) === Number(s.id) ||
                (def.username &&
                  s.username &&
                  def.username.toLowerCase() === s.username.toLowerCase())
            )
        );
        return [...merged, ...extra];
      }
    }
  } catch {
    // ignore localStorage read errors
  }
  return defaultMembers;
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
    const updated = current.map((m) => {
      const isMatch =
        Number(m.id) === Number(idOrUsername) ||
        (typeof idOrUsername === "string" &&
          (m.username.toLowerCase() === idOrUsername.toLowerCase() ||
            (m.lovId && m.lovId.toLowerCase() === idOrUsername.toLowerCase())));
      if (!isMatch) return m;
      return {
        ...m,
        ...patch,
      };
    });
    setMembers(updated);
    saveMembers(updated);
  };

  const updateMemberAvatar = (
    idOrUsername,
    avatarDataUrl,
    options = { frameBadge: "", caption: "" }
  ) => {
    const current = loadMembers();
    let updatedMember = null;

    const updated = current.map((m) => {
      const isMatch =
        Number(m.id) === Number(idOrUsername) ||
        (typeof idOrUsername === "string" &&
          (m.username.toLowerCase() === idOrUsername.toLowerCase() ||
            (m.lovId && m.lovId.toLowerCase() === idOrUsername.toLowerCase())));
      if (!isMatch) return m;
      updatedMember = {
        ...m,
        avatar: avatarDataUrl,
        avatarFrame: options.frameBadge ?? m.avatarFrame ?? "",
        avatarCaption: options.caption ?? m.avatarCaption ?? "",
        avatarUpdatedAt: new Date().toISOString(),
      };
      return updatedMember;
    });

    setMembers(updated);
    saveMembers(updated);

    if (updatedMember) {
      const notifs = loadNotifications();
      saveNotifications([
        {
          id: Date.now(),
          category: "Account",
          title: `📸 ${updatedMember.displayName} updated their profile picture`,
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

  const updateMemberCover = (idOrUsername, coverDataUrl) => {
    updateMemberProfile(idOrUsername, { cover: coverDataUrl });
  };

  const currentUser = members[0] || defaultMembers[0];

  return {
    members,
    currentUser,
    updateMemberProfile,
    updateMemberAvatar,
    updateMemberCover,
  };
}

export default useMembers;
