import React from "react";
import { SocialIcon } from "react-social-icons";

function Footer() {
  return (
    <div className="footerPadding">
      <div className="FooterContainer">
        <div className="row">
          <div className="col-md-3 mb-3">
            <span className="forCleints ">For Clients</span>
            <p className="mb-4 mt-4"><a href="/become-a-client" className="mobileNavLink">Become A Client</a></p>
          </div>
          <div className="col-md-3 mb-3">
            <span className="forFreelancers">For Freelancers</span>
            <p className="mb-4 mt-4"><a href="/become-a-freelancer" className="mobileNavLink">Become A Freelancer</a></p>
          </div>
          <div className="col-md-3 mb-3">
          <span className="footerCompany">Company</span>
            <p className="mb-4 mt-4"><a href="/about-us" className="mobileNavLink">About TheFairWork</a></p>
            <a href="/about-us#fwTeam" className="mobileNavLink"><p className="mb-4">Team</p></a>
            <a href="/#fwServices" className="mobileNavLink"><p className="mb-4">Services</p></a>
            <a href="/privacy-policy" className="mobileNavLink"><p>Privacy Policy</p></a>
            <a href="mailto:hello@thefairwork.com" className="mobileNavLink"><p className="mb-4">Contact Us</p></a>
          </div>
          <div className="col-md-3 mb-3 socialPosition">
            <p>Follow Us:</p>
            <div className="mt-4 mb-4 socialIcons">
              <SocialIcon
                target="_blank"
                rel="noopener"
                title="Facebook"
                url="https://www.facebook.com/The-FairWork-104977868719467"
                fgColor="#2E405B"
                bgColor="#FFFFFF"
                style={{ height: 30, width: 30, marginRight: "5px" }}
              />

              <SocialIcon
                target="_blank"
                rel="noopener"
                title="LinkedIn"
                url="https://www.linkedin.com/showcase/77637314/"
                fgColor="#2E405B"
                bgColor="#FFFFFF"
                style={{ height: 30, width: 30, marginRight: "5px" }}
              />

              {/* <SocialIcon
                target="_blank"
                rel="noopener"
                title="Twitter"
                className=""
                url="https://www.twitter.com"
                fgColor="#2E405B"
                bgColor="#FFFFFF"
                style={{ height: 30, width: 30 }}
              /> */}
            </div>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-12">
            <p className="copyRightMsg">
              &copy; Copyright {new Date().getFullYear()} TheFairWork. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
