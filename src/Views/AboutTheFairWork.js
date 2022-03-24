import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { flexbox } from "@mui/system";
import Chip from "@mui/material/Chip";
import { SocialIcon } from "react-social-icons";
import { mdiEmailOutline } from "@mdi/js";
import Icon from "@mdi/react";

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
    },
  },
  opportunity: {
    margin: "120px 100px 0 120px",
    [theme.breakpoints.down("xs")]: {
      margin: "50px 0px 0px 0px",
    },
    [theme.breakpoints.down("md")]: {
      margin: "50px 20px 0px 20px",
    },
  },
  listItem: {
    marginTop: "15px",
    color: "#555555",
    fontSize: "1.125",
    counterIncrement: "steps",
    // marginLeft: "20px",
  },
  imageItem: {
    width: "100%",
    marginBottom: "10px",
    borderRadius: "15px",
  },
  imageName: {
    textAlign: "center",
    marginBottom: "0px",
    color: "#555555",
    fontWeight: "800",
    fontSize: "16px",
  },
  imageTitle: {
    textAlign: "center",
    marginBottom: "17px",
    color: "#555555",
    fontSize: "14px",
  },
  headersTitle: {
    fontSize: "1.5rem",
    color: "#2E405B",
    fontWeight: "800",
    borderBottom: "0.15rem solid #F6EE33",
  },
}));
function AboutTheFairWork() {
  const classes = useStyles();
  return (
    <>
      <div className={classes.header}>
        <span className={classes.headerContent}>About TheFairWork</span>
      </div>
      <div className="homepageContainer">
        {" "}
        <div className="row">
          <div
            className="col-md-12 col-lg-6 col-x-12"
            style={{ marginBottom: "10px" }}
          >
            <span className={classes.headersTitle}>
              <b>Africa's Opportunity</b>{" "}
            </span>
            <div className="d-flex align-items-center mb-4 mb-xxl-5 mt-4">
              <div>
                <Chip label="1" className="homeNumbering" />
              </div>
              <p className="mb-0">
                Every year over 2 million ICT students in Africa graduate from
                university – ready to skyrocket their career.
              </p>
            </div>

            <div className="d-flex align-items-center mb-4 mb-xxl-5">
              <div>
                <Chip label="2" className="homeNumbering" />
              </div>
              <p className="mb-0">
                Africa’s job market is exhausted, making it difficult for young
                African IT/Tech graduates to find employment.
              </p>
            </div>

            <div className="d-flex align-items-center mb-4 mb-xxl-5">
              <div>
                <Chip label="3" className="homeNumbering" />
              </div>
              <p className="mb-0">
                Africa has a motivated, innovative young population: by 2050 1/3
                of the global youth will come from Africa.
              </p>
            </div>

            <div className="d-flex align-items-center mb-4 mb-xxl-5">
              <div>
                <Chip label="4" className="homeNumbering" />
              </div>
              <p className="mb-0">
                Africa's youth is the driving force of digital innovation making
                the continent the one with the highest rate of potential
                entrepreneurs at 56% compared to 21% in Asia.
              </p>
            </div>

            <div className="d-flex align-items-center mb-4 mb-xxl-5">
              <div>
                <Chip label="5" className="homeNumbering" />
              </div>
              <p className="mb-0">
                Lack of exposure hampers the opportunities of young Africans to
                advance their digital skills
              </p>
            </div>
          </div>
          <div className="col-md-12 col-lg-6 col-x-12 text-center mt-1">
            <img
              src="/images/Group 2562.png"
              alt=""
              style={{ width: "100%" }}
            />
            <div className="text-center mt-4">
              <p>Source: UN World Population Prospects (2019)</p>
            </div>
          </div>
        </div>
        <div className="row" style={{ marginTop: "50px" }}>
          <div className="col-12">
            <span className={classes.headersTitle}>
              <b>Our Mission</b>{" "}
            </span>
            <p
              style={{
                marginTop: "30px",
                fontSize: "1.125rem",
                color: "#555555",
              }}
            >
              <b>
                Our mission is to empower the youth of Africa by providing
                international exposure to their digital skills. Our freelancer
                platform showcases the talent of young, motivated individuals -
                connecting them to businesses across the world who can benefit
                from their talent, hard work, and grit.
              </b>
            </p>
          </div>
        </div>
        <div className="row" style={{ marginTop: "50px" }}>
          <div className="col-12">
            <span className={classes.headersTitle}>
              <b>Our Partners</b>{" "}
            </span>
            <p
              style={{
                marginTop: "30px",
                marginBottom: "0px",
                fontSize: "1.125rem",
                color: "#555555",
              }}
            >
              This initiative is funded by GIZ and implemented by AmaliTech
              through DSAA
            </p>
          </div>
          <div className="partnersOnMobile d-flex justify-content-between mt-3">
            <div>
              <a target="_blank" href="//www.amalitech.org ">
                <img
                  src="/images/amalitech logo.png"
                  alt="partner"
                  style={{ marginTop: "25px", width: "150px" }}
                />
              </a>
            </div>
            <div>
              <a target="_blank" href="//www.dsaa.eu">
                <img
                  src="/images/DSAA_Logo.png"
                  alt="partner"
                  style={{ width: "160px" }}
                />
              </a>
            </div>
            <div>
              <img
                src="/images/german cooperation.png"
                alt="partner"
                style={{ width: "120px" }}
              />
            </div>
            <div>
              <img
                src="/images/invest for jobs.png"
                alt="partner"
                style={{ width: "230px" }}
              />
            </div>
            <div>
              <img
                src="/images/GIZ.png"
                alt="partner"
                style={{ marginTop: "-10px", width: "230px" }}
              />
            </div>
            <div id="fwTeam">
              <img
                src="/images/KFW logo.png"
                alt=""
                style={{ width: "150px" }}
              />
            </div>
          </div>
        </div>
        <div className="row" style={{ marginTop: "20px" }}>
          <div className="col-12" style={{ marginBottom: "30px" }}>
            <span className={classes.headersTitle}>
              <b>Our Team</b>{" "}
            </span>
          </div>

          {/* START OF ADVISOR 1*/}
          <div className="col-xs-4 col-sm-6 col-md-4 col-lg-3">
            <img
              src="/images/Team/Martin Hecker.png"
              alt="team advisor"
              className={classes.imageItem}
            />
            <p className={classes.imageName}>
              <b>Martin Hecker</b>
            </p>
            <p className={classes.imageTitle}>Advisor</p>
            <div
              style={{
                height: "30px",
                width: "30px",
                backgroundColor: "#0C4767",
                margin: "10px auto",
              }}
            >
              <SocialIcon
                target="_blank"
                rel="noopener"
                title="LinkedIn"
                url="https://www.linkedin.com/in/martin-hecker-57a80617/"
                fgColor="white"
                bgColor="#0C4767"
                style={{ height: 30, width: 30, marginRight: "5px" }}
                className={classes.imageTitle}
              />
            </div>
          </div>
          {/* END OF ADVISOR 1*/}

          {/* START OF ADVISOR 2*/}

          <div className="col-xs-4 col-sm-6 col-md-4 col-lg-3">
            <img
              src="/images/Team/Matthew Darkwa.png"
              alt="team advisor"
              className={classes.imageItem}
            />
            <p className={classes.imageName}>
              <b>Matthew Darkwa</b>
            </p>
            <p className={classes.imageTitle}>Advisor</p>
            <div
              style={{
                height: "30px",
                width: "30px",
                backgroundColor: "#0C4767",
                margin: "10px auto",
              }}
            >
              <SocialIcon
                target="_blank"
                rel="noopener"
                title="LinkedIn"
                url="https://www.linkedin.com/in/matthew-darkwa/"
                fgColor="white"
                bgColor="#0C4767"
                style={{ height: 30, width: 30, marginRight: "5px" }}
                className={classes.imageTitle}
              />
            </div>
          </div>

          {/* END OF ADVISOR 2*/}

          {/* START OF TECH LEAD */}
          <div className="col-xs-4 col-sm-6 col-md-4 col-lg-3">
            <img
              src="/images/Team/John Jebo.png"
              alt="tech lead"
              className={classes.imageItem}
            />
            <p className={classes.imageName}>
              <b>John Jebo</b>
            </p>
            <p className={classes.imageTitle}>Tech Lead</p>
            <div
              style={{
                height: "30px",
                width: "30px",
                backgroundColor: "#0C4767",
                margin: "10px auto",
              }}
            >
              <SocialIcon
                target="_blank"
                rel="noopener"
                title="LinkedIn"
                url="https://www.linkedin.com/in/johnjebo/"
                fgColor="white"
                bgColor="#0C4767"
                style={{ height: 30, width: 30, marginRight: "5px" }}
                className={classes.imageTitle}
              />
            </div>
          </div>

          {/* END OF TECH LEAD */}

          {/* START OF BACKEND DEVELOPER */}

          <div className="col-xs-4 col-sm-6 col-md-4 col-lg-3">
            <img
              src="/images/Team/Samuel Blankson.png"
              alt=""
              className={classes.imageItem}
            />
            <p className={classes.imageName}>
              <b>Samuel Blankson</b>
            </p>
            <p className={classes.imageTitle}>Backend Developer</p>
            <div
              style={{
                height: "30px",
                width: "30px",
                backgroundColor: "#0C4767",
                margin: "10px auto",
              }}
            >
              <SocialIcon
                target="_blank"
                rel="noopener"
                title="LinkedIn"
                url="https://www.linkedin.com/in/samuelblankson/"
                fgColor="white"
                bgColor="#0C4767"
                style={{ height: 30, width: 30, marginRight: "5px" }}
                className={classes.imageTitle}
              />
            </div>
          </div>

          {/* END OF BACKEND DEVELOPER */}

          {/* START OF FRONTEND DEVELOPER */}

          <div className="col-xs-4 col-sm-6 col-md-4 col-lg-3">
            <img
              src="/images/Team/Charles Amoah-Ansong.png"
              alt=""
              className={classes.imageItem}
            />
            <p className={classes.imageName}>
              <b>Charles Amoah-Ansong</b>
            </p>
            <p className={classes.imageTitle}>Frontend Developer</p>
            <div
              style={{
                height: "30px",
                width: "30px",
                backgroundColor: "#0C4767",
                margin: "10px auto",
              }}
            >
              <SocialIcon
                target="_blank"
                rel="noopener"
                title="LinkedIn"
                url="https://www.linkedin.com/in/ansong-amoah/"
                fgColor="white"
                bgColor="#0C4767"
                style={{ height: 30, width: 30, marginRight: "5px" }}
                className={classes.imageTitle}
              />
            </div>
          </div>
          {/* END OF FRONTEND DEVELOPER */}

          {/* START OF BACKEND DEVELOPER 2 */}
          <div className="col-xs-4 col-sm-6 col-md-4 col-lg-3">
            <img
              src="/images/Team/Patrick Markin-Yankah.png"
              alt="backend developer 2"
              className={classes.imageItem}
            />
            <p className={classes.imageName}>
              <b>Patrick Markin-Yankah</b>
            </p>
            <p className={classes.imageTitle}>Backend Developer</p>
            <div
              style={{
                height: "30px",
                width: "30px",
                backgroundColor: "#0C4767",
                margin: "10px auto",
              }}
            >
              <SocialIcon
                target="_blank"
                rel="noopener"
                title="LinkedIn"
                url="https://www.linkedin.com/in/pyankah/"
                fgColor="white"
                bgColor="#0C4767"
                style={{ height: 30, width: 30, marginRight: "5px" }}
                className={classes.imageTitle}
              />
            </div>
          </div>

          {/* END OF BACKEND DEVELOPER 2 */}

          {/* START OF FRONTEND DEVELOPER 2 */}
          <div className="col-xs-4 col-sm-6 col-md-4 col-lg-3">
            <img
              src="/images/Team/Azalia Ashilabe.png"
              alt="frontend developer 2"
              className={classes.imageItem}
            />
            <p className={classes.imageName}>
              <b>Azalia Ashilabe</b>
            </p>
            <p className={classes.imageTitle}>Frontend Developer</p>
            <div
              style={{
                height: "30px",
                width: "30px",
                backgroundColor: "#0C4767",
                margin: "10px auto",
              }}
            >
              <SocialIcon
                target="_blank"
                rel="noopener"
                title="LinkedIn"
                url="https://www.linkedin.com/in/azashi/"
                fgColor="white"
                bgColor="#0C4767"
                style={{ height: 30, width: 30, marginRight: "5px" }}
                className={classes.imageTitle}
              />
            </div>
          </div>
          {/* END OF FRONTEND DEVELOPER 2 */}

          {/* START OF OUTREACH LEAD */}
          <div className="col-xs-4 col-sm-6 col-md-4 col-lg-3">
            <img
              src="/images/Team/Gloria Adjei.png"
              alt=""
              className={classes.imageItem}
            />
            <p className={classes.imageName}>
              <b>Gloria Adjei</b>
            </p>
            <p className={classes.imageTitle}>Outreach Lead</p>
            <div
              style={{
                height: "30px",
                width: "30px",
                backgroundColor: "#0C4767",
                margin: "10px auto",
              }}
            >
              <SocialIcon
                target="_blank"
                rel="noopener"
                title="LinkedIn"
                url="https://www.linkedin.com/in/gloria-adjei-1b7080143/"
                fgColor="white"
                bgColor="#0C4767"
                style={{ height: 30, width: 30, marginRight: "5px" }}
                className={classes.imageTitle}
              />
            </div>
          </div>
          {/* END OF OUTREACH LEAD
          
          
          */}

          {/* START OF Co-Founder & Marketing Lead */}
          <div className="col-xs-4 col-sm-6 col-md-4 col-lg-3">
            <img
              src="/images/Team/Katrin Hecker.png"
              alt=""
              className={classes.imageItem}
            />
            <p className={classes.imageName}>
              <b>Katrin Hecker</b>
            </p>
            <p className={classes.imageTitle}>Co-Founder & Marketing Lead</p>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  height: "30px",
                  width: "30px",
                  backgroundColor: "#0C4767",
                  display: "inline-block",
                  marginRight: "30px",
                }}
              >
                <SocialIcon
                  target="_blank"
                  rel="noopener"
                  title="LinkedIn"
                  url="https://www.linkedin.com/in/katrin-hecker-02763850/"
                  fgColor="white"
                  bgColor="#0C4767"
                  style={{ height: 30, width: 30, marginRight: "5px" }}
                  className={classes.imageTitle}
                />
              </div>
              <div
                style={{
                  height: "30px",
                  width: "30px",
                  backgroundColor: "#0C4767",
                  margin: "10px auto",
                  display: "inline-block",
                  marginRight: "0px",
                }}
              >
                {/* <SocialIcon
                target="_blank"
                rel="noopener"
                title="LinkedIn"
                url="katrin@thefairwork.com"
                fgColor="white"
                bgColor="#0C4767"
                style={{ height: 30, width: 30, marginRight: "5px" }}
                className={classes.imageTitle}
              /> */}
                <a
                  href={`mailto:katrin@thefairwork.com`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon
                    path={mdiEmailOutline}
                    size={0.8}
                    horizontal
                    vertical
                    color="white"
                    rotate={180}
                    style={{ marginTop: "5px", marginBottom: "23px" }}
                    className={classes.imageTitle}
                  />
                </a>
              </div>
            </div>
          </div>
          {/* END OF Co-Founder & Marketing Lead */}

          {/* START OF Co-Founder & Implementation Lead */}
          <div className="col-xs-4 col-sm-6 col-md-4 col-lg-3">
            <img
              src="/images/Team/Hope Ewudor.png"
              alt=""
              className={classes.imageItem}
            />
            <p className={classes.imageName}>
              <b>Hope Ewudor</b>
            </p>
            <p className={classes.imageTitle}>
              Co-Founder & Implementation Lead
            </p>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  height: "30px",
                  width: "30px",
                  backgroundColor: "#0C4767",
                  display: "inline-block",
                  marginRight: "30px",
                }}
              >
                <SocialIcon
                  target="_blank"
                  rel="noopener"
                  title="LinkedIn"
                  url="https://www.linkedin.com/in/hope-ewudor-968721124/"
                  fgColor="white"
                  bgColor="#0C4767"
                  style={{ height: 30, width: 30, marginRight: "5px" }}
                  className={classes.imageTitle}
                />
              </div>
              <div
                style={{
                  height: "30px",
                  width: "30px",
                  backgroundColor: "#0C4767",
                  margin: "10px auto",
                  display: "inline-block",
                  marginRight: "0px",
                }}
              >
                {/* <SocialIcon
                target="_blank"
                rel="noopener"
                title="Email"
                url="hope@thefairwork.com"
                icon="mail"
                fgColor="white"
                bgColor="#0C4767"
                style={{ height: 30, width: 30, marginRight: "5px" }}
                className={classes.imageTitle}
              /> */}
                <a
                  href={`mailto:hope@thefairwork.com`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon
                    path={mdiEmailOutline}
                    size={0.8}
                    horizontal
                    vertical
                    color="white"
                    rotate={180}
                    style={{ marginTop: "5px", marginBottom: "23px" }}
                    className={classes.imageTitle}
                  />
                </a>
              </div>
            </div>
          </div>
          {/* END OF Co-Founder & Implementation Lead */}

          {/* START OF Co-Founder & Strategy Lead */}
          <div className="col-xs-4 col-sm-6 col-md-4 col-lg-3 mb-2">
            <img
              src="/images/Team/Ali Gibran.png"
              alt=""
              className={classes.imageItem}
            />
            <p className={classes.imageName}>
              <b>Ali Gibran</b>
            </p>
            <p className={classes.imageTitle}>Co-Founder & Strategy Lead</p>
            <div style={{ textAlign: "center", marginTop: "25px" }}>
              <div
                style={{
                  height: "30px",
                  width: "30px",
                  backgroundColor: "#0C4767",
                  display: "inline-block",
                  marginRight: "30px",
                }}
              >
                <SocialIcon
                  target="_blank"
                  rel="noopener"
                  title="LinkedIn"
                  url="https://www.linkedin.com/in/aligibran/"
                  fgColor="white"
                  bgColor="#0C4767"
                  style={{ height: 30, width: 30, marginRight: "5px" }}
                  className={classes.imageTitle}
                />
              </div>
              <div
                style={{
                  height: "30px",
                  width: "30px",
                  backgroundColor: "#0C4767",
                  display: "inline-block",
                  marginRight: "30px",
                }}
              >
                <a
                  href={`mailto:gibran@thefairwork.com`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon
                    path={mdiEmailOutline}
                    size={0.8}
                    horizontal
                    vertical
                    color="white"
                    rotate={180}
                    style={{ marginTop: "5px", marginBottom: "23px" }}
                    className={classes.imageTitle}
                  />
                </a>
              </div>
            </div>
          </div>
          {/* END OF Co-Founder & Strategy Lead */}

          {/* START OF Outreach Lead */}
          <div className="col-xs-4 col-sm-6 col-md-4 col-lg-3 mb-4">
            <img
              src="/images/Team/Yvonne Yawson.png"
              alt=""
              className={classes.imageItem}
            />
            <p className={classes.imageName}>
              <b>Yvonne Yawson</b>
            </p>
            <p className={classes.imageTitle}>Outreach Lead</p>
            <div
              style={{
                height: "30px",
                width: "30px",
                backgroundColor: "#0C4767",
                margin: "auto",
                marginTop: "25px",
              }}
            >
              <SocialIcon
                target="_blank"
                rel="noopener"
                title="LinkedIn"
                url="https://www.linkedin.com/in/yvonne-yawson-a17756180/"
                fgColor="white"
                bgColor="#0C4767"
                style={{ height: 30, width: 30, marginRight: "5px" }}
                className={classes.imageTitle}
              />
            </div>
          </div>

          {/* END OF Outreach Lead */}
        </div>
      </div>
    </>
  );
}

export default AboutTheFairWork;
