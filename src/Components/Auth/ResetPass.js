import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogContent,
  TextField,
  DialogTitle,
  IconButton,
  Snackbar,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Api from "../../Services/api";
import { Alert } from "@material-ui/lab";
import useForm from "../../Services/useForm";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function ResetPass({ userDetails, closeResetDia }) {
  // DEFINE THE STATE SCHEMA
  const stateSchema = {
    password: { value: "", error: "" },
    confirmPassword: { value: "", error: "" },
  };

  const stateValidatorSchema = {
    password: {
      required: true,
      validator: {
        func: (value) =>
          /^(?=.*[A-Za-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
            value
          ) && /([0-9])/.test(value),
        error: "Min 8, a special character & number",
      },
    },
  };

  const { values, errors, dirty, handleOnChange } = useForm(
    stateSchema,
    stateValidatorSchema
  );

  const { password, confirmPassword } = values;

  const api = Api();

  const [passvalue, setPassvalue] = useState({
    password: "",
    showPassword: false,
  });
  const [conpassvalue, setConpassvalue] = useState({
    confirm_password: "",
    showPassword: false,
  });

  const [errorSate, seterrorSate] = useState(false);
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

  const handleClickShowPassword1 = () => {
    setPassvalue({ ...passvalue, showPassword: !passvalue.showPassword });
  };
  const handleClickShowPassword2 = () => {
    setConpassvalue({
      ...conpassvalue,
      showPassword: !conpassvalue.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    const data = {
      email: userDetails?.email,
      password: password,
      confirm_password: confirmPassword,
    };
    if (errors.password) {
    } else if (password === "" || confirmPassword === "") {
      setOpen(true);
      setAlert({
        open: true,
        message: "Password fields must not be empty",
        severity: "error",
      });
      closeAlert();
    } else if (password !== confirmPassword) {
      setOpen(true);
      setAlert({
        open: true,
        message: "Passwords don't match",
        severity: "error",
      });
      closeAlert();
    } else {
      api
        .put("/admin/change-password", data)
        .then((response) => {
          setAlert({
            open: true,
            message: `User password has been changed`,
            severity: "success",
          });
          setOpen(true);
          setTimeout(() => {
            closeResetDia();
          }, 2000);
        })
        .catch((error) => {
          setAlert({
            open: true,
            message: `${error.response.data.error}`,
            severity: "error",
          });
          setOpen(true);
          setTimeout(() => {
            closeAlert();
          }, 2000);
        });
    }
  };

  return (
    <div>
      <DialogTitle className="row text-center mt-2">
        <h4>
          <b>Reset User Password</b>
        </h4>
      </DialogTitle>
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
      <div className="row text-center">
        <div className="col-md-12">
          <p>
            You are about to reset a user's password. Resetting the password
            will log the user out of all devices.
          </p>
        </div>
      </div>
      <DialogContent>
        <form>
          <div className="row mb-4">
            <div className="col-md-12">
              <TextField
                label="New Password"
                required
                asterisk
                variant="outlined"
                size="small"
                id="outlined-adornment-password"
                fullWidth
                type={passvalue.showPassword ? "text" : "password"}
                value={password}
                name="password"
                onChange={handleOnChange}
                className="cpFilterLabel pt-1"
                helperText={
                  errors.password &&
                  dirty.password && (
                    <p className="error-text">{errors.password}</p>
                  )
                }
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword1}
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
          </div>
          <div className="row mb-4">
            <div className="col-md-12 ">
              <TextField
                size="small"
                required
                asterisk
                label="Confirm Password"
                variant="outlined"
                id="confirm-password"
                fullWidth
                className="cpFilterLabel"
                type={conpassvalue.showPassword ? "text" : "password"}
                value={confirmPassword}
                name="confirmPassword"
                onChange={handleOnChange}
                helperText={
                  password !== confirmPassword && confirmPassword.length > 1 ? (
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
                      {conpassvalue.showPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  ),
                }}
              />
            </div>
          </div>
          <div className="row text-center mb-5">
            <div className="col-md-12">
              <Button
                variant="contained"
                className="btn w-100"
                onClick={resetPassword}
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </div>
  );
}

export default ResetPass;
