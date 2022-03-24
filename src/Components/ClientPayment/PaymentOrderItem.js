import React from "react";
import { Grid } from "@material-ui/core";

function PaymentOrderItem({itemName, quantity, cost, total}) {
  return (
    <Grid
      container
      className="row d-flex"
      style={{
        height: "15px",
        justifyContent: "center",
        minHeight: "20px",
        alignItems: "center",
        marginRight: "0px",
        marginLeft: "0px",
      }}
    >
      <Grid item md={5} xs={5} className="col-md-4">
        <p
          style={{
           color: "#555555", 
           marginLeft: "10px",
          }}
        >
          {itemName}
        </p>
      </Grid>

      <Grid item md={2} xs={2} className="col-md-3 pageTitle">
        <p style={{color: "#555555"}}>
          {quantity}
        </p>
      </Grid>

      <Grid
        item
        md={2} xs={2}
        className="col-md-3 d-flex-start pageTitle"
        style={{ paddingLeft: "0px", color: "#555555" }}
      >
        <p>
          {`€${cost}`}
        </p>
      </Grid>

      <Grid
        item
        md={3} xs={3}
        className="col-md-2 pageTitle"
        style={{ paddingLeft: "0px" }}
      >
        <p style={{marginLeft: "30px", color: "#555555"}}>
        {`€${total}`}
        </p>
      </Grid> 
        
    </Grid>
    
  );
}

export default PaymentOrderItem;
