import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Button, Card, DialogActions } from "@material-ui/core";
import ReactHtmlParser from "react-html-parser";
import Icon from "@mdi/react";
import {
  mdiBriefcaseAccountOutline,
  mdiAccountClockOutline,
  mdiCloudDownloadOutline,
  mdiAccountOutline,
  mdiHomeCityOutline,
  mdiShapeOutline,
} from "@mdi/js";
import { getUserType } from "../Services/auth";
import Visibility from "@material-ui/icons/Visibility";

function AllJobsDetails() {
  const [jobDetails, setJobDetails] = useState(
    JSON.parse(localStorage.getItem("recruiterJobs")) !== null
      ? JSON.parse(localStorage.getItem("recruiterJobs"))
      : []
  );

  const history = useHistory();

  const handleClick = (id) => {
    localStorage.setItem(
      "profileData",
      JSON.stringify(id)) ;
     window.location.assign("/applicants")
  };

  const handleclickEdit = () => {
    history.push(
      getUserType().accountTypeId === 1 ? "/edit-jobs" : "edit-recruiter-jobs",
      { params: jobDetails }
    );
  };

  const handleclickAllJobs = () => {
    history.push(
      getUserType().accountTypeId === 1 ? "/all-jobs" : "recruiter-all-jobs"
    );
    
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-10">
          <h6 className="mb-4 pageTitle">
          <b>Job Details</b>
          </h6>
        </div>
        <div className="col-md-1"/>
      </div>
      <div className="row">
        <div className="col-md-1" />
        <div className="col-md-10">
          <Card
            className="mt-3 mb-5"
            style={{
              borderRadius: "3px",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
              cursor: "pointer",
              padding: "35px",
            }}
          >
            <div className="row">
              <div className="col-md-12">
                <p className="bodyTitles">{jobDetails?.title}</p>
              </div>
            </div>

            <div className="row" style={{ color: "#555555" }}>
              <div className="col-md-12 d-flex">
               

                {jobDetails?.setting ? (
                  <div className="d-flex" style={{ marginRight: "20px" }}>
                  <Icon
                  path={mdiHomeCityOutline}
                  title="Work Setting Type"
                  size={1}
                  horizontal
                  vertical
                  color="#009E20"
                  rotate={180}
                  style={{ marginRight: "10px" }}
                />{" "}
                <p className="mt-1">{jobDetails?.setting}</p>
              </div>
                ) : null }

{jobDetails?.name ? (
                  <div className="d-flex" style={{ marginRight: "20px" }}>
                  <Icon
                  path={mdiAccountOutline}
                  title="Name of person"
                  size={1}
                  horizontal
                  vertical
                  color="#55A8FD"
                  rotate={180}
                  style={{ marginRight: "10px" }}
                />{" "}
                <p className="mt-1">{jobDetails?.name}</p>
              </div>
                ) : null }
                

                {jobDetails?.MainIndustry?.name ? (
                  <div className="d-flex" style={{ marginRight: "20px" }}>
                  <Icon
                    path={mdiBriefcaseAccountOutline}
                    title="Category"
                    size={1}
                    horizontal
                    vertical
                    color="#009E20"
                    rotate={180}
                    style={{ marginRight: "10px" }}
                  />{" "}
                  <p className="mt-1" style={{textTransform: "capitalize"}}>{jobDetails?.MainIndustry?.name}</p>
                </div>
                ) : null }


                {jobDetails?.Category?.category ? (
                  <div className="d-flex" style={{ marginRight: "20px" }}>
                  <Icon
                    path={mdiBriefcaseAccountOutline}
                    title="Category"
                    size={1}
                    horizontal
                    vertical
                    color="#009E20"
                    rotate={180}
                    style={{ marginRight: "10px" }}
                  />{" "}
                  <p className="mt-1" style={{textTransform: "capitalize"}}>{jobDetails?.Category?.category }</p>
                </div>
                ) : null }

{jobDetails?.type ? (
                  <div className="d-flex" style={{ marginRight: "20px" }}>
                  <Icon
                    path={mdiAccountClockOutline}
                    title="Job Type"
                    size={1}
                    horizontal
                    vertical
                    color="#5F2EEA"
                    rotate={180}
                    style={{ marginRight: "10px" }}
                  />{" "}
                  <p className="mt-1">{jobDetails?.type}</p>
                </div>
                ) : null }

                {jobDetails?.IndustryCategory?.name ? (
                  <div className="d-flex">
                  <Icon
                    path={mdiShapeOutline}
                    title="Industry Category"
                    size={1}
                    horizontal
                    vertical
                    color="#FFB648"
                    rotate={180}
                    style={{ marginRight: "10px" }}
                  />{" "}
                  <p className="mt-1" style={{textTransform: "capitalize"}}>{jobDetails?.IndustryCategory?.name}</p>
                </div>
                ) : null }
                
              </div>
            </div>

            <div className="row" style={{ color: "#555555" }}>
              <div className="col-md-12">
                <p>{ReactHtmlParser(jobDetails?.description)}</p>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-12">
              {jobDetails?.JobFiles?.length <=0 ? null : (
                <p style={{ color: "#707070" }}>
                  <b>Job Attachments</b>
                </p>
              )}
              </div>

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
                                src="/images/msword.png"
                                width={90}
                                height={100}
                              />
                            ) : files?.splitName.split(".")[1] === "pdf" ? (
                              <img
                                src="/images/pdf.png"
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
                        <div title="View Document">
                          <a href={files?.name} target="_blank" download>
                          <Visibility
                              color="primary"
                              type="button"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                    <p
                      className="text-center portFileName"
                      style={{ color: "#555555" }}
                      title={files.splitName}
                    >
                      {files.splitName}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="row mt-3">
              <div className="col-md-12">
              {jobDetails?.Questions?.length <= 0 ? (
                  ``
                ) : (
                <p style={{ color: "#707070" }}>
                  <b>Job Questions</b>
                </p>
                )}
              </div>

              <div className="col-md-12" style={{ color: "#555555" }}>
                {jobDetails?.Questions?.map((questions, index) => {
                  return (
                    <div key={(index, questions?.id)} className="mb-4">
                      <div className="mb-2">
                        <p>
                          {questions?.question}{" "}
                          {questions?.required === true ? `(Required)` : ``}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-12">
                {jobDetails?.JobApplications?.length <= 0 ? (
                  ``
                ) : (
                  <p style={{ color: "#707070" }}>
                    <b>Job Applicants</b>
                  </p>
                )}
                {jobDetails?.JobApplications?.length <= 0 ? (
                  ``
                ) : (
                  <a
                    className=" bg-transparent"
                    style={{
                      color: "#2E405B",
                      fontWeight: "600",
                    }}
                    onClick={() => handleClick(jobDetails)}
                  >
                    View Applicants
                  </a>
                )}
              </div>
            </div>

            <DialogActions className="justify-content-center mt-4">
              <Button
                className="w-25 btn"
                variant="outlined"
                color="primary"
                onClick={() => {
                  handleclickEdit();
                }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                className="w-25"
                onClick={() => {
                  handleclickAllJobs();
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Card>
        </div>
        <div className="col-md-1"/>
      </div>
    </div>
  );
}

export default AllJobsDetails;
