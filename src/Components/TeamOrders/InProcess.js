import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, InputAdornment, Button, Card } from "@mui/material";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import Api from "../../Services/api";
import { ClipLoader } from "react-spinners";
import Order from "../TeamOrder/Order";
import Pagination from "@material-ui/lab/Pagination";
import { getCurrentUser } from "../../Services/auth";
import {recruiterRole} from "../../Services/userTypes"
import { countNewContext } from "../../Services/context";

const usePageStyles = makeStyles(() => ({
  ul: {
    "& .Mui-selected": {
      color: "#ffff",
      backgroundColor: "#2E405B",
    },
  },
}));

function InProcess() {
  const classes1 = usePageStyles();
  const [accountType, setaccountType] = useState(recruiterRole())
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [pageLength, setpageLength] = useState([]);
  const [pageNumber, setpageNumber] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [inProcess, setinProcess] = useState("in-process");
  const [lengthpage, setLengthpage] = useState([]);
  const { ordersCount, setordersCount } = useContext(countNewContext);

  const [userAccountId, setuserAccountId] = useState(
    getCurrentUser()?.user?.UserProfile?.userAccountId
  );

  const getOrders = async (pageNumberSelected = 1) => {
    const data = {
      name: query,
    };
    Api()
      .post(`/team/get-orders/${inProcess}/${pageNumberSelected}`, data)
      .then((response) => {
        setIsReady(true);
        setOrders(response?.data?.data);
        setpageLength(response?.data?.pages);
        setLengthpage(response?.data);
        const newCounts = ordersCount
        newCounts['InProcess'] = response?.data.count
        setordersCount(newCounts)
      })
      .catch((error) => {});
  };

  const clientGetOrders = async (pageNumberSelected = 1) => {
    const data = {
      name: query,
    };
    Api()
      .post(
        `/team/get-orders/${inProcess}/${userAccountId}/${pageNumberSelected}`,
        data
      )
      .then((response) => {
        setIsReady(true);
        setOrders(response?.data?.data);
        setpageLength(response?.data?.pages);
        setLengthpage(response?.data);
        const newCounts = ordersCount
        newCounts['InProcess'] = response?.data.count
        setordersCount(newCounts)
      })
      .catch((error) => {});
  };

  const handlePageChange = async (event, value) => {
    setpageNumber(value);
    await getOrders(value);
    accountType ? await clientGetOrders(value) :  await getOrders(value);
  };

  useEffect(() => {
    accountType ? clientGetOrders() : getOrders();
    localStorage.setItem("saveBtnDisabled", true);
  }, []);

  return (
    <div>
      <div className="row mt-5">
        <div className="col-md-12 post-job-card">

          <div className="row mb-4">
            <div className="col-md-10 mb-3">
              <TextField
                id="search"
                label="Search team name"
                type="search"
                variant="outlined"
                value={query}
                size="small"
                fullWidth
                className="allJobsSearchPlaceholder"
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                style={{ backgroundColor: "white" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon
                        path={mdiMagnify}
                        size={1}
                        horizontal
                        vertical
                        color="#808080"
                        rotate={180}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="col-md-2">
              <Button
                variant="contained"
                className="searchOrderBtn w-100"
                onClick={() => {
                  getOrders();
                }}
              >
                Search
              </Button>
            </div>
          </div>

          {!isReady ? (
            <div className="d-flex justify-content-center align-item-center mt-5">
              <ClipLoader size={40} color="#1b98e0" loading />
            </div>
          ) : orders.length <= 0 ? (
            <div className="row text-center">
            <div className="col-md-12 mt-4">
              <img src="/images/Group 2678.svg" alt="no job posted" width="230" />
              <div className="d-flex justify-content-center align-item-center mt-5">
              <p>There are no orders in process on the platform currently.</p>
            </div>
            </div>
          </div>
          ) : (
            <div className="row mb-4">
              {orders.map((order, index) => {
                return (
                  <Order
                    order={order}
                    key={index}
                    route="/orders-in-process"
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      {orders?.length <= 0 || lengthpage.lastPage === 1 ? (
        ``
      ) : (
        <div className="d-flex justify-content-center mt-5 mb-5">
          <Pagination
            count={pageLength?.length}
            variant="outlined"
            page={pageNumber}
            onChange={handlePageChange}
            classes={{ ul: classes1.ul }}
            color="primary"
          />
        </div>
      )}
    </div>
  );
}

export default InProcess;
