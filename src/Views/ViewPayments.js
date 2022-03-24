import React, { useState, useEffect } from "react";
import { Card, Button } from "@material-ui/core";
import ReactHtmlParser from "react-html-parser";
import { ClipLoader } from "react-spinners";
import Api from "../Services/api";
import { useHistory } from "react-router";
import { adminRole } from "../Services/userTypes";

function ViewPayments() {
  const history = useHistory();
  const [getPaymentDetails, setgetPaymentDetails] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const handleClick = () => {
    history.push("/payments", { params: getPaymentDetails });
  };

  const getPayment = async () => {
    Api()
      .get("/jobs/payment-details")
      .then((response) => {
        setIsReady(true);
        setgetPaymentDetails(response?.data?.details);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getPayment();
  }, []);

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-12 pageTitle">
          <h6>
            <b>Payment Process</b>
          </h6>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-md-12">
          <Card
            className="mt-1"
            style={{
              borderRadius: "3px",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
              cursor: "pointer",
              padding: "35px",
            }}
          >
            {!isReady ? (
              <div className="text-center">
                <ClipLoader size={40} color="#1b98e0" loading />
              </div>
            ) : getPaymentDetails.length <= 0 ? (
              <div className="row text-center">
                <div className="col-md-12 mt-4">
                  <img
                    src="/images/Group 2354.png"
                    alt="no job posted"
                    width="230"
                  />
                  <div className="d-flex justify-content-center align-item-center">
                    <p>No payment process have been provided currently.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bulletpoint">
                {ReactHtmlParser(getPaymentDetails)}
              </div>
            )}
          </Card>
        </div>
      </div>

      {adminRole() ? (
        <div className="d-flex justify-content-center mb-5">
          <Button
            variant="contained"
            className="savePaymentBtn"
            onClick={() => {
              handleClick();
            }}
          >
            Edit
          </Button>
        </div>
      ) : (
        ``
      )}
    </div>
  );
}

export default ViewPayments;
