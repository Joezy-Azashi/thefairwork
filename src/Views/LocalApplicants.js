import React, { useState, useEffect } from "react";
import Api from "../Services/api";
import { getCurrentUser } from "../Services/auth";
import {
  Slide,
  DialogContent,
  Card,
 
  InputAdornment,
} from "@material-ui/core";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { mdiMagnify, mdiPlusThick } from "@mdi/js";
import Icon from "@mdi/react";

import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";

import { ClipLoader } from "react-spinners";
import { deleteRecruiterJob } from "../Services/redux/postJob/index";

import Filters from "../Components/Applicants/Filters";
import LocalApplicantsCard from "../Components/LocalApplicants/LocalApplicantsCard";
import { useLocation } from "react-router";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const usePageStyles = makeStyles(() => ({
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
}));

function LocalApplicants() {
  const [id, setId] = useState(getCurrentUser().user.id);
  const classes1 = usePageStyles();
  const location = useLocation();
  const [pageLength, setpageLength] = useState();
  const [applicants, setApplicants] = useState([]);
  const [applicantMessage, setApplicantMessage] = useState([]);
  const [pageNumber, setpageNumber] = useState(1);
  const [pageInfo, setpageInfo] = useState();
  const [skilla, setSkilla] = useState(false);
  const [expanded, setExpanded] = useState();
  const [selectApplicants, setSelectApplicants] = useState();
  const [hiddenfield, setHiddenField] = useState("");
  const [subcategory, setSubCategory] = useState(location?.state?.params);
  const [isReady, setIsReady] = useState(false);
  const [search, setSearched] = useState("");
  const [recruiterData, setRecruiterData] = useState([]);
  const [noData, setNodata] = useState();
  const [lengthpage, setLengthpage] = useState([]);
  const [count, setCount] = useState();
  // const [recruiterJobs, setRecruiterJobs] = useState(
  //   JSON.parse(localStorage.getItem("recruiterJobs")) !== null
  //   ? JSON.parse(localStorage.getItem("recruiterJobs"))
  //   : []
  // );

  const [jobUrl, setJobUrl] = useState(window.location.pathname.split("/")[4]);
  const handlePageChange = async (event, value) => {
    setpageNumber(value);

    await getAllApplicants(value);
  };

  const [profileData, setProfileData] = useState(JSON.parse(localStorage.getItem("profileData")))


  const getAllApplicants = async () => {
    let data = {
      userAccountId: id,
      
      jobId: selectApplicants === undefined ? null : selectApplicants?.id || selectApplicants,
    };

    Api()
      .post(`local-job/view-job-applicants/${pageNumber}`, data)
      .then((response) => {
        setpageInfo(response?.data?.pageInfo)
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
      .post(`local-job/get-user-jobs-unpaginated`, data)
      .then((response) => {
        setRecruiterData(response?.data?.allResults);
        setSelectApplicants(
          profileData == null || ""
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
  };

  useEffect(() => {
    getAllApplicants();
  }, [selectApplicants]);

  useEffect(() => {
    
    getRecruiterJobs();
  }, []);

  
  return (
    <div>
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
            <div className="col-md-12 mb-3">
              <TextField
                id="search"
                placeholder="Search by keyword"
                type="text"
                variant="outlined"
                className="allJobsSearchPlaceholder cpFilterLabel pt-1"
                size="small"
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
                className="applicantLabel cpFilterLabel pt-1"
                label={
                  skilla
                    ? "Sort by job title"
                    : selectApplicants?.title != null || ""
                    ? selectApplicants.title
                    : "Sort by job title"
                }
                fullWidth
                size="small"
                onFocus={handleFocus}
                id="sortby"
                style={{
                  backgroundColor: "white",
                  textTransform: "capitalize",
                }}
                InputProps={{}}
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
                    cursor: "pointer",
                    padding: "35px",
                  }}
                >
                  <ClipLoader size={40} color="#1b98e0" loading />
                </Card>
              </div>
            </div>
          ) : noData === "No Applicants found." ? (
            <div className="row text-center">
              <div className="col-md-12">
                <Card
                  className="mt-1"
                  style={{
                    borderRadius: "3px",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
                    cursor: "pointer",
                    padding: "35px",
                  }}
                >
                  <p>No applicants found for this job. </p>
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
                  Displaying ({pageInfo?.start} - {pageInfo?.end}) of{" "}
                {count} applicants
                </p>
                <div className="row">
                  {applicants &&
                    applicants.map((applicant) => {
                      return (
                        <>
                          <div className="col-md-12">
                            <hr className="mt-0" />
                          </div>
                          <LocalApplicantsCard applicant={applicant} />
                        </>
                      );
                    })}
                </div>
              </Card>

              {noData === "No Applicants found." || lengthpage === 1 ? null : (
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
export default LocalApplicants;
