import React from "react";
import {Chip, Button} from "@mui/material";
import { NavLink } from "react-router-dom";

function Benefits() {
  return (
    <div className="homepageContainer">
        <div className="row mt-5">
        <div className="col-md-12">
          <span className="BenefitheaderLine">Benefits of Joining TheFairWork</span>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-6 mb-5">
        <div className="hexagon">
            <img src="./images/Picture2.png" className="hexOnMobile"/>
          </div>
          <div className="contentAbove">
          <p className="HomepageTitle">For Clients</p>
          <div className="d-flex align-items-center mb-5">
            <div>
              <Chip label="1" className="homeNumbering" />
            </div>
            <p className="mb-0">
              Find individual freelancers - or build a team with flexible
              <br className="homeBreak"/> monthly engagement options!
            </p>
          </div>

          <div className="d-flex align-items-center mb-5">
            <div>
              <Chip label="2" className="homeNumbering" />
            </div>
            <p className="mb-0">
              Choose optional ad-ons to ensure flawless collaboration
              <br className="homeBreak"/> with your freelancers
            </p>
          </div>

          <div className="d-flex align-items-center mb-5">
            <div>
              <Chip label="3" className="homeNumbering" />
            </div>
            <p className="mb-0">
              Focus on your project! We'll take care of the rest- Secure
              <br className="homeBreak"/> payment options, Data Protection Policies, Legally
              <br className="homeBreak"/> Enforceable Contracts
            </p>
          </div>

          <div className="homepagebtnMobile">
          <NavLink className="navLink mt-1" to={"/signup"}>
          <Button variant="contained" className="btn">Get Started</Button>
          </NavLink>
          </div>
          </div>
        </div>
        <div className="col-md-6 mb-5">
            <img src="./images/Client Guy.png" className="forClientsImg"/>
        </div>
      </div>



      <div className="row mt-5 mb-5">
        <div className="col-md-6 mb-5">
          <img src="./images/FREELANCE GUY.png" className="forFreelancerImg forFreelancerImgWeb"/>
        </div>

        <div className="col-md-6">
            <div className="hexagon">
            <img src="./images/Picture2.png" className="hexOnMobile"/>
          </div>
          <div className="contentAbove">
          <p className="HomepageTitle">For Freelancers</p>
          <div className="d-flex align-items-center mb-5">
            <div>
              <Chip label="1" className="homeNumbering" />
            </div>
            <p className="mb-0">
            {/* Connect with international clients and work in a cross-cultural setting */}
            Connect with international clients and work
              <br className="homeBreak"/> in a cross-cultural setting
            </p>
          </div>

          <div className="d-flex align-items-center mb-5">
            <div>
              <Chip label="2" className="homeNumbering" />
            </div>
            <p className="mb-0">
            Get your skills verified on TheFairWork through
              <br className="homeBreak"/> internationally recognized testing platforms to
              <br className="homeBreak"/> showcase your talent
            </p>
          </div>

          <div className="d-flex align-items-center mb-5">
            <div>
              <Chip label="3" className="homeNumbering" />
            </div>
            <p className="mb-0">
            Receive additional training for continuous
              <br className="homeBreak"/> professional growth
            </p>
          </div>
          <div className="homepagebtnMobile">
          <NavLink className="navLink mt-1" to={"/signup"}>
          <Button variant="outlined" className="homePageSignUp mb-4">Sign Up Now</Button>
          </NavLink>
          </div>
        </div>
      </div>

      <div className="col-md-6 mb-5">
          <img src="./images/FREELANCE GUY.png" className="forFreelancerImg forFreelancerImgMobile"/>
        </div>
      </div>
    </div>
  );
}

export default Benefits;
