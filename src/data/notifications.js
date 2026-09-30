import { useState, useEffect } from "react";

export const defaultNotifications = [
  {
    id: 1,
    category: "Projects",
    title: "New Dubbing Script Assigned: Solo Leveling Ep. 2",
    message:
      "You have been assigned lines 42–68 for Sung Jinwoo. Deadline is 05 October 2026.",
    time: "15 minutes ago",
    unread: true,
    link: "/my-projects",
  },
  {
    id: 2,
    category: "Points",
    title: "+180 Contribution Points Awarded!",
    message:
      "Your final audio mix for Demon Slayer Episode 3 was approved by the QA team.",
    time: "2 hours ago",
    unread: true,
    link: "/rewards",
  },
  {
    id: 3,
    category: "Announcements",
    title: "🎙️ Voice Actor Recruitment Open for Blue Lock",
    message:
      "Casting calls for Ego Jinpachi, Bachira, and Kunigami are now live in the studio channel.",
    time: "Yesterday",
    unread: true,
    link: "/projects/3",
  },
  {
    id: 4,
    category: "System",
    title: "Profile & LOV ID Verified (LOV-100001)",
    message:
      "Your Legion of Vocals creator profile and email are verified on the public Team directory.",
    time: "3 days ago",
    unread: false,
    link: "/team/zamiul",
  },
];

const STORAGE_KEY = "lov_notifications";
const EVENT_NAME = "lov-notifications-updated";

export function loadNotifications() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore storage errors
  }
  return defaultNotifications;
}

export function saveNotifications(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function useNotifications() {
  const [notifications, setNotifications] = useState(() => loadNotifications());

  useEffect(() => {
    const handleSync = () => {
      setNotifications(loadNotifications());
    };

    window.addEventListener(EVENT_NAME, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(EVENT_NAME, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, unread: false }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const markRead = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, unread: false } : n
    );
    setNotifications(updated);
    saveNotifications(updated);
  };

  const toggleRead = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, unread: !n.unread } : n
    );
    setNotifications(updated);
    saveNotifications(updated);
  };

  const removeNotification = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    saveNotifications(updated);
  };

  const resetNotifications = () => {
    setNotifications(defaultNotifications);
    saveNotifications(defaultNotifications);
  };

  return {
    notifications,
    unreadCount,
    markAllRead,
    markRead,
    toggleRead,
    removeNotification,
    resetNotifications,
  };
}
