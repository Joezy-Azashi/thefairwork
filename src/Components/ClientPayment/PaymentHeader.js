import React, { useState, useEffect } from "react";

function PaymentHeader({titlePage, secondColumn, thirdColumn}) {

  return (
    <div className="row mb-2 mt-1">
      <div className="col-md-12 pageTitle mb-3">
        <h6>
          <b>{titlePage}</b>
        </h6>
      </div>
      <div className="col-md-12">
        <div
          className="row mb-0 mt-2 d-flex"
          style={{
            backgroundColor: "#2E405B4D",
            height: "50px",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "0px",
            marginLeft: "0px",
          }}
        >
          <div className="col-md-4 pageTitle">
            <h6 className="mb-0" style={{ fontSize: "0.8rem", paddingLeft: "14px" }}>
              <b>Order Name</b>
            </h6>
          </div>

          <div className="col-md-3 pageTitle">
            <h6 className="mb-0" style={{ fontSize: "0.8rem" }}>
              <b>{secondColumn}</b>
            </h6>
          </div>

          <div className="col-md-3 d-flex-start pageTitle" style={{paddingLeft:'0px'}}>
            <h6 className="mb-0" style={{ fontSize: "0.8rem" }}>
              <b>{thirdColumn}</b>
            </h6>
          </div>

          <div className="col-md-2 pageTitle" style={{paddingLeft:'0px'}}>
            <h6 className="mb-0" style={{ fontSize: "0.8rem", marginLeft: '9px' }}>
              <b>Actions</b>
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentHeader;
