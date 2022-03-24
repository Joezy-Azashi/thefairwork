import { Button } from "@material-ui/core";
import React, { useState } from "react";
import Icon from "@mdi/react";
import {
  mdiAccountOutline,
  mdiAccountClockOutline,
  mdiBriefcaseAccountOutline,
  mdiHomeOutline,
  mdiOfficeBuildingOutline,
  mdiHomeCityOutline,
} from "@mdi/js";
import { NavLink } from "react-router-dom";
import { ClipLoader } from "react-spinners";

function ApplyJob({ jobDetails, check, initialCheck }) {
  return (
    <div>
      <div className="applyJobLeftPanel">
      <p>Are you interested in this job?</p>
      {check === true ? (
        <div className="mt-1 mb-4">
          <Button variant="contained" disabled className="apply-job-btnDisabled">
            Apply Now
          </Button>
        </div>
      ) : initialCheck ? (
        <div className="mt-1 mb-4">
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
        <div className="mt-1 mb-4">
          <Button variant="contained" className="apply-job-btn">
            <ClipLoader size={24} color="white" loading />
          </Button>
        </div>
      )}
      </div>

      
      <div>
        {jobDetails?.name === undefined || jobDetails?.name === " " ? null : (
          <div className="mb-4 align-content-center">
            <Icon
              className="apply-job-icon m-1"
              path={mdiAccountOutline}
              title="User Profile"
              size={1}
              horizontal
              color="#55A8FD"
              vertical
              rotate={180}
            />
            <span style={{ color: "#555555" }}>{jobDetails?.name}</span>
          </div>
        )}

        <div className="mb-4">
          <Icon
            className="apply-job-icon m-1"
            path={mdiBriefcaseAccountOutline}
            title="User Profile"
            size={1}
            horizontal
            color="#009E20"
            vertical
            rotate={180}
          />
          <span style={{ color: "#555555", textTransform: "capitalize" }}>
            {jobDetails?.Category?.category ||
              jobDetails.IndustryCategory?.name}
          </span>
        </div>

        <div className="mb-4">
          <Icon
            className="apply-job-icon m-1"
            path={mdiAccountClockOutline}
            title="User Profile"
            size={1}
            horizontal
            color="#5F2EEA"
            vertical
            rotate={180}
          />
          <span style={{ color: "#555555" }}>{jobDetails?.type}</span>
        </div>

        {jobDetails?.setting === undefined ? null : (
          <div className="mb-4">
            <Icon
              className="apply-job-icon m-1"
              path={
                jobDetails?.setting === "Remote"
                  ? mdiHomeOutline
                  : jobDetails.setting === "On-Site"
                  ? mdiOfficeBuildingOutline
                  : mdiHomeCityOutline
              }
              title="User Profile"
              size={1}
              horizontal
              color="#E90000"
              vertical
              rotate={180}
            />
            <span style={{ color: "#555555" }}>{jobDetails?.setting}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplyJob;
