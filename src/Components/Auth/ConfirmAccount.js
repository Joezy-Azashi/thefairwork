import React, { useState, useRef, useEffect } from "react";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import { DialogTitle, Dialog, Snackbar, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../../Services/api";
import { Alert } from "@material-ui/lab";
import { getSignUpUser } from "../../Services/auth";
import CloseIcon from "@material-ui/icons/Close";
import { ClipLoader } from "react-spinners";

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

function ConfirmAccount() {
  const classes = useStyles();
  const buttonRef = useRef();

  const api = Api();

  const [confirmationCode, setConfirmationCode] = useState("");
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");
  const [code4, setCode4] = useState("");
  const [email, setEmail] = useState(
    getSignUpUser()?.user
      ? getSignUpUser()?.user
      : JSON.parse(localStorage.getItem("loginMail"))
  );
  const code1Ref = useRef(null);
  const code2Ref = useRef(null);
  const code3Ref = useRef(null);
  const code4Ref = useRef(null);
  const [countDown, setCountDown] = useState(120);
  const [disabled, setDisabled] = useState(true);
  const [openAccount, setOpenAccount] = useState(false);
  const [loading, setloading] = useState(false);
  const [recruiter, setrecruiter] = useState(
    JSON.parse(localStorage.getItem("local-recruiter")) !== null
      ? JSON.parse(localStorage.getItem("local-recruiter"))
      : []
  );

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const closeSnackbar = () => {
    setOpen(false);
  };

  function countdown(minutes) {
    var seconds = 60;
    var mins = minutes;

    function tick() {
      //This script expects an element with an ID = "counter". You can change that to what ever you want.

      var current_minutes = mins - 1;
      seconds--;
      const cnt =
        current_minutes.toString() +
        ":" +
        (seconds < 10 ? "0" : "") +
        String(seconds);
      if (seconds > 0) {
        setTimeout(tick, 1000);
      } else if (mins > 1) {
        countdown(mins - 1);
      } else {
        setDisabled(false);
      }
      setCountDown(cnt);
    }
    tick();
  }

  const verifyCode = async (e) => {
    e.preventDefault();
    const data = {
      auth_code: code1 + code2 + code3 + code4,
      email: email,
    };
    if (code1 === "" || code2 === "" || code3 === "" || code4 === "") {
    } else {
      setloading(true);
      api
        .post("/users/verify-auth-code/", data)
        .then((response) => {
          setloading(false);
          if (recruiter === "local recruiter") {
            window.location.assign("/recruiter-login");
            localStorage.clear("local-recruiter");
          } else {
            window.location.assign("/signup-options");
          }
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

  const setPastedConfirmationCode = (e) => {
    let value = e.clipboardData.getData("Text").split("");
    setCode1(value[0]);
    setCode2(value[1]);
    setCode3(value[2]);
    setCode4(value[3]);

  if(code1 && code2 && code3 && code4){
    document.getElementById('submit').click();
  }
  };

  const resendCode = () => {
    const data = {
      email: email,
    };
    setDisabled(true);
    api
      .post("/users/refresh-auth-code/", data)
      .then(async (response) => {
        await countdown(2);
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: `${error.response.data.error}`,
          severity: "error",
        });
        setOpen(true);
      });
  };

  useEffect(() => {
    setOpenAccount(true);
    if (countDown == 120) countdown(2);
  }, []);


  useEffect(() => {

    if(code4 === ''){
      return;
    }else{
      document.querySelector('#submit').click();
    }
     
  }, [code1, code2, code3, code4])
  

  return (
    <Dialog
      open={openAccount}
      fullWidth
      maxWidth="xs"
      hideBackdrop
      //disableBackdropClick
    >
      <div className="card-padding">
        <DialogTitle className="row text-center">
          <div className="col-md-12">
            <h6 className="mb-3">{countDown}</h6>
            <h4>
              <b>Account Confirmation</b>
            </h4>
          </div>
        </DialogTitle>
        <div className="row text-center">
          <div className="col-md-12">
            <p>
              A confirmation code has been sent to your mail. <br />
              Kindly enter the code in the space below to verify your account
            </p>
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
            onClose={closeSnackbar}
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
          <form>
            <div className="form-group confirm-code mb-5">
              <input
                onPaste={(e) => setPastedConfirmationCode(e)}
                type="text"
                id="code1"
                name="input1"
                maxlength={1}
                value={code1}
                className="codebox"
                onChange={(e) => setCode1(e.target.value)}
                ref={code1Ref}
                style={{
                  textAlign: "center",
                }}
              />
              <input
                type="text"
                id="code2"
                onPaste={(e) => setPastedConfirmationCode(e)}
                name="input2"
                maxlength={1}
                value={code2}
                className="codebox"
                onChange={(e) => setCode2(e.target.value)}
                ref={code2Ref}
                style={{
                  textAlign: "center",
                }}
              />
              <input
                type="text"
                id="code3"
                onPaste={(e) => setPastedConfirmationCode(e)}
                name="input3"
                value={code3}
                maxlength={1}
                className="codebox"
                onChange={(e) => setCode3(e.target.value)}
                ref={code3Ref}
                style={{
                  textAlign: "center",
                }}
              />
              <input
                type="text"
                id="code4"
                onPaste={(e) => setPastedConfirmationCode(e)}
                name="input4"
                value={code4}
                maxlength={1}
                className="codebox"
                onChange={(e) => setCode4(e.target.value)}
                ref={code4Ref}
                style={{
                  textAlign: "center",
                }}
              />
            </div>
            <div className="row text-center mt-2">
              <Button
               id="submit"
                ref={buttonRef}
                variant="contained"
                className="btn"
                type="submit"
                onClick={verifyCode}
                disabled={
                  code1 === "" || code2 === "" || code3 === "" || code4 === ""
                }
              >
                {loading && (
                  <div>
                    <ClipLoader size={15} color="#1b98e0" loading />
                  </div>
                )}
                {loading ? "" : "Confirm Account"}
              </Button>
            </div>
          </form>
          <div className="row text-center">
            <div>
              <Button
                className="btn-text mt-4"
                disabled={disabled}
                type="submit"
                onClick={resendCode}
              >
                Resend confirmation code
              </Button>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default ConfirmAccount;
