import React, { useState, useEffect } from "react";
import { Card, CardContent} from "@material-ui/core";
import Api from "../../Services/api";
import { getCurrentUser } from "../../Services/auth";
import { ClipLoader } from "react-spinners";
import { SkillLevelGroup} from "./SkillsDisplay"
import { getSkillIndustryType } from "../../Services/redux/skills/index";
import { useDispatch, useSelector } from "react-redux";




export default function Skills() {
  const dispatch = useDispatch();
  const [userAccountId, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const [skillsData, setSkillsData] = useState();
  const [isReady, setIsReady] = useState(false);
  const [GCATest, setGCATest] = useState([]);

  const getIndustryType = async () => {
    await dispatch(getSkillIndustryType(userAccountId))
      .then((response) => {
        setGCATest(response?.payload?.data?.GCAs);
      })
      .catch((error) => {});
  };

  const getUserSkills = async () => {
    Api()
      .get(`/users/get-user-skills/${userAccountId}`)
      .then((response) => {
        setIsReady(true);
        setSkillsData(response?.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getUserSkills();
    getIndustryType();
  }, []);

  return (
    <div>
      <Card className="mb-4 pb-2">
        <CardContent className="p-5 pb-5">
          <div>
            <p className="profile-headings">
              <b>Skills</b>
            </p>
          </div>
          <hr />
          <div></div>
          {!isReady ? (
            <div className="d-flex justify-content-center align-item-center">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          ) : skillsData?.length <= 0 ? (
            <div className="d-flex justify-content-center align-item-center text-center mt-5">
              <p>No skill has been added yet</p>
            </div>
          ) : (
            <>
              <div 
              >
                {(Boolean(
                  GCATest?.find((test) => {
                    return test?.proficiency === "Expert";
                  })
                ) ||
                  Boolean(
                    skillsData?.find((test) => {
                      return test?.proficiency === "Expert";
                    })
                  )) && 
                  <div className="row mb-3 pt-2">
                    <div className="col-6 col-sm-3 col-md-2 skill-level">Expert</div>
                    <div className="col-12 col-sm-9 col-md-10">
                    <SkillLevelGroup GCATest={GCATest} skillsData={skillsData} proficiency="Expert"/>
                  
                    </div>
                  </div>
                  }

                {(Boolean(
                  GCATest?.find((test) => {
                    return test?.proficiency === "Intermediate";
                  })
                ) ||
                  Boolean(
                    skillsData?.find((test) => {
                      return test?.proficiency === "Intermediate";
                    })
                  )) && 
                  <div className="row mb-3">
                    <div className="col-6 col-sm-3 col-md-2 skill-level">Intermediate</div>
                    <div className="col-12 col-sm-9 col-md-10">
                    <SkillLevelGroup GCATest={GCATest} skillsData={skillsData} proficiency="Intermediate"/>
                  
                    </div>
                  </div>
                  }

                {(Boolean(
                  GCATest?.find((test) => {
                    return test?.proficiency === "Beginner";
                  })
                ) ||
                  Boolean(
                    skillsData?.find((test) => {
                      return test?.proficiency === "Beginner";
                    })
                  )) && 
                  <div className="row">
                    <div className="col-6 col-sm-3 col-md-2 skill-level">Beginner</div>
                    <div className="col-12 col-sm-9 col-md-10">
                    <SkillLevelGroup GCATest={GCATest} skillsData={skillsData} proficiency="Beginner"/>
                  
                    </div>
                  </div>
                  }
     
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

