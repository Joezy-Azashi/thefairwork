import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, Button } from "@material-ui/core";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import { NavLink } from "react-router-dom";
import zIndex from "@material-ui/core/styles/zIndex";

function WelcomeMessage() {
  const [openWelcome, setOpenWelcome] = useState(false);

  const handleCloseWelcome = () => {
    setOpenWelcome(false);
  };

  const hideshowPopup = () => {
    const hidePopUp = localStorage.getItem("hidePopUp")
    if(!hidePopUp) setOpenWelcome(true);
    localStorage.setItem("hidePopUp", true)
  }
  useEffect(() => {
    hideshowPopup()
  }, []);

  return (
    <Dialog
      open={openWelcome}
      onClose={handleCloseWelcome}
      //disableBackdropClick
      fullWidth
      maxWidth="sm"
      className="dialogborder"
      style={{zIndex: "1302"}}
    >
      <div className="welcomeCard dialogborder">
        <div align="right">
          <Icon
            path={mdiClose}
            size={1}
            horizontal
            vertical
            className="closeWelcome"
            onClick={() => {
              handleCloseWelcome();
            }}
            rotate={180}
          />
        </div>
        <DialogContent >
            <div className="row">
                <div className="col-md-12">
                    <p className="welcomeHeading">Welcome to TheFairWork</p>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">
                  <p style={{fontSize: "15px"}}>Connecting Global Businesses with Africa’s Skilled & Certified Talent</p>
                    <p style={{fontSize: "13px"}}>Thank you for visiting our website - we appreciate your support!
                        <br className="homeBreak"/>The official launch will take place in <span style={{textDecoration: "underline"}}>February 2022.</span> For now, we welcome you to
                        <br className="homeBreak"/> sign up and explore some of the functionalities of our platform. We will let you
                        <br className="homeBreak"/> know, as soon as you are able to interact with other parties on TheFairWork.
                        </p>
                </div>
            </div>
            <div className="mt-3 mb-2">
            <NavLink to={"/signup"} style={{textDecoration: "none"}}>
            <Button variant="contained">Sign Up</Button>
            </NavLink>
            </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default WelcomeMessage;
