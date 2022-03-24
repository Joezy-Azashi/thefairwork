import React from "react";

function OurServices() {
  return (
    <div className="homepageContainer">
      <div className="row">
        <div className="col-md-12">
          <span className="ServicesheaderLine">Our Services</span>
        </div>
      </div>

      <div className="row mt-4 mb-4">
        <div className="col-md-12 text-center">
          <p className="pageTitle">
            TheFairWork is the world's gateway to working with Skilled &
            Certified African talent at globally competitive rates. Thereby
            providing competitive advantages and bringing diversity of ideas to
            global companies. We provide local and international employers with
            the resources to do remote work in areas such as:
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-between serviceTilesMobile">
        <div className="col-md-3 mb-4 d-flex justify-content-center align-items-center">
          <div className="serviceCard">
          <img src="./images/Digital marketing.svg" className="serviceIcons"/>
            <p className="serviceCardTitles mb-0">Digital Marketing</p>
          </div>
        </div>
        <div className="col-md-3 mb-4 d-flex justify-content-center align-items-center">
          <div className="serviceCard">
          <img src="./images/writing and translation.svg" className="serviceIcons"/>
            <p className="serviceCardTitles mb-0">Writing & Translation</p>
          </div>
        </div>
        <div className="col-md-3 mb-4 d-flex justify-content-center align-items-center">
          <div className="serviceCard">
          <img src="./images/Admin Support.svg" className="serviceIcons"/>
            <p className="serviceCardTitles mb-0">Admin Support</p>
          </div>
        </div>
        <div className="col-md-3 mb-4 d-flex justify-content-center align-items-center">
          <div className="serviceCard">
          <img src="./images/design and media.svg" className="serviceIcons"/>
            <p className="serviceCardTitles mb-0">Design & Multimedia</p>
          </div>
        </div>
        <div className="col-md-3 mb-4 d-flex justify-content-center align-items-center">
          <div className="serviceCard">
          <img src="./images/programming.svg" className="serviceIcons"/>
            <p className="serviceCardTitles mb-0">Programming</p>
          </div>
        </div>
        <div className="col-md-3 mb-4 d-flex justify-content-center align-items-center">
          <div className="serviceCard">
          <img src="./images/web development.svg" className="serviceIcons"/>
            <p className="serviceCardTitles mb-0">Web Development</p>
          </div>
        </div>
        <div className="col-md-3 mb-4 d-flex justify-content-center align-items-center">
          <div className="serviceCard">
          <img src="./images/data science.svg" className="serviceIcons"/>
            <p className="serviceCardTitles mb-0">Data Science</p>
          </div>
        </div>
        <div className="col-md-3 mb-4 d-flex justify-content-center align-items-center">
          <div className="serviceCard">
          <img src="./images/analytics services.svg" className="serviceIcons"/>
            <p className="serviceCardTitles mb-0">Analytical Services</p>
          </div>
        </div>
      </div>

      <div className="row">
        
      </div>
    </div>
  );
}

export default OurServices;
