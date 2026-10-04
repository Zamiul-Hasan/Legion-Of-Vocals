import { useState, useEffect } from "react";
import { loadMembers } from "./useMembers";
import { loadCurrentUser } from "./useAuth";

const MESSENGER_EVENT = "lov-messenger-updated";
export const OPEN_CHAT_EVENT = "lov-open-messenger-chat";

function getStorageKey() {
  const current = loadCurrentUser();
  return current?.username
    ? `lov_msg_threads_${current.username.toLowerCase()}`
    : "lov_msg_threads_guest";
}

export function loadThreads() {
  try {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }
  return {};
}

export function saveThreads(threads) {
  try {
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify(threads));
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new Event(MESSENGER_EVENT));
}

export function openChatWithMember(usernameOrMember) {
  const username =
    typeof usernameOrMember === "string"
      ? usernameOrMember
      : usernameOrMember?.username || "ovi";

  window.dispatchEvent(
    new CustomEvent(OPEN_CHAT_EVENT, { detail: { username } })
  );
}

export function useMessenger() {
  const [threads, setThreads] = useState(() => loadThreads());
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    const handleSync = () => {
      setThreads(loadThreads());
    };
    window.addEventListener(MESSENGER_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(MESSENGER_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const authUser = loadCurrentUser();
  const myUsername = authUser?.username ? String(authUser.username).toLowerCase() : "";

  // Build contacts list directly from registered studio members, excluding myself
  const allMembers = loadMembers() || [];
  let availableMembers = allMembers.filter(
    (m) => m && m.username && String(m.username).toLowerCase() !== myUsername
  );

  // If user is someone else and Founder is not in availableMembers, ensure Founder is in contacts
  if (myUsername !== "ovi" && !availableMembers.some((m) => m && m.username === "ovi")) {
    const founder = allMembers.find((m) => m && m.username === "ovi");
    if (founder) availableMembers.unshift(founder);
  }

  // Guarantee contacts is never empty so chat widgets never throw on activeContact
  if (availableMembers.length === 0) {
    availableMembers.push({
      id: "lov-support",
      username: "lov_studio",
      displayName: "LOV Studio Team",
      fullName: "LOV Studio Support",
      lovId: "LOV-SYSTEM",
      role: "Studio Support",
      department: "Management",
      avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=lovstudio",
    });
  }

  const contacts = availableMembers.map((member, idx) => {
    const safeUsername = member.username ? String(member.username) : `user_${idx}`;
    const safeDisplayName = member.displayName || member.fullName || safeUsername || "Studio Member";
    const safeFullName = member.fullName || member.displayName || safeUsername || "Studio Member";
    const safeLovId = member.lovId ? String(member.lovId) : "LOV-MEMBER";
    const thread = threads[safeUsername] || { unread: 0, messages: [] };
    const lastMsg =
      thread.messages && thread.messages.length > 0
        ? thread.messages[thread.messages.length - 1]
        : null;
    return {
      ...member,
      id: member.id || safeUsername,
      username: safeUsername,
      displayName: safeDisplayName,
      fullName: safeFullName,
      lovId: safeLovId,
      avatar: member.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(safeUsername)}`,
      online: idx === 0,
      unread: thread.unread || 0,
      lastMessage: lastMsg,
      messages: Array.isArray(thread.messages) ? thread.messages : [],
    };
  });

  const totalUnread = contacts.reduce((sum, c) => sum + (c.unread || 0), 0);

  const markThreadRead = (username) => {
    if (!username) return;
    const current = loadThreads();
    const existing = current[username] || { unread: 0, messages: [] };
    if (!existing.unread) return;
    const updated = {
      ...current,
      [username]: {
        ...existing,
        unread: 0,
      },
    };
    setThreads(updated);
    saveThreads(updated);
  };

  const sendMessage = (username, text, attachment = null) => {
    if (!username || (!text?.trim() && !attachment)) return;
    const current = loadThreads();
    const existing = current[username] || { unread: 0, messages: [] };

    const timeNow = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: text?.trim() || "",
      attachment,
      time: timeNow,
      reaction: null,
      seen: true,
    };

    const updated = {
      ...current,
      [username]: {
        unread: 0,
        messages: [...(existing.messages || []), newMsg],
      },
    };

    setThreads(updated);
    saveThreads(updated);
  };

  const reactToMessage = (username, messageId, emoji) => {
    const current = loadThreads();
    const existing = current[username];
    if (!existing) return;

    const updatedMessages = (existing.messages || []).map((msg) => {
      if (msg.id !== messageId) return msg;
      return {
        ...msg,
        reaction: msg.reaction === emoji ? null : emoji,
      };
    });

    const updated = {
      ...current,
      [username]: {
        ...existing,
        messages: updatedMessages,
      },
    };
    setThreads(updated);
    saveThreads(updated);
  };

  return {
    contacts,
    threads,
    totalUnread,
    typingUser,
    sendMessage,
    reactToMessage,
    markThreadRead,
    openChatWithMember,
  };
}

export default useMessenger;
