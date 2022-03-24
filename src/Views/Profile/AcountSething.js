import React, { useState, useEffect, useReducer } from "react";
import {
  CardContent,
  Card,
  Button,
  TextField,
  IconButton,
  Snackbar,
} from "@mui/material";
import { Alert } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import Api from "../../Services/api";
import { loadCSS } from "fg-loadcss";
import useForm from "../../Services/useForm";
import { getCurrentUser } from "../../Services/auth";
import { ClipLoader } from "react-spinners";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

function AcountSetting() {
  const api = Api();
  const [loading, setloading] = useState(false);
  const [email, setEmail] = useState(getCurrentUser()?.user?.email);

  // DEFINE THE STATE SCHEMA
  const stateSchema = {
    password: { value: "", error: "" },
    newPassword: { value: "", error: "" },
    confirmPassword: { value: "", error: "" },
  };

  const stateValidatorSchema = {
    newPassword: {
      required: true,
      validator: {
        func: (value) =>
          /^(?=.*[A-Za-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
            value
          ) && /([0-9])/.test(value),
        error: "Min 8, at least a special character & a number",
      },
    },
  };

  //reducer
  const [forceUpdate] = useReducer((x) => x + 1, 0);

  const { values, errors, dirty, handleOnChange } = useForm(
    stateSchema,
    stateValidatorSchema
  );

  const { password, confirmPassword, newPassword } = values;

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [passvalue, setPassvalue] = useState({
    password: "",
    showPassword: false,
  });

  const [newPassvalue, setNewPassvalue] = useState({
    newPassword: "",
    showPassword: false,
  });

  const [confirmPassvalue, setConfirmPassvalue] = useState({
    confirmPassword: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setPassvalue({ ...passvalue, showPassword: !passvalue.showPassword });
  };

  const handleClickShowPassword2 = () => {
    setConfirmPassvalue({
      ...confirmPassvalue,
      showPassword: !confirmPassvalue.showPassword,
    });
  };

  const handleClickShowPassword3 = () => {
    setNewPassvalue({
      ...newPassvalue,
      showPassword: !newPassvalue.showPassword,
    });
  };

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
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

  const changePassword = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      old_password: password,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };
    if (password === "" || confirmPassword === "" || newPassword === "") {
      setOpen(true);
      setAlert({
        open: true,
        message: "Password fields must not be empty",
        severity: "error",
      });
      closeAlert();
    } else if (errors.newPassword) {
    } else if (password.length < 8 || confirmPassword.length < 8) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Passwords characters must be 8 or more",
        severity: "error",
      });
      closeAlert();
    } else if (newPassword !== confirmPassword) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Passwords don't match",
        severity: "error",
      });
      closeAlert();
    } else if (password === newPassword) {
      setOpen(true);
      setAlert({
        open: true,
        message: "New password cannot be same as old password",
        severity: "error",
      });
      closeAlert();
    } else {
      api
        .post("/users/change-password", data)
        .then((response) => {
          setAlert({
            open: true,
            message: `${response?.data?.message}`,
            severity: "success",
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);

          setOpen(true);
          closeAlert();
        })
        .catch((error) => {
          setAlert({
            open: true,
            message: `${error?.response?.data?.error}`,
            severity: "error",
          });
          setOpen(true);
          closeAlert();
        });
    }
  };

  useEffect(() => {
    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);

  return (
    <div>
      <div className="pageTitle mb-4">
        <h6>
          <b>Account Settings</b>
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
      <Card className="mb-1 p-4">
        <CardContent>
          <div className="d-flex justify-content-left">
            <h6>
              <b>Change Password</b>
            </h6>
          </div>
          <hr />

          <div className="row">
            <div className="d-flex justify-content-center ">
              <form className="account-stting-form col-md-7 justify-content-center">
                <div className="row mt-3">
                  <TextField
                    label="Old Password"
                    required
                    asterisk
                    variant="outlined"
                    size="small"
                    id="oldPassword"
                    name="password"
                    className="password"
                    value={password}
                    type={passvalue.showPassword ? "text" : "password"}
                    onChange={handleOnChange}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {passvalue.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      ),
                    }}
                  />
                </div>
                <div className="row mt-4">
                  <TextField
                    variant="outlined"
                    label="New Password"
                    required
                    asterisk
                    size="small"
                    id="newPassword"
                    name="newPassword"
                    className="password"
                    type={newPassvalue.showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handleOnChange}
                    helperText={
                      errors.newPassword &&
                      dirty.newPassword && (
                        <p className="error-text">{errors.newPassword}</p>
                      )
                    }
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword3}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {newPassvalue.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      ),
                    }}
                  />
                </div>
                <div className="row mt-4">
                  <TextField
                    width={1}
                    required
                    asterisk
                    label="Confirm Password"
                    variant="outlined"
                    size="small"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="password"
                    type={confirmPassvalue.showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleOnChange}
                    helperText={
                      newPassword !== confirmPassword &&
                      confirmPassword.length > 1 ? (
                        <p className="error-text">Passwords do not match</p>
                      ) : null
                    }
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword2}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {confirmPassvalue.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      ),
                    }}
                  />
                </div>

                <div className="d-flex justify-content-center mt-5 mb-5">
                  <Button
                    variant="contained"
                    color="primary"
                    className="btn change-password-button"
                    type="submit"
                    onClick={changePassword}
                    disabled={loading}
                  >
                    {loading && (
                      <div style={{ marginRight: "5px" }}>
                        <ClipLoader size={20} color="#1b98e0" loading />
                      </div>
                    )}
                    Change password
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AcountSetting;
