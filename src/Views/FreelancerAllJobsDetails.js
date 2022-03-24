import React, { useState, useEffect } from "react";
import ApplyJob from "../Components/Job/ApplyJob";
import { Card, Button, Snackbar, IconButton} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import Api from "../Services/api";
import { getCurrentUser} from "../Services/auth";
import { ClipLoader } from "react-spinners";
import { Alert } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import ReactHtmlParser from "react-html-parser";
import Visibility from "@material-ui/icons/Visibility";

function FreelancerAllJobsDetails() {
  const [jobDetails, setJobDetails] = useState(
    JSON.parse(localStorage.getItem("jobDetails")) !== null
      ? JSON.parse(localStorage.getItem("jobDetails"))
      : []
  );

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const [open, setOpen] = useState(false);

  const [salary, setsalary] = useState(jobDetails.salary)

  const [initialCheck, setinitialCheck] = useState(false)


  const [check, setCheck] = useState([])


  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };


  const closeAlert = () => {
    setTimeout(() => {
      setAlert({
        open: false,
        message: "",
        severity: "",
      });
    }, 4000);
  };

  const handleCloseSnack = () => {
    setOpen(false);
  };

  const checkJobIfApplied = () => {
    const data = {
      jobId : jobDetails?.id,
      userAccountId : getCurrentUser()?.user.id
    }
    Api().post( salary ? "/local-job/check-application" : "/jobs/check-application", data)
    .then((response) => {
      setinitialCheck(true)
      setCheck(response.data.message)
      setOpen(true)
      setAlert({
        open: true,
        message: `You have already applied to this job`,
        severity: "error",
      });
      closeAlert()
    }).catch((error) => {
    })
  }

  useEffect(() => {
    checkJobIfApplied()
  }, [])

  return (
    <div>
      <div className="pageTitle mb-4">
        <h6>
          <b>Job Details</b>
        </h6>
      </div>

      <div className="row">
      <div className="col-md-8 mb-1">
        {
          open === true ? (
            <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            open={check}
            autoHideDuration={4000}
            onClose={handleCloseSnack}
          >
            <Alert
              severity={`${alert.severity}`}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setAlert({
                      open: false,
                      message: "",
                      severity: "",
                    });
                  }}
                >
                </IconButton>
              }
            >
              {alert.message}
            </Alert>
          </Snackbar>
          ) : ``
        }
  
      </div>
      </div>
      <div className="row">
        <div className="col-md-8 mb-5">
          <Card
            className="mt-1"
            style={{
              borderRadius: "3px",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
              cursor: "pointer",
              padding: "35px",
            }}
          >
            <div>
              <div className="mb-2 ">
                <p className="bodyTitles">{jobDetails?.title}</p>
              </div>

              <p className="job-detials-description">
              {ReactHtmlParser(jobDetails?.description)}
              </p>
            </div>
            {
              jobDetails?.JobFiles.length > 0 ? (
                <div className="mt-4">
                <p>
                  <b>Job Attachment(s)</b>
                </p>
              </div>
              ) : ``
            }

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
                      title={files.splitName}
                    >
                      {files.splitName}
                    </p>
                  </div>
                );
              })}
            </div>

            {
              check === true  ? (
                <div className="mt-5 text-center">
                  <Button variant="contained" disabled className="apply-job-btnDisabled">
                  Apply Now
                  </Button>
              </div>
              ) : initialCheck ? (
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
              ) : (
                <div className="mt-5 text-center">
                  <Button variant="contained" className="apply-job-btn">
                  <ClipLoader size={24} color="white" loading />
                  </Button>
              </div>
              )
            }

          </Card>
        </div>

        <div className="col-md-4">
          <ApplyJob jobDetails={jobDetails} check={check} initialCheck={initialCheck} />
        </div>
      </div>

      {/* <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert severity={`${alert.severity}`}>{alert.message}</Alert>
        </Snackbar> */}
    </div>
  );
}
export default FreelancerAllJobsDetails;
