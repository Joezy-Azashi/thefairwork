import React from "react";
import PaypalPaymentButton from "../Views/Client Payments/PaypalPaymentButton";

const CreditCardPaymentModal = ({ invoiceDataToPass }) => {
  return (
    <div
      class="modal fade"
      id="staticBackdrop"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      role="dialog"
      data-dismiss="modal"
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ marginTop: "40px" }}
      >
        <div className="modal-content" style={{ marginTop: "40px" }}>
          <div className="modal-body">
            <div id="paypal-payment-button">
              <PaypalPaymentButton invoiceDataToPass={invoiceDataToPass} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardPaymentModal;
