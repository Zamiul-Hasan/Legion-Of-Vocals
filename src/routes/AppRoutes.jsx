import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Projects from "../pages/Projects";
import ProjectDetails from "../pages/ProjectDetails";
import Contests from "../pages/Contests";
import Team from "../pages/Team";
import MemberProfile from "../pages/MemberProfile";
import Gallery from "../pages/Gallery";
import Contact from "../pages/Contact";
import JoinLOV from "../pages/JoinLOV";

import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import AdminProjects from "../pages/AdminProjects";
import AdminContests from "../pages/AdminContests";
import Members from "../pages/Members";
import PendingUsers from "../pages/PendingUsers";

import MyProjects from "../pages/MyProjects";
import MyDubVideos from "../pages/MyDubVideos";
import UploadDub from "../pages/UploadDub";
import Messages from "../pages/Messages";
import Notifications from "../pages/Notifications";
import Rewards from "../pages/Rewards";
import Leaderboard from "../pages/Leaderboard";
import Settings from "../pages/Settings";

import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      {/* ===================== */}
      {/* Public Routes */}
      {/* ===================== */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
      <Route path="/contests" element={<Contests />} />
      <Route path="/team" element={<Team />} />
      <Route path="/team/:username" element={<MemberProfile />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/join" element={<JoinLOV />} />

      {/* ===================== */}
      {/* Member Dashboard */}
      {/* ===================== */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/my-projects" element={<MyProjects />} />
      <Route path="/my-dub-videos" element={<MyDubVideos />} />
      <Route path="/upload-dub" element={<UploadDub />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/settings" element={<Settings />} />

      {/* ===================== */}
      {/* Admin Panel */}
      {/* ===================== */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/members" element={<Members />} />
      <Route path="/admin/pending-users" element={<PendingUsers />} />
      <Route path="/admin/projects" element={<AdminProjects />} />
      <Route path="/admin/contests" element={<AdminContests />} />
      <Route path="/admin/dubs" element={<MyDubVideos />} />
      <Route path="/admin/rewards" element={<Rewards />} />
      <Route path="/admin/settings" element={<Settings />} />

      {/* ===================== */}
      {/* 404 */}
      {/* ===================== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;