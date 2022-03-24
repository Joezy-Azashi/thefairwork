import React, { useState, useEffect } from "react";
import { Card, CardContent} from "@material-ui/core";
import Api from "../../Services/api";
import ReactHtmlParser from "react-html-parser";
import moment from "moment";
import { ClipLoader } from "react-spinners";
import { getCurrentUser } from "../../Services/auth";
function Experience() {
  const [userAccountId, setId] = useState((localStorage.getItem('userId')) ? (localStorage.getItem('userId')) : getCurrentUser()?.user?.id);
  const [experienceData, setExperienceData] = useState([]);
  const [isReady, setIsReady] = useState(false);


  //function to get user experience information
  const getUserExp = async () => {
    Api()
      .get(`/users/get-user-experience/${userAccountId}`)
      .then((response) => {
        setIsReady(true)
        setExperienceData(response?.data)
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getUserExp();
  }, []);

  return (
    <div>
      <Card className="mb-4 pb-5">
        <CardContent className="p-5 pb-5">
          <div>
            <p className="profile-headings">
              <b>Experience</b>
            </p>
          </div>
          <hr />
          {!isReady ? (
            <div className="d-flex justify-content-center align-item-center">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          ) : experienceData?.length <=0 ? (
            <div className="d-flex justify-content-center align-item-center text-center mt-5">
              <p>No experience has been added yet</p>
            </div>
          ) : (
            experienceData?.map((exp, index) => {
              return (
                <>
                  <div key={index} className="row justify-content-between">
                    <div className="col-sm-12 col-md-6 col-lg-7">
                      <div className="skillSet">
                        <p className="profile-headings mobileSpace">
                        <span className="eduPeriod" style={{display: "none"}}><b>Position: </b></span> <b>{exp?.position}</b>
                        </p>
                        <p className="exdivider">-</p>
                        <p className="profile-headings mobileSpace">
                        <span className="eduPeriod" style={{display: "none"}}><b>Company: </b></span><b>{ReactHtmlParser(exp?.company)}</b>
                        </p>
                      </div>
                      <div className="row">
                        <div className="col-md-6 d-flex">
                          {exp?.city && exp?.Country?.name ? (
                            <p className="mr-2 mobileSpace">
                              {exp?.city}, {exp?.Country?.name}
                            </p>
                          ) : exp?.city ? (
                            <p className="mr-2 mobileSpace">{exp?.city}</p>
                          ) : exp?.Country?.name ? (
                            <p className="mr-2 mobileSpace">{exp?.Country?.name}</p>
                          ) : null}

                        
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-5 certificateDate">
                    <div className=" profileResponsive">
                    <p className="mr-2 profileRes mobileSpace"><span className="eduPeriod" style={{display: "none"}}>From: </span>{moment(`${exp?.from}`).format("Do MMMM YYYY")}</p>
                          <p className="divider profileRes">-</p>
                          <p className="profileRes"><span className="eduPeriod" style={{display: "none"}}>To: </span>{moment(`${exp?.to}`).format("Do MMMM YYYY")}</p>
                    </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12"><p>{ReactHtmlParser(exp?.responsibilities)}</p></div>
                  </div>
                  {
                      experienceData?.length === 1 ? (
                        ``
                      ) :   <hr />
                  }
                
                </>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Experience;
