import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Chip, Button } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  header: {
    height: "250px",
    backgroundColor: "#2E405B",
    marginTop: "90px",
    display: "flex",
    justifyContent: "center",
    alignItems: "end",
    [theme.breakpoints.down("xs")]: {
      height: "5rem",
      marginTop: "0px",
    },
    [theme.breakpoints.down("md")]: {
      height: "10rem",
      marginTop: "90px",
    },
  },
  headerContent: {
    color: "#FFFFFF",
    marginBottom: "3.125rem",
    fontSize: "2.5rem",
    paddingBottom: "0.45rem",
    borderBottom: "0.2rem solid #F6EE33",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "1.8rem",
    },
    [theme.breakpoints.down("md")]: {
      marginBottom: "1.8rem",
      fontSize: "2.2rem",
    },
  },
}));

function BecomeAClient() {
  const classes = useStyles();

  return (
    <div style={{ backgroundColor: "#F2F2F4" }}>
      <div className={classes.header}>
        <span className={classes.headerContent}>Become A Client</span>
      </div>

      <div className="homepageContainer">
        <div className="row mt-5">
          <div className="col-md-12">
            <p className="text-center" style={{ fontSize: "13px" }}>
              As a client, you have the opportunity to work with young,
              motivated talent from Africa (pilot project in Ghana) and
              collaborate on digital projects. TheFairWork makes it easy to
              connect with freelancers of your choice and work with your new
              team members in a cost - and time efficient way – while
              simultaneously contributing to creating sustainable social impact:
            </p>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-6 text-center">
            <img src="./images/Picture1.svg" className="contributionImg" />
          </div>

          <div className="col-md-6">
            <div className="clearHex">
              <span
                className=""
                style={{
                  borderBottom: "0.15rem solid #F6EE33",
                  margin: "0 0 20px 130px",
                }}
              >
                <b>Your Contribution</b>{" "}
              </span>

              <div style={{ fontSize: "13px" }} className="mt-3">
                <p>By working with our freelancers clients contribute to:</p>
              </div>

              <div
                className="d-flex align-items-center mb-4"
                style={{ fontSize: "13px" }}
              >
                <div>
                  <Chip label="1" className="homeNumbering" />
                </div>
                <p className="mb-0">
                  Ensuring their professional growth and exposure to working in
                  a
                  <br className="homeBreak" />
                  cross-cultural setting.
                </p>
              </div>

              <div
                className="d-flex align-items-center mb-4"
                style={{ fontSize: "13px" }}
              >
                <div>
                  <Chip label="2" className="homeNumbering" />
                </div>
                <p className="mb-0">Ensuring fair working conditions.</p>
              </div>

              <div
                className="d-flex align-items-center mb-4"
                style={{ fontSize: "13px" }}
              >
                <div>
                  <Chip label="3" className="homeNumbering" />
                </div>
                <p className="mb-0">
                  Additional training of freelancers provided by internationally
                  <br className="homeBreak" />
                  recognized platforms (Code Academy, and pluralsight, etc.) –
                  <br className="homeBreak" />
                  building upon their existing skill set to support clients.
                </p>
              </div>

              <div className="d-flex">
                <p style={{ fontSize: "13px", textAlign: "center" }}>
                  <b>
                    As a non-profit initiative, surplus, generated through
                    client
                    <br className="homeBreak" />
                    projects, goes back in supporting individuals and the
                    <br className="homeBreak" />
                    communities in Africa.
                  </b>
                </p>
              </div>
            </div>
            <div className="noHexOnMobile">
              <div className="mb-3 text-center">
              <span
                className=""
                style={{
                  borderBottom: "0.15rem solid #F6EE33",
                }}
              >
                <b>Your Contribution</b>{" "}
              </span>
              </div>

              <div style={{ fontSize: "13px" }}>
                <p>By working with our freelancers clients contribute to:</p>
              </div>

              <div
                className="d-flex align-items-center mb-4"
                style={{ fontSize: "13px" }}
              >
                <div>
                  <Chip label="1" className="homeNumbering" />
                </div>
                <p className="mb-0">
                  Ensuring their professional growth and exposure to working in
                  a
                  <br className="homeBreak" />
                  cross-cultural setting.
                </p>
              </div>

              <div
                className="d-flex align-items-center mb-4"
                style={{ fontSize: "13px" }}
              >
                <div>
                  <Chip label="2" className="homeNumbering" />
                </div>
                <p className="mb-0">Ensuring fair working conditions.</p>
              </div>

              <div
                className="d-flex align-items-center mb-4"
                style={{ fontSize: "13px" }}
              >
                <div>
                  <Chip label="3" className="homeNumbering" />
                </div>
                <p className="mb-0">
                  Additional training of freelancers provided by internationally
                  <br className="homeBreak" />
                  recognized platforms (Code Academy, and pluralsight, etc.) –
                  <br className="homeBreak" />
                  building upon their existing skill set to support clients.
                </p>
              </div>

              <div className="d-flex">
                <p style={{ fontSize: "13px", textAlign: "center" }}>
                  <b>
                    As a non-profit initiative, surplus, generated through
                    client
                    <br className="homeBreak" />
                    projects, goes back in supporting individuals and the
                    <br className="homeBreak" />
                    communities in Africa.
                  </b>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-7">
            <div className="clearHex2">
              <div style={{
                  textAlign: "center",
                  marginBottom: "20px",
                }}
                >
              <span
                style={{
                  borderBottom: "0.15rem solid #F6EE33"
                }}
              >
                <b>Sign-Up Today!</b>
              </span>
              </div>

              <div className="text-center mb-3" style={{ fontSize: "13px" }}>
                <div className="mb-3">
                  <Chip label="1" className="become" />
                </div>
                <p className="mb-0">
                  Sign up by clicking on the sign-up button on the top right
                </p>
              </div>

              <div className="text-center mb-3" style={{ fontSize: "13px" }}>
                <div className="mb-3">
                  <Chip label="2" className="become" />
                </div>
                <p className="mb-0">
                  Let freelancers know what you are looking for by creating a
                  job profile –
                  <br className="homeBreak" />
                  and receive matching applications.
                  <br />{" "}
                  <span style={{ color: "#2e405b" }}>
                    <b>or</b>
                  </span>{" "}
                  <br />
                  Search for the right talent to support you with your project.
                  You also
                  <br className="homeBreak" />
                  have the option of creating a team by choosing more than one
                  freelancer.
                </p>
              </div>

              <div className="text-center mb-3" style={{ fontSize: "13px" }}>
                <div className="mb-3">
                  <Chip label="3" className="become" />
                </div>
                <p className="mb-0">
                  Choose optional ad-ons (tools, office space etc.) for flawless
                  <br className="homeBreak" />
                  collaboration with your freelancers.
                </p>
              </div>

              <div className="text-center mb-3" style={{ fontSize: "13px" }}>
                <div className="mb-3">
                  <Chip label="4" className="become" />
                </div>
                <p className="mb-0">
                  Schedule a first introductory meeting with the help of
                  <br className="homeBreak" />
                  TheFairWork team and connect with the freelancers of your
                  choice!
                </p>
              </div>
            </div>
            <div className="noHexOnMobile textSpaceMobile">
              <div className="mb-3 text-center">
              <span
                style={{
                  borderBottom: "0.15rem solid #F6EE33",
                }}
              >
                <b>Sign-Up Today!</b>{" "}
              </span>
              </div>

              <div className="text-center mb-3" style={{ fontSize: "13px" }}>
                <div className="mb-3">
                  <Chip label="1" className="become" />
                </div>
                <p className="mb-0">
                  Sign up by clicking on the sign-up button on the top right
                </p>
              </div>

              <div className="text-center mb-3" style={{ fontSize: "13px" }}>
                <div className="mb-3">
                  <Chip label="2" className="become" />
                </div>
                <p className="mb-0">
                  Let freelancers know what you are looking for by creating a
                  job profile –
                  <br className="homeBreak" />
                  and receive matching applications.
                  <br />{" "}
                  <span style={{ color: "#2e405b" }}>
                    <b>or</b>
                  </span>{" "}
                  <br />
                  Search for the right talent to support you with your project.
                  You also
                  <br className="homeBreak" />
                  have the option of creating a team by choosing more than one
                  freelancer.
                </p>
              </div>

              <div className="text-center mb-3" style={{ fontSize: "13px" }}>
                <div className="mb-3">
                  <Chip label="3" className="become" />
                </div>
                <p className="mb-0">
                  Choose optional ad-ons (tools, office space etc.) for flawless
                  <br className="homeBreak" />
                  collaboration with your freelancers.
                </p>
              </div>

              <div className="text-center mb-3" style={{ fontSize: "13px" }}>
                <div className="mb-3">
                  <Chip label="4" className="become" />
                </div>
                <p className="mb-0">
                  Schedule a first introductory meeting with the help of
                  <br className="homeBreak" />
                  TheFairWork team and connect with the freelancers of your
                  choice!
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-5 text-center">
            <img src="./images/Picture2.svg" className="contributionImg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BecomeAClient;
