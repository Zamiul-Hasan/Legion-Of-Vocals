import { useState, useEffect } from "react";

export const defaultNotifications = [
  {
    id: 1,
    category: "System",
    title: "Welcome to Legion of Vocals Production Portal",
    message:
      "Your Legion of Vocals creator profile is active with ID LOV-2026-0001. Live registrations are open!",
    time: "Just now",
    unread: true,
    link: "/team/zamiul",
  },
];

const STORAGE_KEY = "lov_notifications_v2";
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
