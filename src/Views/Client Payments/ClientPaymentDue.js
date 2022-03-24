import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../../Services/api";
import { ClipLoader } from "react-spinners";
import Pagination from "@material-ui/lab/Pagination";
import { getCurrentUser } from "../../Services/auth";
import PaymentOrder from "../../Components/ClientPayment/PaymentOrder";
import PaymentHeader from "../../Components/ClientPayment/PaymentHeader";
import moment from "moment";
import { useLocation, useHistory } from "react-router-dom";
import { Snackbar ,Card, Button} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { api } from "../../public/config";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from '@mui/material/styles';


const usePageStyles = makeStyles({
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#2E405B4D",
    color: "#2E405B",
    fontSize: "0.8rem",
  },
  
}));

function ClientPaymentDue() {
  const classes = usePageStyles();
  const location = useLocation();
  const [paymentsDue, setPaymentsDue] = useState([]);
  const [pageLength, setpageLength] = useState([]);
  const [pageNumber, setpageNumber] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [userAccountId, setuserAccountId] = useState(
    getCurrentUser()?.user?.UserProfile?.userAccountId
  );
  const [lengthpage, setLengthpage] = useState([]);

  // HOOKS FOR OPENING OF SNACK BAR
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const clientGetPaymentDueInvoices = async (pageNumberSelected = 1) => {
    let responseData;
    const data = {
      userAccountId,
      paymentInvoiceId: null,
    };
    Api()
      .post(`/users/get-client-due-paymentInvoice/${pageNumberSelected}`, data)
      .then((response) => {
        setIsReady(true);
        setPaymentsDue(response?.data?.result?.data);
        setpageLength(response?.data?.result?.pages?.length);
        setLengthpage(response?.data?.result?.lastPage);
      })
      .catch((error) => {});
  };

  const handlePageChange = async (event, value) => {
    setpageNumber(value);
    await clientGetPaymentDueInvoices(value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const openSnack = () => {
    setOpen(true);
  };
  const history = useHistory();

  const getPaymentResponse = async () => {
    Api()
      .get(
        `${api}/${`admin`}/${
          window.location.href.split("/")[4]
        }`
      )
      .then(async (response) => {
        openSnack();
        setAlert({
          open: true,
          message: `Payment for your order failed`,
          severity: "error",
        });
        await clientGetPaymentDueInvoices();
      })
      .catch(async (error) => {
        openSnack();
        setAlert({
          open: true,
          message: `Payment for your order failed`,
          severity: "error",
        });
        await clientGetPaymentDueInvoices();
      });
  };

  const handlePaymentDueButtonClick = (userAccountId, orderItemId) => {
    localStorage.setItem("orderId", userAccountId);
      history.push("/client-invoice", { params: orderItemId, makePay: true });
     
  };

  useEffect(() => {
    if (window.location.href.split("?")[0].split("/")[4] === "fail") {
      getPaymentResponse();
    } else {
      clientGetPaymentDueInvoices();
    }
  }, []);

  return (
    <div>
      <div className="row">
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
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
                    message: location.state.params.message,
                    severity: location.state.params.messageType,
                  });
                }}
              >
              </IconButton>
            }
          >
            {alert.message}
          </Alert>
        </Snackbar>
        <div className="col-md-12 paymentOrderDesktop">
          <PaymentHeader
            titlePage="Payments Due"
            secondColumn="Issue Date"
            thirdColumn="Due Date"
          />

          {!isReady ? (
            <div className="d-flex justify-content-center align-item-center mt-5">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          ) : paymentsDue?.length <= 0 ? (  
           <Card
            className="mt-1"
            style={{
              borderRadius: "3px",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              cursor: "pointer",
              padding: "35px",
            }}
          >         
            <div className="row text-center mt-5 mb-5">
              <div className="col-md-12">
                <img src="/images/Group 2403.png" alt="no payments to be made" />
                <p className="mt-4">
                  There are no payments to be made currently{" "}
                </p>
              </div>
            </div>
            </Card>
          ) : (
            <div className="row mb-1">
              {paymentsDue.map((payment, index) => {
                return (
                  <PaymentOrder
                    orderName={payment?.orderName}
                    paymentDate={moment(`${payment?.invoiceDate}`).format(
                      "Do MMMM YYYY"
                    )}
                    paymentDueDate={moment(`${payment?.dueDate}`).format(
                      "Do MMMM YYYY"
                    )}
                    action="Make Payment"
                    key={index}
                    orderItemId={payment?.id}
                    userAccountId={userAccountId}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="paymentOrderMobile">
            <div className="row mb-1">
              <TableContainer>
                <Table sx={{ minWidth: 650 }} className="paymentOrderTable">
                  <TableHead style={{ borderBottom: "0" }}>
                    <TableRow>
                      <StyledTableCell><b>Order Name</b></StyledTableCell>
                      <StyledTableCell align="left"><b>Issue Date</b></StyledTableCell>
                      <StyledTableCell align="left"><b>Due Date</b></StyledTableCell>
                      <StyledTableCell align="center"><b>Actions</b></StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentsDue.map((payment, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row" sx={{ maxWidth: 170 }}>
                            {payment?.orderName}
                          </TableCell>
                          <TableCell align="left">
                          {moment(`${payment?.invoiceDate}`).format("Do MMMM YYYY") === "Invalid date" ? `Not Provided` : moment(`${payment?.invoiceDate}`).format("Do MMMM YYYY") } 
                          </TableCell>
                          <TableCell align="left">
                          {moment(`${payment?.dueDate}`).format("Do MMMM YYYY") === "Invalid date" ? `Not Provided` : moment(`${payment?.dueDate}`).format("Do MMMM YYYY") } 
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              style={{
                                backgroundColor: "#2E405B",
                                color: "white",
                              }}
                              onClick={() => {
                                handlePaymentDueButtonClick(userAccountId,payment?.id);
                              }}
                            >
                              Make Payment
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div> 


      </div>

      {paymentsDue?.length <= 0 || lengthpage === 1 ? (
        ``
      ) : (
        <div className="d-flex justify-content-center mt-5 mb-5">
          <Pagination
            count={pageLength?.length}
            variant="outlined"
            page={pageNumber}
            onChange={handlePageChange}
            classes={{ ul: classes.ul }}
            color="white"
          />
        </div>
      )}
    </div>
  );
}

export default ClientPaymentDue;
