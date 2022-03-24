import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import moment from "moment";
import { ClipLoader } from "react-spinners";
import Pagination from "@material-ui/lab/Pagination";
import CompleteProfileDialog from "../Components/CompleteProfileDialog";
import { Card } from "@material-ui/core";
import { filterLocalJobsFreelancerBySearch } from "../Services/redux/freelancer-filters/index";
import { useDispatch, useSelector } from "react-redux";
import { freelancerJobFiltersRuducer } from "../Services/redux/freelancer-filters/filters";
import FreelanceAllJobsFilter from "../Components/FreelaceAllJobsFilter";
import ReactHtmlParser from "react-html-parser";

const usePageStyles = makeStyles(() => ({
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
}));

function LocaJobs() {
  const classes = usePageStyles();
  const dispatch = useDispatch();
  const filters = useSelector(freelancerJobFiltersRuducer);
  const [pageNumber, setpageNumber] = useState(1);
  const [pageInfo, setpageInfo] = useState();

  const filterDataUntouched = {
    keyword: null,
    categoryId: null,
    type: [],
    sortBy: "DESC",
    page: pageNumber,
  };
  let filterData =
    JSON.parse(localStorage.getItem("filterData")) !== null
      ? JSON.parse(localStorage.getItem("filterData"))
      : filterDataUntouched;

  const handlePageChange = async (event, value) => {
    setpageNumber(value);
    await InitialJobs(value);
  };

  const InitialJobs = async (pageNumber = 1) => {
    filterData = JSON.parse(localStorage.getItem("filterData"));
    if (filterData !== null) filterData.page = pageNumber;
    await dispatch(filterLocalJobsFreelancerBySearch(filterData))
      .then((response) => {
        setpageInfo(response?.payload?.data?.pageInfo);
      })
      .catch((error) => {});
    localStorage.setItem("filterData", JSON.stringify(filterData));
  };

  useEffect(() => {
    InitialJobs();
  }, []);

  return (
    <div>
      <div className="pageTitle mb-4">
        <h6>
          <b>Ghana Jobs</b>
        </h6>
      </div>
      <div className="row mb-5">
        <div className="col-md-3">
          <FreelanceAllJobsFilter />
        </div>

        <div className="col-md-9 allJobsColumn">
          {!filters.loaded ? (
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
          ) : filters?.data?.result?.data?.length <= 0 ? (
            <Card
              className="mt-1 text-center"
              style={{
                borderRadius: "3px",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
                cursor: "pointer",
                padding: "35px",
              }}
            >
                 <img
                  src="/images/Group 2356.png"
                  alt="no job posted"
                />
              <p className="mt-5">No result found</p>
            </Card>
          ) : (
            <>
              <Card
                className="mt-1 mb-5"
                style={{
                  borderRadius: "3px",
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
                  cursor: "pointer",
                  padding: "33px",
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
                  Displaying ({filters?.data?.pageInfo?.start} -{" "}
                  {filters?.data?.pageInfo?.end}) of{" "}
                  {filters?.data?.recruiterJobCount} jobs
                </p>
                <div className="row mt-4">
                  {filters?.data?.result?.data &&
                    filters?.data?.result?.data?.map((alljobs, index) => {
                      return alljobs.active === false ? null : (
                        <>
                          <div className="col-md-12">
                            <hr
                              style={{
                                marginTop: "-10px",
                                marginBottom: "0",
                              }}
                            />
                          </div>
                          <div className="col-md-12 mb-1">
                            <div className="d-flex justify-content-between mb-2">
                              <NavLink
                                to={"/freelancer-all-job-details"}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                }}
                                onClick={() => {
                                  localStorage.setItem(
                                    "jobDetails",
                                    JSON.stringify(alljobs)
                                  );
                                }}
                              >
                                <div className=" d-flex">
                                  <p className="bodyTitles mt-2 mb-0">
                                    <span className="bodyTitles ">
                                      {alljobs.title}
                                    </span>{" "}
                                    <span
                                      style={{
                                        color: "#808080",
                                        fontSize: "10px",
                                      }}
                                    >
                                      (
                                      {moment(`${alljobs.createdAt}`).fromNow()}
                                      )
                                    </span>
                                  </p>
                                </div>
                              </NavLink>
                            </div>

                            <div className="col-md-12 mb-0 pb-0">
                              <NavLink
                                to={"/freelancer-all-job-details"}
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                }}
                                onClick={() => {
                                  localStorage.setItem(
                                    "jobDetails",
                                    JSON.stringify(alljobs)
                                  );
                                }}
                              >
                                <div className="col-md-12">
                                  <p
                                    className="searchJobDescription"
                                    style={{ color: "#808080" }}
                                  >
                                    {ReactHtmlParser(alljobs.description)}
                                  </p>
                                </div>
                              </NavLink>

                              <div className="col-md-12 mb-0 pb-0">
                                <div className="d-flex justify-content-between">
                                  <NavLink
                                    to={"/freelancer-all-job-details"}
                                    style={{
                                      textDecoration: "none",
                                      color: "inherit",
                                    }}
                                    onClick={() => {
                                      localStorage.setItem(
                                        "jobDetails",
                                        JSON.stringify(alljobs)
                                      );
                                    }}
                                  >
                                    <div>
                                      <p
                                        style={{ textTransform: "capitalize" }}
                                        className="badge job-badge p-2"
                                      >
                                        {alljobs?.IndustryCategory?.name}
                                      </p>
                                      <p className="badge job-badge p-2">
                                        {alljobs.type}
                                      </p>
                                      <p className="badge job-badge p-2">
                                        {alljobs.setting}
                                      </p>
                                    </div>
                                  </NavLink>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                </div>
              </Card>

              {filters?.data?.result?.data?.length === undefined ||
              filters?.data?.result?.lastPage === 1 ? (
                ""
              ) : (
                <div className="d-flex justify-content-center mt-5 mb-5">
                  <Pagination
                    count={filters?.data?.result?.pages?.length}
                    variant="outlined"
                    page={pageNumber}
                    onChange={handlePageChange}
                    classes={{ ul: classes.ul }}
                    color="white"
                  />
                </div>
              )}
            </>
          )}

          <CompleteProfileDialog />
        </div>
      </div>
    </div>
  );
}
export default LocaJobs;
