import React, { useState, useEffect } from "react";
import ApplyJob from "../Components/Job/ApplyJob";
import { Card, Button } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiCloudDownloadOutline } from "@mdi/js";

function LocalFreelancerAllJobsDetails() {
  const [jobDetails, setJobDetails] = useState(
    JSON.parse(localStorage.getItem("jobDetails")) !== null
      ? JSON.parse(localStorage.getItem("jobDetails"))
      : []
  );

  return (
    <div>
      <div className="pageTitle mb-4">
        <h6>
          <b>Local Job Details</b>
        </h6>
      </div>
      <div className="row">
        <div className="col-md-8">
          <Card
            className="mt-1"
            style={{
              borderRadius: "10px",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              cursor: "pointer",
              padding: "35px",
            }}
          >
            <div>
              <div className="mb-2 ">
                <p className="bodyTitles">{jobDetails?.title}</p>
              </div>

              <p className="job-detials-description">
                {jobDetails?.description}
              </p>
            </div>
            <div className="mt-4">
              <p>
                <b>Job Attachment(s)</b>
              </p>
            </div>

            <div className="row mb-5">
              {jobDetails?.JobFiles?.map((files, index) => {
                return (
                  <div key={index} className="col-md-3 mb-3">
                    <div className="file">
                      <div className="content">
                        <div className="row" align="center">
                          <div className="col-md-12">
                            {files?.splitName.split(".")[1] === "xlsx" ||
                            files?.splitName.split(".")[1] === "xls" ||
                            files?.splitName.split(".")[1] === "csv" ? (
                              <img
                                src="/images/new-excel.png"
                                width={90}
                                height={100}
                              />
                            ) : files?.splitName.split(".")[1] === "docs" ||
                              files?.splitName.split(".")[1] === "docx" ? (
                              <img
                                src="/images/new-docs.png"
                                width={90}
                                height={100}
                              />
                            ) : files?.splitName.split(".")[1] === "pdf" ? (
                              <img
                                src="/images/new-pdf.png"
                                width={90}
                                height={100}
                              />
                            ) : files?.splitName.split(".")[1] === "ppt" ||
                              files?.splitName.split(".")[1] === "pptx" ? (
                              <img
                                src="/images/ppt.png"
                                width={90}
                                height={100}
                              />
                            ) : files?.splitName.split(".")[1] === "jpeg" ||
                              files?.splitName.split(".")[1] === "jpg" ||
                              files?.splitName.split(".")[1] === "png" ||
                              files?.splitName.split(".")[1] === "jfif" ? (
                              <img
                                src="/images/new-image.png"
                                width={90}
                                height={100}
                              />
                            ) : files?.splitName.split(".")[1] === "psd" ? (
                              <img
                                src="/images/new-psd.png"
                                width={90}
                                height={100}
                              />
                            ) : files?.splitName.split(".")[1] === "xd" ? (
                              <img
                                src="/images/new-xd.png"
                                width={90}
                                height={100}
                              />
                            ) : files?.splitName.split(".")[1] === "fig" ? (
                              <img
                                src="/images/new-fig.jpg"
                                width={90}
                                height={100}
                              />
                            ) : files?.splitName.split(".")[1] === "mp4" ? (
                              <img
                                src="/images/new-mp4.png"
                                width={90}
                                height={100}
                              />
                            ) : (
                              <img
                                src="/images/default-file.png"
                                width={90}
                                height={100}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex hoverButtons">
                        <div title="Download">
                          <a href={files?.name} download>
                            <Icon
                              path={mdiCloudDownloadOutline}
                              color="#2E405B"
                              title="Download"
                              size={1.2}
                              horizontal
                              vertical
                              rotate={180}
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                    <p
                      className="text-center portFileName"
                      title={files.splitName}
                    >
                      {files.splitName}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 text-center">
              <NavLink
                to={"/freelancer-all-job-questions"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button variant="contained" className="apply-job-btn">
                  Apply Now
                </Button>
              </NavLink>
            </div>
          </Card>
        </div>

        <div className="col-md-4">
          <ApplyJob jobDetails={jobDetails} />
        </div>
      </div>
    </div>
  );
}
export default LocalFreelancerAllJobsDetails;
