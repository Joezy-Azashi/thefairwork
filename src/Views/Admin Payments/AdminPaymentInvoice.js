import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Api from "../../Services/api";
import { Card, Button} from "@material-ui/core";
import { ClipLoader } from "react-spinners";
import Pagination from "@material-ui/lab/Pagination";
import { getCurrentUser } from "../../Services/auth";
import PaymentOrder from "../../Components/ClientPayment/PaymentOrder";
import PaymentHeader from "../../Components/ClientPayment/PaymentHeader";
import moment from "moment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useHistory } from "react-router-dom";
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

function AdminPaymentInvoice() {
  const classes = usePageStyles();
  const [paidInvoices, setPaidInvoices] = useState([]);
  const [pageLength, setpageLength] = useState(1);
  const [pageNumber, setpageNumber] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [userAccountId, setuserAccountId] = useState(
    getCurrentUser()?.user?.UserProfile?.userAccountId
  );
  const [lengthpage, setLengthpage] = useState(0);
  const history = useHistory();
  

  const clientGetOrders = async (pageNumberSelected = 1) => {
      let responseData;
    const data = {
        "isPaid": true,
    };
    Api()
      .post(
        `/admin/get-all-paymentInvoice/${pageNumberSelected}`, data
      )
      .then((response) => {
        setIsReady(true);
        setPaidInvoices(response?.data?.result?.data);
        setpageLength(response?.data?.result?.pages?.length);
        setLengthpage(response?.data?.result?.lastPage);
      })
      .catch((error) => {});
  };

  const handlePageChange = async (event, value) => {
    setpageNumber(value);
    await clientGetOrders(value);
  };

  const handlePaymentDueButtonClick = (orderItemId, userAccountId) => {
    localStorage.setItem("orderId", userAccountId);
      history.push("/client-invoice", {
        params: orderItemId,
        makePay: false,
        action: "isPaid",
      });
    
  };


  useEffect(() => {
    clientGetOrders();
    localStorage.setItem("saveBtnDisabled", true);
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-md-12 paymentOrderDesktop">
          <PaymentHeader titlePage="Completed Payments" secondColumn="Issue Date" thirdColumn="Payment Date"/>

          {!isReady ? (
            <div className="d-flex justify-content-center align-item-center mt-5">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          ) : paidInvoices?.length <= 0 ? (
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
                There are no invoices currently{" "}
                </p>
              </div>
            </div>
             </Card>
          ) : (
            <div className="row mb-1">
              {paidInvoices.map((invoice, index) => {
                return (
                  <PaymentOrder
                    orderName={invoice?.orderName}
                    paymentDate={moment(`${invoice?.paymentDate}`).format('Do MMMM YYYY')}
                    paymentDueDate={moment(`${invoice?.dueDate}`).format('Do MMMM YYYY')}
                    action="View Invoice"
                    key={index}
                    orderItemId={invoice?.id}
                    userAccountId ={ userAccountId}
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
                    {paidInvoices.map((invoice, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row" sx={{ maxWidth: 170 }}>
                            {invoice?.orderName}
                          </TableCell>
                          <TableCell align="left">
                          {moment(`${invoice?.paymentDate}`).format("Do MMMM YYYY") === "Invalid date" ? `Not Provided` : moment(`${invoice?.paymentDate}`).format("Do MMMM YYYY") } 
                          </TableCell>
                          <TableCell align="left">
                            {moment(`${invoice?.dueDate}`).format("Do MMMM YYYY") === "Invalid date" ? `Not Provided` : moment(`${invoice?.dueDate}`).format("Do MMMM YYYY") } 
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              style={{
                                backgroundColor: "#2E405B",
                                color: "white",
                              }}
                              onClick={() => {
                                handlePaymentDueButtonClick(invoice?.id, userAccountId);
                              }}
                            >
                              View Invoice
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

      {paidInvoices?.length <= 0 || lengthpage === 1 ? (
        ``
      ) : (
        <div className="d-flex justify-content-center mt-5 mb-5">
          <Pagination
            count={pageLength}
            variant="outlined"
            page={pageNumber}
            onChange={handlePageChange}
            classes={{ ul: classes.ul }}
            color="primary"
          />
        </div>
      )}
    </div>
  );
}

export default AdminPaymentInvoice;
