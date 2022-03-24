import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@material-ui/core";
import { getCurrentUser } from "../../Services/auth";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { getTag } from "../../Services/redux/skillTag/index";

export default function SkillsTag() {
  const dispatch = useDispatch();
  const [userAccountId, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );

  const [skillsData, setSkillsData] = useState();
  const [isReady, setIsReady] = useState(false);

  const getUserTags = async () => {
    await dispatch(getTag(userAccountId))
      .then((response) => {
        setSkillsData(response.payload.data);
      })
      .catch((error) => {});
    setIsReady(true);
  };

  useEffect(() => {
    getUserTags();
  }, []);

  return (
    <div>
      <Card className="mb-4 pb-5">
        <CardContent className="p-5 pb-5">
          <div>
            <p className="profile-headings">
              <b>Skill Tags</b>
            </p>
          </div>
          <hr />
          {!isReady ? (
            <div className="d-flex justify-content-center align-item-center">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          ) : skillsData?.length <= 0 ? (
            <div className="d-flex justify-content-center align-item-center text-center mt-5">
              <p>No skill tag has been added yet</p>
            </div>
          ) : (
            <>
              {skillsData?.map((skills, index) => {
                return (
                  <>
                  
                    <p key={index} className="badge job-badge">
                      <b>#{skills?.name?.replace("&amp;", "&")}</b>
                    </p>
                  </>
                );
              })}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
