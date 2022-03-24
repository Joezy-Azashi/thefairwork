import React, { useState, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import { useLocation } from "react-router";

function Pages() {
  const location = useLocation();

  return (
    <div>
      <img
        src="../images/wocintech.png"
        alt="image"
        className="adminPageImage"
        style={{ filter: "brightness(70%)" }}
      />
      <h2 className="pageNameBanner">
        <b>{location?.state?.params?.title}</b>
      </h2>

      <div
        className="ad-container"
        style={{
          marginTop: "40px",
        }}
      >
        <div className="row">
          <div className="col-md-12">
            {ReactHtmlParser(location?.state?.params?.content)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pages;
