import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import { ClipLoader } from "react-spinners";
import { getCurrentUser, getUserType } from "../../Services/auth";
import Api from "../../Services/api";
import { Card, Button } from "@material-ui/core";
import { Typography, Grid, CardMedia, CardContent } from "@material-ui/core";
import PaymentOrderItem from "../../Components/ClientPayment/PaymentOrderItem";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { api } from "../../public/config";
import { withStyles } from "@material-ui/core/styles";
import CreditCardPaymentModal from "../../Components/CreditCardPaymentModal";

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: "white",
      margin: 100,
      borderBottom: "1px solid rgba(224, 224, 224, 1)",
      fontFamily: "Segoe UI",
    },
  },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#2E405B4D",
    color: "#2E405B",
    borderBottom: "0px solid rgba(224, 224, 224, 1)",
    fontFamily: "Segoe UI",
    height: "50px",
    [theme.breakpoints.down("xs")]: {
      height: "20px",
    },
  },
}))(TableCell);

const usePageStyles = makeStyles((theme) => ({
  invoiceHeader: {
    height: "140px",
    padding: "0px",
    backgroundColor: "#2E405B4D",
    marginBottom: "2.813rem",
    [theme.breakpoints.down("xs")]: {
      height: "170px",
      marginBottom: "1rem",
    },
  },
  gridHeaderContent: {
    paddingLeft: "3em",
    paddingRight: "3em",
    alignItems: "center",
    height: "100%",
    [theme.breakpoints.down("md")]: {
      paddingLeft: "2em",
      paddingRight: "2em",
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: "2em",
      paddingRight: "0.5em",
    },
  },
  companyAddressInfo: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: "20px",
  },
  companyAddressContent: {
    fontWeight: "700",
    color: "#2E405B",
    lineHeight: "1.8",
  },
  gridInvoiceBody: {
    paddingLeft: "3em",
    paddingRight: "3em",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      paddingLeft: "2em",
      paddingRight: "2em",
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: "2em",
      paddingRight: "2em",
    },
  },
  itemHeading: {
    marginBottom: "12px",
  },
  costMobile: {
    paddingLeft: "80px",
    [theme.breakpoints.down("xs")]: {
      paddingLeft: "0px",
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "70px",
    },
    [theme.breakpoints.up("sm")]: {
      paddingLeft: "80px",  
    }
  },
}));

