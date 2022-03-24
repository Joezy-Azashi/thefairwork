import React, { useState, useEffect } from "react";
import {
  Button,
  Paper,
  Card,
  CardContent,
  Snackbar,
  DialogActions,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import MobileDatePicker from "@mui/lab/MobileDatePicker";
import { Editor } from "@tinymce/tinymce-react";
import tinymce from "tinymce/tinymce";
import AddQuestion from "../Components/Job/AddQuestion";
import { getCurrentUser } from "../Services/auth";
import Api from "../Services/api";
import FileUploadService from "../Services/fileUpload";
import { ClipLoader } from "react-spinners";
import { Alert } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import { useDispatch } from "react-redux";
import { postJob } from "../Services/redux/postJob/index";
import { getUserType } from "../Services/auth";
import moment from "moment";
import { useHistory } from "react-router-dom";
import {
  mdiFileDocumentOutline,
  mdiCloseCircleOutline,
  mdiCalendar,
} from "@mdi/js";
import Icon from "@mdi/react";

function RecruiterPostJobs() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [id, setId] = useState(getCurrentUser().user.id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(null);
  const [category, setCategory] = useState(null);
  const [type, setType] = useState("1-month");
  const [start, setStart] = useState(new Date());
  const [isDraft, setIsDraft] = useState(false);
  const [userAccountType, setuserAccountType] = useState(
    getUserType().accountTypeId
  );
  const [email, setemail] = useState(getCurrentUser().user?.UserProfile?.email);
  const firstname = getCurrentUser().user?.UserProfile?.firstname;
  const lastname = getCurrentUser().user?.UserProfile?.lastname;
  const [userProfile, setUserProfile] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const [uploadFileName, setUploadFileName] = useState([]);
  const [loading, setloading] = useState(false);
  const [uploadedFiles, setuploadedFiles] = useState([]);
  const [befUpload, setbefUpload] = useState([]);
  const [fileLoading, setFileLoading] = useState(false);
  const [skillCategories, setskillCategories] = useState([]);
  const [jobStatus, setJobStatus] = useState("Posted");
  const [draftLoad, setDraftLoad] = useState(false);
  const [loadEditor, setLoadEditor] = useState(false);
  const [readValue, setReadValue] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [showErrorIndicator, setshowErrorIndicator] = useState(false);

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;

  const handleclick = () => {
    history.push("/all-jobs");
  };

  const handleClose = () => {
    setTimeout(() => {
      setOpen(false);
    }, 1500);
  };

  const handleTitle = (e) => {
    const input = e.target.value;
    setTitle(input);
  };

  const clearFile = (file) => {
    let filesClear = befUpload.filter((item) => item !== file);
    setbefUpload(filesClear);
    setuploadedFiles(filesClear);
  };

  const uploadImage = (event) => {
    let fileList = event.target.files;

    Array.from(fileList).map((file) => {
      if (file.size > 10000000) {
        setAlert({
          open: true,
          message: "File size can not be more than 10 MB",
          severity: "error",
        });
        setOpen(true);
      } else {
        setUploadFileName(event.target.files[0]);
        setloading(true);
        setFileLoading(true);
        let url = `/upload-file-form`;
        FileUploadService.uploadGeneral(event.target.files[0], url)
          .then((response) => {
            setFileUrl(response);
            setloading(false);
            setFileLoading(false);
            setbefUpload((prevArray) => {
              return [...prevArray, response.data];
            });
            setuploadedFiles((prevArray) => {
              return [...prevArray, response.data];
            });
          })
          .catch((error) => {});
      }
    });
  };

  const getProfileData = async () => {
    Api()
      .get(`/users/get-user-profile/${id}`)
      .then((response) => {
        setUserProfile(response?.data);
      })
      .catch((error) => {});
  };

  const handleStart = (e) => {
    setStart(e.target.value);
  };

  const recruiterPostJob = async (e) => {
    e.preventDefault();
    const data = {
      title: title,
      description: description,
      categoryId: category,
      type: type,
      start: start,
      email: email,
      name: firstname + " " + lastname,
      fileName: uploadedFiles,
      status: jobStatus,
      isDraft,
      account_type: userAccountType,
      questions: [],
      userAccountId: id,
    };

    data.questions = JSON.parse(localStorage.getItem("allQuestions"));
    if (data.status === "Draft") {
      setloading(true);
      await dispatch(postJob(data))
        .then(async (response) => {
          setloading(false);
          window.location.assign("/all-jobs");
        })
        .catch((error) => {
          setloading(false);
        });
    } else if (title === "") {
      setshowErrorIndicator(true);
    } else if (category === null) {
      setshowErrorIndicator(true);
    } else if (start === null) {
      setshowErrorIndicator(true);
    } else if (
      title === "" ||
      description === null ||
      type === null ||
      category === null ||
      start === null
    ) {
      setAlert({
        open: true,
        message: "All fields are required except file upload and questions",
        severity: "error",
      });
      setOpen(true);
      handleClose();
    } else {
      setloading(true);
      await dispatch(postJob(data))
        .then(async (response) => {
          setloading(false);
          window.location.assign("/all-jobs");
        })
        .catch((error) => {
          setloading(false);
        });
    }
    setDraftLoad(false);
  };

  //Api request to save draft

  const skillsCategories = () => {
    Api()
      .get(`/users/categories`)
      .then((response) => {
        setskillCategories(response?.data);
      })
      .catch((error) => {});
  };

  const handleOneMonth = () => {
    setType("1-month");
  };

  useEffect(async () => {
    getProfileData();
    skillsCategories();
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-md-12 mb-4">
          <h6 className="titleOnIpad pageTitle">
            <b>Post Job</b>
          </h6>
        </div>
      </div>

      <div className="row justify-content-center mt-2">
        <div className="col-md-12 d-flex justify-content-center">
          <Card
            className="post-job-card mb-5"
            style={{
              borderRadius: "6px",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
            }}
          >
            <CardContent>
              <div>
                <Snackbar
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={open}
                  autoHideDuration={4000}
                  onClose={handleClose}
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

              <div className="row text-center mb-2">
                <div className="col-md-12">
                  <p style={{ color: "#707070" }}>
                    <b>Job Type</b>
                  </p>
                </div>
              </div>
              <form onSubmit={recruiterPostJob}>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <Paper
                      className={
                        type === "1-month"
                          ? "RecpostJobPaper"
                          : "RecpostJobPaperAlt"
                      }
                      onClick={(e) => {
                        handleOneMonth();
                      }}
                    >
                      <label for="clientjob-type1" style={{ width: "100%" }}>
                        <div class="d-flex justify-content-end">
                          <input
                            type="radio"
                            id="clientjob-type1"
                            name="status"
                            defaultChecked
                            value="1-month"
                            onChange={(e) => setType(e.target.value)}
                          />
                        </div>
                        <p className="text-center" style={{ fontSize: "15px" }}>
                          <b>1-month</b>
                        </p>
                        <p className="text-center" style={{ fontSize: "11px" }}>
                          This job will last a period of one month
                        </p>
                      </label>
                    </Paper>
                  </div>
                  <div className="col-md-3 d-flex justify-content-center mb-3">
                    <Paper
                      className={
                        type === "3-month"
                          ? "RecpostJobPaper threemonthsPostJob"
                          : "RecpostJobPaperAlt threemonthsPostJob"
                      }
                    >
                      <label for="clientjob-type2" style={{ width: "100%" }}>
                        <div class="d-flex justify-content-end">
                          <input
                            type="radio"
                            id="clientjob-type2"
                            name="status"
                            value="3-month"
                            onChange={(e) => setType(e.target.value)}
                          />
                        </div>
                        <p className="text-center" style={{ fontSize: "15px" }}>
                          <b>3-month</b>
                        </p>
                        <p className="text-center" style={{ fontSize: "11px" }}>
                          This job will last a period of three months
                        </p>
                      </label>
                    </Paper>
                  </div>
                  <div className="col-md-3 d-flex justify-content-center mb-3">
                    <Paper
                      className={
                        type === "6-month"
                          ? "RecpostJobPaper sixmonthsPostJob"
                          : "RecpostJobPaperAlt sixmonthsPostJob"
                      }
                    >
                      <label for="clientjob-type3" style={{ width: "100%" }}>
                        <div class="d-flex justify-content-end">
                          <input
                            type="radio"
                            id="clientjob-type3"
                            name="status"
                            value="6-month"
                            onChange={(e) => setType(e.target.value)}
                          />
                        </div>
                        <p className="text-center" style={{ fontSize: "15px" }}>
                          <b>6-month</b>
                        </p>
                        <p className="text-center" style={{ fontSize: "11px" }}>
                          This job will last a period of six months
                        </p>
                      </label>
                    </Paper>
                  </div>
                  <div className="col-md-3 d-flex justify-content-end">
                    <Paper
                      className={
                        type === "12-month"
                          ? "RecpostJobPaper"
                          : "RecpostJobPaperAlt"
                      }
                    >
                      <label for="clientjob-type4" style={{ width: "100%" }}>
                        <div class="d-flex justify-content-end">
                          <input
                            type="radio"
                            id="clientjob-type4"
                            name="status"
                            value="12-month"
                            onChange={(e) => setType(e.target.value)}
                          />
                        </div>
                        <p className="text-center" style={{ fontSize: "15px" }}>
                          <b>12-month</b>
                        </p>
                        <p className="text-center" style={{ fontSize: "11px" }}>
                          This job will last a period of 12 months
                        </p>
                      </label>
                    </Paper>
                  </div>
                </div>

                <div className="row mt-4">
                  <p className="text-center mb-4" style={{ color: "#707070" }}>
                    <b>Job Details</b>
                  </p>
                  <div className="col-md-12 mb-4">
                    <TextField
                      id="jobTitle"
                      required
                      // error= { title === "" ? showErrorIndicator : ``}
                      label="Job Title"
                      type="text"
                      variant="outlined"
                      size="small"
                      className=""
                      fullWidth
                      value={title}
                      onChange={handleTitle}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mb-4">
                    {loadEditor && (
                      <div className="d-flex justify-content-center align-item-center mt-5">
                        <ClipLoader size={40} color="#1b98e0" loading />
                      </div>
                    )}

                    <div>
                      <Editor
                        apiKey="jnq6bu3a3gvvn2nvdtz5e65m7ffttui7jqw5pgo6wvksdzo1"
                        value={description}
                        onInit={() => {
                          setLoadEditor(false);
                        }}
                        init={{
                          height: 170,
                          menubar: false,
                          resize: false,
                          statusbar: false,
                          theme_advanced_buttons1_add: "media",
                          label: "Job Description",
                          placeholder: "Job Description *",
                          plugins: [
                            "advlist autolink lists link image media charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste code help wordcount",
                            "paste",
                          ],
                          automatic_uploads: true,
                          relative_urls: true,
                          font_formats: "Segoe UI=Segoe UI,sans-serif;",

                          toolbar:
                            "undo redo |" +
                            " italic | bullist numlist outdent indent | " +
                            "removeformat | help ",

                          image_title: true,

                          file_picker_types: "image media",

                          file_picker_callback: function (cb, value, meta) {
                            var input = document.createElement("input");
                            input.setAttribute("type", "file");
                            input.setAttribute("accept", "");

                            input.onchange = function () {
                              var file = this.files[0];

                              var reader = new FileReader();
                              reader.onload = function () {
                                var id = "blobid" + new Date().getTime();
                                var blobCache =
                                  tinymce.activeEditor.editorUpload.blobCache;
                                var base64 = reader.result.split(",")[1];
                                var blobInfo = blobCache.create(
                                  id,
                                  file,
                                  base64
                                );
                                blobCache.add(blobInfo);

                                cb(blobInfo.blobUri(), { title: file.name });
                              };
                              reader.readAsDataURL(file);
                            };

                            input.click();
                          },
                          content_style:
                            "body { font-family: Segoe UI=Segoe UI,sans-serif}",
                        }}
                        onEditorChange={(value) => {
                          setDescription(value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <TextField
                      required
                      id="type"
                      asterisk
                      // error={category === null ? showErrorIndicator : ``}
                      label="Category"
                      select
                      variant="outlined"
                      size="small"
                      className=""
                      fullWidth
                      value={category}
                      style={{ textTransform: "capitalize" }}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {skillCategories.map((cat) => {
                        return (
                          <MenuItem
                            style={{ textTransform: "capitalize" }}
                            value={cat.id}
                          >
                            {cat.category}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </div>
                  <div className="col-md-6 mb-4">
                    <label style={{ display: "inline" }}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDatePicker
                          showToolbar={true}
                          className=""
                          fullWidth
                          value={start}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              variant="outlined"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              label="Start Date"
                              onKeyDown={(e) => e.preventDefault()}
                            />
                          )}
                          minDate={new Date()}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Icon
                                  path={mdiCalendar}
                                  size={1}
                                  horizontal
                                  vertical
                                  style={{ cursor: "pointer" }}
                                  color="#808080"
                                  rotate={180}
                                />
                              </InputAdornment>
                            ),
                          }}
                          onChange={(e) => setStart(e)}
                        />
                      </LocalizationProvider>
                    </label>
                  </div>
                </div>

                <div className="row mt-3">
                  <p className="text-center" style={{ color: "#707070" }}>
                    <b>Job Attachments</b>{" "}
                    <span className="postjob-options">(optional)</span>
                  </p>
                  <p
                    className="text-center postjob-options mb-0"
                    style={{ fontSize: "12px" }}
                  >
                    Upload documents with pdf, docx, ppt, xlxs extensions.
                    Maximum file size should be 10MB
                  </p>
                  <div
                    className="col-md-12 text-center"
                    style={{ marginTop: "-15px" }}
                  >
                    <label
                      for="jobAttachments"
                      className="uploadHelpText"
                      style={{ fontSize: "12px", cursor: "pointer" }}
                    >
                      Drag your files here or{" "}
                      <span style={{ color: "#0C4767", opacity: "70%" }}>
                        click here
                      </span>{" "}
                      to upload files
                    </label>
                    <label
                      for="jobAttachments"
                      className="uploadHelpTextMobile text-center"
                    >
                      Tap here to upload files
                    </label>
                    <input
                      id="jobAttachments"
                      type="file"
                      variant="outlined"
                      size="small"
                      accept=".docx, .ppt, .pptx, .xlx, .xlxs, .doc, .pdf"
                      className="job-file-upload"
                      onChange={uploadImage}
                      multiple="allowMultiple"
                    />
                    {befUpload?.map((file) => {
                      return (
                        <div className="d-flex mt-1">
                          <Icon
                            path={mdiFileDocumentOutline}
                            title="File name"
                            size={1}
                            horizontal
                            vertical
                            rotate={180}
                            color="#707070"
                          />
                          <div className="row">
                            <p className="col-md-12 mt-1">{file?.slice(55)}</p>
                          </div>
                          <div>
                            <Icon
                              path={mdiCloseCircleOutline}
                              title="Delete"
                              size={0.9}
                              horizontal
                              vertical
                              rotate={180}
                              color="red"
                              className="p-1 mt-1"
                              onClick={() => {
                                clearFile(file);
                              }}
                              style={{ marginLeft: "10px" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="row mt-4">
                  <p className="text-center" style={{ color: "#707070" }}>
                    <b>Job Questions</b>{" "}
                    <span className="postjob-options">(optional)</span>
                  </p>
                  <p
                    className="text-center postjob-options"
                    style={{ fontSize: "12px" }}
                  >
                    Provide questions that will be answered by the freelancer.
                    You can add a maximum of 5 questions
                  </p>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <AddQuestion />
                  </div>
                </div>

                <DialogActions className="justify-content-center">
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{
                      width: "100px",
                      color: "#2E405B",
                      border: "1px solid #2E405B",
                    }}
                    onClick={() => {
                      handleclick();
                    }}
                  >
                    Back
                  </Button>
                  {fileLoading ? (
                    <Button variant="contained" className="btn">
                      <div style={{ marginRight: "5px" }}>
                        <ClipLoader size={15} color="#1b98e0" loading />
                      </div>
                      Uploading file(s)
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      className="btn"
                      style={{ width: "100px" }}
                      type="submit"
                      disabled={loading}
                      onClick={() => {
                        setDraftLoad(false);
                      }}
                    >
                      {loading && !draftLoad && (
                        <div>
                          <ClipLoader size={15} color="#1b98e0" loading />
                        </div>
                      )}
                      {loading ? "" : "Publish"}
                      {draftLoad ? "Publish" : null}
                    </Button>
                  )}
                </DialogActions>
                <div className="justify-content-center mt-2">
                  <p
                    style={{
                      fontFamily: "Segoe UI,sans-serif",
                      marginLeft: "6px",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    Not ready to post yet?{" "}
                    <span>
                      <button
                        className="draft-button"
                        type="submit"
                        onClick={() => {
                          setJobStatus("Draft");
                          setDraftLoad(true);
                        }}
                      >
                        Save as Draft
                      </button>
                    </span>
                    <span>
                      {loading && draftLoad && !fileLoading && (
                        <div>
                          <ClipLoader size={15} color="#1b98e0" loading />
                        </div>
                      )}
                    </span>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RecruiterPostJobs;
