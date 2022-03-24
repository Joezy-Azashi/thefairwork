import {
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  Button,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import Api from "../../Services/api";
import {
  getSignUpUser,
  setAuthToken,
  setCurrentUser,
  getCurrentUser,
} from "../../Services/auth";

const useStyles = makeStyles((theme) => ({
  paper: { borderRadius: 15, padding: 0 },
}));

export const SignUpOptions = () => {
  const [signOption, setSignOption] = useState("freelancer");
  const [accountType, setAccountType] = useState(2);
  const history = useHistory();
  const classes = useStyles();
  const userData = getSignUpUser() || getCurrentUser();
  console.log(userData);
  const userAccountId = userData.id || userData.user.id;

  return (
    <Dialog
      open={true}
      classes={{ paper: classes.paper }}
      maxWidth="sm"
      hideBackdrop
      disableBackdropClick
      style={{ borderRadius: "1000px" }}
    >
      <div className="card-padding">
        <DialogTitle className="row text-center">
          <h4>
            <b style={{ fontFamily: "Montserrat", color: "#373833" }}>
              Complete Registration
            </b>
          </h4>
        </DialogTitle>

        <DialogContent
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="row mb-4">
            <div className="col-md-6">
              <Paper
                className={
                  signOption === "freelancer"
                    ? "SignUpPaper freelancerSignUp mobilefreelance"
                    : "SignUpPaperAlt freelancerSignUp mobilefreelance"
                }
                onClick={() => {
                  setSignOption("freelancer");
                  setAccountType(2);
                  localStorage.setItem("selectedAccType", accountType);
                }}
              >
                <div class="d-flex justify-content-end">
                  <input
                    type="radio"
                    id="freelancersignup"
                    name="status"
                    checked={signOption === "freelancer" ? true : false}
                    value="freelancer"
                    onChange={(e) => {
                      localStorage.setItem("selectedAccType", accountType);
                      setSignOption(e.target.value);
                      setAccountType(2);
                    }}
                  />
                </div>
                <p className="SignUpPaperText">
                  I want to work as <br /> a freelancer
                </p>
              </Paper>
            </div>
            <div className="col-md-6">
              <Paper
                className={
                  signOption === "client"
                    ? "SignUpPaper clientSignUp mobileclient"
                    : "SignUpPaperAlt clientSignUp mobileclient"
                }
                onClick={() => {
                  setSignOption("client");
                  setAccountType(1);
                  localStorage.setItem("selectedAccType", 1);
                }}
              >
                <div class="d-flex justify-content-end">
                  <input
                    type="radio"
                    id="clientsignup"
                    name="status"
                    value="client"
                    checked={signOption === "client" ? true : false}
                    onChange={(e) => {
                      localStorage.setItem("selectedAccType", 1);
                      setSignOption(e.target.value);
                      setAccountType(1);
                    }}
                  />
                </div>
                <p className="SignUpPaperText">
                  I want to hire for
                  <br /> work
                </p>
              </Paper>
            </div>
          </div>

          <div className="row text-center">
            <div className="mt-4 mb-4">
              <Button
                variant="contained"
                color="primary"
                className="btn signUpBtn"
                onClick={() => {
                  const data = {
                    accountTypeId: accountType,
                  };

                  Api()
                    .post(`/users/complete-registration/${userAccountId}`, data)
                    .then(({ data }) => {
                      setCurrentUser({ user: data.user });
                      setAuthToken(data.token);
                      if (accountType === 2) {
                        window.location.assign("/freelancer-all-jobs");
                        return;
                      } else if (accountType === 1) {
                        window.location.assign("/candidate-pool");
                        return;
                      }
                    })
                    .catch((err) => {
                      console.log("Error", err);
                    });

                  // localStorage.setItem("selectedAccType", accountType);
                  // history.push({
                  //   pathname: "/signup",
                  //   params: {
                  //     accountType: signOption === "freelancer" ? 2 : 1,
                  //   },
                  //   state: {
                  //     accountType: signOption === "freelancer" ? 2 : 1,
                  //   },
                  // });
                }}
              >
                Sign Up as a {signOption === "client" ? "Client" : "Freelancer"}
              </Button>
            </div>
            <p>
              Already have an account?{" "}
              <NavLink to={"/login"} className="navLink">
                Log In
              </NavLink>
            </p>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};
