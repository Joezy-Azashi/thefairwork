import React, { useState, useEffect } from "react";
import Education from "../../Components/Profile/Education";
import Skills from "../../Components/Profile/Skills";
import SkillTag from "../../Components/Profile/SkillTag";
import Experience from "../../Components/Profile/Experience";
import Certificate from "../../Components/Profile/Certificate";
import Portfolio from "../../Components/Profile/Portfolio";
import Profile from "../../Components/Profile/Profile";
import { Button } from "@mui/material";
import ProfileCompletion from "../../Components/Profile/ProfileCompletion";
import { freelancerRole, adminRole } from "../../Services/userTypes";
import { useHistory } from "react-router-dom";
import { getCurrentUser } from "../../Services/auth";
import Api from "../../Services/api";
import { useLocation } from "react-router";
import ViewDocumentOnPlatform from "../../Components/ViewDocumentOnPlatform";

function EditProfile() {
  const history = useHistory();
  const [documentURL, setDocumentURL] = useState("");
  const [portfolioURL, setPortfolioURL] = useState("");
  const [viewDocument, setViewDocument] = useState(false);
  const [viewPortfolio, setViewPortfolio] = useState(false);
  const location = useLocation();
  const [viewResume, setViewResume] = useState(false);
  const [viewProfile, setstate] = useState(localStorage.getItem("fromCandi"));
  const [id, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const [userProfile, setUserProfile] = useState([]);
  const getProfileData = async () => {
    Api()
      .get(`/users/get-user-profile/${id}`)
      .then((response) => {
        setUserProfile(response?.data?.user);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getProfileData();
  }, []);

  const handleclick = () => {
    history.push("/edit-profile", {
      params: localStorage.setItem("userDetails", JSON.stringify(userProfile)),
      params1: "client",
    });
  };

  const handleDocumentDisplay = (url) => {
    setDocumentURL(url);
    return url;
  };

  const handlePortfolioDisplay = (url) => {
    setPortfolioURL(url);
    return url;
  };

  const scrollDown = ()=>{
    window.scrollTo(
          0,
          document.body.scrollHeight ||
            document.documentElement.scrollHeight ||
            document.scrollingElement.scrollHeight
        )
  };

  return (
    <div
      style={{
        marginBottom: "50px",
      }}
    >
      <div className="row justify-content-between mb-4 ">
        <div className="col-md-6 pageTitle">
          <h6 className="mt-3">
            <b>Profile Details</b>
          </h6>
        </div>
        {freelancerRole() || viewProfile === "Candi" ? (
          ""
        ) : (
          <div className="col-md-6 d-flex justify-content-end">
            <div className="d-flex">
              <Button
                variant="contained"
                fullWidth
                style={{ color: "white", background: "#2E405B" }}
                onClick={() => {
                  handleclick();
                }}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </div>

      {freelancerRole() ? <ProfileCompletion /> : ""}

      <Profile
        viewDocument={viewDocument}
        setViewDocument={setViewDocument}
        handleDocumentDisplay={handleDocumentDisplay}
        viewResume={viewResume}
        setViewResume={setViewResume}
      />

      {location?.state?.params === "client" &&
      userProfile?.accountTypeId != 2 ? (
        ""
      ) : freelancerRole() || adminRole() || viewProfile === "Candi" ? (
        <>
          <ViewDocumentOnPlatform url={documentURL} viewResume={viewResume} />

          <Education />

          <Skills />

          <SkillTag />

          <Experience />

          <Certificate />

          <Portfolio
            viewDocument={viewDocument}
            setViewDocument={setViewDocument}
            handlePortfolioDisplay={handlePortfolioDisplay}
            viewPortfolio={viewPortfolio}
            setViewPortfolio={setViewPortfolio}
            scrollDown={scrollDown}
          />

          <ViewDocumentOnPlatform
            url={portfolioURL}
            viewResume={viewPortfolio}
          />
        </>
      ) : (
        ``
      )}
    </div>
  );
}

export default EditProfile;
