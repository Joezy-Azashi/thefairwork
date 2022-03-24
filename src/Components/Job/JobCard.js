import React, { useState } from "react";
import moment from "moment";
import { NavLink } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";

function JobCard({ alljobs}) {
  localStorage.setItem("checkedValues", []);
  const [openJobDetails, setOpenJobDetails] = useState(false);
  const [data, setData] = useState(alljobs);

  const handleOpenJobDetails = () => {
    setOpenJobDetails(true);
  };



  return (
    <NavLink
      to={"/freelancer-all-job-details"}
      style={{ textDecoration: "none", color: "inherit" }}
      onClick={() => {
        localStorage.setItem("jobDetails", JSON.stringify(alljobs));
      }}
    >
    
      <div className="col-md-12 mb-1 freelancerAllJobsCard">
      
        <div onClick={handleOpenJobDetails}>
       
       
          <div className="row">
              <div className="col-md-12">
                <p className="searchJobTitle bodyTitles mb-1">
                  <span className="bodyTitles">{data.title}</span>
                  {" "}<span style={{ color: "#808080", fontSize: "10px" }}>({moment(`${data.createdAt}`).fromNow()})</span>
                </p>
              </div>
            </div><div className="row">
                <div className="col-md-12">
                  <p className="searchJobDescription" style={{ color: "#808080" }}>{ReactHtmlParser(data.description)}</p>
                </div>
              </div><div className="row">
                <div className="col-md-12 mb-0 pb-0">
                  <p className="badge job-badge p-2">
                    {" "}
                    {data?.Category === null
                      ? "No category"
                      : data?.Category?.category}
                  </p>
                  <p className="badge job-badge p-2">{data.type}</p>
                </div>
              </div>
          
         
        </div>
      
      </div>
   
    </NavLink>
  );
}

export default JobCard;
