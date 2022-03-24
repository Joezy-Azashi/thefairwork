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
  IconButton,
  InputAdornment
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
import { getUserType } from "../Services/auth";
import moment from "moment";
import { useHistory } from "react-router-dom";
import {
  mdiFileDocumentOutline,
  mdiHomeOutline,
  mdiOfficeBuildingOutline,
  mdiHomeCityOutline,
  mdiCloseCircleOutline,
  mdiCalendar
} from "@mdi/js";
import { NavLink } from "react-router-dom";
import Icon from "@mdi/react";
import { localEditJob } from "../Services/redux/postJob/index";
import { MultiSelect } from "react-multi-select-component";
import { ConvertedCities } from "../Services/validation";


function RecruiterLocalEditJob() {
  const [jobDetails, setJobDetails] = useState(
    JSON.parse(localStorage.getItem("recruiterJobs")) !== null
      ? JSON.parse(localStorage.getItem("recruiterJobs"))
      : []
  );

  const history = useHistory();
  const dispatch = useDispatch();
  const [id, setId] = useState(getCurrentUser().user.id);
  const [email, setemail] = useState(getCurrentUser().user?.UserProfile?.email);
  const [title, setTitle] = useState(jobDetails?.title);
  const [description, setDescription] = useState(jobDetails?.description);
  const [category, setCategory] = useState(jobDetails?.IndustryCategory?.id);
  const [loadEditor, setLoadEditor] = useState(true);
  const [freelancerCategory, setfreelancerCategory] = useState(
    jobDetails?.Category?.id
  );
  const [industry, setindustry] = useState(
    ![null, ""].includes(jobDetails?.freelancerCategoryId)
      ? "it-freelance-cat"
      : jobDetails?.MainIndustry?.id
  );
  const [filesNames, setfilesNames] = useState(jobDetails.JobFiles.map((item) => item.name))
  const [type, setType] = useState(jobDetails?.type);
  const [workSetting, setworkSetting] = useState(jobDetails?.setting);
  const [start, setStart] = useState(jobDetails?.start);
  const [city, setcity] = useState(jobDetails?.cities);
  const [salary, setsalary] = useState(jobDetails?.salary);
  const [userAccountType, setuserAccountType] = useState(
    getUserType().accountTypeId
  );
  const [userProfile, setUserProfile] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const [uploadFileName, setUploadFileName] = useState([]);
  const [loading, setloading] = useState(false);
  const [befUpload, setbefUpload] = useState(jobDetails.JobFiles.map((item) => item.name));
  const [fileLoading, setFileLoading] = useState(false);
  const [indutries, setindutries] = useState([]);
  const [categories, setcategories] = useState([]);
  const [subCategories, setsubCategories] = useState([]);
  const [cities, setcities] = useState([]);
  const [jobStatus, setJobStatus] = useState("Posted");
  const [citiId, setSelectCities] = useState([]);
  const [draftLoad, setDraftLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    setOpen(false);
  };

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
    history.push("/recruiter-all-jobs");
  };

  const getCities = async () => {
    Api()
      .get("/local-job/cities")
      .then((response) => {
        setcities(ConvertedCities(response?.data?.result));
      })
      .catch((error) => {});
  };

  const clearFile = (file) => {
    let filesClear = befUpload.filter(
      (item) => item !== file
    );
    setbefUpload(filesClear)
    const newFiles = filesNames.filter(item => item !== file)
    setfilesNames(newFiles)
  }


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

  const getProfileData = async () => {
    Api()
      .get(`/users/get-user-profile/${id}`)
      .then((response) => {
        setUserProfile(response?.data?.user);
      })
      .catch((error) => {});
  };

  const editJob = async (e) => {
    e.preventDefault();
    const data = {
      id: jobDetails.id,
      userProfileId: userProfile.id,
      title: title,
      description: description,
      categoryId: category === "" ? null : category,
      type: type,
      setting: workSetting,
      start: start,
      city: citiId.length <= 0 ? null : citiId,
      oldCity: citiId.length <= 0 ? null : city,
      salary: salary,
      industryId:
        industry === "it-freelance-cat" || industry === "" ? null : industry,
      freelancerCategoryId:
        freelancerCategory === "" ? null : freelancerCategory,
      isDraft: false,
      status: jobStatus,
      fileName: filesNames,
      account_type: userAccountType,
      questions: [],
      email: email,
      name:
        userProfile?.UserProfile?.firstname +
        " " +
        userProfile?.UserProfile?.lastname,
      userAccountId: jobDetails.userAccountId,
    };

    data.questions = JSON.parse(localStorage.getItem("allQuestions"));
    

    if (data.status === "Draft") {
      setloading(true);
      await dispatch(localEditJob(data))
        .then(async (response) => {
          setloading(false);
          window.location.assign(
            userAccountType === 3 ? "/admin-all-jobs" : "/recruiter-all-jobs"
          );
        })
        .catch((error) => {
          setloading(false);
        });
    } else if (
      title === "" ||
      title === null ||
      description === "" ||
      description === null ||
      type === "" ||
      type === null ||
      category === "" ||
      (category === null && freelancerCategory === "") ||
      freelancerCategory === null ||
      start === "" ||
      start === null ||
      city === "" ||
      city === null ||
      salary === "" ||
      salary === null ||
      workSetting === "" ||
      workSetting === null
    ) {
      setAlert({
        open: true,
        message: "All fields are required except file upload and questions",
        severity: "error",
      });
      setOpen(true);
    } else {
      setloading(true);
      await dispatch(localEditJob(data))
        .then(async (response) => {
          setloading(false);
          window.location.assign(
            userAccountType === 3 ? "/admin-all-jobs" : "/recruiter-all-jobs"
          );
        })
        .catch((error) => {
          setloading(false);
        });
    }
    setDraftLoad(false);
  };

  const getSubCategory = (industryId) => {
    if (industryId === "it-freelance-cat") {
      setindustry("it-freelance-cat");
      setsubCategories(categories);
    } else {
      setindustry(industryId);
      const result = indutries.find(({ id }) => id === industryId);
      setsubCategories(result.Industries);
    }
  };

  const getIndustries = () => {
    Api()
      .get(`/admin/industries`)
      .then((response) => {
        setindutries(response?.data);
      })
      .catch((error) => {});
  };

  const getCategoriesForITIndustry = () => {
    Api()
      .get(`/admin/categories`)
      .then((response) => {
        setcategories(response?.data);
      })
      .catch((error) => {});
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    getProfileData();
    getIndustries();
    getCities();
    getCategoriesForITIndustry();
    if (jobDetails?.IndustryCategory?.id === undefined) {
      Api()
        .get(`/admin/categories`)
        .then((response) => {
          setsubCategories(response?.data);
        })
        .catch((error) => {});
    }
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
          <Card className="post-job-card mb-5">
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
                      >
                      </IconButton>
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
                  <div className="col-md-4 d-flex justify-content-start mb-3">
                    <Paper
                      className={
                        type === "Full-Time"
                          ? "postJobPaper"
                          : "postJobPaperAlt"
                      }
                    >
                      <label for="recruiterjob-type1" style={{ width: "100%" }}>
                        <div class="d-flex justify-content-end">
                          <input
                            type="radio"
                            id="recruiterjob-type1"
                            name="status"
                            checked={type === "Full-Time"}
                            value="Full-Time"
                            onChange={(e) => setType(e.target.value)}
                          />
                        </div>
                        <p className="text-center" style={{ fontSize: "15px" }}>
                          <b>Full Time</b>
                        </p>
                        <p className="text-center" style={{ fontSize: "11px" }}>
                          This job will be on full time basis
                        </p>
                      </label>
                    </Paper>
                  </div>
                  <div className="col-md-4 d-flex justify-content-center mb-3">
                    <Paper
                      className={
                        type === "Part-Time"
                          ? "postJobPaper"
                          : "postJobPaperAlt"
                      }
                    >
                      <label for="recruiterjob-type2" style={{ width: "100%" }}>
                        <div class="d-flex justify-content-end">
                          <input
                            type="radio"
                            id="recruiterjob-type2"
                            name="status"
                            value="Part-Time"
                            onChange={(e) => setType(e.target.value)}
                            checked={type === "Part-Time"}
                          />
                        </div>
                        <p className="text-center" style={{ fontSize: "15px" }}>
                          <b>Part-Time</b>
                        </p>
                        <p className="text-center" style={{ fontSize: "11px" }}>
                          This job will be on part-time basis
                        </p>
                      </label>
                    </Paper>
                  </div>
                  <div className="col-md-4 d-flex justify-content-end mb-3">
                    <Paper
                      className={
                        type === "Contract" ? "postJobPaper" : "postJobPaperAlt"
                      }
                    >
                      <label for="recruiterjob-type3" style={{ width: "100%" }}>
                        <div class="d-flex justify-content-end">
                          <input
                            type="radio"
                            id="recruiterjob-type3"
                            name="status"
                            value="Contract"
                            onChange={(e) => setType(e.target.value)}
                            checked={type === "Contract"}
                          />
                        </div>
                        <p className="text-center" style={{ fontSize: "15px" }}>
                          <b>Contract</b>
                        </p>
                        <p className="text-center" style={{ fontSize: "11px" }}>
                          This job will be on contract basis
                        </p>
                      </label>
                    </Paper>
                  </div>
                </div>

                <div className="row text-center mt-4 mb-2">
                  <div className="col-md-12">
                    <p style={{ color: "#707070" }}>
                      <b>Work Setting Type</b>
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 d-flex justify-content-start mb-3">
                    <Paper
                      className={
                        workSetting === "Remote"
                          ? "postJobPaper"
                          : "postJobPaperAlt"
                      }
                    >
                      <label
                        for="recruitersetting-type1"
                        style={{ width: "100%" }}
                      >
                        <div class="d-flex justify-content-end">
                          <input
                            type="radio"
                            id="recruitersetting-type1"
                            name="status1"
                            checked={workSetting === "Remote"}
                            value="Remote"
                            onChange={(e) => setworkSetting(e.target.value)}
                          />
                        </div>
                        <div className="text-center mt-1">
                          <Icon
                            path={mdiHomeOutline}
                            title="Remote"
                            size={1.8}
                            horizontal
                            vertical
                            rotate={180}
                          />
                        </div>
                        <p className="text-center">Remote</p>
                      </label>
                    </Paper>
                  </div>
                  <div className="col-md-4 d-flex justify-content-center mb-3">
                    <Paper
                      className={
                        workSetting === "On-Site"
                          ? "postJobPaper"
                          : "postJobPaperAlt"
                      }
                    >
                      <label
                        for="recruitersetting-type2"
                        style={{ width: "100%" }}
                      >
                        <div class="d-flex justify-content-end">
                          <input
                            type="radio"
                            id="recruitersetting-type2"
                            name="status1"
                            value="On-Site"
                            onChange={(e) => setworkSetting(e.target.value)}
                            checked={workSetting === "On-Site"}
                          />
                        </div>
                        <div className="text-center mt-1">
                          <Icon
                            path={mdiOfficeBuildingOutline}
                            title="Office"
                            size={1.8}
                            horizontal
                            vertical
                            rotate={180}
                          />
                        </div>
                        <p className="text-center">On-Site</p>
                      </label>
                    </Paper>
                  </div>
                  <div className="col-md-4 d-flex justify-content-end  mb-3">
                    <Paper
                      className={
                        workSetting === "Hybrid"
                          ? "postJobPaper"
                          : "postJobPaperAlt"
                      }
                    >
                      <label
                        for="recruitersetting-type3"
                        style={{ width: "100%" }}
                      >
                        <div class="d-flex justify-content-end">
                          <input
                            type="radio"
                            id="recruitersetting-type3"
                            name="status1"
                            value="Hybrid"
                            onChange={(e) => setworkSetting(e.target.value)}
                            checked={workSetting === "Hybrid"}
                          />
                        </div>
                        <div className="text-center mt-1">
                          <Icon
                            path={mdiHomeCityOutline}
                            title="Hybrid"
                            size={1.8}
                            horizontal
                            vertical
                            rotate={180}
                          />
                        </div>
                        <p className="text-center">Hybrid</p>
                      </label>
                    </Paper>
                  </div>
                </div>

                <div className="row text-center mt-4 mb-2">
                  <div className="col-md-12">
                    <p style={{ color: "#707070" }}>
                      <b>Job Details</b>
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <TextField
                      id="industry"
                      required
                      asterisk
                      label="Industry"
                      select
                      variant="outlined"
                      size="small"
                      className=""
                      fullWidth
                      value={industry}
                      onChange={(e) => {
                        getSubCategory(e.target.value);
                      }}
                      style={{
                        backgroundColor: "white",
                        textTransform: "capitalize",
                      }}
                      InputProps={{}}
                    >
                      <MenuItem
                        style={{ textTransform: "capitalize" }}
                        value="it-freelance-cat"
                      >
                        I.T Industries
                      </MenuItem>
                      {indutries.map((ind) => {
                        return (
                          <MenuItem
                            style={{ textTransform: "capitalize" }}
                            value={ind.id}
                          >
                            {ind.name}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </div>
                  <div className="col-md-6 mb-4">
                    <TextField
                      id="category"
                      required
                      asterisk
                      label="Category"
                      select
                      variant="outlined"
                      size="small"
                      className=""
                      fullWidth
                      value={
                        [undefined, null, ""].includes(category)
                          ? freelancerCategory
                          : category
                      }
                      onChange={(e) => {
                        if (industry === "it-freelance-cat") {
                          setCategory("");
                          setfreelancerCategory(e.target.value);
                        } else {
                          setCategory(e.target.value);
                          setfreelancerCategory("");
                        }
                      }}
                    >
                      {subCategories.map((cat) => {
                        return (
                          <MenuItem value={cat.id}>
                            {cat.name ?? cat.category}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </div>
                </div>

                <div className="row mt-1">
                  <div className="col-md-6 mb-4">
                    <TextField
                      id="projectTitle"
                      required
                      asterisk
                      label="Project Title"
                      type="text"
                      variant="outlined"
                      size="small"
                      className=""
                      fullWidth
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
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
                          plugins: [
                            "advlist autolink lists link image media charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste code help wordcount",
                            "paste",
                          ],
                          automatic_uploads: true,
                          relative_urls: true,
                          font_formats:
                            "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",

                          toolbar:
                            "undo redo | formatselect | fontsizeselect |" +
                            "bold italic backcolor | bullist numlist outdent indent | " +
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
                            "body { font-family:Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats }",
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
                    <MultiSelect
                      options={cities}
                      value={citiId}
                      onChange={setSelectCities}
                      labelledBy={"City"}
                      className="selectHeight"
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <TextField
                      id="salary"
                      label="Salary(GHC)"
                      type="number"
                      variant="outlined"
                      size="small"
                      className=""
                      fullWidth
                      defaultValue={jobDetails?.salary || ""}
                      onChange={(e) => setsalary(e.target.value)}
                    ></TextField>
                  </div>
                </div>

                <div className="row mt-4">
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
                      for="RecjobAttachmentsEdit"
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
                      for="RecjobAttachmentsEdit"
                      className="uploadHelpTextMobile text-center"
                    >
                      Tap here to upload files
                    </label>
                    <input
                      id="RecjobAttachmentsEdit"
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
                          <div >
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
                              clearFile(file)
                            }}
                            style={{marginLeft: "10px"}}
                          />
                       </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="row mt-5">
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
                    <AddQuestion
                      jobData={jobDetails.id}
                      jobDataQuestions={jobDetails.Questions}
                    />
                  </div>
                </div>

                {/* <p >
                  {alert.message}
                </p> */}
                <DialogActions className="justify-content-center">
                  <NavLink to="/recruiter-all-jobs" className="navLink">
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
                  </NavLink>
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

export default RecruiterLocalEditJob;
