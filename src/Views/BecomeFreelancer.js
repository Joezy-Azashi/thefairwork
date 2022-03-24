import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {Chip, Button} from "@mui/material";
import { NavLink } from "react-router-dom";

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

function BecomeFreelancer() {
  const classes = useStyles();
  return (
    <div style={{ backgroundColor: "#F2F2F4" }}>
      <div className={classes.header}>
        <span className={classes.headerContent}>Become A Freelancer</span>
      </div>
    <div className="homepageContainer">
    <div className="row mt-5">
        <div className="col-md-12 mb-3">
          <span className="WhyJoinheaderLine">Why Join TheFairWork?</span>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-10 mb-5">
        <div className="" style={{position: "absolute", zIndex: "1", right: "300px"}}>
            <img src="./images/About image.png" className="freelanceHexOnMobile"/>
          </div>
          <div className="" style={{position: "relative", zIndex: "2"}}>
          <div className="d-flex  mb-5">
            <div>
              <Chip label="1" className="homeNumbering" />
            </div>
            <div>
            <p style={{color: "#2E405B"}}><b>Long-Term Client Engagement</b></p>
            <p className="mb-0" style={{fontSize: "14px"}}>
            We believe a talent’s engagement with clients has enormous long-term benefits and promotes effective communication, trust and ultimately drives work and company growth. Clients have the option to engage talents for multiples of 1, 3, 6 and 12 months. Our model seeks to achieve a more long-term client relationship approach both with us and our talents right from the start to finish of a project.
            </p>
            </div>
          </div>

          <div className="d-flex  mb-5">
            <div>
              <Chip label="2" className="homeNumbering" />
            </div>
            <div>
            <p style={{color: "#2E405B"}}><b>A Career with Purpose and Security</b></p>
            <p className="mb-0" style={{fontSize: "14px"}}>
            With our long-term view of freelancer engagements by ensuring professional growth, we connect you with jobs that pay you the best wages dependent on your skills and expertise. You also benefit from our social protection initiative. The uncertainty of the gig economy with inadequate social protection, could be damaging for freelancers, so we ensure that during the time you have a gig you are provided a minimum of a living wage, and when you are off the gig, you are provided a minimum wage for the duration of time after which you had your last gig.
            </p>
            </div>
          </div>

          <div className="d-flex  mb-5">
            <div>
              <Chip label="3" className="homeNumbering" />
            </div>
            <div>
            <p style={{color: "#2E405B"}}><b>Inclusion & Diversity</b></p>
            <p className="mb-0" style={{fontSize: "14px"}}>
            We believe that there is growth, resilience, and beauty when we embrace the differences that make us unique. We are best placed to build relationships with clients and freelancers and ensure we maintain an engaged and productive remote working environment. As diversity fuels dynamism we promote critical thinking, creativity, problem solving, innovation and invention. We provide opportunities for organizations as well as freelancers to interact early on, and start building a greater common understanding of each other and each other’s culture.
            </p>
            </div>
          </div>
          </div>
        </div>
      </div>

      <div className="row freelanceSignupTop">
          <div className="col-md-12 col-lg-7 col-sm-12 col-xs-12">
            <div className="clearHex2">
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
                  Set-up your account and add relevant details including your education,
                  <br className="homeBreak" />portfolio, and skills
                </p>
              </div>

              <div className="text-center mb-3" style={{ fontSize: "13px" }}>
                <div className="mb-3">
                  <Chip label="3" className="become" />
                </div>
                <p className="mb-0">
                Verify your skills by taking tests from internationally recognized platforms,
                <br className="homeBreak" />provided to you by TheFairWork
                </p>
              </div>

              <div className="text-center mb-3" style={{ fontSize: "13px" }}>
                <div className="mb-3">
                  <Chip label="4" className="become" />
                </div>
                <p className="mb-0">
                Browse through international & local job profiles and apply!
                </p>
              </div>
            </div>
            <div className="noHexOnMobile">
            <div className="mb-3 text-center">
              <span
                style={{
                  borderBottom: "0.15rem solid #F6EE33",
                  width: "130px",
                  margin: "auto",
                  marginBottom: "20px",
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
                Set-up your account and add relevant details including your education,
                  portfolio, and skills
                </p>
              </div>

              <div className="text-center mb-3" style={{ fontSize: "13px" }}>
                <div className="mb-3">
                  <Chip label="3" className="become" />
                </div>
                <p className="mb-0">
                Verify your skills by taking tests from internationally recognized platforms,
                provided to you by TheFairWork
                </p>
              </div>

              <div className="text-center mb-3" style={{ fontSize: "13px" }}>
                <div className="mb-3">
                  <Chip label="4" className="become" />
                </div>
                <p className="mb-0">
                Browse through international & local job profiles and apply!
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-5 col-sm-12 col-xs-12 text-center">
            <img src="./images/Picture9.png" className="FreelancecontributionImg" />
          </div>
        </div>
  </div>
  </div>
  )
}

export default BecomeFreelancer;
