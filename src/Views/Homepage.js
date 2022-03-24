import React, {useState, useEffect} from "react";
import { Button, TextField, InputAdornment} from "@material-ui/core";
import { mdiMagnify } from "@mdi/js";
import Icon from "@mdi/react";
import { NavLink } from "react-router-dom";
import Benefits from "../Components/Publicpages/Benefits";
import OurServices from "../Components/Publicpages/OurServices";
import TheFairWorkProcess from "../Components/Publicpages/TheFairWorkProcess";
import WelcomeMessage from "../Components/WelcomeMessage";


function Homepage() {

  return (
    <div className="backgorund">
      <div className="webLandingImg">
      <img
        src="./images/Group 2440.png"
        className="homepage-backgorund"
        alt="background"
      />
      </div>
      <div className="row" style={{ overflowX: "hidden" }}>
        <div className="col-md-12">
          <img
            src="./images/home-background.png"
            className="homepage-backgorundMobile"
            alt="background"
          />
        </div>
      </div>
      <div className="homepage-caption">
        <p className="row bannerMainText">
          <strong style={{ fontWeight: "700" }}>
            <span style={{ color: "#808080" }}>Delivering</span>{" "}
            <span style={{ color: "#2E405B" }}>Global Projects</span>
            <br /> <span style={{ color: "#808080" }}>
              Through
            </span>{" "}
            <span style={{ color: "#2E405B" }}>Skilled African Talent.</span>
          </strong>
        </p>
        <p className="bannerSubText mt-4 mb-4">
          <b>
          TheFairWork is the world's gateway to working with Skilled & Certified African talent
            <br />
            at globally competitive rates. Thereby providing competitive advantages
            <br />
            and bringing diversity of ideas to global companies.
          </b>
        </p>

        <p className=" bannerMainTextMobile">
          <strong style={{ fontWeight: "700" }}>
            <span style={{ color: "#808080" }}>Delivering</span>{" "}
            <span style={{ color: "#2E405B" }}>Global Projects</span>
            <br /> <span style={{ color: "#808080" }}>Through </span>
            <span style={{ color: "#2E405B" }}>Skilled African Talent.</span>
          </strong>
        </p>
        <p className="bannerSubTextMobile mt-4 mb-4">
          <b>
          TheFairWork is the world's gateway to working with Skilled & Certified African talent at globally competitive rates. Thereby providing competitive advantages and bringing diversity of ideas to global companies.
          </b>
        </p>

        <div className="findFreelancer">
          <TextField
            id="search"
            placeholder="What are you looking for?"
            type="text"
            variant="outlined"
            size="small"
            fullWidth
            className="pt-1 search-field"
            style={{ backgroundColor: "white" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Icon
                    path={mdiMagnify}
                    size={1}
                    horizontal
                    vertical
                    color="#808080"
                    rotate={180}
                  />
                </InputAdornment>
              ),
            }}
          />
          <div className="">
            <NavLink className="navLink" to={"/login"}>
              <Button variant="contained" className="homepage-btn">
                Find Freelancer
              </Button>
            </NavLink>
          </div>
        </div>
      </div>

      <Benefits />
      <div className="ourServicesDiv" id="fwServices">
        <OurServices />
        <TheFairWorkProcess/>
      </div>

      {/* <WelcomeMessage/> */}
    </div>
  );
}

export default Homepage;