function ClientViewInvoice() {
  const componentRef = useRef();
  const location = useLocation();
  const classes = usePageStyles();
  const [orders, setOrders] = useState();
  const [paymentInvoiceContents, setPaymentInvoiceContents] = useState([]);
  const [orderSubtotal, setOrderSubtotal] = useState(0);
  const [description, setDescription] = useState("");
  const [orderTax, setOrderTax] = useState(0);
  const [orderDiscount, setOrderDiscount] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderName, setOrderName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [pageLength, setpageLength] = useState([]);
  const [pageNumber, setpageNumber] = useState(1);
  const [invoiceNotes, setInvoiceNotes] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [lengthpage, setLengthpage] = useState([]);
  const [orderId, setOrderId] = useState();
  const [invoiceId, setInvoiceId] = useState();
  const [responseData, setResponseData] = useState();
  const [responseData1, setResponseData1] = useState();
  const [isPaid, setIsPaid] = useState();
  const [companyName, setCompanyName] = useState();
  // const userAccountId = getCurrentUser()?.user?.UserProfile?.userAccountId;
  const orderOwnerId = localStorage.getItem("orderId");
  const userType = getUserType().accountTypeId;
  const [name, setName] = useState("");
  const history = useHistory();
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [open, setOpen] = useState(false);
  const [openModal, setopenModal] = useState(false);
  // const [{ isPending, },dispatch] = usePayPalScriptReducer();

  const setClose = () => {
    setOpen(false);
  };
  localStorage.setItem("state", JSON.stringify(location?.state));
  const [invoiceData, setInvoiceData] = useState();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [dataForResponse, setdataForResponse] = useState();
  const [invoiceDataToPass, setInvoiceDataToPass] = useState();

  const shoeSnack = () => {
    setOpen(true);
  };

  const handleManualPay = async () => {
    const ID = invoiceNumber.match(/(\d+)/)[0]
    Api()
      .put(`admin/pay-manually/${ID}`)
      .then((response) => {
        setOpen(true);
        setAlert({
          open: true,
          message: "Invoice status set to paid",
          severity: "success",
        });

        setTimeout(() => {
          history.push("/all-invoices");
        }, 2000);
      })
      .catch((error) => {
        setOpen(true);
        setAlert({
          open: true,
          message: error.message,
          severity: "error",
        });
      });
  };

  const clientGetOrders = async (pageNumberSelected = 1) => {
    let responseData;
    const data = {
      userAccountId: orderOwnerId,
      paymentInvoiceId: location?.state?.params,
    };
    Api()
      .post(`/users/get-client-due-paymentInvoice/${pageNumberSelected}`, data)
      .then((response) => {
        setIsReady(true);
        setInvoiceId(response?.data?.result?.data[0].id);
        responseData = response?.data?.result?.data[0];
        setOrders(response?.result?.data);
        setResponseData(responseData);
        setPaymentInvoiceContents(responseData?.paymentInvoiceContents);
        setInvoiceData(response?.data?.payment);
        setOrderSubtotal(responseData?.stringSubTotal);
        setDescription(responseData?.description);
        setOrderTax(responseData?.tax);
        setOrderDiscount(responseData?.discount);
        setOrderTotal(responseData?.stringTotal);
        setOrderId(responseData.teamId);
        setOrderName(responseData?.orderName);
        setInvoiceNumber(responseData?.invoiceNumber);
        setIssueDate(responseData?.dueDate);
        setInvoiceDate(responseData?.invoiceDate);
        setInvoiceNotes(responseData?.description);
        setPhone(responseData?.phone);
        setAddress(responseData?.address);
        setpageLength(response?.data?.pages);
        setLengthpage(response?.data);
        setName(responseData?.name);
        setCountry(responseData?.UserAccount?.UserProfile);
        setInvoiceId(response?.data?.result?.data[0].id);
        setCompanyName(responseData?.company);
      })
      .catch((error) => {});
  };
  
  const callOneInvoice = async (data) => {
    let responseData;

    Api()
      .get(
        `/admin/get-one-paymentInvoice-for-a-client/${location.state.params}`
      )
      .then((response) => {
        setIsReady(true);
        responseData = response?.data?.paymentInvoiceResult;
        setInvoiceId(responseData?.id);
        setOrders(response?.data?.data);
        setResponseData1(responseData.id);
        setPaymentInvoiceContents(responseData?.paymentInvoiceContents);
        setOrderSubtotal(responseData?.stringSubTotal);
        setIsPaid(responseData.isPaid);
        setOrderTax(responseData?.tax);
        setOrderDiscount(responseData?.discount);
        setOrderTotal(responseData?.stringTotal);
        setOrderId(responseData.teamId);
        setOrderName(responseData?.orderName);
        setInvoiceNumber(responseData?.invoiceNumber);
        setIssueDate(responseData?.dueDate);
        setInvoiceDate(responseData?.invoiceDate);
        setInvoiceNotes(responseData?.description);
        setPhone(responseData?.phone);
        setAddress(responseData?.address);
        setName(responseData?.name);
        setCountry(responseData?.UserAccount?.UserProfile);
        setInvoiceId(response?.data?.result?.data[0].id);
        setCompanyName(responseData?.company)
      })
      .catch((error) => {});
  };
  const makePayment = async () => {
    setLoading(true);
    let purchase_units = [];
    const data = {
      items: invoiceData[0]?.invoiceContents,
      amount: {
        value: invoiceData[0]?.total,
        breakdown: {
          item_total: {
            currency_code: "EUR",
            value: invoiceData[0]?.subTotal,
          },
          tax_total: {
            currency_code: "EUR",
            value: invoiceData[0]?.tax,
          },
          discount: {
            currency_code: "EUR",
            value: invoiceData[0]?.discount,
          },
        },
      },
      description: invoiceData[0]?.description,
    };
    purchase_units?.push(data);
    setInvoiceDataToPass(purchase_units[0]);
  };

  useEffect(() => {
    if (location.state.action === "isPaid") {
      callOneInvoice();
    } else {
      clientGetOrders();
    }
  }, []);

  const handleClosed = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({
      open: true,
      message: "Failed to connect to Paypal",
      severity: "error",
    });

    setOpen(false);
  };

  const makePaymentButton = (
    <Button
      onClick={() => {
        makePayment();
      }}
      variant="contained"
      className="invoiceButtons mb-3"
      style={{ backgroundColor: "#2E405B", color: "white" }}
      data-bs-toggle="modal"
      data-bs-target="#staticBackdrop"
    >
      Pay Securely
    </Button>
  );

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="container-fluid">
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClosed}
      >
        <Alert severity={`${alert.severity}`}>{alert.message}</Alert>
      </Snackbar>
      <div className="col-md-12 pageTitle mb-3">
        <h6>
          <b>Payment for {orderName?.replaceAll("&amp;", "&")}</b>
        </h6>
      </div>
      <div className="col-sm-12">
        {!isReady ? (
          <div className="d-flex justify-content-center align-item-center mt-5">
            <ClipLoader size={40} color="#1b98e0" loading />
          </div>
        ) : orders?.length <= 0 ? (
          <div className="d-flex justify-content-center align-item-center mt-5">
            <p>There are no orders on the platform currently.</p>
          </div>
        ) : (
          <div>
            <div className="row mb-1">
              <div className="col-sm-12">
                <Card
                  ref={componentRef}
                  style={{
                    borderRadius: "10px",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
                    color: "#363636",
                  }}
                  className="invoiceCard"
                >
                  <CardMedia component="div" className={classes.invoiceHeader}>
                    <Grid
                      container
                      spacing={2}
                      className={classes.gridHeaderContent}
                    >
                      <Grid item xs={6}>
                        <img
                          src="./images/fw_logo.svg"
                          alt="logo"
                          // className="recruiterBrand"
                          style={{ width: "130px" }}
                        />
                      </Grid>
                      <Grid item xs={6} className={classes.companyAddressInfo}>
                        <p style={{ color: "#2E405B" }}>
                          <b>
                            TheFairWork <br />
                            Email: hello@thefairwork.com
                            <br />
                            Website: www.thefairwork.com
                            <br />
                            Phone: +23 139 923 3324
                          </b>
                        </p>
                      </Grid>
                    </Grid>
                  </CardMedia>

                  <CardContent className={classes.gridInvoiceBody}>
                    <div className="row">
                      <Grid item md={7} xs={6} sm={7}>
                        <div>
                          <p
                            className="invoiceBodyTitles"
                            style={{ color: "#555555" }}
                          >
                            {" "}
                            Bill From
                          </p>
                          <p style={{ color: "#555555", marginBottom: "10px" }}>
                            <b> TheFairWork </b>
                          </p>
                          <p style={{ color: "#555555" }}>
                            32 Pawpaw Avenue <br />
                            Germany <br />
                            Phone: +23 139 923 3324
                          </p>
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        sm={5}
                        md={5}
                        style={{ paddingLeft: "0px" }}
                        className="invoiceRight"
                      >
                        <div className="itemAlign">
                          <p
                            className="invoiceBodyTitles"
                            style={{ color: "#555555" }}
                          >
                            {" "}
                            Invoice For
                          </p>
                          <p style={{ color: "#555555" }}> {orderName?.replaceAll("&amp;", "&")}</p>
                        </div>
                      </Grid>

                      <Grid item xs={6} sm={7} md={7}>
                        <div>
                          <p
                            className="invoiceBodyTitles"
                            style={{ color: "#555555" }}
                          >
                            Bill To
                          </p>
                          <p className="mb-0" style={{ color: "#555555" }}>
                            <b> {companyName?.replaceAll("&amp;", "&") || name?.replaceAll("&amp;", "&")} </b>
                          </p>
                          <p className="mb-0" style={{ color: "#555555" }}>
                            {country?.Country?.name === undefined
                              ? ""
                              : country?.Country?.name}
                          </p>
                          <p className="mb-0" style={{ color: "#555555" }}>
                            {address}
                          </p>
                          <p>Phone: {phone}</p>
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        sm={5}
                        md={5}
                        style={{ paddingLeft: "0px" }}
                        className="invoiceRight"
                      >
                        <Grid container className="itemAlign">
                          <Grid container>
                            <Grid item xs={12} md={12}>
                              <p
                                style={{
                                  color: "#555555",
                                  marginBottom: "4px",
                                }}
                              >
                                <b> Invoice #: </b><span style={{paddingLeft: "1.25rem"}}> {invoiceNumber} </span> 
                              </p>{" "}
                            </Grid>

                            <Grid item xs={12} md={12}>
                              <p
                                style={{
                                  color: "#555555",
                                  marginBottom: "4px",
                                }}
                              >
                                <b> Date Issued: </b> <span style={{paddingLeft: "0.25rem"}}>{moment(`${invoiceDate}`).format("D/M/Y")}</span>
                              </p>{" "}
                            </Grid>

                            <Grid item xs={12} md={12}>
                              <p
                                style={{
                                  color: "#555555",
                                  marginBottom: "4px",
                                }}
                              >
                                <b> Date Due: </b> <span style={{paddingLeft: "1.188rem"}}>{issueDate === null
                                  ? ``
                                  : moment(`${issueDate}`).format("D/M/Y")} </span>
                              </p>{" "}
                            </Grid>
                           
                          </Grid>
                          <Grid container>
                            
                          </Grid>
                          <Grid container>
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                      <TableContainer>
                        <Table className="fixedTable">
                          <TableHead style={{border: "0", breakInside: "auto"}}>
                            <TableRow>
                              <StyledTableCell
                                style={{
                                  borderRadius: "4px 0 0 4px",
                                  color: "#2E405B",
                                  fontWeight: "700"
                                }}
                              >
                                Item
                              </StyledTableCell>
                              <StyledTableCell
                                style={{
                                  paddingLeft: "100px",
                                  color: "#2E405B",
                                  fontWeight: "700"
                                }}
                              >
                                Quantity
                              </StyledTableCell>
                              <StyledTableCell
                                className="costItem"
                                style={{ color: "#2E405B", fontWeight: "700" }}
                              >
                                Cost
                              </StyledTableCell>
                              <StyledTableCell
                                style={{
                                  paddingLeft: "25px",
                                  borderRadius: "0 4px 4px 0",
                                  color: "#2E405B",
                                  fontWeight: "700"
                                }}
                                className="totalEnd"
                              >
                                Total
                              </StyledTableCell>
                            </TableRow>
                            
                          </TableHead>
                          {paymentInvoiceContents?.map((orderItem, index) => {
                            return (
                              <TableBody key={index.toString()}>
                                <StyledTableRow>
                                  <StyledTableCell
                                    className="table-names"
                                    component="p"
                                    scope="row"
                                    style={{
                                      whiteSpace: "nowrap",
                                      color: "#555555",
                                      paddingTop: "10px",
                                      paddingBottom: "10px",
                                    }}
                                  >
                                    {orderItem?.name}
                                  </StyledTableCell>
                                  <StyledTableCell
                                  
                                    component="p"
                                    style={{
                                      paddingLeft: "100px",
                                      color: "#555555",
                                      paddingTop: "10px",
                                      paddingBottom: "10px",
                                    }}
                                  >
                                    {orderItem?.quantity}
                                  </StyledTableCell>
                                  <StyledTableCell
                                  className="costItem"
                                    component="p"
                                    style={{
                                      color: "#555555",
                                      paddingTop: "10px",
                                      paddingBottom: "10px",
                                    }}
                                    
                                  >
                                    €{orderItem?.stringPrice}
                                  </StyledTableCell>
                                  <StyledTableCell
                                    component="p"
                                    style={{
                                      paddingLeft: "28px",
                                      color: "#555555",
                                      paddingTop: "10px",
                                      paddingBottom: "10px",
                                    }}
                                    className="totalEnd"
                                  >
                                    €{orderItem?.stringTotal}
                                  </StyledTableCell>
                                </StyledTableRow>
                              </TableBody>
                            );
                          })}

                          <TableBody>
                            <StyledTableRow style={{ borderBottom: "0px" }}>
                              <StyledTableCell
                                colspan={2}
                                className="table-names"
                                scope="row"
                                style={{
                                  whiteSpace: "nowrap",
                                  color: "#555555",
                                  paddingTop: "10px",
                                  paddingBottom: "10px",
                                  paddingLeft: "0px",
                                  borderBottom: "0px",
                                  fontWeight: "700"
                                }}
                              >
                                Notes
                              </StyledTableCell>
                              <StyledTableCell
                                style={{
                                  paddingLeft: "80px",
                                  color: "#555555",
                                  paddingTop: "10px",
                                  paddingBottom: "10px",
                                  borderBottom: "0px",
                                }}
                                className="costItem"
                              >
                                <p style={{border: "0px", margin: "0px", fontWeight: "700"}}>
                                 Subtotal
                                  </p>
                              </StyledTableCell>
                              <StyledTableCell
                                style={{
                                  color: "#555555",
                                  paddingTop: "10px",
                                  paddingBottom: "10px",
                                  paddingLeft: "28px",
                                  borderBottom: "0px",
                                }}
                                // className={classes.costMobile}
                                className="totalEnd"
                              >
                                €{orderSubtotal}
                              </StyledTableCell>
                            </StyledTableRow>
                          </TableBody>

                          <TableBody>
                            <StyledTableRow
                              style={{ borderBottom: "0px", paddingTop: "0px" }}
                            >
                              <StyledTableCell
                                rowspan={3}
                                colspan={2}
                                
                                style={{
                                  paddingTop: "0px",
                                  paddingLeft: "0px",
                                  alignItems: "flex-start",
                                  borderBottom: "0px",
                                  width: "50%"
                                }}
                              >
                                {invoiceNotes}
                                
                              </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                              <StyledTableCell
                                style={{
                                  color: "#555555",
                                  paddingTop: "0px",
                                  paddingBottom: "10px",
                                  paddingLeft: "80px",
                                  borderBottom: "0px",
                                }}
                                className="costItem"
                              >
                                <p style={{padding: "0px", border: "0px", margin: "0px", fontWeight: "700"}}>
                                 Discount
                                </p>
                              </StyledTableCell>

                              <StyledTableCell
                                style={{
                                  paddingLeft: "28px",
                                  color: "#555555",
                                  paddingTop: "0px",
                                  paddingBottom: "10px",
                                  borderBottom: "0px",
                                }}
                                className="totalEnd"
                              >
                                <p style={{padding: "0px", border: "0px", margin: "0px"}}>
                                {orderDiscount || "0"}%
                                  </p>
                              </StyledTableCell>
                            </StyledTableRow>

                            <StyledTableRow style={{ borderBottom: "0px" }}>
                              <StyledTableCell
                                style={{
                                  color: "#555555",
                                  paddingTop: "0px",
                                  paddingBottom: "0px",
                                  paddingLeft: "80px",
                                  borderBottom: "0px"
                                }}
                                className="costItem"
                              >
                                <p style={{ color: "#555555", fontWeight: "700" }}>
                                  Tax
                                </p>{" "}
                              </StyledTableCell>

                              <StyledTableCell
                                style={{
                                  paddingLeft: "28px",
                                  color: "#555555",
                                  paddingTop: "0px",
                                  paddingBottom: "0px",
                                  borderBottom: "0px"
                                }}
                                className="totalEnd"
                              >
                                <p style={{ color: "#707070" }}>
                                  {orderTax || "0"}%
                                </p>
                              </StyledTableCell>
                            </StyledTableRow>
                          </TableBody>

                          <TableBody >
                            <StyledTableRow style={{ borderBottom: "0px" }}>
                              <StyledTableCell
                                colspan={2}
                                className="table-names"
                                scope="row"
                                style={{
                                  whiteSpace: "nowrap",
                                  color: "#555555",
                                  paddingTop: "10px",
                                  paddingBottom: "10px",
                                  paddingLeft: "0px",
                                  borderBottom: "0px",
                                }}
                              ></StyledTableCell>
                              <StyledTableCell
                                style={{
                                  paddingLeft: "80px",
                                  color: "#555555",
                                  paddingTop: "10px",
                                  paddingBottom: "10px",
                                  borderBottom: "0px",
                                }}
                                className="costItem"
                              >
                                <p
                                  className="invoiceBodyTitles"
                                  style={{ color: "#2E405B" }}
                                >
                                  Total:{" "}
                                </p>
                              </StyledTableCell>
                              <StyledTableCell
                                style={{
                                  color: "#555555",
                                  paddingTop: "10px",
                                  paddingBottom: "10px",
                                  paddingLeft: "28px",
                                  borderBottom: "0px",
                                }}
                                // className={classes.costMobile}
                                className="totalEnd"
                              >
                                <p
                                  className="invoiceBodyTitles"
                                  style={{ color: "#2E405B" }}
                                >
                                  €{orderTotal}
                                </p>
                              </StyledTableCell>
                            </StyledTableRow>
                            
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </CardContent>
                  <Snackbar
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    open={open}
                    autoHideDuration={4000}
                  >
                    <Alert severity={`${alert.severity}`}>
                      {alert.message}
                    </Alert>
                  </Snackbar>
                </Card>
                <div
                  id="downloadOrPay"
                  style={{
                    marginTop: "25px",
                    marginBottom: "25px",
                  }}
                  className="downPay"
                >
                  {userType !== 3 && (
                    <Button
                      variant="outlined"
                      className="invoiceButtons mb-3"
                      style={{
                        border: "2.3px solid #2E405B",
                        color: "#2E405B",
                      }}
                      // onClick={printInvoice}
                      onClick={handlePrint}
                    >
                      {" "}
                      Download Invoice
                    </Button>
                  )}
                  {userType === 3 && !isPaid && (
                    <Button
                      variant="outlined"
                      className="invoiceButtons mb-3"
                      style={{
                        border: "2.3px solid #2E405B",
                        color: "#2E405B",
                      }}
                      // onClick={printInvoice}
                      onClick={() => handleManualPay()}
                    >
                      {" "}
                      Pay Manually
                    </Button>
                  )}

                  {location?.state?.makePay &&
                    !isPaid &&
                    userType !== 3 &&
                    makePaymentButton}
                  {userType === 3 && !isPaid && (
                    <Button
                      variant="contained"
                      className="invoiceButtons mb-3"
                      style={{
                        backgroundColor: "#2E405B",
                        color: "#FFFFFF",
                        border: "2.3px solid #2E405B",
                      }}
                      onClick={() => {
                        history.push({
                          pathname: "/create-payment",
                          params: { keyword: "edit", orderId: responseData1 },
                        });
                      }}
                    >
                      {" "}
                      Edit Invoice
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <CreditCardPaymentModal invoiceDataToPass={invoiceDataToPass} />
    </div>
  );
}

export default ClientViewInvoice;
