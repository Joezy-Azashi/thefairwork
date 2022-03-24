import React, { useEffect, useState } from "react";
import { Button, DialogContent, Dialog, Snackbar } from "@material-ui/core";
import Api from "../../Services/api";
import { ClipLoader } from "react-spinners";
import { getUserType } from "../../Services/auth";
import { useDispatch } from "react-redux";
import { archiveRecruiterJob } from "../../Services/redux/postJob/index";

function ArchiveJob({  archiveId, closeDeleteDia }) {
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [userAccountType, setuserAccountType] = useState(
    getUserType().accountTypeId
  );

  const closeDialog = () => {
    closeDeleteDia();
  };

  const dispatch = useDispatch();
  const archiveJob = async () => {
    const data = {
      jobId: [archiveId],
    };
    setloading(true);
    await dispatch(archiveRecruiterJob(data))
      .then((response) => {
        setloading(false);
        closeDialog();
        window.location.assign("/all-jobs");
      })
      .catch((error) => {
        setloading(false);
      });
  };
  return (
    <div>
      <DialogContent className="text-center">
        {archiveId?.length > 1 ? (
          <p>Are you sure you want to archive these records?</p>
        ) : (
          <p>Are you sure you want to archive this record?</p>
        )}
        <div className="row justify-content-center text-center">
          <div className="col-md-6 mb-2" align="right">
            <Button
              variant="outlined"
              className="btn w-100"
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
  );
}

export default ArchiveJob;
