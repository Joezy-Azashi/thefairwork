import React from "react";
import Iframe from "react-iframe";

const ViewDocumentOnPlatform = ({ url, viewResume }) => {
  const getPortfolioUrlExtension = (url) => {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  };

  if (
    getPortfolioUrlExtension(url) === "jpeg" ||
    getPortfolioUrlExtension(url) === "jpg" ||
    getPortfolioUrlExtension(url) === "png" ||
    getPortfolioUrlExtension(url) === "svg" ||
    getPortfolioUrlExtension(url) === "jfif"
  ) {
    return (
      <div
        className="portfolioImages"
        style={{ marginBottom: "15px", display: viewResume ? "block" : "none" }}
      >
        <img
          src={url}
          alt={"Portfolio images"}
          style={{ width: "100%"}}
        />
      </div>
    );
  }

  return (
    <div
      className="viewDocumentOnPlatform"
      style={{ marginBottom: "15px", display: viewResume ? "block" : "none" }}
    >
      <Iframe
        url={url}
        width="100%"
        height="500px"
        display="initial"
        position="relative"
        styles={{ maxWidth: "100%" }}
      />
    </div>
  );
};

export default ViewDocumentOnPlatform;
