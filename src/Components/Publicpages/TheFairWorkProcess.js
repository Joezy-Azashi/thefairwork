import React from "react";
import Button from '@mui/material/Button';

function TheFairWorkProcess() {
  return (
    <div className="homepageContainer">
    <div style={{paddingBottom: "120px"}}>
      <div className="row">
        <div className="col-md-12 mt-4">
          <span className="FairWorkProcessheaderLine">TheFairWork Process</span>
        </div>
      </div>

      <div className="row mt-5">
          <div className="col-md-12 text-center">
              <img src="./images/landingpage information.svg" className="fairWorkProcessImg" />
              <img src="./images/Group 2588.png" className="fairWorkProcessImgMobile" />
          </div>
          <div className="col-md-12 mt-5 text-center">
            <a href="/about-us" style={{textDecoration: "none"}}>
          <Button variant="contained" className="btn">Learn More</Button>
          </a>
          </div>
      </div>
    </div>
    </div>
  );
}

export default TheFairWorkProcess;
