import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogContent,
  Snackbar,
  IconButton,
  TextField,
} from "@mui/material";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import * as auth from "../../Services/auth";
import useForm from "../../Services/useForm";
import { ClipLoader } from "react-spinners";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: "block",
  },
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

function ForgotPassword() {
  // DEFINE THE STATE SCHEMA
  const stateSchema = {
    forgotMail: { value: "", error: "" },
  };

  const stateValidatorSchema = {
    forgotMail: {
      required: true,
      validator: {
        func: (value) =>
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            value
          ),
        error: "Email must be a valid one",
      },
    },
  };

  const { values, errors, dirty, handleOnChange } = useForm(
    stateSchema,
    stateValidatorSchema
  );

  const { forgotMail } = values;

  const classes = useStyles();

  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [loading, setloading] = useState(false);
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

  const closeForgotDialog = () => {
    setOpenForgotPassword(false);
  };

  // API REQUEST FOR FORGOT PASSWORD
  const forgotPassword = async (e) => {
    e.preventDefault();
    const data = {
      email: forgotMail,
      passwordResetUrl: `${window.location.protocol}//${window.location.host}/reset-password`,
    };
    if (forgotMail === "") {
      seterrorSate(true);
    } else {
      setloading(true);
      auth
        .forgotUser(data)
        .then((response) => {
          setAlert({
            open: true,
            message: `${response.data.message}`,
            severity: "success",
          });
          setOpen(true);
          setloading(false);
        })
        .catch((error) => {
          setloading(false);
          setAlert({
            open: true,
            message: `${error.response.data.error}`,
            severity: "error",
          });
          setOpen(true);
        });
    }
  };

  useEffect(() => {
    setOpenForgotPassword(true);
  });

  return (
    <Dialog
      open={openForgotPassword}
      onClose={closeForgotDialog}
      classes={{ paper: classes.paper }}
      fullWidth
      maxWidth="xs"
      hideBackdrop
      //disableBackdropClick
    >
      <div className="card-padding">
        <DialogTitle className="row text-center">
          <h4>
            <b>Forgot Password</b>
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
        <DialogContent>
          <form onSubmit={forgotPassword}>
            <div className="row mt-3 text-center">
              <p>
                Enter your email and we will send you a link to reset your
                password
              </p>
            </div>
            <div className="row mt-2">
              <TextField
                id="email"
                label="Email"
                type="email"
                variant="outlined"
                size="small"
                fullWidth
                name="forgotMail"
                className=""
                value={forgotMail}
                onChange={handleOnChange}
                helperText={
                  errors.forgotMail &&
                  dirty.forgotMail && (
                    <p className="error-text">{errors.forgotMail}</p>
                  )
                }
              />
            </div>
            <div className="row text-center mt-4 mb-3">
              <Button
                variant="contained"
                className="btn"
                type="submit"
                onClick={forgotPassword}
                disabled={loading}
              >
                {loading && (
                  <div>
                    <ClipLoader size={15} color="#1b98e0" loading />
                  </div>
                )}
                {loading ? "" : "Send Email"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default ForgotPassword;
