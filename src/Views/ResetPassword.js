import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogContent,
  TextField,
  DialogTitle,
  IconButton,
  Snackbar,
} from "@mui/material";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Api from "../Services/api";
import { Alert } from "@material-ui/lab";
import { getForgotUser } from "../Services/auth";
import useForm from "../Services/useForm";
import CloseIcon from "@material-ui/icons/Close";
import {useParams} from 'react-router-dom'

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

function ResetPassword() {
  // DEFINE THE STATE SCHEMA
  const stateSchema = {
    password: { value: "", error: "" },
    confirmPassword: { value: "", error: "" },
  };

  const {id} = useParams();


  const stateValidatorSchema = {
    password: {
      required: true,
      validator: {
        func: (value) =>
          /^(?=.*[A-Za-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
            value
          ) && /([0-9])/.test(value),
        error: "Minimum 8, at least a special character & a number",
      },
    },
  };

  const { values, errors, dirty, handleOnChange } = useForm(
    stateSchema,
    stateValidatorSchema
  );

  const { password, confirmPassword } = values;

  const api = Api();
  const classes = useStyles();
  const [openReset, setOpenReset] = useState(false);

  const [mail, setMail] = useState(getForgotUser().user);

  const [passvalue, setPassvalue] = useState({
    password: "",
    showPassword: false,
  });
  const [conpassvalue, setConpassvalue] = useState({
    confirm_password: "",
    showPassword: false,
  });

  const [errorSate, seterrorSate] = useState(false)
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

  const handleClose = () => {
    setOpen(false);
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

  useEffect(() => {
    setOpenReset(true);
  }, []);

  const resetPassword = async (e) => {
    e.preventDefault();
    const data = {
      email: mail,
      password: password,
      confirm_password: confirmPassword,
    };
    if(errors.password){

    }else if(password === "" || confirmPassword === ""){
      seterrorSate(true)
    }else{
      api
      .post(`/users/reset-user-password/${id}`, data)
      .then((response) => {
        setAlert({
          open: true,
          message: `${response.data.message}`,
          severity: "success",
        });
        setTimeout(() => {
          window.location.assign("/login");
        }, 2000);
        setOpen(true);
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: `${error.response.data.error}`,
          severity: "error",
        });
        setOpen(true);
        closeAlert();
      });
    }
  };

  return (
    <Dialog
      open={openReset}
      classes={{ paper: classes.paper }}
      fullWidth
      maxWidth="xs"
      //disableBackdropClick
      hideBackdrop
      className="dialogborder"
    >
      <div className="card-padding">
        <DialogTitle className="row text-center">
          <h4>
            <b>Reset Password </b>
          </h4>
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
            <p>
              Resetting your password will log you out of all the devices you
              have previously used to login
            </p>
          </div>
        </DialogTitle>
        <DialogContent>
          <form>
            <div className="row">
              <div className="col-md-12 mb-4">
                <TextField
                  label="Password"
                  required
                  asterisk
                  variant="outlined"
                  size="small"
                  id="outlined-adornment-password"
                  className="password"
                  fullWidth
                  type={passvalue.showPassword ? "text" : "password"}
                  value={password}
                  name="password"
                  onChange={handleOnChange}
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
            <div className="row text-spaces">
              <div className="col-md-12 fieldprompt">
                <TextField
                  size="small"
                  required
                  asterisk
                  label="Confirm Password"
                  variant="outlined"
                  id="confirm-password"
                  className="password"
                  fullWidth
                  type={conpassvalue.showPassword ? "text" : "password"}
                  value={confirmPassword}
                  name="confirmPassword"
                  onChange={handleOnChange}
                  helperText={
                    password !== confirmPassword &&
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
            <div className="row text-center mt-5">
              <Button
                variant="contained"
                className="btn"
                onClick={resetPassword}
              >
                Reset
              </Button>
            </div>
          </form>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default ResetPassword;
