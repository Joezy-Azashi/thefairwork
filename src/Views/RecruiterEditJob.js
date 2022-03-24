import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Button,
  Paper,
  Card,
  CardContent,
  Snackbar,
  DialogActions,
  DialogContent,
  Dialog,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import MobileDatePicker from "@mui/lab/MobileDatePicker";
import { Editor } from "@tinymce/tinymce-react";
import tinymce from "tinymce/tinymce";
import { NavLink } from "react-router-dom";
import Icon from "@mdi/react";
import {
  mdiFileDocumentOutline,
  mdiCloseCircleOutline,
  mdiCalendar,
} from "@mdi/js";
import AddQuestion from "../Components/Job/AddQuestion";
import { getCurrentUser } from "../Services/auth";
import Api from "../Services/api";
import FileUploadService from "../Services/fileUpload";
import { ClipLoader } from "react-spinners";
import { Alert } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { fecthJobQuestions } from "../Services/redux/jobQuestions/index";
import { useDispatch } from "react-redux";
import { EditJob } from "../Services/redux/postJob/index";
import { getUserType } from "../Services/auth";
import moment from "moment";
import { useHistory } from "react-router-dom";

function RecruiterEditJob() {
  const location = useLocation();
  const history = useHistory();
  const jobData = location?.state?.params;
  const dispatch = useDispatch();
  const [id, setId] = useState(getCurrentUser().user.id);
  const [title, setTitle] = useState(jobData?.title);
  const [description, setDescription] = useState(jobData?.description);
  const [category, setCategory] = useState(jobData?.categoryId);
  const [type, setType] = useState(jobData?.type);
  const [start, setStart] = useState(jobData?.start);
  const [cost, setCost] = useState(jobData?.cost);
  const [isDraft, setIsDraft] = useState(false);
  const [userAccountType, setuserAccountType] = useState(
    getUserType().accountTypeId
  );
  const [fileLoading, setFileLoading] = useState(false);
  const [loading, setloading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [uploadFileName, setUploadFileName] = useState([]);
  const getQuestionUuid = localStorage.getItem("quesionUUId");
  const [jobStatus, setJobStatus] = useState("Posted");
  const [draftLoad, setDraftLoad] = useState(false);
  const [deleteQue, setQeleteQue] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editQuestionsData, seteditQuestionsData] = useState([]);
  const [loadEditor, setLoadEditor] = useState(true);
  const [filesNames, setfilesNames] = useState(
    jobData.JobFiles.map((item) => item.name)
  );

  const [editQuestionTag, seteditQuestionTag] = useState(
    jobData?.Questions[0]?.tag
  );
  const [befUpload, setbefUpload] = useState(
    jobData.JobFiles.map((item) => item.name)
  );
  const [skillCategories, setskillCategories] = useState([]);

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    setOpen(false);
  };

  const closeDeleteDia = () => {
    setOpenDeleteDialog(false);
  };

  const openDeleteDia = () => {
    setOpenDeleteDialog(true);
  };

  const closeDialog = () => {
    closeDeleteDia();
  };

  const handleclick = () => {
    history.push("/all-jobs");
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
            setfilesNames((prevArray) => {
              return [...prevArray, response.data];
            });
          })
          .catch((error) => {});
      }
    });
  };

  const handleTitle = (e) => {
    const input = e.target.value;
    setTitle(input);
  };

  const clearFile = (file) => {
    let filesClear = befUpload.filter((item) => item !== file);
    setbefUpload(filesClear);
    const newFiles = filesNames.filter((item) => item !== file);
    setfilesNames(newFiles);
  };

  const clearLocalStorage = () => {
    localStorage.clear();
  };

  const closeAlert = () => {
    setTimeout(() => {
      setAlert({
        open: false,
        message: "",
        severity: "",
      });
    }, 4000);
  };

  const editJob = async (e) => {
    e.preventDefault();
    const data = {
      id: jobData.id,
      userProfileId: jobData?.userProfileId,
      title: title === null ? jobData?.title : title,
      description: description === null ? jobData?.description : description,
      categoryId: category === null ? jobData?.category : category,
      type: type === null ? jobData?.type : type,
      start:
        start === null
          ? jobData?.start
          : moment(`${start}`).format("YYYY-MM-DD"),
      fileName: filesNames,
      status: jobStatus,
      isDraft,
      account_type: userAccountType,
      questions: [],
      userAccountId: jobData.userAccountId,
    };

    data.questions = JSON.parse(localStorage.getItem("allQuestions"));

    if (data.status === "Draft") {
      setloading(true);
      await dispatch(EditJob(data))
        .then(async (response) => {
          setloading(false);
          window.location.assign(
            userAccountType === 3 ? "/admin-all-jobs" : "all-jobs"
          );
        })
        .catch((error) => {});
      setloading(false);
    } else if (
      title === null ||
      title === "" ||
      description === null ||
      description === "" ||
      type === null ||
      type === "" ||
      category === null ||
      category === "" ||
      start === null ||
      start === ""
    ) {
      setAlert({
        message: "All fields are required except file upload and questions",
        severity: "error",
      });
      setOpen(true);
      closeAlert();
    } else {
      setloading(true);
      await dispatch(EditJob(data))
        .then(async (response) => {
          setloading(false);
          window.location.assign(
            userAccountType === 3 ? "/admin-all-jobs" : "all-jobs"
          );
        })
        .catch((error) => {});
      setloading(false);
    }

    setDraftLoad(false);
  };

  // API REQUEST TO DELETE QUESTIONS RELATING TO A JOB
  const deleteJobQuestion = () => {
    const data = {
      questionId: [deleteQue.id],
    };

    setloading(true);
    Api()
      .delete("/jobs/delete-question", { data })
      .then(async (response) => {
        setloading(false);
        setOpenDeleteDialog(false);
        await dispatch(
          fecthJobQuestions(editQuestionTag ? editQuestionTag : getQuestionUuid)
        )
          .then((response) => {
            editQuestionsData(response?.payload?.data);
            setloading(false);
            closeDialog();
          })
          .catch((error) => {});
      })
      .catch((error) => {
        setloading(false);
      });
  };

  const skillsCategories = () => {
    Api()
      .get(`/users/categories`)
      .then((response) => {
        setskillCategories(response?.data);
      })
      .catch((error) => {});
  };

  useEffect(async () => {
    skillsCategories();
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-md-12 mb-4">
          <h6 className="titleOnIpad pageTitle">
            <b>Edit Job</b>
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
                  autoHideDuration={3000}
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

              <div className="row text-center mt-2 mb-2">
                <div className="col-md-12">
                  <p style={{ color: "#707070" }}>
                    <b>Job Type</b>
                  </p>
                </div>
              </div>
              <form onSubmit={editJob}>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <Paper
                      className={
                        type === "1-month"
                          ? "RecpostJobPaper"
                          : "RecpostJobPaperAlt"
                      }
                    >
                      <label for="clientjob-type1" style={{ width: "100%" }}>
                        <div class="d-flex justify-content-end">
                          <input
                            type="radio"
                            id="clientjob-type1"
                            name="status"
                            value="1-month"
                            defaultChecked={type === "1-month"}
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
                  <div className="col-md-3 mb-3 d-flex justify-content-center">
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
                            defaultChecked={type === "3-month"}
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
                            defaultChecked={type === "6-month"}
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
                  <div className="col-md-3 d-flex justify-content-end mb-3">
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
                            defaultChecked={type === "12-month"}
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
                      asterisk
                      label="Project Title"
                      type="text"
                      variant="outlined"
                      style={{ textTransform: "capitalize" }}
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
                            "italic | bullist numlist outdent indent | " +
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
                  <div className="col-md-6 mb-3">
                    <TextField
                      id="type"
                      required
                      asterisk
                      File
                      upload
                      Questions
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
                  <div className="col-md-6 mb-3">
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

                <div className="row mt-4">
                  <p className="text-center" style={{ color: "#707070" }}>
                    <b>Job Attachments</b>
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
                      for="jobAttachmentsEdit"
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
                      for="jobAttachmentsEdit"
                      className="uploadHelpTextMobile text-center"
                    >
                      Tap here to upload files
                    </label>
                    <input
                      id="jobAttachmentsEdit"
                      placeholder="Upload files"
                      type="file"
                      variant="outlined"
                      size="small"
                      fullWidth
                      accept=".docx, .ppt, .xlxs, .doc, .pdf"
                      className="job-file-upload"
                      onChange={uploadImage}
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

                <div className="row mt-3">
                  <p className="text-center" style={{ color: "#707070" }}>
                    <b>Job Questions</b>{" "}
                  </p>
                  <p
                    className="text-center postjob-options"
                    style={{ fontSize: "12px" }}
                  >
                    Provide questions that will be answered by the freelancer.
                    You can add a maximum of 5 questions.
                  </p>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <AddQuestion
                      jobData={jobData.id}
                      jobDataQuestions={jobData.Questions}
                    />
                  </div>
                </div>

                <DialogActions className="justify-content-center">
                  <Button
                    variant="outlined"
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
                      onClick={() => setDraftLoad(false)}
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
                        <div style={{ marginRight: "5px" }}>
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

      {/* // CONTENT FOR DELETE QUESTION DIALOG STARTS FROM HERE */}
      <Dialog
        open={openDeleteDialog}
        onClose={closeDeleteDia}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
        className="dialogborder"
      >
        <DialogContent className="text-center">
          <p>Are you sure you want to delete this record?</p>

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
                onClick={deleteJobQuestion}
              >
                {loading && (
                  <div>
                    <ClipLoader size={15} color="#1b98e0" loading />
                  </div>
                )}
                {loading ? "" : "Yes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* // CONTENT FOR DELETE QUESTION DIALOG ENDS HERE */}
    </div>
  );
}

export default RecruiterEditJob;
