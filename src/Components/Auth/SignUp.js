import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogContent,
  TextField,
  DialogTitle,
  Button,
  IconButton,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@material-ui/icons/Close";
import { NavLink } from "react-router-dom";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Alert } from "@material-ui/lab";
import * as auth from "../../Services/auth";
import useForm from "../../Services/useForm";
import { ClipLoader } from "react-spinners";
import SocialMediaLogIn from "./SocialMediaLogin";
import { useHistory, useLocation } from "react-router";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: "block",
  },
  paper: { borderRadius: 15, marginTop: "100px" },
  sectionDesktop: {
    margin: "10px",
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

function SignUp() {
  const history = useHistory();
  // DEFINE THE STATE SCHEMA
  const errorCode = new URLSearchParams(new URL(window.location).search).get(
    "error"
  );
  const stateSchema = {
    signupEmail: { value: "", error: "" },
    password: { value: "", error: "" },
    confirmPassword: { value: "", error: "" },
  };

  const stateValidatorSchema = {
    signupEmail: {
      required: true,
      validator: {
        func: (value) =>
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            value
          ),
        error: "Email must be a valid one",
      },
    },
    password: {
      required: true,
      validator: {
        func: (value) =>
          /^(?=.*[A-Za-z])(?=.*[@$!%*#?&.,<>();:^/[+'"])[A-Za-z\d@$!%*#?&.,<>();:^/[+'"]{8,}$/.test(
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

  const { signupEmail, password, confirmPassword } = values;

  const classes = useStyles();
  const location = useLocation();

  // const [signupEmail, setSignupEmail] = useState('')
  const [accountType, setAccountType] = useState(location?.params?.accountType);
  const [openSignup, setOpenSignup] = useState(false);

  const [loading, setloading] = useState(false);
  const [errorSate, seterrorSate] = useState(false);

  const [passSignValue, setPassSignValue] = useState({
    password: "",
    showPassword: false,
  });

  const [confirmSignValue, setConFirmSignValue] = useState({
    password: "",
    showPassword: false,
  });

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    setOpen(false);
  };

  const closeSignupDialog = () => {
    setOpenSignup(false);
  };

  const handleClickSignPassword = () => {
    setPassSignValue({
      ...passSignValue,
      showPassword: !passSignValue.showPassword,
    });
  };

  const handleChangeSignpass = (prop) => (event) => {
    setPassSignValue({ ...passSignValue, [prop]: event.target.value });
  };

  const handleChangeSignConfirmpass = (prop) => (event) => {
    setConFirmSignValue({ ...confirmSignValue, [prop]: event.target.value });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickSignConfirmPassword = () => {
    setConFirmSignValue({
      ...confirmSignValue,
      showPassword: !confirmSignValue.showPassword,
    });
  };

  // API LOGIC FOR SIGNUP
  const signUp = async (e) => {
    e.preventDefault();
    const data = {
      email: signupEmail,
      password: password,
      // account_type: accountType,
    };

    // if (!accountType) {
    //   history.push("/signup");
    //   return;
    // }

    if (signupEmail === "" || password === "" || confirmPassword === "") {
      setloading(false);
      setOpen(true);
      setAlert({
        open: true,
        message: `All fields cannot be empty`,
        severity: "error",
      });
    } else if (password !== confirmPassword) {
    } else if (errors.signupEmail || errors.password) {
    } else {
      setloading(true);
      auth
        .signUpUser(data)
        .then((response) => {
          setloading(false);
          window.location.assign("/confirm-account");
        })
        .catch((error) => {
          setloading(false);
          setOpen(true);
          setAlert({
            open: true,
            message: `${error?.response?.data?.error}`,
            severity: "error",
          });
        });
    }
  };

  useEffect(() => {
    setOpenSignup(true);
  });

  return (
    <Dialog
      open={openSignup}
      onClose={closeSignupDialog}
      classes={{ paper: classes.paper }}
      fullWidth
      maxWidth="xs"
      hideBackdrop
    >
      <div className="card-padding">
        <DialogTitle className="row text-center">
          <h4>
            <b>Sign Up</b>
          </h4>
        </DialogTitle>
        <div>
          <SocialMediaLogIn text="Sign Up" />
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
                ></IconButton>
              }
            >
              {alert.message}
            </Alert>
          </Snackbar>
        </div>
        <DialogContent>
          <form onSubmit={signUp}>
            <div className="row mt-1">
              <div className="col-md-12 mb-4">
                <TextField
                  id="email"
                  required
                  asterisk
                  label="Email"
                  type="email"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="signupEmail"
                  className=""
                  value={signupEmail}
                  onChange={handleOnChange}
                  helperText={
                    errors.signupEmail &&
                    dirty.signupEmail && (
                      <p className="error-text">{errors.signupEmail}</p>
                    )
                  }
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mb-4">
                <TextField
                  label="Password"
                  required
                  asterisk
                  variant="outlined"
                  size="small"
                  fullWidth
                  id="outlined-adornment-password"
                  type={passSignValue.showPassword ? "text" : "password"}
                  value={password}
                  name="password"
                  className="password"
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
                        onClick={handleClickSignPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {passSignValue.showPassword ? (
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
            <div className="row">
              <div className="col-md-12">
                <TextField
                  required
                  asterisk
                  size="small"
                  label="Confirm Password"
                  variant="outlined"
                  id="confirm-password"
                  fullWidth
                  type={confirmSignValue.showPassword ? "text" : "password"}
                  value={confirmPassword}
                  name="confirmPassword"
                  className="password"
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
                        onClick={handleClickSignConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {confirmSignValue.showPassword ? (
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
            {errorCode === "userExists" && (
              <Alert severity="error" style={{ marginTop: "10px" }}>
                User with this email already exists
              </Alert>
            )}
            {errorCode === "unknown" && (
              <Alert severity="error" style={{ marginTop: "10px" }}>
                Oops! an error occured
              </Alert>
            )}
            <div className="row text-center" style={{ marginTop: "15px" }}>
              <div className="col-md-12">
                <p>
                  By signing up, you are agreeing to the
                  <a
                    href="/privacy-policy"
                    className="navLink"
                    style={{ fontWeight: "700" }}
                  >
                    {" "}
                    privacy policy
                  </a>{" "}
                  of thefairwork.com
                </p>
              </div>
            </div>

            <div className="row text-center mt-2">
              <div className="col-md-12">
                <Button
                  variant="contained"
                  className="btn w-100"
                  type="submit"
                  onClick={signUp}
                  disabled={loading}
                >
                  {loading && (
                    <div>
                      <ClipLoader size={15} color="#1b98e0" loading />
                    </div>
                  )}
                  {loading ? "" : "Sign Up"}
                </Button>
              </div>
            </div>

            <hr />
            <div className="row text-center">
              <p>
                Already have an account?{" "}
                <NavLink to={"/login"} className="navLink">
                  Log In
                </NavLink>
              </p>
            </div>
          </form>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default SignUp;
