import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import { useMembers } from "../hooks/useMembers";
import BackButton from "../components/UI/BackButton";

import ProfileBanner from "../components/Team/ProfileBanner";
import ProfileAbout from "../components/Team/ProfileAbout";
import ProfileStats from "../components/Team/ProfileStats";
import ProfileProjects from "../components/Team/ProfileProjects";
import ProfileSkills from "../components/Team/ProfileSkills";
import ProfileAchievements from "../components/Team/ProfileAchievements";
import ProfileSocials from "../components/Team/ProfileSocials";

function MemberProfile() {
  const { username } = useParams();
  const { members } = useMembers();

  const member = members.find(
    (m) =>
      m.username.toLowerCase() === username.toLowerCase() ||
      (m.lovId && m.lovId.toLowerCase() === username.toLowerCase())
  );

  if (!member) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">
            Member Not Found
          </h1>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <ProfileBanner member={member} />

      <ProfileAbout member={member} />

      <ProfileStats member={member} />

      <ProfileProjects member={member} />

      <ProfileSkills member={member} />

      <ProfileAchievements member={member} />

      <ProfileSocials member={member} />

      <Footer />
    </>
  );
}

export default MemberProfile;