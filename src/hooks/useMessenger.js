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
      : usernameOrMember?.username || "zamiul";

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
  const myUsername = authUser?.username?.toLowerCase();

  // Build contacts list directly from registered studio members, excluding myself
  const allMembers = loadMembers();
  let availableMembers = allMembers.filter(
    (m) => m.username && m.username.toLowerCase() !== myUsername
  );

  // If user is someone else and Founder is not in availableMembers, ensure Founder is in contacts
  if (myUsername !== "zamiul" && !availableMembers.some((m) => m.username === "zamiul")) {
    const founder = allMembers.find((m) => m.username === "zamiul");
    if (founder) availableMembers.unshift(founder);
  }

  const contacts = availableMembers.map((member, idx) => {
    const thread = threads[member.username] || { unread: 0, messages: [] };
    const lastMsg =
      thread.messages && thread.messages.length > 0
        ? thread.messages[thread.messages.length - 1]
        : null;
    return {
      ...member,
      online: idx === 0,
      unread: thread.unread || 0,
      lastMessage: lastMsg,
      messages: thread.messages || [],
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
