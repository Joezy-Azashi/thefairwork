import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@material-ui/core";
import moment from "moment";
import { ClipLoader } from "react-spinners";
import { getCurrentUser } from "../../Services/auth";
import { useDispatch } from "react-redux";
import { getUserEducation } from "../../Services/redux/education/index";

function Education() {
  const dispatch = useDispatch();
  const [userAccountId, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const [educationData, setEducationData] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const getEducations = async () => {
    await dispatch(getUserEducation(userAccountId))
      .then((response) => {
        setIsReady(true);
        setEducationData(response?.payload?.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getEducations();
  }, []);

  return (
    <div>
      <Card className="mb-4 pb-5">
        <CardContent className="p-5 pb-5">
          <div>
            <p className="profile-headings">
              <b>Education</b>
            </p>
          </div>
          <hr />
          {!isReady ? (
            <div className="d-flex justify-content-center align-item-center">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          ) : educationData?.length <= 0 ? (
            <div className="d-flex justify-content-center align-item-center text-center mt-5">
              <p>No education has been added yet</p>
            </div>
          ) : (
            educationData?.map((edu, index) => {
              return (
                <>
                  <div key={index} className="row justify-content-between">
                    <div className="col-sm-12 col-md-6 col-lg-7">
                      <p className="profile-headings mobileSpace">
                        <b>{edu?.institute_name} </b>
                      </p>
                      <div className="d-flex">
                        <p className="mr-2 mobileSpace">{edu?.levelOfEducation} in {edu?.degree_title}</p>
                      </div>
                      <div className="d-flex">
                        <p className="eduPeriod">
                          {edu?.gradeType === "System" ? "" : edu?.gradeType}{" "}
                          {edu?.grade || edu?.overall ? "-" : ""}&nbsp;
                        </p>
                        <p className="mobileSpace">
                          {edu?.grade} {edu?.overall && edu?.grade ? "/ " : ""}
                          {edu?.overall}
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-5 certificateDate">
                      <div className="profileResponsive">
                        <p className="mr-2 profileRes mobileSpace">
                          {" "}
                          <span
                            className="eduPeriod"
                            style={{ display: "none" }}
                          >
                            From:{" "}
                          </span>{" "}
                          {moment(`${edu?.start_date}`).format("Do MMMM YYYY")}
                        </p>

                        <p className="divider profileRes">-</p>
                        <p className="profileRes mobileSpace">
                          {" "}
                          <span
                            className="eduPeriod"
                            style={{ display: "none" }}
                          >
                            To:{" "}
                          </span>
                          {moment(`${edu?.end_date}`).format("Do MMMM YYYY")}
                        </p>
                      </div>
                    </div>
                  </div>
                  {educationData?.length === 1 ? `` : <hr />}
                </>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Education;
