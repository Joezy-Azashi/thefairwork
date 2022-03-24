import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router";
import Api from "../../Services/api";
import { ClipLoader } from "react-spinners";
import { Button, Card, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { mdiCloseCircle } from "@mdi/js";
import moment from "moment";
import Icon from "@mdi/react";
import Box from "@mui/material/Box";
import { TextField, InputAdornment } from "@material-ui/core";
import { companyName, streetAddress, phone } from "../../Services/address";
import { currency } from "./../../Services/currency";
import { getUserType } from "../../Services/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@material-ui/icons/Add";

function AdminAddsPaymentClient() {
  const [loading, setloading] = useState(false);
  const [loadingNewLine, setLoadingNewLine] = useState(false);
  const [newLineVisibility, setNewlineVisibility] = useState(false);
  const [customAddons, setCustomAddons] = useState({});
  const [customAddonArray, setCustomAddonArray] = useState([]);
  const [instantTotal, setInstantTotal] = useState(0);
  const [tax, setTax] = useState();
  const [discount, setDiscount] = useState();
  const [description, setDescription] = useState();
  const [toAddress, setToAddress] = useState([]);
  // const [isPaid, setIsPaid] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState();
  const [dueDate, setDueDate] = useState();
  const [orderData, setOrderData] = useState();
  const [addOns, setAddOns] = useState([]);
  const [invoiceId, setInvoiceId] = useState();
  const location = useLocation();
  const history = useHistory();
  const unit = currency.secondary;
  const [alert, setAlert] = useState({});
  const [open, setOpen] = useState(false);
  const internationalNumberFormat = new Intl.NumberFormat("en-US");
  const [isCreating, setIsCreating] = useState(false);

  // NEW HOOKS
  const [newInvoiceData, setNewInvoiceData] = useState("");
  const [invoiceStreetData, setInvoiceStreetData] = useState("");
  const [invoicePhoneData, setinvoicePhoneData] = useState("");
  const [invoiceNumber1, setinvoiceNumber1] = useState("");
  const [newInvoiceId, setNewInvoiceId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [invoiceTax, setInvoiceTax] = useState("");
  const [invoiceDiscount, setInvoiceDiscount] = useState("");
  const [invoiceNotes, setInvoiceNotes] = useState("");
  const [allResponse, setallResponse] = useState("");
  const [totalPaymentValue, setTotalPaymentValue] = useState(null);
  let orderId;
  let action;

  if (getUserType().accountTypeId !== 3) {
    history.push("./");
  }
  if (typeof location.params === "object") {
    orderId = location?.params.orderId;
    action = location?.params.keyword;
    localStorage.setItem("params", JSON.stringify(location?.params));
  } else {
    const params = JSON.parse(localStorage.getItem("params"));
    action = params?.keyword;
    orderId = params?.orderId;
  }

  const closeNewLine = () => {
    setNewlineVisibility(false);
  };

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;

  const handleNewLineVisibility = (action) => {
    if (newLineVisibility && JSON.stringify(customAddons) !== "{}") {
      const title = document.getElementById("name")?.value;
      const quantity = document.getElementById("quantity")?.value;
      const price = document.getElementById("price")?.value;
      if (title && quantity && !isNaN(quantity) && price && !isNaN(price)) {
        const temp = [...customAddonArray];
        temp.push(customAddons);
        setCustomAddonArray(temp);
        localStorage.setItem("temp", JSON.stringify(temp));
        setCustomAddons({});
        setInstantTotal(0);
        setNewlineVisibility(false);
        setTimeout(function () {
          setNewlineVisibility(action);
        }, 350);
      } else {
        setNewlineVisibility(true);
      }
    } else {
      setNewlineVisibility(true);
    }
  };

  const closeSnack = () => {
    setOpen(false);
  };

  const handleCustomAddOns = (e) => {
    setCustomAddons({ ...customAddons, [e.target.name]: e.target.value });
    handleInstantProduct();
  };
  const handleSubTotal = () => {
    let addonsTotal;
    let customAddonsTotal;

    if (Array.isArray(addOns) && addOns.length) {
      addonsTotal = addOns.map((e, i) => +e.price * +e.quantity);
    }
    if (Array.isArray(customAddonArray) && customAddonArray.length) {
      customAddonsTotal = customAddonArray.map((e, i) => +e.price * e.quantity);
    }
    let a = 0;
    let b = 0;

    if (
      Array.isArray(addonsTotal) &&
      addonsTotal.length &&
      Math.max(...addonsTotal) > 0
    ) {
      a = addonsTotal.reduce((a, b) => a + b);
    }
    if (
      Array.isArray(customAddonsTotal) &&
      customAddonsTotal.length &&
      Math.max(...customAddonsTotal) > 0
    ) {
      b = customAddonsTotal.reduce((a, b) => a + b);
    }
    return (
      a +
      b +
      (!isNaN(instantTotal) ? instantTotal : 0) +
      (totalPaymentValue === null ? 0 : totalPaymentValue)
    );
  };

  const handleInstantProduct = () => {
    let a = document.getElementById("quantity").value;
    let b = document.getElementById("price").value;
    const temp = a * b;
    setInstantTotal(a * b);
    handleTotal();
  };

  const handleTotal = () => {
    let total = handleSubTotal();
    if (!isNaN(tax) && tax > 0) {
      total = total + total * (tax / 100);
    }
    if (!isNaN(discount) && discount > 0) {
      total = total - total * (discount / 100);
    }
    return total;
  };

  const numberFormater = (num) => {
    return internationalNumberFormat.format(num.toFixed(2));
  };

  const deleteCustomAddon = (data) => {
    const temp = [...customAddonArray];
    const temp2 = temp.filter((e, i) => i !== +data);
    setCustomAddonArray(temp2);
  };
  const deleteAddon = (index) => {
    const removedId = addOns[index].id;
    setAddOns((prev) => prev.filter((e, i) => i !== index));

    removeAddon(removedId);
  };
  const handleAddonsChange = (data) => {
    const value = data.target.value;
    const thisId = data.target.name;
    const indexToChange = +data.target.id;
    const temp = [...addOns];
    temp[indexToChange][thisId] = value;
    setAddOns(temp);
  };

  const handleCustomAddonsChange = (data) => {
    const value = data.target.value;
    const thisId = data.target.name;
    const indexToChange = +data.target.id;
    const temp = [...customAddonArray];
    temp[indexToChange][thisId] = value;
    setCustomAddonArray(temp);
  };

  const getOrder = async () => {
    setloading(true);

    if (action === "new-order") {
      Api()
        .post(`/admin/create-payment/${orderId}`)
        .then((response) => {
          setloading(false);
          setNewInvoiceData(response?.data?.result?.company);
          setInvoiceStreetData(response?.data?.result?.address);
          setinvoicePhoneData(response?.data?.result?.phone);
          setinvoiceNumber1(response?.data?.result?.invoiceNumber);
          setAddOns([...response?.data?.addons]);
          setNewInvoiceId(response?.data?.result?.id);
          setTeamName(response?.data?.result?.orderName);
          setTotalPaymentValue(response?.data?.result?.totalPaymentValue);
        })
        .catch((error) => {});
    } else {
      Api()
        .get(`/admin/get-one-paymentInvoice-for-a-client/${orderId}`)
        .then((response) => {
          const responseData = response?.data.paymentInvoiceResult;
          setallResponse(responseData);
          setloading(false);
          setDiscount(responseData?.discount);
          setTax(responseData?.tax)
          setNewInvoiceData(responseData?.company);
          setInvoiceStreetData(responseData?.address);
          setinvoicePhoneData(responseData?.phone);
          setinvoiceNumber1(responseData?.invoiceNumber);
          setAddOns(responseData?.paymentInvoiceContents);
          setNewInvoiceId(responseData?.id);
          setTeamName(responseData?.orderName);
          setInvoiceTax(responseData?.tax);
          setInvoiceDiscount(responseData?.discount);
          setInvoiceNotes(responseData?.description);
          setTotalPaymentValue(responseData?.totalPaymentValue);
        })
        .catch((error) => {});
    }
  };

  // DELETE ADDONS
  const removeAddon = async (load) => {
    Api()
      .delete(`admin/delete-payment-invoice-content/${load}`)
      .then((response) => {})
      .catch((error) => {});
  };

  // ADD CUSTOM ORDERS
  const saveCustom = async (load) => {
    const customAddonInLs = JSON.parse(localStorage.getItem("temp"));
    localStorage.setItem("temp", null);
    const data = {
      customAddons: customAddonInLs ? [...addOns, ...customAddonInLs] : [...addOns],
      tax: +tax,
      discount: +discount,
      description,
      currency: "EUR",
      dueDate,
      phone: invoicePhoneData,
      address: invoiceStreetData,
      company: newInvoiceData,
    };

    Api()
      .post(`admin/save-payment/${newInvoiceId}`, data)
      .then((response) => {
        setOpen(true);
        setAlert({
          open: true,
          message: "Invoice created successfully",
          severity: "success",
        });

        setTimeout(() => {
          window.location.assign("/all-payment-due");
        }, 1000);
      })
      .catch((error) => {
        setOpen(true);
        setAlert({
          open: true,
          message: `${error.response.data}`,
          severity: "error",
        });
        setTimeout(() => {
          closeSnack();
        }, 3000);
      });
  };

  // CANCEL AND DELETE ORDER
  const handleDeleteOrder = async () => {
    window.location.assign("/team-orders");
  };

  useEffect(() => {
    getOrder();
  }, []);

  const newLine = (
    <TableRow
      style={{
        borderBottom: "none",
        padding: "0",
        margin: "0",
      }}
    >
      <TableCell
        colSpan={9}
        style={{
          borderBottom: "none",
          paddingLeft: "0",
          paddingBottom: "0",
          paddingRight: "0",
        }}
      >
        <TextField
          name="name"
          id="name"
          variant="outlined"
          type="string"
          size="small"
          className="cpFilterLabel "
          fullWidth
          // value={}
          style={{ textTransform: "capitalize", display: "inline-block" }}
          onChange={(e) => handleCustomAddOns(e)}
          required
          asterisk
          autoFocus
        />
      </TableCell>

      <TableCell
        colSpan={2}
        style={{
          borderBottom: "none",
          paddingLeft: "0.5",
          paddingBottom: "0",
          paddingRight: "0",
        }}
      >
        <TextField
          id="quantity"
          name="quantity"
          type="number"
          InputProps={{ inputProps: { min: 1 } }}
          variant="outlined"
          size="small"
          className="cpFilterLabel "
          fullWidth
          style={{ textTransform: "capitalize", minWidth: "50px" }}
          onChange={(e) => handleCustomAddOns(e)}
          required
          asterisk
        />
      </TableCell>
      <TableCell
        colSpan={3}
        style={{
          borderBottom: "none",
          paddingLeft: "0.5",
          paddingBottom: "0",
          paddingRight: "0",
        }}
      >
        <TextField
          id="price"
          name="price"
          variant="outlined"
          type="number"
          InputProps={{
            inputProps: { min: 1 },
            startAdornment: (
              <InputAdornment
                position="end"
                style={{ marginRight: "1rem", marginLeft: "0" }}
              >
                {unit}
              </InputAdornment>
            ),
          }}
          size="small"
          className="cpFilterLabel "
          fullWidth
          style={{
            textTransform: "capitalize",
            minWidth: "80px",
            textAlign: "right",
          }}
          onChange={(e) => handleCustomAddOns(e)}
        />
      </TableCell>

      <TableCell
        colSpan={3}
        style={{
          borderBottom: "none",
          paddingLeft: "0.5",
          paddingBottom: "0",
          paddingRight: "0.5",
        }}
      >
        <div
          className="row d-flex justify-content-center flex-nowrap "
          style={{ marginLeft: "0.5rem", minWidth: "80px" }}
        >
          <Box className="col-10 mt-3 mb-3 d-flex justify-content-end">
            {unit}
            {internationalNumberFormat.format(instantTotal.toFixed(2))}
          </Box>

          <Icon
            path={mdiCloseCircle}
            color="red"
            name="Delete"
            size={1.7}
            horizontal
            vertical
            rotate={180}
            className=" col-1 mt-1"
            onClick={() => setNewlineVisibility(false)}
          />
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div>
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-12 ">
          <h6 style={{ textTransform: "capitalize" }}>
            <b>Payment for {teamName?.replaceAll("&amp;", "&")}</b>
          </h6>
          <Card
            className="mt-4"
            style={{
              borderRadius: "10px",
              boxShadow: "#00000029 2px 2px 10px",
              padding: "35px",
            }}
          >
            <div>
              <Snackbar
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                open={open}
                autoHideDuration={4000}
              >
                <Alert severity={`${alert.severity}`}>{alert.message}</Alert>
              </Snackbar>
            </div>
            {loading ? (
              <div className="d-flex justify-content-center align-item-center">
                <ClipLoader size={40} color="#1b98e0" loading />
              </div>
            ) : (
              <div>
                <div className="row mt-5">
                  <Card
                    className="col-6"
                    style={{
                      borderRadius: "10px",
                      boxShadow: "#00000000 0px 0px 0px",
                    }}
                  >
                    <h6
                      className="mt-0"
                      style={{ color: "#555555", fontFamily: "Segoe UI" }}
                    >
                      <b>Bill From</b>
                    </h6>
                    <TextField
                      label="Company Name"
                      name="name"
                      id="from"
                      variant="outlined"
                      size="small"
                      className="cpFilterLabel mt-3 pt-1"
                      fullWidth
                      inputProps={{
                        style: { fontFamily: "Segoe UI" },
                      }}
                      value={companyName}
                      style={{ textTransform: "capitalize" }}
                    />
                    <TextField
                      label="Street address"
                      name="address"
                      id="from"
                      variant="outlined"
                      size="small"
                      className="cpFilterLabel mt-3 pt-1"
                      fullWidth
                      inputProps={{
                        style: { fontFamily: "Segoe UI" },
                      }}
                      value={streetAddress}
                      style={{ textTransform: "capitalize" }}
                    />
                    <TextField
                      label="Phone Number"
                      name="phone"
                      id="from"
                      variant="outlined"
                      size="small"
                      className="cpFilterLabel mt-3 pt-1"
                      fullWidth
                      inputProps={{
                        style: {
                          fontFamily: "Segoe UI",
                          textTransform: "capitalize",
                        },
                      }}
                      value={phone}
                      style={{ textTransform: "capitalize" }}
                    />
                  </Card>
                  <Card
                    className="col-6"
                    style={{
                      borderRadius: "10px",
                      boxShadow: "#00000000 0px 0px 0px",
                    }}
                  >
                    <div className="pageTitle mb-4 mt-1 d-flex justify-content-center align-item-center">
                      <h1 style={{ color: "#555555", fontFamily: "Segoe UI" }}>
                        <b>Invoice</b>
                      </h1>
                    </div>
                  </Card>
                </div>
                <div className="row mt-3">
                  <Card
                    className="col-6"
                    style={{
                      borderRadius: "10px",
                      boxShadow: "#00000000 0px 0px 0px",
                    }}
                  >
                    <h6
                      className="mt-4"
                      style={{ color: "#555555", fontFamily: "Segoe UI" }}
                    >
                      <b>Bill To</b>
                    </h6>
                    <TextField
                      label="Company Name"
                      name="company"
                      id="toCompanyName"
                      variant="outlined"
                      size="small"
                      className="cpFilterLabel mt-3 pt-1"
                      fullWidth
                      value={newInvoiceData?.replaceAll("&amp;", "&")}
                      inputProps={{
                        style: {
                          fontFamily: "Segoe UI",
                          textTransform: "capitalize",
                        },
                      }}
                      onChange={(e) => {
                        setNewInvoiceData(e.target.value);
                      }}
                    />
                    <TextField
                      label="Street Address"
                      variant="outlined"
                      name="address"
                      id="toAddress"
                      size="small"
                      className="cpFilterLabel pt-1 mt-3"
                      fullWidth
                      inputProps={{
                        style: {
                          fontFamily: "Segoe UI",
                          textTransform: "capitalize",
                        },
                      }}
                      value={invoiceStreetData}
                      style={{ textTransform: "capitalize" }}
                      onChange={(e) => {
                        setInvoiceStreetData(e.target.value);
                      }}
                    />
                    <TextField
                      label="Phone Number"
                      variant="outlined"
                      name="phone"
                      id="toPhone"
                      size="small"
                      className="cpFilterLabel pt-1 mt-3 mb-4"
                      fullWidth
                      value={invoicePhoneData}
                      inputProps={{
                        style: {
                          fontFamily: "Segoe UI",
                          textTransform: "capitalize",
                        },
                      }}
                      onChange={(e) => {
                        setinvoicePhoneData(e.target.value);
                      }}
                    />
                  </Card>
                  <Card
                    className="col-6 "
                    style={{
                      borderRadius: "10px",
                      boxShadow: "#00000000 0px 0px 0px",
                    }}
                  >
                    {/* dummy */}
                    <h6
                      className="mt-4"
                      style={{ color: "transparent", fontFamily: "Segoe UI" }}
                    >
                      <b>Bill To</b>
                    </h6>

                    <TextField
                      label="Invoice Number"
                      variant="outlined"
                      size="small"
                      className="cpFilterLabel pt-1 mt-3 "
                      fullWidth
                      value={invoiceNumber1}
                      inputProps={{
                        style: {
                          fontFamily: "Segoe UI",
                          textTransform: "capitalize",
                        },
                      }}
                    />
                    <TextField
                      id="notStartDate"
                      label="Invoice Date"
                      placeholder="start date"
                      type="date"
                      variant="outlined"
                      className="cpFilterLabel pt-1  mt-3 "
                      InputProps={{
                        inputProps: { min: today, max: "" },
                        style: {
                          fontFamily: "Segoe UI",
                          textTransform: "capitalize",
                        },
                      }}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={moment().format("YYYY-MM-DD") || ""}
                    />
                    <TextField
                      id="startDate"
                      label="Due Date"
                      placeholder="Due Date"
                      type="date"
                      variant="outlined"
                      className="cpFilterLabel pt-1 mt-3 mb-4"
                      InputProps={{
                        inputProps: { min: today, max: "" },
                        style: {
                          fontFamily: "Segoe UI",
                          textTransform: "capitalize",
                        },
                      }}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </Card>
                </div>

                {/* LINE ITEMS */}
                <div className="row ">
                  <div className="col-12">
                    <TableContainer
                      style={{ width: "100%" }}
                      className="invoiceTableScroll"
                    >
                      <Table className="fixedTable" padding="normal">
                        <TableHead
                          style={{
                            backgroundColor: "#2E405B",
                          }}
                        >
                          <TableRow>
                            <TableCell
                              colSpan={9}
                              style={{
                                paddingLeft: "0",
                                borderBottom: "none",
                                paddingTop: "0",
                                paddingBottom: "0",
                                paddingRight: "0",
                                color: "#ffffff",
                                borderRadius: "4px 0 0 4px",
                              }}
                            >
                              <div className="line-title">
                                <b style={{ fontWeight: "700" }}>Item</b>
                              </div>
                            </TableCell>
                            <TableCell
                              colSpan={2}
                              style={{
                                minWidth: "50px",
                                borderBottom: "none",
                                paddingLeft: "0.5",
                                paddingTop: "0",
                                paddingBottom: "0",
                                paddingRight: "0",
                                color: "#ffffff",
                              }}
                            >
                              <div className="line-title">
                                <b style={{ fontWeight: "700" }}>Quantity</b>
                              </div>
                            </TableCell>
                            <TableCell
                              colSpan={3}
                              style={{
                                borderBottom: "none",
                                paddingLeft: "0.5",
                                paddingTop: "0",
                                paddingBottom: "0",
                                paddingRight: "0",
                                color: "#ffffff",
                              }}
                            >
                              <div className="line-title">
                                <b style={{ fontWeight: "700" }}>Cost</b>
                              </div>
                            </TableCell>
                            <TableCell
                              align="right"
                              colSpan={3}
                              style={{
                                whiteSpace: "noWrap",
                                borderBottom: "none",
                                paddingTop: "0",
                                paddingLeft: "0.5",
                                paddingBottom: "0",
                                paddingRight: "0.5",
                                color: "#ffffff",
                                borderRadius: "0 4px 4px 0",
                              }}
                            >
                              <div className="line-title">
                                <b style={{ fontWeight: "700" }}>
                                  Total Amount
                                </b>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        {/* MAP OVER LINE ITEMS */}
                        <TableBody style={{ borderBottom: "none" }}>
                          {addOns &&
                            addOns.map((addon, index) => (
                              <TableRow
                                style={{
                                  borderBottom: "none",
                                  padding: "0",
                                  margin: "0",
                                }}
                              >
                                <TableCell
                                  colSpan={9}
                                  style={{
                                    borderBottom: "none",
                                    paddingLeft: "0",
                                    paddingBottom: "0",
                                    paddingRight: "0",
                                  }}
                                >
                                  <TextField
                                    name={index.toString()}
                                    variant="outlined"
                                    size="small"
                                    className="cpFilterLabel  "
                                    fullWidth
                                    value={addon?.name}
                                    inputProps={{
                                      style: {
                                        fontFamily: "Segoe UI",
                                        textTransform: "capitalize",
                                        margin: "0 0",
                                      },
                                    }}
                                    // onChange={(e) =>{ handleAddonsChange(e)}}
                                  />
                                </TableCell>
                                <TableCell
                                  colSpan={2}
                                  style={{
                                    borderBottom: "none",
                                    paddingLeft: "0.5",
                                    paddingBottom: "0",
                                    paddingRight: "0",
                                  }}
                                >
                                  <TextField
                                    id={index.toString()}
                                    name="quantity"
                                    variant="outlined"
                                    size="small"
                                    className="cpFilterLabel  "
                                    fullWidth
                                    value={addon.quantity}
                                    style={{
                                      textTransform: "capitalize",
                                      // minWidth: "50px",
                                      fontFamily: "Segoe UI",
                                    }}
                                    onChange={(e) => {
                                      handleAddonsChange(e);
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  colSpan={3}
                                  style={{
                                    borderBottom: "none",
                                    paddingLeft: "0.5",
                                    paddingBottom: "0",
                                    paddingRight: "0",
                                  }}
                                >
                                  <TextField
                                    name={index.toString()}
                                    variant="outlined"
                                    size="small"
                                    className="cpFilterLabel"
                                    fullWidth
                                    value={addon.price}
                                    style={{
                                      textTransform: "capitalize",
                                      // minWidth: "80px",
                                      fontFamily: "Segoe UI",
                                    }}
                                    // onChange={(e) =>{ handleAddonsChange(e)}}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment
                                          position="end"
                                          style={{
                                            marginRight: "1rem",
                                            marginLeft: "0rem",
                                          }}
                                        >
                                          {unit}
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  colSpan={3}
                                  style={{
                                    borderBottom: "none",
                                    paddingLeft: "0.5",
                                    paddingBottom: "0",
                                    paddingRight: "0.5",
                                  }}
                                >
                                  <div
                                    className="row d-flex justify-content-center flex-nowrap "
                                    style={{
                                      marginLeft: "0.5rem",
                                      // minWidth: "80px",
                                    }}
                                  >
                                    <Box
                                      className="col-10 d-flex justify-content-end"
                                      style={{ marginTop: "15px" }}
                                    >
                                      {unit}
                                      {numberFormater(
                                        +addon?.price * +addon?.quantity
                                      )}
                                    </Box>

                                    <Icon
                                      path={mdiCloseCircle}
                                      color="red"
                                      name="Delete"
                                      size={1.7}
                                      horizontal
                                      vertical
                                      rotate={180}
                                      style={{ marginTop: "6px" }}
                                      className=" col-1 mt-1"
                                      onClick={(e) => {
                                        deleteAddon(index);
                                      }}
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          {/* END OF MAP OVER */}
                          {/* {MAP OVER CUSTOMADDONARRAY} */}
                          {customAddonArray &&
                            customAddonArray.map((addon, index) => (
                              <TableRow
                                style={{
                                  borderBottom: "none",
                                  padding: "0",
                                  margin: "0",
                                }}
                              >
                                <TableCell
                                  colSpan={9}
                                  style={{
                                    borderBottom: "none",
                                    paddingLeft: "0",
                                    paddingBottom: "0",
                                    paddingRight: "0",
                                  }}
                                >
                                  <TextField
                                    id={index.toString()}
                                    name="name"
                                    variant="outlined"
                                    size="small"
                                    className="cpFilterLabel"
                                    fullWidth
                                    value={addon?.name}
                                    style={{ textTransform: "capitalize" }}
                                    onChange={(e) => {
                                      handleCustomAddonsChange(e);
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  colSpan={2}
                                  style={{
                                    borderBottom: "none",
                                    paddingLeft: "0.5",
                                    paddingBottom: "0",
                                    paddingRight: "0",
                                  }}
                                >
                                  <TextField
                                    id={index.toString()}
                                    name="quantity"
                                    variant="outlined"
                                    size="small"
                                    className="cpFilterLabel"
                                    fullWidth
                                    value={addon.quantity}
                                    style={{
                                      textTransform: "capitalize",
                                      minWidth: "50px",
                                    }}
                                    onChange={(e) => {
                                      handleCustomAddonsChange(e);
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  colSpan={3}
                                  style={{
                                    borderBottom: "none",
                                    paddingLeft: "0.5",
                                    paddingBottom: "0",
                                    paddingRight: "0",
                                  }}
                                >
                                  <TextField
                                    id={index.toString()}
                                    name="price"
                                    variant="outlined"
                                    size="small"
                                    className="cpFilterLabel"
                                    fullWidth
                                    value={addon.price}
                                    style={{
                                      textTransform: "capitalize",
                                      minWidth: "80px",
                                    }}
                                    onChange={(e) => {
                                      handleCustomAddonsChange(e);
                                    }}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment
                                          position="end"
                                          style={{
                                            marginRight: "1rem",
                                            marginLeft: "0",
                                          }}
                                        >
                                          {unit}
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  colSpan={3}
                                  style={{
                                    borderBottom: "none",
                                    paddingLeft: "0.5",
                                    paddingBottom: "0",
                                    paddingRight: "0.5",
                                  }}
                                >
                                  <div
                                    className="row d-flex justify-content-center flex-nowrap "
                                    style={{
                                      marginLeft: "0.5rem",
                                      // minWidth: "80px",
                                    }}
                                  >
                                    <Box
                                      className="col-10 d-flex justify-content-end"
                                      style={{ marginTop: "15px" }}
                                    >
                                      {unit}
                                      {numberFormater(
                                        +addon?.price * +addon?.quantity
                                      )}
                                    </Box>

                                    <Icon
                                      path={mdiCloseCircle}
                                      color="red"
                                      name="Delete"
                                      size={1.7}
                                      horizontal
                                      vertical
                                      rotate={180}
                                      style={{ marginTop: "6px" }}
                                      className=" col-1 mt-1"
                                      onClick={(e) => {
                                        deleteCustomAddon(index);
                                      }}
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          {/* END OF MAP OVER */}

                          {/* END OF LINE ITEMS */}
                          {newLineVisibility && newLine}
                          {loadingNewLine && (
                            <div className="d-flex justify-content-center align-item-center">
                              <ClipLoader size={40} color="#1b98e0" loading />
                            </div>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
                <div className="mt-2">
                  <div>
                    <Button
                      className="btn-text"
                      style={{ color: "#2E405B" }}
                      onClick={() => {
                        handleNewLineVisibility(true);
                      }}
                      startIcon={<AddIcon />}
                    >
                      Add Line Item
                    </Button>
                  </div>
                </div>
                <hr
                  style={{
                    border: "none",
                    borderTop: "1px dashed #000",
                    color: "#fff",
                    backgroundColor: "#ffffff",
                    height: "1px",
                  }}
                ></hr>
                <div className="row mb-4">
                  <div className="col-md-7 col-sm-12">
                    <p className="bodyTitles " style={{ color: "#555555" }}>
                      <b>Notes</b>
                    </p>
                    <TextField
                      id="description"
                      label=""
                      type="text"
                      variant="outlined"
                      placeholder="Add any relevant information not already covered"
                      className="cpFilterLabel mb-3 invoiceNoteTextbox"
                      rows={4}
                      multiline
                      fullWidth
                      defaultValue={invoiceNotes}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="col-md-1" />
                  <div className="col-md-4 col-sm-12">
                    <TableContainer>
                      <Table>
                        <TableRow>
                          <TableCell
                            style={{
                              borderBottom: "none",
                              paddingRight: "0",
                              paddingTop: "0",
                            }}
                          >
                            <Box
                              style={{ textAlign: "right", color: "#555555" }}
                              className=""
                            >
                              <b>Subtotal</b>
                            </Box>
                          </TableCell>
                          <TableCell
                            style={{
                              borderBottom: "none",
                              paddingLeft: "0",
                              paddingTop: "0",
                            }}
                          >
                            <Box
                              style={{
                                textAlign: "right",
                              }}
                            >
                              {unit}
                              {numberFormater(handleSubTotal())}
                            </Box>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            style={{
                              borderBottom: "none",
                              paddingRight: "0",
                              paddingTop: "0",
                            }}
                          >
                            <Box
                              style={{
                                whiteSpace: "noWrap",
                                textAlign: "right",
                                color: "#555555",
                              }}
                              className=" "
                            >
                              <b>Add Discount</b>
                            </Box>
                          </TableCell>
                          <TableCell
                            style={{
                              borderBottom: "none",
                              paddingLeft: "0",
                              textAlign: "right",
                              paddingTop: "0",
                            }}
                          >
                            <TextField
                              id="type"
                              variant="outlined"
                              size="small"
                              type="number"
                              className="cpFilterLabel "
                              placeholder="0"
                              defaultValue={
                                allResponse?.discount || invoiceDiscount
                              }
                              style={{
                                textAlign: "right",
                                textTransform: "capitalize",
                                paddingLeft: "3rem",
                                maxWidth: "9rem",
                              }}
                              onChange={(e) => setDiscount(e.target.value)}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    %
                                  </InputAdornment>
                                ),
                                PaddingLeft: "3rem",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            style={{
                              borderBottom: "none",
                              paddingRight: "0",
                              textAlign: "right",
                              paddingTop: "0",
                            }}
                          >
                            <Box
                              style={{
                                whiteSpace: "noWrap",
                                textAlign: "right",
                                color: "#555555",
                              }}
                              className=""
                            >
                              <b>Add Tax</b>
                            </Box>
                          </TableCell>
                          <TableCell
                            className=""
                            style={{
                              borderBottom: "none",
                              paddingLeft: "0",
                              textAlign: "right",
                              paddingTop: "0",
                            }}
                          >
                            <TextField
                              id="type"
                              variant="outlined"
                              type="number"
                              size="small"
                              className="cpFilterLabel "
                              placeholder="0"
                              defaultValue={allResponse?.tax || invoiceTax}
                              style={{
                                textAlign: "right",
                                textTransform: "capitalize",
                                paddingLeft: "3rem",
                                maxWidth: "9rem",
                              }}
                              onChange={(e) => setTax(e.target.value)}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    %
                                  </InputAdornment>
                                ),
                                style: { textAlign: "right" },
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            style={{
                              borderBottom: "none",
                              paddingRight: "0",
                              paddingTop: "0",
                            }}
                          >
                            <Box
                              style={{
                                whiteSpace: "noWrap",
                                textAlign: "right",
                                color: "#555555",
                              }}
                              className=" "
                            >
                              <b>Total</b>
                            </Box>
                          </TableCell>
                          <TableCell
                            style={{
                              borderBottom: "none",
                              paddingLeft: "0",
                              paddingTop: "0",
                            }}
                          >
                            <Box
                              style={{
                                textAlign: "right",
                                paddingLeft: "2rem",
                              }}
                            >
                              {unit}
                              {numberFormater(handleTotal())}
                              {/* {(allResponse?.stringTotal)} */}
                            </Box>
                          </TableCell>
                        </TableRow>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              </div>
            )}
          </Card>
          {!loading && (
            <div className="justify-content-center downPay mb-5 mt-3">
              <Button
                variant="outlined"
                className="invoiceButtons mb-3"
                style={{
                  border: "2.3px solid #2E405B",
                  color: "#2E405B",
                }}
                onClick={() => {
                  handleDeleteOrder();
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                className="invoiceButtons mb-3"
                style={{
                  backgroundColor: "#2E405B",
                  color: "#FFFFFF",
                  border: "2.3px solid #2E405B",
                }}
                onClick={() => {
                  if (JSON.stringify(customAddons) !== "{}") {
                    setIsCreating(true);
                    handleNewLineVisibility(false);
                  }
                  closeNewLine();

                  saveCustom();
                }}
                disabled={isCreating}
              >
                {isCreating && (
                  <div style={{ marginRight: "5px", padding: "0 2.5rem" }}>
                    <ClipLoader size={20} color="#1b98e0" loading />
                  </div>
                )}
                {!isCreating && <>Create Payment</>}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminAddsPaymentClient;
