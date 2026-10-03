import { useState, useEffect } from "react";
import defaultProjects, { bannerPresets } from "../data/projects";
import { loadNotifications, saveNotifications } from "../data/notifications";

const STORAGE_KEY = "lov_projects";
const EVENT_NAME = "lov-projects-updated";

export function loadProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }
  return defaultProjects;
}

export function saveProjects(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function useProjects() {
  const [projects, setProjects] = useState(() => loadProjects());

  useEffect(() => {
    const handleSync = () => {
      setProjects(loadProjects());
    };
    window.addEventListener(EVENT_NAME, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(EVENT_NAME, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const createProject = (projectData) => {
    const current = loadProjects();
    const newId =
      current.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;

    const chosenBanner =
      projectData.banner ||
      projectData.image ||
      bannerPresets[0]?.url ||
      defaultProjects[0]?.image;

    const newProject = {
      id: newId,
      title: projectData.title,
      status: projectData.status || "Ongoing",
      description:
        projectData.description || "Bangla Dub by Legion of Vocals.",
      image: chosenBanner,
      banner: chosenBanner,
      category: projectData.category || "Anime",
      episodes: projectData.episodes || 12,
      director: projectData.director || "MD Zamiul Hasan (Founder)",
      createdByRole: projectData.createdByRole || "Founder & Admin",
      progress:
        projectData.progress !== undefined ? Number(projectData.progress) : 15,
      releaseDate: projectData.releaseDate || "Coming Soon",
      dubVideos: [],
      contributors: [1],
    };

    const updated = [newProject, ...current];
    setProjects(updated);
    saveProjects(updated);

    // Also broadcast a notification for all members
    const currentNotifs = loadNotifications();
    saveNotifications([
      {
        id: Date.now(),
        category: "Projects",
        title: `🎬 New Project Launched: ${newProject.title}`,
        message: `${newProject.director} launched "${newProject.title}" (${newProject.status} • ${newProject.releaseDate}).`,
        time: "Just now",
        unread: true,
        link: `/projects/${newProject.id}`,
      },
      ...currentNotifs,
    ]);

    return newProject;
  };

  const updateProject = (idOrObj, maybeData) => {
    const targetId =
      typeof idOrObj === "object" && idOrObj !== null ? idOrObj.id : idOrObj;
    const patch =
      typeof idOrObj === "object" && idOrObj !== null ? idOrObj : maybeData;

    const current = loadProjects();
    const updated = current.map((p) => {
      if (Number(p.id) !== Number(targetId)) return p;
      const nextBanner = patch.banner || patch.image || p.banner || p.image;
      return {
        ...p,
        ...patch,
        image: nextBanner,
        banner: nextBanner,
      };
    });
    setProjects(updated);
    saveProjects(updated);
  };

  const deleteProject = (id) => {
    const current = loadProjects();
    const updated = current.filter((p) => Number(p.id) !== Number(id));
    setProjects(updated);
    saveProjects(updated);
  };

  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
  };
}

export default useProjects;
