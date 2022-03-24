import React, { useState } from "react";
import ReactDOM from "react-dom";
import Api from "../../Services/api";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {frontURL} from "../../public/config"

const PayPalButton = window?.paypal?.Buttons?.driver("react", { React, ReactDOM });

const PaypalPaymentButton = ({ invoiceDataToPass }) => {
  // HOOKS FOR OPENING OF SNACK BAR
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const URL = window.location.href
  
  const handleClose = () => {
    setOpen(false);
  };

  const openSnack = () => {
    setOpen(true);
  };


  const sendPaymentData = async (order) => {
    Api()
      .post(`/admin/payment-details`, order)
      .then((response) => {
          openSnack();
          setAlert({
            open: true,
            message: `Payment for your order made successfully`,
            severity: "success",
          });
          window.location.assign(`${frontURL}/client-invoices`);
      })
      .catch((error) => {
        openSnack();
        setAlert({
          open: true,
          message: `${error.response.data.error}`,
          severity: "error",
        });
        setTimeout(() => {
          window.location.assign(`${frontURL}/client-payment-due`);
        }, 1000);
      });
  };

  return (
    <div className="paypalButton">
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
          style={{ marginTop: "10vh" }}
        >
          <Alert
            severity={`${alert.severity}`}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlert({
                    open: false,
                    message: ``,
                    severity: ``,
                  });
                }}
              >
              </IconButton>
            }
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </div>
      <PayPalButton
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [invoiceDataToPass],
          });
        }}
        onApprove={async (data, actions) => {
          const order = await actions.order.capture();
          setTimeout(() => {
            sendPaymentData(order);
          }, 2000);
        }}
        onCancel={(data) => {
          openSnack();
          setAlert({
            open: true,
            message: `Payment for your order didnt go through. Please try again`,
            severity: "error",
          });
          setTimeout(() => {
            window.location.assign(`${frontURL}/client-payment-due`);
          }, 1000);
        }}
      />
    </div>
  );
};

export default PaypalPaymentButton;
