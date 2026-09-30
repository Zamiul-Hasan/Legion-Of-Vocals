import { useState, useEffect } from "react";
import initialDubVideos from "../data/dubVideos";
import { loadNotifications, saveNotifications } from "../data/notifications";

const DUBS_STORAGE_KEY = "lov_dub_videos";
const LEGACY_UPLOAD_KEY = "uploadedDubs";
const DUBS_EVENT = "lov-dubs-updated";

export const REACTION_TYPES = [
  { id: "like", label: "Like", emoji: "👍", color: "text-cyan-400" },
  { id: "love", label: "Love", emoji: "❤️", color: "text-rose-400" },
  { id: "fire", label: "Fire", emoji: "🔥", color: "text-amber-400" },
  { id: "wow", label: "Wow", emoji: "😮", color: "text-yellow-300" },
  { id: "haha", label: "Haha", emoji: "😂", color: "text-yellow-400" },
  { id: "clap", label: "Bravo", emoji: "👏", color: "text-emerald-400" },
];

function normalizeVideo(v) {
  const baseLikes = Number(v.likes) || 0;
  const defaultBreakdown = {
    love: Math.max(1, Math.floor(baseLikes * 0.5)),
    fire: Math.max(0, Math.floor(baseLikes * 0.3)),
    like: Math.max(
      0,
      baseLikes -
        Math.floor(baseLikes * 0.5) -
        Math.floor(baseLikes * 0.3)
    ),
    wow: 0,
    haha: 0,
    clap: 0,
  };

  return {
    ...v,
    status:
      v.title === "Coming Soon" ? "Coming Soon" : v.status || "Published",
    likes: baseLikes,
    myReaction: v.myReaction || (v.likedByMe ? "love" : null),
    likedByMe: Boolean(v.myReaction || v.likedByMe),
    reactions: v.reactions || defaultBreakdown,
    shares: v.shares ?? Math.max(4, Math.floor((baseLikes || 16) / 5)),
  };
}

export function loadDubVideos() {
  try {
    const savedRaw = localStorage.getItem(DUBS_STORAGE_KEY);
    const legacyRaw = localStorage.getItem(LEGACY_UPLOAD_KEY);
    const legacyList = legacyRaw ? JSON.parse(legacyRaw) : [];

    if (savedRaw) {
      const savedList = JSON.parse(savedRaw);
      if (Array.isArray(savedList) && savedList.length > 0) {
        const extraLegacy = legacyList.filter(
          (l) => !savedList.some((s) => Number(s.id) === Number(l.id))
        );
        return [...extraLegacy, ...savedList].map(normalizeVideo);
      }
    }

    const combined = [
      ...legacyList,
      ...initialDubVideos.filter(
        (init) => !legacyList.some((l) => Number(l.id) === Number(init.id))
      ),
    ];

    return combined.map(normalizeVideo);
  } catch {
    return initialDubVideos.map(normalizeVideo);
  }
}

export function saveDubVideos(list) {
  try {
    localStorage.setItem(DUBS_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new Event(DUBS_EVENT));
}

export function useDubVideos() {
  const [videos, setVideos] = useState(() => loadDubVideos());

  useEffect(() => {
    const handleSync = () => {
      setVideos(loadDubVideos());
    };
    window.addEventListener(DUBS_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(DUBS_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const reactToVideo = (videoId, reactionType = "love") => {
    const current = loadDubVideos();
    const updated = current.map((v) => {
      if (Number(v.id) !== Number(videoId)) return v;

      const prevReaction = v.myReaction;
      const breakdown = { ...(v.reactions || {}) };
      let nextLikes = Number(v.likes) || 0;
      let nextReaction = reactionType;

      if (prevReaction === reactionType) {
        // Clicking the same reaction toggles it off
        nextReaction = null;
        nextLikes = Math.max(0, nextLikes - 1);
        if (breakdown[prevReaction] > 0) {
          breakdown[prevReaction] -= 1;
        }
      } else {
        if (prevReaction) {
          // Switching from one reaction to another
          if (breakdown[prevReaction] > 0) {
            breakdown[prevReaction] -= 1;
          }
        } else {
          // Adding a brand new reaction
          nextLikes += 1;
        }
        breakdown[reactionType] = (breakdown[reactionType] || 0) + 1;
      }

      return {
        ...v,
        myReaction: nextReaction,
        likedByMe: Boolean(nextReaction),
        likes: nextLikes,
        reactions: breakdown,
      };
    });

    setVideos(updated);
    saveDubVideos(updated);
  };

  const toggleLike = (videoId) => {
    const current = loadDubVideos();
    const target = current.find((v) => Number(v.id) === Number(videoId));
    if (!target) return;
    // If already reacted, toggle off; otherwise default to "love"
    reactToVideo(videoId, target.myReaction || "love");
  };

  const incrementShare = (videoId, platform = "Social Media") => {
    const current = loadDubVideos();
    let sharedVideo = null;
    const updated = current.map((v) => {
      if (Number(v.id) !== Number(videoId)) return v;
      sharedVideo = {
        ...v,
        shares: (Number(v.shares) || 0) + 1,
      };
      return sharedVideo;
    });
    setVideos(updated);
    saveDubVideos(updated);

    if (sharedVideo) {
      const notifs = loadNotifications();
      saveNotifications([
        {
          id: Date.now(),
          category: "Projects",
          title: `🔗 Shared "${sharedVideo.title}"`,
          message: `Published dub video was shared via ${platform}. Total shares: ${sharedVideo.shares}.`,
          time: "Just now",
          unread: true,
          link: `/projects/${sharedVideo.projectId}`,
        },
        ...notifs,
      ]);
    }
  };

  const publishVideo = (videoId) => {
    const current = loadDubVideos();
    let publishedVideo = null;
    const updated = current.map((v) => {
      if (Number(v.id) !== Number(videoId)) return v;
      publishedVideo = {
        ...v,
        status: "Published",
      };
      return publishedVideo;
    });
    setVideos(updated);
    saveDubVideos(updated);

    if (publishedVideo) {
      const notifs = loadNotifications();
      saveNotifications([
        {
          id: Date.now(),
          category: "Projects",
          title: `🎬 Dub Published: ${publishedVideo.title}`,
          message: `"${publishedVideo.title}" is now live and ready to share across Facebook & YouTube!`,
          time: "Just now",
          unread: true,
          link: `/projects/${publishedVideo.projectId}`,
        },
        ...notifs,
      ]);
    }
  };

  const deleteVideo = (videoId) => {
    const current = loadDubVideos();
    const updated = current.filter((v) => Number(v.id) !== Number(videoId));
    setVideos(updated);
    saveDubVideos(updated);

    try {
      const savedLegacy = localStorage.getItem(LEGACY_UPLOAD_KEY);
      if (savedLegacy) {
        const filteredLegacy = JSON.parse(savedLegacy).filter(
          (v) => Number(v.id) !== Number(videoId)
        );
        localStorage.setItem(LEGACY_UPLOAD_KEY, JSON.stringify(filteredLegacy));
      }
    } catch {
      // ignore
    }
  };

  return {
    videos,
    reactToVideo,
    toggleLike,
    incrementShare,
    publishVideo,
    deleteVideo,
  };
}

export default useDubVideos;
