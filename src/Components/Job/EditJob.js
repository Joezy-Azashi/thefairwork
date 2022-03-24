import React, { useState, useEffect } from "react";
import {
  Button,
  DialogContent,
 

  InputAdornment,
  Snackbar,
  DialogActions,
} from "@material-ui/core";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import AddQuestion from "./AddQuestion";
import { getCurrentUser } from "../../Services/auth";
import Api from "../../Services/api";
import FileUploadService from "../../Services/fileUpload";
import {
  skillsCategory,
  ProjectCostUnit,
  ProjectDurationUnit,
  ProjectType,
} from "../../Services/validation";
import { Alert } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { ClipLoader } from "react-spinners";
import { questionReducer } from "../../Services/redux/jobQuestions/question_slice";
import { fecthJobQuestions } from "../../Services/redux/jobQuestions/index";
import { useDispatch, useSelector } from "react-redux";
import { jobsreducer } from "../../Services/redux/postJob/job_slice";
import { postEditJob, getJob } from "../../Services/redux/postJob/index";
import { getUserType } from "../../Services/auth";
import moment from "moment";

function EditJob({ handleClose, jobDeatailsToPass }) {
  const dispatch = useDispatch();
  const questions = useSelector(questionReducer);
  const jobs = useSelector(jobsreducer);
  const [id, setId] = useState(getCurrentUser().user.id);
  const [jobData, setJobData] = useState(jobDeatailsToPass);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [start, setStart] = useState("");
  const [cost, setCost] = useState("");
  const [projectDuration, setProjectDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState("");
  const [costUnit, setCostUnit] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [userAccountType, setuserAccountType] = useState(
    getUserType().accountTypeId
  );
  const [userProfile, setUserProfile] = useState([]);
  const [loading, setloading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [status, setStatus] = useState("");
  const getQuestionUuid = localStorage.getItem("quesionUUId");

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const closePostDialog = () => {
    handleClose();
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

  const handleCloseSnack = () => {
    setOpen(false);
  };

  const uploadImage = (event) => {
    if (event.target.files[0].size > 5000000) {
      setAlert({
        open: true,
        message: "File size can not be more than 5MB",
        severity: "error",
      });
      setOpen(true);
    } else {
      let url = `/upload-file-form`;
      FileUploadService.uploadGeneral(event.target.files[0], url)
        .then((response) => {
          setFileUrl(response);
        })
        .catch((error) => {});
    }
  };

  const getProfileData = async () => {
    Api()
      .get(`/users/get-user-profile/${id}`)
      .then((response) => {
        setUserProfile(response?.data);
      })
      .catch((error) => {});
  };

  const clearLocalStorage = () => {
    localStorage.clear();
  };

  const editJob = async (e) => {
    e.preventDefault();
    const data = {
      id: jobData.id,
      userProfileId: userProfile.id,
      title: title === "" ? jobData?.title : title.toLocaleLowerCase(),
      description: description === "" ? jobData?.description : description,
      category: category === "" ? jobData?.category : category,
      type: type === "" ? jobData?.type : type,
      start:
        start === "" ? jobData?.start : moment(`${start}`).format("YYYY-MM-DD"),
      cost: cost === "" ? jobData?.cost : cost,
      duration:
        projectDuration === "" ? jobData?.projectDuration : projectDuration,
      durationUnit: durationUnit === "" ? jobData?.durationUnit : durationUnit,
      costUnit: costUnit === "" ? jobData?.costUnit : costUnit,
      status: "Posted",
      isDraft,
      account_type: userAccountType,
      questions: [],
    };
    data.questions = questions.data;

    setloading(true);
    await dispatch(postEditJob(data))
      .then(async (response) => {
        setloading(false);
        window.location.assign("/all-jobs");
      })
      .catch((error) => {});
    setloading(false);
    clearLocalStorage();
    closePostDialog();
  };

  const fetchQuestion = async () => {
    await dispatch(fecthJobQuestions(getQuestionUuid))
      .then((response) => {})
      .catch((error) => {});
  };

  useEffect(async () => {
    getProfileData();
    fetchQuestion();
  }, []);

  return (
    <div>
      <form onSubmit={editJob}>
        <DialogContent>
          <div className="row justify-content-center text-center mt-3">
            <h6>
              <b>Edit Job</b>
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

          <div className="row mt-4">
            <div className="col-md-6 mb-4">
              <TextField
                id="jobTitle"
                placeholder="Job Title"
                label="Job Title"
                type="text"
                variant="outlined"
                size="small"
                fullWidth
                defaultValue={jobData?.title || ""}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-4">
              <TextField
                id="category"
                label="Category"
                select
                variant="outlined"
                size="small"
                fullWidth
                defaultValue={jobData?.category || ""}
                onChange={(e) => setCategory(e.target.value)}
              >
                {skillsCategory().map((cat) => {
                  return <MenuItem value={cat.name}>{cat.name}</MenuItem>;
                })}
              </TextField>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 mb-4">
              <TextField
                id="description"
                placeholder="Description"
                type="text"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                defaultValue={jobData?.description || ""}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <TextField
                id="type"
                label="Type"
                select
                variant="outlined"
                size="small"
                fullWidth
                defaultValue={jobData?.type || ""}
                onChange={(e) => setType(e.target.value)}
              >
                {ProjectType().map((cat) => {
                  return <MenuItem value={cat.name}>{cat.name}</MenuItem>;
                })}
              </TextField>
            </div>
            <div className="col-md-6 mb-4">
              <TextField
                id="startDate"
                placeholder="Start Date"
                label="Start Date"
                type="date"
                variant="outlined"
                size="small"
                fullWidth
                defaultValue={
                  moment(`${jobData?.start}`).format("YYYY-MM-DD") || ""
                }
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <p>
                <b>Project cost</b>
              </p>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <TextField
                    id="amount"
                    placeholder="Amount"
                    label="Amount"
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    defaultValue={jobData?.cost || ""}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <TextField
                    id="hours"
                    label="Hours"
                    select
                    variant="outlined"
                    size="small"
                    defaultValue={jobData?.costUnit || ""}
                    onChange={(e) => setCostUnit(e.target.value)}
                    fullWidth
                  >
                    {ProjectCostUnit().map((projectCost) => {
                      return (
                        <MenuItem value={projectCost.value}>
                          {projectCost.name}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <p>
                <b>Project duration</b>
              </p>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <TextField
                    id="number1"
                    placeholder="Number"
                    label="Number"
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    defaultValue={jobData?.duration || ""}
                    onChange={(e) => setProjectDuration(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <TextField
                    id="days"
                    label="Days"
                    select
                    defaultValue={jobData?.durationUnit || ""}
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={(e) => setDurationUnit(e.target.value)}
                  >
                    {ProjectDurationUnit().map((projectDuration) => {
                      return (
                        <MenuItem value={projectDuration.value}>
                          {projectDuration.name}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <TextField
                id="image"
                placeholder="Upload files"
                label="Upload files"
                type="file"
                variant="outlined"
                size="small"
                fullWidth
                className="hide-choose-button"
                onChange={uploadImage}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AttachFileIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <p>{jobData?.Questions.length <= 0 ? null : <b>Questions</b>}</p>
              {jobData?.Questions.length <= 0
                ? null
                : jobData?.Questions.map((que) => {
                    return (
                      <>
                        <p>{que?.question}</p>
                      </>
                    );
                  })}
            </div>
          </div>

          {/* <div className="row">
            <div className="col-md-12">
              <AddQuestion />
            </div>
          </div> */}

          <DialogActions className="justify-content-center">
            <Button
              variant="contained"
              className="btn mb-2"
              type="submit"
              onClick={editJob}
            >
              {loading && (
                <div style={{ marginRight: "5px" }}>
                  <ClipLoader size={20} color="#1b98e0" loading />
                </div>
              )}
              Save
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
    </div>
  );
}

export default EditJob;
