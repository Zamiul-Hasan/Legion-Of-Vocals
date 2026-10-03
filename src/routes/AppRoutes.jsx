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
import ProtectedRoute from "./ProtectedRoute";

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
      <Route path="/leaderboard" element={<Leaderboard />} />

      {/* ===================== */}
      {/* Member Dashboard (Protected) */}
      {/* ===================== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute redirectAdminToAdminDashboard>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-projects"
        element={
          <ProtectedRoute>
            <MyProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-dub-videos"
        element={
          <ProtectedRoute>
            <MyDubVideos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload-dub"
        element={
          <ProtectedRoute>
            <UploadDub />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rewards"
        element={
          <ProtectedRoute>
            <Rewards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* ===================== */}
      {/* Admin Panel (Admin / Founder Only) */}
      {/* ===================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/members"
        element={
          <ProtectedRoute requireAdmin>
            <Members />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pending-users"
        element={
          <ProtectedRoute requireAdmin>
            <PendingUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute requireAdmin>
            <AdminProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/contests"
        element={
          <ProtectedRoute requireAdmin>
            <AdminContests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dubs"
        element={
          <ProtectedRoute requireAdmin>
            <MyDubVideos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rewards"
        element={
          <ProtectedRoute requireAdmin>
            <Rewards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute requireAdmin>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* ===================== */}
      {/* 404 */}
      {/* ===================== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;