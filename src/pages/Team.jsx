import { useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import TeamHero from "../components/Team/TeamHero";
import TeamStats from "../components/Team/TeamStats";
import DepartmentFilter from "../components/Team/DepartmentFilter";
import MemberSearch from "../components/Team/MemberSearch";
import MemberGrid from "../components/Team/MemberGrid";

import { useMembers } from "../hooks/useMembers";

function Team() {
  const { members } = useMembers();
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter((member) => {
    const departmentMatch =
      selectedDepartment === "All" ||
      member.department === selectedDepartment;

    const keyword = search.toLowerCase().trim();
    const searchMatch =
      member.fullName.toLowerCase().includes(keyword) ||
      member.displayName.toLowerCase().includes(keyword) ||
      member.username.toLowerCase().includes(keyword) ||
      member.role.toLowerCase().includes(keyword) ||
      (member.lovId && member.lovId.toLowerCase().includes(keyword)) ||
      (member.email && member.email.toLowerCase().includes(keyword));

    return departmentMatch && searchMatch;
  });

  return (
    <>
      <Navbar />

      <TeamHero />

      <TeamStats members={members} />

      <DepartmentFilter
        selected={selectedDepartment}
        onChange={setSelectedDepartment}
      />

      <MemberSearch
        value={search}
        onChange={setSearch}
      />

      <MemberGrid members={filteredMembers} />

      <Footer />
    </>
  );
}

export default Team;