import React, { useState, useEffect } from "react";
import Api from "../Services/api";
import { getCurrentUser } from "../Services/auth";
import {
  Card,
  Dialog,
  InputAdornment,
} from "@material-ui/core";
import { mdiMagnify } from "@mdi/js";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mdi/react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import { ClipLoader } from "react-spinners";
import ApplicantsCard from "../Components/Applicants/ApplicantsCard";
import { getUserType } from "../Services/auth";

const usePageStyles = makeStyles(() => ({
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
}));

function AdminApplicants() {
  const [id, setId] = useState(getCurrentUser().user.id);
  const classes1 = usePageStyles();
  const [pageLength, setpageLength] = useState();
  const [applicants, setApplicants] = useState([]);
  const [applicantMessage, setApplicantMessage] = useState([]);
  const [pageNumber, setpageNumber] = useState(1);
  const [lengthpage, setLengthpage] = useState([]);
  const [pageInfo, setpageInfo] = useState({
    start: 0,
    end: 0,
    count: 0,
  });
  const [skilla, setSkilla] = useState(false);
  const [selectApplicants, setSelectApplicants] = useState();
  const [isReady, setIsReady] = useState(false);
  const [recruiterData, setRecruiterData] = useState([]);
  const [noData, setNodata] = useState();
  const [count, setCount] = useState();
  const [searchtext, setSearchText] = useState("");
  const [jobUrl, setJobUrl] = useState(window.location.pathname.split("/")[4]);

  const [profileData, setProfileData] = useState(
    JSON.parse(localStorage.getItem("profileData"))
  );

  const [userAccount, setuserAccount] = useState(
    getCurrentUser().user?.accountTypeId
  );

  const normalOrLocal = async () => {
    if (userAccount === 1) {
      getRecruiterJobs();
    } else {
      getRecruiterJobs2();
    }
  };

  const applicantsOrLocal = async () => {
    if (userAccount === 1) {
      getAllApplicants();
    } else {
      getAllApplicants2();
    }
  };

  const handlePageChange = async (event, value) => {
    setpageNumber(value);
    if (userAccount === 1) {
      await getAllApplicants(value);
    } else {
      await getAllApplicants2(value);
    }
  };

  const getAllApplicants2 = async (pageNumber = 1) => {
    let data = {
      userAccountId: id,

      jobId:
        selectApplicants === undefined
          ? null
          : selectApplicants?.id || selectApplicants,
      keyword: searchtext ? searchtext : null,
    };

    Api()
      .post(`local-job/view-job-applicants/${pageNumber}`, data)
      .then((response) => {
        setpageInfo(response?.data?.pageInfo);
        setCount(response?.data?.count);
        setIsReady(true);
        setApplicants(response?.data?.result?.data);
        setApplicantMessage(response?.data);
        setpageLength(response?.data?.result?.pages);
        setNodata(response?.data?.message);
        setLengthpage(response?.data?.result?.lastPage);
      })
      .catch((error) => {});
  };

  const getAllApplicants = async (pageNumber = 1) => {
    let data = {
      userAccountId: id,
      jobId:
        selectApplicants === undefined
          ? null
          : selectApplicants?.id || selectApplicants,
      keyword: searchtext ? searchtext : null,
    };

    Api()
      .post(`jobs/view-job-applicants/${pageNumber}`, data)
      .then((response) => {
        setpageInfo(response?.data?.pageInfo);
        setCount(response?.data?.count);
        setIsReady(true);
        setApplicants(response?.data?.result?.data);
        setApplicantMessage(response?.data);
        setpageLength(response?.data?.result?.pages);
        setNodata(response?.data?.message);
        setLengthpage(response?.data?.result?.lastPage);
      })
      .catch((error) => {});
  };

  const getRecruiterJobs = async () => {
    const data = {
      userAccountId: id,
      jobId: jobUrl === undefined ? null : jobUrl,
    };
    Api()
      .post(`jobs/get-user-jobs-unpaginated`, data)
      .then((response) => {
        setRecruiterData(response?.data?.allResults);
        setSelectApplicants(
          profileData === null || ""
            ? response?.data?.allResults[0]
            : profileData
        );
      })
      .catch((error) => {});
  };

  const getRecruiterJobs2 = async () => {
    const data = {
      userAccountId: id,
      jobId: jobUrl === undefined ? null : jobUrl,
    };
    Api()
      .post(`local-job/get-user-jobs-unpaginated`, data)
      .then((response) => {
        setRecruiterData(response?.data?.allResults);
        setSelectApplicants(
          profileData === null || ""
            ? response?.data?.allResults[0]
            : profileData
        );
      })
      .catch((error) => {});
  };

  const handleFocus = () => {
    setSkilla(true);
  };

  const handleSort = (e) => {
    setSelectApplicants(e.target.value);
    setSearchText("");
  };

  useEffect(() => {
    normalOrLocal();
  }, []);

  useEffect(() => {
    applicantsOrLocal();
  }, [searchtext ? searchtext : selectApplicants]);

  return (
    <div>
    { getUserType()?.isLimited && getUserType().accountTypeId !==4 &&<div className="row mb-3"
        style={{
         paddingLeft:"3px"
          }}>
        <div className="col-md-3"/>
       <h6 className="col-md-9 allJobsColumn" style = {{fontFamily:"Segoe UI", fontWeight:"semibold", color: "#2E405B"}}>
        <b>Dear client, functionalities are limited for your account. Please reach out to support.</b>
       </h6>
      </div>}
      <div className="pageTitle mb-4">
        <h6>
          <b>Applicants</b>
        </h6>
      </div>
      <div className="row">
        <div className="col-md-3" style={{ color: "#707070" }}>
          <div className="d-flex justify-content-between">
            <div>
              <p className="mb-0">
                <b>Filters</b>
              </p>
            </div>
          </div>
          <hr className="mt-1" />
          <div className="row mt-3">
            <div className="col-md-12">
              <TextField
                id="search"
                searchtext
                label="Search by keyword"
                type="search"
                variant="outlined"
                className="allJobsSearchPlaceholder"
                size="small"
                onChange={(e) => setSearchText(e.target.value)}
                fullWidth
                style={{ backgroundColor: "white" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon
                        path={mdiMagnify}
                        size={1}
                        horizontal
                        vertical
                        color="#808080"
                        rotate={180}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12 mb-3">
              <TextField
                variant="outlined"
                select
                type="text"
                value={selectApplicants}
                onChange={handleSort}
                label={
                  skilla
                    ? "Sort by job title"
                    : selectApplicants?.title != null || ""
                    ? selectApplicants.title
                    : "Sort by job title"
                }
                fullWidth
                className=""
                size="small"
                onFocus={handleFocus}
                id="sortby"
                style={{
                  backgroundColor: "white",
                  textTransform: "capitalize",
                }}
              >
                {recruiterData.map((recruiter) => (
                  <MenuItem
                    value={recruiter.id}
                    key={recruiter.id}
                    style={{ textTransform: "capitalize" }}
                  >
                    {recruiter.title}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
        </div>

        <div className="col-md-9 allJobsColumn">
          {!isReady ? (
            <div className="row text-center">
              <div className="col-md-12">
                <Card
                  className="mt-1"
                  style={{
                    borderRadius: "3px",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
                    padding: "30px",
                  }}
                >
                  <ClipLoader size={40} color="#1b98e0" loading />
                </Card>
              </div>
            </div>
          ) : noData == "No Applicants found." ? (
            <div className="row text-center">
              <div className="col-md-12">
                <Card
                  className="mt-1"
                  style={{
                    borderRadius: "3px",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
                    padding: "35px",
                  }}
                >
                  <div className="row text-center mt-5 mb-5">
                <div className="col-md-12">
                  <img src="/images/Group 2353.png" alt="no job applicant" />
                  <p style={{color: "#2E405B"}} className="mt-5">
                    There are no applicants found
                  </p>
                  </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <>
              <Card
                className="mt-1 mb-5"
                style={{
                  borderRadius: "3px",
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
                  cursor: "pointer",
                  padding: "35px",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "#2E405B",
                    paddingBottom: "0",
                    color: "#2E405B",
                  }}
                >
                  Displaying ({pageInfo?.start} - {pageInfo?.end}) of {count}{" "}
                  applicants
                </p>

                {applicants &&
                  applicants.map((applicant) => {
                   
                    return (
                      <>
                        <div className="row">
                          <div className="col-md-12">
                            <hr className="mt-0" />
                          </div>
                        </div>
                        <ApplicantsCard
                          applicant={applicant}
                          userAccount={userAccount}
                        />
                      </>
                    );
                  })}
              </Card>
              {applicants?.length === undefined || lengthpage === 1 ? null : (
                <div className="d-flex justify-content-center mt-5 mb-5">
                  <Pagination
                    count={pageLength?.length}
                    variant="outlined"
                    page={pageNumber}
                    onChange={handlePageChange}
                    classes={{ ul: classes1.ul }}
                    color="white"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default AdminApplicants;
