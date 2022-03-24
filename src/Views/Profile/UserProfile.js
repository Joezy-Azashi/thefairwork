import React, { useState, useEffect } from "react";
import {
  recruiterRole,
  localRecruiterRole,
  adminRole,
} from "../../Services/userTypes";
import { loadCSS } from "fg-loadcss";
import ProfileEducation from "../../Components/EditProfile/ProfileEducation";
import ProfileSkills from "../../Components/EditProfile/ProfileSkills";
import ProfileExperience from "../../Components/EditProfile/ProfileExperience";
import ProfileCertificate from "../../Components/EditProfile/ProfileCertificate";
import ProfilePortfolio from "../../Components/EditProfile/ProfilePortfolio";
import ProfileDetails from "../../Components/EditProfile/ProfileDetails";
import AddSkillTag from "../../Components/SkillTag/AddSkillTag";
import { useLocation } from "react-router";

function UserProfile() {
  const location = useLocation();

  const [picture, setPicture] = useState(
    JSON.parse(localStorage.getItem("picture"))
  );

  const [profileData, setProfileData] = useState(
    JSON.parse(localStorage.getItem("userDetails"))
  );

  useEffect(() => {
    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);

  return (
    <div>
      <ProfileDetails />

      {recruiterRole() ||
      localRecruiterRole() ||
      (location.state.params1 === "client" &&
        profileData?.accountTypeId != 2) ? (
        ``
      ) : (
        <>
          <ProfileEducation />

          <ProfileSkills />

          <AddSkillTag />

          <ProfileExperience />

          <ProfileCertificate />

          <ProfilePortfolio picture={picture} />
        </>
      )}
    </div>
  );
}

export default UserProfile;
