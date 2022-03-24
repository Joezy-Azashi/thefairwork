import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DialogContent from "@material-ui/core/DialogContent";
import { DialogTitle, Dialog, TextField, Snackbar } from "@mui/material";
import CloseIcon from "@material-ui/icons/Close";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Alert } from "@material-ui/lab";
import * as auth from "../../Services/auth";
import Api from "../../Services/api";
import useForm from "../../Services/useForm";
import { ClipLoader } from "react-spinners";
import SocialMediaLogIn from "./SocialMediaLogin";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: "block",
  },
  paper: { borderRadius: 15 },
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

function Login() {
  // DEFINE THE STATE SCHEMA
  const errorCode = new URLSearchParams(new URL(window.location).search).get(
    "error"
  );
  const stateSchema = {
    loginMail: { value: "", error: "" },
    password: { value: "", error: "" },
  };
  const history = useHistory();

  const stateValidatorSchema = {
    loginMail: {
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

  const { loginMail, password } = values;

  const api = Api();
  const classes = useStyles();

  const [openLogin, setOpenLogin] = useState(false);
  const [userType, setUserType] = useState();

  // const [loginMail, setLoginMail] = useState('')

  const [loading, setloading] = useState(false);

  const [passvalue, setPassvalue] = useState({
    password: "",
    showPassword: false,
  });

  // HOOKS FOR OPENING OF SNACK BAR
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickShowPassword1 = () => {
    setPassvalue({ ...passvalue, showPassword: !passvalue.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const closeLoginDialog = () => {
    setOpenLogin(false);
  };

  const resendCode = () => {
    const data = {
      email: loginMail,
    };
    api
      .post("/users/refresh-auth-code/", data)
      .then((response) => {})
      .catch((error) => {
        setAlert({
          open: true,
          message: `${error.response.data.error}`,
          severity: "error",
        });
        setOpen(true);
      });
  };

  // API REQUEST FOR LOGIN
  const loginUser = async (e) => {
    e.preventDefault();
    const data = {
      email: loginMail,
      password: password,
    };
    if (loginMail === "" || password === "") {
      setOpen(true);
      setAlert({
        open: true,
        message: "Both fields cannot be empty",
        severity: "error",
      });
    } else {
      setloading(true);
      auth
        .loginUser(data)
        .then((response) => {
          setUserType(response?.data?.user?.accountTypeId);
          setloading(false);
          if (
            (userType === 2 &&
              response?.data?.user?.UserProfile?.firstname === "") ||
            (userType === 2 &&
              response?.data?.user?.UserProfile?.firstname === null) ||
            (userType === 2 &&
              response?.data?.user?.UserProfile?.lastname === "") ||
            (userType === 2 &&
              response?.data?.user?.UserProfile?.lastname === null) ||
            (userType === 2 &&
              response?.data?.user?.UserProfile?.summary === "") ||
            (userType === 2 &&
              response?.data?.user?.UserProfile?.summary === null) ||
            (userType === 2 &&
              response?.data?.user?.UserProfile?.phone === "") ||
            (userType === 2 &&
              response?.data?.user?.UserProfile?.phone === null) ||
            (userType === 2 && response?.data?.user?.UserSkills?.length <= 0)
          ) {
            window.location.assign("/profile");
          } else {
            console.log("Because of me");
            if (!response?.data?.user?.accountTypeId) {
              history.push("/signup-options");
              return;
            }
            response?.data?.user?.AccountType.id === 1
              ? window.location.assign("/candidate-pool")
              : response?.data?.user?.AccountType.id === 2
              ? window.location.assign("/freelancer-all-jobs")
              : response?.data?.user?.AccountType.id === 4
              ? window.location.assign("/recruiter-all-jobs")
              : window.location.assign("/admin-dashboard");
          }
        })
        .catch((error) => {
          setloading(false);
          try {
            if (error.response.data.error === "Account has not been verified") {
              setOpen(true);
              setAlert({
                open: true,
                message: `${error.response.data.error}`,
                severity: "error",
              });
              resendCode();
              localStorage.setItem("loginMail", JSON.stringify(loginMail));
              setTimeout(() => {
                window.location.assign("/confirm-account");
              }, 1000);
            } else {
              setOpen(true);
              setAlert({
                open: true,
                message: `${error.response.data.error}`,
                severity: "error",
              });
            }
          } catch (e) {
            setOpen(true);
            setAlert({
              open: true,
              message: `Error logging in`,
              severity: "error",
            });
          }
        });
    }
  };

  useEffect(() => {
    setOpenLogin(true);
  });

  return (
    <Dialog
      open={openLogin}
      onClose={closeLoginDialog}
      classes={{ paper: classes.paper }}
      fullWidth
      maxWidth="xs"
      hideBackdrop
      //disableBackdropClick
      style={{ borderRadius: "1000px" }}
    >
      <div className="card-padding">
        <DialogTitle
          className="row text-center"
          style={{ paddingBottom: 0, marginTop: "10px" }}
        >
          <h4>
            <b>Log In</b>
          </h4>
        </DialogTitle>
        <div>
          <SocialMediaLogIn text="Log In" />
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
          <form onSubmit={loginUser}>
            <div className="row mt-2 mb-4">
              <TextField
                id="email"
                label="Email"
                type="email"
                variant="outlined"
                size="small"
                name="loginMail"
                className=""
                fullWidth
                value={loginMail}
                onChange={handleOnChange}
              />
            </div>
            <div className="row mt-4">
              <TextField
                label="Password"
                variant="outlined"
                size="small"
                id="password"
                name="password"
                className="password"
                type={passvalue.showPassword ? "text" : "password"}
                value={password}
                onChange={handleOnChange}
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
            {errorCode === "noAccount" && (
              <Alert severity="error" style={{ marginTop: "10px" }}>
                Account with this email does not exist
              </Alert>
            )}
            <div className="row mt-3">
              <div className="col-sm-4 d-flex justify-content-sm-start"></div>
              <div className="col-sm-8 mt-2 d-flex justify-content-sm-end">
                <NavLink
                  className="navLink fieldprompt"
                  to={"/forgot-password"}
                >
                  Forgot Password
                </NavLink>
              </div>
            </div>
            <div className="row text-center mt-3">
              <Button
                variant="contained"
                color="primary"
                className="btn"
                type="submit"
                onClick={loginUser}
                disabled={loading}
              >
                {loading && (
                  <div>
                    <ClipLoader size={15} color="#1b98e0" loading />
                  </div>
                )}
                {loading ? "" : "Log In"}
              </Button>
            </div>
            <br />
            <div className="row text-center">
              <p>
                Don't have an account?{" "}
                <NavLink to={"/signup"} className="navLink">
                  Sign Up
                </NavLink>
              </p>
            </div>
          </form>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default Login;
