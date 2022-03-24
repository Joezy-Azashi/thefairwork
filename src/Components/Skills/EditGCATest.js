import React, { useState, useEffect } from "react";
import {
  Button,
  DialogContent,
  TextField,
  Snackbar,
  MenuItem,
} from "@mui/material";
import { ClipLoader } from "react-spinners";
import { Alert } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { Proficiency } from "../../Services/validation";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import Api from "../../Services/api";
import { getSkillIndustryType } from "../../Services/redux/skills/index";
import { useDispatch } from "react-redux";

function EditGCATest({ GCADataForEdit, closeGCADia, userAccountId }) {
  const dispatch = useDispatch();
  const [name, setName] = useState(
    GCADataForEdit?.name === "" ? "" : GCADataForEdit?.name
  );
  const [testScore, setTestScore] = useState(
    GCADataForEdit?.score === "" ? "" : GCADataForEdit?.score
  );
  const [proficiency, setProficiency] = useState(
    GCADataForEdit?.proficiency === "" ? "" : GCADataForEdit?.proficiency
  );
  const [certified, setCertified] = useState(GCADataForEdit?.isCertified);
  const [loading, setloading] = useState(false);
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

  const certifiyGCA = (e) => {
    if (e.target.checked) {
      setCertified(!certified);
    }

    if (!e.target.checked) {
      setCertified(!certified);
    }
  };

  const getIndustryType = async () => {
    await dispatch(getSkillIndustryType(userAccountId))
      .then((response) => {})
      .catch((error) => {});
  };

  const editGCA = async () => {
    if (name === "") {
      setOpen(true);
      setAlert({
        open: true,
        message: "Name connot be empty",
        severity: "error",
      });
      closeAlert();
      return;
    }
    if (testScore === "" || testScore === 0) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Test Score connot be empty",
        severity: "error",
      });
      closeAlert();
      return;
    }
    if (proficiency === "") {
      setOpen(true);
      setAlert({
        open: true,
        message: "Please select Proficiency",
        severity: "error",
      });
      closeAlert();
      return;
    }
    if (testScore * 1 <= 0) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Test Score connot be zero",
        severity: "error",
      });
      closeAlert();
      return;
    }

    const data = {
      name: name,
      isCertified: certified,
      proficiency: proficiency,
      score: testScore,
      userAccountId: userAccountId,
    };

    Api()
      .put(`/admin/update-gca/${GCADataForEdit?.id}`, data)
      .then((response) => {
        setTimeout(async () => {
          await getIndustryType();
          closeGCADia();
        }, 500);
      })
      .catch((error) => {});
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
            closeGCADia();
          }}
          rotate={180}
        />
      </div>
      <form onSubmit={editGCA}>
        <DialogContent>
          <div className="row justify-content-center text-center">
            <h6>
              <b>Edit General Coding Assessment Test</b>
            </h6>
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
          <div className="row mt-4">
            <div className="col-md-12">
              <TextField
                required
                asterisk
                id="category"
                variant="outlined"
                size="small"
                label="Name"
                defaultValue={name || ""}
                className=""
                fullWidth
                style={{ textTransform: "capitalize" }}
                onChange={(e) => setName(e.target.value)}
              ></TextField>
            </div>
            <div className="d-flex mt-2">
              <input
                type="checkbox"
                className=""
                checked={certified}
                onChange={certifiyGCA}
              />
              <label
                className=""
                style={{
                  color: "#707070B2",
                  fontSize: "10.4px",
                  marginLeft: "5px",
                }}
              >
                Certified
              </label>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-6">
              <TextField
                required
                asterisk
                type="text"
                id="personSkills"
                variant="outlined"
                size="small"
                label="Test Score"
                className=""
                fullWidth
                defaultValue={testScore || ""}
                onChange={(e) => setTestScore(e.target.value)}
              ></TextField>
            </div>
            <div className="col-md-6">
              <TextField
                required
                asterisk
                id="personProficience"
                variant="outlined"
                size="small"
                label="Proficiency"
                className=""
                select
                fullWidth
                defaultValue={proficiency || ""}
                onChange={(e) => setProficiency(e.target.value)}
              >
                {Proficiency().map((pro) => {
                  return (
                    <MenuItem
                      value={pro.name}
                      style={{ textTransform: "capitalize" }}
                    >
                      {pro.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </div>
          </div>

          <div className="d-flex justify-content-center mt-5 mb-2">
            <Button
              variant="contained"
              className="postJobbtn"
              onClick={editGCA}
            >
              {loading && (
                <div style={{ marginRight: "5px" }}>
                  <ClipLoader size={20} color="#1b98e0" loading />
                </div>
              )}
              Save
            </Button>
          </div>
        </DialogContent>
      </form>
    </div>
  );
}

export default EditGCATest;
