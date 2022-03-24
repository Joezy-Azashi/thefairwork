import React, { useState, useEffect } from "react";
import {
  DialogContent,
  TextField,
  Button,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import { ClipLoader } from "react-spinners";
import Api from "../../Services/api";
import { Alert } from "@material-ui/lab";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import FileUploadService from "../../Services/fileUpload";
import { mdiPaperclip, mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import { getCurrentUser } from "../../Services/auth";
import { useDispatch} from "react-redux";
import {getUserPortfolio} from "../../Services/redux/portfolio/index"

function AddPortfolio({ handleClose, portfolioToPass, editMode }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(
    portfolioToPass.title === undefined ? "" : portfolioToPass.title
  );
  const [link, setLink] = useState(
    portfolioToPass.link === "" ? "" : portfolioToPass.link
  );
  const [fileUrl, setFileUrl] = useState(
    portfolioToPass?.file?.length > 0 ? portfolioToPass?.file[0] : ""
  );
  const [fileName, setfileName] = useState(
    portfolioToPass?.file?.length > 0
      ? portfolioToPass?.file[0].split("/")[
          portfolioToPass?.file[0].split("/").length - 1
        ]
      : ""
  );
  const [newFileName, setNewFileName] = useState("");
  const [loading, setloading] = useState(false);
  const [fileLoading, setFileLoading] = useState(true);
  const [portData, setportData] = useState(portfolioToPass);
  const[selected,setSelected] = useState([])
    const [open, setOpen] = useState(false);
  const [accountId, setaccountId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const portfolioFileUrl = portData?.PortfolioFiles?.map((url) => {
    return url?.name;
  });

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

  const handleCloseSnack = () => {
    setOpen(false);
  };

  const [waiting, setWaiting] = useState(false);

  const fileValidation = (fileType) => {
    const acceptedExt = [
      "mp4",
      "pdf",
      "xlx",
      "xlsx",
      "csv",
      "jpg",
      "jpeg",
      "png",
      "jfif",
      "doc",
      "docx",
      "ppt",
      "pptx",
      "psd",
      "eps",
      "xd",
      "fig",
    ];
    return acceptedExt.findIndex(
      (item) => fileType.toLowerCase() === item.toLowerCase()
    );
  };

  const uploadImage = (event) => {
    setNewFileName(event.target.files[0]?.name);
  
    setSelected(URL.createObjectURL(event.target.files[0]))
    const fileType =
      event.target.files[0].name.split(".")[
        event.target.files[0].name.split(".").length - 1
      ];
    const result = fileValidation(fileType);
    if (result < 0) {
      setAlert({
        open: true,
        message: "invalid file type",
        severity: "error",
      });
      closeAlert();
    } else {
      setAlert({
        open: false,
        message: "",
        severity: "",
      });
    }

    if (event.target.files[0].size > 5000000) {
      setAlert({
        open: true,
        message: "File size can not be more than 5MB",
        severity: "error",
      });
      setOpen(true);
      closeAlert();
    } else {
      setWaiting(true);
      setFileLoading(true);
      const url = `/upload-file-form`;
      FileUploadService.uploadGeneral(event.target.files[0], url)
        .then((response) => {
          setFileUrl(response);
          setWaiting(false);
        })
        .catch((error) => {
        });
    }
 
  };


  const getUserPortfolios = async () => {
    await dispatch(getUserPortfolio(accountId))
  };

  const addOrUpdate = async () => {
    if (!editMode) {
      addPortfolio();
    } else {
      editPortfolio();
    }
  };

  //   API REQUEST TO ADD PORTFOLIO
  const addPortfolio = async (e) => {
    const data = {
      userAccountId: accountId,
      title: title,
      link: link,
      fileName: fileUrl.data,
    };
    if (title.trim().length === 0 || title === null || fileUrl.data === undefined) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Title and file inputs cannot be empty",
        severity: "error",
      });
      closeAlert();
    } else if(title.length > 99) {
      
    }else {
      setloading(true);
      Api()
        .post("/users/post-user-portfolio/", data)
        .then((response) => {
          setloading(false);
          setTimeout(async () => {
            await getUserPortfolios();
            handleClose()
          }, 200);
        })
        .catch((error) => {
          setloading(false);
          setOpen(true);
          setAlert({
            open: true,
            message: `${error.response.data.error}`,
            severity: "error",
          });
          closeAlert();
        });
    }
 
  };

  //   API REQUEST TO EDIT PORTFOLIO
  const editPortfolio = async (e) => {
    const data = {
      id: portData.id,
      userAccountId: accountId,
      title: title,
      link: link,
      fileName: fileUrl.data,
    };
    setloading(true);
    Api()
      .put("/users/update-user-portfolio/", data)
      .then((response) => {
        setloading(false);
        setTimeout(async () => {
          await getUserPortfolios();
          handleClose()
        }, 200);
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
         <div align="right">
        <Icon
          path={mdiClose}
          size={1}
          horizontal
          vertical
          className="close"
          onClick={() => {
            handleClose();
          }}
          rotate={180}
        />
      </div>
      <form onSubmit={addOrUpdate}>
        <DialogContent>
          <div className="d-flex justify-content-center">
            <h6>
              <b>{!editMode ? "Add Portfolio" : "Edit Portfolio"}</b>
            </h6>
          </div>
          <div>
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            open={open}
            autoHideDuration={4000}
            onClose={handleCloseSnack}
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
                  >
                  </IconButton>
                }
              >
                {alert.message}
              </Alert>
            </Snackbar>
          </div>

          <div className="row mt-3">
            <div className="col-md-12 mb-4">
              <TextField
                id="Title"
                required
                asterisk
                label="Title"
                type="text"
                variant="outlined"
                size="small"
                className=""
                multiline
                inputProps={{
                  maxLength: 100,
                }}
                disabled={title?.length > 100}
                fullWidth
                defaultValue={title || ""}
                onChange={(e) => setTitle(e.target.value)}
              />
              {
                title?.length > 99 ? (
                  <p style={{color: `red`}}>{` Maximun title limit is 100 characters`}</p>
                ) : ``
              }
            </div>
          </div>

          
          <div className="row">
            <div className="col-md-6 mb-4 mt-1">
              <TextField
                id="portfolioLink"
                label="Portfolio link"
                type="text"
                variant="outlined"
                size="small"
                className=""
                fullWidth
                defaultValue={link || ""}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-4">
              {!editMode ? (
                <div className="mt-1">
                  <TextField
                    id="image"
                    type="file"
                    label=" " 
                    variant="outlined"
                    size="small"
                    fullWidth
                    className="hide-choose-button"
                    // value={fileName || ""}
                    onChange={uploadImage}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <AttachFileIcon style={{color: "#707070"}}/>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              ) : (
                <div className="d-flex pt-1">
                  <label className="edit-label-length">
                    <p className="potfolioFileName">
                      {newFileName ? newFileName : fileName}
                    </p>
                    <TextField
                      id="image"
                      type="file"
                      label=""
                      variant="outlined"
                      size="small"
                      fullWidth
                      style={{ display: "none" }}
                      className="hide-choose-button"
                      onChange={uploadImage}
                    />
                  </label>
                  <Icon
                    path={mdiPaperclip}
                    title="attachment"
                    size={1}
                    horizontal
                    vertical
                    rotate={180}
                    color="#707070"
                    className="attachmentIcon"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-center mt-3">
            {waiting ? (
              <Button variant="contained" className="btn">
                {fileLoading && (
                  <div style={{ marginRight: "5px" }}>
                    <ClipLoader size={20} color="#1b98e0" loading />
                  </div>
                )}
                Uploading file
              </Button>
            ) : (
              <Button
                variant="contained"
                className="btn"
                disabled={title?.length > 100}
                onClick={addOrUpdate}
              >
                {loading && (
                  <div style={{ marginRight: "5px" }}>
                    <ClipLoader size={20} color="#1b98e0" loading />
                  </div>
                )}
                {!editMode ? "Add Portfolio" : "Save"}
              </Button>
            )}
          </div>
        </DialogContent>
      </form>
    </div>
  );
}

export default AddPortfolio;
