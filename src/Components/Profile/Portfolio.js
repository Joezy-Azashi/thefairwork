import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@material-ui/core";
import Api from "../../Services/api";
import { ClipLoader } from "react-spinners";
import { getCurrentUser } from "../../Services/auth";
import Visibility from "@material-ui/icons/Visibility";

function Portfolio({
  viewPortfolio,
  setViewPortfolio,
  handlePortfolioDisplay,
  scrollDown,
}) {
  const [userAccountId, setId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const [isReady, setIsReady] = useState(false);
  const [portfolio, setportfolio] = useState([]);

  const getUserPort = async () => {
    Api()
      .get(`/users/get-user-portfolio/${userAccountId}`)
      .then((response) => {
        setIsReady(true);
        setportfolio(response?.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getUserPort();
  }, []);

  return (
    <div>
      <Card className="mb-5 pb-5">
        <CardContent className="p-5 pb-5">
          <div className="">
            <p className="profile-headings">
              <b>Portfolio</b>
            </p>
          </div>
          <hr />
          {!isReady ? (
            <div className="d-flex justify-content-center align-item-center">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          ) : portfolio?.length <= 0 ? (
            <div className="d-flex justify-content-center align-item-center text-center mt-5">
              <p>Add screenshots, Pdfs and/or links to projects you have worked on</p>
            </div>
          ) : (
            <div className="row portfolio-list mb-5">
              {portfolio?.map((port, index) => {
                return (
                  <>
                    <div key={index} className="col-md-2 mb-3 mt-2">
                      <div className="file text-center">
                        <div className="content">
                          {port.ext[0] === "xlsx" ||
                          port.ext[0] === "xls" ||
                          port.ext[0] === "csv" ? (
                            <img
                              src="/images/new-excel.png"
                              width={90}
                              height={100}
                            />
                          ) : port.ext[0] === "docs" ||
                            port.ext[0] === "docx" ? (
                            <img
                              src="/images/msword.png"
                              width={90}
                              height={100}
                            />
                          ) : port.ext[0] === "pdf" ? (
                            <img
                              src="/images/pdf.png"
                              width={90}
                              height={100}
                            />
                          ) : port.ext[0] === "ppt" ||
                            port.ext[0] === "pptx" ? (
                            <img
                              src="/images/ppt.png"
                              width={90}
                              height={100}
                            />
                          ) : port.ext[0] === "jpeg" ||
                            port.ext[0] === "jpg" ||
                            port.ext[0] === "png" ||
                            port.ext[0] === "jfif" ? (
                            <img
                              src={port.file}
                              width={120}
                              height={100}
                              style={{ borderRadius: "5px" }}
                            />
                          ) : port.ext[0] === "psd" ? (
                            <img
                              src="/images/new-psd.png"
                              width={90}
                              height={100}
                            />
                          ) : port.ext[0] === "xd" ? (
                            <img
                              src="/images/new-xd.png"
                              width={90}
                              height={100}
                            />
                          ) : port.ext[0] === "fig" ? (
                            <img
                              src="/images/new-fig.jpg"
                              width={90}
                              height={100}
                            />
                          ) : port.ext[0] === "mp4" ? (
                            <div>
                              <video
                                width={140}
                                height={100}
                                controls
                                style={{ borderRadius: "5px" }}
                              >
                                <source src={port.file} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ) : (
                            <img
                              src="/images/default-file.png"
                              width={90}
                              height={100}
                            />
                          )}
                        </div>
                        <div className="d-flex hoverButtons">
                          <div
                            title={
                              viewPortfolio ? "Hide Document" : "View Document"
                            }
                          >
                            <Visibility
                              color="primary"
                              type="button"
                              onClick={() => {
                                handlePortfolioDisplay(port.file[0]);
                                setViewPortfolio((prev) => !prev);
                                setTimeout(scrollDown, 500);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="portFileName text-center mb-0 mt-2">
                        {port.title}
                      </p>
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Portfolio;
