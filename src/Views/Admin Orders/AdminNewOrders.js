import React, {useState, useEffect} from "react";
import NewOrders from "../../Components/TeamOrders/NewOrders";
import InProcess from "../../Components/TeamOrders/InProcess";
import Completed from "../../Components/TeamOrders/Completed";
import Cancelled from "../../Components/TeamOrders/Cancelled";
import { Chip, Card } from "@mui/material";
import Icon from "@mdi/react";
import {
  mdiCheckCircleOutline,
  mdiPackageVariantClosed,
  mdiClockFast,
  mdiCloseCircleOutline,
} from "@mdi/js";
import Api from "../../Services/api";
import {recruiterRole} from "../../Services/userTypes"
import { getCurrentUser } from "../../Services/auth";
import { countNewContext } from "../../Services/context";

function AdminNewOrders() {

  const [accountType, setaccountType] = useState(recruiterRole())
  const [borderColor, setborderColor] = useState("#2E405B")
  const [newColor, setNewColor] = useState(false)
  const [inProcessColor, setInProcessColor] = useState(false)
  const [completedColor, setcompletedColor] = useState(false)
  const [cancelledColor, setcancelledColor] = useState(false)
  const [ordersCount, setordersCount] = useState()
  const [initialCount, setinitialCount] = useState(true)

  const [userAccountId, setuserAccountId] = useState(
    getCurrentUser()?.user?.UserProfile?.userAccountId
  );


  const getOrdersCount = async() => {
    const data = {
      userAccountId: accountType ? userAccountId : null,
    };
    Api().post('/team/status-counts', data)
    .then((response) => {
      setinitialCount(false)
      setordersCount(response.data.statusCounts)
    }).catch((error) => {
    })
  } 

  useEffect(() => {
    setNewColor(true)
    getOrdersCount()
  }, [])
  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <div className="row mb-4 mt-2">
            <div className="col-md-12 pageTitle">
              <h6>
                <b>Team</b>
              </h6>
            </div>
          </div>

          <div className="row mb-4 mt-2">
          <Card
            className="mb-3"
            style={{
              borderRadius: "4px",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
              padding: "0"
            }}
          >
            <nav>
              <div className="nav nav-tabs tabScrollMobile" id="nav-tab" role="tablist">
                <button
                  className="nav-link "
                  id="nav-new-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-new"
                  type="button"
                  role="tab"
                  aria-controls="nav-new"
                  aria-selected="true"
                  style={{ borderLeftColor: newColor ? `${borderColor}` : ``, borderRightColor: newColor ? `${borderColor}` : ``, borderTopColor: newColor ? `${borderColor}` : ``, background: newColor ? "#FFFFFF" : ``, borderBottomColor : newColor ? "white" : `` }}
                  onClick={() => {
                    setNewColor(true)
                    setInProcessColor(false)
                    setcompletedColor(false)
                    setcancelledColor(false)
                  }}
                >
                  <div className="d-flex justify-content-around">
                    <div>
                      <Icon
                        path={mdiPackageVariantClosed}
                        color="#2E405B"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <p  style={{margin: "6px", color: "#2E405B", fontFamily: "Segoe UI"}}>New</p>
                    </div>

                    <div>
                      <Chip label={initialCount ? `0` : ordersCount?.New} className="orderCount mt-1" size="small"  />
                    </div>
                  </div>
                </button>
                <button
                  className="nav-link "
                  id="nav-in-process-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-in-process"
                  type="button"
                  role="tab"
                  aria-controls="nav-in-process"
                  aria-selected="true"
                  style={{ borderLeftColor: inProcessColor ? `${borderColor}` : ``, borderRightColor: inProcessColor ? `${borderColor}` : ``, borderTopColor: inProcessColor ? `${borderColor}` : ``, background: inProcessColor ? "#FFFFFF" : ``, borderBottomColor : inProcessColor ? "white" : ``}}
                  onClick={() => {
                    setInProcessColor(true)
                    setcompletedColor(false)
                    setcancelledColor(false)
                    setNewColor(false)
                  }}
                >
                  <div className="d-flex justify-content-around">
                    <div>
                      <Icon
                        path={mdiClockFast}
                        color="#2E405B"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <p style={{margin: "6px", color: "#2E405B", fontFamily: "Segoe UI", whiteSpace: "nowrap"}}>In-process</p>
                    </div>

                    <div>
                      <Chip label={initialCount ? `0` : ordersCount?.InProcess}  className="orderCount mt-1" size="small" />
                    </div>
                  </div>
                </button>
                <button
                  className="nav-link "
                  id="nav-completed-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-completed"
                  type="button"
                  role="tab"
                  aria-controls="nav-completed"
                  aria-selected="false"
                  style={{ borderLeftColor: completedColor ? `${borderColor}` : ``, borderRightColor: completedColor ? `${borderColor}` : ``, borderTopColor: completedColor ? `${borderColor}` : ``, background: completedColor ? "#FFFFFF" : ``, borderBottomColor : completedColor ? "white" : ``}}
                  onClick={() => {
                    setcompletedColor(true)
                    setInProcessColor(false)
                    setcancelledColor(false)
                    setNewColor(false)
                  }}
                >
                  <div className="d-flex justify-content-around">
                    <div>
                      <Icon
                        path={mdiCheckCircleOutline}
                        color="#2E405B"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <p style={{margin: "6px", color: "#2E405B", fontFamily: "Segoe UI"}}>Completed</p>
                    </div>

                    <div>
                      <Chip label={initialCount ? `0` : ordersCount?.Completed}  className="orderCount mt-1" size="small" />
                    </div>
                  </div>
                </button>
                <button
                  className="nav-link "
                  id="nav-cancelled-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-cancelled"
                  type="button"
                  role="tab"
                  aria-controls="nav-cancelled"
                  aria-selected="false"
                  style={{ borderLeftColor: cancelledColor ? `${borderColor}` : ``, borderRightColor: cancelledColor ? `${borderColor}` : ``, borderTopColor: cancelledColor ? `${borderColor}` : ``, background: cancelledColor ? "#FFFFFF" : ``, borderBottomColor : cancelledColor ? "white" : ``}}
                  onClick={() => {
                    setcompletedColor(false)
                    setInProcessColor(false)
                    setcancelledColor(true)
                    setNewColor(false)
                  }}
                >
                  <div className="d-flex justify-content-around">
                    <div>
                      <Icon
                        path={mdiCloseCircleOutline}
                        color="#2E405B"
                        size={1}
                        horizontal
                        vertical
                        rotate={180}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <p style={{margin: "6px", color: "#2E405B", fontFamily: "Segoe UI"}}>Cancelled</p>
                    </div>

                    <div>
                      <Chip label={initialCount ? `0` : ordersCount?.Canceled}  className="orderCount mt-1" size="small" />
                    </div>
                  </div>
                </button>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div
                className="tab-pane fade show active"
                id="nav-new"
                role="tabpanel"
                aria-labelledby="nav-new-tab"
              >
                <countNewContext.Provider value={{ordersCount, setordersCount}}>
                    <NewOrders />
                </countNewContext.Provider>
                
              </div>
              <div
                className="tab-pane fade"
                id="nav-in-process"
                role="tabpanel"
                aria-labelledby="nav-in-process-tab"
              >

                  <countNewContext.Provider value={{ordersCount, setordersCount}}>
                      <InProcess />
                  </countNewContext.Provider>
                
              </div>
              <div
                className="tab-pane fade"
                id="nav-completed"
                role="tabpanel"
                aria-labelledby="nav-completed-tab"
              >

                <countNewContext.Provider value={{ordersCount, setordersCount}}>
                    <Completed />
                </countNewContext.Provider>
                
              </div>
              <div
                className="tab-pane fade"
                id="nav-cancelled"
                role="tabpanel"
                aria-labelledby="nav-cancelled-tab"
              >
                 <countNewContext.Provider value={{ordersCount, setordersCount}}>
                  <Cancelled />
                </countNewContext.Provider>
                
              </div>
            </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNewOrders;
