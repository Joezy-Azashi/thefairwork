import React, { useState, useEffect } from "react";
import { DialogContent, Button, Snackbar } from "@material-ui/core";
import FileUploadService from "../Services/fileUpload";
import { ClipLoader } from "react-spinners";
import { Alert } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@mdi/react";
import { mdiCloseCircleOutline } from "@mdi/js";

function ProfileImageUpload({ handleClose, profileId }) {
  const [file, setFile] = useState("");
  const [imagePreview, setFilePreview] = useState("");
  const [loading, setloading] = useState(false);

  const pageURL = window.location.href;

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const closeAlert = () => {
    setTimeout(() => {
      setAlert({
        open: false,
        message: "",
        severity: "",
      });
    }, 4000);
  };

  const closeSnackbar = () => {
    setOpen(false);
  };

  const getImage = (event) => {
    setFile(event.target.files[0]);
    setFilePreview(URL.createObjectURL(event.target.files[0]));
  };

  const cancelImage = (event) => {
    setFile(null);
    setFilePreview(null);
    handleClose();
  };

  const closeImage = (event) => {
    setFile(null);
    setFilePreview(null);
  };

  const uploadImage = (event) => {
    event.preventDefault();
    setloading(true);
    let url = `/users/upload-profile-picture/${profileId}`;
    setloading(true);
    FileUploadService.upload(file, url)
      .then((response) => {
        setloading(false);
        handleClose();
        window.location.reload();
      })
      .catch((error) => {
        setloading(false);
        setAlert({
          open: true,
          message: `${error.response.data.error}`,
          severity: "error",
        });
        setOpen(true);
        closeAlert();
      });
  };

  return (
    <div className="card-padding">
      <DialogContent>
        <h4 className="text-center">Upload Profile Image</h4>
        <div>
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            open={open}
            autoHideDuration={4000}
            onClose={closeSnackbar}
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
                ></IconButton>
              }
            >
              {alert.message}
            </Alert>
          </Snackbar>
        </div>
        {imagePreview && (
          <div className="d-flex justify-content-center mt-3 mb-4">
            <img className="preview" src={imagePreview} alt="" />
            <Icon
              path={mdiCloseCircleOutline}
              title="Delete"
              size={1}
              horizontal
              vertical
              rotate={180}
              color="red"
              style={{ position: "relative", right: "0" }}
              onClick={closeImage}
            />
          </div>
        )}

        {imagePreview ? (
          ""
        ) : (
          <div className="d-flex justify-content-center text-center mt-4 mb-5">
            <label for="image" className="uploadHelpTextImgWeb text-center">
              Drag a picture into the box or{" "}
              <span style={{ color: "#0C4767", opacity: "70%" }}>
                click here
              </span>{" "}
              to upload profile image
            </label>
            <label for="image" className="uploadHelpTextImgMobile text-center">
              Tap here to upload profile image
            </label>
            <input
              type="file"
              id="image"
              className="profileImgUpload"
              accept="image/x-png,image/gif,image/jpeg, image/jpg"
              onChange={getImage}
            />
          </div>
        )}

        <div className="row justify-content-center text-center">
          <div className="col-md-6 mb-3" align="left">
            <Button
              variant="contained"
              className="btn w-100"
              onClick={cancelImage}
            >
              Cancel
            </Button>
          </div>
          <div className="col-md-6 mb-2" align="right">
            <Button variant="outlined" className="w-100" onClick={uploadImage}>
              {loading && (
                <div>
                  <ClipLoader size={15} color="#1b98e0" loading />
                </div>
              )}
              {loading ? "" : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </div>
  );
}

export default ProfileImageUpload;
