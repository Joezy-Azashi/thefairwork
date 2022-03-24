import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../Services/auth";
import { ClipLoader } from "react-spinners";
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogContent,
} from "@material-ui/core";
import ReactHtmlParser from "react-html-parser";
import ArchiveOutlinedIcon from "@material-ui/icons/ArchiveOutlined";
import { jobFiltersRuducer } from "../Services/redux/jobFilters/jobFilters-slice";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import moment from "moment";
import { archiveRecruiterJob } from "../Services/redux/postJob/index";
import JobDetails from "../Components/Job/JobDetails";
import CompleteProfileDialog from "../Components/CompleteProfileDialog";
import AllJobsFilter from "../Components/AllJobsFilter";
import { filterClientJobsBySearch } from "../Services/redux/jobFilters/index";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { getUserType } from "../Services/auth";

const usePageStyles = makeStyles(() => ({
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
}));

function AllJobs() {
  const dispatch = useDispatch();
  const filters = useSelector(jobFiltersRuducer);
  const [recruiterData, setRecruiterData] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [checkedValues, setCheckedValues] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openJobDetails, setOpenJobDetails] = useState(false);
  const [jobDetailsData, setJobDetailsData] = useState("");
  const [loading, setloading] = useState(false);
  const [pageLength, setpageLength] = useState([]);
  const [pageNumber, setpageNumber] = useState(1);
  const [displayData, setDisplayData] = useState();
  const [pageInfo, setpageInfo] = useState();

  const classes = usePageStyles();

  const handleCloseJobDetails = () => {
    setOpenJobDetails(false);
  };

  const handleClick = (id) => {
    localStorage.setItem("profileData", JSON.stringify(id));
    window.location.assign("/applicants");
  };

  const closeDialog = () => {
    closeDeleteDia();
  };

  const archiveJob = async () => {
    const data = {
      jobId: checkedValues,
    };

    setloading(true);
    await dispatch(archiveRecruiterJob(data))
      .then((response) => {
        setloading(false);
        dispatch(
          filterClientJobsBySearch(data !== null ? data : dataUntouched)
        );
        closeDialog();

        window.location.reload()
      })
      .catch((error) => {
        setloading(false);
      });
  };

  const handled = (e) => {
    if (e.target.checked) {
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

  const openDeleteDia = () => {
    if (checkedValues.length == 0) {
      setOpenDeleteDialog(false);
    } else {
      setOpenDeleteDialog(true);
    }
  };

  const closeDeleteDia = () => {
    setOpenDeleteDialog(false);
  };

  const archivedText = ()=>{
    const statusArray = [];
    filters?.data?.result?.data.forEach(element => {
      statusArray.push(element?.status)
    });
  
    if(statusArray.every(e=> e =="Archived")){
      return("Unarchive")

    }else{
      return "Archive"
    }
  }


  const bulkArchive = ()=>{
    const checkedStatuses =[]
  

    filters?.data?.result?.data.forEach(element=>{
        if(checkedValues.includes(element.id.toString())){
          checkedStatuses.push(element.status)
        }
    })

    if(!checkedValues?.length){return true}
    if(checkedStatuses.every(element=>element==="Archived")){return "Unarchive"} 
    if(checkedStatuses.every(element=>element==="Posted")){return "Archive"}
    return '';
  }

  let dataUntouched = {
    keyword: null,
    type: [],
    categoryId: null,
    subcategoryId: null,
    status: null,
    setting: [],
    sortBy: "DESC",
    userAccountId: getCurrentUser()?.user?.id,
    page: pageNumber,
  };

  let data =
    JSON.parse(localStorage.getItem("data")) !== null
      ? JSON.parse(localStorage.getItem("data"))
      : dataUntouched;

  const handlePageChange = async (event, value) => {
    setpageNumber(value);
    await InitialJobs(value);
  };

  const InitialJobs = async (pageNumber = 1) => {
    data = JSON.parse(localStorage.getItem("data"));
    if (data !== null) data.page = pageNumber;

    await dispatch(
      filterClientJobsBySearch(data !== null ? data : dataUntouched)
    )
      .then((response) => {
        setIsReady(true);

        setDisplayData(response);
        setpageInfo(response?.payload?.data?.pageInfo);
      })
      .catch((error) => {});
    localStorage.setItem("data", JSON.stringify(data));
  };

  useEffect(() => {
    InitialJobs();
    localStorage.setItem("recruiterJobs", JSON.stringify(recruiterData));
  }, []);


  return (
    <div>
      { getUserType()?.isLimited && getUserType()?.accountTypeId !==4 &&<div className="row mb-3"
        style={{
         paddingLeft:"3px"
          }}>
        <div className="col-md-3"/>
       <h6 className="col-md-9 allJobsColumn" style = {{fontFamily:"Segoe UI", fontWeight:"semibold", color: "#2E405B"}}> <b>Dear client, functionalities are limited for your account. Please reach out to support.</b>
       </h6>
      </div>}
      <div className="pageTitle mb-4">
        <h6>
          <b>My Jobs </b>
        </h6>
      </div>

      <div className="row">
        <div className="col-md-3">
          <AllJobsFilter />
        </div>
        <div className="col-md-9 allJobsColumn">
          {!isReady ? (
            <Card
              className="mt-1 mb-5"
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
          ) : filters.data?.result?.data?.length <= 0 &&
            (data.keyword || data.type) ? (
            <Card
              className="mt-1"
              style={{
                borderRadius: "3px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                cursor: "pointer",
                padding: "35px",
              }}
            >
              <div className="row text-center mt-5 mb-5">
                <div className="col-md-12">
                  <img src="/images/Group 2356.png" alt="no job posted" />
                  <p className="mt-5">No jobs found.</p>
                </div>
              </div>
            </Card>
          ) : filters.data?.result?.data?.length <= 0 ? (
            <Card
              className="mt-1"
              style={{
                borderRadius: "3px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                cursor: "pointer",
                padding: "35px",
              }}
            >
              <div className="row text-center mt-5 mb-5">
                <div className="col-md-12">
                  <img src="/images/Group 2356.png" alt="no job posted" />
                  <p className="mt-5">
                    No jobs found. click on the{" "}
                    <NavLink
                      to="/post-jobs"
                      style={{ textDecoration: "none", color: "#0A66C2" }}
                    >
                      <b>Post Job</b>{" "}
                    </NavLink>{" "}
                    <br />
                    buttons to post a job
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
                  <div className="d-flex justify-content-between">
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
                      {filters?.data?.pageInfo?.end}) of {filters?.data?.count}{" "}
                      jobs
                    </p>
                    {filters.data?.result?.data?.length <= 0 ? (
                      <Button
                        className="p-0"
                        disabled
                        startIcon={ checkedValues?.length? bulkArchive() && <ArchiveOutlinedIcon />:<ArchiveOutlinedIcon />}
                      >
                        { checkedValues?.length? bulkArchive():archivedText()}
                      </Button>
                    ) : (
                      <Button
                        onClick={openDeleteDia}
                        className="p-0"
                        startIcon={ checkedValues?.length? bulkArchive() && <ArchiveOutlinedIcon />:<ArchiveOutlinedIcon />}
                        style={{ color: "#F70000"}}
                      >
                       { checkedValues?.length? bulkArchive():archivedText()}
                      </Button>
                    )}
                  </div>

                  <div className="row mt-4">
                    {filters?.data?.result?.data &&
                      filters?.data?.result?.data.map((alljobs) => {
                        return (
                          <>
                            <div className="col-md-12" key={alljobs.id}>
                              <hr
                                style={{
                                  marginTop: "-10px",
                                  marginBottom: "0",
                                }}
                              />
                            </div>
                            <div className="col-md-12 mb-1" key={alljobs.id}>
                              <div className="d-flex justify-content-between">
                                <NavLink
                                  to={"/all-job-details"}
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
                                  <div className=" d-flex">
                                    <p className="mt-2 mb-0">
                                      <span className="bodyTitles ">
                                        {alljobs.active === false ? (
                                          <span
                                            style={{
                                              color: "#E90000",
                                              textTransform: "capitalize",
                                            }}
                                          >
                                       
                                            {<ReportProblemOutlinedIcon style={{fontSize:"20px"}}/>}{" "}
                                            (Deactivated) {alljobs.title}
                                          </span>
                                        ) : (
                                          alljobs.title === null || alljobs.title === "" ? "(No Title)" : alljobs.title
                                        )}
                                      </span>
                                      {" "}
                                      <span
                                        style={{
                                          color: "#808080",
                                          fontSize: "10px",
                                        }}
                                      >
                                         {alljobs.active === false ? (
                                          <span style={{ color: "#F70000" }}>
                                         
                                            (
                                            {moment(
                                              `${alljobs.createdAt}`
                                            ).fromNow()}
                                            )
                                          </span>
                                        ) : (
                                          <span>
                                         
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
                                      onChange={handled}
                                      value={alljobs.id}
                                   
                                      style={{
                                        backgroundColor: "#FFFFFF",
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
                                to={"/all-job-details"}
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
                                    {ReactHtmlParser(alljobs.description === null || alljobs.description === "" ? "(No Description)" : alljobs.description)}
                                  </p>
                                </div>
                              </NavLink>

                              <div className="col-md-12 mb-0 pb-0">
                                <div className="d-flex justify-content-between">
                                  <NavLink
                                    to={"/all-job-details"}
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
                                          alljobs?.Category?.category
                                        }
                                      </p>
                                      <p className="badge job-badge p-2">
                                        {
                                          alljobs?.type
                                        }
                                      </p>
                                    </div>
                                  </NavLink>
                                  <div>
                                    {alljobs
                                        ?.JobApplications?.length <= 0 ? (
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
                                  </div>
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
                  <div className="d-flex justify-content-center mb-5">
                    <Pagination
                      count={filters.data.result?.pages.length}
                      variant="outlined"
                      page={pageNumber}
                      onChange={handlePageChange}
                      classes={{ ul: classes.ul }}
                      color="white"
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
            {
                <p>Are you sure you want to {bulkArchive() == "Unarchive"?"unarchive":"archive" } {checkedValues?.length > 1 ? "these":"this"} record{checkedValues?.length > 1 && "s"}?</p>
              }

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
      </div>
      <CompleteProfileDialog />
    </div>
  );
}

export default AllJobs;
