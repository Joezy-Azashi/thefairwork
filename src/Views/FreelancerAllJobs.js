import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import JobCard from "../Components/Job/JobCard";
import { ClipLoader } from "react-spinners";
import Pagination from "@material-ui/lab/Pagination";
import CompleteProfileDialog from "../Components/CompleteProfileDialog";
import SearchJobsFilter from "../Components/SearchJobsFilter";
import { Card } from "@material-ui/core";
import { filterJobsBySearch } from "../Services/redux/jobFilters/index";
import { useDispatch, useSelector } from "react-redux";
import { jobFiltersRuducer } from "../Services/redux/jobFilters/jobFilters-slice";

const usePageStyles = makeStyles(() => ({
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
}));

function AllJobs() {
  const classes = usePageStyles();
  const dispatch = useDispatch();
  const filters = useSelector(jobFiltersRuducer);
  const [noData, setNodata] = useState();
  const [pageNumber, setpageNumber] = useState(1);
  const [pageInfo, setpageInfo] = useState();
  const [lengthOnPage, setLengthOnPage] = useState();
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
    filterData = JSON.parse(localStorage?.getItem("filterData"));
    if (filterData !== null) filterData.page = pageNumber;
    await dispatch(filterJobsBySearch(filterData))
      .then((response) => {
        setLengthOnPage(response?.payload?.data?.result?.data.length);
        setpageInfo(response?.payload?.data?.pageInfo);
        localStorage.setItem(
          `page-${pageNumber}`,
          JSON.stringify({
            start: pageNumber,
            total: response?.payload?.data?.result?.data.length,
          })
        );
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
          <b>Search Jobs</b>
        </h6>
      </div>
      <div className="row">
        <div className="col-md-3 ">
          <SearchJobsFilter />
        </div>

        <div className="col-md-9 allJobsColumn">
          {!filters.loaded ? (
            <div className="row text-center">
              <div className="col-md-12">
                <Card
                  className="mt-1"
                  style={{
                    borderRadius: "3px",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    cursor: "pointer",
                    padding: "35px",
                  }}
                >
                  <ClipLoader size={40} color="#1b98e0" loading />
                </Card>
              </div>
            </div>
          ) : filters?.data?.result?.data?.length <= 0 ? (
            <div className="row text-center">
              <div className="col-md-12">
                <Card
                  className="mt-1 text-center"
                  style={{
                    borderRadius: "3px",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
                    cursor: "pointer",
                    padding: "35px",
                  }}
                >
                  <img src="/images/Group 2356.png" alt="no job posted" />
                  <p className="mt-5">No result found</p>
                </Card>
              </div>
            </div>
          ) : (
            <>
              <Card
                className="mt-1 mb-2"
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
                  {filters?.data?.clientJobCount} jobs
                </p>
                <div className="row mt-4">
                  {filters?.data?.result?.data?.map((alljobs, index) => {
                    return alljobs.active === false ? null : (
                      <>
                        <div className="col-md-12">
                          <hr style={{ marginTop: "-10px" }} />
                        </div>
                        <JobCard alljobs={alljobs} index={index} />
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
                    count={filters?.data?.result?.lastPage}
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
export default AllJobs;
