import React, { useState } from "react";
import {
  DialogContent,
  TextField,
  Button,
  Snackbar,
  MenuItem,
} from "@mui/material";
import { ClipLoader } from "react-spinners";
import Api from "../../Services/api";
import { Alert } from "@material-ui/lab";
import moment from "moment";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { getCurrentUser } from "../../Services/auth";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import { useDispatch } from "react-redux";
import { getUserEducation } from "../../Services/redux/education/index";

function AddEditEducation({ editMode, educationToPass, handleClose }) {
  const dispatch = useDispatch();
  const [name, setName] = useState(
    educationToPass.institute_name === undefined
      ? ""
      : educationToPass.institute_name
  );
  const [degree, setDegree] = useState(
    educationToPass.degree_title === undefined
      ? ""
      : educationToPass.degree_title
  );

  const [degreeLevel, setDegreeLevel] = useState(
    educationToPass?.levelOfEducation || ""
  );

  const [start_date, setStartDate] = useState(
    educationToPass.start_date === undefined ? "" : educationToPass.start_date
  );
  const [end_date, setEndDate] = useState(
    educationToPass.end_date === undefined ? "" : educationToPass.end_date
  );
  const [grade, setGrade] = useState(
    educationToPass.grade === undefined ? "" : educationToPass.grade
  );

  const [CGPA, setCGPA] = useState(
    educationToPass?.gradeType === undefined
      ? "System"
      : educationToPass?.gradeType
  );

  const [overall, setOverall] = useState(
    educationToPass?.overall === undefined ? "" : educationToPass?.overall
  );

  const [eduData, setEduData] = useState(educationToPass);
  const [loading, setloading] = useState(false);
  const [accountId, setaccountId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const [read, setRead] = useState(false);
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

  const handleCloseSnack = () => {
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

  const getEducations = async () => {
    await dispatch(getUserEducation(accountId));
  };

  const addOrUpdate = async () => {
    if (!editMode) {
      addEducation();
    } else {
      editEducation();
    }
  };

  const handleCGPA = (e) => {
    setCGPA(e.target.value);

    if (e.target.value === "System") {
      setRead(true);
      setGrade("");
      setOverall("");
    } else {
      setRead(false);
    }
  };

  const handleDegreeLevel = (e) => {
    setDegreeLevel(e.target.value);
  };

  // API REQUEST TO ADD EDUCATION
  const addEducation = async (e) => {
    const data = {
      userAccountId: accountId,
      institute_name: name,
      degree_title: degree,
      levelOfEducation: degreeLevel,
      start_date: moment(`${start_date}`).format("YYYY-MM-DD"),
      end_date: moment(`${end_date}`).format("YYYY-MM-DD"),
      grade: grade,
      gradeType: CGPA,
      overall,
    };

    if (grade && overall === "") {
      setOpen(true);
      setAlert({
        open: true,
        message: " Overall Score cannot be empty",
        severity: "error",
      });
      closeAlert();

      return;
    }
   
    if (grade * 1 > overall * 1) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Grade Point cannot be greater than  Overall Score",
        severity: "error",
      });
      closeAlert();

      return;
    }
    if (CGPA === "CGPA" && grade <= 0) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Grade point cannot be empty",
        severity: "error",
      });
      closeAlert();

      return;
    }

    // if(CGPA === "CGPA" && grade > 10){
    //   {
    //     setOpen(true);
    //     setAlert({
    //       open: true,
    //       message: "Grade cannot be more than 10 for CGPA",
    //       severity: "error",
    //     });
    //     closeAlert();
    //  }
    //  return
    // }

    if (CGPA === "CWA" && grade > 100) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Grade point cannot be empty",
        severity: "error",
      });
      closeAlert();

      return;
    }

    if (CGPA === "CWA" && grade <= 0) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Grade point cannot be empty",
        severity: "error",
      });
      closeAlert();

      return;
    }
    if (
      name.trim().length === 0 ||
      degree.trim().length === 0 ||
      start_date.trim().length === 0 ||
      end_date.trim().length === 0 ||
      degreeLevel === ""
    ) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Please fill in required fields",
        severity: "error",
      });
      closeAlert();
    } else {
      setloading(true);
      Api()
        .post("/users/post-education/", data)
        .then((response) => {
          setloading(false);
          setTimeout(async () => {
            await getEducations();
            handleClose();
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

  const editEducation = async (e) => {
    const data = {
      id: eduData.id,
      userAccountId: accountId,
      institute_name: name,
      degree_title: degree,
      levelOfEducation: degreeLevel,
      start_date: moment(`${start_date}`).format("YYYY-MM-DD"),
      end_date: moment(`${end_date}`).format("YYYY-MM-DD"),
      grade: grade,
      gradeType: CGPA,
      overall,
    };

    if (grade && overall === "") {
      setOpen(true);
      setAlert({
        open: true,
        message: " Overall Score cannot be empty",
        severity: "error",
      });
      closeAlert();

      return;
    }

    if (grade * 1 > overall * 1) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Grade Point cannot be greater than  Overall Score",
        severity: "error",
      });
      closeAlert();

      return;
    }

    if (CGPA === "CGPA" && grade <= 0) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Grade point cannot be empty",
        severity: "error",
      });
      closeAlert();

      return;
    }

    // if(CGPA === "CGPA" && grade && grade > 10){
    //   {
    //     setOpen(true);
    //     setAlert({
    //       open: true,
    //       message: "Grade point cannot be more than 10 for CGPA",
    //       severity: "error",
    //     });
    //     closeAlert();
    //  }
    //  return
    // }

    if (CGPA === "CWA" && grade > 100) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Grade point cannot be empty",
        severity: "error",
      });
      closeAlert();

      return;
    }

    if (CGPA === "CWA" && grade <= 0) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Grade point cannot be empty",
        severity: "error",
      });
      closeAlert();

      return;
    }

    if (
      name.trim().length === 0 ||
      degree.trim().length === 0 ||
      start_date === "" ||
      end_date === ""
    ) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Please fill in required fields",
        severity: "error",
      });
      closeAlert();
    } else {
      setloading(true);
      Api()
        .put("/users/update-education/", data)
        .then((response) => {
          setloading(false);
          setTimeout(async () => {
            await getEducations();
            handleClose();
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
          <div className="row justify-content-center text-center">
            <div className="row mb-3">
              <div className="col-md-12">
                <h6>
                  <b>{!editMode ? "Add Education" : "Update Education Experience"}</b>
                </h6>
              </div>
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
                    ></IconButton>
                  }
                >
                  {alert.message}
                </Alert>
              </Snackbar>
            </div>
          </div>
          <div className="col-12">
            <TextField
              id="institution-name"
              required
              asterisk
              label="Institution Name"
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              defaultValue={name || ""}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="row mt-4">
            <div className="col-md-6 mb-4">
              <TextField
                id="levelOfEducation"
                required
                asterisk
                label="Select Level of Education"
                select
                variant="outlined"
                size="small"
                className=""
                fullWidth
                defaultValue={degreeLevel || ""}
                onChange={handleDegreeLevel}
              >
                {/* <MenuItem value="EducationLevel" key="EducationLevel">
                  Select Level of Education
                </MenuItem> */}
                <MenuItem value="Bachelors (or equivalent)" key="Bachelors">
                  Bachelors (or equivalent)
                </MenuItem>
                <MenuItem value="Masters (or equivalent)" key="Masters">
                  Masters (or equivalent)
                </MenuItem>
                <MenuItem value="Doctorate (or equivalent)" key="Doctorate">
                  Doctorate (or equivalent)
                </MenuItem>
                <MenuItem value="High School (or equivalent)" key="HighSchool">
                  High School Diploma (or equivalent)
                </MenuItem>
              </TextField>
            </div>

            <div className="col-md-6 mb-4">
              <TextField
                id="degree-title"
                required
                asterisk
                placeholder="E.g: Computer Science"
                label="Programme Studied"
                type="text"
                variant="outlined"
                size="small"
                fullWidth
                defaultValue={degree || ""}
                onChange={(e) => setDegree(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <TextField
                id="grade"
                label=" Select Grading System"
                select
                variant="outlined"
                size="small"
                className=""
                fullWidth
                defaultValue={CGPA || ""}
                onChange={handleCGPA}
              >
                <MenuItem value="System" key="System">
                  Select Grading System
                </MenuItem>
                <MenuItem value="CGPA" key="CGPA">
                  CGPA
                </MenuItem>
                <MenuItem value="CWA" key="CWA">
                  CWA
                </MenuItem>
              </TextField>
            </div>
            <div className="col-md-3 mb-4">
              <TextField
                disabled={
                  CGPA === "CWA" || CGPA === "CGPA"
                    ? false
                    : grade === !""
                    ? false
                    : true
                }
                id="grade"
                label="Grade Point"
                type="number"
                variant="outlined"
                size="small"
                className=""
                InputProps={{
                  readOnly: read,
                }}
                fullWidth
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </div>

            <div className="col-md-3 mb-4">
              <TextField
                disabled={grade === "" || grade === isNaN(grade) ? true : false}
                id="overall"
                label="Overall Score"
                type="number"
                variant="outlined"
                size="small"
                className=""
                fullWidth
                InputProps={{
                  readOnly: read,
                }}
                value={overall}
                onChange={(e) => setOverall(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <TextField
                id="start-date"
                required
                asterisk
                InputProps={{
                  inputProps: {
                    min: "1995-01-01",
                    max: end_date ? end_date : today,
                  },
                }}
                type="date"
                variant="outlined"
                label="Start Date"
                className=""
                InputLabelProps={{ shrink: true }}
                id="datefield"
                size="small"
                fullWidth
                defaultValue={
                  moment(`${start_date}`).format("YYYY-MM-DD") || ""
                }
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-4">
              <TextField
                id="end-date"
                required
                asterisk
                type="date"
                variant="outlined"
                label="End Date"
                className=""
                size="small"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputProps: { min: start_date ? start_date : "", max: "" },
                }}
                fullWidth
                defaultValue={moment(`${end_date}`).format("YYYY-MM-DD") || ""}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-1">
            <Button variant="contained" className="btn" onClick={addOrUpdate}>
              {loading && (
                <div style={{ marginRight: "5px" }}>
                  <ClipLoader size={20} color="#1b98e0" loading />
                </div>
              )}
              {!editMode ? "Add Education" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </form>
    </div>
  );
}

export default AddEditEducation;
