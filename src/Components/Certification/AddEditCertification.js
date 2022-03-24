import React, { useRef, useState } from "react";
import { DialogContent, TextField, Button, Snackbar } from "@mui/material";
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
import { getUserCertification } from "../../Services/redux/certification/index";
import validator from "validator";

function AddEditCertification({ editMode, certificationToPass, handleClose }) {
  const dispatch = useDispatch();
  const [certificate, setCertificate] = useState(
    certificationToPass.certificate === undefined
      ? ""
      : certificationToPass.certificate
  );
  const [issuing_authority, setIssuing_authority] = useState(
    certificationToPass.issuing_authority === undefined
      ? ""
      : certificationToPass.issuing_authority
  );
  const [link, setLink] = useState(
    certificationToPass.link === undefined ? "" : certificationToPass.link
  );
  const [certificationExpires, setCertificationExpires] = useState(true);
  const [issue_date, setIssue_date] = useState(
    certificationToPass.issue_date === undefined
      ? ""
      : certificationToPass.issue_date
  );
  const [valid_till, setValid_till] = useState(
    certificationToPass.valid_till === undefined
      ? ""
      : certificationToPass.valid_till
  );
  const [certData, setCertData] = useState(certificationToPass);
  const [loading, setloading] = useState(false);
  const [accountId, setaccountId] = useState(
    localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : getCurrentUser()?.user?.id
  );
  const linkRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [invalidDateAlert, setInvalidDateAlert] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setOpen(false);
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

  const getCertificate = async () => {
    await dispatch(getUserCertification(accountId));
  };

  const validateUrl = (urlAddress) => {
    if (urlAddress) {
      if (validator.isURL(urlAddress)) {
        return true;
      } else {
        setOpen(true);
        setAlert({
          open: true,
          message: "Certificate Link URL format is incorrect",
          severity: "error",
        });
        linkRef.current.focus();
        return;
      }
    } else {
      return true;
    }
  };

  const addOrUpdate = async () => {
    if (!editMode) {
      addCertificate();
    } else {
      editCertificate();
    }
  };

  const handleCertificationExpiry = ()=>{
    setCertificationExpires(prevState=>!prevState);
    if(certificationExpires){
      setValid_till(null);
    }
  };

  // API REQUEST TO ADD EDUCATION
  const addCertificate = async (e) => {
    if (validateUrl(link)) {
      if (issue_date > valid_till) {
        setInvalidDateAlert(true);
      }
      const data = {
        userAccountId: accountId,
        certificate: certificate,
        issuing_authority: issuing_authority,
        issue_date:
          moment(`${issue_date}`).format("YYYY-MM-DD") === "Invalid date"
            ? null
            : moment(`${issue_date}`).format("YYYY-MM-DD"),
        valid_till:
          moment(`${valid_till}`).format("YYYY-MM-DD") === "Invalid date"
            ? null
            : moment(`${valid_till}`).format("YYYY-MM-DD"),
        link: link,
      };
      if (
        certificate.trim().length === 0 ||
        issuing_authority.trim().length === 0 ||
        moment(`${issue_date}`).format("YYYY-MM-DD") === "Invalid date"
      ) {
        setOpen(true);
        setAlert({
          open: true,
          message: "All fields are required except link and valid till",
          severity: "error",
        });
        closeAlert();
      } else {
        setloading(true);
        Api()
          .post("/users/post-user-certification", data)
          .then((response) => {
            setloading(false);
            setTimeout(async () => {
              await getCertificate();
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
    }
  };

  const editCertificate = async (e) => {
    const data = {
      id: certData.id,
      userAccountId: accountId,
      certificate: certificate,
      issuing_authority: issuing_authority,
      issue_date:
        moment(`${issue_date}`).format("YYYY-MM-DD") === "Invalid date"
          ? null
          : moment(`${issue_date}`).format("YYYY-MM-DD"),
      valid_till:
        moment(`${valid_till}`).format("YYYY-MM-DD") === "Invalid date"
          ? null
          : moment(`${valid_till}`).format("YYYY-MM-DD"),
      link: link,
    };

    if (
      certificate.trim().length === 0 ||
      issuing_authority.trim().length === 0 ||
      issue_date.length === 0
    ) {
      setOpen(true);
      setAlert({
        open: true,
        message: "All fields are required except link and valid till",
        severity: "error",
      });
      closeAlert();
    } else {
      setloading(true);
      Api()
        .put("/users/update-user-certification", data)
        .then((response) => {
          setloading(false);
          setTimeout(async () => {
            await getCertificate();
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
            <h6>
              <b>{!editMode ? "Add Certificate" : "Edit Certificate"}</b>
            </h6>
            <div>
              <Snackbar
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                open={open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
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
            <div className="col-md-6 mb-4">
              <TextField
                id="certificateName"
                required
                asterisk
                label="Certificate Name"
                type="text"
                variant="outlined"
                size="small"
                className=""
                fullWidth
                defaultValue={certificate || ""}
                onChange={(e) => setCertificate(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-4">
              <TextField
                id="issuingAuthority"
                required
                asterisk
                label="Issuing Authority"
                type="text"
                variant="outlined"
                size="small"
                className=""
                fullWidth
                defaultValue={issuing_authority || ""}
                onChange={(e) => setIssuing_authority(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <TextField
                id="start-date"
                required
                asterisk
                type="date"
                variant="outlined"
                label="Issue Date"
                className=""
                InputLabelProps={{ shrink: true }}
                InputProps={{ inputProps: { min: "1995-01-01", max: today } }}
                size="small"
                fullWidth
                defaultValue={
                  moment(`${issue_date}`).format("YYYY-MM-DD") || ""
                }
                onChange={(e) => setIssue_date(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-4">
              <TextField
                id="end-date"
                type="date"
                variant="outlined"
                className=""
                InputLabelProps={{ shrink: true }}
                label="Valid till"
                disabled = {!certificationExpires}
                InputProps={{ inputProps: { min: today, max: "" } }}
                size="small"
                fullWidth
                defaultValue={
                  moment(`${valid_till}`).format("YYYY-MM-DD") || ""
                }
                onChange={(e) => setValid_till(e.target.value)}
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
              />
              {/* {invalidDateAlert && <div style={{fontStyle: "segoe UI",fontSize:"14px",  color:"red"}}>Invalid End Date !</div>} */}
              <div>
                <input
                  type="checkbox"
                  value={certificationExpires}
                  onChange={handleCertificationExpiry}
                />
                <label
                  style={{
                    fontFamily: '"Segoe UI", sans-serif',
                    color: "rgb(85, 85, 85)",
                    marginLeft: "5px",
                  }}
                >
                  This credential does not expire
                </label>
              </div>
            </div>
          </div>

          <div className="row ">
            <div className="col-md-12 mb-4">
              <TextField
                id="certificateLink"
                label="Certificate link"
                placeholder="e.g https://example.com"
                type="link"
                variant="outlined"
                size="small"
                className=""
                fullWidth
                ref={linkRef}
                defaultValue={link || ""}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-3">
            <Button variant="contained" className="btn" onClick={addOrUpdate}>
              {loading && (
                <div style={{ marginRight: "5px" }}>
                  <ClipLoader size={20} color="#1b98e0" loading />
                </div>
              )}
              {!editMode ? "Add Certification" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </form>
    </div>
  );
}

export default AddEditCertification;
