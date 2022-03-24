import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@material-ui/core";
import Api from "../../Services/api";
import moment from "moment";
import { ClipLoader } from "react-spinners";
import { getCurrentUser } from "../../Services/auth";

function Certificate() {
  const [userAccountId, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const [certificationData, setCertificationData] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const getUserCert = async () => {
    Api()
      .get(`/users/get-user-certification/${userAccountId}`)
      .then((response) => {
        setIsReady(true);
        setCertificationData(response?.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getUserCert();
  }, []);

  return (
    <div>
      <Card className="mb-4 pb-5">
        <CardContent className="p-5 pb-5">
          <div className="">
            <p className="profile-headings">
              <b>Certification</b>
            </p>
          </div>
          <hr />
          {!isReady ? (
            <div className="d-flex justify-content-center align-item-center">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          ) : certificationData?.length <= 0 ? (
            <div className="d-flex justify-content-center align-item-center text-center mt-5">
              <p>No certification has been added yet</p>
            </div>
          ) : (
            certificationData?.map((cert, index) => {
              return (
                <>
                  <div key={index} className="row justify-content-between">
                    <div className="col-sm-12 col-md-6 col-lg-7">
                      <div className="skillSet">
                        <p className="profile-headings mobileSpace">
                          <b>{cert?.certificate}</b>
                        </p>
                        <p className="exdivider profile-headings">-</p>
                        <p className="profile-headings mobileSpace">
                          <b>{cert?.issuing_authority}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-5 certificateDate">
                      <div className=" profileResponsive">
                        <p className="profileRes mobileSpace">
                        <span className="eduPeriod" style={{display: "none"}}>From: </span>{moment(`${cert?.issue_date}`).format("Do MMMM YYYY")}
                        </p>
                        <p className="divider profileRes mobileSpace">-</p>
                        {cert?.valid_till == null ? (
                          <p className="profileRes mobileSpace"><span className="eduPeriod" style={{display: "none"}}>To: </span>No expiry </p>
                        ) : (
                          <p className="profileRes mobileSpace">
                            <span className="eduPeriod" style={{display: "none"}}>To: </span>{moment(`${cert?.valid_till}`).format(
                              "Do MMMM YYYY"
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12"><p className="mobileSpace">
                    <a
                        href={ cert?.link?.includes("http") ? cert?.link :  "//" + cert?.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        {cert?.link}
                      </a></p></div>
                  </div>
                  {certificationData?.length === 1 ? `` : <hr />}
                </>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Certificate;
