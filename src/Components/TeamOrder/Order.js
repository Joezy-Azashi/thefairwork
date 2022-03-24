import React, { useState } from "react";
import { Card, Button, Dialog, DialogContent } from "@material-ui/core";
import { mdiDeleteOutline, mdiStarOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { NavLink } from "react-router-dom";
import DeleteOrder from "./DeleteOrder";
import {recruiterRole} from "../../Services/userTypes"


function Order({ order, route }) {
  const [openDelete, setopenDelete] = useState(false);
  const [orderId, setorderId] = useState("");
  const [accountType, setaccountType] = useState(recruiterRole())

  const closeResetDia = () => {
    setopenDelete(false);
  };

  return (
    <div>
      <div className="col-md-12">
        <Card
          className="mt-1 mb-3"
          style={{
            borderRadius: "10px",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
            cursor: "pointer",
            padding: "18px",
          }}
        >
          <div className="d-flex justify-content-between">
            <div className="col-md-11" style={{ cursor: "pointer" }}>
              <NavLink
                to="/one-order"
                style={{ textDecoration: "none" }}
                onClick={() => {
                  localStorage.setItem("singleOrder", JSON.stringify(order));
                }}
              >
                <div>
                  <p className="bodyTitles mt-1">{order?.teamName.replaceAll("&amp;", "&")}</p>
                  <p style={{ color: "#2E405B" }} className="mb-0">
                    {
                      order.orderedBy === " " ? `` :  <span>Ordered By {order.orderedBy}</span>
                    }
                   <span>{order?.instantHire && 
                    <span style={{color:"#009E20"}} > <span>  {
                      order.orderedBy === " " ? `` :  <span>|</span>
                    }</span>
                        <Icon
                          path={mdiStarOutline}
                          color="#009E20"
                          title="Instant Hire"
                          size={0.8}
                          horizontal
                          vertical
                          rotate={180}
                          style={{marginBottom: "1px"}}
                        /> <span >Instant Hire</span>
                    </span>  
                  }</span>
                  </p>
                </div>
              </NavLink>
            </div>
            <div className="col-md-1 d-flex justify-content-end">
              {
                order.status !== "new" & accountType ? (
                  ``
                ) : (
                  <Icon
                  path={mdiDeleteOutline}
                  color="red"
                  title="Delete"
                  size={1.1}
                  horizontal
                  vertical
                  rotate={180}
                  className="team-action p-1"
                  onClick={() => {
                    setopenDelete(true);
                    setorderId(order?.id);
                  }}
                  style={{ cursor: "pointer" }}
                />
                )
              }
       
            </div>
          </div>
        </Card>
      </div>

      <div>
        <Dialog
          open={openDelete}
          onClose={closeResetDia}
          fullWidth
          maxWidth="xs"
          hideBackdrop
          className="dialogborder"
        >
          <DialogContent>
            <DeleteOrder
              closeResetDia={closeResetDia}
              orderId={orderId}
              apiUrl={route}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Order;
