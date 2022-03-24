import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../Services/auth";
import { ClipLoader } from "react-spinners";
import {
  Button,
  Card,
  Dialog,
  DialogContent,
  Snackbar,
} from "@material-ui/core";
import ReactHtmlParser from "react-html-parser";
import Checkbox from "@mui/material/Checkbox";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { jobFiltersRuducer } from "../Services/redux/jobFilters/jobFilters-slice";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import { mdiTextBoxRemoveOutline } from "@mdi/js";
import moment from "moment";
import { deactivateJob } from "../Services/redux/postJob/index";
import JobDetails from "../Components/Job/JobDetails";
import CompleteProfileDialog from "../Components/CompleteProfileDialog";
import {
  filterAdminRecruiterJobsBySearch,
  filterAdminClientJobsBySearch,
} from "../Services/redux/jobFilters/index";
import AdminAllJobsFilter from "./../Components/AdminAllJobsFilter";
import Icon from "@mdi/react";
import { Alert } from "@material-ui/lab";

const usePageStyles = makeStyles(() => ({
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
}));

function AdminAllJobs() {
  const dispatch = useDispatch();
  const filters = useSelector(jobFiltersRuducer);
  const [id, setId] = useState(getCurrentUser().user.id);
  const [recruiterData, setRecruiterData] = useState([]);
  const [checkedValues, setCheckedValues] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDeleteDialog2, setOpenDeleteDialog2] = useState(false);
  const [openJobDetails, setOpenJobDetails] = useState(false);
  const [jobDetailsData, setJobDetailsData] = useState("");
  const [loading, setloading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [pageNumber, setpageNumber] = useState(1);
  const [pageInfo, setpageInfo] = useState();
  const [displayData, setDisplayData] = useState();
  const [actives, setActive] = useState([]);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const classes = usePageStyles();

  const shoeSnack = () => {
    setOpen(true);
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

  const handleClosed = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleCloseJobDetails = () => {
    setOpenJobDetails(false);
  };

  const closeDialog = () => {
    closeDeleteDia();
  };

  const closeDialog2 = () => {
    closeDeleteDia2();
    window.location.reload();
  };

  const openDeleteDia = () => {
    if (checkedValues.length == 0) {
      shoeSnack();
      setAlert({
        open: true,
        message: `Please select jobs first before you can deactivate`,
        severity: "error",
      });
      closeAlert();
      setOpenDeleteDialog(false);
    } else {
      setOpenDeleteDialog(true);
    }
  };

  const handled = (e, id) => {
    setActive(id);
    hello();

    if (e.target.checked) {
      setOpenDeleteDialog2(false);
      setCheckedValues((prevArray) => {
        return [...prevArray, e.target.value];
      });
    }

    if (!e.target.checked) {
      let newCheckedValues = checkedValues.filter(
        (item) => item !== e.target.value
      );
      setCheckedValues(newCheckedValues);
    }
  };

  const hello = () => {
    if (actives && actives !== null) {
      setOpenDeleteDialog2(true);
    } else {
      setOpenDeleteDialog2(false);
    }
  };

  const closeDeleteDia = () => {
    setOpenDeleteDialog(false);
  };

  const closeDeleteDia2 = () => {
    setOpenDeleteDialog2(false);
  };

  let filterDataUntouched = {
    keyword: null,
    type: null,
    industryId: null,
    categoryId: null,
    setting: [],
    sortBy: "DESC",
    jobType: "client",
    userAccountId: getCurrentUser()?.user?.id,
    page: pageNumber,
  };

  let filterData =
    JSON.parse(localStorage.getItem("AdminJobs")) !== null
      ? JSON.parse(localStorage.getItem("AdminJobs"))
      : filterDataUntouched;

  const archiveJob = async () => {
    const data = {
      jobId: checkedValues,
      active: false,
      jobType: filterData.jobType ? filterData.jobType : filterDataUntouched,
    };

    setloading(true);
    await dispatch(deactivateJob(data))
      .then((response) => {
        setloading(false);
        closeDialog();
        window.location.assign("/admin-all-jobs");
      })
      .catch((error) => {
        setloading(false);
      });
  };

  const archiveJob2 = async () => {
    const data = {
      jobId: [actives],
      active: true,
      jobType: filterData.jobType ? filterData.jobType : filterDataUntouched,
    };

    setloading(true);
    await dispatch(deactivateJob(data))
      .then((response) => {
        setloading(false);
        closeDialog2();
        window.location.assign("/admin-all-jobs");
      })
      .catch((error) => {
        setloading(false);
      });
  };

  const handlePageChange = async (event, value) => {
    setpageNumber(value);
    await InitialJobs(value);
  };

  const InitialJobs = async (pageNumber = 1) => {
    filterData = JSON.parse(localStorage.getItem("AdminJobs"));
    if (filterData !== null) filterData.page = pageNumber;

    await dispatch(
      filterAdminClientJobsBySearch(
        filterData !== null ? filterData : filterDataUntouched
      )
    )
      .then((response) => {
        setIsReady(true);
        setDisplayData(response);
        setpageInfo(response?.payload?.data?.pageInfo);
      })
      .catch((error) => {});
    localStorage.setItem("AdminJobs", JSON.stringify(filterData));
    localStorage.setItem("page", JSON.stringify(pageNumber));
  };

  const InitialJobs2 = async (pageNumber = 1) => {
    filterData = JSON.parse(localStorage.getItem("AdminJobs"));
    if (filterData !== null) filterData.page = pageNumber;

    await dispatch(
      filterAdminRecruiterJobsBySearch(
        filterData !== null ? filterData : filterDataUntouched
      )
    )
      .then((response) => {
        setIsReady(true);
        setDisplayData(response);
        setpageInfo(response?.payload?.data?.pageInfo);
      })
      .catch((error) => {});
    localStorage.setItem("AdminJobs", JSON.stringify(filterData));
    localStorage.setItem("page", JSON.stringify(pageNumber));
  };

  const initialJobsCondition = () => {
    if (filterData.jobType === "recruiter") {
      InitialJobs2();
    } else {
      InitialJobs();
    }
  };

  useEffect(() => {
    initialJobsCondition();
    localStorage.setItem("recruiterJobs", JSON.stringify(recruiterData));
  }, []);

  return (
    <div>
      <div className="pageTitle mb-4">
        <h6>
          <b>All Jobs</b>
        </h6>
      </div>

      <div className="row">
        <div className="col-md-3">
          <AdminAllJobsFilter />
        </div>
        <div className="col-md-9 allJobsColumn">
          {!isReady ? (
            <Card
              className="mt-1"
              style={{
                borderRadius: "3px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                cursor: "pointer",
                padding: "33px",
              }}
            >
              <div className="d-flex justify-content-center align-item-center">
                <ClipLoader size={40} color="#1b98e0" loading />
              </div>
            </Card>
          ) : filters.data.result?.data?.length <= 0 ? (
            <Card
              className="mt-1"
              style={{
                borderRadius: "3px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                cursor: "pointer",
                padding: "33px",
              }}
            >
              <div className="row text-center mt-5">
                <div className="col-md-12">
                <img
                  src="/images/Group 2356.png"
                  alt="no job posted"
                  width="230"
                />
                  <p>
                    No results to display
                    <br />
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="row">
              <div className="col-md-12">
                <Card
                  className="mt-1 mb-5"
                  style={{
                    borderRadius: "3px",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    padding: "33px",
                  }}
                >
                  <div
                    className="d-flex justify-content-between"
                    style={{ marginBottom: "-25px" }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#2E405B",
                        marginBottom: "0",
                        color: "#2E405B",
                      }}
                      className="mt-1"
                    >
                      Displaying ({filters?.data?.pageInfo?.start} -{" "}
                      {filters?.data?.pageInfo?.end}) of {filters?.data?.pageInfo?.total}{" "}
                      jobs
                    </p>
                    {filters.data.result?.data?.length === null ? (
                      <div className="d-flex">
                        <Icon
                          path={mdiTextBoxRemoveOutline}
                          size={1}
                          color={"#E90000"}
                          title="Deactivate"
                        />
                        <p style={{ color: "#F70000" }}>&nbsp;Deactivate</p>
                      </div>
                    ) : (
                      <div className="d-flex">
                        <Icon
                          onClick={openDeleteDia}
                          size={1}
                          path={mdiTextBoxRemoveOutline}
                          color={"#F70000"}
                          title="Deactivate"
                          style={{ cursor: "pointer" }}
                        />

                        <p
                          onClick={openDeleteDia}
                          style={{ color: "#F70000", cursor: "pointer" }}
                        >
                          &nbsp;Deactivate
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="row mt-4">
                    {filters?.data?.result?.data &&
                      filters?.data?.result?.data?.map((alljobs, index) => {
                        return (
                          <>
                            <div className="col-md-12">
                              <hr
                                style={{
                                  marginBottom: "0",
                                }}
                              />
                            </div>
                            <div className="col-md-12 mb-1" key={index}>
                              <div className="d-flex justify-content-between">
                                <NavLink
                                  to={"/admin-job-details"}
                                  style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                  }}
                                  onClick={() => {
                                    localStorage.setItem(
                                      "recruiterJobs",
                                      JSON.stringify(alljobs)
                                    );
                                  }}
                                >
                                  <div className=" d-flex" key={alljobs.id}>
                                    <p className="bodyTitles mt-2 mb-0">
                                      <span className="bodyTitles ">
                                        {alljobs.active === false ? (
                                          <span style={{ color: "#E90000" }}>
                                            {" "}
                                            {<ReportProblemOutlinedIcon style={{fontSize:"20px"}} />}{" "}
                                            (Deactivated) {alljobs.title}
                                          </span>
                                        ) : (
                                          alljobs.title
                                        )}
                                      </span>{" "}
                                      <span
                                        style={{
                                          color: "#808080",
                                          fontSize: "10px",
                                        }}
                                      >
                                        {alljobs.active === false ? (
                                          <span style={{ color: "#F70000" }}>
                                            {" "}
                                            (
                                            {moment(
                                              `${alljobs.createdAt}`
                                            ).fromNow()}
                                            )
                                          </span>
                                        ) : (
                                          <span>
                                            {" "}
                                            (
                                            {moment(
                                              `${alljobs.createdAt}`
                                            ).fromNow()}
                                            )
                                          </span>
                                        )}
                                      </span>
                                    </p>
                                  </div>
                                </NavLink>

                                <div>
                                  <Checkbox
                                    className="filtercheckbox"
                                    onChange={(e) =>
                                      handled(
                                        e,
                                        alljobs.active === false
                                          ? alljobs.id
                                          : null
                                      )
                                    }
                                    value={alljobs.id}
                                    defaultChecked={alljobs.active === false}
                                    style={{
                                      backgroundColor: "#FFFFFF" ,
                                      width: "0px",
                                      color:
                                        alljobs.active === false
                                          ? "#F70000"
                                          : "#707070",
                                    }}
                                  />
                                </div>
                              </div>
                              <NavLink
                                to={"/admin-job-details"}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                }}
                                onClick={() => {
                                  localStorage.setItem(
                                    "recruiterJobs",
                                    JSON.stringify(alljobs)
                                  );
                                }}
                              >
                                <div className="col-md-12">
                                  <p
                                    className="searchJobDescription"
                                    style={{ color: "#808080" }}
                                  >
                                 
                                    
                                      { ReactHtmlParser(alljobs.description)}
                                    
                                     
                                    
                                  </p>
                                </div>
                              </NavLink>

                              <div
                                className="col-md-12"
                                style={{ marginBottom: "-20px" }}
                              >
                                <div className="d-flex justify-content-between">
                                  <NavLink
                                    to={"/admin-job-details"}
                                    style={{
                                      textDecoration: "none",
                                      color: "inherit",
                                    }}
                                    onClick={() => {
                                      localStorage.setItem(
                                        "recruiterJobs",
                                        JSON.stringify(alljobs)
                                      );
                                    }}
                                  >
                                    <div>
                                      <p className="badge job-badge p-2">
                                        
                                            {
                                              alljobs?.IndustryCategory?.name
                                            }
                                       
                                      </p>
                                      <p className="badge job-badge p-2">
                                   
                                            {alljobs.type}
                                      
                                      </p>
                                      <p className="badge job-badge p-2">
                                        {alljobs.active === false &&
                                        alljobs?.setting ? (
                                          <span style={{ opacity: "0.4" }}>
                                            {alljobs.setting}
                                          </span>
                                        ) : (
                                          alljobs.setting
                                        )}
                                      </p>
                                      
                                      <p className="badge job-badge p-2">
                                        {
                                          alljobs?.Category?.category === undefined ? "" 
                                          : alljobs.active === false && alljobs?.Category?.category ? (
                                            <span style={{ opacity: "0.4" }}>
                                            {alljobs?.Category?.category}
                                          </span>
                                          ) : (
                                            alljobs?.Category?.category
                                          )
                                        }
                                      
                                      </p>
                                    </div>
                                  </NavLink>
                                  {/* <div>
                                    {alljobs?.JobApplications?.length <= 0 ? (
                                      ``
                                    ) : (
                                      <a
                                        className="p-2 bg-transparent"
                                        style={{
                                          color: "#2E405B",
                                          fontWeight: "600",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => handleClick(alljobs)}
                                      >
                                        View Applicants
                                      </a>
                                    )}
                                  </div> */}
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}
                  </div>
                </Card>
                {filters.data.result?.data?.length === undefined ||
                filters.data.result?.lastPage === 1 ? (
                  ``
                ) : (
                  <div className="d-flex justify-content-center mt-5 mb-5">
                    <Pagination
                      count={filters.data.result?.pages?.length}
                      variant="outlined"
                      page={pageNumber}
                      onChange={handlePageChange}
                      classes={{ ul: classes.ul }}
                      color="primary"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <Dialog
          open={openJobDetails}
          onClose={handleCloseJobDetails}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          // disableBackdropClick
          hideBackdrop
          className="dialogborder"
        >
          <JobDetails
            jobDetailsData={jobDetailsData}
            recruiterData={recruiterData}
            handleCloseJobDetails={handleCloseJobDetails}
          />
        </Dialog>

        <Dialog
          open={openDeleteDialog}
          onClose={closeDeleteDia}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="xs"
          className="dialogborder"
        >
          <div>
            <DialogContent className="text-center">
              {checkedValues.length > 1 ? (
                <p>Are you sure you want to deactivate these jobs?</p>
              ) : (
                <p>Are you sure you want to deactivate this job?</p>
              )}
              {setActive.length > 1 ? (
                <p>Are you sure you want to activate this job?</p>
              ) : (
                ""
              )}

              <div className="row justify-content-center text-center">
                <div className="col-md-6 mb-2" align="right">
                  <Button
                    className="btn w-100"
                    variant="outlined"
                    onClick={closeDialog}
                  >
                    No
                  </Button>
                </div>
                <div className="col-md-6" align="left">
                  <Button
                    variant="outlined"
                    className="w-100"
                    type="submit"
                    onClick={archiveJob}
                  >
                    {loading && (
                      <div style={{ marginRight: "5px" }}>
                        <ClipLoader size={20} color="#1b98e0" loading />
                      </div>
                    )}
                    Yes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </div>
        </Dialog>

        <Dialog
          open={openDeleteDialog2}
          onClose={closeDeleteDia2}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="xs"
          className="dialogborder"
        >
          <div>
            <DialogContent className="text-center">
              <p>Are you sure you want to activate this job?</p>

              <div className="row justify-content-center text-center">
                <div className="col-md-6 mb-2" align="right">
                  <Button
                    className="btn w-100"
                    variant="outlined"
                    onClick={closeDialog2}
                  >
                    No
                  </Button>
                </div>
                <div className="col-md-6" align="left">
                  <Button
                    variant="outlined"
                    className="w-100"
                    type="submit"
                    onClick={archiveJob2}
                  >
                    {loading && (
                      <div style={{ marginRight: "5px" }}>
                        <ClipLoader size={20} color="#1b98e0" loading />
                      </div>
                    )}
                    Yes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </div>
        </Dialog>
      </div>
      <CompleteProfileDialog />
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClosed}
      >
        <Alert severity={`${alert.severity}`}>{alert.message}</Alert>
      </Snackbar>
    </div>
  );
}
export default AdminAllJobs;
