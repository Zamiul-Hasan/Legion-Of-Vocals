import { useState, useEffect } from "react";
import { loadMembers } from "./useMembers";
import defaultLogo from "../assets/images/logos/logo.png";

const MESSENGER_STORAGE_KEY = "lov_messenger_threads_v1";
const MESSENGER_EVENT = "lov-messenger-updated";
export const OPEN_CHAT_EVENT = "lov-open-messenger-chat";

const extraStudioMembers = [
  {
    id: 4,
    lovId: "LOV-100004",
    username: "tanvir_va",
    fullName: "Tanvir Rahman",
    displayName: "Tanvir",
    role: "Senior VA",
    department: "Voice Acting",
    avatar: defaultLogo,
    online: true,
  },
  {
    id: 5,
    lovId: "LOV-100005",
    username: "nafis_sfx",
    fullName: "Nafis Karin",
    displayName: "Nafis",
    role: "Audio Lead",
    department: "Sound Engineering",
    avatar: defaultLogo,
    online: true,
  },
  {
    id: 6,
    lovId: "LOV-100006",
    username: "sadia_trans",
    fullName: "Sadia Islam",
    displayName: "Sadia",
    role: "Translator",
    department: "Translation",
    avatar: defaultLogo,
    online: false,
  },
];

const initialThreads = {
  voiceactor01: {
    unread: 1,
    messages: [
      {
        id: 101,
        sender: "them",
        text: "Hey Zamiul bhai! Just finished recording my lines for Solo Leveling Ep 2.",
        time: "10:24 AM",
        reaction: "🔥",
      },
      {
        id: 102,
        sender: "me",
        text: "Awesome work! Did you upload the 48kHz WAV stem to the portal?",
        time: "10:26 AM",
        reaction: "👍",
      },
      {
        id: 103,
        sender: "them",
        text: "Yes! Uploaded and ready for QA review. Let me know how the emotional take sounds! 🎙️",
        time: "10:28 AM",
        reaction: null,
      },
    ],
  },
  editor01: {
    unread: 1,
    messages: [
      {
        id: 201,
        sender: "them",
        text: "Lip-sync and Bangla on-screen typesetting for Demon Slayer Ep 3 is 100% rendered!",
        time: "Yesterday",
        reaction: "❤️",
      },
    ],
  },
  tanvir_va: {
    unread: 0,
    messages: [
      {
        id: 301,
        sender: "me",
        text: "Welcome to the Blue Lock casting session, Tanvir!",
        time: "Mon",
        reaction: "🔥",
      },
      {
        id: 302,
        sender: "them",
        text: "Hyped to voice Isagi in Bangla! Ready whenever the script drops.",
        time: "Mon",
        reaction: null,
      },
    ],
  },
  nafis_sfx: {
    unread: 0,
    messages: [
      {
        id: 401,
        sender: "them",
        text: "Mastered the OST + SFX balance for the trailer. Zero clipping at -14 LUFS.",
        time: "Sun",
        reaction: "👏",
      },
    ],
  },
  sadia_trans: {
    unread: 0,
    messages: [
      {
        id: 501,
        sender: "them",
        text: "Translated lines 1–140 for the upcoming episode with syllable timing notes!",
        time: "Sat",
        reaction: "❤️",
      },
    ],
  },
};

const autoReplies = [
  "Got it! I'll check the dub script and update the studio tracker right away. 🎙️",
  "Sounds great! Let's sync up in the LOV recording booth tonight. 🔥",
  "Thanks! I just uploaded the latest vocal stem take—let me know what you think!",
  "Roger that! Working on the Bangla dialogue timing now. 🎬",
  "Awesome! Appreciate the feedback—Legion of Vocals all the way! 🚀",
];

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
      : usernameOrMember?.username || "voiceactor01";

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

  // Build unified contacts list from useMembers + extraStudioMembers
  const allMembers = loadMembers();
  const contacts = [
    ...allMembers.map((m, idx) => ({
      ...m,
      online: idx < 2,
    })),
    ...extraStudioMembers.filter(
      (ex) =>
        !allMembers.some(
          (m) => m.username.toLowerCase() === ex.username.toLowerCase()
        )
    ),
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

    // Simulate realistic Messenger typing & studio reply if messaging another member
    if (username !== "zamiul") {
      setTypingUser(username);
      setTimeout(() => {
        const latest = loadThreads();
        const threadNow = latest[username] || { unread: 0, messages: [] };
        const replyText =
          autoReplies[Math.floor(Math.random() * autoReplies.length)];
        const replyMsg = {
          id: Date.now() + 1,
          sender: "them",
          text: replyText,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          reaction: null,
        };
        const withReply = {
          ...latest,
          [username]: {
            unread: 0,
            messages: [...(threadNow.messages || []), replyMsg],
          },
        };
        setTypingUser(null);
        setThreads(withReply);
        saveThreads(withReply);
      }, 1500);
    }
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
