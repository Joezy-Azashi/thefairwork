import React, { useState } from "react";
import { Card, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

function PaymentOrder({
  orderName,
  paymentDate,
  paymentDueDate,
  action,
  actionClick,
  orderItemId,
  userAccountId,
}) {
  const history = useHistory();
  const [openDelete, setopenDelete] = useState(false);
  const [orderId, setorderId] = useState("");

  const handlePaymentDueButtonClick = () => {
    localStorage.setItem("orderId", userAccountId);
    if (action === "Make Payment" || action === "View Payment") {
      history.push("/client-invoice", { params: orderItemId, makePay: true });
    } else if (action === "View Invoice") {
      history.push("/client-invoice", {
        params: orderItemId,
        makePay: false,
        action: "isPaid",
      });
    }
  };

  const closeResetDia = () => {
    setopenDelete(false);
  };
  // Taken From ClientOrder
  return (
    <div className="col-md-12">
      <Card
        className="mt-1 mb-2"
        style={{
          borderRadius: "10px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
          padding: "16px 16px 16px 25px",
          height: "75px",
          display: "flex",
          alignItems: "center",
          color: "#363636",
        }}
      >
        {/* <div className="row"> */}
        <div className="col-md-4 d-flex justify-content-start">
          {orderName?.replaceAll("&amp;", "&") || " "}
        </div>
        <div className="col-md-3 d-flex justify-content-start">
          {paymentDate === "Invalid date" ? `Not Provided` : paymentDate}
        </div>
        <div className="col-md-3 d-flex justify-content-start">
          {paymentDueDate === "Invalid date" ? `Not Provided` : paymentDueDate}
        </div>
        <div className="col-md-2 d-flex justify-content-start">
          <Button
            variant="contained"
            className="invoiceBtn"
            onClick={() => {
              handlePaymentDueButtonClick();
            }}
            style={{
              backgroundColor: "#2E405B",
              color: "white",
            }}
          >
            {action}
          </Button>
        </div>
        {/* </div> */}
      </Card>
    </div>
  );
}

export default PaymentOrder;
