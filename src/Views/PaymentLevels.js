import { Payment } from "@material-ui/icons";
import React from "react";

import Filters from "../Components/PaymentLevels/Filters";


function PaymentLevels() {

  return (
    <div>
      <div className="row">
      <div className="col-md-12 pageTitle">
        <h6>
          <b>Payment Levels</b>
        </h6>
      </div>
      </div>
          <Filters />
    </div>
  );
}
export default PaymentLevels;
