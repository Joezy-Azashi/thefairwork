import React, { useState } from "react";
import Icon from "@mdi/react";
import {
  mdiBriefcaseAccountOutline,
  mdiAccountClockOutline,
  mdiCloudDownloadOutline,
  mdiChevronRight,
} from "@mdi/js";
import {
  Dialog,
  DialogContent,
  Button,
  DialogActions,
} from "@material-ui/core";
import ArchiveJob from "./ArchiveJob";
import { useHistory } from "react-router-dom";

function JobDetails({ jobDetailsData, handleCloseJobDetails }) {
  const history = useHistory();
  const [openEditJob, setOpenEditJob] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [jobDetailsToPass, setJobDetailsToPass] = useState();
  const [archiveId, setArchiveId] = useState(jobDetailsData.id);
  const [length, setLength] = useState([jobDetailsData]);

  const openDeleteDia = () => {
    setOpenDeleteDialog(true);
  };

  const closeDeleteDia = () => {
    setOpenDeleteDialog(false);
  };

  const closeDiag = () => {
    handleCloseJobDetails();
  };

  const handleclick = () => {
    history.push("/edit-jobs", { params: jobDetailsData });
  };

  const handleClick = (id) => {
    history.push("/applicants", { params: id });
  };

  return (
    <DialogContent
      style={{
        position: "fixed",
        right: "0",
        top: "70px",
        height: "90%",
        backgroundColor: "white",
        padding: "0",
        overflowY: "scroll",
        boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px",
      }}
      className="candidateDetail"
    >
      <div className="p-4 pt-4">
        <Button
          className="detailCloseIcon"
          style={{ position: "relative", left: "-24px" }}
          onClick={closeDiag}
        >
          <Icon
            path={mdiChevronRight}
            color="#2E405B"
            title="Close"
            size={1}
            horizontal
            vertical
            rotate={180}
            className="mt-1"
          />
        </Button>
        <div className="row">
          <div className="col-md-12 text-center">
            <p>
              <b className="job-title">{jobDetailsData?.title}</b>
            </p>
          </div>
        </div>

        <div className="d-flex justify-content-around">
          <div className="col-md-3 mb-2 text-center">
            <Icon
              path={mdiBriefcaseAccountOutline}
              title="Project Type"
              size={1}
              horizontal
              vertical
              color="#2E405B"
              rotate={180}
            />
            <p>{jobDetailsData?.type}</p>
          </div>

          <div className="col-md-3 mb-2 text-center">
            <Icon
              path={mdiAccountClockOutline}
              title="Category"
              size={1}
              horizontal
              vertical
              color="#2E405B"
              rotate={180}
            />
            <p>{jobDetailsData?.Category?.category}</p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mb-2">
            <p>
              <b>Job Description</b>
            </p>

            <p>{jobDetailsData?.description}</p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mb-2">
            {jobDetailsData?.JobFiles?.length <= 0 ? null : (
              <p>
                <b>Attachments</b>
              </p>
            )}

            {jobDetailsData?.JobFiles?.map((files, index) => {
              return (
                <div className="d-flex justify-content-between">
                  <p key={index} className="fileNameDetail">
                    {files.splitName}
                  </p>
                  <a href={files.name} download>
                    <Icon
                      path={mdiCloudDownloadOutline}
                      title="Type"
                      size={1}
                      horizontal
                      vertical
                      color="#2E405B"
                      rotate={180}
                    />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mb-2">
            {jobDetailsData?.Questions?.length <= 0 ? null : (
              <p>
                <b>Questions</b>
              </p>
            )}

            {jobDetailsData?.Questions?.length <= 0
              ? null
              : jobDetailsData?.Questions?.map((que, i) => {
                  return (
                    <>
                      <p>
                        {i + 1}. {que?.question}
                      </p>
                    </>
                  );
                })}
          </div>
        </div>
        <p>Applicants</p>
        {length &&
          length.map((job) => (
            <div className="d-flex justify-content-between">
              <div>
                <p>
                  {job.JobApplications.length > 1
                    ? job.JobApplications.length + " applicants"
                    : job.JobApplications.length + " applicant"}
                </p>
              </div>
              <a
                onClick={() => handleClick(jobDetailsData)}
                style={{
                  color: "#2E405B",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                View Applicants
              </a>
            </div>
          ))}
        <DialogActions className="justify-content-center">
          <Button
            className="w-25"
            variant="outlined"
            color="primary"
            onClick={() => {
              handleclick();
              setJobDetailsToPass(jobDetailsData);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={openDeleteDia}
            className="w-25"
          >
            archive
          </Button>
        </DialogActions>
      </div>

      <Dialog
        open={openDeleteDialog}
        onClose={closeDeleteDia}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
        className="dialogborder"
      >
        <ArchiveJob archiveId={archiveId} closeDeleteDia={closeDeleteDia} />
      </Dialog>
    </DialogContent>
  );
}

export default JobDetails;
