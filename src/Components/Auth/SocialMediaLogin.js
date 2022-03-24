import React, { useState, useRef } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { withStyles, Tooltip } from "@material-ui/core";
import config from "../../Components/../public/config";
import { useHistory } from "react-router";

const StyledTooltip = withStyles({
  tooltip: {
    backgroundColor: "white",
    color: "#373833",
    fontFamily: '"Segoe UI", Regular',
    marginTop: "2px",
  },
})(Tooltip);

const SocialMediaLogIn = ({ text }) => {
  const history = useHistory();
  const [loader, setLoader] = useState("pointer");
  return (
    <div>
      <div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 2,
              width: 100,
              height: 50,
              marginBottom: 5,
            },
          }}
        >
          <StyledTooltip
            title={`${text} with Google`}
            style={{ maxHeight: "95px"}}
          >
            <Paper
              elevation={0}
              style={{
                border: "1px solid gray",
                height: "50px",
                display: "grid",
                placeItems: "center",
                cursor: loader,
                marginBottom: 20
              }}
              className=""
              onClick={(e) => {
                e.preventDefault();
                // if (text === "Sign Up" && !localStorage.getItem("selectedAccType")) {
                //   history.push("/signup-options");
                //   return;
                // }
                setLoader("progress");
                window.location.assign(
                  text === "Log In"
                    ? `${config.api}/social/login/google`
                    : `${
                        config.api
                      }/social/register/google`
                );
              }}
            >
              <span>
                <img
                  src="/images/SocialMedia/google-icon.svg"
                  alt="google icon"
                />
              </span>
            </Paper>
          </StyledTooltip>
          <StyledTooltip
            title={`${text} with Facebook`}
            style={{ maxHeight: "95px" }}
          >
            <Paper
              elevation={0}
              style={{
                border: "1px solid gray",
                height: "50px",
                display: "grid",
                placeItems: "center",
                cursor: loader,
                marginBottom: 20
              }}
              onClick={(e) => {
                e.preventDefault();
                // if (text === "Sign Up" && !localStorage.getItem("selectedAccType")) {
                //   history.push("/signup-options");
                //   return;
                // }
                setLoader("progress");
                window.location.assign(
                  text === "Log In"
                    ? `${config.api}/social/login/facebook`
                    : `${
                        config.api
                      }/social/register/facebook`
                );
              }}
            >
              <span>
                <img
                  src="/images/SocialMedia/facebook-icon.svg"
                  alt="google icon"
                />
              </span>
            </Paper>
          </StyledTooltip>
          <StyledTooltip
            title={`${text} with LinkedIn`}
            style={{ maxHeight: "95px" }}
          >
            <Paper
              elevation={0}
              style={{
                border: "1px solid gray",
                height: "50px",
                display: "grid",
                placeItems: "center",
                cursor: loader,
                marginBottom: 20
              }}
              onClick={(e) => {
                e.preventDefault();
                // if (text === "Sign Up" && !localStorage.getItem("selectedAccType")) {
                //   history.push("/signup-options");
                //   return;
                // }

                setLoader("progress");
                window.location.assign(
                  text === "Log In"
                    ? `${config.api}/social/login/linkedIn`
                    : `${
                        config.api
                      }/social/register/linkedIn`
                );
              }}
            >
              <span>
                <img
                  src="/images/SocialMedia/linkedin-icon.svg"
                  alt="google icon"
                />
              </span>
            </Paper>
          </StyledTooltip>
        </Box>
      </div>
      <div className="separator">
        <span
          style={{ textAlign: "center", fontFamily: "Montserrat, SemiBold" }}
        >
          {`Or ${text} with`}
        </span>
      </div>
    </div>
  );
};

export default SocialMediaLogIn;
