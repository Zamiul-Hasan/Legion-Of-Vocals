import { useState, useEffect } from "react";
import { loadMembers } from "./useMembers";

const MESSENGER_STORAGE_KEY = "lov_messenger_threads_v2";
const MESSENGER_EVENT = "lov-messenger-updated";
export const OPEN_CHAT_EVENT = "lov-open-messenger-chat";

// Fresh start: Clean production threads and contacts.
// Dynamic contacts are populated directly from real registered members via Supabase Auth & useMembers.
const extraStudioMembers = [];
const initialThreads = {};

export function loadThreads() {
  try {
    const saved = localStorage.getItem(MESSENGER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        return { ...initialThreads, ...parsed };
      }
    }
  } catch {
    // ignore storage errors
  }
  return initialThreads;
}

export function saveThreads(threads) {
  try {
    localStorage.setItem(MESSENGER_STORAGE_KEY, JSON.stringify(threads));
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

  // Build contacts list directly from registered studio members
  const allMembers = loadMembers();
  const contacts = [
    ...allMembers.map((m, idx) => ({
      ...m,
      online: idx === 0, // Founder is active
    })),
    ...extraStudioMembers,
  ].map((member) => {
    const thread = threads[member.username] || { unread: 0, messages: [] };
    const lastMsg =
      thread.messages && thread.messages.length > 0
        ? thread.messages[thread.messages.length - 1]
        : null;
    return {
      ...member,
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
